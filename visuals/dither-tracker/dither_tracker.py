#!/usr/bin/env python3
"""Dither-tracker look: blue grade, coarse colour dither, tracking HUD.

Usage:
    python3 dither_tracker.py input.mp4 output.mp4 [--pixel 2] [--points 6] [--seed 7]

Needs: ffmpeg on PATH, `pip install opencv-python-headless numpy`.

How it works (three layers, as in the reference clip):
  1. Grade   - luminance mapped onto a navy -> royal blue -> ice -> white ramp;
               warm areas (orange, red, pink) keep their own hue, pushed hotter.
  2. Dither  - frame shrunk by --pixel, a little grain added, then
               Floyd-Steinberg error diffusion onto a fixed 12-colour palette
               (ffmpeg paletteuse), scaled back up with hard pixel edges.
  3. HUD     - feature points tracked with optical flow; each gets dotted
               guide lines, a white "#NN" tag and a short motion trail.
"""
import argparse, os, random, subprocess, sys, tempfile
import cv2
import numpy as np

# Palette (RGB). Edit to change the look.
PALETTE = [
    "05061a", "0c1460", "1a2fb8", "2f5fe0", "4f86e8", "57d0ee",
    "a8c8f4", "f2f5ff", "f26a1c", "b8361c", "f2a6c4", "8a3c9c",
]
# Grade ramp (RGB, dark -> light) used for the non-warm areas.
RAMP = [(0.00, "03041a"), (0.25, "101c8a"), (0.50, "3561d4"),
        (0.75, "9dbdf0"), (1.00, "ffffff")]


def hex2rgb(h):
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32)


def build_lut():
    xs = np.linspace(0, 1, 256)
    stops = [s for s, _ in RAMP]
    cols = np.stack([hex2rgb(c) for _, c in RAMP])
    return np.stack([np.interp(xs, stops, cols[:, k]) for k in range(3)], 1)


LUT = build_lut()  # 256 x 3 RGB
GRAIN = 0.07      # grain strength (0 = clean dither)
LIFT = 0.15       # shadow lift (0 = true black)


def grade(bgr):
    f = bgr.astype(np.float32) / 255
    lum = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
    # contrast S-curve and slight lift so highlights blow out like the reference
    lum = np.clip((lum - 0.5) * 1.35 + 0.55, 0, 1)
    lum = lum * lum * (3 - 2 * lum)
    lum = LIFT + lum * (1 - LIFT)   # lift shadows to mid-blue like the reference
    # grain on brightness only, so the dither throws blue/cyan specks, not orange
    lum = np.clip(lum + np.random.normal(0, GRAIN, lum.shape).astype(np.float32), 0, 1)
    blue = LUT[(lum * 255).astype(np.uint8)][..., ::-1] / 255  # to BGR
    # warm mask: hue in red/orange/pink and enough saturation
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
    h, s = hsv[..., 0], hsv[..., 1] / 255
    warm_h = ((h < 25) | (h > 150)).astype(np.float32)
    warm = np.clip((s - 0.25) * 3, 0, 1) * warm_h
    warm = cv2.GaussianBlur(warm, (0, 0), 3)[..., None]
    hot = np.clip((f - 0.5) * 1.4 + 0.55, 0, 1)
    hot[..., 2] = np.clip(hot[..., 2] * 1.25, 0, 1)   # push red
    hot[..., 0] *= 0.7                                # pull blue
    out = blue * (1 - warm) + hot * warm
    return (np.clip(out, 0, 1) * 255).astype(np.uint8)


def ffprobe_fps(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                        "-show_entries", "stream=r_frame_rate", "-of",
                        "default=nw=1:nk=1", path], capture_output=True, text=True)
    n, d = r.stdout.strip().split("/")
    return float(n) / float(d)


def has_audio(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a",
                        "-show_entries", "stream=index", "-of", "csv=p=0", path],
                       capture_output=True, text=True)
    return bool(r.stdout.strip())


def stage_dither(src, tmp_out, pixel, tmpdir):
    """Grade in Python, dither + upscale in ffmpeg. Writes a near-lossless temp file."""
    cap = cv2.VideoCapture(src)
    W, H = int(cap.get(3)), int(cap.get(4))
    fps = ffprobe_fps(src)
    w, h = W // pixel, H // pixel
    pal = os.path.join(tmpdir, "palette.png")
    cols = np.stack([hex2rgb(c) for c in PALETTE])[..., ::-1].astype(np.uint8)
    cols = np.resize(cols, (256, 3))  # paletteuse wants exactly 256 entries
    cv2.imwrite(pal, cols.reshape(16, 16, 3))
    ff = subprocess.Popen([
        "ffmpeg", "-v", "error", "-y",
        "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{w}x{h}", "-r", str(fps), "-i", "-",
        "-i", pal,
        "-filter_complex",
        f"[0:v]null[n];[n][1:v]paletteuse=dither=floyd_steinberg,"
        f"scale={W}:{H}:flags=neighbor",
        "-c:v", "libx264", "-crf", "8", "-preset", "veryfast", "-pix_fmt", "yuv444p",
        tmp_out], stdin=subprocess.PIPE)
    while True:
        ok, fr = cap.read()
        if not ok:
            break
        small = cv2.resize(fr, (w, h), interpolation=cv2.INTER_AREA)
        ff.stdin.write(grade(small).tobytes())
    ff.stdin.close()
    ff.wait()
    return W, H, fps


def dotted_line(img, p0, p1, color, gap=4):
    p0, p1 = np.array(p0, float), np.array(p1, float)
    n = int(np.linalg.norm(p1 - p0) // gap)
    for i in range(n):
        x, y = (p0 + (p1 - p0) * i / max(n, 1)).astype(int)
        if 0 <= y < img.shape[0] and 0 <= x < img.shape[1]:
            img[y, x] = color


def tag(img, x, y, text, scale):
    font = cv2.FONT_HERSHEY_PLAIN
    fs = 0.7 * scale
    (tw, th), _ = cv2.getTextSize(text, font, fs, 1)
    pad = int(2 * scale)
    x0, y0 = int(x), int(y)
    cv2.rectangle(img, (x0, y0 - th - pad), (x0 + tw + 2 * pad, y0 + pad), (250, 250, 250), -1)
    cv2.putText(img, text, (x0 + pad, y0), font, fs, (40, 30, 20), 1, cv2.LINE_AA)


def stage_hud(src, dithered, out, W, H, fps, n_points, seed):
    rnd = random.Random(seed)
    scale = min(W, H) / 720
    cap_src, cap_d = cv2.VideoCapture(src), cv2.VideoCapture(dithered)
    tmp_video = out + ".noaudio.mp4"
    ff = subprocess.Popen([
        "ffmpeg", "-v", "error", "-y",
        "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(fps), "-i", "-",
        "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p",
        tmp_video], stdin=subprocess.PIPE)
    prev, pts, ids, trails = None, None, [], []
    lk = dict(winSize=(21, 21), maxLevel=3,
              criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 20, 0.03))
    white = (245, 245, 245)
    frame_i = 0
    while True:
        ok1, fr = cap_src.read()
        ok2, d = cap_d.read()
        if not (ok1 and ok2):
            break
        gray = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY)
        if pts is not None and len(pts):
            nxt, st, _ = cv2.calcOpticalFlowPyrLK(prev, gray, pts, None, **lk)
            keep = st.ravel() == 1
            pts = nxt[keep]
            ids = [i for i, k in zip(ids, keep) if k]
            trails = [t + [tuple(p.ravel())] for t, p, k in
                      zip([t for t, k in zip(trails, keep) if k], pts, [True] * len(pts))]
        # top up / occasionally reshuffle so the overlay keeps moving
        if pts is None or len(pts) < n_points or frame_i % int(fps * 2) == 0:
            mask = np.full_like(gray, 255)
            if pts is not None:
                for p in pts:
                    cv2.circle(mask, tuple(int(v) for v in p.ravel()), int(60 * scale), 0, -1)
            new = cv2.goodFeaturesToTrack(gray, n_points * 3, 0.05, int(80 * scale), mask=mask)
            if new is not None:
                need = n_points - (0 if pts is None else len(pts))
                if frame_i % int(fps * 2) == 0 and pts is not None and len(pts):
                    # swap one old point for a new one
                    drop = rnd.randrange(len(pts))
                    pts = np.delete(pts, drop, 0); ids.pop(drop); trails.pop(drop)
                    need += 1
                new = new[:max(need, 0)]
                pts = new if pts is None or not len(pts) else np.concatenate([pts, new])
                ids += [rnd.randint(10, 299) for _ in new]
                trails += [[tuple(p.ravel())] for p in new]
        prev = gray
        hud = d.copy()
        for pid, p, tr in zip(ids, pts if pts is not None else [], trails):
            x, y = p.ravel()
            dotted_line(hud, (x, 0), (x, H), white, gap=max(2, int(3 * scale)))
            dotted_line(hud, (0, y), (W, y), white, gap=max(2, int(3 * scale)))
            tail = np.array(tr[-10:], np.int32)
            if len(tail) > 1:
                cv2.polylines(hud, [tail], False, white, max(1, int(scale)), cv2.LINE_AA)
            c = int(4 * scale)
            cv2.line(hud, (int(x) - c, int(y)), (int(x) + c, int(y)), white, 1)
            cv2.line(hud, (int(x), int(y) - c), (int(x), int(y) + c), white, 1)
            tag(hud, x + 8 * scale, y - 8 * scale, f"#{pid}", scale)
        # guide lines read as thin and half-transparent
        frame = cv2.addWeighted(hud, 0.85, d, 0.15, 0)
        ff.stdin.write(frame.tobytes())
        frame_i += 1
    ff.stdin.close()
    ff.wait()
    # mux original audio back in, if any
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", tmp_video]
    if has_audio(src):
        cmd += ["-i", src, "-map", "0:v", "-map", "1:a", "-c:a", "copy", "-shortest"]
    cmd += ["-c:v", "copy", "-movflags", "+faststart", out]
    subprocess.run(cmd, check=True)
    os.remove(tmp_video)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("input")
    ap.add_argument("output")
    ap.add_argument("--pixel", type=int, default=2, help="dither cell size in px (2 = reference)")
    ap.add_argument("--points", type=int, default=5, help="number of tracked points")
    ap.add_argument("--seed", type=int, default=7, help="random seed for tag numbers")
    ap.add_argument("--grain", type=float, default=0.07, help="grain strength, 0-0.2")
    ap.add_argument("--lift", type=float, default=0.15, help="shadow lift, 0-0.4")
    a = ap.parse_args()
    global GRAIN, LIFT
    GRAIN, LIFT = a.grain, a.lift
    with tempfile.TemporaryDirectory() as td:
        tmp = os.path.join(td, "dithered.mp4")
        W, H, fps = stage_dither(a.input, tmp, a.pixel, td)
        stage_hud(a.input, tmp, a.output, W, H, fps, a.points, a.seed)
    print("wrote", a.output)


if __name__ == "__main__":
    sys.exit(main())

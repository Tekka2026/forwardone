# Visuals

Notes on the files in `public/visuals/`, served as they are under `/forwardone/visuals/`.

- `forward-wordmark*.svg`: the FWD ↔ FORWARD wordmark animations, generated
  by `node visuals/forward-wordmark/build.mjs` (do not edit by hand).
- `munich-flyover-2.mp4` and `.jpg` (second version, 2026-11-16): the aerial flyover on the Munich Insights
  card (owner, 2026-11-16), played with the scroll by
  `src/components/visuals/ScrollVideo.astro`. Encoded for seeking from the
  supplied 1080 × 1920 file: scaled to 720 wide, cropped to the card's 5:7
  (720 × 1008, centred), a keyframe every 6th frame (a quarter second) and
  no B-frames, no sound, fast start. Re-encoded 2026-11-18 (owner, page
  weight): 2.0 MB instead of 4.9 MB with every frame a keyframe, at the same
  or better quality (SSIM 0.83 against 0.79); a jump decodes at most five
  extra frames, which the scroll easing hides.

  ```
  ffmpeg -i in.mp4 -an -vf "scale=720:-2,crop=720:1008" -c:v libx264 -preset slow \
    -crf 30 -g 6 -keyint_min 6 -bf 0 -pix_fmt yuv420p -movflags +faststart munich-flyover-2.mp4
  ffmpeg -i munich-flyover-2.mp4 -vf "select=eq(n\,0)" -frames:v 1 -q:v 5 munich-flyover-2.jpg
  ```
- `munich-skyline.jpg` (2026-11-19): the Munich Insights card, the skyline
  with the Alps (photo by Julian Ostarek, unsplash.com/@jlnstrk, credited
  on the card). Supplied 1125 × 2000 at 350 KB; recompressed with mozjpeg
  at quality 76 (148 KB, progressive), same size. It replaced the dithered
  flyover tried on 2026-11-18 (8.9 MB; its files were removed, the tool
  that makes such videos is `visuals/dither-tracker/`).
- `intro-film.mp4`, `intro-film-720.mp4` and `intro-film.jpg` (2026-11-18):
  the background film of the homepage intro (owner). For now a 34-second
  cut of ASML's brand film (by Wolfstreet), supplied by the owner in
  1920 × 1080, for the password-protected preview only (A0044). Sound
  removed; 1080p (5.4 MB) for screens wider than 900px, 720p (2.7 MB) for
  phones; the first frame (black, the film fades in) as the poster:

  ```
  ffmpeg -i in.mp4 -an -c:v libx264 -preset slower -crf 30 -profile:v high \
    -pix_fmt yuv420p -g 50 -movflags +faststart intro-film.mp4
  ffmpeg -i in.mp4 -an -vf scale=1280:-2 -c:v libx264 -preset slower -crf 29 -profile:v high \
    -pix_fmt yuv420p -g 50 -movflags +faststart intro-film-720.mp4
  ffmpeg -i intro-film.mp4 -frames:v 1 -vf scale=1280:-2 -q:v 5 intro-film.jpg
  ```

## Dither Track (`public/tools/dither-track/`, 2026-11-19)

A one-file browser tool (no build step, nothing uploaded: files stay on the
device) that puts the look of the owner's reference clip on any video or
image, live at `/forwardone/tools/dither-track/` behind the site password.
Its defaults are measured from that clip (720 × 1280, 24 fps; the clip
itself is not in the repository):

- Dither: every colour channel is on or off (eight colours), error
  diffusion, 2px dots at 720 wide, with noise added before the dither and
  renewed every frame, less of it in pure black and white.
- Palette: brightness mapped onto black, navy `#0d0c32`, steel blue
  `#3a5681`, pale blue `#9fb6e0`, white; an accent (purple, orange
  `#ff5a14`, pink) where the source is warm, in a brightness band, or as a
  glow around the tracked item.
- Overlays: boxes around dark and bright areas with thin lines that run on
  toward the frame edges, dotted verticals, plus marks and `#number` tags.
- Tracking: click one item; it is followed by template matching and drawn
  as a ring with a trail.
- Output: "Record video" plays the source once and saves MP4 (WebM where
  the browser has no MP4 recorder); "Save PNG" saves the frame.

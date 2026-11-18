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
- `intro-film.mp4` and `.jpg` (2026-11-18): the background film of the
  homepage intro (owner). For now ASML's brand film (by Wolfstreet), for
  the password-protected preview only (A0044). From the supplied
  640 × 360 file: sound removed, cut at 73.6 s before the ASML end card,
  first frame as the poster:

  ```
  ffmpeg -i in.mp4 -t 73.6 -an -c:v libx264 -preset slower -crf 28 -profile:v high \
    -pix_fmt yuv420p -g 50 -movflags +faststart intro-film.mp4
  ffmpeg -i intro-film.mp4 -frames:v 1 -q:v 4 intro-film.jpg
  ```

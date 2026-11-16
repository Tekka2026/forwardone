# Visuals

Notes on the files in `public/visuals/`, served as they are under `/forwardone/visuals/`.

- `forward-wordmark*.svg`: the FWD ↔ FORWARD wordmark animations, generated
  by `node visuals/forward-wordmark/build.mjs` (do not edit by hand).
- `munich-flyover.mp4` and `.jpg`: the aerial flyover on the Munich Insights
  card (owner, 2026-11-16), played with the scroll by
  `src/components/visuals/ScrollVideo.astro`. Encoded for seeking from the
  supplied 1080 × 1920 file: scaled to 720 wide, cropped to the card's 5:7
  (720 × 1008, centred), every frame a keyframe, no sound, fast start:

  ```
  ffmpeg -i in.mp4 -an -vf "scale=720:-2,crop=720:1008" -c:v libx264 -preset slow \
    -crf 27 -g 1 -keyint_min 1 -pix_fmt yuv420p -movflags +faststart munich-flyover.mp4
  ffmpeg -i munich-flyover.mp4 -vf "select=eq(n\,0)" -frames:v 1 -q:v 5 munich-flyover.jpg
  ```

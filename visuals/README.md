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

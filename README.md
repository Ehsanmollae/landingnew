# Landing / Portfolio

Bilingual (Persian RTL / English LTR) personal portfolio built with React, Vite and Tailwind CSS.

## Development

```bash
npm install
npm run dev      # http://localhost:5173/landingnew/
npm run build    # output in dist/
```

## Personalize

All text, links and skills live in `src/content.js`. Edit the `fa` and `en` objects and the `links` / `skills` exports.

## Cats

The hero background is a video of cats that is scrubbed by the mouse's horizontal position, so the cats appear to follow the cursor, plus short reaction clips for clicks, fast scrolling and section changes.
Until `public/cats/look.mp4` exists, SVG placeholder cats are shown. How to make the videos: `docs/cats-video-guide.md`. Settings: `src/cats/cats.config.js`.

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push.
One-time setup: **Settings → Pages → Source: GitHub Actions**.
Site URL: `https://ehsanmollae.github.io/landingnew/`

If the repository is renamed, update `base` in `vite.config.js`.

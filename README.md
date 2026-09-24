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

Three hand-animated cats (black, orange, white; 12 four-frame animations each, built from `art/frames` by `scripts/build-frames.py`) roam the whole page: they chase a laser dot that follows the mouse, sit on section edges and ride along while scrolling, knock skill chips off, hide in the contact "box", walk across the hero text, purr when petted, and nap when you go idle.
Behaviors and tuning: `docs/cats.md` and `src/cats/cats.config.js`. Fonts are self-hosted (no CDN).

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push.
One-time setup: **Settings → Pages → Source: GitHub Actions**.
Site URL: `https://ehsanmollae.github.io/landingnew/`

If the repository is renamed, update `base` in `vite.config.js`.

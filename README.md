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

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push.
One-time setup: **Settings → Pages → Source: GitHub Actions**.
Site URL: `https://ehsanmollae.github.io/landingnew/`

If the repository is renamed, update `base` in `vite.config.js`.

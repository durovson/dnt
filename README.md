# JAMMM Tip Profile

Mobile-first React/Vite profile page with a Telegram-style `Tip me` bottom sheet.

## GitHub Pages

The project uses `base: "./"` so the same production build works both at a GitHub Pages project path such as `/dnt/` and on the future custom domain `is.a-dev`.

In GitHub repository settings use **Settings → Pages → Source: GitHub Actions**.

Build locally:

```bash
npm install
npm run build
npm run preview
```

The deploy workflow in `.github/workflows/deploy.yml` builds `dist/` and deploys it to GitHub Pages.

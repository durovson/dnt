# JAMMM — Tip me profile

Mobile-first Telegram-style profile with a `Tip me` bottom sheet, built with React + Vite and the supplied `@telegram-tools/ui-kit` source archive.

## Included UI Kit components

The app uses the supplied UI Kit source directly from `vendor/telegram-ui-kit` (including its tokens, theme variables, icons, and the patched Sheet touch target):

- `ThemeProvider`
- `Button`
- `Input`
- `Image`
- `Sheet`
- `Text`
- `Icon`

`Avatar`, `Card`, `Tabs`, and the currency selector are composed locally on top of the same UI Kit tokens and components because the supplied archive does not expose those names as standalone components.

## Assets

Profile media and token icons live in `public/assets/` so the React code does not contain embedded images. Replace these files when connecting real profile data:

- `profile-bg.svg` — monochrome background placeholder
- `avatar.svg` — avatar placeholder
- `gram.svg` — GRAM token icon
- `usdt.svg` — USDT token icon
- `tip-pattern.svg` — subtle gaming icon pattern

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## GitHub Pages / is.a-dev

The repo includes `public/CNAME` with `is.a-dev` and a GitHub Actions workflow in `.github/workflows/deploy.yml`.

In GitHub, enable **Settings → Pages → Source: GitHub Actions**. Then point the `is.a-dev` DNS record at your GitHub Pages deployment according to your GitHub account/repository setup.

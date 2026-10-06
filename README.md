# JAMMM Tip Profile

Mobile-first Telegram-inspired donation profile for `is.a-dev` / GitHub Pages.

## Features

- Telegram-style dark profile with avatar, handle, Channel, About and Tip me actions.
- `Tip me` bottom sheet with GRAM / USDT on TON selection.
- Preset amounts `5 / 10 / 25 / Custom`.
- Custom amount input with stable local state.
- Drag-to-close bottom sheet on touch/pointer devices.
- Desktop sheet rendered as a centered adaptive card instead of a full-width panel.
- TON payment links for GRAM and USDT on TON.
- Receiver: `UQDlmQfncLTHp_ceI6gz8eA19wQ2cia9ysskYO-ZA1IANpDx`.
- GitHub Pages deployment via `.github/workflows/deploy.yml`.

## Links

- Channel: https://t.me/devofnot
- About: https://notcollective.is-a.dev

## Token icons

The live token icons are loaded from public STON.fi asset URLs referenced by the public `kanalabs/token-lists` TON token list. Local SVGs remain as visual fallbacks if an external icon cannot be loaded.

- Public token list: https://github.com/kanalabs/token-lists/blob/main/ton.json
- GRAM asset: https://asset.ston.fi/img/EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c/c8d21a3d93f9b574381e0a8d8f16d48b325dd8f54ce172f599c1e9d6c62f03f7
- USDT on TON asset: https://asset.ston.fi/img/EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs/1a87edfee9a28b05578853952e5effb8cc30af1e0fb90043aa2ce19dce490849

## Payment links

The mobile flow uses the interoperable `ton://transfer/...` payment scheme. Desktop uses the equivalent Tonkeeper HTTPS transfer URL. GRAM uses 9 decimals; USDT on TON uses 6 decimals.

## Build

```bash
npm install
npm run build
npm run preview
```

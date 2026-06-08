# BusPass Kiosk — Hi-fi Prototype

Interactive hi-fi prototype for the **BusPass** smart bus station kiosk (HCI course). Seven screens aligned with user research: visual map mode, senior-friendly list mode, route detail, QR handoff to mobile, help center, and accessibility tools.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`). **Kiosk A/B test:** open `/` — dark bezel frame, screensaver, 6 UI variants. **Admin:** `/admin` (PIN `2025`) or triple-tap top-right corner. See **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** for full moderator instructions.

## Deploy on Vercel

1. Push this repo to GitHub ([hci_buspass](https://github.com/Quangthelord/hci_buspass)).
2. Open [vercel.com/new](https://vercel.com/new) → **Import** the repository.
3. Vercel auto-detects **Vite** — keep defaults:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click **Deploy**.

`vercel.json` already configures SPA routing (all paths → `index.html`) and cache headers for static assets.

**CLI (optional):**

```bash
npm i -g vercel
vercel
```

Production URL will look like `https://hci-buspass.vercel.app`. Share `/`, `/map`, `/list`, etc. — deep links work after deploy.

**QR handoff (2 devices):** Kiosk `/qr` shows a URL like `/m?r=19&d=miendong&lang=vi`. Scan with phone camera → opens trip details on mobile → continue to `/app/*` journey phases.

## Screen map

| Route | Screen |
|-------|--------|
| `/` | Home — language selection |
| `/mode` | Mode selection (map vs list) |
| `/map` | Interactive map + destination panel |
| `/list` | Large-type route list |
| `/route/:id` | Route detail + stops |
| `/qr` | QR sync to phone |
| `/m` | **Mobile trip details** (after QR scan — `?r=&d=&lang=`) |
| `/app` | Mobile hub — haptic journey phases |
| `/trip` | Trip planner A→B (fast / cheap / few transfers) |
| `/services` | Station amenities & quick support |
| `/help` | Help center (6 topics) |
| `/accessibility` | High contrast, TTS, voice, zoom |

See [docs/PRODUCT_LAYERS.md](docs/PRODUCT_LAYERS.md) for the 3-layer product map (Information · Decision · Assistance).

**HCI report demos:** [docs/HCI_SOLUTIONS.md](docs/HCI_SOLUTIONS.md) — E-ink kiosk (`/eink`), haptic QR (`/qr`), NFC pay (`/pay`), risk critique (`/hci`).

## Features (prototype)

- User-friendly design: **white + green** palette, Inter font, soft shadows
- Mock routes & destinations (HCMC — Lê Lợi / Nguyễn Huệ station)
- **Real map** (OpenStreetMap via Leaflet + Carto dark tiles), centered on Lê Lợi – Nguyễn Huệ
- Simulated live bus movement on map (GPS mock)
- 60s idle auto-reset to home
- 3-minute QR screen countdown
- i18n: Vietnamese, English, Chinese, Korean
- Accessibility: high contrast, large text, magnifier, screen reader (Web Speech API), voice search (Chrome)

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4, React Router, qrcode.react, Lucide icons.

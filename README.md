# CYBERLEEK OS

A Windows-XP-style interactive web desktop for the **CYBERLEEK** movement (GTA 6 leak era).
Same concept as the classic "HODL Desktop", rebuilt for the leek lore.

## Run

```bash
node server.mjs 5939
# → http://localhost:5939
```

Zero dependencies (Node 18+). Data persists to `data/*.json`.

## What's inside

| Area | Details |
|---|---|
| Shell | Boot screen, desktop icons (drag/select/context menu), window manager (drag/resize/minimize/maximize, touch support), taskbar with frozen clock (9/18/2022 4:26 AM — leak night), XP start menu, live announcements ticker, buy-$LEEK popup |
| Apps (16) | My LEEK · Leek Explorer (mirror hub) · LEEKpad (the Edict) · LEAK Mail (parody corpo leaks) · Leak Gallery (real archived map images + video mirrors) · $LEEK Chart (TBA state, dexscreener-ready) · LEEK Terminal (commands + secrets) · Poll Booth (on-chain poll snapshot + live voting) · Announcements feed · LeekChat (server-backed) · /leek/ Board (server-backed forum) · Killed Games bin · LEAKsweeper · Solitaire · Corpo Breakout · About |
| Easter egg | Terminal `follow rabbit` → riddle (2022×9×18) → key `V1CEC1TY` in Explorer address bar → clear Breakout level 1 → reward window |
| Backend API | `/api/config` `/api/leeks` (16 real leaks + mirrors) `/api/polls` (3 real polls incl. live one) `/api/announcements` `/api/chat` GET+POST `/api/forum` threads/replies `/api/poll/:id/vote` `/api/health` |
| Static SEO | `/about.html` (full Edict + JSON-LD) `/leeks.html` (archive) `/token.html` ($LEEK, CA TBA) `/faq.html` (FAQPage schema) privacy, terms, robots.txt, sitemap.xml |

## Token

`$LEEK` contract address is intentionally **TBA** — set `ca` and `buyUrl` in `CONFIG` inside `server.mjs` (or `/api/config` response) and the Chart app, buy popup and token page light up automatically. No other token is promoted anywhere.

## Content sources

Lore, palette and mascot from cyberleek.fortflip.xyz. Leak titles/mirror links/polls mirror the live on-chain CYBERLEEK archive (decoded from program `7rAgHPLDc9NryZmNdeEzyDui6D9PHkvTxMjKhNSa7w3a`). Full map + sneak-peek images archived locally in `public/assets/`.

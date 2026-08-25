# CYBERLEEK OS — App Developer Contract

Vanilla ES modules. No frameworks, no build step. All files under `public/`.

## Imports available

```js
import { createWindow, focusExistingWindow } from '../core/windowManager.js'
import { el, esc, api, fmtTime, fmtDate, store, clamp, generateId } from '../core/utils.js'
import { showBuyPopup } from '../main.js'   // only if needed
```

## Creating a window

```js
const win = createWindow({
  appId: 'myApp',            // REQUIRED — used for single-instance focusing
  title: 'Window Title',
  icon: '🥬',                // emoji OR
  iconImg: '/assets/mascot.png', // takes precedence over emoji
  width: 560, height: 420,
  statusBar: 'Ready',        // string or null
  content: domElement,       // HTMLElement preferred (or HTML string)
  onClose(winState) {},
})
// win.body is the .xp-window-body element to render into
```

Single-instance behavior: calling `createWindow` with same `appId` focuses the existing window (handled by appRegistry lazyLaunch + focusExistingWindow).

## Style conventions (classes already in css/apps.css)

- `.app-toolbar`, `.app-btn`, `.app-btn.primary`, `.app-input` — toolbar/buttons/inputs
- `.tag`, `.tag.live`, `.tag.ended`, `.tag.neon` — status badges
- Colors via CSS vars: `var(--neon)` blue #0064ec, `var(--green)` #60c33a, `var(--red)`, `var(--amber)`, backgrounds `var(--card)` #00102b / `var(--card-2)` #000c24 / `var(--bg)` #00050d, text `var(--text-bright)` #d6efc1 / `var(--text)` / `var(--text-dim)`
- Monospace hacker aesthetic everywhere. Use textContent / createElement for ANY dynamic/user data. NEVER interpolate user data into innerHTML.
- If an app needs extra styles, inject a `<style>` scoped with unique class prefix at module init.

## Server API (all JSON)

- GET `/api/config` → `{ tokenName:'$LEEK', fullName:'CYBERLEEK', ca:'', buyUrl:'', tickerItems:[...], balloon:{...} }`
- GET `/api/leeks` → `[{ id, date, title, kind:'image'|'video', local?, mirrors:[{label,url}] }]` sorted newest first
- GET `/api/polls` → `[{ id, status:'LIVE'|'ENDED', title, choices:[..], endsAt, finalized, votes:[n,...] }]`
- GET `/api/announcements` → `[{ id, date, title, body }]`
- GET `/api/chat` → `[{ id, name, text, ts }]` (last 200)
- POST `/api/chat` body `{ name, text }` → created message
- GET `/api/forum` → `[{ id, title, author, pinned, ts, postCount, lastTs }]`
- GET `/api/forum/:id` → `{ id, title, author, pinned, ts, posts:[{id,author,ts,body}] }`
- POST `/api/forum/thread` body `{ title, body, author }` → thread
- POST `/api/forum/:id/reply` body `{ body, author }` → updated thread
- POST `/api/poll/:id/vote` body `{ choice: <index> }` → `{ ok:true, votes:[...] }`
- GET `/api/health`

## localStorage keys

Prefix via helper: `store.get('chat_name')` etc. (auto-prefixed `cleek_`). Existing keys:
- `icon_order` (desktop), `seen` (notification dots), `egg_step` (easter egg state: number 0-3), `display_name` (shared display name for chat/forum)

## Export signature

Each app file exports one function named per appRegistry, e.g.:

```js
export function launchLeekpad() { /* builds window */ }
```

## Easter egg hooks (only where specified)

- terminal.js: hidden command `follow rabbit` starts quiz; on correct answer sets `store.set('egg_step', 1)` and reveals key `V1CEC1TY`.
- explorer.js: address bar input `V1CEC1TY` when `egg_step>=1` → set step 2, show hint "score 2013 in Corpo Breakout".
- breakout.js: win level 1 (or score ≥2013) with `egg_step>=2` → set step 3, dispatch `window.dispatchEvent(new CustomEvent('leek-egg-complete'))`.
- easterEgg.js: listens for that event + can be launched directly; shows final reward screen.

## Lore cheat-sheet

CYBERLEEK = hacker collective born in the networks, fights anti-consumer gaming industry. GTA VI leaks era. The Edict has 3 commandments: (I) no digital preorders, (II) no fake single-player DLC (locked=true→false), (III) preserve single-player content offline (The Crew incident). Slogans: "PUBLISHERS' FAVORITE VEGETABLE", "JUST LEEK IT", "If we can reach Rockstar, no one is safe", "community voting · decentralized leeks · no wallet connect". Token $LEEK — CA not announced yet ("TBA"). Community: 2shot Discord. Tone: dry, deadpan, hacker-meme, lowercase often, never corporate. No mention of any other token's contract address.

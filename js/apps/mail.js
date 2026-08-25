// LEAK Mail — Outlook-style client full of leaked corpo emails (parody)
import { createWindow } from '../core/windowManager.js'
import { el, fmtDate, store } from '../core/utils.js'

const MAILS = [
  {
    id: 'm1', folder: 'Corp Leaks', from: 'Mega-Publisher Inc — Legal', subj: 'CEASE AND DESIST (final) (for real this time)',
    ts: '2026-08-25T09:12:00Z', unread: true,
    body: `To whom it may concern at "CYBERLEEK":

We demand you stop leaking our games. Our lawyers have reviewed your on-chain posts and found them... legally inconvenient to address.

Please note that leaking violates the DMCA, the CDA, the ADA and several other three-letter acts we keep in a drawer.

We are watching you. We know you are in the garden. We have a gardener too.

Regards,
Legal Dept. (intern)`,
  },
  {
    id: 'm2', folder: 'Inbox', from: 'EA-Style Entertainment', subj: 'Preorder exclusive: unlock the ABILITY TO PLAY',
    ts: '2026-08-24T16:40:00Z', unread: true,
    body: `Valued consumer,

Preorder now to receive the DAY-ONE FUNCTIONALITY PACK:
- the game runs
- menus open
- pressing start does something

Also includes cosmetic skin "Patience of Job" for your troubles.

Refunds available if the game is bad, which it will not be, which is why we also sell the insurance against it being good.

— EA-Style Entertainment`,
  },
  {
    id: 'm3', folder: 'Corp Leaks', from: 'Rockstar-Adjacent Studios — internal', subj: 'RE: RE: RE: how did they get the map AGAIN',
    ts: '2026-08-24T11:05:00Z', unread: true,
    body: `Team,

Third time this quarter. The map is on every mirror, every arweave gateway, probably embroidered on somebody's pillow already.

Stop replying-all. Stop emailing the leak drive link. And whoever keeps naming build servers "definitely_not_leaked_2" — HR would like a word.

Priority now: ship something before the community finishes OUR game faster than us.

— Studio Head`,
  },
  {
    id: 'm4', folder: 'Inbox', from: 'white_rabbit', subj: '(no subject)',
    ts: '2026-08-23T23:59:00Z', unread: true,
    body: `the rabbit sees all who follow.

the terminal hears whispers.
the old browser keeps secrets.

score 2013 when the bricks fall.
the garden rewards patience.`,
  },
  {
    id: 'm5', folder: 'Corp Leaks', from: 'Ubisoft-ish Games — Live Ops', subj: 'Sunsetting The-Crew-Like Title: FAQ for players',
    ts: '2026-08-22T10:00:00Z', unread: true,
    body: `Dear drivers,

After careful consideration, we have decided your game no longer exists.

Q: I paid $70?
A: Yes.

Q: Can I still play single-player?
A: The single-player requires our servers to verify it is okay for you to play alone.

Q: Refunds?
A: We appreciate your passion.

Drive safe (not possible),
Live Ops`,
  },
  {
    id: 'm6', folder: 'Inbox', from: 'DLC Pricing Task Force', subj: 'locked=true -> locked=false : Q4 revenue projections',
    ts: '2026-08-20T14:22:00Z', unread: false,
    body: `Attached: revenue model for shipping a 1KB file that changes one boolean in the config.

Cost: $0.02 (bandwidth).
Price: $19.99 ("Deluxe Mission Pack").
Margin: 99,900%.

Note: do not use the word "content" in marketing; use "experience".

— Task Force`,
  },
  {
    id: 'm7', folder: 'Sent', from: 'you', subj: 'RE: CEASE AND DESIST (final) (for real this time)',
    ts: '2026-08-25T10:30:00Z', unread: false,
    body: `Dear Legal Dept. (intern),

No.

Also your game was on the disc the whole time. Commandment II. Look it up — oh wait, you can't take down a blockchain.

Stay hydrated,
an0n_leek`,
  },
  {
    id: 'm8', folder: 'Archive', from: 'BitcoinTalk — 2013', subj: 'I am HODLING',
    ts: '2013-12-18T10:03:00Z', unread: false,
    body: `I type d that tyitle twice because I knew it was wrong the first time. Still wrong. w/e.

GF's out at a lesbian bar, BTC crashing WHY AM I HOLDING? I'LL TELL YOU WHY...

(among the first stones of the garden. archived with respect.)`,
  },
  {
    id: 'm9', folder: 'Trash', from: 'scam_gardener', subj: '[SCAM - DO NOT OPEN] free LEEK giveaway!!!',
    ts: '2026-08-25T08:00:00Z', unread: true,
    body: `CONGRATULATIONS!!! you have been selected to DOUBLE YOUR LEEK!!!

simply send your seed phrase, your house keys, and your childhood pet to:
0x0000000000000000000000000000000000000000

hurry limited time!!!

[marked SCAM by the garden moderation daemon]`,
  },
]

const FOLDERS = ['Inbox', 'Corp Leaks', 'Sent', 'Archive', 'Trash']

export function launchMail() {
  const win = createWindow({
    appId: 'mail', title: 'LEAK Mail — MAPI connected', icon: '📧',
    width: 780, height: 500, statusBar: 'Connected — inbox monitored by garden daemon',
  })

  const state = { folder: 'Inbox', mailId: null }
  const readSet = new Set(store.get('mail_read', []))

  const layout = el('div', { class: 'mail-layout' })
  const foldersEl = el('div', { class: 'mail-folders' })
  const listEl = el('div', { class: 'mail-list' })
  const previewEl = el('div', { class: 'mail-preview' })
  layout.append(foldersEl, listEl, previewEl)
  win.body.append(layout)

  const unreadCount = (f) => MAILS.filter(m => m.folder === f && m.unread && !readSet.has(m.id)).length

  function renderFolders() {
    foldersEl.innerHTML = ''
    foldersEl.append(el('div', { style: 'padding:4px 12px;color:var(--green);font-size:11px;letter-spacing:1px;' }, 'MAILBOXES'))
    for (const f of FOLDERS) {
      const n = unreadCount(f)
      foldersEl.append(el('div', {
        class: 'mail-folder' + (state.folder === f ? ' active' : ''),
        onclick: () => { state.folder = f; render() },
      }, el('span', {}, f), n ? el('span', { class: 'unread-n' }, String(n)) : null))
    }
  }

  function renderList() {
    listEl.innerHTML = ''
    const mails = MAILS.filter(m => m.folder === state.folder)
      .sort((a, b) => b.ts.localeCompare(a.ts))
    if (!mails.length) listEl.append(el('div', { style: 'padding:14px;color:var(--text-dim);font-size:12px;' }, '(empty)'))
    for (const m of mails) {
      const unread = m.unread && !readSet.has(m.id)
      listEl.append(el('div', {
        class: 'mail-row' + (unread ? ' unread' : '') + (state.mailId === m.id ? ' active' : ''),
        onclick: () => { readSet.add(m.id); store.set('mail_read', [...readSet]); state.mailId = m.id; render() },
      },
        el('div', { class: 'm-from' }, el('span', {}, m.from), el('span', { style: 'color:var(--text-dark);font-weight:400;font-size:10px;' }, fmtDate(m.ts))),
        el('div', { class: 'm-subj' }, m.subj)))
    }
  }

  function renderPreview() {
    previewEl.innerHTML = ''
    const m = MAILS.find(x => x.id === state.mailId)
    if (!m) {
      previewEl.append(
        el('div', { style: 'display:grid;place-items:center;height:100%;text-align:center;color:var(--text-dim);' },
          el('div', {},
            el('div', { style: 'font-size:42px;margin-bottom:8px;' }, '📬'),
            'select an email to read the leaks')))
      return
    }
    previewEl.append(
      el('h3', {}, m.subj),
      el('div', { class: 'mail-meta' }, `from ${m.from} · ${new Date(m.ts).toUTCString()}`),
      el('div', { class: 'mail-body-text' }, m.body),
      el('div', { class: 'mail-actions' },
        el('button', { class: 'app-btn', onclick: () => alert('your reply was forwarded to the void.') }, 'Reply'),
        el('button', { class: 'app-btn', onclick: () => alert('forwarded to /leek/ board. nice.') }, 'Forward'),
        el('button', { class: 'app-btn', onclick: () => { m.unread = false; renderFolders(); renderList(); renderPreview() } }, 'Mark as Read'),
      ))
  }

  function render() { renderFolders(); renderList(); renderPreview() }
  render()
}

// QBTC OS — application registry
import { focusExistingWindow } from './windowManager.js'

const _cache = {}

async function lazyLaunch(key) {
  const entry = APP_REGISTRY[key]
  if (!entry || !entry._mod) return
  if (focusExistingWindow(key)) return
  try {
    if (!_cache[key]) _cache[key] = await entry._mod()
    const fn = _cache[key][entry._exp]
    if (typeof fn === 'function') fn()
    else console.error(`[registry] ${key}: export "${entry._exp}" is not a function`)
  } catch (e) {
    console.error(`[registry] failed to launch "${key}":`, e)
  }
}

export const APP_REGISTRY = {
  wallet:     { name: 'My Wallet',         emoji: '💳', _mod: () => import('../apps/myLeek.js'),      _exp: 'launchMyLeek',      desktopOrder: 1 },
  explorer:   { name: 'Block Explorer',    emoji: '🔗', _mod: () => import('../apps/explorer.js'),    _exp: 'launchExplorer',    desktopOrder: 2 },
  notepad:    { name: 'Notepad',           emoji: '📝', _mod: () => import('../apps/leekpad.js'),     _exp: 'launchLeekpad',     desktopOrder: 3 },
  gallery:    { name: 'Quantum Gallery',   emoji: '🖼️', _mod: () => import('../apps/gallery.js'),     _exp: 'launchGallery',     desktopOrder: 4 },
  chart:      { name: 'BTC Price',         emoji: '📊', _mod: () => import('../apps/chart.js'),       _exp: 'launchChart',       desktopOrder: 5 },
  terminal:   { name: 'QSB Terminal',      emoji: '⬛', _mod: () => import('../apps/terminal.js'),    _exp: 'launchTerminal',    desktopOrder: 6 },
  threats:    { name: 'Vulnerable Supply', emoji: '⚠️', _mod: () => import('../apps/updates.js'),     _exp: 'launchUpdates',     desktopOrder: 7 },
  chat:       { name: 'Quantum Chat',      emoji: '💬', _mod: () => import('../apps/chat.js'),        _exp: 'launchChat',        desktopOrder: 8 },
  forum:      { name: 'BTC Forum',         emoji: '📋', _mod: () => import('../apps/forum.js'),       _exp: 'launchForum',       desktopOrder: 9 },
  pollBooth:  { name: 'Polls',             emoji: '🗳️', _mod: () => import('../apps/pollBooth.js'),   _exp: 'launchPollBooth',   desktopOrder: 10 },
  mail:       { name: 'Threat Alerts',     emoji: '📧', _mod: () => import('./../apps/mail.js'),      _exp: 'launchMail',        desktopOrder: 11 },
  recycleBin: { name: 'Recycle Bin',       emoji: '🗑️', _mod: () => import('../apps/recycleBin.js'),  _exp: 'launchRecycleBin',  desktopOrder: 12 },
  about:      { name: 'About QBTC',        emoji: '⚛️', _mod: () => import('../apps/aboutLeek.js'),   _exp: 'launchAboutLeek',   desktopOrder: 13, inMenu: false },

  sweeper:    { name: 'Qubitsweeper',     emoji: '💣', _mod: () => import('../apps/sweeper.js'),     _exp: 'launchSweeper',     desktopOrder: 20 },
  solitaire:  { name: 'Solitaire',         emoji: '🃏', _mod: () => import('../apps/solitaire.js'),   _exp: 'launchSolitaire',   desktopOrder: 21 },
  breakout:   { name: 'Quantum Breakout',  emoji: '🧱', _mod: () => import('../apps/breakout.js'),    _exp: 'launchBreakout',    desktopOrder: 22 },

  easterEgg:  { name: '???',               emoji: '🐇', _mod: () => import('../apps/easterEgg.js'),   _exp: 'launchEasterEgg',   desktop: false },
}

for (const key of Object.keys(APP_REGISTRY)) {
  APP_REGISTRY[key].launch = () => lazyLaunch(key)
}

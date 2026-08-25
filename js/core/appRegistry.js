// CYBERLEEK OS — application registry (lazy loaded; one broken app can't kill the desktop)
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
  myLeek:     { name: 'My LEEK',        emoji: '🖥️', _mod: () => import('../apps/myLeek.js'),      _exp: 'launchMyLeek',      desktopOrder: 1 },
  explorer:   { name: 'Leek Explorer',  emoji: '🌐', _mod: () => import('../apps/explorer.js'),    _exp: 'launchExplorer',    desktopOrder: 2 },
  leekpad:    { name: 'LEEKpad',        emoji: '📝', _mod: () => import('../apps/leekpad.js'),     _exp: 'launchLeekpad',     desktopOrder: 3 },
  mail:       { name: 'LEAK Mail',      emoji: '📧', _mod: () => import('./../apps/mail.js'),      _exp: 'launchMail',        desktopOrder: 4 },
  gallery:    { name: 'Leak Gallery',   emoji: '🖼️', _mod: () => import('../apps/gallery.js'),     _exp: 'launchGallery',     desktopOrder: 5 },
  chart:      { name: '$LEEK Chart',    emoji: '📊', _mod: () => import('../apps/chart.js'),       _exp: 'launchChart',       desktopOrder: 6 },
  terminal:   { name: 'LEEK Terminal',  emoji: '⬛', _mod: () => import('../apps/terminal.js'),    _exp: 'launchTerminal',    desktopOrder: 7 },
  pollBooth:  { name: 'Poll Booth',     emoji: '🗳️', _mod: () => import('../apps/pollBooth.js'),   _exp: 'launchPollBooth',   desktopOrder: 8 },
  updates:    { name: 'Announcements',  emoji: '📰', _mod: () => import('../apps/updates.js'),     _exp: 'launchUpdates',     desktopOrder: 9 },
  chat:       { name: 'LeekChat',       emoji: '💬', _mod: () => import('../apps/chat.js'),        _exp: 'launchChat',        desktopOrder: 10 },
  forum:      { name: '/leek/ Board',   emoji: '📋', _mod: () => import('../apps/forum.js'),       _exp: 'launchForum',       desktopOrder: 11 },
  recycleBin: { name: 'Killed Games',   emoji: '🗑️', _mod: () => import('../apps/recycleBin.js'),  _exp: 'launchRecycleBin',  desktopOrder: 12 },
  aboutLeek:  { name: 'About CYBERLEEK',emoji: '🥬', _mod: () => import('../apps/aboutLeek.js'),   _exp: 'launchAboutLeek',   desktopOrder: 13, inMenu: false },

  // games
  sweeper:    { name: 'LEAKsweeper',    emoji: '💣', _mod: () => import('../apps/sweeper.js'),     _exp: 'launchSweeper',     desktopOrder: 20 },
  solitaire:  { name: 'Solitaire',      emoji: '🃏', _mod: () => import('../apps/solitaire.js'),   _exp: 'launchSolitaire',   desktopOrder: 21 },
  breakout:   { name: 'Corpo Breakout', emoji: '🧱', _mod: () => import('../apps/breakout.js'),    _exp: 'launchBreakout',    desktopOrder: 22 },

  // hidden / internal
  easterEgg:  { name: '???',            emoji: '🐇', _mod: () => import('../apps/easterEgg.js'),   _exp: 'launchEasterEgg',   desktop: false },
}

for (const key of Object.keys(APP_REGISTRY)) {
  APP_REGISTRY[key].launch = () => lazyLaunch(key)
}

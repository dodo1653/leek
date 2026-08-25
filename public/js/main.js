// CYBERLEEK OS — boot sequence & buy popup
import { initWindowManager, setWindowCallbacks, toggleFromTaskbar } from './core/windowManager.js'
import { initTaskbar, addTaskbarTab, removeTaskbarTab, setActiveTab, setTabMinimized } from './core/taskbar.js'
import { initStartMenu } from './core/startMenu.js'
import { initDesktop } from './core/desktop.js'
import { APP_REGISTRY } from './core/appRegistry.js'

let aboutDismissed = false

const BOOT_LINES = [
  '> mounting /dev/garden ... [OK]',
  '> resolving mirrors via arweave ... [OK]',
  '> loading leak archive (16 objects) ... [OK]',
  '> checking preorder licenses ... [VIOLATION FOUND]',
  '> spinning up community poll daemon ... [OK]',
  '> corpos detected nearby ... [IGNORING]',
]

document.addEventListener('DOMContentLoaded', () => {
  const log = document.getElementById('boot-log')
  let i = 0
  const timer = setInterval(() => {
    if (i >= BOOT_LINES.length) return clearInterval(timer)
    const line = document.createElement('div')
    if (BOOT_LINES[i].includes('VIOLATION')) line.style.color = '#fbbf24'
    line.textContent = BOOT_LINES[i++]
    log.append(line)
  }, 240)

  setTimeout(() => {
    const bs = document.getElementById('boot-screen')
    if (bs) {
      bs.classList.add('fade-out')
      setTimeout(() => bs.remove(), 500)
    }
    boot()
  }, 2100)
})

async function boot() {
  initWindowManager()

  setWindowCallbacks({
    onCreated: (state) => addTaskbarTab(state.id, state.title, state.iconImg || state.icon),
    onClosed: (id, appId) => {
      removeTaskbarTab(id)
      if (!aboutDismissed && appId === 'aboutLeek') {
        aboutDismissed = true
        showBuyPopup()
      }
    },
    onFocused: (id) => setActiveTab(id),
    onMinimized: (id, minimized) => setTabMinimized(id, minimized),
  })

  let enabledApps = null, desktopItems = []
  try {
    const [appsRes, deskRes] = await Promise.all([fetch('/api/config'), fetch('/api/config')])
    // config only; app visibility is static in this build
  } catch {}
  try { desktopItems = [] } catch {}

  initTaskbar()
  initStartMenu(null)
  await initDesktop(enabledApps, desktopItems)

  window.addEventListener('leek-taskbar-tab', (e) => {
    window.dispatchEvent(new CustomEvent('leek-tab-activate', { detail: e.detail }))
  })
  window.addEventListener('leek-tab-activate', (e) => toggleFromTaskbar(e.detail))

  // auto-open the Edict on first visit
  if (APP_REGISTRY.aboutLeek) APP_REGISTRY.aboutLeek.launch()
}

// --- Win98-style BUY $LEEK popup (draggable, non-blocking) ---
export async function showBuyPopup() {
  let cfg = {}
  try { cfg = await (await fetch('/api/config')).json() } catch {}

  const wrapper = document.createElement('div')
  wrapper.className = 'buy-popup-wrapper'
  wrapper.innerHTML = `
    <div class="buy-popup-dialog">
      <div class="buy-popup-titlebar">
        <span class="buy-popup-titleicon">🥬</span>
        <span class="buy-popup-titletext">${cfg.tokenName || '$LEEK'} — acquisition portal</span>
        <span style="flex:1"></span>
        <span class="buy-popup-controls">
          <button class="buy-popup-ctrl-btn" data-x="_"><span>_</span></button>
          <button class="buy-popup-ctrl-btn"><span>□</span></button>
          <button class="buy-popup-ctrl-btn buy-popup-ctrl-close"><span>×</span></button>
        </span>
      </div>
      <div class="buy-popup-body">
        <div class="buy-popup-heading">⚠️ WATER THE GARDEN ⚠️</div>
        <div class="buy-popup-sub">I AM LEEKING. Are you?<br>Contract address drops soon. No presale. No insider keys.<br>Pure community coordination.</div>
        <div class="buy-popup-ca">${cfg.ca ? 'CA: ' + cfg.ca : 'CA: TBA — watch the ticker'}</div>
        <button class="buy-popup-btn">${cfg.ca ? 'BUY ' + (cfg.tokenName || '$LEEK') : 'NOTIFY ME'}</button>
      </div>
    </div>`
  document.body.append(wrapper)
  requestAnimationFrame(() => wrapper.classList.add('visible'))

  const dialog = wrapper.querySelector('.buy-popup-dialog')
  const titleBar = wrapper.querySelector('.buy-popup-titlebar')
  let dragX = 0, dragY = 0, sx = 0, sy = 0, dragging = false

  titleBar.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.buy-popup-ctrl-btn')) return
    dragging = true; sx = e.clientX - dragX; sy = e.clientY - dragY
    titleBar.style.cursor = 'grabbing'
  })
  document.addEventListener('pointermove', (e) => {
    if (!dragging) return
    dragX = e.clientX - sx; dragY = e.clientY - sy
    dialog.style.transform = `translate(${dragX}px, ${dragY}px)`
  })
  document.addEventListener('pointerup', () => { dragging = false; titleBar.style.cursor = 'grab' })

  const dismiss = () => {
    wrapper.classList.remove('visible')
    setTimeout(() => wrapper.remove(), 300)
  }
  wrapper.querySelector('.buy-popup-ctrl-close').addEventListener('click', dismiss)
  wrapper.querySelector('[data-x="_"]').addEventListener('click', dismiss)
  wrapper.addEventListener('click', (e) => { if (e.target === wrapper) dismiss() })
  wrapper.querySelector('.buy-popup-btn').addEventListener('click', () => {
    if (cfg.buyUrl) window.open(cfg.buyUrl, '_blank')
    else alert('The garden is not open yet.\n\nWatch the LIVE FEED ticker for the CA drop.')
    dismiss()
  })
}

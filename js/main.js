// QBTC OS — boot sequence
import { initWindowManager, setWindowCallbacks, toggleFromTaskbar } from './core/windowManager.js'
import { initTaskbar, addTaskbarTab, removeTaskbarTab, setActiveTab, setTabMinimized } from './core/taskbar.js'
import { initStartMenu } from './core/startMenu.js'
import { initDesktop } from './core/desktop.js'
import { APP_REGISTRY } from './core/appRegistry.js'

let aboutDismissed = false

const BOOT_LINES = [
  '> initializing quantum-resistant module ... [OK]',
  '> loading STARK verifier (QSB v1.0) ... [OK]',
  '> scanning vulnerable UTXOs (6.04M BTC exposed) ... [WARNING]',
  '> elliptic-curve signatures: INSECURE against CRQC',
  '> hash-based signatures: QUANTUM-SAFE',
  '> BIP-360 migration status: STANDBY',
  '> StarkWare QSB lifeboat: ARMED',
]

document.addEventListener('DOMContentLoaded', () => {
  const log = document.getElementById('boot-log')
  let i = 0
  const timer = setInterval(() => {
    if (i >= BOOT_LINES.length) return clearInterval(timer)
    const line = document.createElement('div')
    if (BOOT_LINES[i].includes('WARNING')) line.style.color = '#fbbf24'
    if (BOOT_LINES[i].includes('INSECURE')) line.style.color = '#ff4444'
    if (BOOT_LINES[i].includes('QUANTUM-SAFE')) line.style.color = '#00ff88'
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
  }, 2300)
})

async function boot() {
  initWindowManager()

  setWindowCallbacks({
    onCreated: (state) => addTaskbarTab(state.id, state.title, state.iconImg || state.icon),
    onClosed: (id, appId) => {
      removeTaskbarTab(id)
    },
    onFocused: (id) => setActiveTab(id),
    onMinimized: (id, minimized) => setTabMinimized(id, minimized),
  })

  initTaskbar()
  initStartMenu(null)
  await initDesktop(null, [])

  window.addEventListener('qbtc-taskbar-tab', (e) => {
    window.dispatchEvent(new CustomEvent('qbtc-tab-activate', { detail: e.detail }))
  })
  window.addEventListener('qbtc-tab-activate', (e) => toggleFromTaskbar(e.detail))

  if (APP_REGISTRY.about) APP_REGISTRY.about.launch()
}

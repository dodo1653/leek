// CYBERLEEK OS — taskbar
import { renderStartMenu } from './startMenu.js'

const tabs = new Map()
let startButton, startMenu

export function initTaskbar() {
  startButton = document.getElementById('start-button')
  startMenu = document.getElementById('start-menu')
  const container = document.getElementById('taskbar-apps')
  container.innerHTML = ''

  startButton.addEventListener('click', (e) => {
    e.stopPropagation()
    toggleStartMenu()
  })
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#start-menu') && !e.target.closest('#start-button')) hideStartMenu()
  })
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideStartMenu() })

  // frozen clock: the night GTA VI leaked
  const clock = document.getElementById('tray-clock')
  if (clock) clock.textContent = '9/18/2022 4:26 AM'
}

export function closeStartMenuIfOpen() { hideStartMenu() }

function toggleStartMenu() {
  if (startMenu.classList.contains('hidden')) {
    renderStartMenu(startMenu)
    startMenu.classList.remove('hidden')
    startButton.classList.add('active')
  } else hideStartMenu()
}

function hideStartMenu() {
  startMenu.classList.add('hidden')
  startButton?.classList.remove('active')
}

window.addEventListener('leek-launch', hideStartMenu)

export function addTaskbarTab(id, title, icon) {
  const container = document.getElementById('taskbar-apps')
  const tab = document.createElement('button')
  tab.className = 'taskbar-tab'
  tab.innerHTML = `<span class="tab-icon"></span><span class="tab-label"></span>`
  const iconEl = tab.querySelector('.tab-icon'), labelEl = tab.querySelector('.tab-label')
  if (typeof icon === 'string' && icon.startsWith('/')) {
    const img = document.createElement('img'); img.src = icon; img.style.width = '13px'; img.style.height = '13px'
    iconEl.append(img)
  } else iconEl.textContent = icon || '🥬'
  labelEl.textContent = title
  tab.addEventListener('click', () => window.dispatchEvent(new CustomEvent('leek-taskbar-tab', { detail: id })))
  tabs.set(id, { el: tab, minimized: false })
  container.append(tab)
}

export function removeTaskbarTab(id) {
  const t = tabs.get(id)
  if (!t) return
  t.el.remove()
  tabs.delete(id)
}

export function setActiveTab(id) {
  for (const [wid, t] of tabs) t.el.classList.toggle('active', wid === id && !t.minimized)
}

export function setTabMinimized(id, minimized) {
  const t = tabs.get(id)
  if (!t) return
  t.minimized = minimized
  t.el.classList.toggle('minimized', minimized)
  t.el.classList.remove('active')
}

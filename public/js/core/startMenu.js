// CYBERLEEK OS — start menu
import { el } from './utils.js'
import { APP_REGISTRY } from './appRegistry.js'

let enabledSet = null

export function initStartMenu(enabledApps) {
  if (Array.isArray(enabledApps) && enabledApps.length) {
    enabledSet = new Set(enabledApps.map(a => a.id))
  }
}

const isOn = (key) => !enabledSet || enabledSet.has(key)

export function renderStartMenu(container) {
  container.innerHTML = ''
  container.append(
    el('div', { class: 'sm-banner' },
      el('img', { src: '/assets/mascot.png', alt: '' }),
      el('div', {},
        el('div', { class: 'sm-user' }, 'an0n_leek'),
        el('div', { class: 'sm-sub' }, 'clearance: LEVEL 6 // GARDEN ACCESS')
      )
    )
  )

  const columns = el('div', { class: 'sm-columns' })
  const left = el('div', { class: 'sm-col left' })
  const right = el('div', { class: 'sm-col right' })
  columns.append(left, right)

  const pinned = ['leekpad', 'explorer', 'sweeper', 'pollBooth', 'terminal', 'gallery', 'chart']
  const quick = ['myLeek', 'updates', 'aboutLeek', 'recycleBin']

  const addItems = (target, keys) => {
    for (const k of keys) {
      const app = APP_REGISTRY[k]
      if (!app || !isOn(k)) continue
      target.append(el('div', { class: 'sm-item', onclick: () => { window.dispatchEvent(new CustomEvent('leek-launch', { detail: k })) ; app.launch() } },
        el('span', { class: 'sm-emoji' }, app.emoji || '🥬'),
        el('span', { class: 'sm-label' }, app.name)
      ))
    }
  }

  addItems(left, pinned)
  left.append(el('div', { class: 'sm-sep' }))
  const allBtn = el('div', { class: 'sm-item' },
    el('span', { class: 'sm-emoji' }, '📂'),
    el('span', { class: 'sm-label' }, 'All Programs ▸'))
  allBtn.addEventListener('click', () => showAllPrograms(left))
  left.append(allBtn)

  addItems(right, quick)
  right.append(el('div', { class: 'sm-sep' }))
  right.append(el('div', { class: 'sm-item', onclick: () => window.open('/privacy-policy.html', '_blank') },
    el('span', { class: 'sm-emoji' }, '🛡'), el('span', { class: 'sm-label' }, 'Privacy Policy')))
  right.append(el('div', { class: 'sm-item', onclick: () => window.open('/terms-of-service.html', '_blank') },
    el('span', { class: 'sm-emoji' }, '⚖'), el('span', { class: 'sm-label' }, 'Terms of Service')))
  right.style.marginTop = 'auto'

  function showAllPrograms(target) {
    target.innerHTML = ''
    target.append(el('div', { class: 'sm-all-head' }, '◂ ALL PROGRAMS'))
    const back = el('div', { class: 'sm-item' }, el('span', { class: 'sm-emoji' }, '◀'),
      el('span', { class: 'sm-label' }, 'Back'))
    back.addEventListener('click', () => renderStartMenu(container))
    target.append(back)
    const keys = Object.keys(APP_REGISTRY).filter(k => APP_REGISTRY[k].inMenu !== false).sort((a, b) => (APP_REGISTRY[a].name > APP_REGISTRY[b].name ? 1 : -1))
    addItems(target, keys)
  }

  container.append(columns)

  container.append(el('div', { class: 'sm-footer' },
    el('div', { class: 'sm-foot-item', onclick: () => location.reload() }, '⟳', 'Restart'),
    el('div', { class: 'sm-foot-item', onclick: () => window.open('https://discord.gg/2shot', '_blank') }, '◈', '2shot Discord')
  ))
}

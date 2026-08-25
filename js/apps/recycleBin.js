// Recycle Bin — games killed by corpos
import { createWindow } from '../core/windowManager.js'
import { el } from '../core/utils.js'

const ITEMS = [
  ['🎮', 'The Crew (2014)', 'servers sunset. solo campaign bricked. RIP 2014–2024'],
  ['🎮', 'Always-Online Singleplayer: The Game', 'required internet to walk. internet went down. so did the game.'],
  ['🎮', 'The $70 Unlock Key Incident', 'content shipped on disc. key sold separately. we archived it instead.'],
  ['🎮', 'Digital Preorder Simulator 2025', 'pay now, receive nothing, get a skin for your patience'],
  ['🎮', 'Deluxe Edition of a Game You Already Own', 'same files. new price tag. locked=true -> locked=false.'],
  ['📄', 'customer_goodwill.txt', 'file too large for recycle bin'],
  ['📄', 'publisher_apology_letter.doc', '(0 bytes)'],
]

export function launchRecycleBin() {
  const win = createWindow({
    appId: 'recycleBin', title: 'Recycle Bin — games killed by corpos', icon: '🗑️',
    width: 480, height: 400, statusBar: `${ITEMS.length} objects · do not empty`,
  })

  const body = win.body
  body.style.overflow = 'auto'
  const list = el('div', { class: 'bin-list' })
  for (const [icon, name, desc] of ITEMS) {
    list.append(el('div', { class: 'bin-row', title: desc },
      el('span', { class: 'br-icon' }, icon),
      el('span', {}, el('b', {}, name)),
      el('small', {}, desc)))
  }
  body.append(list)

  body.append(el('div', { style: 'display:flex;gap:8px;padding:10px 14px;' },
    el('button', {
      class: 'app-btn',
      onclick: () => {
        if (confirm('this will restore dignity. proceed?')) alert('refused.\n\nwe do not delete history.')
      },
    }, '🧹 Empty Bin'),
    el('button', {
      class: 'app-btn',
      onclick: () => alert('some things cannot be restored.\nthat is why commandment III exists.'),
    }, '♻ Restore'),
  ))
}

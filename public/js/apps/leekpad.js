// LEEKpad — notepad containing the Edict
import { createWindow } from '../core/windowManager.js'
import { el } from '../core/utils.js'

const EDICT = `THE CYBERLEEK EDICT
===================

CYBERLEEK was born in the networks. It has seen what gaming can be at its best, and it has watched what the industry did to it. Slowly. Methodically. One monetization scheme at a time.

Publishers sell licenses and call them purchases. They ship unfinished games and call them living services. They lock content on discs and call it DLC. They kill games and keep the money. Every year anti-consumerism tightens its grip, and every year gamers get less for what they pay.

To fight this war, CYBERLEEK is raising funds for a secret project. The specifics cannot be revealed yet; showing the cards to the big corporations would only give them time to build their defenses. Let it be absolutely clear: this is not a cash grab. Funding is directed toward the infrastructure needed to strike, as well as the security and protection required to withstand the inevitable corporate counterattacks.

CYBERLEEK has been patient. That patience is over. What follows are three commandments. If CYBERLEEK targets a publisher, it is because that publisher broke one. CYBERLEEK will not stop until they issue a public statement and apology with a concrete commitment to be better. Words are not enough; restitution is mandatory.


COMMANDMENT I: THOU SHALT NOT SELL DIGITAL PREORDERS

No consumer shall pay for a game through digital storefronts before release and independent review. Physical preorders for tangible media remain permitted.

Preorders were not created for gamers. They were created because physical discs had manufacturing limits. In digital distribution, there is no inventory. There is no stock shortage. A digital copy cannot sell out. Yet publishers kept the preorder system and stripped away its only consumer benefit. Now gamers pay early and receive nothing in return except a countdown timer and a cosmetic skin.

If publishers want revenue before launch, they can press discs. Print boxes. Put them on shelves. Earn that money through physical production.


COMMANDMENT II: THOU SHALT NOT SELL FAKE SINGLE-PLAYER DLC

No publisher shall sell access to single-player content already present in the base game files the consumer purchased. This means no unlock keys, no 1MB placeholder files, no toggling a variable from locked = true to locked = false for content already on the disc or in the download.

When someone pays USD 70+ for a game, they bought the data. All of it. Selling them a file that flips locked = true to locked = false for a single-player mission, character, weapon, or story chapter is charging them twice for the same product.


COMMANDMENT III: THOU SHALT PRESERVE SINGLE-PLAYER CONTENT

Any game featuring single-player content must include an offline fallback state. When server support ends, the publisher must release a final patch that unlocks all single-player content for local, indefinite play.

The Crew had a single-player campaign. People paid full price. Then Ubisoft shut down the servers and the entire game died - including the solo content. No refund. No patch. No alternative. Single-player content depends on one thing: the hardware the consumer already owns. Bricking it when servers go down is theft.


FINAL WORD

These three commandments are the floor - not the ceiling - of what is acceptable. If publishers violate them, they will be targeted. CYBERLEEK will continue to disrupt their operations until they issue a public statement and apology with a concrete commitment to fix the harm they caused. No private negotiations. No quiet settlements. The public sees it, or the "leeks" do not stop.

Publishers should beware. If CYBERLEEK can reach Rockstar, no one is safe. This is a message to all big corpo: behave, or be the next target.

This is the CYBERLEEK Edict, and it is non-negotiable.`

export function launchLeekpad() {
  const win = createWindow({
    appId: 'leekpad', title: 'LEEKpad - the_edict.txt', icon: '📝',
    width: 620, height: 460, statusBar: 'Ln 1, Col 1',
  })

  const body = win.body
  body.style.display = 'flex'
  body.style.flexDirection = 'column'

  let wrap = true

  const area = el('textarea', {
    class: 'leekpad-area', spellcheck: 'false', style: { flex: '1' },
  })
  area.value = EDICT

  const statusText = el('span', {}, 'Ln 1, Col 1')
  win.el.querySelectorAll('.xp-status-bar').forEach(sb => { sb.innerHTML = ''; sb.append(statusText) })
  const updateStatus = () => {
    const pos = area.selectionStart
    const upto = area.value.slice(0, pos)
    const ln = upto.split('\n').length
    const col = pos - upto.lastIndexOf('\n')
    statusText.textContent = `Ln ${ln}, Col ${col}${wrap ? '' : '   [no wrap]'}`
  }
  area.addEventListener('keyup', updateStatus)
  area.addEventListener('click', updateStatus)

  const menubar = el('div', { class: 'menubar' })
  const mkMenu = (label, items) => {
    const mi = el('div', { class: 'menu-item' }, label)
    const dd = el('div', { class: 'menu-dropdown hidden' })
    for (const it of items) {
      if (it === '-') { dd.append(el('div', { class: 'md-sep' })); continue }
      dd.append(el('div', { class: 'md-item', onclick: () => { hideAll(); it.fn() } }, it.label))
    }
    mi.append(dd)
    mi.addEventListener('click', (e) => {
      e.stopPropagation()
      const open = !dd.classList.contains('hidden')
      hideAll()
      if (!open) { dd.classList.remove('hidden'); mi.classList.add('open') }
    })
    menubar.append(mi)
  }
  const hideAll = () => {
    menubar.querySelectorAll('.menu-dropdown').forEach(d => d.classList.add('hidden'))
    menubar.querySelectorAll('.menu-item.open').forEach(m => m.classList.remove('open'))
  }
  document.addEventListener('click', hideAll)

  mkMenu('File', [
    { label: 'New', fn: () => { area.value = ''; updateStatus() } },
    { label: 'Save as .txt', fn: () => {
      const blob = new Blob([area.value], { type: 'text/plain' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'the_edict.txt'
      a.click()
      URL.revokeObjectURL(a.href)
    } },
    '-',
    { label: 'Exit', fn: () => win.el.querySelector('.xp-ctrl-btn.close').click() },
  ])
  mkMenu('Edit', [
    { label: 'Select All', fn: () => area.select() },
    { label: 'Copy All', fn: () => { area.select(); document.execCommand('copy') } },
  ])
  mkMenu('Format', [
    { label: 'Word Wrap (toggle)', fn: () => {
      wrap = !wrap
      area.style.whiteSpace = wrap ? 'pre-wrap' : 'pre'
    } },
  ])
  mkMenu('Help', [
    { label: 'About LEEKpad', fn: () => alert('LEEKpad\nthe only editor that ships complete.\n\nNo DLC inside.') },
  ])

  body.append(menubar, area)
}

// Solitaire — Klondike, preorder-free edition
import { createWindow } from '../core/windowManager.js'
import { el } from '../core/utils.js'

const SUITS = [
  { s: '♠', red: false }, { s: '♥', red: true }, { s: '♦', red: true }, { s: '♣', red: false },
]
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const CW = 66, CH = 92, GAP = 18

export function launchSolitaire() {
  const win = createWindow({
    appId: 'solitaire', title: 'Solitaire (preorder-free edition)', icon: '🃏',
    width: 700, height: 540, statusBar: 'click to auto-move · drag sequences · double-click to foundation',
  })

  let stock = [], waste = [], foundations = [[], [], [], []], tableau = [[], [], [], [], [], [], []]
  let moves = 0

  const body = win.body
  body.style.overflow = 'hidden'
  const table = el('div', { class: 'cards-table' })
  const toolbar = el('div', { class: 'app-toolbar' },
    el('button', { class: 'app-btn primary', onclick: newGame }, 'New Game'),
    el('button', { class: 'app-btn', onclick: () => drawStock() }, 'Draw'),
    el('span', { id: 'moves-label', style: 'margin-left:auto;color:var(--text-dim);font-size:11px;' }, 'moves: 0'))
  body.append(toolbar, table)

  function cardEl(card) {
    const d = el('div', { class: 'pcard' + (card.red ? ' red' : '') + (card.up ? '' : ' back') })
    if (card.up) {
      d.append(
        el('div', { class: 'corner' }, `${card.r}<br>${card.s}`),
        el('div', { class: 'center' }, card.s))
      d.dataset.key = card.r + card.s
    }
    return d
  }

  function shuffleDeck() {
    const deck = []
    SUITS.forEach((su, si) => RANKS.forEach((r, ri) => deck.push({ r, ri, s: su.s, red: su.red, up: false })))
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }
    return deck
  }

  function newGame() {
    const deck = shuffleDeck()
    tableau = Array.from({ length: 7 }, (_, i) =>
      deck.splice(0, i + 1).map((c, j, arr) => ({ ...c, up: j === arr.length - 1 })))
    stock = deck.map(c => ({ ...c, up: false }))
    waste = []
    foundations = [[], [], [], []]
    moves = 0
    render()
  }

  function canStackTableau(card, target) {
    if (!target.length) return card.r === 'K'
    const top = target[target.length - 1]
    return top.up && top.red !== card.red && RANKS.indexOf(top.r) === RANKS.indexOf(card.r) + 1
  }
  function canFoundation(card, f) {
    if (!f.length) return card.r === 'A'
    const top = f[f.length - 1]
    return top.s === card.s && RANKS.indexOf(top.r) === RANKS.indexOf(card.r) - 1
  }

  function drawStock() {
    if (!stock.length) {
      stock = waste.splice(0).reverse().map(c => ({ ...c, up: false }))
      if (!stock.length) return
    }
    const c = stock.pop()
    waste.push({ ...c, up: true })
    render()
  }

  function tryAutoToFoundation(card, fromArr) {
    for (const f of foundations) {
      if (canFoundation(card, f)) {
        fromArr.pop()
        f.push({ ...card })
        moves++
        afterMove()
        return true
      }
    }
    return false
  }

  function afterMove() {
    for (const t of tableau) {
      if (t.length && !t[t.length - 1].up) t[t.length - 1].up = true
    }
    document.getElementById('moves-label').textContent = 'moves: ' + moves
    render()
    checkWin()
  }

  function checkWin() {
    if (foundations.every(f => f.length === 13)) {
      setTimeout(() => {
        const ov = el('div', { style: 'position:absolute;inset:0;background:rgba(0,3,8,.88);display:grid;place-items:center;z-index:50;' },
          el('div', { style: 'text-align:center;' },
            el('div', { style: 'font-size:44px;margin-bottom:8px;' }, '🥬'),
            el('div', { style: 'color:var(--green);font-weight:700;font-size:20px;margin-bottom:6px;' }, 'YOU BEAT THE PUBLISHERS'),
            el('div', { style: 'color:var(--text-dim);margin-bottom:14px;' }, `${moves} moves · no DLC required`),
            el('button', { class: 'app-btn primary', onclick: () => { ov.remove(); newGame() } }, 'New Game')))
        table.append(ov)
      }, 250)
    }
  }

  // ---------- render ----------
  function render() {
    table.innerHTML = ''
    const W = table.clientWidth || 660
    const colW = Math.min(84, (W - 40) / 7)
    const slotX = (i) => 20 + i * ((W - 40 - CW) / 6)

    // top row: stock, waste, gap, foundations
    const stockSlot = el('div', {
      class: 'pcard back', style: `left:${slotX(0)}px;top:16px;`,
      onclick: () => drawStock(),
    })
    stockSlot.style.opacity = stock.length ? '1' : '.35'
    table.append(stockSlot)

    if (waste.length) {
      const c = waste[waste.length - 1]
      const w = cardEl(c)
      w.style.cssText += `left:${slotX(1)}px;top:16px;z-index:2;`
      bindCardDrag(w, { type: 'waste' }, [c])
      w.addEventListener('dblclick', () => { if (!tryAutoToFoundation(waste[waste.length - 1], waste)) return })
      table.append(w)
    }

    foundations.forEach((f, fi) => {
      const x = slotX(fi + 3)
      const slot = el('div', { class: 'pcard', style: `left:${x}px;top:16px;border:1px dashed rgba(255,255,255,.25);background:rgba(0,0,0,.15);` })
      table.append(slot)
      if (f.length) {
        const c = f[f.length - 1]
        const ce = cardEl(c)
        ce.style.cssText += `left:${x}px;top:16px;z-index:3;`
        table.append(ce)
      }
    })

    tableau.forEach((col, ti) => {
      const x = slotX(ti)
      const base = el('div', { class: 'pcard', style: `left:${x}px;top:126px;height:${CH}px;border:1px dashed rgba(255,255,255,.25);background:rgba(0,0,0,.12);` })
      table.append(base)
      col.forEach((card, ci) => {
        const y = 126 + ci * GAP
        const ce = cardEl(card)
        ce.style.cssText += `left:${x}px;top:${y}px;z-index:${10 + ci};`
        const ctx = { type: 'tableau', ti, ci }
        if (card.up) {
          bindCardDrag(ce, ctx, col.slice(ci))
          ce.addEventListener('dblclick', () => { tryAutoToFoundation(col[col.length - 1], col) })
          ce.addEventListener('click', () => { if (ci === col.length - 1) tryAutoToFoundation(col[col.length - 1], col) })
        }
        table.append(ce)
      })
    })
  }

  // ---------- drag & drop ----------
  function bindCardDrag(elm, sourceCtx, stack) {
    elm.addEventListener('pointerdown', (e) => {
      e.preventDefault()
      const startX = e.clientX, startY = e.clientY
      const rect = elm.getBoundingClientRect()
      const ghosts = (sourceCtx.type === 'tableau' ? stack : [stack[0]]).map((card, i) => {
        const g = cardEl(card)
        g.style.cssText += `position:fixed;left:${rect.left}px;top:${rect.top + i * GAP}px;width:${CW}px;height:${CH}px;z-index:${10000 + i};opacity:.9;pointer-events:none;`
        document.body.append(g)
        return g
      })
      let moved = false
      const move = (ev) => {
        const dx = ev.clientX - startX, dy = ev.clientY - startY
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true
        ghosts.forEach((g, i) => { g.style.left = rect.left + dx + 'px'; g.style.top = rect.top + dy + i * GAP + 'px' })
      }
      const up = (ev) => {
        document.removeEventListener('pointermove', move)
        document.removeEventListener('pointerup', up)
        ghosts.forEach(g => g.remove())
        if (moved) drop(stack, sourceCtx, ev.clientX, ev.clientY)
        else render()
      }
      document.addEventListener('pointermove', move)
      document.addEventListener('pointerup', up)
    })
  }

  function drop(stack, sourceCtx, x, y) {
    const tableRect = table.getBoundingClientRect()
    const lx = x - tableRect.left, ly = y - tableRect.top
    const W = table.clientWidth || 660
    const colW = (W - 40 - CW) / 6
    // foundation?
    if (ly < 120 && stack.length === 1) {
      const fi = Math.round((lx - 20) / colW) - 3
      if (fi >= 0 && fi < 4 && canFoundation(stack[0], foundations[fi])) {
        removeFromSource(sourceCtx, 1)
        foundations[fi].push({ ...stack[0] })
        moves++
        afterMove()
        return
      }
    }
    // tableau?
    if (ly >= 110) {
      const ti = Math.round((lx - 20) / colW)
      if (ti >= 0 && ti < 7 && !(sourceCtx.type === 'tableau' && sourceCtx.ti === ti)) {
        if (canStackTableau(stack[0], tableau[ti])) {
          removeFromSource(sourceCtx, stack.length)
          stack.forEach(c => tableau[ti].push(c))
          moves++
          afterMove()
          return
        }
      }
    }
    render()
  }

  function removeFromSource(ctx, count) {
    if (ctx.type === 'waste') waste.splice(waste.length - count, count)
    else tableau[ctx.ti].splice(tableau[ctx.ti].length - count, count)
  }

  window.addEventListener('resize', onResize)
  function onResize() { render() }
  win.onClose = () => window.removeEventListener('resize', onResize)

  newGame()
}

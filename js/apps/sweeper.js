// Qubitsweeper — quantum minesweeper
import { createWindow } from '../core/windowManager.js'
import { el } from '../core/utils.js'

const LEVELS = { Easy: [9, 9, 10], Medium: [16, 16, 40], Hard: [30, 16, 99] }
const NUM_COLORS = ['', 'var(--neon)', 'var(--green)', '#ff5577', '#b45309', '#00c3e0', '#888', '#d6efc1', '#fbbf24']

export function launchSweeper() {
  const win = createWindow({
    appId: 'sweeper', title: 'Qubitsweeper', icon: '💣',
    width: 420, height: 480, statusBar: 'first click is safe. unlike quantum-vulnerable wallets.',
  })

  let diff = 'Easy'
  let grid = [], rows = 9, cols = 9, mines = 10
  let started = false, dead = false, wonFlag = false
  let revealed = 0, flagged = 0
  let timer = null, seconds = 0

  const body = win.body
  body.style.display = 'flex'
  body.style.flexDirection = 'column'
  body.style.overflow = 'auto'

  const hud = el('div', { class: 'sw-hud' })
  const faceBtn = el('button', { class: 'sw-face' }, '🙂')
  faceBtn.addEventListener('click', reset)
  const mineCounter = el('span', {}), timeCounter = el('span', {})
  const boardWrap = el('div', { style: 'flex:1;display:grid;place-items:start center;padding:6px;' })
  const select = el('select', { class: 'app-input' },
    ...Object.keys(LEVELS).map(k => el('option', { value: k }, k)))
  select.value = diff
  select.addEventListener('change', () => { diff = select.value; reset() })
  const toolbar = el('div', { class: 'app-toolbar' },
    el('span', { style: 'font-size:11px;color:var(--text-dim);' }, 'difficulty:'), select)
  body.append(toolbar, hud, boardWrap)

  win.onClose = () => clearInterval(timer)

  function reset() {
    clearInterval(timer); timer = null
    ;[rows, cols, mines] = LEVELS[diff]
    grid = []
    started = false; dead = false; wonFlag = false; revealed = 0; flagged = 0; seconds = 0
    for (let r = 0; r < rows; r++) {
      grid.push([])
      for (let c = 0; c < cols; c++) grid[r].push({ mine: false, open: false, flag: false, n: 0 })
    }
    faceBtn.textContent = '🙂'
    renderBoard()
    updateHud()
    if (win.el) {
      win.el.style.width = Math.max(360, cols * 25 + 60) + 'px'
    }
  }

  function placeMines(sr, sc) {
    let placed = 0
    while (placed < mines) {
      const r = Math.floor(Math.random() * rows), c = Math.floor(Math.random() * cols)
      if (grid[r][c].mine) continue
      if (Math.abs(r - sr) <= 1 && Math.abs(c - sc) <= 1) continue
      grid[r][c].mine = true
      placed++
    }
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) grid[r][c].n = neighbors(r, c).filter(([nr, nc]) => grid[nr][nc].mine).length
  }

  function neighbors(r, c) {
    const out = []
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue
      const nr = r + dr, nc = c + dc
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) out.push([nr, nc])
    }
    return out
  }

  let boardEl = null
  let cellEls = []

  function renderBoard() {
    boardEl = el('div', { class: 'sweeper-board', style: `grid-template-columns:repeat(${cols},24px);` })
    cellEls = []
    for (let r = 0; r < rows; r++) {
      cellEls.push([])
      for (let c = 0; c < cols; c++) {
        const cell = el('div', { class: 'sw-cell' })
        bindCell(cell, r, c)
        cellEls[r].push(cell)
        boardEl.append(cell)
      }
    }
    boardWrap.innerHTML = ''
    boardWrap.append(boardEl)
  }

  function longPress(cell, r, c) {
    let t = setTimeout(() => {
      toggleFlag(r, c)
      if (navigator.vibrate) navigator.vibrate(30)
      cell.dataset.lp = 'done'
    }, 500)
    const cancel = () => clearTimeout(t)
    cell.addEventListener('touchend', cancel, { once: true })
    cell.addEventListener('touchmove', cancel, { once: true })
  }

  function bindCell(cell, r, c) {
    cell.addEventListener('mousedown', (e) => {
      if (dead || wonFlag) return
      if (e.button === 2) { e.preventDefault(); return }
      if (!started) startTimer()
      openCell(r, c)
    })
    cell.addEventListener('contextmenu', (e) => { e.preventDefault(); if (!dead && !wonFlag && started) toggleFlag(r, c) })
    cell.addEventListener('touchstart', () => { if (!dead && !wonFlag) longPress(cell, r, c) }, { passive: true })
  }

  function startTimer() {
    started = true
    timer = setInterval(() => { seconds++; updateHud() }, 1000)
  }

  function updateHud() {
    mineCounter.textContent = '💣 ' + String(Math.max(0, mines - flagged)).padStart(3, '0')
    timeCounter.textContent = '⏱ ' + String(seconds).padStart(3, '0')
    hud.innerHTML = ''
    hud.append(mineCounter, faceBtn, timeCounter)
  }

  function openCell(r, c) {
    const g = grid[r][c]
    if (g.open || g.flag) return
    if (!g.mine && !grid[r][c]._seeded) { placeMines(r, c); grid[r][c]._seeded = true
      for (let rr = 0; rr < rows; rr++) for (let cc = 0; cc < cols; cc++) grid[rr][cc]._seeded = true
    }
    g.open = true
    revealed++
    const elc = cellEls[r][c]
    elc.classList.add('open')
    if (g.mine) {
      elc.classList.add('boom'); elc.textContent = '💥'
      lose(); return
    }
    if (g.n > 0) { elc.textContent = String(g.n); elc.style.color = NUM_COLORS[g.n] }
    else neighbors(r, c).forEach(([nr, nc]) => { if (!grid[nr][nc].open) openCell(nr, nc) })
    checkWin()
  }

  function toggleFlag(r, c) {
    const g = grid[r][c]
    if (g.open) return
    g.flag = !g.flag
    flagged += g.flag ? 1 : -1
    cellEls[r][c].textContent = g.flag ? '🚩' : ''
    updateHud()
  }

  function lose() {
    dead = true
    clearInterval(timer)
    faceBtn.textContent = '💀'
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      if (grid[r][c].mine && !grid[r][c].flag) { cellEls[r][c].classList.add('open'); cellEls[r][c].textContent = '💣' }
    }
    overlay('QUANTUM DECOHERENCE 💀', 'the qubits collapsed.', reset)
  }

  function checkWin() {
    if (revealed === rows * cols - mines) {
      wonFlag = true
      clearInterval(timer)
      faceBtn.textContent = '🥬'
      overlay('QUANTUM SAFE 🥬', `${diff} · ${seconds}s · no qubits harmed`, reset)
    }
  }

  function overlay(title, sub, onOk) {
    const ov = el('div', { style: 'position:absolute;inset:0;background:rgba(0,3,8,.85);display:grid;place-items:center;z-index:40;' },
      el('div', { style: 'text-align:center;' },
        el('div', { style: 'color:var(--green);font-weight:700;font-size:18px;margin-bottom:6px;' }, title),
        el('div', { style: 'color:var(--text-dim);margin-bottom:14px;' }, sub),
        el('button', { class: 'app-btn primary', onclick: () => { ov.remove(); onOk() } }, 'Play Again')))
    boardWrap.style.position = 'relative'
    boardWrap.append(ov)
  }

  reset()
}

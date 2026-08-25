// Corpo Breakout — bricks of greed
import { createWindow } from '../core/windowManager.js'
import { el, store } from '../core/utils.js'

const PALETTE = ['#0064ec', '#0050b8', '#003299', '#60c33a', '#fbbf24']
const LEVELS = [
  { rows: 4, cols: 8, tough: 0 },
  { rows: 5, cols: 9, tough: 1 },
  { rows: 5, cols: 10, tough: 2 },
  { rows: 6, cols: 11, tough: 3 },
  { rows: 6, cols: 12, tough: 4 },
]

export function launchBreakout() {
  const win = createWindow({
    appId: 'breakout', title: 'Corpo Breakout', icon: '🧱',
    width: 580, height: 500, statusBar: 'smash the locked=true bricks',
  })

  const W = 520, H = 360
  const body = win.body
  body.style.display = 'grid'
  body.style.placeItems = 'center'

  const canvas = el('canvas', { class: 'game-canvas', width: String(W), height: String(H) })
  const ctx = canvas.getContext('2d')
  const hud = el('div', { style: 'color:var(--text-dim);font-size:11px;padding:4px;text-align:center;' }, 'mouse / arrows to move · break every brick')
  const wrap = el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:4px;' })
  wrap.append(canvas, hud)
  body.append(wrap)

  let raf = null
  let paddle = { x: W / 2 - 40, w: 80, h: 10 }
  let ball = { x: W / 2, y: H - 40, vx: 3.2, vy: -3.6, r: 5 }
  let bricks = []
  let score = 0, lives = 3, level = 0
  let keys = {}
  let overlayActive = false

  function buildLevel() {
    bricks = []
    const L = LEVELS[level]
    const bw = (W - 40) / L.cols
    for (let r = 0; r < L.rows; r++) {
      for (let c = 0; c < L.cols; c++) {
        if ((r + c) % 7 === 6 && level > 1) continue
        bricks.push({
          x: 20 + c * bw + 2, y: 34 + r * 18, w: bw - 4, h: 14,
          hp: r < L.tough ? 2 : 1,
          color: PALETTE[r % PALETTE.length],
        })
      }
    }
    resetBall()
  }

  function resetBall() {
    ball.x = paddle.x + paddle.w / 2
    ball.y = H - 30
    ball.vx = (Math.random() > .5 ? 1 : -1) * 3.2
    ball.vy = -3.8
    overlayActive = true
    drawOverlay(`LEVEL ${level + 1}${level === 0 ? ': LOCKED=DLC' : ''}`, 'click or press SPACE to launch')
  }

  function launch() {
    if (!overlayActive) return
    overlayActive = false
  }

  function drawOverlay(title, sub) {
    ctx.fillStyle = 'rgba(0,3,8,.78)'
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = '#d6efc1'
    ctx.font = 'bold 20px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText(title, W / 2, H / 2 - 14)
    ctx.font = '12px "JetBrains Mono", monospace'
    ctx.fillStyle = '#6a7a90'
    ctx.fillText(sub, W / 2, H / 2 + 12)
  }

  function update(dt) {
    if (!overlayActive) {
      if (keys.ArrowLeft) paddle.x -= 6
      if (keys.ArrowRight) paddle.x += 6
      paddle.x = Math.max(0, Math.min(W - paddle.w, paddle.x))
      ball.x += ball.vx * dt * 60
      ball.y += ball.vy * dt * 60

      if (ball.x < ball.r || ball.x > W - ball.r) ball.vx *= -1
      if (ball.y < ball.r) ball.vy *= -1

      // paddle
      if (ball.vy > 0 && ball.y >= H - 24 - ball.r && ball.y <= H - 14 &&
        ball.x >= paddle.x - ball.r && ball.x <= paddle.x + paddle.w + ball.r) {
        const hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2)
        const speed = Math.hypot(ball.vx, ball.vy)
        const angle = hit * 1.05
        ball.vx = speed * Math.sin(angle)
        ball.vy = -Math.abs(speed * Math.cos(angle))
      }

      // lost ball
      if (ball.y > H + 20) {
        lives--
        if (lives <= 0) return gameOver()
        resetBall()
      }

      // bricks
      for (let i = bricks.length - 1; i >= 0; i--) {
        const b = bricks[i]
        if (ball.x > b.x - ball.r && ball.x < b.x + b.w + ball.r && ball.y > b.y - ball.r && ball.y < b.y + b.h + ball.r) {
          const overlapX = Math.min(ball.x - (b.x - ball.r), (b.x + b.w + ball.r) - ball.x)
          const overlapY = Math.min(ball.y - (b.y - ball.r), (b.y + b.h + ball.r) - ball.y)
          if (overlapX < overlapY) ball.vx *= -1
          else ball.vy *= -1
          b.hp--
          score += 100
          if (b.hp <= 0) bricks.splice(i, 1)
          break
        }
      }

      if (!bricks.length) {
        score += 500
        // easter egg hook after clearing level 1
        if (level === 0 && store.get('egg_step', 0) >= 2) {
          store.set('egg_step', 3)
          window.dispatchEvent(new CustomEvent('leek-egg-complete'))
          showSpecial()
          return
        }
        if (++level >= LEVELS.length) return gameWin()
        buildLevel()
      }
    }
    draw()
    raf = requestAnimationFrame(ts => tick(ts))
  }

  let lastTs = 0
  function tick(ts) {
    const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0.016)
    lastTs = ts
    update(dt)
  }

  function draw() {
    ctx.clearRect(0, 0, W, H)
    // bricks
    for (const b of bricks) {
      ctx.fillStyle = b.color
      ctx.globalAlpha = b.hp > 1 ? 1 : .82
      ctx.fillRect(b.x, b.y, b.w, b.h)
      if (b.hp > 1) {
        ctx.strokeStyle = '#000'
        ctx.strokeRect(b.x + .5, b.y + .5, b.w - 1, b.h - 1)
      }
      ctx.globalAlpha = 1
    }
    // paddle
    ctx.fillStyle = '#d6efc1'
    ctx.fillRect(paddle.x, H - 20, paddle.w, paddle.h)
    // ball
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    // hud text
    ctx.fillStyle = '#6a7a90'
    ctx.font = '12px "JetBrains Mono", monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`SCORE ${score}`, 10, 16)
    ctx.fillText(`LVL ${level + 1}`, 130, 16)
    ctx.textAlign = 'right'
    ctx.fillText('🥬'.repeat(Math.max(0, lives)), W - 10, 16)
  }

  function showSpecial() {
    overlayActive = true
    drawOverlay('🐇 SIGNAL RECEIVED', 'check your desktop — the rabbit found you')
    setTimeout(() => { endGame(true, 'EGG ROUTE COMPLETE') }, 2600)
  }

  function gameOver() {
    cancelAnimationFrame(raf)
    drawOverlay('GAME OVER', `score ${score} — the corpos won this round`)
    offerRetry()
  }
  function gameWin() {
    cancelAnimationFrame(raf)
    drawOverlay('ALL LEVELS CLEARED 🥬', `final score ${score}`)
    offerRetry()
  }
  function endGame(winFlag, msg) {
    cancelAnimationFrame(raf)
    drawOverlay(msg, `final score ${score}`)
    offerRetry()
  }
  function offerRetry() {
    canvas.addEventListener('click', retryOnce)
    function retryOnce() {
      canvas.removeEventListener('click', retryOnce)
      score = 0; lives = 3; level = 0
      buildLevel()
      lastTs = performance.now()
      raf = requestAnimationFrame(tick2)
    }
  }
  function tick2(ts) { lastTs = ts; update(0.016) }

  function onMove(e) {
    const rect = canvas.getBoundingClientRect()
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    paddle.x = Math.max(0, Math.min(W - paddle.w, cx - paddle.w / 2))
  }
  canvas.addEventListener('mousemove', onMove)
  canvas.addEventListener('touchmove', onMove, { passive: true })
  canvas.addEventListener('mousedown', () => { if (overlayActive && lives > 0) launch() })
  const kd = (e) => { keys[e.key] = true; if (e.key === ' ') { e.preventDefault(); launch() } }
  const ku = (e) => { keys[e.key] = false }
  document.addEventListener('keydown', kd)
  document.addEventListener('keyup', ku)

  win.onClose = () => {
    cancelAnimationFrame(raf)
    clearInterval(raf)
    canvas.removeEventListener('mousemove', onMove)
    document.removeEventListener('keydown', kd)
    document.removeEventListener('keyup', ku)
  }

  buildLevel()
  raf = requestAnimationFrame(tick2)
}

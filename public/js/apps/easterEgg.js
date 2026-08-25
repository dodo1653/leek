// ??? — the rabbit's window
import { createWindow } from '../core/windowManager.js'
import { el, store } from '../core/utils.js'

export function getEggStep() { return store.get('egg_step', 0) }

const ASCII = String.raw`
   _______________
  < CYBERLEEK OS  >
  ----------------
        \   ^__^
         \  (🥬)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
`

export function launchEasterEgg() {
  const win = createWindow({
    appId: 'easterEgg', title: '???', icon: '🐇',
    width: 400, height: 320, statusBar: null,
  })

  const body = win.body
  body.style.overflow = 'auto'

  function render() {
    const step = getEggStep()
    body.innerHTML = ''
    if (step >= 3) return renderReward()
    renderTeaser(step)
  }

  function dots(cur) {
    return el('div', { style: 'display:flex;gap:8px;justify-content:center;margin-top:14px;' },
      ...[0, 1, 2].map(i => el('span', {
        style: `width:10px;height:10px;border-radius:50%;border:1px solid var(--border);background:${i < cur ? 'var(--green)' : 'transparent'};`,
      })))
  }

  function renderTeaser(step) {
    body.append(
      el('div', { style: 'text-align:center;padding:22px;' },
        el('div', { style: 'font-size:52px;filter:drop-shadow(0 0 10px var(--neon-glow));animation:rabbitpulse 2s infinite;' }, '🐇'),
        el('div', { style: 'color:var(--text-bright);font-weight:700;letter-spacing:2px;margin:10px 0 8px;' }, 'the white rabbit knows the way.'),
        el('div', { style: 'color:var(--text-dim);font-size:12px;line-height:1.9;' },
          'hint #1: the terminal hears whispers.\nhint #2: old browsers keep secrets.\n' + (step >= 2 ? 'hint #3: break the bricks until 2013.' : '')),
        dots(step)))
  }

  function renderReward() {
    const style = document.createElement('style')
    if (!document.getElementById('egg-style')) {
      style.id = 'egg-style'
      style.textContent = '@keyframes rabbitpulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}'
      document.head.append(style)
    }
    const card = el('div', {
      style: 'margin:16px auto;padding:12px;border:1px dashed var(--border);width:fit-content;color:var(--text-bright);',
    },
      el('div', { style: 'display:flex;align-items:center;gap:8px;' }, '🎬', 'PROLOGUE_WITH_LUCIA.mp4'),
      el('div', { style: 'font-size:10.5px;color:var(--text-dark);' }, '4.7 GB · leaked · mirrored forever'))
    body.append(
      el('pre', { style: 'color:var(--neon);font-size:9px;line-height:1.15;text-align:center;margin-top:8px;' }, ASCII),
      el('div', { style: 'text-align:center;color:var(--green);letter-spacing:3px;font-weight:700;margin-top:6px;' }, 'REWARD UNLOCKED'),
      el('div', { style: 'text-align:center;color:var(--text);font-size:12px;line-height:1.8;margin-top:6px;' },
        'you followed the rabbit.\nstay in the garden. 🥬'),
      card,
      el('div', { class: 'lb-mirrors' },
        el('a', { href: '#', class: 'app-btn primary', onclick: (e) => { e.preventDefault(); alert('arweave://coming-soon\n\nthe garden decides when.') } }, 'arweave mirror'),
        el('a', { href: '#', class: 'app-btn primary', onclick: (e) => { e.preventDefault(); alert('upload.ee://coming-soon') } }, 'upload.ee mirror')))
  }

  function onEggComplete() { render() }
  window.addEventListener('leek-egg-complete', onEggComplete)
  win.onClose = () => window.removeEventListener('leek-egg-complete', onEggComplete)

  render()
}

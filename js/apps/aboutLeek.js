// About CYBERLEEK
import { createWindow } from '../core/windowManager.js'
import { el } from '../core/utils.js'
import { APP_REGISTRY } from '../core/appRegistry.js'

export function launchAboutLeek() {
  const win = createWindow({
    appId: 'aboutLeek', title: 'About CYBERLEEK', iconImg: '/assets/mascot.png',
    width: 540, height: 490, statusBar: 'non-negotiable',
  })

  const body = win.body
  body.style.overflow = 'auto'
  const wrap = el('div', { class: 'sys-groups', style: 'text-align:center;' })

  wrap.append(el('img', { src: '/assets/mascot.png', alt: '', style: 'width:96px;height:96px;border-radius:50%;border:2px solid var(--neon);box-shadow:0 0 24px var(--neon-glow);margin:8px auto 12px;display:block;' }))
  wrap.append(el('div', { style: 'font-size:26px;font-weight:700;letter-spacing:6px;color:var(--neon);text-shadow:0 0 20px var(--neon-glow);' }, 'CYBERLEEK'))
  wrap.append(el('div', { style: 'color:var(--text-dim);font-size:11.5px;letter-spacing:2px;margin-top:2px;' }, 'community voting · decentralized leeks · no wallet connect'))
  wrap.append(el('div', { style: 'color:var(--text-dark);font-size:10.5px;margin-top:2px;' }, 'LEEK-OS version 6.0.2025 (GARDEN EDITION)'))

  const missionTitle = el('div', { class: 'sys-group-title', style: 'text-align:left;' }, 'MISSION')
  const mission = el('div', { style: 'text-align:left;color:var(--text);font-size:12px;line-height:1.7;' },
    'Born in the networks. We watched the industry sell licenses and call them purchases, ship unfinished games and call them living services, kill games and keep the money. We fund the infrastructure to strike — and the protection to withstand the counterattack. If we can reach Rockstar, no one is safe.')
  wrap.append(missionTitle, mission)

  const cmdTitle = el('div', { class: 'sys-group-title', style: 'text-align:left;margin-top:14px;' }, 'THE THREE COMMANDMENTS')
  const list = el('ol', { style: 'text-align:left;color:var(--text-bright);font-size:12px;line-height:1.9;padding-left:22px;' },
    el('li', {}, 'Thou shalt not sell digital preorders.'),
    el('li', {}, 'Thou shalt not sell fake single-player DLC (locked=true → locked=false).'),
    el('li', {}, 'Thou shalt preserve single-player content — offline forever.'))
  wrap.append(cmdTitle, list)

  const links = el('div', { style: 'display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:18px;' })
  const mkLink = (label, fn) => el('button', { class: 'app-btn primary', onclick: fn }, label)
  links.append(
    mkLink('📜 Read full Edict', () => window.open('/about.html', '_blank')),
    mkLink('📋 /leek/ Board', () => APP_REGISTRY.forum.launch()),
    mkLink('◈ Discord', () => window.open('https://discord.gg/2shot', '_blank')),
  )
  wrap.append(links)

  wrap.append(el('div', { style: 'margin-top:16px;color:var(--text-dark);font-size:10.5px;letter-spacing:3px;text-transform:uppercase;' }, "publishers' favorite vegetable"))
  body.append(wrap)
}

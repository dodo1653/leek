// LEEK Terminal — command shell with secrets
import { createWindow } from '../core/windowManager.js'
import { el, api, store } from '../core/utils.js'

const BANNER = `
 ██████╗██╗   ██╗██████╗ ███████╗██████╗ ██╗     ███████╗██╗  ██╗
██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██║     ██╔════╝╚██╗██╔╝
██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝██║     █████╗   ╚███╔╝
██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗██║     ██╔══╝   ██╔██╗
╚██████╗   ██║   ██████╔╝███████╗██║  ██║███████╗███████╗██╔╝ ██╗
 ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝`

export function launchTerminal() {
  const win = createWindow({
    appId: 'terminal', title: 'LEEK Terminal — admin@cyberleek', icon: '⬛',
    width: 620, height: 420, statusBar: 'LEEK-OS shell v6.0',
  })

  const body = win.body
  body.style.overflow = 'hidden'
  const out = el('div', { class: 'term-body' })
  const inputRow = el('div', { class: 'term-input-row' })
  const promptEl = el('span', { class: 'term-prompt' }, 'C:\\LEEK>')
  const input = el('input', { class: 'term-input', spellcheck: 'false', autocomplete: 'off' })
  inputRow.append(promptEl, input)
  out.append(inputRow)
  body.append(out)

  const history = []
  let histIdx = -1
  let quizMode = false

  function print(text, cls = '') {
    const line = el('div', { class: 'term-line ' + cls })
    line.textContent = text
    out.insertBefore(line, inputRow)
    scrollBottom()
    return line
  }

  function scrollBottom() { out.scrollTop = out.scrollHeight }

  function banner() {
    for (const l of BANNER.split('\n')) print(l, 'term-sys')
    print('')
    print('LEEK-OS shell v6.0 — the garden edition', 'term-warn')
    print("type 'help' for commands. type carefully. the corpos are listening.", '')
    print('')
  }

  async function exec(raw) {
    const cmd = raw.trim()
    if (!cmd) return
    print(`C:\\LEEK> ${cmd}`, 'term-cmd')
    history.push(cmd)
    histIdx = history.length

    if (quizMode) {
      quizMode = false
      if (cmd === '327564') {
        store.set('egg_step', Math.max(store.get('egg_step', 0), 1))
        print('')
        print('...processing...', 'term-sys')
        print('ACCESS PHRASE ACCEPTED.')
        print('')
        print('key: V1CEC1TY', 'term-cmd')
        print('now feed the key to Leek Explorer\'s address bar. it knows what to do.', 'term-warn')
        print('')
        return
      }
      print('wrong number. the rabbit returns to the shadows.', 'term-err')
      print('')
      return
    }

    const [name, ...rest] = cmd.split(/\s+/)
    const arg = rest.join(' ')

    switch (name.toLowerCase()) {
      case 'help':
        print('available commands:', 'term-sys')
        print('  help          this menu')
        print('  edict         the three commandments')
        print('  leaks         latest leak archive entries')
        print('  poll          live community vote')
        print('  buy           token info')
        print('  whoami        identity check')
        print('  date          important date')
        print('  matrix        follow the white rabbit')
        print('  clear         wipe terminal')
        break
      case 'edict':
        print('THE THREE COMMANDMENTS:', 'term-sys')
        print('I.   thou shalt not sell digital preorders.')
        print('II.  thou shalt not sell fake single-player DLC (locked=true -> locked=false).')
        print('III. thou shalt preserve single-player content — offline forever.')
        print('violations will be targeted. restitution is mandatory.', 'term-warn')
        break
      case 'leaks': {
        try {
          const leaks = await api('/api/leeks')
          print('latest archive entries:', 'term-sys')
          leaks.slice(0, 8).forEach((l, i) => {
            print(`  ${String(i + 1).padStart(2)}. ${l.title}  (${l.date.slice(0, 10)})`)
          })
          print(`total objects archived: ${leaks.length}`)
        } catch { print('archive unreachable. mirrors may be under attack.', 'term-err') }
        break
      }
      case 'poll': {
        try {
          const polls = await api('/api/polls')
          const live = polls.find(p => p.status === 'LIVE')
          if (!live) { print('no live vote right now.', 'term-warn'); break }
          print(`LIVE VOTE: ${live.title}`, 'term-warn')
          live.choices.forEach((c, i) => print(`  [${i}] ${c}`))
          print('vote in Poll Booth on the desktop.')
        } catch { print('poll daemon offline.', 'term-err') }
        break
      }
      case 'buy':
        print('$LEEK — contract address: TBA', 'term-warn')
        print('no presale. no insiders. watch the ticker. be in the garden when it drops.')
        break
      case 'whoami':
        print('an0n_leek — clearance LEVEL 6 // GARDEN ACCESS', 'term-sys')
        break
      case 'date':
        print('9/18/2022 — the night everything changed.')
        break
      case 'matrix':
        matrix()
        break
      case 'clear':
        Array.from(out.children).forEach(c => { if (c !== inputRow) c.remove() })
        break
      default:
        if (name.toLowerCase() === 'follow' && arg === 'rabbit') {
          print('the white rabbit appears. it asks one question:', 'term-sys')
          print('"i am the year the leak woke the world x the month of betrayal x the day of the leek. multiply them. speak the number."', 'term-warn')
          quizMode = true
          break
        }
        if (cmd.toLowerCase().includes('rabbit')) {
          print('you sense movement in the hedges...', 'term-sys')
          print("try: follow rabbit", 'term-warn')
          break
        }
        print(`'${name}' is not recognized as an internal or external command,\noperable program or batch file.`, 'term-err')
    }
    print('')
  }

  function matrix() {
    const glyphs = 'ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸ01'
    let ticks = 0
    const t = setInterval(() => {
      let s = ''
      for (let i = 0; i < 62; i++) s += Math.random() < .7 ? glyphs[Math.floor(Math.random() * glyphs.length)] : ' '
      print(s, 'term-sys')
      if (++ticks >= 18) {
        clearInterval(t)
        print('wake up, leeker...', 'term-warn')
        print('')
      }
      scrollBottom()
    }, 100)
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const v = input.value
      input.value = ''
      exec(v)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (histIdx > 0) input.value = history[--histIdx] || ''
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx < history.length) input.value = history[++histIdx] || ''
    }
  })

  out.addEventListener('click', () => input.focus())
  banner()
  setTimeout(() => input.focus(), 100)
}

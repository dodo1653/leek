// QBTC Terminal — quantum-safe command shell
import { createWindow } from '../core/windowManager.js'
import { el } from '../core/utils.js'

const BANNER = `
 ██████╗██╗   ██╗██████╗ ███████╗██████╗ ██╗     ███████╗██╗  ██╗
██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██║     ██╔════╝╚██╗██╔╝
██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝██║     █████╗   ╚███╔╝
██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗██║     ██╔══╝   ██╔██╗
╚██████╗   ██║   ██████╔╝███████╗██║  ██║███████╗███████╗██╔╝ ██╗
 ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝`

export function launchTerminal() {
  const win = createWindow({
    appId: 'terminal', title: 'QBTC Terminal — admin@quantum-safe', icon: '⬛',
    width: 640, height: 440, statusBar: 'QSB-OS shell v1.0 — quantum-safe bitcoin',
  })

  const body = win.body
  body.style.overflow = 'hidden'
  const out = el('div', { class: 'term-body' })
  const inputRow = el('div', { class: 'term-input-row' })
  const promptEl = el('span', { class: 'term-prompt' }, 'QSB:\\>')
  const input = el('input', { class: 'term-input', spellcheck: 'false', autocomplete: 'off' })
  inputRow.append(promptEl, input)
  out.append(inputRow)
  body.append(out)

  const history = []
  let histIdx = -1

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
    print('QSB-OS shell v1.0 — the quantum resistance has arrived', 'term-warn')
    print("type 'help' for commands. the quantum computers are listening.", '')
    print('')
  }

  async function exec(raw) {
    const cmd = raw.trim()
    if (!cmd) return
    print(`QSB:\\> ${cmd}`, 'term-cmd')
    history.push(cmd)
    histIdx = history.length

    const [name, ...rest] = cmd.split(/\s+/)
    const arg = rest.join(' ')

    switch (name.toLowerCase()) {
      case 'help':
        print('available commands:', 'term-sys')
        print('  help          this menu')
        print('  status        QSB network status')
        print('  threats       quantum threat assessment')
        print('  qsb           quantum-safe bitcoin info')
        print('  migrate       migration guide for vulnerable wallets')
        print('  bip360        BIP-360 proposal details')
        print('  price         current BTC price data')
        print('  about         about this terminal')
        print('  clear         wipe terminal')
        break
      case 'status':
        print('QSB NETWORK STATUS:', 'term-sys')
        print('  Network:     Bitcoin Mainnet')
        print('  Protocol:    QSB v1.0 (Quantum-Safe Bitcoin)')
        print('  Consensus:   Proof of Work (hash-based signatures)')
        print('  Uptime:      Since Aug 30, 2026')
        print('  Status:      QUANTUM RESISTANT ✓')
        print('')
        print('First quantum-resistant tx mined by StarkWare.', 'term-warn')
        break
      case 'threats':
        print('QUANTUM THREAT ASSESSMENT:', 'term-sys')
        print('  6.04M BTC (30.2% of supply) — EXPOSED PUBLIC KEYS')
        print('  Estimated value: ~$483B at $80K/BTC')
        print('  Vulnerability:  Shor\'s algorithm can break ECDSA')
        print('  Satoshi\'s coins: THE ULTIMATE QUANTUM TREASURE')
        print('')
        print('Michael Saylor says threat is 10+ years away.', 'term-warn')
        print('StarkWare says: better safe than rekt.', 'term-warn')
        break
      case 'qsb':
        print('QUANTUM-SAFE BITCOIN (QSB):', 'term-sys')
        print('  Type:       Hash-based signatures (not ECDSA)')
        print('  Standard:   BIP-360 proposal')
        print('  Status:     First tx mined Aug 30, 2026')
        print('  Creator:    StarkWare')
        print('')
        print('QSB replaces elliptic curve cryptography with')
        print('hash-based signatures — resistant to quantum attack.', 'term-sys')
        break
      case 'migrate':
        print('WALLET MIGRATION GUIDE:', 'term-sys')
        print('  Step 1: Check if your address has exposed pubkey')
        print('  Step 2: Move funds to a QSB-compatible address')
        print('  Step 3: Use BIP-360 compliant wallet')
        print('  Step 4: Verify migration on block explorer')
        print('')
        print('6.04M BTC at risk — migrate before quantum computers arrive.', 'term-warn')
        break
      case 'bip360':
        print('BIP-360: QUANTUM-RESISTANT BITCOIN', 'term-sys')
        print('  Proposal:   Replace ECDSA with hash-based signatures')
        print('  Status:     Active development')
        print('  Backed by:  $15M consortium')
        print('  Members:    Coinbase, BlackRock, Fidelity,')
        print('              Galaxy, Strategy, Blockstream')
        print('')
        print('This is the permanent fix for quantum vulnerability.', 'term-warn')
        break
      case 'price':
        print('BTC MARKET DATA:', 'term-sys')
        print('  Price:    ~$80,000')
        print('  At Risk:  $483B in exposed public keys')
        print('  Supply:   6.04M BTC vulnerable')
        print('')
        print('Data as of Aug 30, 2026.', 'term-sys')
        break
      case 'about':
        print('QBTC TERMINAL v1.0', 'term-sys')
        print('  Built for the quantum resistance era')
        print('  First quantum-resistant tx: Aug 30, 2026')
        print('  Mined by StarkWare using QSB protocol')
        print('')
        print('"The lifeboat has launched."', 'term-warn')
        break
      case 'clear':
        Array.from(out.children).forEach(c => { if (c !== inputRow) c.remove() })
        break
      default:
        print(`'${name}' is not recognized as an internal or external command,\noperable program or batch file.`, 'term-err')
    }
    print('')
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

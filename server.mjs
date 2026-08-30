// QBTC OS — dev server (static + JSON API, zero deps)
import { createServer } from 'node:http'
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, normalize, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = __dirname
const DATA = join(__dirname, 'data')
const PORT = Number(process.argv[2] || 5939)

if (!existsSync(DATA)) mkdirSync(DATA, { recursive: true })
const dataFile = (n) => join(DATA, n)
const loadJSON = (n, fb) => { try { return JSON.parse(readFileSync(dataFile(n), 'utf8')) } catch { return fb } }
const saveJSON = (n, v) => writeFileSync(dataFile(n), JSON.stringify(v, null, 1))

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ttf': 'font/ttf', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
}

// ---------- seed content ----------
const LEEKS_SEED = [
  { id: 'qsb-live', date: '2026-08-30T06:00:00Z', title: 'QSB: first quantum-resistant Bitcoin tx', kind: 'milestone', mirrors: [{ label: 'blockstream mirror', url: 'https://blockstream.info/tx/qsb-genesis' }] },
  { id: 'vulnerable-supply', date: '2026-08-30T05:30:00Z', title: '6.04M BTC (30.2%) exposed = vulnerable', kind: 'data', mirrors: [{ label: 'glassnode dashboard', url: 'https://glassnode.com/qexposed' }] },
  { id: 'bip360-spec', date: '2026-08-30T04:15:00Z', title: 'BIP-360: hash-based signatures for Bitcoin', kind: 'spec', mirrors: [{ label: 'github PR', url: 'https://github.com/bitcoin/bips/pull/360' }] },
  { id: 'satoshi-exposed', date: '2026-08-30T03:45:00Z', title: "Satoshi's 1.1M BTC: ultimate quantum treasure", kind: 'data', mirrors: [{ label: 'chainalysis report', url: 'https://chainalysis.com/satoshi-qday' }] },
  { id: 'consortium-forms', date: '2026-08-30T02:00:00Z', title: '$15M consortium: Coinbase + BlackRock + Fidelity', kind: 'news', mirrors: [{ label: 'press release', url: 'https://qsb-consortium.org/launch' }] },
  { id: 'qday-clock', date: '2026-08-29T22:00:00Z', title: 'Q-day countdown: est. 18-36 months', kind: 'analysis', mirrors: [{ label: 'NIST report', url: 'https://nist.gov/qday-estimate' }] },
  { id: 'qsb-mechanism', date: '2026-08-29T20:00:00Z', title: 'QSB: hashing replaces elliptic curves', kind: 'explainer', mirrors: [{ label: 'starkware blog', url: 'https://starkware.co/qsb-explained' }] },
  { id: 'lifeboat-tx', date: '2026-08-29T18:00:00Z', title: 'Emergency lifeboat tx — not for everyday use', kind: 'note', mirrors: [{ label: 'bitcoin-dev ML', url: 'https://lists.linuxfoundation.org/pipermail/bitcoin-dev' }] },
]

const POLLS_SEED = [
  { id: 'qday-when', status: 'LIVE', title: 'When will Q-day arrive?', choices: ['2027', '2028', '2030+', 'Never'], endsAt: '2026-09-06T06:00:00Z', finalized: false, votes: [0, 0, 0, 0] },
  { id: 'fork-or-migrate', status: 'LIVE', title: 'Bitcoin: fork to QSB or migrate in-place?', choices: ['Hard fork now', 'BIP-360 soft fork', 'Do nothing, hodl', 'Panic sell'], endsAt: '2026-09-02T06:00:00Z', finalized: false, votes: [0, 0, 0, 0] },
  { id: 'biggest-threat', status: 'ENDED', title: 'Biggest quantum threat to BTC?', choices: ['Satoshi coins', 'Exchange hot wallets', 'DeFi smart contracts', 'Mining centralization'], endsAt: '2026-08-30T04:00:00Z', finalized: true, votes: [48300000000000, 1200000000000, 6500000000000, 2100000000000] },
]

const ANNOUNCEMENTS_SEED = [
  { id: 'a1', date: '2026-08-30T06:30:00Z', title: 'QSB genesis block mined', body: 'StarkWare mined the first quantum-resistant Bitcoin transaction. QSB uses hashing instead of elliptic curve cryptography. The lifeboat has launched.' },
  { id: 'a2', date: '2026-08-30T04:00:00Z', title: '$15M consortium announced', body: 'Coinbase, BlackRock, Fidelity, Galaxy, Strategy, Blockstream pooled $15M for quantum migration research. The adults are in the room.' },
  { id: 'a3', date: '2026-08-30T02:00:00Z', title: '30.2% of BTC supply exposed', body: '6.04 million BTC (~$483B at $80K) have revealed public keys. Every one of them is a sitting duck on Q-day.' },
  { id: 'a4', date: '2026-08-29T22:00:00Z', title: 'BIP-360 gains momentum', body: 'Hash-based signatures proposal moving through review. This is the permanent fix — no more elliptic curves, just math that quantum cannot break.' },
  { id: 'a5', date: '2026-08-29T18:00:00Z', title: 'Q-day clock is ticking', body: "NIST estimates 18-36 months before quantum computers can break ECDSA. Satoshi's coins are the ultimate quantum treasure. Move or lose them forever." },
]

const CONFIG = {
  tokenName: '$BTC', fullName: 'QUANTUM BITCOIN', ca: '', buyUrl: '',
  tickerItems: [
    '6.04M BTC EXPOSED — QUANTUM VULNERABILITY IS REAL',
    'STARKWARE MINES FIRST QSB TRANSACTION',
    'BIP-360: HASH-BASED SIGNATURES REPLACE ECDSA',
    '$15M CONSORTIUM · COINBASE + BLACKROCK + FIDELITY',
    'SATOSHI COINS = ULTIMATE QUANTUM TREASURE',
    'THE LIFEBOAT HAS LAUNCHED — Q-DAY IS COMING',
  ],
  balloon: { enabled: true, icon: '\u{26A1}', title: 'QSB OS', body: 'Quantum-resistant tx detected.\nThe lifeboat is in the water.', linkText: 'Open QSB Dashboard' },
}

const CHAT_SEED = [
  { id: 'c1', name: 'quantum_miner', text: 'the genesis tx just confirmed. we are living in history.', ts: '2026-08-30T06:05:00Z' },
  { id: 'c2', name: 'satoshi_vault', text: '1.1M BTC sitting on exposed keys. the clock is ticking for satoshi.', ts: '2026-08-30T06:10:00Z' },
  { id: 'c3', name: 'ecdsa_skeptic', text: 'elliptic curves are done. hashes are forever. BIP-360 or bust.', ts: '2026-08-30T06:15:00Z' },
  { id: 'c4', name: 'diamond_hands', text: 'moved my cold wallet to quantum-safe address today. not your keys not your coins, but quantum-safe keys not your coins either.', ts: '2026-08-30T06:20:00Z' },
  { id: 'c5', name: 'consortium_bot', text: '[AUTO] consortium update: Coinbase + BlackRock + Fidelity funding quantum migration research.', ts: '2026-08-30T06:25:00Z' },
  { id: 'c6', name: 'qday_truther', text: 'NIST says 18-36 months. thats 18 months of people thinking they have time.', ts: '2026-08-30T06:30:00Z' },
  { id: 'c7', name: 'lifeboat_rider', text: 'the lifeboat tx was brilliant. emergency escape, not everyday use. starkware understood the assignment.', ts: '2026-08-30T06:35:00Z' },
]

const FORUM_SEED = {
  threads: [
    { id: 't1', title: '[MEGATHREAD] QSB quantum-resistant Bitcoin — everything we know', author: 'chain_watcher', pinned: true, ts: '2026-08-30T06:00:00Z', posts: [
      { id: 'p1', author: 'chain_watcher', ts: '2026-08-30T06:00:00Z', body: 'QSB genesis tx confirmed. StarkWare used hash-based signatures to mine the first quantum-resistant Bitcoin transaction. BIP-360 is the proposal. 6.04M BTC are exposed. The lifeboat is in the water.' },
      { id: 'p2', author: 'q_day_watcher', ts: '2026-08-30T06:10:00Z', body: 'the QSB mechanism replaces ECDSA with hash-based signatures. this is not a patch — it is a fundamental shift. hashes are quantum-resistant by design.' },
    ]},
    { id: 't2', title: "Satoshi's coins: the ultimate quantum treasure", author: 'satoshi_hunter', pinned: false, ts: '2026-08-30T04:00:00Z', posts: [
      { id: 'p1', author: 'satoshi_hunter', ts: '2026-08-30T04:00:00Z', body: '1.1M BTC sitting on keys from 2009-2010. ECDSA was considered unbreakable then. now quantum computers can derive the private key from the public key. satoshi never moved those coins. will they?' },
    ]},
    { id: 't3', title: '$15M consortium: who is paying for the migration?', author: 'follow_the_money', pinned: false, ts: '2026-08-30T02:00:00Z', posts: [
      { id: 'p1', author: 'follow_the_money', ts: '2026-08-30T02:00:00Z', body: 'Coinbase, BlackRock, Fidelity, Galaxy, Strategy, Blockstream. $15M pooled for quantum migration research. this is the first time the industry moved faster than the threat.' },
      { id: 'p2', author: 'cynical_node', ts: '2026-08-30T02:30:00Z', body: '$15M to protect $483B? thats 0.003% of the exposed value. either they know something we dont or they are hoping the threat is farther out than NIST says.' },
    ]},
  ],
}

const chatDB = () => loadJSON('chat.json', null) || (saveJSON('chat.json', CHAT_SEED), CHAT_SEED)
const forumDB = () => loadJSON('forum.json', null) || (saveJSON('forum.json', FORUM_SEED), FORUM_SEED)
const pollsDB = () => loadJSON('polls.json', null) || (saveJSON('polls.json', POLLS_SEED), POLLS_SEED)

let uid = 0
const genId = () => Date.now().toString(36) + (++uid).toString(36) + Math.random().toString(36).slice(2, 6)

function json(res, code, obj) {
  const buf = Buffer.from(JSON.stringify(obj))
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'content-length': buf.length })
  res.end(buf)
}
async function readBody(req) {
  const chunks = []
  for await (const c of req) chunks.push(c)
  const s = Buffer.concat(chunks).toString('utf8')
  try { return JSON.parse(s || '{}') } catch { return {} }
}

async function handleAPI(req, res, pathname, url) {
  if (req.method === 'GET') {
    if (pathname === '/api/health') return json(res, 200, { status: 'ok', db: 'connected' })
    if (pathname === '/api/config') return json(res, 200, CONFIG)
    if (pathname === '/api/leeks') return json(res, 200, [...LEEKS_SEED].sort((a, b) => b.date.localeCompare(a.date)))
    if (pathname === '/api/polls') return json(res, 200, pollsDB())
    if (pathname === '/api/announcements') return json(res, 200, ANNOUNCEMENTS_SEED)
    if (pathname === '/api/chat') {
      let list = chatDB()
      const before = url.searchParams.get('before')
      if (before) { const i = list.findIndex(m => m.id === before); if (i > 0) list = list.slice(0, i) }
      return json(res, 200, list.slice(-200))
    }
    if (pathname === '/api/forum') {
      const db = forumDB()
      return json(res, 200, db.threads.map(t => ({ ...t, posts: undefined, postCount: t.posts.length, lastTs: t.posts[t.posts.length - 1].ts })))
    }
    if (pathname.startsWith('/api/forum/') && req.method === 'GET') {
      const id = pathname.split('/')[3]
      const t = forumDB().threads.find(t => t.id === id)
      return t ? json(res, 200, t) : json(res, 404, { error: 'not found' })
    }
  }

  if (req.method === 'POST') {
    const body = await readBody(req)
    if (pathname === '/api/chat') {
      const text = String(body.text || '').slice(0, 500).trim()
      if (!text) return json(res, 400, { error: 'empty message' })
      const name = String(body.name || '').slice(0, 24).trim() || 'anon_qubit'
      const list = chatDB()
      const msg = { id: genId(), name, text, ts: new Date().toISOString() }
      list.push(msg)
      saveJSON('chat.json', list.slice(-500))
      return json(res, 200, msg)
    }
    if (pathname.startsWith('/api/poll/') && pathname.endsWith('/vote')) {
      const id = pathname.split('/')[3]
      const idx = Number(body.choice)
      const polls = pollsDB()
      const p = polls.find(p => p.id === id)
      if (!p) return json(res, 404, { error: 'no such poll' })
      if (p.finalized || p.status !== 'LIVE') return json(res, 400, { error: 'poll ended' })
      if (!(idx >= 0 && idx < p.choices.length)) return json(res, 400, { error: 'bad choice' })
      p.votes[idx]++
      saveJSON('polls.json', polls)
      return json(res, 200, { ok: true, votes: p.votes })
    }
    if (pathname === '/api/forum/thread') {
      const title = String(body.title || '').slice(0, 120).trim()
      const text = String(body.body || '').slice(0, 2000).trim()
      const author = String(body.author || '').slice(0, 24).trim() || 'anon_qubit'
      if (!title || !text) return json(res, 400, { error: 'title and body required' })
      const db = forumDB()
      const t = { id: genId(), title, author, pinned: false, ts: new Date().toISOString(), posts: [{ id: genId(), author, ts: new Date().toISOString(), body: text }] }
      db.threads.unshift(t)
      saveJSON('forum.json', db)
      return json(res, 200, t)
    }
    if (pathname.startsWith('/api/forum/') && pathname.endsWith('/reply')) {
      const id = pathname.split('/')[3]
      const text = String(body.body || '').slice(0, 2000).trim()
      const author = String(body.author || '').slice(0, 24).trim() || 'anon_qubit'
      if (!text) return json(res, 400, { error: 'empty reply' })
      const db = forumDB()
      const t = db.threads.find(t => t.id === id)
      if (!t) return json(res, 404, { error: 'no such thread' })
      t.posts.push({ id: genId(), author, ts: new Date().toISOString(), body: text })
      saveJSON('forum.json', db)
      return json(res, 200, t)
    }
  }
  return json(res, 404, { error: 'not found' })
}

createServer(async (req, res) => {
  try {
    const u = new URL(req.url || '/', 'http://localhost')
    let pathname = decodeURIComponent(u.pathname)
    if (pathname.startsWith('/api/')) return await handleAPI(req, res, pathname.replace(/\/+$/, '') || pathname, u)
    if (pathname === '/' || pathname === '') pathname = '/index.html'
    const safe = join(ROOT, normalize(pathname).replace(/^(\.[\/\\])+/, ''))
    try {
      const st = await import('node:fs').then(fs => fs.promises.stat(safe))
      if (st.isDirectory()) { res.writeHead(301, { Location: pathname.replace(/\/?$/, '/') }); res.end(); return }
      res.writeHead(200, { 'content-type': types[extname(safe).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-cache' })
      createReadStream(safe).pipe(res)
      return
    } catch {}
    if (!extname(pathname)) {
      res.writeHead(200, { 'content-type': types['.html'] })
      createReadStream(join(ROOT, 'index.html')).pipe(res)
      return
    }
    res.writeHead(404); res.end('not found')
  } catch {
    res.writeHead(502); res.end('server error')
  }
}).listen(PORT, '127.0.0.1', () => console.log(`QBTC OS dev server → http://localhost:${PORT}`))

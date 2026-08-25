// Shared seed data + helpers (files starting with _ are NOT deployed as functions)
var LEEKS = [
  { id: 'nine1nine', date: '2026-08-25T09:46:18Z', title: 'GTA 6: nine1nine', kind: 'video', mirrors: [{ label: 'temp.sh mirror 1', url: 'https://temp.sh/KRkCo/nine1nine.mp4' }] },
  { id: 'beach', date: '2026-08-25T10:43:55Z', title: 'GTA 6: beach', kind: 'video', mirrors: [{ label: 'bedrive.ru mirror 1', url: 'https://bedrive.ru/8ef2' }] },
  { id: 'game-store', date: '2026-08-25T13:31:26Z', title: 'GTA 6: game store', kind: 'video', mirrors: [{ label: 'bedrive.ru mirror 1', url: 'https://bedrive.ru/006b' }] },
  { id: 'plane-night', date: '2026-08-23T16:56:10Z', title: 'GTA 6: plane (NIGHT)', kind: 'video', mirrors: [{ label: 'upload.ee mirror 1', url: 'https://www.upload.ee/files/19681203/plane2.mp4.html' }] },
  { id: 'gas', date: '2026-08-23T12:59:58Z', title: 'GTA 6: gas', kind: 'video', mirrors: [{ label: 'temp.sh mirror 1', url: 'https://temp.sh/julnh/gas.mp4' }] },
  { id: 'strip-club', date: '2026-08-22T18:28:47Z', title: 'GTA 6: strip club', kind: 'video', mirrors: [{ label: 'bedrive.ru mirror 1', url: 'https://bedrive.ru/43f0' }] },
  { id: 'hypercar-2', date: '2026-08-22T11:17:33Z', title: 'GTA 6: hypercar part 2', kind: 'video', mirrors: [{ label: 'temp.sh mirror 1', url: 'https://temp.sh/QVwth/hypercar2.mp4' }] },
  { id: 'hypercar-1', date: '2026-08-21T12:39:05Z', title: 'GTA 6: hypercar part 1', kind: 'video', mirrors: [{ label: 'bedrive.ru mirror 1', url: 'https://bedrive.ru/32f5' }] },
  { id: 'plane-poll', date: '2026-08-20T09:43:02Z', title: 'GTA 6: plane video (POLL WINNER)', kind: 'video', mirrors: [{ label: 'upload.ee mirror 1', url: 'https://www.upload.ee/files/19668811/plane.mp4.html' }] },
  { id: 'taser', date: '2026-08-19T13:27:20Z', title: 'GTA 6: taser video', kind: 'video', mirrors: [{ label: 'gofile.io mirror 1', url: 'https://gofile.io/d/qW134pdk' }, { label: 'bedrive.ru mirror 1', url: 'https://bedrive.ru/ead5' }] },
  { id: 'junkies', date: '2026-08-19T16:54:35Z', title: 'GTA 6: junkies video', kind: 'video', mirrors: [{ label: 'transfiles.ru mirror 1', url: 'https://transfiles.ru/vimdx' }] },
  { id: 'random-1', date: '2026-08-18T19:05:11Z', title: 'GTA 6: random video 1', kind: 'video', mirrors: [{ label: 'transfiles.ru mirror 1', url: 'https://transfiles.ru/ybyf9' }, { label: 'upload.ee mirror 1', url: 'https://www.upload.ee/files/19662951/video2.mp4.html' }, { label: 'arweave mirror 3', url: 'https://arweave.net/hhOoYZtHBqQi3d-dmxcGooXKTbiT3HJ2-eNsE7HNtKg' }] },
  { id: 'full-map', date: '2026-08-18T17:26:40Z', title: 'GTA 6: full map', kind: 'image', local: '/assets/leak-fullmap.png', mirrors: [{ label: 'upload.ee mirror 1', url: 'https://www.upload.ee/files/19662855/full_map.png.html' }, { label: 'arweave mirror 3', url: 'https://arweave.net/GVTWJUbg27XLsFEMctFUL45Z3beIyDWfKuhTe3Sp_w0' }] },
  { id: 'basketball', date: '2026-08-17T21:07:38Z', title: 'GTA 6: basketball video', kind: 'video', mirrors: [{ label: 'upload.ee mirror 1', url: 'https://www.upload.ee/files/19658673/output.mp4.html' }, { label: 'arweave mirror 3', url: 'https://arweave.net/3XQv_9ndgQ48DAZTeEYqRdVFryunBb0tI4gEVQpTJUs' }] },
  { id: 'map-sneak-2', date: '2026-08-16T15:11:50Z', title: 'GTA 6: map sneak peek 2', kind: 'video', mirrors: [{ label: 'arweave mirror 3', url: 'https://arweave.net/zbfExgTitr6LZ9Cu8lv3P8hjDr56uYyEIVkYU1OdZ-0' }] },
  { id: 'map-sneak-1', date: '2026-08-15T22:08:08Z', title: 'GTA 6: map sneak peek 1', kind: 'image', local: '/assets/leak-map1.png', mirrors: [{ label: 'arweave mirror 4', url: 'https://arweave.net/MyMFWWJkSuOoi2MehJ1TDC2kSLk_Twwl57WdPe5ceGg' }] }
]

var CONFIG = {
  tokenName: '$LEEK', fullName: 'CYBERLEEK', ca: '', buyUrl: '',
  tickerItems: ["PUBLISHERS' FAVORITE VEGETABLE", 'GTA 6 FULL MAP — ARCHIVED FOREVER', 'IF WE CAN REACH ROCKSTAR, NO ONE IS SAFE', 'COMMUNITY VOTING · DECENTRALIZED LEEKS · NO WALLET CONNECT', 'THOU SHALT NOT SELL DIGITAL PREORDERS', 'THE CREW DESERVED BETTER'],
  balloon: { enabled: true, icon: '\u{1F96C}', title: 'CYBERLEEK OS', body: 'New leeks detected.\nThe garden is watered.', linkText: 'Open Leak Gallery' }
}

var ANNOUNCEMENTS = [
  { id: 'a1', date: '2026-08-25T14:00:00Z', title: 'three new leeks in 24h', body: 'game store. beach. nine1nine. the tap is open and corpos are drinking it through a straw.' },
  { id: 'a2', date: '2026-08-24T15:00:00Z', title: 'poll: prologue with lucia', body: 'community vote is LIVE until tomorrow. decentralized polling, no wallet connect. your bags decide the next drop.' },
  { id: 'a3', date: '2026-08-23T20:00:00Z', title: 'nudist town won the vote', body: 'you voted. we delivered. this is what decentralized leeks means. strip club 2 stays on the shelf... for now.' },
  { id: 'a4', date: '2026-08-20T10:00:00Z', title: 'plane (DAY) wins drive-by poll', body: '147 trillion raw units voted. democracy is beautiful when the currency is vegetables.' },
  { id: 'a5', date: '2026-08-18T18:00:00Z', title: 'FULL MAP ARCHIVED FOREVER', body: 'mirrored across arweave + upload.ee. takedowns are temporary, permanence is a choice. welcome to the future of leaks.' }
]

var POLLS = [
  { id: 'prologue-lucia', status: 'LIVE', title: 'Do you really want to see the prologue with Lucia?', choices: ['Yes Please', 'Fuck No'], endsAt: '2026-08-26T13:10:03Z', finalized: false, votes: [0, 0] },
  { id: 'next-video-2', status: 'ENDED', title: 'Next GTA 6 Video?', choices: ['Beach', 'Nudist Town', 'Strip Club 2'], endsAt: '2026-08-24T12:48:21Z', finalized: true, votes: [0, 56600513646946, 11351258998421] },
  { id: 'drive-by', status: 'ENDED', title: 'Next GTA 6 Video... Cinematic drive by?', choices: ['Car (DAY)', 'Car (NIGHT)', 'Motorcycle (NIGHT)', 'Plane (DAY)'], endsAt: '2026-08-20T09:26:57Z', finalized: true, votes: [80000000000000, 420000000000, 1000000000000, 147210959061841] }
]

var CHAT = [
  { id: 'c1', name: 'white_rabbit', text: 'follow the white rabbit...', ts: '2026-08-25T08:12:00Z' },
  { id: 'c2', name: 'Fierce Leek', text: 'just seen the game store leak. vice city at NIGHT hits different', ts: '2026-08-25T09:51:00Z' },
  { id: 'c3', name: 'paperhands_beware', text: 'sold at 40k mcap. i am not okay', ts: '2026-08-25T10:02:00Z' },
  { id: 'c4', name: 'diamond_veggie', text: 'we hold. we leek. we never pre-order.', ts: '2026-08-25T10:44:00Z' },
  { id: 'c5', name: 'moderator_bot', text: '[AUTO] reminder: no selling fake single-player DLC in this chat either', ts: '2026-08-25T11:00:00Z' },
  { id: 'c6', name: 'lucia_enjoyer', text: 'voted YES PLEASE on the prologue poll. dont fail me now community', ts: '2026-08-25T12:30:00Z' },
  { id: 'c7', name: 'grep_leek', text: 'who else archived the full map before the corpos wake up', ts: '2026-08-25T13:05:00Z' }
]

var FORUM = { threads: [
  { id: 't1', title: '[MEGATHREAD] GTA 6 leak archive — every mirror, one place', author: 'archivist', pinned: true, ts: '2026-08-15T23:00:00Z', posts: [
    { id: 'p1', author: 'archivist', ts: '2026-08-15T23:00:00Z', body: 'Full map + all videos mirrored on arweave/upload.ee/temp.sh. DO NOT pay for what was already on the disc.' },
    { id: 'p2', author: 'vice_council', ts: '2026-08-16T01:10:00Z', body: 'pinned forever. library of alexandria but with palm trees' }
  ]},
  { id: 't2', title: 'Commandment II violated AGAIN (you know the publisher)', author: 'dlc_truther', pinned: false, ts: '2026-08-22T12:00:00Z', posts: [
    { id: 'p1', author: 'dlc_truther', ts: '2026-08-22T12:00:00Z', body: '1MB unlock key for content already on disc. locked=true -> locked=false. $70 twice for the same product.' }
  ]},
  { id: 't3', title: 'The Crew server shutdown — never forget', author: 'offline_forever', pinned: false, ts: '2026-08-19T09:00:00Z', posts: [
    { id: 'p1', author: 'offline_forever', ts: '2026-08-19T09:00:00Z', body: 'paid full price. servers died. solo campaign bricked. commandment III exists because of this.' }
  ]}
]}

function json(res, code, obj) {
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.statusCode = code
  res.end(JSON.stringify(obj))
}

function readBody(req) {
  return new Promise(function (resolve) {
    var chunks = []
    req.on('data', function (c) { chunks.push(c) })
    req.on('end', function () {
      var s = Buffer.concat(chunks).toString('utf8')
      try { resolve(JSON.parse(s || '{}')) } catch (e) { resolve({}) }
    })
    req.on('error', function () { resolve({}) })
  })
}

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8) }

module.exports = { LEEKS: LEEKS, CONFIG: CONFIG, ANNOUNCEMENTS: ANNOUNCEMENTS, POLLS: POLLS, CHAT: CHAT, FORUM: FORUM, json: json, readBody: readBody, genId: genId }

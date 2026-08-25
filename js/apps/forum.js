// /leek/ Board — bulletin board clone
import { createWindow } from '../core/windowManager.js'
import { el, esc, api, fmtDate, fmtTime, store } from '../core/utils.js'

export function launchForum() {
  const win = createWindow({
    appId: 'forum', title: '/leek/ — leaks & preservation board', icon: '📋',
    width: 740, height: 500, statusBar: 'anonymous posting enabled · rate limited by honor',
  })

  let view = 'list'
  let currentThread = null

  const main = el('div', { class: 'forum-main' })
  const side = el('div', { class: 'forum-side' })
  const layout = el('div', { class: 'forum-layout' }, side, main)
  win.body.style.overflow = 'hidden'
  win.body.append(layout)

  renderSide()

  function renderSide() {
    side.innerHTML = ''
    side.append(
      el('div', { style: 'color:var(--green);font-weight:700;letter-spacing:2px;font-size:15px;' }, '/leek/'),
      el('div', { style: 'color:var(--text-dim);font-size:10.5px;margin-top:4px;line-height:1.6;' },
        'decentralized leeks\ngame preservation\ncorpo watch'),
      el('hr', { style: 'border:none;border-top:1px solid var(--border);margin:8px 0;' }),
      el('button', { class: 'app-btn primary', style: 'width:100%;', onclick: () => composer() }, '+ New Thread'),
      el('div', { style: 'margin-top:14px;color:var(--text-dark);font-size:10px;line-height:1.8;' },
        'rules:\n1. no preorders\n2. no fake DLC\n3. archive everything'))
  }

  async function renderList() {
    view = 'list'
    currentThread = null
    main.innerHTML = ''
    main.append(el('div', { style: 'color:var(--text-dim);padding:6px 0;' }, 'loading threads...'))
    try {
      const threads = await api('/api/forum')
      main.innerHTML = ''
      main.append(el('div', { class: 'sys-group-title', style: 'margin-top:0;' }, `THREADS (${threads.length})`))
      if (!threads.length) main.append(el('div', { style: 'color:var(--text-dim);padding:10px;' }, 'no threads yet. start the conversation.'))
      for (const t of threads) {
        main.append(el('div', {
          class: 'thread-row',
          onclick: () => openThread(t.id),
        },
          el('span', { class: 'thread-title' + (t.pinned ? ' pinned' : '') }, t.title),
          el('span', { class: 'thread-meta' }, `by ${t.author} · ${t.postCount} posts · ${fmtDate(t.lastTs)}`)))
      }
    } catch (e) {
      main.innerHTML = ''
      main.append(el('div', { style: 'color:var(--red);padding:10px;' }, `feed error: ${e.message}`))
    }
  }

  async function openThread(id) {
    main.innerHTML = ''
    main.append(el('div', { style: 'color:var(--text-dim);padding:6px 0;' }, 'loading thread...'))
    try {
      const t = await api(`/api/forum/${id}`)
      currentThread = t
      view = 'thread'
      main.innerHTML = ''
      main.append(el('button', { class: 'app-btn', onclick: renderList }, '◂ back to /leek/'))
      main.append(el('h3', { style: 'color:var(--text-bright);margin:10px 0 12px;font-size:16px;' }, (t.pinned ? '📌 ' : '') + t.title))
      for (const p of t.posts) {
        main.append(el('div', { class: 'post' },
          el('div', { class: 'post-head' },
            el('span', { class: 'p-author' }, p.author),
            el('span', {}, `${fmtDate(p.ts)} ${fmtTime(p.ts)}`)),
          el('div', { class: 'post-body' }, p.body)))
      }
      main.append(replyBox(t.id))
    } catch (e) {
      main.innerHTML = ''
      main.append(el('div', { style: 'color:var(--red);padding:10px;' }, `error: ${e.message}`))
    }
  }

  function authorInput(value = '') {
    return el('input', { class: 'app-input', style: 'width:160px;', placeholder: 'name', value, maxlength: '24' })
  }

  function replyBox(threadId) {
    const ta = el('textarea', { class: 'app-input', style: 'width:100%;min-height:70px;resize:vertical;', placeholder: 'post a reply...', maxlength: '2000' })
    const name = authorInput(store.get('display_name', ''))
    const btn = el('button', { class: 'app-btn primary' }, 'Post Reply')
    btn.addEventListener('click', async () => {
      const body = ta.value.trim()
      if (!body || btn.disabled) return
      const author = name.value.trim() || 'anon_leek'
      store.set('display_name', author)
      btn.disabled = true
      try {
        await api(`/api/forum/${threadId}/reply`, { method: 'POST', body: { body, author } })
        openThread(threadId)
      } catch (e) { alert(e.message); btn.disabled = false }
    })
    return el('div', { style: 'margin:14px 0 20px;' },
      el('div', { class: 'sys-group-title' }, 'REPLY AS ANON'),
      el('div', { style: 'display:flex;gap:8px;margin-bottom:6px;' }, name),
      ta,
      el('div', { style: 'margin-top:8px;' }, btn))
  }

  function composer() {
    view = 'composer'
    main.innerHTML = ''
    main.append(el('button', { class: 'app-btn', onclick: renderList }, '◂ cancel'))
    const title = el('input', { class: 'app-input', style: 'width:100%;', placeholder: 'thread title', maxlength: '120' })
    const ta = el('textarea', { class: 'app-input', style: 'width:100%;min-height:110px;resize:vertical;margin-top:6px;', placeholder: 'what needs archiving? what broke the edict?', maxlength: '2000' })
    const name = authorInput(store.get('display_name', ''))
    const post = el('button', { class: 'app-btn primary', style: 'margin-top:8px;' }, 'Create Thread')
    post.addEventListener('click', async () => {
      if (!title.value.trim() || !ta.value.trim() || post.disabled) return
      const author = name.value.trim() || 'anon_leek'
      store.set('display_name', author)
      post.disabled = true
      try {
        const t = await api('/api/forum/thread', { method: 'POST', body: { title: title.value.trim(), body: ta.value.trim(), author } })
        openThread(t.id)
      } catch (e) { alert(e.message); post.disabled = false }
    })
    main.append(
      el('h3', { style: 'color:var(--text-bright);margin:10px 0;' }, 'NEW THREAD'),
      title, ta,
      el('div', { style: 'margin-top:6px;display:flex;gap:8px;align-items:center;' }, el('span', { style: 'color:var(--text-dim);font-size:11px;' }, 'posting as'), name),
      post)
  }

  win.onClose = () => {}
  renderList()
}

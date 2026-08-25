// LeekChat — AIM-style global chat
import { createWindow } from '../core/windowManager.js'
import { el, esc, api, fmtTime, fmtDate, store, generateId } from '../core/utils.js'

const CODENAMES = ['anon_leek_482', 'garden_ghost', 'vice_veggie', 'lurker_9000', 'paperhands_no_more']

export function launchChat() {
  const win = createWindow({
    appId: 'chat', title: 'LeekChat — #garden-general', icon: '💬',
    width: 540, height: 460, statusBar: 'connected · encrypted with vegetable-grade crypto',
  })

  let alive = true
  const rendered = new Set()
  let lastMsg = null

  const scroll = el('div', { class: 'chat-scroll' })
  const nameInput = el('input', {
    class: 'app-input', style: 'width:150px;',
    placeholder: CODENAMES[Math.floor(Math.random() * CODENAMES.length)],
    value: store.get('display_name', ''),
  })
  const textInput = el('input', { class: 'app-input', style: 'flex:1;', placeholder: 'say something into the garden...', maxlength: '500' })
  const sendBtn = el('button', { class: 'app-btn primary' }, 'Send')

  const compose = el('div', { class: 'chat-compose' }, nameInput, textInput, sendBtn)
  win.body.style.display = 'flex'
  win.body.style.flexDirection = 'column'
  win.body.append(scroll, compose)

  function addLine(node) {
    const pinned = scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight < 120
    scroll.append(node)
    if (pinned) scroll.scrollTop = scroll.scrollHeight
  }

  function sys(text) {
    addLine(el('div', { class: 'chat-day' }, text))
  }

  function renderMsg(m) {
    if (rendered.has(m.id)) return
    rendered.add(m.id)
    const self = m.name === (nameInput.value.trim() || null)
    addLine(el('div', { class: 'chat-msg' + (self ? ' self' : '') },
      el('div', { class: 'cm-head' },
        el('span', { class: 'cm-name' }, m.name),
        ` · ${fmtDate(m.ts)} ${fmtTime(m.ts)}`),
      el('div', { class: 'cm-text' }, m.text)))
    lastMsg = m
  }

  async function poll(initial = false) {
    if (!alive) return
    try {
      const msgs = await api('/api/chat')
      if (initial && !rendered.size) {
        sys(`— connected to #garden-general · ${msgs.length} messages loaded · be nice or be leeked —`)
      }
      for (const m of msgs) renderMsg(m)
      if (!initial) scrollToNew()
    } catch {}
  }

  let pendingCount = 0
  function scrollToNew() {
    if (pendingCount > 0) { pendingCount--; scroll.scrollTop = scroll.scrollHeight }
  }

  async function send() {
    const text = textInput.value.trim()
    if (!text || sendBtn.disabled) return
    const name = nameInput.value.trim() || nameInput.placeholder
    store.set('display_name', name)
    textInput.value = ''
    sendBtn.disabled = true
    try {
      const msg = await api('/api/chat', { method: 'POST', body: { name, text } })
      renderMsg(msg)
      pendingCount++
      scroll.scrollTop = scroll.scrollHeight
    } catch (e) {
      sys(`— message rejected by the void (${e.message}) —`)
    } finally {
      sendBtn.disabled = false
      textInput.focus()
    }
  }

  sendBtn.addEventListener('click', send)
  textInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') send() })

  win.onClose = () => { alive = false; clearInterval(timer) }
  const timer = setInterval(poll, 3000)
  poll(true)
}

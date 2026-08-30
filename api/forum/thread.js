var d = require('../_data')

module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    var body = await d.readBody(req)
    var title = String(body.title || '').slice(0, 120).trim()
    var text = String(body.body || '').slice(0, 2000).trim()
    var author = String(body.author || '').slice(0, 24).trim() || 'anon_qubit'
    if (!title || !text) return d.json(res, 400, { error: 'title and body required' })
    var now = new Date().toISOString()
    var t = { id: d.genId(), title: title, author: author, pinned: false, ts: now, posts: [{ id: d.genId(), author: author, ts: now, body: text }] }
    d.FORUM.threads.unshift(t)
    return d.json(res, 200, t)
  }
  return d.json(res, 404, { error: 'not found' })
}

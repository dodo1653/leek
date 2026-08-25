var d = require('../../_data')

module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    var body = await d.readBody(req)
    var text = String(body.body || '').slice(0, 2000).trim()
    var author = String(body.author || '').slice(0, 24).trim() || 'anon_leek'
    if (!text) return d.json(res, 400, { error: 'empty reply' })
    var t = d.FORUM.threads.find(function (x) { return x.id === req.query.id })
    if (!t) return d.json(res, 404, { error: 'no such thread' })
    t.posts.push({ id: d.genId(), author: author, ts: new Date().toISOString(), body: text })
    return d.json(res, 200, t)
  }
  return d.json(res, 404, { error: 'not found' })
}

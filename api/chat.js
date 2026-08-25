var d = require('./_data')

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    return d.json(res, 200, d.CHAT.slice(-200))
  }
  if (req.method === 'POST') {
    var body = await d.readBody(req)
    var text = String(body.text || '').slice(0, 500).trim()
    if (!text) return d.json(res, 400, { error: 'empty message' })
    var name = String(body.name || '').slice(0, 24).trim() || 'Anon Leek'
    var msg = { id: d.genId(), name: name, text: text, ts: new Date().toISOString() }
    d.CHAT.push(msg)
    return d.json(res, 200, msg)
  }
  return d.json(res, 404, { error: 'not found' })
}

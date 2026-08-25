var d = require('../../_data')

module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    var body = await d.readBody(req)
    var p = d.POLLS.find(function (x) { return x.id === req.query.id })
    if (!p) return d.json(res, 404, { error: 'no such poll' })
    if (p.finalized || p.status !== 'LIVE') return d.json(res, 400, { error: 'poll ended' })
    var idx = Number(body.choice)
    if (!(idx >= 0 && idx < p.choices.length)) return d.json(res, 400, { error: 'bad choice' })
    p.votes[idx]++
    return d.json(res, 200, { ok: true, votes: p.votes })
  }
  return d.json(res, 404, { error: 'not found' })
}

var d = require('../_data')

module.exports = function handler(req, res) {
  // [id] arrives via req.query.id on Vercel dynamic routes
  var t = d.FORUM.threads.find(function (x) { return x.id === req.query.id })
  return t ? d.json(res, 200, t) : d.json(res, 404, { error: 'not found' })
}

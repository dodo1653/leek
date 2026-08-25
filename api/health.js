var d = require('./_data')
module.exports = (req, res) => d.json(res, 200, { status: 'ok' })

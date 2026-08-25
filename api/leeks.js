var d = require('./_data')
module.exports = (req, res) => d.json(res, 200, d.LEEKS.slice().sort((a, b) => b.date.localeCompare(a.date)))

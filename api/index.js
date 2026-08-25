module.exports = (req, res) => {
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify({ status: 'ok', url: req.url }))
}

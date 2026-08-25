var d = require('../_data')

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    return d.json(res, 200, d.FORUM.threads.map(function (t) {
      return { id: t.id, title: t.title, author: t.author, pinned: t.pinned, ts: t.ts, postCount: t.posts.length, lastTs: t.posts[t.posts.length - 1].ts }
    }))
  }
  return d.json(res, 404, { error: 'not found' })
}

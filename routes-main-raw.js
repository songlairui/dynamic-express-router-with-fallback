const router = require('./helper.route')

router.get('/get', async (req, res) => {
  res.json({
    mark: 'app'
  })
})

router.post('/post', async (req, res) => {
  const payload = req.body
  res.json({ ...payload, mark: 'app' })
})

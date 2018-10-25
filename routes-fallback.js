const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

router.get('/get', async (req, res) => {
  res.json({
    mark: 'fallback'
  })
})

router.post('/post', bodyParser.json(), async (req, res) => {
  const payload = req.body
  res.json({ ...payload, mark: 'fallback - post' })
})

router.get('/fallback', async (req, res) => {
  res.json({ mark: 'fallback' })
})

router.post('/fallback', bodyParser.json(), async (req, res) => {
  const payload = req.body
  res.json({ ...payload, mark: 'fallback /fallback - post' })
})

router.post('/dissect', (req, res) => {
  const parser = bodyParser.json()
  parser(req, res, () => {
    const payload = req.body
    res.json({ ...payload, mark: 'fallback /fallback - post' })
  })
})

module.exports = router

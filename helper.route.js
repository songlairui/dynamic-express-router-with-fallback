const express = require('express')
const originRouter = express.Router()
const bodyParser = require('body-parser')

const methods = ['get', 'post', 'put', 'delete']

const router = new Proxy(originRouter, {
  get(instance, method) {
    if (methods.includes(method)) {
      return (url, cb) => {
        instance[method](url, (req, res, next) => {
          bodyParser.json()(req, res, () => {
            cb(req, res, next)
          })
        })
      }
    }
    return instance[method]
  }
})

module.exports = router

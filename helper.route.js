const express = require('express')
const originRouter = express.Router()
const bodyParser = require('body-parser')

const methods = ['get', 'post', 'put', 'delete']

const router = new Proxy(originRouter, {
  get(instance, method) {
    if (methods.includes(method)) {
      return (url, cb) => {
        instance[method](url, (req, res, next) => {
          if (Math.random() > 0.5) {
            console.info('随缘 - 使用自己的router')
            bodyParser.json()(req, res, () => {
              cb(req, res, next)
            })
          } else {
            console.warn('随缘 - 使用proxy')
            next()
          }
        })
      }
    }
    return instance[method]
  }
})

module.exports = router

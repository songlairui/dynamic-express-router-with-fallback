const express = require('express')
const proxyMiddleware = require('http-proxy-middleware')

const port = 3456
const fallbackPort = 34560

const proxyTable = {
  '/api': {
    target: `http://localhost:${fallbackPort}/`,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api'
    }
  }
}

const fallbackRoutes = require('./routes-fallback')
const fallbackApp = express()
fallbackApp.use('/api', fallbackRoutes)

const dynamicRouter = require('./routes-main-entracne')

const app = express()

app.use('/api', dynamicRouter)

// proxy api requests
Object.keys(proxyTable).forEach(context => {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

process.on('uncaughtException', function(err) {
  if (err.code === 'EADDRINUSE') {
    console.error('port ' + port + ' is in used')
  } else {
    console.error(err)
  }
  process.exit()
})

fallbackApp.listen(fallbackPort, err => {
  console.log(err || `fallbackApp listening on ${fallbackPort}`)
})

app.listen(port, err => {
  console.log(err || `app listening on ${port}`)
})

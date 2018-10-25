# express 动态路由

> 调试 webpack-dev-server 时，想要在 runtime 中决定使用 proxyTable 还是自己的路由

## 思路

express 原生不提供 unregister 的方法，但是 proxyMiddleWare 默认自带 fallback 效果，
通过这个 fallback 尝试实现预期效果

## 第一步 proxyMiddleWare fallback

两个 server， server1 的 proxyTable 设置为 server2：

- server1
  - Port 3456
  - routes:
    - [GET] /api/get
    - [POST] /api/post
- server2
  - Port 34560
  - routes:
    - [GET] /api/get
    - [POST] /api/post
    - [GET] /api/fallback
    - [POST] /api/fallback

执行如下命令进行测试：
```bash
curl 127.0.0.1:3456/api/get
curl 127.0.0.1:34560/api/get

curl 127.0.0.1:3456/api/fallback
curl 127.0.0.1:34560/api/fallback

curl -d '{"a": 123}' -H "Content-Type: application/json" -X POST http://localhost:3456/api/post
curl -d '{"a": 123}' -H "Content-Type: application/json" -X POST http://localhost:34560/api/post

curl -d '{"a": 123}' -H "Content-Type: application/json" -X POST http://localhost:34560/api/fallback
curl -d '{"a": 123}' -H "Content-Type: application/json" -X POST http://localhost:34560/api/fallback
```

两个server都有的路由，返回值均为自己路由中定义的值，
对server1访问没有定义的路由，会fallback到server2中去。

一处细节：
  server1 中没有定义的路由，在 fallback 到 server2 之前，是没有使用 `bodyParser.json()` 中间件的。

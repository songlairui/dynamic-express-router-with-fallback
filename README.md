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

两个 server 都有的路由，返回值均为自己路由中定义的值，
对 server1 访问没有定义的路由，会 fallback 到 server2 中去。

一处细节：
server1 中没有定义的路由，在 fallback 到 server2 之前，是没有使用 `bodyParser.json()` 中间件的。

## 第二步 使用蛮荒方式

蛮荒方式（即原始的回掉方式）使用 bodyParser

中间件的基本用法是 `(req, res, next) => {...}`, 猜想 `bodyParser.json()` 即这样的函数，进行使用，果真 OK。

## 第三步 根据条件使用路由

根据条件
调用 `next()` 则 fallback 到 server2 上
否则，使用自己的 router

```bash
curl -d '{"a": 123}' -H "Content-Type: application/json" -X POST http://localhost:3456/api/post
```

执行这一句，可能有两个返回结果

```json
{
    "a": 123,
    "mark": "fallback - post"
}
或
{
    "a": 123,
    "mark": "app"
}
```

# TODO

- [ ] 练习写测试脚本

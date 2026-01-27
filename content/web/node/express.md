---
sidebar_position: 13
tags: [Web, Node.js, Express.js]
---

# Express.js

## Middleware Function

### Principle

`next()/next(err)` OR res.end()/res.send()

### Template

```ts
function middleware(req, res, next) {
  next()
  // OR res.send();
}
```

```ts
function middleware(err, req, res, next) {
  next(err)
  // OR res.send();
}
```

### Use

```ts
app.use(middlewareFunction)
```

### Useful Middleware

- basicAuth
- bodyParser
- compiler
- cookieParser
- csrf: 跨域请求(依赖 session bodyparser)
- directory
- errorHandle
- favicon
- limit: 限制请求个数,防止 Dos 攻击
- logger
- methodOverride
- profiler: 置于所有中间件之前,记录响应时间和内存使用
- query
- responseTime
- router
- session
- static
- staticCache
- vhost

## Http

### Res

#### Response Local

res.locals 中的所有属性都会传递到模板的上下文中

在 app.js 中, use 页面控制器之前, 加入:

```ts
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})
```

所有的页面模板中便可以使用 `{{user}}`.

### Req

- `req.body.{{inputName}}`: 处理表单
- `req.params.routeName`: `/users/:id` -> `req.params.id`
- `req.query`: `queryString.parse()` 处理后的查询字符串对象

# Express Basic Notes

## Middleware Function

###  Principle: `next()/next(err)` OR res.end()/res.send() 

### Template

```js
function (req, res, next) {
    next();
    // OR res.send();
}

function (err, req, res, next) {
    next(err);
    // OR res.send();
}
```

### Use

```js
app.use(middlewareFunction);
```

## Http

### Res

#### res.local

res.locals中的所有属性都会传递到模板的上下文中

在app.js中, use页面控制器之前, 加入:

```js
app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});
```

所有的页面模板中便可以使用{{user}}

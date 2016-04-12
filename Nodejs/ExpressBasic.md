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


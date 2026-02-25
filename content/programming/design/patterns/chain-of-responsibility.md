---
sidebar_position: 13
tags: [Programming, Design, Design Pattern, Behavioral Pattern]
---

# Chain of Responsibility

一种将请求在一串对象中传递的方式, 寻找可以处理这个请求的对象:

- 请求发送者只需知道链中的第一个节点, 从而降低发送者和一组接收者之间的强耦合.
- 请求发送者可以任意选择第一个节点, 从而减少请求在链中的传递次数.
- 职责链中的节点数量和顺序可以自由变化.
- 符合开放封闭原则.

:::tip[CoR Use Case]

- AOP: Aspect Oriented Programming.
- Middlewares:
  - Redux.
  - Express/Koa.
  - NestJS.
- Request handling.
- Logging and error handling.
- Event handling: DOM event capture and bubble chian.
- Authorization and authentication.
- JavaScript Prototype chain.
- JavaScript Scope chain.

:::

```ts
class Creature {
  constructor(name, attack, defense) {
    this.name = name
    this.attack = attack
    this.defense = defense
  }

  toString() {
    return `${this.name} (${this.attack}/${this.defense})`
  }
}

// Link Node.
class CreatureModifier {
  constructor(creature) {
    this.creature = creature
    this.next = null
  }

  // Build chains.
  add(modifier) {
    if (this.next)
      this.next.add(modifier)
    else this.next = modifier
  }

  // Pass objects along to chains.
  handle() {
    if (this.next)
      this.next.handle()
  }
}

class NoBonusesModifier extends CreatureModifier {
  constructor(creature) {
    super(creature)
    console.log('New')
  }

  handle() {
    console.log('No bonuses for you!')
  }
}

class DoubleAttackModifier extends CreatureModifier {
  constructor(creature) {
    super(creature)
    console.log('New')
  }

  handle() {
    console.log(`Doubling ${this.creature.name}'s attack`)
    this.creature.attack *= 2
    super.handle() // Call next();
  }
}

class IncreaseDefenseModifier extends CreatureModifier {
  constructor(creature) {
    super(creature)
    console.log('New')
  }

  handle() {
    if (this.creature.attack <= 2) {
      console.log(`Increasing ${this.creature.name}'s defense`)
      this.creature.defense++
    }
    super.handle() // Call next();
  }
}

const peekachu = new Creature('Peekachu', 1, 1)
console.log(peekachu.toString())

const root = new CreatureModifier(peekachu)
root.add(new DoubleAttackModifier(peekachu))
root.add(new IncreaseDefenseModifier(peekachu))
// Chain: creatureModifier -> doubleAttackModifier -> increaseDefenseModifier.
root.handle()

console.log(peekachu.toString())
```

```ts
import { Buffer } from 'node:buffer'

class Koa extends EventEmitter {
  constructor() {
    super()
    this.middlewares = []
  }

  use(fn) {
    this.middlewares.push(fn)
  }

  compose(middlewares, ctx) {
    const dispatch = (index) => {
      // End of chain.
      if (index === middlewares.length)
        return Promise.resolve()

      // `next` function: call next middleware recursively.
      const next = () => dispatch(index + 1)

      // Call current middleware.
      const middleware = middlewares[index]
      return Promise.resolve(middleware(ctx, next))
    }

    return dispatch(0)
  }

  handleRequest(req, res) {
    // When ctx.body doesn't change, statusCode contains '404'.
    res.statusCode = 404

    // Create context proxy for `req` and `res` operations.
    // eslint-disable-next-line react-naming-convention/context-name -- Not a React context.
    const ctx = this.createContext(req, res)

    // Middleware (open api for Koa users).
    const fn = this.compose(this.middlewares, ctx)

    fn.then(() => {
      if (typeof ctx.body === 'object' && ctx.body !== null) {
        res.setHeader('Content-Type', 'application/json;charset=utf8')
        res.end(JSON.stringify(ctx.body))
      } else if (ctx.body instanceof Stream) {
        ctx.body.pipe(res)
      } else if (typeof ctx.body === 'string' || Buffer.isBuffer(ctx.body)) {
        res.setHeader('Content-Type', 'text/htmlCharset=utf8')
        res.end(ctx.body)
      } else {
        res.end('Not Found')
      }
    }).catch((err) => {
      this.emit('error', err)
      res.statusCode = 500
      res.end('Internal Server Error')
    })
  }

  listen(...args) {
    const server = http.createServer(this.handleRequest.bind(this))
    server.listen(...args)
  }
}

const app = new Koa()

app.use(async (ctx, next) => {
  console.log(1)
  await next()
  console.log(2)
})

app.use(async (ctx, next) => {
  console.log(3)

  const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('3.5')
      resolve()
    }, 1000)
  })

  await p.then()
  await next()
  console.log(4)
  ctx.body = 'Hello Koa'
})

app.listen(2323, () => {
  console.log('Koa server are listening to http://localhost:2323 ...')
})
```

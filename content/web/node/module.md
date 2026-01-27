---
sidebar_position: 5
tags: [Web, Node.js, Module]
---

# Module

- CommonJS 模块在执行阶段同步加载子模块文件,
  ES6 模块在预处理阶段加载子模块文件, ES6 模块在执行阶段也会加载子模块文件, 不过会使用预处理阶段的缓存.
- CommonJS 模块同步加载并执行模块文件, ES6 模块提前加载并执行模块文件.
  异步通常被理解为延后一个时间节点执行, 所以说成异步加载是错误的.
- 从形式上看,
  CommonJS 模块整体导出一个包含若干个变量的对象,
  ES6 模块分开导出单个变量.

## CommonJS

- `CommonJS` 模块一般由包管理器提供的运行时实现.
- 由于 `require` 语句直接分割了执行的代码块,
  `CommonJS` 模块的导入导出语句的位置会影响模块代码语句的执行结果.

```ts
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

function Module(id) {
  this.id = id
  this.exports = {}
}

Module.wrapper = [
  '(function(exports, module, Require, __dirname, __filename) {',
  '})',
]

Module._extensions = {
  '.js': function (module) {
    const content = fs.readFileSync(module.id, 'utf8')
    const fnStr = Module.wrapper[0] + content + Module.wrapper[1]
    const fn = vm.runInThisContext(fnStr)
    fn.call(
      module.exports, // Bind `this` to `module.exports`
      module.exports,
      module,
      Require,
      _dirname,
      _filename
    )
  },
  '.json': function (module) {
    const json = fs.readFileSync(module.id, 'utf8')
    module.exports = JSON.parse(json) // 把文件的结果放在exports属性上
  },
}

function Require(modulePath) {
  const absPathname = path.resolve(__dirname, modulePath)
  const module = new Module(absPathname)
  tryModuleLoad(module)
  return module.exports
}

function tryModuleLoad(module) {
  const extension = path.extname(module.id)
  Module._extensions[extension](module)
}
```

## ESM

- `ES6` 模块借助 `JS` 引擎实现.
  `JS` 引擎实现了 `ES6` 模块的底层核心逻辑.
- `ES6` 模块有 5 种状态,
  分别为 `unlinked`, `linking`, `linked`, `evaluating` and `evaluated`
  (Module Environment Records).
- 由于连接阶段会给导入模块变量创建绑定并初始化为子模块的对应变量,
  子模块的对应变量在评估阶段会先被赋值,
  所以导入模块变量获得了和函数声明变量一样的提升效果.
  `ES6` 模块的 `import/export` 位置不影响模块代码语句的执行结果.
- Experimental `.mjs` file.

## CallBack

编写具有回调函数参数的模块:

```ts
function foo(x, y, callback) {
  try {
    if (paramNotValid())
      throw new Error('Invalid parameters!')
    else
      callback(null, param)
  } catch (error) {
    callback(error, param)
  }
}

foo(a, b, (err, param) => {
  if (err)
    processError()
  else
    process()
})
```

向定义最内层回调, 可避免回套嵌套:

```ts
server.on('request', (req, res) => {
  const render = function (wsData) {
    page = pageRender(req, session, userData, wsData)
  }
  const getWsInfo = function (userData) {
    ws.get(req, render)
  }
  const getDbInfo = function (session) {
    db.get(session.user, getWsInfo)
  }
  const getMemCached = function (req, res) {
    memcached.getSession(req, getDbInfo)
  }
})
```

## Resolution

`const x = require('./module')`:

- `/root/src/module.js`
- `/root/src/module/package.json` + `{ "main": "lib/mainModule.js" }`
  = `/root/src/module/lib/mainModule.js`
- `/root/src/module/index.js`

`const x = require('module')`:

- `/root/src/node_modules/module.js`
- `/root/src/node_modules/module/package.json` (if it specifies a `main` property)
- `/root/src/node_modules/module/index.js`
- `/root/node_modules/module.js`
- `/root/node_modules/module/package.json` (if it specifies a `main` property)
- `/root/node_modules/module/index.js`
- `/node_modules/module.js`
- `/node_modules/module/package.json` (if it specifies a `main` property)
- `/node_modules/module/index.js`

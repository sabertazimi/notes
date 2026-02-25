---
sidebar_position: 23
tags: [Web, JavaScript, ECMAScript, Module, CJS, AMD, UMD, ESM]
---

# Module

## Principles

CRUST:

- Consistent: ES6 API design `Array.XXX(fn)`.
- Resilient: jQuery sizzle API design `$(element)`/`$(selector)`/`$(selector, context)`.
- Unambiguous.
- Simple: Simple `fetch` API design.
- Tiny: Tiny surface areas.

## Namespace

- 命名空间.
- 依赖模式.
- 私有属性/特权方法.
- 初始化模式.
- 揭示模式: 公共接口.
- 即时函数模式.

```ts
APP.namespace = function (namespaceString) {
  let parts = namespaceString.split('.')
  let parent = APP
  let i
  // strip redundant leading global
  if (parts[0] === 'APP') {
    // remove leading global
    parts = parts.slice(1)
  }
  for (i = 0; i < parts.length; i += 1) {
    // create a property if it doesn't exist
    if (typeof parent[parts[i]] === 'undefined')
      parent[parts[i]] = {}

    // 关键: 向内嵌套
    parent = parent[parts[i]]
  }
  // 返回最内层模块名
  return parent
}
```

```ts
// assign returned value to a local var
const module2 = APP.namespace('APP.modules.module2')
const truthy = module2 === APP.modules.module2 // true
// skip initial `APP`
APP.namespace('modules.module51')
// long namespace
APP.namespace('once.upon.a.time.there.was.this.long.nested.property')
```

通过传参匿名函数, 创建命名空间, 进行模块包裹:

```ts
const app = {}

;(function (exports) {
  ;(function (exports) {
    const api = {
      moduleExists: function test() {
        return true
      },
    }
    // 闭包式继承,扩展exports对象为api对象
    $.extend(exports, api)
  })(typeof exports === 'undefined' ? window : exports)
  // 将api对象绑定至app对象上
})(app)
```

```ts
// global object
const APP = {}
// constructors
APP.Parent = function () {}
APP.Child = function () {}
// a variable
APP.some_var = 1
// an object container
APP.modules = {}
// nested objects
APP.modules.module1 = {}
APP.modules.module1.data = { a: 1, b: 2 }
APP.modules.module2 = {}
```

```ts
// 命名空间模式
APP.namespace('APP.utilities.array')

// 形参: 导入全局变量
APP.utilities.array = (function (app, global) {
  // 依赖模式
  const uObj = app.utilities.object
  const uLang = app.utilities.lang

  // 私有属性
  const arrStr = '[object Array]'
  const toStr = Object.prototype.toString

  // 私有方法
  const inArray = function (haystack, needle) {
    for (let i = 0, max = haystack.length; i < max; i += 1) {
      if (haystack[i] === needle)
        return i
    }

    return -1
  }
  const isArray = function (a) {
    return toStr.call(a) === arrayString
  }

  // 初始化模式:
  // 初始化代码, 只执行一次.

  // 揭示公共接口.
  return {
    isArray,
    indexOf: inArray,
  }
})(APP, this)
```

## Sandbox

- 私有属性绑定至 this/prototype.
- 特权方法绑定至 modules/prototype.

```ts
function Sandbox(...args) {
  // the last argument is the callback
  const callback = args.pop()
  // modules can be passed as an array or as individual parameters
  let modules = args[0] && typeof args[0] === 'string' ? args : args[0]

  // make sure the function is called
  // as a constructor
  if (!(this instanceof Sandbox))
    return new Sandbox(modules, callback)

  // add properties to `this` as needed:
  this.a = 1
  this.b = 2

  // now add modules to the core `this` object
  // no modules or "*" both mean "use all modules"
  if (!modules || modules === '*') {
    modules = []
    for (const i in Sandbox.modules) {
      if (Object.prototype.hasOwnProperty.call(Sandbox.modules, i))
        modules.push(i)
    }
  }

  // initialize the required modules
  for (let i = 0; i < modules.length; i += 1)
    Sandbox.modules[modules[i]](this)

  // call the callback
  callback(this)
}
```

```ts
// any prototype properties as needed
Sandbox.prototype = {
  name: 'My Application',
  version: '1.0',
  getName() {
    return this.name
  },
}
```

静态属性: 使用添加的方法/模块:

```ts
Sandbox.modules = {}
Sandbox.modules.dom = function (box) {
  box.getElement = function () {}
  box.getStyle = function () {}
  box.foo = 'bar'
}
Sandbox.modules.event = function (box) {
  // access to the Sandbox prototype if needed:
  // box.constructor.prototype.m = "mmm";
  box.attachEvent = function () {}
  box.detachEvent = function () {}
}
Sandbox.modules.ajax = function (box) {
  box.makeRequest = function () {}
  box.getResponse = function () {}
}
```

```ts
Sandbox(['ajax', 'event'], (box) => {
  // console.log(box);
})

Sandbox('*', (box) => {
  // console.log(box);
})
Sandbox((box) => {
  // console.log(box);
})

Sandbox('dom', 'event', (box) => {
  // work with dom and event
  Sandbox('ajax', (box) => {
    // another "box" object
    // this "box" is not the same as
    // the "box" outside this function
    // ...
    // done with Ajax
  })
  // no trace of Ajax module here
})
```

## CommonJS

- 无论一个模块在 `require()` 中被引用多少次, 模块永远是单例, 只会被加载一次.
- 模块第一次加载后会被缓存, 后续加载会取得缓存的模块.
- 模块加载是模块系统执行的同步操作, `require()` 可以位于条件语句中.

[Minimal CJS bundler](https://github.com/sabertazimi/hust-web/blob/v2.7.0/js/bundler/index.js):

```ts
require.cache = Object.create(null)

// Construct 'require', 'module' and 'exports':
function require(moduleId) {
  if (!(moduleId in require.cache)) {
    const code = readFile(moduleId)
    const module = { exports: {} }
    require.cache[moduleId] = module

    // Bind code to module.exports:
    const wrapper = new Function('require, exports, module', code)
    wrapper(require, module.exports, module)
  }
  return require.cache[moduleId].exports
}
```

## AMD

Asynchronous module definition:

```ts
// ID 为 'moduleA' 的模块定义:
// moduleA 依赖 moduleB.
// moduleB 会异步加载.
define('moduleA', ['moduleB'], (moduleB) => {
  return {
    stuff: moduleB.doStuff(),
  }
})
```

```ts
define('moduleA', ['require', 'exports'], (require, exports) => {
  const moduleB = require('moduleB')

  if (condition) {
    const moduleC = require('moduleC')
  }

  exports.stuff = moduleB.doStuff()
})
```

## UMD

Universal module definition:

- 判断是否支持 AMD (define), 存在则使用 AMD 方式加载模块.
- 判断是否支持 Node.js 的模块 (exports), 存在则使用 Node.js 模块模式.

```ts
/**
 * UMD Boilerplate.
 */
;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], () => {
      return factory(root)
    })
  } else if (typeof exports === 'object') {
    module.exports = factory(root)
  } else {
    root.myPlugin = factory(root)
  }
})(
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
      ? window
      : this,
  (window) => {
    'use strict'

    // Module code goes here...
    return {}
  }
)
```

## ESM

### Features

- Singleton:
  - 模块是单例.
  - 模块只能加载一次:
    同一个模块无论在一个页面中被加载多少次,
    也不管它是如何加载的, 实际上都只会加载一次.
- Imports:
  - 模块可以请求加载其他模块.
  - 模块支持循环依赖.
  - `Static` and `Read-only` imports.
- Exports:
  - 模块可以定义公共接口.
  - 其他模块可以基于这个公共接口观察和交互.
- Local Scope:
  - 模块不共享全局命名空间.
  - 模块顶级 `this` 的值是 `undefined` (传统脚本中是 `window`).
  - 模块中的 `var` 声明不会添加到 `window` 对象.
- Async:
  - 模块在浏览器中是异步加载和执行的.
  - 模块代码只在加载后执行.
  - 解析到 `<script type="module">` 标签后会立即下载模块文件,
    但**执行会延迟**到 HTML 文档解析完成 (`<script defer>`).
- Strict:
  - 模块代码默认在严格模式下执行.
- Static:
  - `Static` and `Read-only` imports: 模块是静态结构.
    - Imported module is `Pre-parsed`:
      imported modules get run first,
      code which imports module gets executed after.
    - Imported module is `Read-only`:
      code which imports module cannot modify imported module,
      only module which exports them can change its value.
  - Static analysis.
  - Tree shaking.
  - Compact bundling.
  - Faster imports lookup.

```html
<!-- 支持模块的浏览器会执行这段脚本 -->
<!-- 不支持模块的浏览器不会执行这段脚本 -->
<script type="module" src="module.js"></script>

<!-- 支持模块的浏览器不会执行这段脚本 -->
<!-- 不支持模块的浏览器会执行这段脚本 -->
<script nomodule src="script.js"></script>
```

### Syntax

```ts
import * as Bar from './bar.js' // Object.freeze(Bar)
import module from './module.js'
import { lastName as surname } from './profile.js'
import './foo.js' // Load effects
```

```ts
export const firstName = 'Michael'
export const lastName = 'Jackson'
export const year = 1958
export function foo() {}
export function* bar() {}
export class Foo {}
```

```ts
// profile.js
const firstName = 'Michael'
const lastName = 'Jackson'
const year = 1958

export { firstName, lastName, year }
```

```ts
export { default as Article } from './Article'
// 接口改名
export { foo as myFoo } from 'node:module'

// 整体输出
export * from 'utils'
```

### Imports

Import meta `import.meta`:

```ts
// index.mjs
import './index2.mjs?someURLInfo=5'

// index2.mjs
new URL(import.meta.url).searchParams.get('someURLInfo') // 5
```

```ts
const urlOfData = new URL('data.txt', import.meta.url)
```

Import assertion:

```ts
import data from './data.json' assert { type: 'json' }

console.log(data)
```

Import map `importmap`:

```html
<script type="importmap">
  {
    "imports": {
      "ms": "https://cdn.skypack.dev/ms"
      "lodash": "https://cdn.skypack.dev/lodash",
      "lodash": "https://cdn.skypack.dev/lodash/",
    }
  }
</script>
<script type="module">
  import get from 'lodash/get.js'
  import lodash from 'lodash'
  import('lodash').then((_) => {})
</script>
```

:::tip[Imports Order]

- Polyfills: `import 'reflect-metadata';`.
- Node builtin modules: `import fs from 'node:fs';`.
- External modules: `import { motion } from 'framer-motion';`.
- Internal modules: `import { UserService } from 'src/services/userService';`.
- Parent directory modules: `import foo from '../foo'; import qux from '../../foo/qux';`.
- Same/Sibling directory modules: `import bar from './bar'; import baz from './bar/baz';`.

:::

### Exports

- CommonJS 模块是运行时加载, ES6 模块是编译时输出接口.
- CommonJS 是单个值导出, ES6 Module 可以导出多个.
- CommonJS 是动态语法可以写在判断里, ES6 Module 是静态语法只能写在顶层.
- CommonJS 的 `this` 是当前模块, ES6 Module 的 `this` 是 `undefined`.
- CommonJS 模块输出的是一个值的拷贝,
  ES6 模块 `export` 分多种情况:
  1. `export default xxx` 输出 `value`:
     `defaultThing` and `anotherDefaultThing` shows ES6 export default value,
  2. `export xxx` 输出 `reference`:
     `importedThing` and `module.thing` shows ES6 export live reference,
  3. **`Destructuring`** behavior create a brand new value.
  4. function/class special case:
     `export default function/class thing() {}; // function/class expressions`
     export live reference,
     `function/class thing() {}; export default thing; // function/class statements`
     export default value.

Export default value:

```ts
// module.js
// eslint-disable-next-line import/no-mutable-exports -- for demonstration
let thing = 'initial'

export { thing }
export default thing

setTimeout(() => {
  thing = 'changed'
}, 500)
```

```ts
// main.js
// eslint-disable-next-line import/no-duplicates, import/no-named-default -- for demonstration
import { default as defaultThing, thing } from './module.js'
// eslint-disable-next-line import/no-duplicates -- for demonstration
import anotherDefaultThing from './module.js'

setTimeout(() => {
  console.log(thing) // "changed"
  console.log(defaultThing) // "initial"
  console.log(anotherDefaultThing) // "initial"
}, 1000)
```

Export live reference:

```ts
// module.js
// eslint-disable-next-line import/no-mutable-exports -- for demonstration
export let thing = 'initial'

setTimeout(() => {
  thing = 'changed'
}, 500)
```

```ts
// main.js
import { thing as importedThing } from './module.js'

const module = await import('./module.js')
// eslint-disable-next-line prefer-const -- for demonstration
let { thing } = await import('./module.js') // Destructuring behavior

setTimeout(() => {
  console.log(importedThing) // "changed"
  console.log(module.thing) // "changed"
  console.log(thing) // "initial"
}, 1000)
```

To sum up:

```ts
// Live reference:
// eslint-disable-next-line import/no-duplicates -- for demonstration
import { thing } from './module.js'
// eslint-disable-next-line import/no-duplicates -- for demonstration
import { thing as otherName } from './module.js'

// Current value:
const { thing } = await import('./module.js')

// Live reference:
export { thing }
export { thing as otherName }
export { thing as default }
export default function thing() {}

// Current value:
export default thing
export default 'hello!'
```

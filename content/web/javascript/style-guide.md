---
sidebar_position: 29
tags: [Web, JavaScript, ECMAScript, Style Guide, ESLint]
---

# Style Guide

## ESLint

- [Promise](https://github.com/xjamundx/eslint-plugin-promise)
- [Import](https://github.com/import-js/eslint-plugin-import)
- [Unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn)
- [SonarJS: Bug and Code Smell Detection](https://github.com/SonarSource/eslint-plugin-sonarjs)
- [Functional](https://github.com/jonaskello/eslint-plugin-functional)
- [JSX A11Y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- [Browser Compatibility](https://github.com/amilajack/eslint-plugin-compat)
- [JSDoc](https://github.com/gajus/eslint-plugin-jsdoc)
- [TSDoc](https://github.com/microsoft/tsdoc)
- [Node](https://github.com/weiran-zsd/eslint-plugin-node)
- [Node Security](https://github.com/nodesecurity/eslint-plugin-security)
- [TypeScript Import Resolver](https://github.com/alexgorbatchev/eslint-import-resolver-typescript)

```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:unicorn/recommended",
    "plugin:promise/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": [
    "import",
    "jsx-a11y",
    "react",
    "react-hooks",
    "@typescript-eslint"
  ],
  "settings": {
    "react": {
      "version": "detect"
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": "./"
      }
    }
  },
  "rules": {
    "react/prop-types": 0,
    "react/jsx-props-no-spreading": 0
  }
}
```

## Naming Conventions

- 变量: 名词前缀.
- 方法 / 函数: 动词前缀.
- `_method`: 表示私有化方法.
- 普通函数: 驼峰命名法 (camelCase).
- 构造函数: 帕斯卡命名法 (PascalCase).
- 缩略词和缩写都必须是全部大写 / 小写.
- 对于 `jQuery` 对象的变量使用 `$` 作为前缀.

## Variable

- No single `let/const` for multiple variables.
- Sort `let/const`.
- No chains assignment (create implicit global variable).
- Prefer `()` wrap multiple line.

## String

- Prefer `'` not `"`.
- Prefer template literals not `'str1' + 'str2'`.

## Object

- Prefer literal not `Object()` constructor.
- Prefer object-shorthand.
- Prefer `Object.prototype.XX` not `object.xx`.
- Prefer object spread (`...`) not `object.assign`:

```ts
// very bad
const original = { a: 1, b: 2 }
const copy = Object.assign(original, { c: 3 }) // 变异的 `original` ಠ_ಠ
delete copy.a // 这....

// bad
const original = { a: 1, b: 2 }
const copy = Object.assign({}, original, { c: 3 })

// good
const original = { a: 1, b: 2 }
const copy = { ...original, c: 3 } // copy => { a: 1, b: 2, c: 3 }

const { a, ...noA } = copy // noA => { b: 2, c: 3 }
```

- Prefer `.` for static name, prefer `[]` for variable name:

```ts
// good
const isJedi = luke.jedi

function getProp(prop) {
  return luke[prop]
}
```

## Array

- Prefer literal.
- Prefer `push` not `[]`.
- Prefer array spread (`...`) (best) or `Array.from` (good):

```ts
const foo = document.querySelectorAll('.foo')

// good
const nodes = Array.from(foo)

// best
const nodes = [...foo]
```

## Expression

`if` 语句使用 ToBoolean 的抽象方法来计算表达式的结果:

- `Object`: `true`.
- `undefined`: `false`.
- `null`: `false`.
- `boolean`: 布尔值的取值.
- `number`: 如果为 `+0`/`-0`/`NaN` 值为 `false`, 否则为 `true`.
- `string`: 如果是一个空字符串 `''` 值为 `false`, 否则为 `true`.

对于布尔值使用简写, 但是对于字符串和数字进行显式比较:

```ts
// bad
if (isValid === true) {
  // ...
}

// good
if (isValid) {
  // ...
}

// bad
if (someName) {
  // ...
}

// good
if (someName !== '') {
  // ...
}

// bad
if (collection.length) {
  // ...
}

// good
if (collection.length > 0) {
  // ...
}
```

- Prefer `{}` warp `case` when exists `const`/`let`/`function`/`class` declaration:

```ts
// good
switch (foo) {
  case 1: {
    const x = 1
    break
  }
  case 2: {
    const y = 2
    break
  }
  case 3: {
    function f() {
      // ...
    }
    break
  }
  case 4:
    bar()
    break
  default: {
    class C {}
  }
}
```

## Function

- No reassign parameters (implicit side effect and bad performance).
- Prefer `...args` not `arguments`.
- Prefer ES6 default parameters not default expression pattern.
- Arrow function: prefer `()` wrap multiple line return value.

## Destructuring

对于多个返回值使用对象解构, 而不是数组解构:

```ts
// bad
function processInputBad(input) {
  // 处理代码...
  return [left, right, top, bottom]
}

// 调用者需要考虑返回数据的顺序.
const [left, __, top] = processInputBad(input)

// good
function processInput(input) {
  // 处理代码 ...
  process()

  return { left, right, top, bottom }
}

// 调用者只选择他们需要的数据.
const { left, top } = processInput(input)
```

## Module

- No duplicated export path:

```ts
// bad
// import foo from 'foo';
// import { named1, named2 } from 'foo';

// good
import foo, { named1, named2 } from 'foo'
```

- No export `let`:

```ts
// bad
// let foo = 3;
// export { foo };

// good
const foo = 3
export { foo }
```

## Iterator and Generator

- 使用 `Object.keys() / Object.values() / Object.entries()` 迭代对象生成数组.
- 使用 `map/reduce/filter/any/every/some/find/findIndex/ ...` 遍历数组.
- Prefer functional style iterator:

```ts
const numbers = [1, 2, 3, 4, 5]

// bad
let sum = 0
for (const num of numbers)
  sum += num

console.log(sum === 15)

// good
let sum = 0
numbers.forEach((num) => {
  sum += num
})
console.log(sum === 15)

// best (use the functional force)
const sum = numbers.reduce((total, num) => total + num, 0)
console.log(sum === 15)

// bad
const increasedByOne = []
for (let i = 0; i < numbers.length; i++)
  increasedByOne.push(numbers[i] + 1)

// good
const increasedByOne = []
numbers.forEach((num) => {
  increasedByOne.push(num + 1)
})

// best (keeping it functional)
const increasedByOne = numbers.map(num => num + 1)
```

## Spacing

- 键入最后一个运算符后再换行, 运算符置于行尾可使 `Automatic Semicolon Insertion` 机制失效.
- 换行后保持 2 个缩进层次.
- Good places to use a white space include:
  - `,`/`;` 后.
  - `+`,`-`,`*`,`/`,`<`,`>`,`=` 前后.
  - `function () {}`.
  - `function foo() {}`.
  - `} if/for/while () {}`.
  - `} else {}`.
  - inner `{}`.
  - No space inner `()` `[]`.

```ts
let d = 0
let a = b + 1

if (a && b && c) {
  d = a % c
  a += d
}
```

## Comments

`JSDoc` [best practice](https://deno.com/blog/document-javascript-package):

- 插入空行与统一缩进.
- Write a concise summary:
  First paragraph comment should be concise description helping quick understanding.
- Provide good type information.
- Use tags:
  Tags like `@param`, `@returns`, and `@typeParam` provide more information.
- Add examples:
  Examples `@example` help users quickly understand how to use your library.
- Document everything:
  Document every symbol exposing to users.
- Link internally:
  Use `@link`, `@linkcode`, and `@linkplain` to link to other parts of documentation.
- Test documentation:
  Use `deno test --doc` to type check,
  and `deno doc --lint` to check for rest issues.

```ts
/**
 * comments
 * comments
 */

/**
 * @module app
 * @namespace APP
 */

/**
 * @class mathStuff
 */

/**
 * @property propertyName description.
 * @type {import('@jest/types').Config}
 */

/**
 * @constructor
 * @method sum
 * @param {number} id
 * @param {string} instructions
 * @returns {number} result
 */
```

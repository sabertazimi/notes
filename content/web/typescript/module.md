---
sidebar_position: 2
tags: [Web, TypeScript, Module]
---

# Modules

[Module types search](https://microsoft.github.io/TypeSearch):

| Declaration Type | Namespace | Type | Value |
| :--------------- | :-------- | :--- | :---- |
| Namespace        | X         |      | X     |
| Class            |           | X    | X     |
| Enum             |           | X    | X     |
| Interface        |           | X    |       |
| Type Alias       |           | X    |       |
| Function         |           |      | X     |
| Variable         |           |      | X     |

> **Value** means truly output JavaScript.

## Globals Definition

```json
{
  "include": ["./src/**/*", "globals.d.ts", "index.d.ts"]
}
```

```ts
declare module '*.css'
// => import * as foo from './some/file.css';

declare module '*.png' {
  const value: unknown
  export = value
}
// => import logo from './logo.png';
// <img src={logo as string} />

declare module '*.jpg' {
  const value: unknown
  export = value
}
```

`globals.d.ts`:

```ts
// npm i -D @types/react @types/react-dom
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
    interface ElementClass extends React.Component<any> {
      render: () => React.ReactNode
    }
  }
}
```

## Library Definition

`lib.d.ts`:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es6", "dom"]
  }
}
```

## Namespace

Namespace aliases:

```ts
import polygons = Shapes.Polygons

namespace Shapes {
  export namespace Polygons {
    export class Triangle {}
    export class Square {}
  }
}

const sq = new polygons.Square() // Same as 'new Shapes.Polygons.Square()'
```

Library namespace declaration
with [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-namespaces-with-classes-functions-and-enums):

```ts
export = React
export as namespace React

declare namespace React {
  type ElementType<P = any>
    = | {
      [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K]
        ? K
        : never
    }[keyof JSX.IntrinsicElements]
    | ComponentType<P>
}
```

`namespace` compiles to `IIFE` pattern:

```ts
namespace Utility {
  export function log(msg) {
    console.log(msg)
  }
  export function error(msg) {
    console.log(msg)
  }
}

;(function (Utility) {
  Utility.log = log
  Utility.log = error
})(Utility || (Utility = {}))
```

:::caution[No Namespace]

Unless authoring DefinitelyTyped type definitions for existing package,
**do not use namespaces**.

Namespaces do not match up to modern JavaScript module semantics,
their automatic member assignments can make code confusing to read.

:::

## Module Resolution

### Classic Module Resolution

`import { a } from './module'`:

- `/root/src/folder/module.ts`.
- `/root/src/folder/module.d.ts`.

`import { a } from 'module'`:

- `/root/src/folder/module.ts`.
- `/root/src/folder/module.d.ts`.
- `/root/src/module.ts`.
- `/root/src/module.d.ts`.
- `/root/module.ts`.
- `/root/module.d.ts`.
- `/module.ts`.
- `/module.d.ts`.

### Node Module Resolution

`const x = require('./module')`:

- `/root/src/module.ts`.
- `/root/src/module.tsx`.
- `/root/src/module.d.ts`.
- `/root/src/module/package.json` + `{ "types": "lib/mainModule.ts" }`
  = `/root/src/module/lib/mainModule.ts`.
- `/root/src/module/index.ts`.
- `/root/src/module/index.tsx`.
- `/root/src/module/index.d.ts`.

`const x = require('module')`:

- `/root/src/node_modules/module.ts`.
- `/root/src/node_modules/module.tsx`.
- `/root/src/node_modules/module.d.ts`.
- `/root/src/node_modules/module/package.json` (if it specifies a `types` property).
- `/root/src/node_modules/@types/module.d.ts`.
- `/root/src/node_modules/module/index.ts`.
- `/root/src/node_modules/module/index.tsx`.
- `/root/src/node_modules/module/index.d.ts`.
- `/root/node_modules/module.ts`.
- `/root/node_modules/module.tsx`.
- `/root/node_modules/module.d.ts`.
- `/root/node_modules/module/package.json` (if it specifies a `types` property).
- `/root/node_modules/@types/module.d.ts`.
- `/root/node_modules/module/index.ts`.
- `/root/node_modules/module/index.tsx`.
- `/root/node_modules/module/index.d.ts`.
- `/node_modules/module.ts`.
- `/node_modules/module.tsx`.
- `/node_modules/module.d.ts`.
- `/node_modules/module/package.json` (if it specifies a `types` property).
- `/node_modules/@types/module.d.ts`.
- `/node_modules/module/index.ts`.
- `/node_modules/module/index.tsx`.
- `/node_modules/module/index.d.ts`.

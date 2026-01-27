---
sidebar_position: 1
tags: [Web, TypeScript, Toolchain]
---

# Toolchain

## Installation

```bash
npm i -D typescript
npm i -D react react-dom @types/node @types/react @types/react-dom
```

## Configuration

```bash
npx tsconfig.json
npx tsc --init
```

```bash
npm i -D @tsconfig/create-react-app
```

Basic [`tsconfig.json`](https://www.typescriptlang.org/tsconfig):

- [`extends`](https://github.com/tsconfig/bases):
  - `@tsconfig/recommended/tsconfig.json`.
  - `@tsconfig/create-react-app/tsconfig.json`.
  - `@tsconfig/node16/tsconfig.json`.
  - `@tsconfig/deno/tsconfig.json`.
- `include`.
- `exclude`.
- `buildOptions`.
- `compilerOptions`.
- `watchOptions`.
- `tsNode`.

```json
{
  "include": ["./src/**/*"],
  "exclude": ["node_modules", "build", "dist", "coverage"],
  "compilerOptions": {
    /* 基本选项 */
    "target": "ES2022", // 'ES3', 'ES5', 'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "NodeNext", // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": ["ES2022"], // 指定要包含在编译中的库文件
    "allowJs": true, // 允许编译 JavaScript 文件
    "checkJs": true, // 报告 JavaScript 文件中的错误
    "jsx": "react", // 'preserve', 'react-native', or 'react'
    "declaration": true, // 生成相应的 '.d.ts' 文件
    "rootDir": "./src/", // 用于解析包含文件的基目录
    "outDir": "./dist/", // 指定输出目录
    "outFile": "./", // 将输出文件合并为一个文件
    "removeComments": true, // 删除编译后的所有的注释
    "noEmit": true, // 不生成输出文件
    "importHelpers": true, // 从 tslib 导入辅助工具函数
    "forceConsistentCasingInFileNames": true, // Prevents case-sensitive import issues for better cross-platform compatibility
    "isolatedModules": true, // 将每个文件做为单独的模块 (与 'ts.transpileModule' 类似)
    "resolveJsonModule": true,

    /* 严格的类型检查选项 */
    "strict": true, // 启用所有严格类型检查选项
    "noImplicitAny": true, // 在表达式和声明上有隐含的 any 类型时报错
    "strictNullChecks": true, // 启用严格的 null 检查
    "noImplicitThis": true, // 当 this 表达式值为 any 类型的时候, 生成一个错误
    "alwaysStrict": true, // 以严格模式检查每个模块, 并在每个文件里加入 'use strict'
    "skipLibCheck": true,

    /* 额外的检查 */
    "noUnusedLocals": true, // 有未使用的变量时, 抛出错误
    "noUnusedParameters": true, // 有未使用的参数时, 抛出错误
    "noImplicitReturns": true, // 并不是所有函数里的代码都有返回值时, 抛出错误
    "noFallthroughCasesInSwitch": true, // 报告 switch 语句的 fallthrough 错误
    "noUncheckedIndexedAccess": true,

    /* 模块解析选项 */
    "moduleResolution": "NodeNext", // 选择模块解析策略: 'node' (Node.js) or 'classic'
    "moduleDetection": "force",
    "esModuleInterop": true,
    "baseUrl": "./", // 用于解析非相对模块名称的基目录
    "paths": {
      "@components": ["src/components"],
      "@components/*": ["src/components/*"],
      "@config": ["src/config"],
      "@config/*": ["src/config/*"],
      "@hooks": ["src/hooks"],
      "@hooks/*": ["src/hooks/*"],
      "@images": ["src/images"],
      "@images/*": ["src/images/*"],
      "@layouts": ["src/layouts"],
      "@layouts/*": ["src/layouts/*"],
      "@pages": ["src/pages"],
      "@pages/*": ["src/pages/*"],
      "@styles": ["src/styles"],
      "@styles/*": ["src/styles/*"],
      "@templates": ["src/templates"],
      "@templates/*": ["src/templates/*"],
      "@types": ["src/types"],
      "@types/*": ["src/types/*"]
    }, // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [], // 根文件夹列表, 其组合内容表示项目运行时的结构内容
    "typeRoots": [], // 包含类型声明的文件列表
    "types": [], // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true, // 允许从没有设置默认导出的模块中默认导入

    /* Source Map Options */
    "sourceMap": true,
    "sourceRoot": "./", // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./", // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true, // 生成单个 source map 文件, 而不是将 source maps 生成不同的文件
    "inlineSources": true // 将代码与 source map 生成到一个文件中
  }
}
```

## Webpack

```bash
npm i -D typescript ts-loader source-map-loader
```

```ts
const path = require('node:path')

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ],
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
}
```

## ESLint

[ESLint for TypeScript](https://github.com/typescript-eslint/typescript-eslint):

```bash
npx eslint --init
```

## Jest

```bash
npm i -D jest typescript ts-jest @types/jest
npx ts-jest config:init
npx jest
```

## DefinitelyTyped

- Library (`npm` package):
  `@types/*` should be `dependencies`,
  consumers can bring in type definitions used within.
- Application:
  `@types/*` should be `devDependencies`,
  type definitions are just development-time tool.

## Project Reference

[Project Reference](https://www.typescriptlang.org/docs/handbook/project-references.html)
for `TypeScript` compile and build [Speed](https://github.com/typescript-cheatsheets/speed).

## Monorepo

[TypeScript Monorepo](https://2ality.com/2021/07/simple-monorepos.html):

- NPM workspaces.
- `TypeScript` references.

## References

- [Cookbook](https://github.com/gibbok/typescript-book)
- [Exploring](https://exploringjs.com/ts/index.html)
- [Effective](https://github.com/danvk/effective-typescript)
- [Clean Code](https://github.com/labs42io/clean-code-typescript)
- [Projects](https://github.com/LearningTypeScript/projects)
- [Toolchain](https://github.com/basarat/typescript-book)

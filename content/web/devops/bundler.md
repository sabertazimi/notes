---
sidebar_position: 13
tags: [Web, DevOps, Bundler, Rollup, Vite, ESBuild]
---

# Bundlers

## Rollup

```ts
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        name: 'react-lib',
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss(),
      terser(),
    ],
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    external: [/\.css$/],
    plugins: [dts()],
  },
])
```

## Vite

[Unbundled development](https://vitejs.dev/guide/why.html):

```ts
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.ts'),
      name: 'SafeView',
      formats: ['es', 'umd'],
      fileName: format => `SafeView.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    minify: true,
    sourcemap: true,
  },
})
```

## ESBuild

ESBuild build configuration:

```ts
// build.js
const esbuild = require('esbuild')
const inlineImage = require('esbuild-plugin-inline-image')

esbuild
  .build({
    entryPoints: ['./src/index.js'],
    outfile: './public/js/app.js',
    minify: true,
    bundle: true,
    loader: {
      '.js': 'jsx',
    },
    plugins: [inlineImage()],
  })
  .catch(() => process.exit(1))
```

ESBuild serve configuration:

```ts
// serve.js
const esbuild = require('esbuild')
const inlineImage = require('esbuild-plugin-inline-image')

esbuild
  .serve(
    {
      servedir: 'public',
      port: 8000,
    },
    {
      entryPoints: ['./src/index.js'],
      outfile: './public/js/app.js',
      bundle: true,
      loader: {
        '.js': 'jsx',
      },
      plugins: [inlineImage()],
    }
  )
  .catch(() => process.exit())
```

ESBuild webpack configuration:

```ts
const { ESBuildMinifyPlugin } = require('esbuild-loader')

module.exports = {
  rules: [
    {
      test: /.js$/,
      loader: 'esbuild-loader',
      options: {
        loader: 'jsx',
        target: 'es2015',
      },
    },
  ],
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'es2015',
      }),
    ],
  },
}
```

## Optimization

- CDN.
- 服务器端渲染.
- 提取公共库.
- 代码压缩.
- 代码分割: Chunks.
- 代码分割: 按需加载.
- [优化构建速度](https://webpack.js.org/guides/build-performance):
  - 缩小文件搜索范围:
    - 优化 `loader` 配置: `include`/`exclude`.
    - 优化 `module.noParse` 配置:
      忽略对部分没采用模块化的文件的递归解析处理.
    - 优化 `resolve.modules` 配置: 第三方模块.
    - 优化 `resolve.alias` 配置.
    - 优化 `resolve.mainFields` 配置.
    - 优化 `resolve.extensions` 配置: 后缀列表.
  - 减少打包文件:
    - 提取公共代码.
    - 动态链接 `DllPlugin`.
    - `externals`.
    - Tree shaking.
  - 缓存:
    - [持久化缓存](https://webpack.js.org/configuration/cache).
    - `babel` 缓存 `cacheDirectory: true`.
    - `cache-loader`.
  - 多进程:
    - `thread-loader`.
- [JD Webpack optimization guide](https://jelly.jd.com/article/61179aa26bea510187770aa3).

### Common Libraries

```json
{
  "externals": {
    "moment": "window.moment",
    "antd": "window.antd",
    "lodash": "window._",
    "react": "window.React",
    "react-dom": "window.ReactDOM"
  }
}
```

### Common Chunks

```ts
const config = new webpack.optimize.CommonsChunkPlugin({
  name: string, // or
  names: [string],
  // The chunk name of the commons chunk.
  // An existing chunk can be selected by passing a name of an existing chunk.
  // If an array of strings is passed this is equal to
  // invoking the plugin multiple times for each chunk name.
  // If omitted and `options.async` or `options.children`
  // is set all chunks are used, otherwise `options.filename`
  // is used as chunk name.
  // When using `options.async` to create common chunks
  // from other async chunks you must specify an entry-point
  // chunk name here instead of omitting the `option.name`.

  filename: string,
  // The filename template for the commons chunk.
  // Can contain the same placeholders as `output.filename`.
  // If omitted the original filename is not modified
  // (usually `output.filename` or `output.chunkFilename`).
  // This option is not permitted if you're using `options.async` as well,
  // see below for more details.

  minChunks: number | Number.POSITIVE_INFINITY | fn,
  // (module, count) => boolean,
  // The minimum number of chunks which need to contain a module
  // before it's moved into the commons chunk.
  // The number must be greater than or equal 2
  // and lower than or equal to the number of chunks.
  // Passing `Infinity` creates the commons chunk, but moves no modules into it.
  // By providing a `function` you can add custom logic.
  // (Defaults to the number of chunks)

  chunks: [string],
  // Select the source chunks by chunk names.
  // The chunk must be a child of the commons chunk.
  // If omitted all entry chunks are selected.

  children: boolean,
  // If `true` all children of the commons chunk are selected

  deepChildren: boolean,
  // If `true` all descendants of the commons chunk are selected

  async: boolean | string,
  // If `true` a new async commons chunk is created
  // as child of `options.name` and sibling of `options.chunks`.
  // It is loaded in parallel with `options.chunks`.
  // Instead of using `option.filename`,
  // it is possible to change the name of the output file by providing
  // the desired string here instead of `true`.

  minSize: number,
  // Minimum size of all common module before a commons chunk is created.
})
```

### Code Minimization

```ts
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const isEnvProduction = process.env.NODE_ENV === 'production'
const isEnvProductionProfile
  = isEnvProduction && process.argv.includes('--profile')
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: path.resolve('src'),
        use: [
          'thread-loader',
          {
            loader: require.resolve('babel-loader'),
          },
        ],
      },
      {
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            drop_console: true,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          keep_classnames: isEnvProductionProfile,
          keep_fnames: isEnvProductionProfile,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
}
```

### Code Splitting

Huge bundle downside:

- Cache invalid: one line code make whole cache invalid.
- Useless code: only use `1/N` of `bundle.js`.

Code splitting methods:

- `require.ensure([], () => {});`.
- async/await `import`.
- `React.Suspense` and `React.lazy`.
- Route-based [code splitting](https://reactjs.org/docs/code-splitting.html#route-based-code-splitting).
- `vendor.[hash].chunk.js` (`document.createElement('script')` promise):
  splitting vendor and application code
  is to enable long term caching techniques
  Since vendor code tends to change less often than the actual application code,
  browser will be able to cache them separately,
  and won't re-download them each time the app code changes.

Split chunks configuration:

- chunks:
  - async: 只提取异步加载的模块出来打包到一个文件中.
  - initial: 提取同步加载和异步加载模块, 分别打包到不同的文件中.
  - all: 不管异步加载还是同步加载的模块都提取出来, 打包到一个文件中.
- minSize: 超过 minSize 才会被提取.
- maxSize: 超过 maxSize 会被进一步分割.
- minChunks: 引用次数 >= minChunks 值才被提取.
- maxAsyncRequests: 最大的按需 (异步) 加载次数 (default: 6).
- maxInitialRequests: 入口文件加载最大数 (default: 4).
- automaticNameDelimiter: 文件名分割符.
- name: chunk 文件名.
- cacheGroups: 配置提取模块的方案, 里面每一项代表一个提取模块的方案.
  - priority: 值越大优先级越大.
  - test: 匹配模块路径或名称.
  - reuseExistingChunk: `true` / `false`.
  - enforce: `true` / `false`.

```ts
module.exports = {
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 200000,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '-',
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          priority: -10,
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
        },
        common: {
          name: 'chunk-common',
          priority: -20,
          chunks: 'initial',
          minChunks: 2,
          reuseExistingChunk: true,
        },
        element: {
          name: 'element-ui',
          priority: 0,
          chunks: 'all',
          test: /[\\/]element-ui[\\/]/,
        },
        api: {
          name: 'api',
          priority: 0,
          test: /[\\/]api[\\/]/,
        },
        subApi: {
          name: 'subApi',
          priority: 10,
          minChunks: 2,
          test: /[\\/]api[\\/]subApi[\\/]/,
        },
        mixin: {
          name: 'mixin',
          priority: 0,
          test: /[\\/]mixin[\\/]/,
        },
      },
    },
  },
}
```

[Next.js granular chunking configuration](https://web.dev/granular-chunking-nextjs):

```ts
module.exports = {
  optimization: {
    splitChunks: {
      chunks: chunk => !/^polyfills|main|pages\/_app$/.test(chunk.name),
      cacheGroups: {
        framework: {
          chunks: 'all',
          name: 'framework',
          test(module) {
            const resource = module.nameForCondition?.()
            return resource
              ? topLevelFrameworkPaths.some(pkgPath =>
                  resource.startsWith(pkgPath)
                )
              : false
          },
          priority: 40,
          enforce: true,
        },
        lib: {
          test(module: {
            size: Function
            nameForCondition: Function
          }): boolean {
            return (
              module.size() > 160000
              && /node_modules[/\\]/.test(module.nameForCondition() || '')
            )
          },
          name(module: {
            type: string
            libIdent?: Function
            updateHash: (hash: crypto.Hash) => void
          }): string {
            const hash = crypto.createHash('sha1')
            if (isModuleCSS(module)) {
              module.updateHash(hash)
            } else {
              if (!module.libIdent) {
                throw new Error(
                  `Encountered unknown module type: ${module.type}.`
                )
              }
              hash.update(module.libIdent({ context: dir }))
            }

            return hash.digest('hex').substring(0, 8)
          },
          priority: 30,
          minChunks: 1,
          reuseExistingChunk: true,
        },
      },
      maxInitialRequests: 25,
      minSize: 20000,
    },
  },
}
```

### Tree Shaking

Webpack tree shaking [includes](https://github.com/orgs/web-infra-dev/discussions/17):

- `usedExports` Optimization:
  Remove unused export variables from modules,
  thereby further eliminating related side-effect-free statements.
  In `lib.js`, variable `b` is unused,
  so related code is removed from the final output.
- `sideEffects` Optimization:
  Remove modules from the module graph where export variables are not used.
  In `util.js`, no export variables are used and entire module are side-effect-free.
  so `util.js` module is removed from the final output.
- DCE (Dead Code Elimination) Optimization:
  Remove dead code by by general minification tools.
  In `bootstrap.js`, the `console.log('bad')` statement will not execute,
  so related code is removed from the final output.

```ts
// index.js
import { a } from './lib'
import { c } from './util'
import './bootstrap'

console.log(a)

// lib.js
export const a = 1
export const b = 2

// util.js
export const c = 3
export const d = 4

// bootstrap.js
console.log('bootstrap')

if (false)
  console.log('bad')
else
  console.log('good')
```

Write tree-shakable code:

- 避免无意义的赋值.
- 尽量不写带有副作用的代码: 诸如编写了立即执行函数, 在函数里又使用了外部变量等.
- 如果对 ES6 语义特性要求不是特别严格, 可以开启 babel 的 loose 模式 etc. 是否真的要不可枚举 class 的属性
  (babel 将 Class 转化为 ES5 过程中会产生 Side Effect, 导致 Tree Shaking 失效).
- 禁止 Babel 将模块导入导出语句转译成 `CommonJS` 形式.
  - `@babel/preset-env`: always `{ "modules": false }`.
  - Babel 作为编译器不应该处理 `modules` 类型的转换.
  - Webpack 要依赖 `esm` 模块进行 tree shaking.
- 如果是开发 JavaScript 库, 使用 `rollup` (ES6 module export + code flow static analysis),
  并且提供 ES6 module 的版本, 入口文件地址设置到 `package.json` 的 module 字段.
- 如果 JavaScript 库开发中, 难以避免的产生各种副作用代码,
  可以将功能函数或者组件, 打包成单独的文件或目录, 以便于用户可以通过目录去加载.
  如有条件, 也可为自己的库开发单独的 webpack-loader, 便于用户按需加载.
- 优化导出粒度, 保持导出值颗粒度和原子性:
  `export { foo, bar }` better than `export default alls`.
- 使用支持 `Tree Shaking` 的包: `lodash-es` or `babel-plugin-lodash`.

### Build Cache

`cache` is set to `type: 'memory'` in development mode
and disabled in production mode.
`cache: true` is an alias to `cache: { type: 'memory' }`.

Accelerate second build time:

```ts
const config = {
  cache: {
    type: 'memory',
  },
}
```

```ts
const config = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
}
```

### Browser Cache

- Webpack caching [guide](https://webpack.js.org/guides/caching).
- Use `[contenthash]` and long-term browser cache to improve second access time.

```ts
const config = new HardSourceWebpackPlugin({
  // Either an absolute path or relative to webpack options.context.
  cacheDirectory: 'node_modules/.cache/hard-source/[confighash]',
  // Either a string of object hash function given a webpack config.
  configHash: (webpackConfig) => {
    // node-object-hash on npm can be used to build this.
    return require('node-object-hash')({ sort: false }).hash(webpackConfig)
  },
  // Either false, a string, an object, or a project hashing function.
  environmentHash: {
    root: process.cwd(),
    directories: [],
    files: ['package-lock.json', 'yarn.lock'],
  },
  // An object.
  info: {
    // 'none' or 'test'.
    mode: 'none',
    // 'debug', 'log', 'info', 'warn', or 'error'.
    level: 'debug',
  },
  // Clean up large, old caches automatically.
  cachePrune: {
    // Caches younger than `maxAge` are not considered for deletion. They must
    // be at least this (default: 2 days) old in milliseconds.
    maxAge: 2 * 24 * 60 * 60 * 1000,
    // All caches together must be larger than `sizeThreshold` before any
    // caches will be deleted. Together they must be at least this
    // (default: 50 MB) big in bytes.
    sizeThreshold: 50 * 1024 * 1024,
  },
})
```

### Performance Profiling

```ts
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const smp = new SpeedMeasurePlugin()

const webpackConfig = smp.wrap({
  plugins: [new MyPlugin(), new MyOtherPlugin()],
})
```

```bash
npx webpack --mode production --profile --json > stats.json
```

- [Optimize Helper](https://github.com/jakoblind/webpack-optimize-helper)
- [Statics Chart](https://github.com/alexkuz/webpack-chart)

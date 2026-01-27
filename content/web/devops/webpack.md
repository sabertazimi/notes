---
sidebar_position: 12
tags: [Web, DevOps, Webpack]
---

# Webpack

## Workflow

[Webpack workflow](https://segmentfault.com/a/1190000039956437):

![Webpack Workflow](./figures/webpack-workflow.png 'Webpack Workflow')

## Configuration

Enable webpack configuration types intellisense:

```bash
npm i -D webpack webpack-cli webpack-dev-server
```

Enable `devServer` type intellisense:

```bash
# Add `devServer` type to `webpack.Configuration`
npm i -D @types/webpack-dev-server
```

```ts
/** @type {import('webpack').Configuration} */
module.exports = {
  entry: {
    main: './src/index.ts',
  },
  output: {
    filename: devMode ? '[name].js' : '[name].[contenthash].js',
    path: path.resolve(__dirname, 'build'),
  },
  mode: devMode ? 'development' : 'production',
  devServer: {
    hot: true,
    open: true,
    port: 2333,
  },
}
```

## Hot Module Replacement

HMR:

- 使用 WDS 托管静态资源, 同时以 Runtime 方式注入 HMR 客户端代码 (HMR Runtime).
- 浏览器加载页面后, 与 WDS 建立 WebSocket 连接.
- Webpack 监听到文件变化后, 增量构建发生变更的模块, 并通过 WebSocket 发送 hash 事件.
- 浏览器接收到 hash 事件后, 请求 manifest (`[hash].hot-update.json`) 资源文件, 确认增量变更范围.
- 浏览器加载发生变更的增量模块.
- 浏览器中注入的 HMR Runtime 触发变更模块的 `module.hot.accept` 回调, 执行代码变更逻辑.

![Hot Module Replacement](./figures/hot-module-replacement.jpg 'Hot Module Replacement')

`module.hot.accept` 有两种调用模式:

- 无参调用模式 `module.hot.accept()`: 当前文件修改后, 重头执行当前文件代码.
- 回调调用模式 `module.hot.accept(path, callback)`: 常用模式, 监听模块变更, 执行代码变更逻辑.

```ts
// 该模块修改后, `console.log('bar')` 会重新执行
console.log('bar')
module.hot.accept()
```

```ts
import component from './component'

let demoComponent = component()
document.body.appendChild(demoComponent)

if (module.hot) {
  module.hot.accept('./component', () => {
    const nextComponent = component()
    document.body.replaceChild(nextComponent, demoComponent)
    demoComponent = nextComponent
  })
}
```

`react-refresh-webpack-plugin`/`vue-loader`/`style-loader`
利用 `module.hot.accept` 实现了 HMR (forceUpdate),
无需开发者编写热模块更新逻辑.

## Watch

```bash
echo fs.notify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Resolve Path

```ts
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  resolve: {
    alias: {
      '#': path.resolve(__dirname, '/'),
      '~': path.resolve(__dirname, 'src'),
      '@': path.resolve(__dirname, 'src'),
      '~@': path.resolve(__dirname, 'src'),
      'vendor': path.resolve(__dirname, 'src/vendor'),
      '~component': path.resolve(__dirname, 'src/components'),
      '~config': path.resolve(__dirname, 'config'),
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
  },
}
```

get `baseUrl`and `paths` from `tsconfig.json`:

```ts
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  resolve: {
    plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
  },
}
```

`jsconfig.json` for vscode resolve path:

```json
{
  "compilerOptions": {
    // This must be specified if "paths" is set
    "baseUrl": ".",
    // Relative to "baseUrl"
    "paths": {
      "*": ["*", "src/*"]
    }
  }
}
```

```json
{
  "compilerOptions": {
    "target": "es2017",
    "allowSyntheticDefaultImports": false,
    "baseUrl": "./",
    "paths": {
      "Config/*": ["src/config/*"],
      "Components/*": ["src/components/*"],
      "Ducks/*": ["src/ducks/*"],
      "Shared/*": ["src/shared/*"],
      "App/*": ["src/*"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

## Flags

- --progress
- --colors
- -p

## Source Map

| Devtool                      | Build   | Rebuild | Production | Quality      |
| ---------------------------- | ------- | ------- | ---------- | ------------ |
| (none) / false               | fastest | fastest | yes        | bundle       |
| eval                         | fast    | fastest | no         | generated    |
| eval-cheap-source-map        | ok      | fast    | no         | transformed  |
| eval-cheap-module-source-map | slow    | fast    | no         | lines only   |
| eval-source-map              | slowest | ok      | no         | lines + rows |

## Output

```ts
const path = require('node:path')

module.exports = {
  entry: {
    'bod-cli.min': path.join(__dirname, './src/index.js'),
    'bod-cli': path.join(__dirname, './src/index.js'),
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].[contenthash].js',
    library: 'bod',
    libraryExport: 'default',
    libraryTarget: 'esm',
    globalObject: 'this',
  },
}
```

## Babel

```ts
const config = {
  test: /\.(js|mjs|jsx|ts|tsx)$/,
  include: path.resolve('src'),
  use: [
    'thread-loader',
    {
      loader: require.resolve('babel-loader'),
    },
  ],
  options: {
    customize: require.resolve('babel-preset-react-app/webpack-overrides'),
    plugins: [
      [
        require.resolve('babel-plugin-named-asset-import'),
        {
          loaderMap: {
            svg: {
              ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]',
            },
          },
        },
      ],
      ['lodash'],
    ],
    cacheDirectory: true,
    cacheCompression: false,
    compact: isEnvProduction,
  },
}
```

## CSS

- `style-loader` 将 CSS 动态注入到 DOM 中 (`document.createElement('style')`), 导致 DOM 重新渲染.
- `production` 下需利用 `Webpack` 将 CSS 提前打包 (`mini-css-extract-plugin`):
  - 优先加载 critical CSS in `<head>`.
  - Lazy loading non-critical CSS.
  - Split up non-initial page CSS.
- `Next.js` 不允许 `:global(.global-class)`:
  `modules.mode` 设置为 [`pure`](https://github.com/vercel/next.js/blob/v12.1.6/packages/next/build/webpack/config/blocks/css/loaders/modules.ts#L42-L44).

```ts
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  module: {
    rules: [
      {
        test: /.s?css$/,
        exclude: /node_modules$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                compileType: 'module',
                localIdentName: '[local]__[hash:base64:5]',
              },
            },
          },
          'sass-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['autoprefixer']],
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      // `...`,
      new CssMinimizerPlugin(),
    ],
  },
}
```

## Static Assets

- [ImageMin Loader](https://github.com/tcoopman/image-webpack-loader)
- `asset/resource` emits separate file and exports the URL
  (`file-loader`).
- `asset/inline` exports data URI of the asset
  (url-loader).
- `asset/source` exports source code of the asset
  (raw-loader).
- `asset` automatically chooses between exporting data URI and separate file
  (`url-loader` with asset size limit, default `8kb`).

```ts
const config = {
  rules: [
    {
      test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 4 * 1024, // 4kb
        },
      },
    },
  ],
}
```

### Resource

```ts
const path = require('node:path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'images/[hash][ext][query]',
  },
  module: {
    rules: [
      {
        test: /\.png/,
        type: 'asset/resource',
      },
      {
        test: /\.html/,
        type: 'asset/resource',
        generator: {
          filename: 'static/[hash][ext][query]',
        },
      },
    ],
  },
}
```

```ts
import mainImage from './images/main.png'

img.src = mainImage // '/dist/151cfcfa1bd74779aadb.png'
```

### Inline

```ts
const path = require('node:path')
const svgToMiniDataURI = require('mini-svg-data-uri')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.svg/,
        type: 'asset/inline',
        generator: {
          dataUrl: (content) => {
            content = content.toString()
            return svgToMiniDataURI(content)
          },
        },
      },
    ],
  },
}
```

```ts
import metroMap from './images/metro.svg'

block.style.background = `url(${metroMap})`
// => url(data:image/svg+xml;base64,PHN2ZyB4bW0iaHR0cDo...vc3ZnPgo=)
```

### Source

```ts
const path = require('node:path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.txt/,
        type: 'asset/source',
      },
    ],
  },
}
```

```ts
import exampleText from './example.txt'

block.textContent = exampleText // 'Hello world'
```

## Thread

```ts
const config = {
  rules: [
    {
      loader: 'thread-loader',
      // loaders with equal options will share worker pools
      options: {
        // the number of spawned workers, defaults to (number of cpus - 1) or
        // fallback to 1 when require('os').cpus() is undefined
        workers: 2,

        // number of jobs a worker processes in parallel
        // defaults to 20
        workerParallelJobs: 50,

        // additional node.js arguments
        workerNodeArgs: ['--max-old-space-size=1024'],

        // Allow to respawn a dead worker pool
        // respawning slows down the entire compilation
        // and should be set to false for development
        poolRespawn: false,

        // timeout for killing the worker processes when idle
        // defaults to 500 (ms)
        // can be set to Infinity for watching builds to keep workers alive
        poolTimeout: 2000,

        // number of jobs the poll distributes to the workers
        // defaults to 200
        // decrease of less efficient but more fair distribution
        poolParallelJobs: 50,

        // name of the pool
        // can be used to create different pools with elseWise identical options
        name: 'my-pool',
      },
    },
    // your expensive loader (e.g. babel-loader)
  ],
}
```

```ts
const threadLoader = require('thread-loader')

threadLoader.warmup(
  {
    // pool options, like passed to loader options
    // must match loader options to boot the correct pool
  },
  [
    // modules to load
    // can be any module, i. e.
    'babel-loader',
    'babel-preset-es2015',
    'sass-loader',
  ]
)
```

## Web Worker

[Worker Loader](https://github.com/Webpack-contrib/worker-loader):

```bash
npm i -D worker-loader
```

```ts
module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
      },
    ],
  },
}
```

## Plugins

```ts
module.exports = {
  plugins: [
    function () {
      this.hooks.done.tap('done', (stats) => {
        if (
          stats.compilation.errors
          && stats.compilation.errors.length
          && !process.argv.includes('--watch')
        ) {
          // Process build errors.
          process.exit(1)
        }
      })
    },
  ],
}
```

```ts
const childProcess = require('node:child_process')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const branch = childProcess
  .execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .replace(/\s+/, '')
const version = branch.split('/')[1]
const scripts = [
  'https://cdn.bootcss.com/react-dom/16.9.0-rc.0/umd/react-dom.production.min.js',
  'https://cdn.bootcss.com/react/16.9.0/umd/react.production.min.js',
]

class HotLoad {
  apply(compiler) {
    compiler.hooks.beforeRun.tap('UpdateVersion', (compilation) => {
      compilation.options.output.publicPath = `./${version}/`
    })

    compiler.hooks.compilation.tap('HotLoadPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
        'HotLoadPlugin',
        (data, cb) => {
          scripts.forEach(src => [
            data.assetTags.scripts.unshift({
              tagName: 'script',
              voidTag: false,
              attributes: { src },
            }),
          ])
          cb(null, data)
        }
      )
    })
  }
}

module.exports = HotLoad
```

### Code

- [HTML Plugin](https://github.com/jantimon/html-webpack-plugin)
- [UglifyJS Terser Plugin](https://github.com/webpack-contrib/terser-webpack-plugin)
- [JavaScript Obfuscator](https://github.com/javascript-obfuscator/webpack-obfuscator)
- [Circular Dependency Plugin](https://github.com/aackerman/circular-dependency-plugin)
- [TypeScript React Components Properties Parser](https://github.com/hipstersmoothie/react-docgen-typescript-plugin)
- [Mini CSS Extract Plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)
- [CSS Minimizer Plugin](https://github.com/webpack-contrib/css-minimizer-webpack-plugin)
- [CSS Tree Shaking](https://github.com/FullHuman/purgecss)

### Image

- [ImageMin Plugin](https://github.com/Klathmon/imagemin-webpack-plugin)

### Build

- [Thread Loader](https://github.com/webpack-contrib/thread-loader)
- [Hard Source Plugin](https://github.com/mzgoddard/hard-source-webpack-plugin)
- [Speed Measure Plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin)
- [Compression Plugin](https://github.com/webpack-contrib/compression-webpack-plugin)
- [Webpack Merge](https://github.com/survivejs/webpack-merge).

### GUI

- [Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [WebpackBar: elegant progressbar and profiler](https://github.com/unjs/webpackbar)
- [Monitor](https://github.com/webpackmonitor/webpackmonitor)
- [Browser UI](https://github.com/zouhir/jarvis)
- [CLI UI](https://github.com/FormidableLabs/webpack-dashboard)

## Migration

Make sure there's [no webpack deprecation warnings](https://webpack.js.org/migrate/5):

```bash
node --trace-deprecation node_modules/webpack/bin/webpack.js
```

## References

- [Webpack 4 Tutorial](https://nystudio107.com/blog/an-annotated-webpack-4-config-for-frontend-web-development)
- [Custom Plugin](https://juejin.cn/post/6870055445034172424)

---
sidebar_position: 23
tags: [Web, React, Toolchain]
---

# Create React App

```bash
npx create-react-app app-name --scripts-version @sabertazimi/react-scripts --use-npm
npm init react-app app-name --scripts-version @sabertazimi/react-scripts --use-npm
```

## Workflow

`createReactApp.js`:

`init`
-> commander setup
-> `createApp()`
-> process CLI args
-> `run()`
-> process `react-scripts@version` and `cra-template-xxx@version`
-> install `react`, `react-dom`, `react-scripts` and `cra-template-xxx`
-> invoke `react-scripts init` for further process.

## React Scripts

### Initialization

Initialization in `react-scripts/scripts/init.js`:

- 可以用于改变默认 registry:

```ts
'use strict'

const registries = {
  npm: 'https://registry.npmjs.org',
  yarn: 'https://registry.yarnpkg.com',
  aliyun: 'https://registry.npm.taobao.org',
}

module.exports = registries
```

- 自定义安装默认依赖 (`react`, `react-dom`, `react-router`, `redux` etc.)
- 额外安装模板依赖 `packages.dependencies` in `cra-template/template.json`
- Setup `package.json`:
  `appPackage.eslintConfig`, `appPackage.browserslist`.
  `appPackage.dependencies`, `appPackage.scripts`
  and merge rest config in `packages` in `cra-template/template.json`
  (ignore `).
- Copy template files from `cra-template-xxx/template` directory.
- Setup git repository.
- Install deps and devDeps list from `react-scripts` and `cra-template-xxx`.
- Uninstall `cra-template-xxx` package.
- Setup first git commit.
- Print available scripts.
- Done.

### Commands

Locating in `react-scripts/scripts/`:

- `start.js` for `react-scripts start`.
- `build.js` for `react-scripts build`.
- `test.js` for `react-scripts test`.
- `eject.js` for `react-scripts eject`.

### Start

When develop `react-scripts` locally
with `react-scripts start`,
it will use `templatePath` located in
`react-scripts/config/paths.js`
to find local template.

### Configuration

Config in `react-scripts/config/` directory:

- `env.js`: static environment variables.
- `getHttpsConfig.js`: get HTTPS(SSL) config.
- `modules.js`: locale modules webpack alias with `baseUrl`.
- `paths.js`: configurable paths variables (most for Webpack config).
- `webpackDevServer.config.js`: Webpack Dev Server configuration.
- `webpack.config.js`: Webpack configuration
  (paths, deps/devDeps, plugins, loader rules etc.).

```ts
// Add support for Ant Design UI.
const webpackConfig = {
  test: /\.(js|mjs|jsx|ts|tsx)$/,
  include: paths.appSrc,
  loader: require.resolve('babel-loader'),
  options: {
    customize: require.resolve('babel-preset-react-app/webpack-overrides'),
    plugins: [
      [
        require.resolve('babel-plugin-import'),
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: 'css',
        },
      ],
    ],
    cacheDirectory: true,
    cacheCompression: isEnvProduction,
    compact: isEnvProduction,
  },
}
```

```ts
// Add Webpack bundle analyzer plugin.
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const webpackConfig = {
  plugins: [
    isEnvDevelopment
    && new BundleAnalyzerPlugin({
      analyzerPort: 5000,
    }),
  ].filter(Boolean),
}
```

## CSS

```css
@import-normalize; /* bring in normalize.css styles */

/* rest of app styles */
```

## Public Folder

- None of the files in public folder get post-processed or minified.
- Missing files will not be called at compilation time,
  and will cause `404` errors for your users.
- Result filenames won’t include `content hashes`
  so you’ll need to add query arguments or rename them every time they change.

```html
<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
```

```tsx
class Component {
  render() {
    // Note: this is an escape hatch and should be used sparingly!
    // Normally recommend using `import` for getting asset URLs
    // as described in “Adding Images and Fonts” section.
    return <img src={`${process.env.PUBLIC_URL}/img/logo.png`} alt="Here" />
  }
}
```

## Environment Variables

- Create custom environment variables beginning with `REACT_APP_`.
  Any other variables except `NODE_ENV` will be ignored.
- HTML access environment variables `%REACT_APP_XXX%`.
- JavaScript access environment variables via `process.env.REACT_APP_XXX`.
- [`.env`](https://github.com/motdotla/dotenv)
  file define permanent environment variables:
  - `npm start`: `.env.development.local`>`.env.local`>`.env.development`>`.env`.
  - `npm run build`: `.env.production.local`>`.env.local`>`.env.production`>`.env`.
  - `npm test`: `.env.test.local`>`.env.test`>`.env`.
- Environment variables [list](https://create-react-app.dev/docs/advanced-configuration).

```bash
GENERATE_SOURCEMAP=false
REACT_APP_NOT_SECRET_CODE=abcdef
```

```html
<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
<title>%REACT_APP_WEBSITE_NAME%</title>
```

```tsx
export default function App() {
  return (
    <div>
      <small>
        You are running this application in
        {' '}
        <b>{process.env.NODE_ENV}</b>
        {' '}
        mode.
      </small>
      <form>
        <input
          type="hidden"
          defaultValue={process.env.REACT_APP_NOT_SECRET_CODE}
        />
      </form>
    </div>
  )
}
```

```html
<div>
  <small>You are running this application in <b>development</b> mode.</small>
  <form>
    <input type="hidden" value="abcdef" />
  </form>
</div>
```

## Code Splitting

Code splitting for [production build](https://create-react-app.dev/docs/production-build)
with `import('dep').then();`:

```ts
import type { ReportHandler } from 'web-vitals'

function reportWebVitals(onPerfEntry?: ReportHandler) {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // Code splitting into separate chunk
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry)
      getFID(onPerfEntry)
      getFCP(onPerfEntry)
      getLCP(onPerfEntry)
      getTTFB(onPerfEntry)
    })
  }
}

export default reportWebVitals
```

## Service Worker

- [PWA Template](https://github.com/cra-template/pwa)

## Deployment

- [Official Documentation](https://facebook.github.io/create-react-app/docs/deployment).
- [Deploy Subdirectory](https://medium.com/@svinkle/how-to-deploy-a-react-app-to-a-subdirectory-f694d46427c1).
- `Cache-Control: max-age=31536000` for `build/static` assets,
  `Cache-Control: no-cache` for everything else.
  `build/static` file contents hash is embedded into the filename.
- Change `homepage` in `package.json`:
  - `"homepage": "."`.
  - `"homepage": "https://example.com/relative/path/"`.
- Use `path={'${process.env.PUBLIC_URL}/about'}`
  in `Routes.js` when using `react-router-dom`.
- Or use `basename` for `react-router@^4`.

```tsx
// renders <a href="/calendar/today">
export default function App() {
  return (
    <BrowserRouter basename="/calendar">
      <Link to="/today" />
    </BrowserRouter>
  )
}
```

### SPA

- Deployment services [guide](https://hiddedevries.nl/en/blog/2020-06-27-how-deployment-services-make-client-side-routing-work).

[`vercel.json`](https://vercel.com/support/articles/how-do-i-use-the-ignored-build-step-field-on-vercel):

```json
{
  "routes": [{ "src": "/[^.]+", "dest": "/", "status": 200 }]
}
```

```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}
```

```jsonc
/**
 * Ignored build step:
 * [ "$VERCEL_GIT_COMMIT_REF" == "gh-pages" ]
 */
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "git": {
    "deploymentEnabled": {
      "gh-pages": false
    }
  },
  "buildCommand": "pnpm clone && pnpm build"
}
```

[Netlify](https://docs.netlify.com/routing/redirects/rewrites-proxies/#history-pushstate-and-single-page-apps):

```bash
/*    /index.html   200
```

GitHub Pages:

```bash
# 404 fallback
ln -s index.html 404.html
```

## Customization

- Custom `packages/cra-template-*`: change HTML/CSS/JS boilerplate.
- Custom `packages/react-scripts/config/`:
  change paths, deps/devDeps, plugins, loader rules etc.
- Custom `packages/react-scripts/scripts/`: change react-scripts CLI behaviors.
- Custom [react scripts](https://auth0.com/blog/how-to-configure-create-react-app).

### Monorepo

- `babel-preset-react-app`: babel preset configuration.
- `cra-template`/`cra-template-typescript`: CRA default templates.
- `eslint-config-react-app`: eslint configuration.
- `react-app-polyfill`: polyfills for various browsers.
- `react-dev-utils`:
  most utility functions for paths, helpers, middleware, and webpack plugins.

### Scripts

In `Create React App`
[code](https://github.com/facebook/create-react-app/blob/main/packages/create-react-app/createReactApp.js):

```ts
const templatesVersionMinimum = '3.3.0'

// Assume compatibility if we can't test the version.
if (!semver.valid(packageVersion))
  packageVersion = templatesVersionMinimum

// Only support templates when used alongside new react-scripts versions.
const supportsTemplates = semver.gte(packageVersion, templatesVersionMinimum)
if (supportsTemplates)
  allDependencies.push(templateToInstall)
```

Due to version checking for template feature,
custom react scripts should
publish with version `^3.3.0` or `^4.x.x`.

### Templates

HTML/CSS/JSX boilerplate in `react-scripts/template/` directory,
now Templates are always named in the format cra-template-[template-name]
in `packages/cra-template` and `packages/cra-template-typescript`.

```bash
npx create-react-app my-app --template [template-name]
```

Dependencies in `template.json`
will bump to latest minor version automatically.

In `react-scripts/scripts/utils/verifyTypeScriptSetup.js`,
if template `src` don't exist `react-app-env.d.ts` file,
it will create automatically with `reference` to `react-scripts` types:

```ts
// Reference `react-scripts` types
if (!fs.existsSync(paths.appTypeDeclarations)) {
  fs.writeFileSync(
    paths.appTypeDeclarations,
    `/// <reference types="react-scripts" />${os.EOL}`,
  )
}
```

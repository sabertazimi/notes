---
sidebar_position: 2
tags: [Web, Node.js, Package Manager, NPM]
---

# NPM

## Mirrors

[NPM mirror list](https://github.com/cnpm/binary-mirror-config):

```bash
npm config set disturl https://npmmirror.com/mirrors/node/
npm config set chromedriver_cdnurl https://npmmirror.com/mirrors/chromedriver/
npm config set electron_mirror https://npmmirror.com/mirrors/electron/
npm config set electron_builder_binaries_mirror https://npmmirror.com/mirrors/electron-builder-binaries/
npm config set operadriver_cdnurl https://npmmirror.com/mirrors/operadriver/
npm config set phantomjs_cdnurl https://npmmirror.com/mirrors/phantomjs/
npm config set profiler_binary_host_mirror https://npmmirror.com/mirrors/node-inspector/
npm config set puppeteer_download_host https://npmmirror.com/mirrors/
npm config set python_mirror https://npmmirror.com/mirrors/python/
npm config set robotjs_binary_host https://npmmirror.com/mirrors/robotjs/
npm config set sass_binary_site https://npmmirror.com/mirrors/node-sass/
npm config set saucectl_install_binary_mirror https://npmmirror.com/mirrors/saucectl/
npm config set sentrycli_cdnurl https://npmmirror.com/mirrors/sentry-cli/
npm config set sharp_binary_host https://npmmirror.com/mirrors/sharp/
npm config set sharp_libvips_binary_host https://npmmirror.com/mirrors/sharp-libvips/
npm config set sqlite3_binary_site https://npmmirror.com/mirrors/sqlite3/
npm config set swc_binary_site https://npmmirror.com/mirrors/node-swc/
```

## Node Version Manager

### NVM

[NVM](https://github.com/coreybutler/nvm-windows):

```bash
scoop install nvm
```

```bash
echo "source /usr/share/nvm/init-nvm.sh" >> ~/.zshrc
source ~/.zshrc
```

```bash
nvm install --lts
npm config -g set registry https://registry.npmmirror.com/
pnpm config -g set registry https://registry.npmmirror.com/
npm install -g pnpm

```

### FNM

[FNM](https://github.com/Schniz/fnm):

```bash
brew install fnm
scoop install fnm
winget install Schniz.fnm
```

```bash
echo 'eval "$(fnm env --use-on-cd --shell bash)"' >> ~/.bashrc
fnm i --lts
node -v
```

## Tab Completion

```bash
npm completion >> ~/.bashrc (or ~/.zshrc)
source ~/.zshrc
```

## Commands

```bash
npm adduser
mkdir proj/
# 修改 package.json 可再次运行此命令
# scope for everyone
npm init --scope=<username>

# 修改 package.json 可再次运行此命令(不接模块名为自动更新)
npm install -S <package>
npm install -D <package>
npm prune      # 清除无用包
npm rm --save  # --save 删除文件的同时更新 package.json 文件

npm ls
npm outdated   # 去除过期包
```

`npm ci` for cache install (speed up installation):

```bash
# With package-lock.json exists:
npm ci
```

Remove useless package:

```bash
# Uninstall node_modules not in package.json
npm prune
npm outdated
```

## Testing

```json
{
  "scripts": {
    "test": "node test.js"
  }
}
```

```bash
npm test
```

## Publish

`latest` or `alpha`:

```bash
npm publish
npm publish --tag [<tag>]
npm dist-tag add <pkg>@<version> [<tag>]
npm dist-tag rm <pkg> <tag>
npm dist-tag ls [<pkg>]
```

NPM registry token configuration:

```bash
npm config set @orgName:registry https://registry.example.com
npm config set //registry.example.com/:_authToken XXXXXTokenXXXXX
```

Release script from VitePress:

```ts
const fs = require('node:fs')
const path = require('node:path')
const chalk = require('chalk')
const { prompt } = require('enquirer')
const execa = require('execa')
const semver = require('semver')
const currentVersion = require('../package.json').version

const versionIncrements = ['patch', 'minor', 'major']

const inc = i => semver.inc(currentVersion, i)
const bin = name => path.resolve(__dirname, `../node_modules/.bin/${name}`)
function run(bin, args, opts = {}) {
  return execa(bin, args, { stdio: 'inherit', ...opts })
}
const step = msg => console.log(chalk.cyan(msg))

async function main() {
  let targetVersion

  const { release } = await prompt({
    type: 'select',
    name: 'release',
    message: 'Select release type',
    choices: versionIncrements.map(i => `${i} (${inc(i)})`).concat(['custom']),
  })

  if (release === 'custom') {
    targetVersion = (
      await prompt({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion,
      })
    ).version
  } else {
    targetVersion = release.match(/\((.*)\)/)[1]
  }

  if (!semver.valid(targetVersion))
    throw new Error(`Invalid target version: ${targetVersion}`)

  const { yes: tagOk } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  })

  if (!tagOk)
    return

  // Update the package version.
  step('\nUpdating the package version...')
  updatePackage(targetVersion)

  // Build the package.
  step('\nBuilding the package...')
  await run('yarn', ['build'])

  // Generate the changelog.
  step('\nGenerating the changelog...')
  await run('yarn', ['changelog'])
  await run('yarn', ['prettier', '--write', 'CHANGELOG.md'])

  const { yes: changelogOk } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Changelog generated. Does it look good?`,
  })

  if (!changelogOk)
    return

  // Commit changes to the Git and create a tag.
  step('\nCommitting changes...')
  await run('git', ['add', 'CHANGELOG.md', 'package.json'])
  await run('git', ['commit', '-m', `release: v${targetVersion}`])
  await run('git', ['tag', `v${targetVersion}`])

  // Publish the package.
  step('\nPublishing the package...')
  await run('yarn', [
    'publish',
    '--new-version',
    targetVersion,
    '--no-commit-hooks',
    '--no-git-tag-version',
  ])
  await run('npm', [
    'publish',
    '--registry',
    'https://registry.npmjs.org',
    '--access',
    'public',
  ])

  // Push to GitHub.
  step('\nPushing to GitHub...')
  await run('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
  await run('git', ['push'])
}

function updatePackage(version) {
  const pkgPath = path.resolve(path.resolve(__dirname, '..'), 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

  pkg.version = version

  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
}

main().catch(err => console.error(err))
```

:::tip[Semantic Version]

Semver:

- Patch release: bugfix and other minor changes.
- Minor release: new features not breaking API (backward compatible).
- Major release: new features breaking API (not backward compatible).
- Alpha (α): 预览版 (内部测试版), 会有很多 Bug, 一般只有测试人员使用.
- Beta (β): 测试版 (或者叫公开测试版), 会一直加入新的功能.
- RC (Release Candidate): 最终测试版本, 可能成为最终产品的候选版本.
- 多数开源软件会推出两个 RC 版本, 最后的 RC2 则成为正式版本.

```bash
npm version patch
npm publish

npm version minor
npm publish

npm version major
npm publish
```

:::

## Link

```bash
cd path/to/my-project
npm link path/to/my-utils
```

```bash
# in local B package, build local B binary (npm install -g B)
npm link
# in local A package, set `B` link in package.json to local B binary
npm link B
```

## Security

```bash
npm audit fix
npm audit fix --force
```

## NPX

Run local node_modules:

```bash
npm install eslint -D
npx eslint .
```

Run global package (not installed):

```bash
npx create-react-app react-app
```

Run specific version:

```bash
npx -p package1@next -p package2@next -c "command"
```

Run scripts with different node version:

```bash
npx -p node@version -- node index.js
```

Run remote repo/gist code:

```bash
npx user/repo#branch
npx gistUrl
```

:::tip[NPX Cache]

NPX cache packages in `~/.npm/_npx`.

:::

To get latest version package:

```bash
# https://github.com/return-0x0/node-clear-npx-cache.
# https://github.com/npm/cli/issues/2329.
# https://github.com/npm/cli/issues/2395.
# https://github.com/npm/cli/pull/2592.
# https://github.com/facebook/create-react-app/issues/10601.
# https://github.com/facebook/create-react-app/issues/12022.
npx clear-npx-cache
npx create-react-app app
```

## Dependencies

- Dependency Nesting/Hell (NPM v1).
- Dependency Flatten/Hoist (NPM v3).
- Dependency Consistent Lockfile (NPM v5 and Yarn).
- Dependency Hard/Symbol Links (PNPM):
  - Hard links for global `.pnpm` store to save disk storage.
  - Symbol links for local require short path with non-flat `node_modules`
    to rectify **doppelgangers** and **ghost/phantom dependencies** problem.
- `peerDependencies`:
  提示宿主环境去安装满足插件 `peerDependencies` 所指定依赖的包,
  然后在插件 `import` 或者 `require` 所依赖的包的时候,
  永远都是引用宿主环境统一安装的 NPM 包,
  最终解决插件与所依赖包不一致的问题.
- 构建依赖树的过程中, 版本确认需要结合 `package.json` 和 `package-lock.json`:
  - 先确认 `package-lock.json` 安装版本,
    符合规则就以此为准,
    否则由 `package.json` 声明的版本范围重新确认.
  - 若是在开发中手动更改包信息,
    会导致 **lockfile** 版本信息异常,
    也由 `package.json` 重新确认.
  - 确认好的依赖树会存到 `package-lock.json` 文件中.
- 同一个依赖, 更高版本的包会安装到顶层 `node_modules` 目录,
  低版本的包会分散在某些依赖的 `node_modules` 目录.
- **Lockfile** 保证项目依赖结构的确定性, 保障项目在多环境运行的稳定性.

### Doppelgangers

- Singleton conflict: multiple version of same package in `node_modules`.
- Types conflict: global `types` naming conflict.

### Ghost

NPM ghost (phantom) dependency:

- Imported packages from `dependencies of dependencies`:
  When update `dependencies` to minor version,
  `dependencies of dependencies` may get major BREAKING version
  (It's legal for `semver`, when `dependencies` API don't change).
- Imported packages from `devDependencies`:
  When others install your library,
  such imported packages will missing,
  cause they aren't located in library `package.json`.
- Imported packages from root `node_modules` in monorepo.
  When others install your library,
  such imported packages will missing,
  cause they aren't located in library `package.json`.

### Invalid

```bash
$ npm ls
package@version invalid
```

Modify `package-lock.json`
to remove locked invalid package version.

## `package.json`

### Bin

当设置了 `bin` 字段后,
在 `package.json` `script` 字段中,
可以使用简写编写命令
(但是局部安装无法在 shell 下使用, 需 `npx <bin-name>`).

### Version

```bash
npm version major
npm version minor
npm version patch
```

### Workspaces

In root `package.json`:

```json
{
  "workspaces": [
    "./packages/*",
    "./css/*",
    "./angular/*",
    "./react/*",
    "./vue/*"
  ]
}
```

In root `cwd`:

```bash
npm i
npm run lint -ws
npm run test -w package-a
npm i lodash -w package-b
npm i -D eslint -w package-c
```

### Exports

`exports` can define [public API](https://zellwk.com/blog/npm-exports):

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "module": "./dist/index.mjs",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "default": "./dist/index.mjs"
    },
    "./package.json": "./package.json"
  },
  "types": "./dist/index.d.ts",
  "browser": "./dist/index.mjs",
  "module": "./dist/index.mjs",
  "main": "./dist/index.cjs"
}
```

`exports` configures JavaScript level,
file `packages/rest/build/gen/util/regexp-tools.js`
can be imported via `@github/rest/gen/util/regexp-tools`:

- Don't need to mention directory `build`/`dist` in module specifiers.
- Don't need to mention `.js`/`.ts` in module specifiers.

```json
{
  "name": "@github/rest",
  "private": true,
  "exports": {
    "./": "./dist/index.js",
    "./gen/*": "./dist/gen/*.js",
    "./client/*": "./dist/client/*.js",
    "./contract": "./dist/contract.js",
    "./state": "./dist/state.js",
    "./package.json": "./package.json"
  }
}
```

```js
import octokit from '@github/rest'
import { Contract } from '@github/rest/contract'
import utils from '@github/rest/gen/utils'
import state from '@github/rest/state'
```

### Resolutions

Besides `git bisect` for debugging broken version,
revert to last working version with `resolutions` field
will help to [fix broken version too](https://github.com/ant-design/ant-design/pull/48829):

```json
{
  "resolutions": {
    "rc-field-form": "1.44.0"
  }
}
```

## Lockfile

Dependency [pinning](https://docs.renovatebot.com/dependency-pinning):

When kept in sync with its associated `package.json`,
a lockfile will further lock down the exact dependencies and sub-dependencies,
so that everyone running `npm i` or `yarn` will install the exact same dependencies.

If the `package.json` contains a range,
and a new in-range version is released that would break the build,
then essentially `package.json` is in a state of **broken**,
even if the lockfile is still holding things together.

- Apps (web or Node.js) that aren't `require()` by other packages
  should pin all types of dependencies for greatest reliability/predictability.
- Libraries that are `consumed`/`required()` by others
  should keep using SemVer ranges for **dependencies** (purge multiple version `node_modules`)
  but can use pinned devDependencies.

## Environment

配置文件以 `.env`/`JS(Object)`/`JSON`/`JSONP`/`XML`/`YML` 格式单独存放,
方便读取.

```bash
# .env file (added to .gitignore)
NODE_ENV=development
PORT=8626
# Set your database/API connection information here
API_KEY=**************************
API_URL=**************************
```

```ts
// config.js
const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  endpoint: process.env.API_URL,
  masterKey: process.env.API_KEY,
  port: process.env.PORT,
}
```

```ts
// server.js
const { port } = require('./config')

console.log(`Your port is ${port}`) // 8626
```

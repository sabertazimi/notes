---
sidebar_position: 3
tags: [Programming, Git, Commit]
---

# Commit

- -a: 跳过暂存阶段(git add)
- -v: 显示详细 diff 信息

```bash
git commit -a -v
```

重新提交

```bash
git commit --amend -a -v
```

## Style Guide

Conventional Commits [specification](https://github.com/conventional-commits/conventionalcommits.org):

```bash
pnpm add -D commit-and-tag-version
```

```bash
pnpm dlx commitizen init cz-conventional-changelog --save-dev --save-exact
```

```md
<type>(<scope>): <subject>
(emptyLine)

<body>
  (emptyLine)
<footer>
```

## Subject

No more than 50 characters.

## Type

- feat: 新增了一个功能 (MINOR Version).
- fix: 修复了一个 bug (PATCH Version）.
- docs: 只是更改文档.
- style: 不影响代码含义的变化 (空白、格式化、缺少分号等).
- refactor: 代码重构, 既不修复错误也不添加功能.
- perf: 改进性能的代码更改.
- test: 添加确实测试或更正现有的测试.
- build: 影响构建系统或外部依赖关系的更改 (示例范围: gulp, broccoli, NPM).
- ci: 更改持续集成文件和脚本 (示例范围: Travis, Circle, BrowserStack, SauceLabs).
- chore: 其他不修改 src 或 test 文件 e.g. `chore(release)`.
- revert: commit 回退.

## Scope

- init
- runner
- watcher
- config
- web-server
- proxy
- empty

## Body

- uses the imperative, present tense: “change” not “changed” nor “changes”
- includes **motivation** for the change and contrasts with previous behavior

## Footer

- referencing issues e.g. close #666, #888
- BREAKING CHANGE (`<type>!`) (MAJOR Version)
  e.g.`port-runner` command line option has changed to `runner-port`,
  so that it is consistent with the configuration file syntax.
  To migrate your project, change all the commands, where you use `--port-runner`
  to `--runner-port`.

## Emoji

- [GitEmoji](https://github.com/carloscuesta/gitmoji)

| Commit type              | Emoji                                         |
| :----------------------- | :-------------------------------------------- |
| Initial commit           | :tada: `:tada:`                               |
| Version tag              | :bookmark: `:bookmark:`                       |
| New feature              | :sparkles: `:sparkles:`                       |
| Bugfix                   | :bug: `:bug:`                                 |
| Metadata                 | :card_index: `:card_index:`                   |
| Documentation            | :books: `:books:`                             |
| Documenting source code  | :bulb: `:bulb:`                               |
| Performance              | :racehorse: `:racehorse:`                     |
| Cosmetic                 | :lipstick: `:lipstick:`                       |
| Tests                    | :rotating_light: `:rotating_light:`           |
| Adding a test            | :white_check_mark: `:white_check_mark:`       |
| Make a test pass         | :heavy_check_mark: `:heavy_check_mark:`       |
| General update           | :zap: `:zap:`                                 |
| Improve format/structure | :art: `:art:`                                 |
| Refactor code            | :hammer: `:hammer:`                           |
| Removing code/files      | :fire: `:fire:`                               |
| Continuous Integration   | :green_heart: `:green_heart:`                 |
| Security                 | :lock: `:lock:`                               |
| Upgrading dependencies   | :arrow_up: `:arrow_up:`                       |
| Downgrading dependencies | :arrow_down: `:arrow_down:`                   |
| Lint                     | :shirt: `:shirt:`                             |
| Translation              | :alien: `:alien:`                             |
| Text                     | :pencil: `:pencil:`                           |
| Critical hotfix          | :ambulance: `:ambulance:`                     |
| Deploying stuff          | :rocket: `:rocket:`                           |
| Fixing on MacOS          | :apple: `:apple:`                             |
| Fixing on Linux          | :penguin: `:penguin:`                         |
| Fixing on Windows        | :checkered_flag: `:checkered_flag:`           |
| Work in progress         | :construction: `:construction:`               |
| Adding CI build system   | :construction_worker: `:construction_worker:` |
| Removing a dependency    | :heavy_minus_sign: `:heavy_minus_sign:`       |
| Adding a dependency      | :heavy_plus_sign: `:heavy_plus_sign:`         |
| Docker                   | :whale: `:whale:`                             |
| Configuration files      | :wrench: `:wrench:`                           |
| Package.json in JS       | :package: `:package:`                         |
| Bad code                 | :poop: `:poop:`                               |
| Reverting changes        | :rewind: `:rewind:`                           |
| Breaking changes         | :boom: `:boom:`                               |
| Code review changes      | :ok_hand: `:ok_hand:`                         |
| Accessibility            | :wheelchair: `:wheelchair:`                   |
| Move/rename repository   | :truck: `:truck:`                             |

## Toolchain

[Commitizen](https://github.com/commitizen/cz-cli):

```bash
npm i -g commitizen cz-conventional-changelog
echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
git cz # replace for `git commit`
```

[CommitLint](https://github.com/conventional-changelog/commitlint):

```bash
yarn add -D @commitlint/config-conventional @commitlint/cli
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js

yarn add -D husky
yarn husky install
yarn husky add .husky/commit-msg 'yarn commitlint --edit "$1"'
```

[Husky](https://github.com/typicode/husky):

```bash
npx husky-init
npx husky add .husky/pre-commit "lint-staged"
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{md,mdx}": ["prettier --write"]
  }
}
```

## Library

- Commit [linter](https://github.com/conventional-changelog/commitlint).
- Commitizen conventional [changelog](https://github.com/commitizen/cz-conventional-changelog).
- [Version](https://github.com/absolute-version/commit-and-tag-version):
  Automate versioning and CHANGELOG generation.

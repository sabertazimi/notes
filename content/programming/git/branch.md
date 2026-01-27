---
sidebar_position: 4
tags: [Programming, Git, Branch]
---

# Branch

[Git Flow Extension](https://github.com/nvie/gitflow):

1. master 类型分支, 名为 `?|master` 或 `master`, 其中 `?` 为开发代号.
2. develop 类型分支, 名为 `?|develop` 或 `develop`, 其中 `?` 为开发代号.
3. feature 类型分支, 名为 `feature/*` 或 `?|feature/*` , 其中 `*` 为特征描述.
4. release 类型分支, 名为 `release-*` 或 `?|release-*` , 其中 `*` 为要发布的版本号.
5. hotfix 类型分支, 名为 `hotfix-*` 或 `?|hotfix-*` , 其中 `*` 为要发布的版本号.
6. issues 类型分支, 名为 `issues/*` 或 `?|issues/*` , 其中 `*` 为问题描述.
7. trials 类型分支, 名为 `?%trials.*`, `?` 为此分支的父分支, `*` 为描述的名称 (或直接为 `?%trials`).
8. basedOn 类型分支, 名为 `basedOn` 或 `?|basedOn`, `?` 为其来源的 master 分支的开发代号.
9. work 类型分支, 名为 `work.***/basedOn-?-*` , `***` 代表此描述此 work 的名称,
   `?` 为其所基于的分支的开发代号, 最后一个 `*` 代表其在 `?|basedOn` 上所基于的分支的版本号或状态名.

## Local

创建新分支

```bash
git branch <new-branch-name>
```

删除分支

```bash
git branch -d <branch-name>
git push origin --delete <remote-branch-name>
```

切换分支

```bash
git checkout <branch-name>
```

切换到新分支

```bash
git checkout -b <new-branch-name>
```

打印分支信息

```bash
git branch -v(详细信息) -vv(详细远程信息) --merged(显示合并至当前分支的分支) --no-merged(显示未合并至当前分支的分支)
```

## Remote

- Show all remote branch:

```bash
git branch -r
```

本地分支跟踪远程分支(在此本地分支上运行 git pull 自动抓取), 2 种方式:

- 设置当前所在本地分支跟踪某一远程分支

```bash
git branch -u [remoteName]/[branch]
```

- 创建并切换至新的本地分支(跟踪某一远程分支)
  - --track: 本地分支由 git 自动命名
  - -b: 本地分支由创建者命名

```bash
git checkout --track [new-local-branch]

git checkout -b [new-local-branch] [remoteName]/[branch]
```

- Delete remote branch

```bash
git push --delete origin [remote-branch-name]
```

## Upstream

```bash
git status -sb
git branch -avv
git remote show origin
```

## Develop

_多长期分支模式_:
master 分支与 develop 分支都是长期分支,
区别在于分支的**稳定性等级**, master > develop.

e.g. master/develop/next

- 每一次的提交都必须有意义

git 在每次提交的时候要求输入对此提交的概括, 这个概括不能为空.

正确的提交概括：更新了程序 doc
错误的提交概括：updates

- 开发型任务中的 master 类型与 develop 类型分支必须成对出现,
  master 分支的推进只能来源与 release 分支和 hotfix 分支的合并, 禁止在 master 分支上直接提交

master 分支上只有我们推送上去的稳定版本的程序, develop 分支上的程序一直处于开发状态, 不稳定.
在开发型任务中使用 gg-init 进行版本控制的初始化, 建立配套的 master ～ develop 分支对.
在使用型任务中使用 gg-work-init 进行版本控制的初始化,
拉取需要使用的稳定版本程序的 master 分支, 并初始化对应的 basedOn 分支（见 9）.

## Feature

1. 只能从 develop 类型分支上创建.
2. 最终必须合并到 develop 类型分支.
3. 最终分支被删除.

每当有新特性需要加入的时候,
我们应该从 develop 类型分支上新建一个 feature 类型分支,
完成新特性的开发和测试后将特性合并到 develop 类型分支上.

在 develop 类型分支上使用 gg-feature-open featureName 建立并转向一个名为 feature/featureName 的新分支
在一个 feature 类型分支上使用 gg-feature-close 把这个分支的工作合并到 develop 类型分支上,
删除此分支, 完成一个特性的开发.

## Release

1. 只能从 develop 类型分支上创建.
2. 最终必须同时合并到 master 类型分支 (发布新的版本) 和 develop 类型分支 (基于新版本的进一步开发).
3. 最终分支被删除.

每当工作进入到一个较为稳定阶段的时候, 可以使用 gg-release-open versionNum 建立一个名为 release-versionNum 的临时分支,
在这个分支上允许进行小的改动 (比如修改一下 readme 文件中的版本号),
然后使用 gg-release-close 将此版本合并（发布）到 master 类型分支上, 同时合并到 develop 类型分支上, 然后删除此分支.

## Hotfix

1. 只能从 master 类型分支上创建.
2. 最终必须同时合并到 master 类型分支(发布新的热补丁版本)和 develop 类型分支(基于新版本的进一步开发).
3. 最终分支被删除.

当新版本发布后发现必须马上解决的严重 bug 时,
使用 gg-hotfix-open versionNum 建立名为 hotfix-versionNum 的临时分支,
在这个分支上完成 bug 的修复,
然后使用 gg-hotfix-close 将此版本合并（发布）到 master 类型分支上,
同时合并到 develop 类型分支上, 然后删除此分支.

## Issues

1. 只能从 develop 类型分支上创建.
2. 最终必须合并到 develop 类型分支.
3. 最终分支被删除.

每当有（比较复杂的）问题需要解决的时候,
应该从 develop 类型分支上新建一个 issues 类型分支,
完成问题的调试后合并到 develop 类型分支上.

在 develop 类型分支上使用 gg-issues-open featureName 建立并转向一个名为 issues/issuesName 的新分支,
在一个 issues 类型分支上使用 gg-issues-close 把这个分支的工作合并到 develop 类型分支上,
然后删除此分支, 解决了一个复杂的问题.
issues 类型和 feature 类型的实现方式一模一样, 仅仅有名字上面的差别.

## Trials

- 可以从除了 release 类型分支以外的任何类型分支上创建.
- 在这个分支上请发挥想象力大胆实验:
  - 接受实验结果, 把实验过程并入父分支, 称为 good-close.
  - 实验结果不理想, 放弃实验结果, 从实验开始前重新来过, 称为 bad-close.
- 最终分支被删除.

在满足条件的分支 A 上工作, 时不时会冒出一些大胆的想法.
这个时候使用 gg-trials-open trialsName 创建并转向一个名为 A/trials.trialsName 的实验分支,
在这个分支上进行疯狂的实验.

## BasedOn

1. 从 name|master 建立并初始化为 name|basedOn.
2. 只能从对应的 master 分支 fork 到此分支.
3. 禁止在这个分支上提交.

这个分支是一个为了使工作流程更为清晰的缓存分支,
分支上只有从 master 稳定分支上挑选出来的自己在工作中将要（尝试）使用的稳定版本.
在 basedOn 类型分支上使用 gg-select 版本号,
从对应的 master 分支上选出一个稳定版本或使用 gg-select-the-latest 从对应的 master 分支上选择最新的版本 fork 到这个分支,
并加上 inUse-versionNum 的标签.
从 master 到此分支的行为是 fork,
即有可能此分支的 log 为
`(init)v1.0===>v0.9=====>v0.8======>v1.3`,
这个分支上的 commit 来源于 master, 但是其分支提交历史与 master 分支无关.

## Work

1. 只能从 basedOn 类型分支上创建.
2. 可以借助 basedOn 分支升级.

## Tag

列出标记及其信息

```bash
git tag
git tag -l "v1.8-"
git show <tagName(v1.4)>
```

创建标签:

- 不加-m 会调用 core.editor)
- 省略 commit 序列,标签添加至最新提交

创建附注(annotated)标签

```bash
git tag -a <tagName(v1.4)> [commit序列]
```

创建轻量(lightweight)标签

```bash
git tag <tagName(v1.4)> [commit序列]
```

共享标签至远程库

```bash
git push [remote-name] <tagName>
git push [remote-name] --tags
git push --follow-tags
```

## Worktree

Run [parallel agents](https://code.claude.com/docs/en/common-workflows#run-parallel-claude-code-sessions-with-git-worktrees):

```gitignore
.env
.env.local
.env.*
**/.claude/settings.local.json
```

```bash
git worktree add <worktree-path> <branch-name>
git worktree list
git worktree remove <worktree-path>
git worktree prune
```

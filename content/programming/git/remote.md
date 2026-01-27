---
sidebar_position: 5
tags: [Programming, Git, Remote]
---

# Remote

添加与删除远程仓库源:

```bash
git remote add <shortname> <remote-url>
git remote rm <shortname>
```

显示仓库信息:

```bash
git remote show [remote-name]
```

重命名仓库缩写名:

```bash
git remote rename <old> <new>
```

## Pull

拉取变更:

```bash
git pull [remote-name]
git pull --rebase
git pull --allow-unrelated-histories
```

## Fetch

```bash
git fetch <repo_name> <branch_name>
```

## Merge

合并的结果是生成一个新的快照 (并提交) (新的提交对象).

## Rebase

切换到工作分支, 编码开发新特性:

```bash
git checkout feature-branch
```

新特性开发完毕, 变基操作以简洁提交历史:

```bash
git rebase master
git rebase [baseBranch] [topicBranch]
```

切换到主分支, 合并特性分支:

```bash
git checkout master
git merge feature-branch
```

Pull with auto rebase and auto stash:

```bash
git pull --rebase --autostash
```

## Push

推送变更:

```bash
git push [remote-name] [local-branch-name]:[remote-branch-name]
```

从本地操作, 删除远程仓库的分支:

```bash
git push origin --delete [remote-branch-name]
```

保存推送密码:

```bash
git config --global credential.helper store
```

## Submodule

管理一个仓库的其他外部仓库.
它可以被用在库或者其他类型的共享资源上.
submodule 命令有几个子命令, 如 (add/update/sync)
用来管理这些资源.

- add submodule

```bash
git submodule add git://github.com/rack/rack.git ./lib/rack
cat .gitmodules
```

- get submodule

```bash
git submodule init
git submodule update
```

- sync submodule

```bash
git pull origin/master --rebase
git submodule update
```

```bash
git submodule update --init --force --remote
```

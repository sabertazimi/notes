---
sidebar_position: 2
tags: [Programming, Git]
---

# Commands

## Add

交互式的选择 add 特定部分:

```bash
git add -p
```

对于新文件, 使用 `git add -N` 来跟踪文件:

```bash
git add -N <filename>
git add -p <filename>
```

## Remove

完全删除文件

```bash
git rm filename
```

--cached: 保留磁盘文件(仅从 git 库移除文件)

```bash
git rm --cached filename
```

## Move

```bash
git mv old_path new_path
```

## Clean

Remove untracked files from the working tree:

```bash
# Remove untracked files:
git clean -f

# Remove untracked files and folders:
git clean -fd

# Dry run:
git clean -n
```

## Stash

临时地保存一些还没有提交的工作,
以便在分支上不需要提交未完成工作就可以清理工作目录:

- git stash: 备份当前的工作区的内容, 将当前的工作区内容保存到 Git 栈
- git stash apply/pop: 从 Git 栈中读取最近一次保存的内容, 恢复工作区的相关内容
- git stash branch `<branch>`: 新建分支, 并在该分支上恢复储藏内容
- git stash list: 显示 Git 栈内的所有备份
- git stash clear: 清空 Git 栈

```bash
# git stash popup
git stash show -p stash@{0} | git apply -R
```

Pop a single file:

```bash
git restore -s stash@{0} -- <filename>
git checkout stash@{0} -- <filename>
```

## Revert

- 重新提交前 n 次的 commit

```bash
git revert -n
```

## Reset

```bash
git reset $(git merge-base master $(git rev-parse --abbrev-ref HEAD))
```

- `git rev-parse --abbrev-rev HEAD`
  will return the name of the branch currently on.
- `git merge-base master $(name of your branch)`
  will find the best common ancestor between master and current branch.
- `git reset $(hash of the branch creation)`
  will undo all the commits, merges, rebase
  (preserving changes to the code).

## Show

- 查看其他分支 或 提交点的文件状态

```bash
git show branchName/commitHash:fileName
```

## Alias

- !: 执行外部命令

```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status

git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'

git config --global alias.visual '!gitk'
```

## Bisect

通过二分查找快速定位问题提交:

```bash
git bisect start
git bisect good 42bf0c8df2
git bisect bad 57613f8c56
git bisect good # Current commit is good.
git bisect bad # Current commit is bad.
```

## Reverse List

Lists commit objects in reverse chronological order:

```bash
git rev-list --count HEAD
git rev-parse --short HEAD
```

## Filter Branch

根据某些规则来重写大量的提交记录,
例如从任何地方删除文件,
或者通过过滤一个仓库中的一个单独的子目录以提取出一个项目:

```bash
git rev-list --objects --all
\ | grep "$(git verify-pack -v .git/objects/pack/*.idx
\ | sort -k 3 -n | tail -5 | awk '{print$1}')"
git filter-branch -f --prune-empty --index-filter
\ 'git rm -rf --cached --ignore-unmatch your-file-name'
\ --tag-name-filter cat -- --all
```

## Cherry Pick

获得在单个提交中引入的变更, 然后尝试将作为一个新的提交引入到你当前分支上.

## List Files

列出索引中的文件, 或查看工作目录状态:

```bash
# 列出所有已跟踪文件
git ls-files

# 只列出未跟踪文件
git ls-files --others

# 排除 .gitignore 中的文件
git ls-files --exclude-standard

# 列出未跟踪文件并统计数量
git ls-files --others --exclude-standard | wc -l

# 只列出特定目录的文件
git ls-files path/to/directory/

# 显示文件详细模式 (ls -l)
git ls-files -l

# 显示被删除的文件 (已从索引移除但未提交)
git ls-files --deleted
```

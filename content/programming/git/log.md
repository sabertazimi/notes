---
sidebar_position: 6
tags: [Programming, Git, Log]
---

# Log

- -p: 打印 diff 差异信息
- -n: n 为十进制数字,显示最近 n 次信息
- --stat: 打印简略统计信息
- --graph: 显示分支合并历史
- --pretty=: 设置日志格式
- --author=: 指定作者
- --committer=: 指定提交者
- --after=/--since=: 限制日志时间
- --before=/--until=: 限制日志时间 "2008-01-15" "2 years 1 day 3 minutes ago"
- --decorate: 查看各个分支当前所指的对象(commit object)
- --help

```bash
git log -p --stat --graph --pretty=format:"%h - %an, %ar : %s" --since=2.weeks path_name
```

## Pretty Format

| 选项 | 说明                                        |
| :--- | :------------------------------------------ |
| %H   | 提交对象(commit)的完整哈希字串              |
| %h   | 提交对象的简短哈希字串                      |
| %T   | 树对象(tree)的完整哈希字串                  |
| %t   | 树对象的简短哈希字串                        |
| %P   | 父对象(parent)的完整哈希字串                |
| %p   | 父对象的简短哈希字串                        |
| %an  | 作者(author)的名字                          |
| %ae  | 作者的电子邮件地址                          |
| %ad  | 作者修订日期 (可以用\|-date=\|选项定制格式) |
| %at  | 作者修订日期 (ms)                           |
| %ar  | 作者修订日期, 按多久以前的方式显示          |
| %cn  | 提交者(committer)的名字                     |
| %ce  | 提交者的电子邮件地址                        |
| %cd  | 提交日期                                    |
| %cr  | 提交日期,按多久以前的方式显示               |
| %s   | 提交说明                                    |

## Options

| 选项               | 说明                                                    |
| :----------------- | :------------------------------------------------------ |
| -p                 | 打印 diff 差异信息                                      |
| -n                 | n 为十进制数字,显示最近 n 次信息                        |
| --stat             | 打印简略统计信息                                        |
| --graph            | 显示分支合并历史                                        |
| --pretty=          | 设置日志格式                                            |
| --author=          | 指定作者                                                |
| --committer=       | 指定提交者                                              |
| --after=/--since=  | 限制日志时间                                            |
| --before=/--until= | 限制日志时间 "2008-01-15" "2 years 1 day 3 minutes ago" |
| --help             |                                                         |

## Filter

### Amount

```bash
git log -3
```

### Date

- `before` and `until`
- `after` and `since`

```bash
git log --before="yesterday"
git log --after="1 week ago"
git log --after="2014-7-1" --before="2014-7-4"
```

### Author

```bash
git log --author="John\|Mary"
```

### Commit Message

```bash
git log --grep="feat"
git log --grep="fix"
```

### File

```bash
git log -- src/components/ErrorBoundary/ErrorBoundary.test.tsx
git log -- "*.test.tsx"
```

### Content

```bash
git log -S"Hello, World!"
```

### Range

```bash
git log main..feature
```

## Reflog

分析你所有分支的头指针的日志来查找出你在重写历史上可能丢失的提交:

`git reflog show` is an alias for
`git log -g --abbrev-commit --pretty=oneline`.
`git reflog` is useful for trace local git manipulation history.

```bash
git reflog
git reset HEAD@{index}
```

## Revision

| 符号   | 含义                                      |
| ------ | ----------------------------------------- |
| `~`    | 沿提交历史回退 `n` 步                     |
| `^n`   | 第 `n` 个父提交（仅合并提交有多个父提交） |
| `@{n}` | reflog 第 `n` 步之前的位置                |

```bash
# 查看倒数第 2 个提交
git show HEAD~2

# 回退到 2 次操作前的状态
git reset HEAD@{2}

# 合并提交的第 2 个父分支
git show HEAD^2
```

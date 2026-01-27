---
sidebar_position: 7
tags: [Programming, Git, Diff]
---

# Diff

```bash
git diff
git diff --name-only
```

## Staged

```bash
git diff --staged
```

## Whitespace

显示空白字符错误:

```bash
git diff --check
```

## Branch

Delete squash branch:

```bash
# Output the diff between main and fix/components branches
git diff main..fix/components

# If git diff is empty, delete the branch in force
git branch -D fix/components
```

## File

使用 `git diff --no-index` 可以对比两个任意文件:

```bash
git diff --no-index file1.txt file2.txt
git diff --no-index --word-diff=color file1.txt file2.txt
```

## Patch

Generate patch (`-u`):

```bash
git diff -u <src> <dist>
git diff -Nur <src_dir> <dist_dir>
```

```bash
patch -p[num] < patchFile
patch -dry -run -p[num] < patchFile
```

```bash
diff -Nur program_1.0 program_2.0 > program_2.0.patch
patch -p1 <../program_2.0.patch
```

- `git format-patch`:
  mailbox 的格式来生成一系列的补丁以便你可以发送到一个邮件列表中.
- `git am`:
  应用来自邮箱的补丁.
- `git apply`:
  应用一个通过 git diff 或者甚至使用 GNU diff 命令创建的补丁.

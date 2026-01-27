---
sidebar_position: 10
tags: [Programming, Git, Internals]
---

# Internals

## Objects

`.git/objects` is immutable, `.git/refs` is mutable.

`blob`持有文件的内容,`树对象`是一个包含`blob`对象和`子树对象`的目录列表.
`提交对象`是工作目录的一个快照, 包含了一些像时间或提交信息这样的元数据.
`分支`是`提交对象`的命名引用.
`工作目录`是一个目录, 有着相应的仓库, `暂存区`(索引)为下一个`提交对象`持有对应的`树对象`,
而仓库就是一个`提交对象`的集合.

[![Git Objects](./figures/git-objects.webp)](https://github.blog/2022-08-29-gits-database-internals-i-packed-object-store)

```bash
git hash-object 创建blob对象
git cat-file -t
git cat-file -p
git update-index --add --cache-info 将文件添加至暂存区
git write-tree 创建tree对象
git commit-tree 创建commit对象

$ git hash-object -w --stdin
Hello, world!
af5626b4a114abcb82d63db7c8082c3c4756e51b

$ git cat-file -t af5626b4a114abcb82d63db7c8082c3c4756e51b
blob

$ git cat-file -p af5626b4a114abcb82d63db7c8082c3c4756e51b
Hello, world!
```

```bash
# -w for write into codebase,
# --stdin for reading from stdin not file
echo 'test content' | git hash-object -w --stdin
git cat-file -p <object-hash-number>
```

```bash
#!/bin/bash

function separator() {
    for i in {1..20}
    do
        printf "-"
    done
    printf $1
    for i in {1..20}
    do
        printf "-"
    done
    printf "\n"
}

function git_object_type() {
    printf "type => "
    git cat-file -t $1
    for i in {1..40}
    do
        printf "-"
    done
    printf "\n"
}

function git_object_content() {
    git cat-file -p $1
}

function print_git_objects() {
    files=$(git rev-list --parents --objects HEAD | awk '{print $1}')
    index=0

    for file in $files
    do
        len=$(expr length "$file")

        if [ $len -gt 30 ]
        then
            index=$(expr $index + 1)
            separator $index
            echo $file
            git_object_type $file
            git_object_content $file
        fi
    done
}

print_git_objects
```

## Packfiles

Each `*.pack` file in `.git/objects/pack/`
is called a `packfile`.
Packfiles store multiple objects in compressed forms.

The pack-index `.idx` operates
like a query index that speeds up read queries
that rely on the primary key (object ID).

![Git Packfile](./figures/git-packfile.webp 'Git Packfile')

## Add

- create blob objects: contains content of files
- add files to index list (.git/index)

## Commit

- create tree objects: each object represent a directory,
  contains blob object refs in this directory
- create commit object:
  contains root tree object hash number and parent commit object hash number

## Checkout

```bash
git checkout <commit-hash-id>
```

- get commit object by commit hash id
- get root tree object in commit object
- write file entries by root tree object (tree graph)
- write .git/index
- set HEAD to that commit (detached HEAD state)

```ts
// Get file commit history
const Git = require('nodegit')

let repo

Git.Repository.open(path.resolve('./.git'))
  .then((r) => {
    repo = r
    return repo.getMasterCommit()
  })
  .then((firstCommitOnMaster) => {
    const walker = repo.createRevWalk()
    walker.push(firstCommitOnMaster.sha())
    walker.sorting(Git.Revwalk.SORT.Time)

    return walker.fileHistoryWalk(historyFile, 2)
  })
  .then((resultingArrayOfCommits) => {
    if (resultingArrayOfCommits.length > 0) {
      const commit = resultingArrayOfCommits[0].commit
      const date = commit.date()
    }
  })

function getGitLastUpdatedTimeStamp(filePath) {
  let lastUpdated = 0

  try {
    lastUpdated
      = Number.parseInt(
        spawn
          .sync('git', ['log', '-1', '--format=%at', path.basename(filePath)], {
            cwd: path.dirname(filePath),
          })
          .stdout.toString('utf-8')
      ) * 1000
  } catch (e) {
    /* do not handle for now */
  }

  return lastUpdated
}
```

## Merge

```bash
git merge <giver-branch>/<giver-commit>
```

- write giver commit hash to `.git/MERGE_HEAD`
- find base commit (the most recent common ancestor commit)
- diff and apply according to base commit, giver commit, receiver commit
- do what `git checkout` do
- remove `.git/MERGE_HEAD`

## Fetch

- get hash of remote commit and its root tree object
- copy all diff objects in tree graph into .git/objects
- update `.git/refs/remotes/origin/<branch>`, set `.git/FETCH_HEAD` to it

## Clone

`git init` + `git remote add origin <repo-url>` + `git pull origin`

## Push

- apply commit to remote repo
- update remote repo `.git/refs/heads/<branch>` to new commit
- update local repo `.git/refs/remotes/origin/<branch>` to new commit

## Branch

- HEAD -> refs/heads/master -> commit object
- branches are just refs, refs are just files (contain commit hash id)

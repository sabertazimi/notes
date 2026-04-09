---
sidebar_position: 11
tags: [Programming, Git]
---

# Repo Slimming

## Status

```bash
# 查看仓库总大小
du -sh .git
git count-objects -vH

# 按文件路径聚合历史体积
git rev-list --objects --all \
  | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' \
  | sed -n 's/^blob //p' \
  | awk '{sum[$3] += $2; count[$3]++} END {for (f in sum) printf "%d\t%d\t%s\n", sum[f], count[f], f}' \
  | sort -rn | head -20

# 按目录聚合历史体积
git rev-list --objects --all \
  | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' \
  | sed -n 's/^blob //p' \
  | awk '{
      split($3, parts, "/")
      dir = parts[1]
      sum[dir] += $2
    } END {
      for (d in sum) printf "%.1f MB\t%s\n", sum[d]/1024/1024, d
    }' | sort -rn
```

## Clean

```bash
# 1. 备份
cp -r my-repo my-repo.bak

# 2. 清除大文件/垃圾文件历史
git filter-repo \
  --path yarn.lock \
  --path Java/JavaBasic.docx \
  --path-glob 'OS/.fuse_hidden*' \
  --invert-paths

# 3. 清理 reflog + 垃圾回收
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 4. 验证
git fsck --full
du -sh .git

# 5. 恢复 origin
git remote add origin <url>

# 6. 强制推送
git push --force --all
git push --force --tags
```

## Caveats

- `filter-repo` 会自动移除 `origin` remote
- `filter-repo` 会重写所有 commit hash, 导致 GPG 签名被移除
- 只清理已不在工作目录中的垃圾文件, **不要删除旧目录路径**:
  内容已迁移到新路径, 删除旧路径会导致 commit 丢失

---
name: syncing-repositories
description: Use when checking sync status between local and remote branches across multiple repositories
---

# Syncing Repositories

## Overview

Check whether local branches are ahead of, behind, or in sync with their remote tracking branches across multiple repositories.

## When to Use

Use when you need to verify if:

- Any repository needs to be pushed (`git push`)
- Any repository needs to be pulled (`git pull`)
- All repositories are up-to-date with remote

## Quick Reference

| Command                | Purpose                                                              |
| ---------------------- | -------------------------------------------------------------------- |
| `ls -d */`             | Discover all repositories                                            |
| `git rev-list`         | Get ahead/behind counts                                              |
| Format: `ahead behind` | First = local commits not pushed, Second = remote commits not pulled |

## Implementation

### Step 1: Discover Repositories

```bash
ls -d */
```

### Step 2: Fetch Remote Updates (Parallel)

For each repository, fetch latest remote references first:

```bash
cd repo-name && git fetch origin
```

This ensures accurate sync status by updating remote branch references.

### Step 3: Check Sync Status (Parallel)

For each repository, check ahead/behind counts:

```bash
cd repo-name && git rev-list --left-right --count main...origin/main
```

Output format: `ahead behind` (e.g., `3 0` = 3 ahead, 0 behind)

### Step 4: Present Results

Use a markdown table for clear presentation:

| 仓库  | 状态      | 领先 | 落后 |
| ----- | --------- | ---- | ---- |
| repo1 | ✅ 已同步 | 0    | 0    |
| repo2 | ⚠️ 需推送 | 2    | 0    |
| repo3 | ⚠️ 需拉取 | 0    | 1    |

## Common Mistakes

| Mistake                      | Why It's Wrong                                      | Fix                                     |
| ---------------------------- | --------------------------------------------------- | --------------------------------------- |
| Not fetching before checking | Uses stale remote references, misses remote changes | Always run `git fetch` first            |
| Using `git status -sb` only  | Doesn't show ahead/behind counts clearly            | Use `git rev-list --left-right --count` |
| Checking repos sequentially  | Slow with many repos                                | Run commands in parallel                |
| Not handling missing remotes | Command fails or gives unclear output               | Add `2>/dev/null \|\| echo "No remote"` |
| Outputting raw numbers       | Hard to parse mentally                              | Format as readable table                |
| Forgetting to cd into repo   | Command runs in wrong directory                     | Each check needs `cd repo &&`           |

## Real-World Impact

Before: 7 repos, manual `git status` in each, hard to compare

After: Single scan, clear table, immediate action items

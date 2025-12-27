---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git diff:*), Bash(git log:*)
description: Create a git commit
---

# Claude Command: Commit

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task

1. Analyze the diff to understand what knowledge/concept is being documented
2. Generate 3 commit message candidates based on the changes following `<type>(<scope>): <description>` format:
   - Types: `feat` (new notes/domains), `fix` (updates to existing notes), `update`, `build`, `perf`, `test`
   - Scope: extract from filename (e.g. `react-hooks`); use category (e.g. `web-react`) only for multi-area changes
   - Description: the actual knowledge/concept name, extracted from headings, code examples, or explanatory text
   - Key principle: never use structural words like `section`, `content`, `notes` in descriptions
     Examples:
     Bad: `fix(react-hooks): add useEffect section`
     Good: `fix(react-hooks): useEffect cleanup functions`
     Bad: `fix(css): update grid subsection`
     Good: `fix(css-grid): grid auto-placement behavior`
     Bad: `fix(rust): add ownership part`
     Good: `fix(rust-ownership): borrow checker rules`
3. Select the most appropriate commit message from the 3 candidates and explain the reasoning for your choice
4. Stage changes if necessary using git add
5. Execute git commit using the selected commit message

## Options

`--no-add`: Do not stage any new changes using `git add`, only commit staged changes

## Constraints

- DO NOT add Claude co-authorship footer to commits

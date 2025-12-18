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

1. Analyze the diff content to understand the nature and purpose of the changes
2. Generate 3 commit message candidates based on the changes
   - Each candidate should follow `<type>(<scope>): <description>` format
   - Use specific section/topic from filename (e.g., `react-hooks`, `css-layouts`) as scope
   - **Description should summarize the actual knowledge/concept**
   - Focus on what changed, not how you changed it
   - Be specific: "useEffect cleanup" not "useEffect section"
3. Select the most appropriate commit message from the 3 candidates and explain the reasoning for your choice
4. Stage changes if necessary using git add
5. Execute git commit using the selected commit message

## Examples

- Instead of: `add useEffect section`
- Use: `useEffect cleanup patterns` or `useEffect dependency array`

- Instead of: `fix CSS notes`
- Use: `flexbox gap vs margin` or `CSS grid auto-placement`

- Instead of: `update algorithms section`
- Use: `binary search optimization` or `time complexity analysis`

## Options

`--no-add`: Do not stage any new changes using `git add`, only commit staged changes

## Constraints

- DO NOT add Claude co-authorship footer to commits

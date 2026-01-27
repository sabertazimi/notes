---
sidebar_position: 10
tags: [Web, DevOps, Linter, ESLint, Commit]
---

# Linters

## ESLint

Flat config compatibility [solution](https://github.com/vercel/next.js/discussions/49337).

## Commit

```json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -e -V",
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/**/*.{js,jsx, ts, tsx}": ["eslint --fix", "git add"],
    "src/**/*.{css, scss}": ["stylelint --fix", "git add"]
  }
}
```

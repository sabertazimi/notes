---
sidebar_position: 10
tags: [Web, DevOps, Linter, ESLint, Commit]
---

# Linters

## ESLint

### Legacy

Flat config compatibility [solution](https://github.com/vercel/next.js/discussions/49337).

### Flat

Use config [inspector](https://github.com/eslint/config-inspector)
to view ESLint flat config:

```bash
npx @eslint/config-inspector@latest
```

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

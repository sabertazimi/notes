---
sidebar_position: 4
tags: [Web, Node.js, Package Manager, PNPM]
---

# PNPM

## Installation

```bash
sudo pacman -S pnpm
```

```bash
pnpm --version
pnpm store path
```

Using a standalone script (without `Node.js` installed):

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## Configuration

```bash
pnpm config -g set registry https://registry.npmmirror.com/
```

## Workspace

```bash
pnpm update -r @dg-scripts/eslint-config @dg-scripts/stylelint-config --latest
```

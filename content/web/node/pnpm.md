---
sidebar_position: 4
tags: [Web, Node.js, Package Manager, PNPM]
---

# PNPM

## Installation

Using Corepack or npm (recommended installation):

```bash
# Using Corepack.
corepack enable pnpm

# Using npm.
npm install -g pnpm
```

```bash
alias np=pnpm
source ~/.zshrc
which pnpm
pnpm --version
pnpm store path
```

Using a standalone script (without Node.js installed):

```bash
# By script.
wget -qO- https://get.pnpm.io/install.sh | sh -

# By manual download.
mv ./pnpm-linux-x64 ./pnpm
chmod +x ./pnpm
./pnpm setup --force
```

## Configuration

```bash
pnpm config -g set registry https://registry.npmmirror.com/
```

## Workspace

```bash
pnpm update -r @dg-scripts/eslint-config @dg-scripts/stylelint-config --latest
```

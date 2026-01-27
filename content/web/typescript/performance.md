---
sidebar_position: 22
tags: [Web, TypeScript, Performance]
---

# Performance

## Diagnose

- Latest version for TypeScript, dependencies, editor, plugins and extensions.
- Disable all editor extensions.
- No other hogging resources.
- Use strict compilation.

Fixing TypeScript [performance problems](http://viget.com/articles/fixing-typescript-performance-problems):

```bash
tsc --listFilesOnly
tsc --explainFiles > explanations.md
tsc --extendedDiagnostics
tsc --generateTrace <output_dir>
```

```bash
node --max-old-space-size=8192 ./node_modules/.bin/tsc -b --extendedDiagnostics --generateTrace ./ts-trace
pnpm dlx analyze-trace ./ts-trace
```

## Compiler

- Faster tools: `swc`/`rome`.
- Multithread: `ts-loader` + `fork-ts-checker-plugin`.
- Project references (`tsc -b` build mode):
  - Find `tsconfig` referenced projects.
  - Detect if they are up-to-date.
  - Build out-of-date projects in correct order.
  - Build provided `tsconfig` if itself or any dependencies have changed.
- Skip type checking (sometimes).
- Load `@types/` by need (`include`/`exclude`/`compilerOptions.types`).
- `tsc --listFiles` 列出编译时包含文件列表,
  `tsc --traceResolution` 列出编译时包含文件原因.

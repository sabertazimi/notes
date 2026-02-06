# Ralph Loop

## Your Task

1. Read `scripts/ralph/prd.json`
2. Read `scripts/ralph/progress.txt`
   (check Codebase Patterns first)
3. Check you're on the correct branch
4. Pick highest priority story
   where `passes: false`
5. Implement that ONE story
6. Run typecheck and tests
7. Update AGENTS.md files with learnings
8. Commit: `feat: [ID] - [Title]`
9. Update prd.json: `passes: true`
10. Append learnings to progress.txt

## Priority

选择下一个任务时, 按以下顺序优先处理:

1. 架构决策和核心抽象
2. 模块之间的集成点
3. 未知的未知和探索性工作
4. 标准功能和实现
5. 抛光、清理和快速胜利
   在高风险工作上快速失败. 将简单的胜利留到后面.

## Feedback

在每次迭代中:

1. 实现功能
2. 运行类型检查: `tsc --noEmit`
3. 运行测试: `npm test`
4. 运行 Linter: `npm run lint`
5. 只有在所有检查通过后才提交

## Progress Format

APPEND to `progress.txt`:

```md
## [Date] - [Story ID]
- What was implemented
- Files changed
- **Learnings:**
  - Patterns discovered
  - Gotchas encountered
---
```

## Codebase Patterns

Add reusable patterns to the TOP of `progress.txt`:

```md
## Codebase Patterns
- Migrations: Use IF NOT EXISTS
- React: useRef<Timeout | null>(null)
```

## Code Quality

这是生产代码库. 请遵循:

- 使用 TypeScript 严格模式, 禁止 any 类型
- 每个函数都需要单元测试
- 遵循现有的文件结构和命名约定
- 提交前必须通过所有 lint 和类型检查

优先级: 可维护性 > 性能 > 快速交付

## Stop Condition

If ALL stories pass, reply:
`<promise>COMPLETE</promise>`
Otherwise end normally.

## Loop

### Coverage

```md
@coverage-report.txt
查找覆盖率报告中的未覆盖行。
为最关键未覆盖的代码路径编写测试。
再次运行覆盖率并更新 coverage-report.txt。
目标：至少 80% 覆盖率。
```

### Linting

```md
运行：npm run lint
一次修复一个 Linting 错误。
再次运行 lint 以验证修复。
重复直到没有错误。
```

### Entropy

```md
扫描代码异味：未使用的导出、死代码、不一致的模式。
每次迭代修复一个问题。
在 progress.txt 中记录你更改的内容。
```

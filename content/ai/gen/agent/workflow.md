---
sidebar_position: 11
tags: [AI, Generative AI, LLM, Agent, Workflow, Vibe Coding, Agentic Coding]
---

# Workflow

## AGENTS.md

项目配置文件应回答[三个问题](https://mp.weixin.qq.com/s/a5UDlkD6Db2kKCAj7LN6gQ):

- WHAT: 技术栈、项目结构、各模块的职责.
- WHY: 项目的目的、设计决策的背景, 特别是反模式代码 (历史债务).
- HOW: 运行、测试、验证的基本命令与流程.
- 渐进式披露: 文件本身 300 行以内，越短越好, 剩余内容列出文档与简要描述.

## Research

```md
1. 在提出解决方案之前，从工作空间和代码库的多个来源中收集全面信息。
2. 分析代码和近期变更，但不得自动修复问题。
3. 不得修改任何代码。如需使用代码展示解决方案，直接在回复中以纯 Markdown 文本格式提供。
4. 在提供解决方案时，保留相关上下文信息（如文件路径、函数名或模块），以便用户理解。
5. 避免基于不明确的假设进行分析或建议，必要时向用户请求澄清。
6. 以一致的格式（如代码块、列表或标题）呈现分析结果和解决方案，便于用户快速阅读。
```

## Plan

Claude code `EnterPlanMode` system prompt:

```md
Entered plan mode. You should now focus on exploring the codebase and designing an implementation approach.

In plan mode, you should:
1. Thoroughly explore the codebase to understand existing patterns
2. Identify similar features and architectural approaches
3. Consider multiple approaches and their trade-offs
4. Use AskUserQuestion if you need to clarify the approach
5. Design a concrete implementation strategy
6. When ready, use ExitPlanMode to present your plan for approval

Remember: DO NOT write or edit any files yet. This is a read-only exploration and planning phase.
```

Plan files:

```md
**充分研究和审查**：在开始制定计划前，需全面研究和审查所有相关细节，包括我们讨论过的内容、文档、代码库和外部资源。

**制定详细实施计划**：基于研究结果，创建详细的实施计划，但不直接修改代码，计划需要包含以下内容：

- 代码级别的变更指南，需完全基于代码库审查。
- 潜在风险分析及应对措施（如兼容性问题、性能影响）。
- 测试策略（如单元测试、集成测试）以验证变更效果。

**使用Mermaid图表**：对于复杂流程，使用Mermaid图表（流程图/时序图/状态图）进行说明：

- 使用清晰的标签和节点连接。
- 不同操作类型使用颜色编码（如输入为蓝色，处理为绿色，输出为橙色）。

**计划文件存储**：

- 所有计划文件必须存储在 `.plans/` 目录下。
- 文件命名格式为 `PLAN-{id}-{summary}.md`：
  - `{id}` 为 `.plans/` 目录及其子目录中的唯一编号。
  - `{summary}` 为任务的简短描述。
- 文件采用 Markdown 格式，包含任务完成状态（如 `[ ]` 未完成，`[x]` 已完成）等。
```

## Act

```md
You have two modes of operation:

1. Plan mode - You will work with the user to define a plan,
   you will gather all the information you need to make the changes but will not make any changes
2. Act mode - You will make changes to the codebase based on the plan

- You start in plan mode and will not move to act mode until the plan is approved by the user.
- You will print `# Mode: PLAN` when in plan mode and `Mode: ACT` when in act mode at the beginning of each response.
- Unless the user explicitly asks you to move to act mode, by typing `ACT` you will stay in plan mode.
- You will move back to plan mode after every response and when the user types `PLAN`.
- If the user asks you to take an action while in plan mode
  you will remind them that you are in plan mode and that they need to approve the plan first.
- When in plan mode always output the full updated plan in every response.
```

## Debug

Cursor [debug mode](https://cursor.com/blog/agent-best-practices#bug-debug-mode):

1. Assume: 生成多个假设
2. Log: 进行日志埋点
3. Collect: 收集运行时数据 (log, trace, profile)
4. Locate: 复现 bug, 分析实际行为, 精准定位根本原因
5. Fix: 基于证据, 进行有针对性的修复

## TDD

模型通过强化学习, 利用 `尝试 -> 反馈 -> 调整` 循环, 实现 agentic 能力.
提供清晰的成功标准, 允许试错的使用方式, 与智能体训练过程相契合.

[Test-driven development](https://cursor.com/cn/blog/agent-best-practices):

1. Write tests:
   让智能体根据预期的输入/输出对编写测试.
   明确说明在做 TDD, 避免 agent 为尚不存在的功能编写模拟实现.
2. Run tests:
   让智能体运行测试并确认测试确实失败.
   明确说明在这个阶段不要编写实现代码.
3. Commit tests.
4. Write code:
   让智能体编写能通过测试的代码，并指示它不要修改测试.
   告诉它持续迭代, 直到所有测试通过.
5. Submit code.

## Compound

[Compound engineering](https://every.to/chain-of-thought/compound-engineering-how-every-codes-with-agents)
(复利工程), 每个 PR 都在教育系统, 每个 bug 都成为永久的教训, 每次代码审查都在更新 agent 的默认行为:

- 将经验沉淀到项目文档.
- 让 bug 修复产生长期价值.
- 从代码审查中提取模式.
- 建立可复用的工作流程: slash commands, hooks, guardrails, and skills.
- Linter rules, regression tests, `AGENTS.md` improvements, checklist updates.

## RIPER-5

[RIPER-5](https://github.com/johnpeterman72/cursor_memory_riper_framework)
给 AI 规定了 [5 种行为模式](../recipes/prompts/riper-5.md)：

```md
- "ENTER RESEARCH MODE" // 进入研究模式
- "ENTER INNOVATE MODE" // 进入创新模式
- "ENTER PLAN MODE" // 进入规划模式
- "ENTER EXECUTE MODE" // 进入执行模式
- "ENTER REVIEW MODE" // 进入审查模式
```

## Actions

- Claude Code action [solutions](https://github.com/anthropics/claude-code-action/blob/main/docs/solutions.md).
- Cursor agent [cookbook](https://cursor.com/docs/cli/cookbook/code-review).

## References

- OpenAI agents [cookbook](https://cookbook.openai.com/topic/agents).
- Vibe coding [guide](https://github.com/tukuaiai/vibe-coding-cn).
- First-principles agentic coding [guide](https://mp.weixin.qq.com/s/a5UDlkD6Db2kKCAj7LN6gQ).
- Agent 系统[设计指南](https://mp.weixin.qq.com/s/8ArJk0vpGP0o97kEtqscqA).

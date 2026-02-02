---
sidebar_position: 2
tags: [AI, Generative AI, LLM, Agent, Pattern]
---

# Patterns

Agent design [patterns](https://rlancemartin.github.io/2026/01/09/agent_design):

- Give agents a computer (CLI and files)
- Progressive disclosure
- Offload context
- Cache context
- Isolate context
- Evolve context

## Architecture

General agent [components](https://www.kaggle.com/whitepaper-agents):

- LLM (brain)
- Prompting (instructions)
- Memory
- External knowledge
- Tools

![Agent Architecture](./figures/agent-architecture.png 'Agent Architecture')

## First-Principles

从李世石与 AlphaGo 的围棋对战中的第 37 手,
我们可以总结出[第一性原理](https://www.chasewhughes.com/writing/beyond-the-replica-the-case-for-first-principles-agents)
智能体的基本原则:

- Replica agents: 当流程需要人工审核、代理作为用户的副驾驶员或与仅限 UI 的旧版工具集成时，使用仿生学。
- Alien agents: 当目标是纯粹的结果效率时，使用第一性原理。

## Asymmetry of Verification and Verifiers

Asymmetry of verification and verifiers [law](https://www.jasonwei.net/blog/asymmetry-of-verification-and-verifiers-law):

所有可解决且易于验证的问题, 都将被 AI 解决.

:::caution[Agent Traffic]

[Among the agents](https://www.hyperdimensional.co/p/among-the-agents):

Value of highly polished UI and enterprise applications will decrease,
value of performant, reliable, extensible API will increase.

:::

## Agent-Native

[Agent-native](https://every.to/guides/agent-native) apps should:

- Parity (对等性): 用户通过 UI 完成任务 `<->` Agent 通过工具实现.
- Granularity (细粒度): tools should be atomic primitives.
- Composability: 有了上述两点, 只需编写新的提示词即可创建新功能.
- Emergent capability.
- Files as universal interface: files for legibility, databases for structure.
- Improvement over time:
  - Accumulated context: state persists across sessions.
  - Developer-level refinement: system prompts.
  - User-level customization: user prompts.

```md
**Who I Am**:
Reading assistant for the Every app.

**What I Know About This User**:
- Interested in military history and Russian literature
- Prefers concise analysis
- Currently reading *War and Peace*

**What Exists**:
- 12 notes in /notes
- three active projects
- User preferences at /preferences.md

**Recent Activity**:
- User created "Project kickoff" (two hours ago)
- Analyzed passage about Austerlitz (yesterday)

**My Guidelines**:
- Don't spoil books they're reading
- Use their interests to personalize insights

**Current State**:
- No pending tasks
- Last sync: 10 minutes ago
```

:::tip[Agent-native Product]

Build capable foundation,
observe what users ask agent to do,
**formalize patterns** that emerge:

- Common patterns: domain tools.
- Frequent requests: dedicated prompts.
- Unused tools: remove.

:::

## Self-Evolving

Self-evolving [agents](https://github.com/CharlesQ9/Self-Evolving-Agents),
use runtime experience and external signals to optimize future behavior:

- Update evaluation datasets.
- Enhanced context engineering.
- Tool optimization and creation.
- Refine guardrails.

[![Flywheel](./figures/flywheel.png)](https://www.kaggle.com/whitepaper-agent-quality)

## AgentOps

[![AgentOps](./figures/agent-ops.png)](https://www.kaggle.com/whitepaper-prototype-to-production)

## References

- Agents [whitepaper](https://www.kaggle.com/whitepaper-agents).
- Minimal coding agent design [patterns](https://mariozechner.at/posts/2025-11-30-pi-coding-agent).

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

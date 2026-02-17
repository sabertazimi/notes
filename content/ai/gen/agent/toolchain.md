---
sidebar_position: 50
tags: [AI, Generative AI, LLM, Agent, Library, Toolchain]
---

# Toolchain

## LangChain

[LangChain](https://upstash.com/blog/langchain-explained)
aims to make programming with LLMs easier.

[![LangChain Modules](./figures/lang-chain.png)](https://github.com/langchain-ai/langchainjs)

Model I/O module
normalize LLM inputs (e.g. prompts), APIs, and outputs (e.g. completions):

![LangChain Model I/O Module](./figures/lang-chain-model-io.png 'LangChain Model I/O Module')

Retrieval module
help to process data alongside the user inputs,
making it easier to retrieve relevant information:

![LangChain Retrieval Module](./figures/lang-chain-retrieval.png 'LangChain Retrieval Module')

Chains module
link tasks together:

![LangChain Chains Module](./figures/lang-chain-chains.png 'LangChain Chains Module')

Agents module
is chains with a list of functions (called tools) it can execute,
while chains are hardcoded,
agents choose their actions with the help of an LLM:

![LangChain Agents Module](./figures/lang-chain-agents.png 'LangChain Agents Module')

See more code [snippets](../recipes/code/langchain.md).

## LangGraph

Building agent with [LangGraph](https://www.kaggle.com/code/markishere/day-3-building-an-agent-with-langgraph).

## Library

### Instruction

- [AGENTS.md](https://github.com/agentsmd/agents.md):
  Open format for guiding coding agents.
- [llms.txt](https://github.com/AnswerDotAI/llms-txt):
  Helping language models use website.
- [System](https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools):
  System prompts for agents.

### SDK

- [LangChain](https://github.com/langchain-ai/langchain):
  Platform for reliable agents.
- [LangGraph](https://github.com/langchain-ai/langgraph):
  Build resilient language agents as graphs.
- [LlamaIndex](https://github.com/run-llama/llama_index):
  Build RAG applications on top of LLMs.
- [Crew](https://github.com/crewaiinc/crewai):
  Orchestrate role-playing, autonomous agents
- [AgentOS](https://github.com/agno-agi/agno):
  Build, run, manage multi-agent systems.
- [TypeChat](https://github.com/microsoft/TypeChat):
  Makes it easy to build natural language interfaces.

### RAG

- [RAGFlow](https://github.com/infiniflow/ragflow):
  Superior context layer for agents.

### Agents

- [Code](https://github.com/sourcegraph/awesome-code-ai):
  Coding agents.
- [Claw](https://github.com/openclaw/openclaw):
  Personal AI assistant.
- [CUA](https://github.com/trycua/cua)
  Infrastructure for computer-use agents.
- [SWE](https://github.com/princeton-nlp/SWE-agent):
  Issue auto-fixer.
- [PR](https://github.com/qodo-ai/pr-agent):
  Pull request reviewer.
- [Poke](https://github.com/pokeagent/pokeagent.github.io):
  NeurIPS 2025 Pokémon agent challenge.

### Multi-Agent

- [MetaGPT](https://github.com/geekan/MetaGPT):
  Multi-agent framework.
- [ChatDev](https://github.com/OpenBMB/ChatDev):
  Multi-Agent collaboration.

### Memory

- [Mem0](https://github.com/mem0ai/mem0):
  Universal memory layer.
- [MemOS](https://github.com/MemTensor/MemOS):
  Memory operating system.
- [Beads](https://github.com/steveyegge/beads):
  Git-backed graph issue tracker and persistent memory.

### Workflow

- [n8n](https://github.com/Zie619/n8n-workflows):
  n8n workflows.
- [Dify](https://github.com/langgenius/dify):
  LLM app development platform combines workflow, RAG pipeline, agent capabilities.
- [GitHub](https://github.com/github/gh-aw):
  GitHub agentic workflows.

### Project

- [VibeKanban](http://github.com/BloopAI/vibe-kanban):
  Run coding agents in parallel without conflicts, and perform code review.

### Frontend

- [Vercel](https://github.com/vercel/ai):
  Build AI-powered web applications.
- [Mastra](https://github.com/mastra-ai/mastra):
  Build AI-powered applications and agents with modern TypeScript stack.
- [JSON](https://github.com/vercel-labs/json-render):
  AI → JSON → UI.
- [Puck](https://github.com/puckeditor/puck):
  Agentic visual editor for React.
- [Figma](https://github.com/dannote/figma-use):
  Control Figma from command line.
- [Stitch](https://stitch.withgoogle.com):
  UI design toolkit.
- [Agentation](https://github.com/benjitaylor/agentation):
  Elements visual feedback for agents.

### Browser

- [BrowserUse](https://github.com/browser-use/browser-use):
  Web agent.
- [Agent](https://github.com/vercel-labs/agent-browser):
  Browser automation CLI.
- [Stagehand](https://github.com/browserbase/stagehand):
  Browser Automation Framework.
- [LightPanda](https://github.com/lightpanda-io/browser):
  Headless browser designed for automation.
- [FireCrawl](https://github.com/firecrawl/firecrawl):
  Turn entire websites into LLM-ready markdown or structured data.
- [X-Crawl](https://github.com/coder-hxl/x-crawl):
  Flexible Node.js AI-assisted crawler library.

### Client

- [LobeChat](https://github.com/lobehub/lobe-chat):
  Chat framework.
- [ChatBox](https://github.com/chatboxai/chatbox):
  User-friendly desktop client app.
- [CherryStudio](https://github.com/CherryHQ/cherry-studio):
  All-in-One desktop copilot.
- [ChatHub](https://github.com/chathub-dev/chathub):
  All-in-one chatbot client.

### Copilot

- [Everywhere](https://github.com/DearVa/Everywhere):
  Context-aware assistant for desktop.
- [Immersive](https://github.com/immersive-translate/immersive-translate):
  Translate web pages instantly.
- [DeepL](https://github.com/DeepLcom):
  Translation.
- [GrammarLy](https://github.com/grammarly):
  Writing and grammar checker.

### Slide

- [Banana](https://github.com/Anionex/banana-slides):
  AI-native PPT generator based on nano banana pro.

### Documentation

- [DeepWiki](https://github.com/AsyncFuncAI/deepwiki-open).
- [ZRead](https://zread.ai):
  AI-powered github repository reader.

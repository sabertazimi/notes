---
sidebar_position: 2
tags: [AI, Generative AI, LLM, Pattern]
---

# Patterns

## Scaling Law

现有的预训练语言模型对于数据的需求量远高于扩展法则
(e.g. [Chinchilla](https://nips.cc/virtual/2022/53031)) 中所给出的估计规模.
很多更小的模型也能够通过使用超大规模的预训练数据获得较大的模型性能提升.
这种现象的一个重要原因是由于 Transformer 架构具有较好的数据扩展性.
目前为止, 还没有实验能够有效验证特定参数规模语言模型的饱和数据规模
(即随着数据规模的扩展, 模型性能不再提升).

## Emergent Ability

大语言模型的涌现能力被非形式化定义为
`在小型模型中不存在但在大模型中出现的能力`:

- In-context learning.
- Instruction following.
- Step-by-step reasoning.

## Hallucination

Reduce factual, faithfulness, and intrinsic hallucinations:

1. Data: high quality and factual data.
2. RAG.
3. Validation: multistep reasoning, fact-checking, consistency checking, etc.
4. External tools: search engine, calculator, interpreter, etc.

## Recursive Language Models

[`RLM`](https://www.primeintellect.ai/blog/rlm)
通过分治与递归, 实现多跳推理代码, 解决长文本带来的 `Context Rot` 问题.

## References

- 大语言模型[综述](https://github.com/LLMBook-zh/LLMBook-zh.github.io).
- Efficient LLM architectures [survey](https://github.com/weigao266/Awesome-Efficient-Arch).
- Foundational LLM [whitepaper](https://www.kaggle.com/whitepaper-foundational-llm-and-text-generation).
- Text-to-video generation [survey](https://arxiv.org/abs/2403.05131).
- LLMs safety [survey](http://github.com/XSafeAI/AI-safety-report).

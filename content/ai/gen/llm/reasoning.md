---
sidebar_position: 20
tags: [AI, Generative AI, LLM, Reasoning, Inference]
---

# Reasoning

## Chain of Thought

Test-time compute (inference-time compute):
prompting models to generate intermediate [reasoning steps](https://arxiv.org/abs/2201.11903)
dramatically improved performance on [hard problems](https://cameronrwolfe.substack.com/p/demystifying-reasoning-models):

- Long `CoT` and inference-time scaling:
  推理模型不是直接生成最终答案, 而是生成一个详细描述其推理过程的长 `CoT`.
  通过控制长 `CoT` 的长度, 可以控制计算成本, 动态控制推理能力.
- Reasoning model can self-evolution with RL and need less supervision.

:::tip

Thinking tokens are model's only persistent memory during reasoning.

:::

## Inference Acceleration

- Quantization: 改变模型权重和激活值的精度.
- Distillation: data, knowledge, on policy.
- Flash attention: minimize data move between slow `HBM` to faster memory tier (`SRAM`/`VMEM`).
- Prefix caching: avoid recalculating attention scores for input on each auto-regressive decode step.
- Speculative decoding: generate multiple candidates with drafter model (much smaller).
- Batching and parallelization: sequence, pipeline, tensor.

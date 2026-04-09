---
sidebar_position: 1
tags: [AI, Generative AI, LLM]
---

# Generative Model

Pre-trained models + fine-tuning (downstream tasks):

- Cross lingual.
- Cross discipline.
- Pre-training with artificial data.
- Long context window.

![Self-supervised Learning](./figures/self-supervised-learning.webp 'Self-supervised Learning')

## `AR` and `NAR`

- Autoregressive (`AR`) model:
  generate output one token at a time, conditioned on previous tokens.
- Non-autoregressive (`NAR`) model:
  generate output all at once parallel, without conditioning on previous tokens.

|             | `AR` Model | `NAR` Model |
| ----------- | :--------: | :---------: |
| Parallelism |    Low     |    High     |
| Speed       |    Slow    |    Fast     |
| Quality     |    High    |     Low     |

结合上述两种方法 (Encoder + Decoder 架构):

- 用 `AR` model 生成中间向量, 用 `NAR` model 生成最终输出.
- 用 `NAR` model 多次生成, 逐步优化输出.
- Speculative decoding:
  用 `NAR` model 快速生成若干个预测输出, 作为 `AR` model 的后续输入,
  使得 `AR` model 可以同时输出多个结果.

![Generative Model](./figures/generative-model.png 'Generative Model')

## ChatGPT

Fine-tuned GPT model on conversational data:

- Pre-training:
  学习文字接龙, 学习大规模资料 (self-supervised learning), 生成下一个单词.
- Supervised fine-tuning (`SFT`):
  人工文字接龙, 人工标注部分问题的答案 (supervised learning), 引导模型生成的方向.
- Reinforcement learning from human feedback
  ([`RLHF`](https://nips.cc/virtual/2022/52886)):
  训练一个 reward model, 负责评价模型生成的答案, 提供人类反馈.
  以 reward model 的评价分数为 reward, 通过强化学习优化模型.
  一般聚焦于三个方面: 有用性 (Helpfulness), 诚实性 (Honesty), 无害性 (Harmlessness).

:::tip[Alignment]

对齐的[最佳方法](https://cameronrwolfe.substack.com/p/understanding-and-using-supervised):

1. 在适中规模的高质量示例数据集上执行 `SFT`.
2. 将剩余精力投入到整理人类偏好数据, 以便通过 `RLHF` 进行微调.

:::

## Diffusion

Forward process (diffusion) + reverse process (de-noise):

[![Diffusion Model](./figures/diffusion-model.png)](https://nips.cc/virtual/2020/protected/poster_4c5bcfec8584af0d967f1ab10179ca4b.html)

Stable diffusion model:

[![Stable Diffusion](./figures/stable-diffusion.png)](https://ieeexplore.ieee.org/document/9878449)

## Video

Generative videos as world models simulator.

---
sidebar_position: 3
tags: [AI, ML, SelfSupervised, BERT, GPT, FineTuning]
---

# Self-supervised Learning

Pre-trained models + fine-tuning (downstream tasks):

- Cross lingual.
- Cross discipline.
- Pre-training with artificial data.
- Long context window.

## Pre-trained Models

Pre-trained data:

- Content filtering: 去除有害内容.
- Text extraction: 去除 HTML 标签.
- Quality filtering: 去除低质量内容.
- Document deduplication: 去除重复内容.

### BERT

BERT (Bidirectional Encoder Representations from Transformers) 是一种 Encoder-only 预训练模型,
通过大规模无监督学习, 学习文本的语义信息, 用于下游任务的微调:

- Masked token prediction: 随机遮挡输入文本中的一些词, 预测被遮挡的词.
- Next sentence prediction: 预测两个句子的顺序关系.

![Bidirectional Encoder Representations from Transformers](./figures/bert.png 'Bidirectional Encoder Representations from Transformers')

### GPT

GPT (Generative Pre-trained Transformers) 是一种 Decoder-only 预训练模型.

## Fine-tuning

### BERT Adapters

[![BERT Adapters](./figures/bert-adapters.png)](https://ieeexplore.ieee.org/document/10023274)

### Low-Rank Adaptation

低秩适配 (LoRA) 是一种参数高效微调技术 (Parameter-efficient Fine-tuning),
其基本思想是冻结原始矩阵 $W_0\in\mathbb{R}^{H\times{H}}$,
通过低秩分解矩阵 $A\in\mathbb{R}^{H\times{R}}$ 和 $B\in\mathbb{R}^{H\times{R}}$
来近似参数更新矩阵 $\Delta{W}=A\cdot{B^T}$,
其中 $R\ll{H}$ 是减小后的秩:

$$
\begin{equation}
  W=W_0+\Delta{W}=W_0+A\cdot{B^T}
\end{equation}
$$

在微调期间, 原始的矩阵参数 $W_0$ 不会被更新,
低秩分解矩阵 $A$ 和 $B$ 则是可训练参数用于适配下游任务.
LoRA 微调在保证模型效果的同时, 能够显著降低模型训练的成本.

### Instruction-tuning

Make model can understand human instructions not appear in training data:

[![Instruction-tuning](./figures/instruction-tuning.png)](https://iclr.cc/virtual/2022/7102)

- 提高指令复杂性和多样性能够促进模型性能的提升.
- 更大的参数规模有助于提升模型的指令遵循能力.

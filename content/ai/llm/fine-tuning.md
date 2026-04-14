---
sidebar_position: 11
tags: [AI, Generative AI, LLM, Fine-Tuning]
---

# Fine-Tuning

$$
\mathcal{L}_{\text{SFT}} = - \sum\limits_{i=1}^{N} \log P(y_i | x_i; \theta)
$$

## BERT Adapters

[![BERT Adapters](./figures/bert-adapter.png)](https://ieeexplore.ieee.org/document/10023274)

## Supervised Fine-Tuning

```python
from transformers import AutoModelForCausalLM
from datasets import load_dataset
from trl import SFTTrainer

dataset = load_dataset("imdb", split="train")

model = AutoModelForCausalLM.from_pretrained("facebook/opt-350m")

trainer = SFTTrainer(
    model,
    train_dataset=dataset,
    dataset_text_field="text",
    max_seq_length=512,
)

trainer.train()
```

## Instruction-Tuning

Make model can understand human instructions not appear in training data:

[![Instruction-tuning](./figures/instruction-tuning.png)](https://iclr.cc/virtual/2022/7102)

- 提高指令复杂性和多样性能够促进模型性能的提升.
- 更大的参数规模有助于提升模型的指令遵循能力.

## Low-Rank Adaptation

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

---
sidebar_position: 10
tags: [AI, Generative AI, LLM, Pre-Training]
---

# Pre-Training

$$
\mathcal{L}_{\text{pretrain}} = - \sum\limits_{t=1}^{T} \log P(x_t | x_1, x_2, \dots, x_{t-1}; \theta)
$$

## BERT

BERT (Bidirectional Encoder Representations from Transformers) 是一种 Encoder-only 预训练模型,
通过大规模无监督学习, 学习文本的语义信息, 用于下游任务的微调:

- Masked token prediction: 随机遮挡输入文本中的一些词, 预测被遮挡的词.
- Next sentence prediction: 预测两个句子的顺序关系.

![Bidirectional Encoder Representations from Transformers](./figures/bert.png 'Bidirectional Encoder Representations from Transformers')

## GPT

GPT (Generative Pre-trained Transformers) 是一种 Decoder-only 预训练模型.

## Data

Pre-trained data:

- Content filtering: 去除有害内容.
- Text extraction: 去除 HTML 标签.
- Quality filtering: 去除低质量内容.
- Document deduplication: 去除重复内容.

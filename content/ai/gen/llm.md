---
sidebar_position: 1
tags: [AI, Generative AI, LLM, Embeddings, RAG]
---

# Large Language Model

## Generative Model

- Autoregressive (AR) model:
  generate output one token at a time, conditioned on previous tokens.
- Non-autoregressive (NAR) model:
  generate output all at once parallel, without conditioning on previous tokens.

|             | AR Model | NAR Model |
| ----------- | :------: | :-------: |
| Parallelism |   Low    |   High    |
| Speed       |   Slow   |   Fast    |
| Quality     |   High   |    Low    |

结合上述两种方法 (Encoder + Decoder 架构):

- 用 AR model 生成中间向量, 用 NAR model 生成最终输出.
- 用 NAR model 多次生成, 逐步优化输出.
- Speculative decoding:
  用 NAR model 快速生成若干个预测输出, 作为 AR model 的后续输入,
  使得 AR model 可以同时输出多个结果.

![Generative Model](./figures/generative-model.png 'Generative Model')

### ChatGPT

Fine-tuned GPT model on conversational data:

- Pre-training:
  学习文字接龙, 学习大规模资料 (self-supervised learning), 生成下一个单词.
- Supervised fine-tuning (SFT):
  人工文字接龙, 人工标注部分问题的答案 (supervised learning), 引导模型生成的方向.
- Reinforcement learning from human feedback
  ([RLHF](https://nips.cc/virtual/2022/52886)):
  训练一个 reward model, 负责评价模型生成的答案, 提供人类反馈.
  以 reward model 的评价分数为 reward, 通过强化学习优化模型.
  一般聚焦于三个方面: 有用性 (Helpfulness), 诚实性 (Honesty), 无害性 (Harmlessness).

:::tip[Alignment]

对齐的[最佳方法](https://cameronrwolfe.substack.com/p/understanding-and-using-supervised):

1. 在适中规模的高质量示例数据集上执行 SFT.
2. 将剩余精力投入到整理人类偏好数据, 以便通过 RLHF 进行微调.

:::

### Diffusion

Forward process (diffusion) + reverse process (denoise):

[![Diffusion Model](./figures/diffusion-model.png)](https://nips.cc/virtual/2020/protected/poster_4c5bcfec8584af0d967f1ab10179ca4b.html)

Stable diffusion model:

[![Stable Diffusion](./figures/stable-diffusion.png)](https://ieeexplore.ieee.org/document/9878449)

### Video

Generative videos as world models simulator.

## Embeddings

[Various types](https://kaggle.com/whitepaper-embeddings-and-vector-stores):

- Continuous bag of words (CBOW):
  Predict middle word, with embeddings of surrounding words as input.
  Fast to train and accurate for frequent words.
- Skip-gram:
  predict surrounding words in certain range, with middle word as input.
  Slower to train but accurate for rare words.
- GloVe/SWIVEL:
  Capture both global and local information about words with co-occurrence matrix.
- Shallow BoW.
- Deeper pre-trained.
- Multi-modal: image.
- Structured data.
- Graph.

![Word Embeddings](./figures/word-embeddings.png 'Word Embeddings')

![Embedding Models](./figures/embedding-models.png 'Embedding Models')

:::tip[Recommendation Systems]

Maps two sets of data (user dataset, item/product/etc dataset)
into the same embedding space.

:::

Embeddings + ANN (approximate nearest neighbor) vector stores
(ScaNN, FAISS, LSH, KD-Tree, and Ball-tree):

- Retrieval augmented generation (RAG).
- Semantic text similarity.
- Few shot classification.
- Clustering.
- Recommendation systems.
- Anomaly detection.

![Vector Similarity](./figures/vector-similarity.png 'Vector Similarity')

## Supervised Fine-tuning

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

## Reinforcement Learning from Human Feedback

### Proximal Policy Optimization

限制策略更新的变化幅度:

$$
r_t(\theta) = \frac{\pi_{\theta}(a_t | s_t)}{\pi_{\theta_{\text{old}}}(a_t | s_t)}
$$

裁剪 (clipping) 幅度过小或过大的部分,
这就是 `近端` 的含义.

### Group Relative Policy Optimization

PPO 四个模型 (actor, critic, reference, reward), 需要计算成本与大量显存.
[GRPO](https://cameronrwolfe.substack.com/p/grpo-tricks)
对于同一问题 (prompt), 一次性生产一组答案,
利用平均分 (group relative) 估计优势:

$$
\hat{A}_{i,t} = \frac{r_i - \text{mean}(\mathbf{r})}{\text{std}(\mathbf{r})}
$$

从而移除 critic 模型.

## Inference Acceleration

- Quantization: 改变模型权重和激活值的精度.
- Distillation: data, knowledge, on policy.
- Flash attention: minimize data move between slow HBM to faster memory tier (SRAM/VMEM).
- Prefix caching: avoid recalculating attention scores for input on each auto-regressive decode step.
- Speculative decoding: generate multiple candidates with drafter model (much smaller).
- Batching and parallelization: sequence, pipeline, tensor.

## Reasoning

Test-time compute (inference-time compute):
prompting models to generate intermediate [reasoning steps](https://arxiv.org/abs/2201.11903)
dramatically improved performance on [hard problems](https://cameronrwolfe.substack.com/p/demystifying-reasoning-models):

- Long CoT and inference-time scaling:
  推理模型不是直接生成最终答案, 而是生成一个详细描述其推理过程的长 CoT.
  通过控制长 CoT 的长度, 可以控制计算成本, 动态控制推理能力.
- Reasoning model can self-evolution with RL and need less supervision.

:::tip

Thinking tokens are model's only persistent memory during reasoning.

:::

## Retrieval-Augmented Generation

检索增强生成, 通常称为 RAG (Retrieval-Augmented Generation),
是一种强大的聊天机器人的设计模式.
其中, 检索系统实时获取与查询相关的经过验证的源 / 文档,
并将其输入生成模型 (例如 GPT-4) 以生成响应:

- Effect: reduce hallucination.
- Cost: avoid retraining.

![Retrieval-Augmented Generation](./figures/retrieval-augmented-generation.png 'Retrieval-Augmented Generation')

### Context

Context is everything when it comes to getting the most out of an AI tool.
To improve the relevance and quality of a generative AI output,
you need to [improve the relevance and quality of the input](https://github.blog/2024-04-04-what-is-retrieval-augmented-generation-and-what-does-it-do-for-generative-ai).

:::tip

[Quality in, quality out.](https://github.blog/2024-04-04-what-is-retrieval-augmented-generation-and-what-does-it-do-for-generative-ai)

:::

### Agentic

Agentic RAG (autonomous retrieval agents)
actively refine their search based on iterative reasoning:

- Context-aware query expansion.
- Multi-step reasoning.
- Adaptive source selection.
- Validation and correction.

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

## Recursive Language Models

[RLM](https://www.primeintellect.ai/blog/rlm)
通过分治与递归, 实现多跳推理代码, 解决长文本带来的 `Context Rot` 问题.

## Library

### Embeddings and Vector Stores

- [OpenCLIP](https://github.com/mlfoundations/open_clip):
  Encodes images and text into numerical vectors.
- [Chroma](https://github.com/chroma-core/chroma):
  AI-native embedding database.
- [FaISS](https://github.com/facebookresearch/faiss):
  Similarity searching and dense vectors clustering library.

### Text-to-Speech

- [MiniMax](https://www.minimax.io/audio/text-to-speech):
  MiniMax voice agent.
- [ChatTTS](https://github.com/2noise/ChatTTS):
  Generative speech model for daily dialogue.
- [ChatterBox](https://github.com/resemble-ai/chatterbox):
  SoTA open-source TTS model.

### LLMs

- [OLlama](https://github.com/ollama/ollama):
  Get up and running large language models locally.
- [OLlamaUI](https://github.com/open-webui/open-webui):
  User-friendly web UI for LLMs.
- [Transformers](https://github.com/xenova/transformers.js):
  Run HuggingFace transformers directly in browser.
- [Jan](https://github.com/janhq/jan):
  Offline local ChatGPT.
- [LocalLLMs](https://github.com/vince-lam/awesome-local-llms):
  Locally running LLMs.

## References

- 大语言模型[综述](https://github.com/LLMBook-zh/LLMBook-zh.github.io).
- Efficient LLM architectures [survey](https://github.com/weigao266/Awesome-Efficient-Arch).
- Foundational LLM [whitepaper](https://www.kaggle.com/whitepaper-foundational-llm-and-text-generation).
- Text-to-video generation [survey](https://arxiv.org/abs/2403.05131).
- LLMs safety [survey](http://github.com/XSafeAI/AI-safety-report).

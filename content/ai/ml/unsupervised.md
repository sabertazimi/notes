---
sidebar_position: 2
tags: [AI, ML, Unsupervised, PCA, GAN, VAE]
---

# Unsupervised Learning

## Principal Component Analysis

主成分分析 (PCA) 是一种常用的数据降维方法, 将 $m$ 个 $n$ 维向量降为 $k$ 维,
其目标是选择 $k$ 个单位 (模为 $1$) 正交基, 使得原始数据变换到这组基上后,
各字段两两间协方差为 $0$ (各字段完全独立), 各字段的方差尽可能大 (各字段降维后分布尽可能分散),
即在正交的约束下, 取最大的 $k$ 个方差:

$$
\begin{equation}
  C=\frac{1}{m}XX^T=\frac{1}{m}\begin{bmatrix}
    \sum_{i=1}^m(x_i^1)^2&\sum_{i=1}^m{x_i^1x_i^2}&\dots&\sum_{i=1}^m{x_i^1x_i^n}\\
    \sum_{i=1}^m{x_i^2x_i^1}&\sum_{i=1}^m(x_i^2)^2&\dots&\sum_{i=1}^m{x_i^2x_i^n}\\
    \vdots&\vdots&\ddots&\vdots\\
    \sum_{i=1}^m{x_i^nx_i^1}&\sum_{i=1}^m{x_i^nx_i^2}&\dots&\sum_{i=1}^m(x_i^n)^2
  \end{bmatrix}
\end{equation}
$$

协方差矩阵 $C$ 是一个对称矩阵, 其对角线分别为各字段的方差,
其第 $i$ 行 $j$ 列和第 $j$ 行 $i$ 列元素相同, 表示 $i$ 和 $j$ 两个字段的协方差.
将协方差矩阵对角化, 得到基于矩阵运算的 PCA 算法如下:

- 将原始数据按列组成 $n$ 行 $m$ 列矩阵 $X$.
- 将 $X$ 的每一行 (代表一个属性字段) 进行零均值化, 即减去这一行的均值,
  使得 $\bar{x}=0$, 方便方差与协方差的计算.
- 求出协方差矩阵 $C=\frac{1}{m}XX^T$ 的特征值及对应的特征向量.
- 将特征向量按对应特征值大小从上到下按行排列成矩阵, 取前 $k$ 行组成矩阵 $P$.
- $Y=PX$ 即为降维到 $k$ 维后的数据.

:::tip[Normalization]

$$
x'_i=\frac{x_i-\mu}{\sigma}
$$

:::

## Word Embedding

词嵌入是自然语言处理 (NLP) 中的一种技术,
将词汇映射到实数向量空间, 使得词汇之间的语义关系可以通过向量空间中的距离来表示.

## Variational Auto-Encoders

变分自编码器 (VAEs) 是一种生成模型, 通过学习数据的潜在分布来生成新的数据:

$$
\begin{split}
  Z&=\text{Encoder}(X) \\
  X'&=\text{Decoder}(Z) \\
  L&=\text{Min Loss}(X',X)
\end{split}
$$

变分自动编码器学习的是隐变量 (特征) $Z$ 的概率分布, $z\sim N(0, I), x|z\sim N\big(\mu(z), \sigma(z)\big)$,
通过深度网络来学习 $q(z|x)$ 的参数, 一步步优化 $q$ 使其与 $p(z|x)$ 十分相似, 便可用它来对复杂的分布进行近似的推理:

- Feature disentangle:
  voice conversion.
- Discrete representation:
  unsupervised classification, unsupervised summarization.
- Anomaly detection:
  face detection, fraud detection, disease detection, network intrusion detection.
- Compression and decompression.
- Generator.

![Variational Auto-Encoders](./figures/variational-auto-encoders.webp 'Variational Auto-Encoders')

## Generative Adversarial Networks

生成对抗网络 (GANs) 由两个网络组成: 生成器 (Generator) 和判别器 (Discriminator).
生成器的目标是生成尽可能逼真的数据, 判别器的目标是尽可能准确地区分真实数据和生成数据.
两个网络相互对抗, 生成器生成数据 (decoder in VAE), 判别器判断数据真伪 ($1/0$ classification neural network),
生成器根据判别器的判断结果调整生成数据的策略, 不断提升生成数据的逼真程度.

$$
\begin{split}
G^*&=\arg\min_G\max_DV(G,D)\\
D^*&=\arg\max_DV(D,G)
\end{split}
$$

![Generative Adversarial Networks](./figures/generative-adversarial-networks.png 'Generative Adversarial Networks')

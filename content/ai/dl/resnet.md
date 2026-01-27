---
sidebar_position: 4
tags: [AI, DeepLearning, ResNet, Residual]
---

# Residual Connection

ResNet 通过残差学习解决了深度网络的退化问题 (深度网络的训练问题),
最短的路, 决定容易优化的程度: 残差连接 (Residual Connection) 可以认为层数是 0.
最长的路, 决定深度网络的能力: 解决了深度网络的训练问题后, 可以做到更深的网络 (100+).

ResNet 通过引入残差连接, 允许网络学习残差映射而不是原始映射.
残差映射就是目标层与它的前面某层之间的差异 $\mathcal{F}(\mathrm{x}):=\mathcal{H}(\mathrm{x})-\mathrm{x}$.
如果输入和输出之间的差异很小, 那么残差网络只需要学习这些微小的差异即可.
这种学习通常比学习原始的复杂映射要简单得多.

$$
\begin{equation}
\begin{split}
  \mathrm{y}&=\mathcal{F}(\mathrm{x}, W_i)+W_s\mathrm{x}    \\
            &=\mathcal{F}(\mathrm{x})+\mathrm{x}            \\
            &=\mathcal{H}(\mathrm{x})-\mathrm{x}+\mathrm{x} \\
            &=\mathcal{H}(\mathrm{x})
\end{split}
\end{equation}
$$

![Residual Architecture](./figures/residual-architecture.webp 'Residual Architecture')

从深层网络角度来讲, 不同的层学习的速度差异很大,
表现为网络中靠近输出的层学习的情况很好, 靠近输入的层学习的很慢,
有时甚至训练了很久, 前几层的权值和刚开始随机初始化的值差不多 (无法收敛).
因此, 梯度消失或梯度爆炸的根本原因在于反向传播训练法则, 本质在于方法问题.
ResNet 通过残差连接保持梯度传播, 使得网络的训练更加容易:

$$
\begin{equation}
  \frac{\theta{f(g(x))+g(x)}}{\theta{x}}=
  \frac{\theta{f(g(x))}}{\theta{g(x)}}\cdot{\frac{\theta{g(x)}}{\theta{x}}}+\frac{\theta{g(x)}}{\theta{x}}
\end{equation}
$$

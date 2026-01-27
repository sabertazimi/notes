---
sidebar_position: 3
tags: [AI, DeepLearning, RNN, LSTM, Sequence]
---

# Recurrent Neural Networks

循环神经网络 (RNNs) 是一种具有循环结构的神经网络,
可以处理序列数据, 例如时间序列数据, 自然语言文本等.

当序列数据输入到 RNNs 中时, 每个时间步都会产生一个输出,
并将隐藏状态 (Hidden State) 传递到下一个时间步.
因此, 当改变输入序列的顺序时, RNNs 会产生不同的输出
(Changing sequence order will change output).

$$
\begin{equation}
\begin{split}
  h_t&=\sigma(W_hh_{t-1}+W_ix_t+b_h) \\
  y_t&=\sigma(W_oh_t+b_y)
\end{split}
\end{equation}
$$

![Recurrent Neural Networks](./figures/recurrent-neural-networks.png 'Recurrent Neural Networks')

## Long Short-Term Memory

长短期记忆网络 (LSTM) 是一种特殊的 RNN,
通过引入门控机制 (Gate Mechanism) 来控制信息的流动,
解决了长序列训练过程中的梯度消失和梯度爆炸问题.

$$
\begin{equation}
\begin{split}
  f_t&=\sigma(W_f\cdot[h_{t-1},x_t]+b_f) \\
  i_t&=\sigma(W_i\cdot[h_{t-1},x_t]+b_i) \\
  \tilde{C}_t&=\tanh(W_C\cdot[h_{t-1},x_t]+b_C) \\
  C_t&=f_t*{C_{t-1}}+i_t*\tilde{C}_t \\
  o_t&=\sigma(W_o\cdot[h_{t-1},x_t]+b_o) \\
  h_t&=o_t*\tanh(C_t) \\
  y_t&=\sigma(W_yh_t+b_y)
\end{split}
\end{equation}
$$

![Long Short-Term Memory](./figures/long-short-term-memory.png 'Long Short-Term Memory')

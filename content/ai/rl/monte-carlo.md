---
sidebar_position: 10
tags: [AI, ML, RL, MC]
---

# Monte Carlo

## Estimation

蒙特卡罗模拟, 基于经验均值的估计 (Law of Large Numbers, 大数定理):

$$
v(s) \approx \frac{1}{N(s)} \sum_{i=1}^{N(s)} G_i(s)
$$

## Model-Free Policy Iteration

1. Policy evaluation: $q_{\pi_k}(s, a) = \mathbb{E}[G_t | S_t = s_t, A_t = a] \approx \frac{1}{N} \sum_{i=1}^{N} g^{(i)}(s, a)$
2. Policy improvement: $\pi_{k + 1}(s) = \arg\underset{\pi}{\max} \sum\limits_a \pi(a | s)q_{\pi_k}(s, a) \to \pi_{k + 1}(a | s) = 1 \text{ if } a = a_k^*$

## Exploring Starts

反向 update estimate, 更高效地使用数据, 避免重复计算,
并且保证每个状态-动作对 $(s, a)$ 都有机会作为 episode 起点:

1. Episode generation
2. Policy evaluation and policy improvement: start from $T - 1$ step of episode

## Epsilon-Greedy

$\epsilon$-greedy policy, 平衡 exploitation 和 exploration:

$$
\pi(a | s) = \begin{cases}
  1 - \frac{\epsilon}{|\mathcal{A}(s)|}(|\mathcal{A}(s)| - 1), & a = \arg\underset{a}{\max} Q(s, a) \\
  \frac{\epsilon}{|\mathcal{A}(s)|}, & \text{otherwise}
\end{cases}
$$

1. $\epsilon = 0$: greedy policy $\to$ exploitation
2. $\epsilon = 1$: uniform distribution $\to$ exploration

---
sidebar_position: 2
tags: [AI, ML, RL, Bellman]
---

# Bellman Equation

## State Value

### Reward Expectation

在策略 $\pi$ 下从状态 $s$ 出发的期望回报:

$$
v_\pi(s) = \mathbb{E}[G_t | S_t = s]
$$

### Total Expectation

基于全期望公式, 即时奖励 + 折扣后的未来状态值:

$$
v_\pi(s) = \sum\limits_{a \in \mathcal{A}} \pi(a | s) \left[ \sum\limits_{r \in \mathcal{R}} p(r | s, a)r(s, a, s') + \gamma \sum\limits_{s' \in \mathcal{S}} p(s' | s, a)v_\pi(s') \right]
$$

特殊地, 奖励取决于状态转移时:

$$
v_\pi(s) = \sum\limits_{a \in \mathcal{A}} \pi(a | s) \sum\limits_{s' \in \mathcal{S}} p(s' | s, a) [r(s, a, s') + \gamma v_\pi(s')]
$$

## Action Value

### Q-Function

由

$$
\begin{aligned}
  \mathbb{E}[G_t | S_t = s] &= \sum\limits_{a \in \mathcal{A}} \pi(a | s) \mathbb{E}[G_t | S_t = s, A_t = a] \\
\end{aligned}
$$

得到

$$
v_\pi(s) = \sum\limits_{a \in \mathcal{A}} \pi(a | s) q_\pi(s, a)
$$

即

$$
q_\pi(s, a) = \sum\limits_{r \in \mathcal{R}} p(r | s, a)r(s, a, s') + \gamma \sum\limits_{s' \in \mathcal{S}} p(s' | s, a)v_\pi(s')
$$

## Matrix-Vector Form

$\boldsymbol{P}_\pi$ 为策略 $\pi$ 下的状态转移矩阵:

$$
\boldsymbol{v}_\pi = \boldsymbol{r}_\pi + \gamma \boldsymbol{P}_\pi \boldsymbol{v}_\pi
$$

解的存在性和唯一性:

$$
(\boldsymbol{I} - \gamma \boldsymbol{P}_\pi) \boldsymbol{v}_\pi = \boldsymbol{r}_\pi
$$

$$
\boldsymbol{v}_\pi = (\boldsymbol{I} - \gamma \boldsymbol{P}_\pi)^{-1} \boldsymbol{r}_\pi
$$

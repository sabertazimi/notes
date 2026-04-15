---
sidebar_position: 14
tags: [AI, ML, RL, Policy Gradient]
---

# Policy Gradient

## Basic Idea

- 策略参数化: $\pi_\theta(a|s)$
- 策略梯度 vs. 值函数方法的核心区别
- 策略梯度的优势: 天然处理连续动作空间

## Performance Metric 1: Average Value

- 平均状态值 (Average state value)

$$
\bar{v}_\pi = \sum_s d_\pi(s) v_\pi(s)
$$

- 策略 $\pi$ 下的平稳分布 (Stationary distribution) $d_\pi(s)$

## Performance Metric 2: Average Reward

- 平均奖励 (Average reward)

$$
\bar{r}_\pi = \sum_s d_\pi(s) \sum_a \pi(a|s) r(s, a)
$$

- 两个指标的关系: $\bar{v}_\pi = \bar{r}_\pi / (1 - \gamma)$
- 离散时间平均奖励

$$
\bar{r}_\pi = \lim_{T \to \infty} \frac{1}{T} \mathbb{E}\left[\sum_{t=1}^{T} r_t\right]
$$

## Gradients of the Metrics

- 策略梯度定理 (Policy Gradient Theorem)

$$
\nabla_\theta \bar{v}_\pi = \sum_s d_\pi(s) \sum_a \nabla_\theta \pi_\theta(a|s) q_\pi(s, a)
$$

$$
\nabla_\theta \bar{r}_\pi = \sum_s d_\pi(s) \sum_a \nabla_\theta \pi_\theta(a|s) q_\pi(s, a)
$$

- 策略梯度的推导过程
- Score function (对数概率梯度): $\nabla_\theta \ln \pi_\theta(a|s)$

## Gradient Ascent

利用梯度上升算法 (Gradient Ascent), 最大化长期奖励 (learn from rewards and mistakes):

![Gradient Ascent](./figures/gradient-ascent.gif 'Gradient Ascent')

$$
\begin{equation}
\begin{split}
  \theta^*&=\arg\max\limits_\theta\bar{R}_\theta=\arg\max\limits_\theta\sum\limits_{\tau}R(\tau)P(\tau|\theta)\\
  \theta_{t+1}&=\theta_t+\eta\nabla\bar{R}_\theta\\
  \nabla\bar{R}_\theta&=\begin{bmatrix}\frac{\partial\bar{R}_\theta}{\partial{w_1}}\\\frac{\partial\bar{R}_\theta}{\partial{w_2}}\\\vdots\\\frac{\partial\bar{R}_\theta}{\partial{b_1}}\\\vdots\end{bmatrix}\\
  R_t&=\sum\limits_{n=t}^N\gamma^{n-t}r_n
\end{split}
\end{equation}
$$

## Gradient-Based Algorithms & REINFORCE

- REINFORCE 算法

$$
\theta \leftarrow \theta + \alpha G_t \nabla_\theta \ln \pi_\theta(a_t|s_t)
$$

- REINFORCE with baseline: 减少方差

$$
\theta \leftarrow \theta + \alpha (G_t - b(s_t)) \nabla_\theta \ln \pi_\theta(a_t|s_t)
$$

- 基线 (Baseline) 的选取: 状态值函数 $b(s) = v_\pi(s)$
- 方差减少技术的重要性

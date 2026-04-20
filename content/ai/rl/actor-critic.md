---
sidebar_position: 15
tags: [AI, ML, RL, Actor-Critic]
---

# Actor-Critic

![Actor-Critic Model](./figures/actor-critic-model.png 'Actor-Critic Model')

## Simplest

Actor-Critic 框架的基本思想:

- Actor: policy update, 策略 $\pi_\theta(a|s)$
- Critic: policy evaluation, 值函数 $v_\phi(s)$

## Advantage

Advantage actor-critic (`A2C`), 多步 TD 误差作为优势估计:

$$
\hat{A}_t = \sum\limits_{k=0}^{n-1} \gamma^k r_{t+k+1} + \gamma^n v_\phi(s_{t+n}) - v_\phi(s_t)
$$

## Importance Sampling

重要性采样比率 (Importance Sampling Ratio):

$$
\rho_t = \frac{\pi_\theta(a_t|s_t)}{\pi_{\theta_{\text{old}}}(a_t|s_t)}
$$

## Deterministic

`DDPG` (Deep Deterministic Policy Gradient) 算法:

- Actor: 确定性策略 $\mu_\theta(s)$
- Critic: Q 函数 $Q_\phi(s, a)$
- Target networks
- Experience replay
- `Ornstein-Uhlenbeck` 噪声探索

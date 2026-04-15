---
sidebar_position: 15
tags: [AI, ML, RL, Actor-Critic]
---

# Actor-Critic

![Actor-Critic Model](./figures/actor-critic-model.png 'Actor-Critic Model')

## The Simplest Actor-Critic

- Actor-Critic 框架的基本思想
  - Actor (演员): 策略 $\pi_\theta(a|s)$
  - Critic (评论家): 值函数 $v_\phi(s)$
- 用 TD 误差替代 Monte Carlo 回报
- 优势函数 (Advantage function) 的引入

$$
A(s, a) = q_\pi(s, a) - v_\pi(s)
$$

- 策略更新

$$
\theta \leftarrow \theta + \alpha \delta_t \nabla_\theta \ln \pi_\theta(a_t|s_t)
$$

- Critic 更新: TD 学习更新 $v_\phi$

## Advantage Actor-Critic (A2C)

- 优势 Actor-Critic 的完整算法
- 多步 TD 误差作为优势估计

$$
\hat{A}_t = \sum_{k=0}^{n-1} \gamma^k r_{t+k+1} + \gamma^n v_\phi(s_{t+n}) - v_\phi(s_t)
$$

- 并行优势 Actor-Critic (A3C)

## Importance Sampling & Off-Policy Actor-Critic

- 重要性采样 (Importance Sampling) 的基本原理
- 重要性采样比率 (Importance Sampling Ratio)

$$
\rho_t = \frac{\pi_\theta(a_t|s_t)}{\pi_{\theta_{\text{old}}}(a_t|s_t)}
$$

- 离线策略 Actor-Critic 的设计
- 重要性采样的方差问题
- 截断重要性采样 (Truncated IS)

## Deterministic Actor-Critic (DDPG)

- 确定性策略梯度 (Deterministic Policy Gradient)
- 确定性策略 vs. 随机策略
- DDPG (Deep Deterministic Policy Gradient) 算法
  - Actor: 确定性策略 $\mu_\theta(s)$
  - Critic: Q 函数 $Q_\phi(s, a)$
  - Target networks
  - Experience replay
  - Ornstein-Uhlenbeck 噪声探索

## Summary

- 各类 Actor-Critic 方法的对比
- 策略梯度方法的发展脉络
- 实际应用中的考虑

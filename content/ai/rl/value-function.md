---
sidebar_position: 13
tags: [AI, ML, RL, DQN]
---

# Value Function

## Objective Function

均方价值误差 (Mean Squared Value Error, `MSVE`):

$$
J(\boldsymbol{w}) = \mathbb{E}\left[(v_\pi(S) - \hat{v}(S, w))^2\right]
$$

均方贝尔曼误差 (Mean Squared Bellman Error, `MSBE`):

$$
J(\boldsymbol{w}) = \mathbb{E}\left[(r + \gamma \hat{v}(S', w) - \hat{v}(S, w))^2\right]
$$

## Optimization Algorithm

梯度下降更新:

$$
w_{t+1} = w_t + \alpha_t (v_\pi(s_t) - \hat{v}(s_t, w_t)) \nabla_w \hat{v}(s_t, w_t)
$$

## Deep Q-Network

`DQN` 用深度神经网络逼近 $Q(s, a)$, experience replay:

- Break correlations (样本相关性)
- 提高数据利用效率

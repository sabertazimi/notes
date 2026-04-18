---
sidebar_position: 12
tags: [AI, ML, RL, TD, Sarsa, Q-Learning]
---

# Temporal-Difference

## State Value

$$
\underbrace{v_{t+1}(s_t)}_{\text{new estimate}} = \underbrace{v_t(s_t)}_{\text{current estimate}} - \alpha_t(s_t) [ \overbrace{v_t(s_t) - [ \underbrace{r_{t+1} + \gamma v_t(s_{t+1})}_{\text{TD target } \bar{v}_t} ]}^{\text{TD error } \delta_t} ]
$$

## Action Value

### `Sarsa`

On-policy TD control:

$$
q_{t+1}(s_t, a_t) = q_t(s_t, a_t) - \alpha_t(s_t, a_t) [q_t(s_t, a_t) - [r_{t+1} + \gamma q_t(s_{t+1}, a_{t+1})]]
$$

### Expected `Sarsa`

降低 `Sarsa` 的方差:

$$
q_{t+1}(s_t, a_t) = q_t(s_t, a_t) - \alpha_t(s_t, a_t) [q_t(s_t, a_t) - [r_{t+1} + \gamma \sum_{a \in \mathcal{A}} \pi_t(a | s_{t+1}) q_t(s_{t+1}, a)]]
$$

### $n$-Step `Sarsa`

n-step return:

$$
q_{t+1}(s_t, a_t) = q_t(s_t, a_t) - \alpha_t(s_t, a_t) [q_t(s_t, a_t) - [r_{t+1} + \gamma r_{t+2} + \dots + \gamma^n q_t(s_{t+n}, a_{t+n})]]
$$

## Q-Learning

Off-policy TD control:

$$
q_{t+1}(s_t, a_t) = q_t(s_t, a_t) - \alpha_t(s_t, a_t) [q_t(s_t, a_t) - [r_{t+1} + \gamma \max_{a \in \mathcal{A}} q_t(s_{t+1}, a)]]
$$

:::tip[Off-Policy]

离线策略控制: 行为策略 $\neq$ 目标策略

:::

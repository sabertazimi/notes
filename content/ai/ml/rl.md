---
sidebar_position: 4
tags: [AI, ML, Reinforcement, RL, ActorCritic]
---

# Reinforcement Learning

强化学习是一种机器学习方法, 通过智能体与环境交互,
智能体根据环境的反馈调整策略, 利用梯度上升算法 (Gradient Ascent),
最大化长期奖励 (learn from rewards and mistakes).

![Reinforcement Learning](./figures/reinforcement-learning.gif 'Reinforcement Learning')

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

## Actor-Critic Model

![Actor-Critic Model](./figures/actor-critic-model.png 'Actor-Critic Model')

## Inverse Reinforcement Learning

![Inverse Reinforcement Learning](./figures/inverse-reinforcement-learning.png 'Inverse Reinforcement Learning')

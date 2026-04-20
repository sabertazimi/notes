---
sidebar_position: 14
tags: [AI, ML, RL, Policy Gradient]
---

# Policy Gradient

## Gradient Metrics

### Average Value

平均状态值:

$$
\begin{aligned}
  \bar{v}_\pi &= \sum\limits_{s \in \mathcal{S}} d_\pi(s) v_\pi(s) \\
  &= \mathbb{E}\left[\sum\limits_{t=0}^{\infty}\gamma^t R_{t+1} \right]
\end{aligned}
$$

$$
\nabla_\theta \bar{v}_\pi = \sum\limits_{s \in \mathcal{S}} d_\pi(s) \sum\limits_{a \in \mathcal{A}} \nabla_\theta \pi(a|s, \theta) q_\pi(s, a)
$$

### Average Reward

平均奖励:

$$
\begin{aligned}
  \bar{r}_\pi &= \sum\limits_{s \in \mathcal{S}} d_\pi(s) \sum\limits_{a \in \mathcal{A}} \pi(a|s) r(s, a) \\
  &= \lim_{n \to \infty} \frac{1}{n} \mathbb{E}\left[\sum\limits_{k=1}^{n} R_{t+k}\right] \\
  &= (1 - \gamma)\bar{v}_\pi
\end{aligned}
$$

$$
\nabla_\theta \bar{r}_\pi = \sum\limits_{s \in \mathcal{S}} d_\pi(s) \sum\limits_{a \in \mathcal{A}} \nabla_\theta \pi(a|s, \theta) q_\pi(s, a)
$$

## Gradient Ascent

利用梯度上升算法 (Gradient Ascent),
最大化长期奖励 (learn from rewards and mistakes):

![Gradient Ascent](./figures/gradient-ascent.gif 'Gradient Ascent')

$$
\theta^* = \arg\max\limits_\theta\bar{R}_\theta=\arg\max\limits_\theta\sum\limits_{\tau}P(\tau|\theta)R(\tau)
$$

### REINFORCE

Policy gradient by Monte Carlo:

$$
\begin{aligned}
  \theta_{t+1} &= \theta_t + \alpha \mathbb{E}_{S \sim d, A \sim \pi} \left[\nabla_\theta \ln \pi(A|S, \theta) q_\pi(S, A)\right] \\
  &= \theta_t + \alpha \nabla_\theta \ln \pi(a_t|s_t, \theta_t) q_\pi(s_t, a_t) \\
  &= \theta_t + \alpha \underbrace{\left( \frac{q_\pi(s_t, a_t)}{\pi(a_t|s_t, \theta_t)} \right)}_{\beta_t} \nabla_\theta \pi(a_t | s_t, \theta_t)
\end{aligned}
$$

1. $\beta_t \propto q_\pi(s_t, a_t)$: exploitation
2. $\beta_t \propto \frac{1}{\pi(a_t|s_t, \theta_t)}$: exploration

### REINFORCE with Baseline

减少方差:

$$
\begin{aligned}
  \theta_{t+1} &= \theta_t + \alpha \nabla_\theta \ln \pi(a_t|s_t, \theta_t) (q_\pi(s_t, a_t) - b(s_t)) \\
  &= \theta_t + \alpha \nabla_\theta \ln \pi(a_t|s_t, \theta_t) (q_\pi(s_t, a_t) - v_\pi(s_t))
\end{aligned}
$$

---
sidebar_position: 3
tags: [AI, ML, RL, Bellman, Optimal]
---

# Bellman Optimality Equation

## Policy

最优策略:

$$
v_{\pi^*}(s) \geq v_\pi(s), \forall s \in \mathcal{S}, \forall \pi
$$

## State Value

$$
\begin{aligned}
  v^*(s) &= \underset{\pi}{\max} v_\pi(s) \\
  &= \underset{\pi}{\max} \sum\limits_{a \in \mathcal{A}} \pi(a | s) q(s, a) \\
  &= \underset{\pi}{\max} \sum\limits_{a \in \mathcal{A}} \pi(a | s) \left[ \sum\limits_{r \in \mathcal{R}} p(r | s, a)r(s, a, s') + \gamma \sum\limits_{s' \in \mathcal{S}} p(s' | s, a)v_\pi(s') \right]
\end{aligned}
$$

## Action Value

$$
q^*(s, a) = \sum\limits_{r \in \mathcal{R}} p(r | s, a)r(s, a, s') + \gamma \sum\limits_{s' \in \mathcal{S}} p(s' | s, a)v^*(s')
$$

## Matrix-Vector Form

$$
\begin{aligned}
  \boldsymbol{v}^* &= \underset{\pi}{\max}(\boldsymbol{r}_\pi + \gamma \boldsymbol{P}_\pi \boldsymbol{v}^*) \\
  &= \boldsymbol{r}_{\pi^*} + \gamma \boldsymbol{P}_{\pi^*} \boldsymbol{v}^*
\end{aligned}
$$

其中, $\pi^*= \arg\underset{\pi}{\max}(\boldsymbol{r}_\pi + \gamma \boldsymbol{P}_\pi \boldsymbol{v}^*)$.

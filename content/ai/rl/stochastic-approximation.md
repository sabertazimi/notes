---
sidebar_position: 11
tags: [AI, ML, RL, SGD]
---

# Stochastic Approximation

## Mean Estimation

$$
\begin{aligned}
  w_{k+1} &= \frac{1}{k} \sum\limits_{i=1}^{k} x_{i} \\
  &= \frac{1}{k} \left( \sum\limits_{i=1}^{k-1} x_{i} + x_{k} \right) \\
  &= \frac{1}{k} ((k-1)w_{k} + x_{k}) \\
  &= w_{k} - \frac{1}{k}(w_{k} - x_{k})
\end{aligned}
$$

## Robbins-Monro

Model-free solution to $g(w) = 0$:

$$
\begin{aligned}
  w_{k+1} &= w_k - \alpha_k \tilde{g}(w_k, \eta_k), \quad k = 1, 2, 3, \dots \\
  &= w_k - \alpha_k(g(w_k) + \eta_k)
\end{aligned}
$$

收敛条件:

1. $0 < c_1 \leq \nabla_w g(w) \leq c_2, \quad \forall w$
2. $\sum\limits_{k=1}^{\infty} \alpha_k = \infty$ and $\sum\limits_{k=1}^{\infty} \alpha_k^2 < \infty$
3. $\mathbb{E}[\eta_k | \mathcal{H}_k] = 0$ and $\mathbb{E}[\eta_k^2 | \mathcal{H}_k] < \infty, \quad \mathcal{H}_k = \{w_k, w_{k-1}, \dots\}$

## Stochastic Gradient Descent

$$
\begin{aligned}
  w_{k+1} &= w_k - \alpha_k \nabla_w J(w_k) \\
  &= w_k - \alpha_k\mathbb{E}[\nabla_w f(w_k, X)] \\
  &= w_k - \alpha_k \nabla_w f(w_k, x_k)
\end{aligned}
$$

收敛条件:

1. $0 < c_1 \leq \nabla_w^2 f(w, X) \leq c_2$
2. $\sum\limits_{k=1}^{\infty} \alpha_k = \infty$ and $\sum\limits_{k=1}^{\infty} \alpha_k^2 < \infty$
3. $\{x_k\}_{k = 1}^{\infty} \text{ is i.i.d.}$

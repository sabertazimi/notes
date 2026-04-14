---
sidebar_position: 11
tags: [AI, ML, RL, SGD]
---

# Stochastic Approximation

## Motivating Example

- 确定性问题 vs. 随机性问题的求解
- 为什么需要随机逼近方法

## Robbins-Monro (RM) Algorithm: Introduction

- RM 算法的基本形式

$$x_{k+1} = x_k - \alpha_k [g(x_k) + w_k]$$

- 其中 $w_k$ 为零均值随机噪声
- 步长 (Step size) 序列 $\alpha_k$ 的条件:
  1. $\alpha_k \geq 0, \forall k$
  2. $\sum_{k=0}^{\infty} \alpha_k = \infty$ (保证能到达任意点)
  3. $\sum_{k=0}^{\infty} \alpha_k^2 < \infty$ (保证噪声累积有限)

## Robbins-Monro Algorithm: Convergence

- RM 算法的收敛性证明
- 基于鞅收敛定理 (Martingale Convergence Theorem)
- 均方收敛分析

## Stochastic Gradient Descent (SGD): Introduction

- SGD 算法的基本形式

$$\theta_{k+1} = \theta_k - \alpha_k \nabla f_{i_k}(\theta_k)$$

- SGD 与 RM 算法的关系
- 随机梯度的无偏性: $\mathbb{E}[\nabla f_i(\theta)] = \nabla J(\theta)$

## SGD Algorithm: Examples

- 线性回归中的 SGD
- SGD 的实际应用

## SGD Algorithm: Properties

- SGD 的收敛速度分析
- 与批量梯度下降 (Batch GD) 的对比
- SGD 的方差问题

## SGD Algorithm: Comparison

- 不同步长策略的对比
- 常数步长 vs. 衰减步长
- SGD 在深度学习中的应用

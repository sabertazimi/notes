---
sidebar_position: 10
tags: [AI, ML, RL, MC]
---

# Monte Carlo

## Motivating Examples

- 蒙特卡洛估计的基本思想
- 大数定律 (Law of Large Numbers) 的保证

## Monte Carlo Basic: Introduction

- 第一类蒙特卡洛方法 (First-visit MC)
- 第二类蒙特卡洛方法 (Every-visit MC)
- 基于经验均值的估计

$$v(s) \approx \frac{1}{N(s)} \sum_{i=1}^{N(s)} G_i(s)$$

## Monte Carlo Basic: Examples

- 网格世界中的蒙特卡洛估计
- 估计的方差和收敛速度

## Monte Carlo Exploring Starts

- 探索性起点 (Exploring Starts): 每个状态-动作对都有机会作为起点
- MC with Exploring Starts 的完整算法
- 收敛性分析

## Monte Carlo $\epsilon$-Greedy: Introduction

- $\epsilon$-贪心策略 (Epsilon-Greedy Policy)

$$\pi(a|s) = \begin{cases} 1 - \epsilon + \epsilon/|\mathcal{A}|, & a = \arg\max_a Q(s, a) \\ \epsilon/|\mathcal{A}|, & \text{otherwise} \end{cases}$$

- 在线策略 (On-policy) 方法
- 探索与利用的平衡 (Exploration vs. Exploitation)

## Monte Carlo $\epsilon$-Greedy: Examples

- 网格世界中 $\epsilon$-贪心 MC 的实际表现
- 不同 $\epsilon$ 值的影响

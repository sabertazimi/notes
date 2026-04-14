---
sidebar_position: 13
tags: [AI, ML, RL, DQN]
---

# Value Function

## Motivating Example: Curve Fitting

- 为什么需要值函数逼近: 状态空间过大
- 函数逼近的基本思想: $v(s) \approx \hat{v}(s, \boldsymbol{w})$
- 曲线拟合的直觉

## Objective Function

- 均方贝尔曼误差 (Mean Squared Bellman Error, MSBE)

$$J(\boldsymbol{w}) = \mathbb{E}\left[(r + \gamma \hat{v}(s', \boldsymbol{w}) - \hat{v}(s, \boldsymbol{w}))^2\right]$$

- 均方价值误差 (Mean Squared Value Error, MSVE)

$$J(\boldsymbol{w}) = \mathbb{E}\left[(v_\pi(s) - \hat{v}(s, \boldsymbol{w}))^2\right]$$

- MSBE vs. MSVE 的区别与联系
- 随机梯度下降目标

## Optimization Algorithm

- 梯度下降更新

$$\boldsymbol{w} \leftarrow \boldsymbol{w} + \alpha \delta_t \nabla_{\boldsymbol{w}} \hat{v}(s_t, \boldsymbol{w})$$

- 特征向量 / 基函数 (Basis functions) 的选择
- 线性函数逼近 vs. 非线性函数逼近 (神经网络)

## Illustrative Examples and Analysis

- 线性逼近在网格世界中的效果
- 逼近误差分析
- 特征设计的影响

## Sarsa and Q-Learning with Function Approximation

- Sarsa 的函数逼近版本
- Q-learning 的函数逼近版本
- 收敛性: 在线性逼近下有保证, 非线性逼近下不一定收敛

## Deep Q-Network (DQN): Basic Idea

- 用深度神经网络逼近 $Q(s, a)$
- DQN 的基本架构

## DQN: Experience Replay

- 经验回放 (Experience Replay) 机制
- 打破样本相关性 (Break correlations)
- 提高数据利用效率
- 回放缓冲区 (Replay Buffer) 的设计

## DQN: Implementation and Example

- DQN 完整算法流程
- 目标网络 (Target Network) 的使用
- 网格世界中的 DQN 实验结果

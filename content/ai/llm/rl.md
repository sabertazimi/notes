---
sidebar_position: 12
tags: [AI, Generative AI, LLM, Reinforcement, RL]
---

# Reinforcement Learning

## Proximal Policy Optimization

限制策略更新的变化幅度:

$$
r_t(\theta) = \frac{\pi_{\theta}(a_t | s_t)}{\pi_{\theta_{\text{old}}}(a_t | s_t)}
$$

裁剪 (clipping) 幅度过小或过大的部分,
这就是 `近端` 的含义.

$$
\mathcal{L}_{\text{RM}} = - \mathbb{E}_{(x, y_w, y_l)} [\log \sigma(r_\phi(x, y_w) - r_\phi(x, y_l))]
$$

$$
J_{\text{PPO}} = \mathbb{E}_{x, y \sim \pi_\theta} [r_\phi(x, y)] - \beta \cdot D_{\text{KL}}(\pi_\theta \| \pi_{\text{ref}})
$$

## Group Relative Policy Optimization

`PPO` 四个模型 (actor, critic, reference, reward), 需要计算成本与大量显存.
[`GRPO`](https://cameronrwolfe.substack.com/p/grpo-tricks)
对于同一问题 (prompt), 一次性生产一组答案,
利用平均分 (group relative) 估计优势:

$$
\hat{A}_{i,t} = \frac{r_i - \text{mean}(\mathbf{r})}{\text{std}(\mathbf{r})}
$$

从而移除 critic 模型:

$$
J_{\text{GRPO}}(\theta) = \mathbb{E}_{s,a \sim \pi_\theta} \left[ \frac{\pi_\theta(a|s)}{\pi_{\text{ref}}(a|s)} \cdot (r(s,a) - \bar{r}_{\text{group}}) \right] - \beta \cdot D_{\text{KL}}(\pi_\theta || \pi_{\text{ref}})
$$

:::tip[KL 散度惩罚]

KL 散度惩罚, 可以防止策略偏离参考模型太远:
`kl_coef` (KL 散度惩罚系数) 太小 (0.01) 可能导致策略偏离太远 (输出混乱或质量下降),
太大 (0.5) 可能限制学习 (学习缓慢):

$$
D_{\text{KL}}(\pi_\theta || \pi_{\text{ref}}) = \mathbb{E}_{s,a \sim \pi_\theta} \left[ \log \frac{\pi_\theta(a|s)}{\pi_{\text{ref}}(a|s)} \right]
$$

:::

## Agentic RL

- Reasoning: 通过试错学习有效的推理策略, 发现训练数据中没有的推理路径
- Tool Use: 学会何时使用工具、选择哪个工具、如何组合多个工具
- Memory: 学会记忆管理策略, 决定哪些信息值得记住、何时更新/删除
- Planning: 学会动态规划, 权衡短期和长期收益, 发现有效的行动序列
- Self-Improvement: 学会自我反思, 识别错误、分析失败原因、调整策略
- Perception: 提升多模态理解能力, 学会视觉推理、使用视觉工具和视觉规划

![Agentic RL](./figures/agentic-rl.webp 'Agentic RL')

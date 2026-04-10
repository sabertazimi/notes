---
sidebar_position: 21
tags: [AI, Generative AI, LLM, Evaluation]
---

# Evaluation

## Metrics

| 类别   | 指标               | 优点         | 缺点           |
| :----- | :----------------- | :----------- | :------------- |
| 准确性 | Accuracy           | 简单直观     | 过于粗糙       |
| 准确性 | Accuracy@K         | 反映潜力     | 需要多次采样   |
| 准确性 | Numerical Error    | 细粒度       | 仅适用数值任务 |
| 效率   | Avg Length         | 反映成本     | 不考虑质量     |
| 效率   | Avg Steps          | 反映推理风格 | 难以量化       |
| 质量   | Format Correctness | 易于检测     | 不保证正确性   |
| 质量   | Coherence          | 全面评估     | 需要人工       |

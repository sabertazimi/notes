---
sidebar_position: 11
tags: [AI, XAI, Explainable]
---

# Explainable AI

## Local Explanation

Explain the decision of a single instance
(why do you think this image is a `cat`):

- Saliency map:
  use gradient to highlight most important pixels for model's decision
  $|\frac{\partial{e}}{\partial{x_n}}|$.
- Probing:
  perturb input and observe how prediction changes (via 3rd NNs).

## Global Explanation

Explain the whole model (what does a `cat` look like).

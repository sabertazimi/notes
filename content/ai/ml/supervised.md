---
sidebar_position: 1
tags: [AI, ML, Supervised, Regression, Classification]
---

# Supervised Learning

## Regression

Output a scalar:

- Linear regression:
  $y=Wx+b=\sum\limits_{i=1}^n{w_ix_i}+b$,
  $L=\sum\limits_{i=1}^n(y_i-\hat{y}_i)^2$.
- Polynomial regression:
  $y=\sum\limits_{i=1}^n{w_ix^i}+b$.
- Logistic regression (output probability):
  $y=\sigma(Wx+b)=\frac{1}{1+e^{-\sum\limits_{i=1}^n{w_ix_i}-b}}$,
  $L=-\sum\limits_{i=1}^n{y_i\log(\hat{y}_i)}$.

If model can't even fit training data,
then model have large bias (underfitting).
If model can fit training data but not testing data,
then model have large variance (overfitting).

### Underfitting

To prevent underfitting, we can:

- Add more features as input.
- Use more complex and flexible model.

### Overfitting

More complex model does not always lead to better performance
on testing data or new data.

| Model | Training Error | Testing Error |
| :---: | -------------: | ------------: |
|  $x$  |           31.9 |          35.0 |
| $x^2$ |           15.4 |          18.4 |
| $x^3$ |           15.3 |          18.1 |
| $x^4$ |           14.9 |          28.2 |
| $x^5$ |           12.8 |         232.1 |

A extreme example,
such function obtains $0$ training loss, but large testing loss:

$$
\begin{align*}
  f(x)=\begin{cases}
    y_i, & \exists{x_i}\in{X} \\
    \text{random}, & \text{otherwise}
  \end{cases}
\end{align*}
$$

To prevent overfitting, we can:

- More training data.
- Data augmentation: crop, flip, rotate, cutout, mixup.
- Constrained model:
  - Less parameters, sharing parameters.
  - Less features.
  - Early stopping.
  - Dropout.
  - Regularization.

$$
\begin{split}
  L(w)&=\sum\limits_{i=1}^n(y_i-\hat{y}_i)^2+\lambda\sum\limits_{i=1}^n{w_i^2}\\
  w_{t+1}&=w_t-\eta\nabla{L(w)}\\
  &=w_t-\eta(\frac{\partial{L}}{\partial{w}}+\lambda{w_t})\\
  &=(1-\eta\lambda)w_t-\eta\frac{\partial{L}}{\partial{w}}
  \quad (\text{Regularization: Weight Decay})
\end{split}
$$

## Classification

- Binary classification:
  $y=\delta(Wx+b)$,
  $L=\sum\limits_{i=1}^n\delta(y_i\ne\hat{y}_i)$,
  e.g. spam filtering.
- Multi-class classification:
  $y=\text{softmax}(Wx+b)$,
  $L=-\sum\limits_{i=1}^n{y_i\log(\hat{y}_i)}$,
  e.g. document classification.
- Non-linear model:
  - Deep learning: $y=\text{softmax}(\text{ReLU}(Wx+b))$,
    e.g. image recognition, game playing.
  - Support vector machine (SVM): $y=\text{sign}(Wx+b)$.
  - Decision tree: $y=\text{vote}(\text{leaves}(x))$.
  - K-nearest neighbors (KNN): $y=\text{vote}(\text{neighbors}(x))$.

## Structured Learning

### Training

Find a function $F$:

$$
F:X\times{Y}\to{R}
$$

$F(x, y)$ evaluates how well $y$ fits $x$ (object compatible).

### Inference

Given an object $x$:

$$
\tilde{y}=\arg\max\limits_{y\in{Y}}F(x, y)
$$

![Structured Learning](./figures/structured-learning.png 'Structured Learning')

:::tip[Three Problems]

- Evaluation: what does $F(X, y)$ look like.
- Inference: how to solve $\arg\max$ problem.
- Training: how to find $F(x, y)$ with given training data.

:::

### Structured Linear Model

$$
\begin{split}
  F(x, y)&=\sum\limits_{i=1}^n{w_i\phi_i(x, y)} \\
  &=\begin{bmatrix}w_1\\w_2\\w_3\\\vdots\\w_n\end{bmatrix}\cdot
    \begin{bmatrix}\phi_1(x, y)\\\phi_2(x, y)\\\phi_3(x, y)\\\vdots\\\phi_n(x, y)\end{bmatrix}\\
  &=W\cdot\Phi(x, y)
\end{split}
$$

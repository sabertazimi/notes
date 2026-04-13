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

An extreme example,
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

### Binary Class

Spam filtering:

$$
y=\delta(Wx+b)
$$

$$
L=\sum\limits_{i=1}^n\delta(y_i\ne\hat{y}_i)
$$

### Multiple Class

Document classification:

$$
y=\text{softmax}(Wx+b)
$$

$$
L=-\sum\limits_{i=1}^n{y_i\log(\hat{y}_i)}
$$

### Decision Tree

最大化信息增益 (Information Gain):

$$
\begin{aligned}
  a_* &= \underset{a \in A}{\arg \max} \text{Gain}(D, a) \\
  &= \underset{a \in A}{\arg \max} \text{Ent}(D) - \sum_{v=1}^{V}\frac{|{D^v}|}{|{D}|}\text{Ent}(D^v)
\end{aligned}
$$

其中, 信息熵为 $\text{Ent}(D)=-\sum_{k=1}^{|\mathcal{Y}|}p_k\log_2 p_k$,
熵值越大, 数据越混乱, 不确定性越大.

### Support Vector Machine

`SVM`, 寻找距离正负样本都最远的超平面:

$$
y=\text{sign}(Wx+b)
$$

### Bayesian Classifier

贝叶斯分类器, 最小化分类错误率:

$$
\begin{aligned}
  h^*(\boldsymbol{x}) &= \underset{c \in \mathcal{Y}}{\arg \min} R(c | \boldsymbol{x}) \\
  &= \underset{i \in \{1, 2, \dots, N\}}{\arg \min} \sum_{j=1}^N\lambda_{ij}P(c_j | \boldsymbol{x})
\end{aligned}
$$

朴素贝叶斯分类器, 最大化后验概率:

$$
h_\text{nb}(\boldsymbol{x}) = \underset{c \in \mathcal{Y}}{\arg \max} P(c) \prod_{i=1}^{d}P(x_i | c)
$$

其中, $P(c) = \frac{|D_c|}{|D|}$, 利用样本数之比 (频率) 估计先验概率.

### K-Nearest Neighbors

`KNN`:

$$
y=\text{vote}(\text{neighbors}(x))
$$

### Neural Network

Image recognition, game playing:

$$
y=\text{softmax}(\text{ReLU}(Wx+b))
$$

## Ensemble Learning

结合多个`个体学习器` (e.g. 决策树, 支持向量机, 神经网络)
完成学习任务的机器学习范式:

- 基础模型需要满足 `好而不同`, 具有准确性与差异性.
- $\epsilon = 0.5$ 的个体学习器对收敛没有作用: 误差率高 (取反) 或低都有作用.

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

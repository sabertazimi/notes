---
sidebar_position: 3
tags: [AI, Math, Theory, Calculus, Analysis]
---

# Mathematical Analysis

## Limit

洛必达法则是求解分数形式的未定型极限 $\lim_{x\to{a}}\frac{0}{0}$ 的有效方法之一:

$$
\begin{equation}
\begin{split}
  \lim_{x\to{a}}\frac{f(x)}{g(x)}
  &=\lim_{x\to{a}}\frac{df(x)}{dg(x)} \\
  &=\lim_{x\to{a}}\frac{\frac{df}{dx}(a)dx}{\frac{dg}{dx}(a)dx} \\
  &=\lim_{x\to{a}}\frac{\frac{df}{dx}(a)}{\frac{dg}{dx}(a)} \\
  &=\lim_{x\to{a}}\frac{f'(a)}{g'(a)}
\end{split}
\end{equation}
$$

## Derivative

常见导数:

$$
\begin{equation}
\begin{split}
  \frac{d}{dx}x^n&=nx^{n-1} \\
  \frac{d}{dx}\sin{x}&=\cos{x} \\
  \frac{d}{dx}\cos{x}&=-\sin{x} \\
  \frac{d}{dx}a^x&=a^x\ln{a} \\
  \frac{d}{dx}e^x&=e^x \\
  \frac{d}{dx}\log_a{x}&=\frac{1}{x\ln{a}} \\
  \frac{d}{dx}\ln{x}&=\frac{1}{x} \\
  \frac{d}{dx}(g(x)+h(x))&=g'(x)+h'(x) \\
  \frac{d}{dx}(g(x)h(x))&=g'(x)h(x)+g(x)h'(x) \\
  \frac{d}{dx}f(g(x))&=f'(g(x))g'(x) \\
  \frac{d}{dx}f^{-1}(x)&=\frac{1}{f'(f^{-1}(x))} \\
  \frac{d}{dx}\int_{a(x)}^{b(x)}f(t)dt&=f(b(x))b'(x)-f(a(x))a'(x)
\end{split}
\end{equation}
$$

## Series

泰勒级数利用函数在某点的各阶导数, 近似该点附近函数的值:

$$
\begin{equation}
\begin{split}
  \frac{1}{1-x}&=\sum\limits_{n=0}^{\infty}x^n \quad |x|\lt1 \\
  e^x&=\sum\limits_{n=0}^{\infty}\frac{x^n}{n!} \\
  \ln(1+x)&=\sum\limits_{n=1}^{\infty}\frac{(-1)^{n-1}}{n}x^n \quad x\in(-1,1] \\
  \sin(x)&=\sum\limits_{n=0}^{\infty}\frac{(-1)^n}{(2n+1)!}x^{2n+1} \\
  \cos(x)&=\sum\limits_{n=0}^{\infty}\frac{(-1)^n}{(2n)!}x^{2n} \\
  f(x)&=\sum\limits_{n=0}^{\infty}\frac{f^{(n)(x_0)}}{n!}(x-x_0)^n \\
      &=f(x_0)+f'(x_0)(x-x_0)+\frac{f''(x_0)}{2!}(x-x_0)^2+\dots
\end{split}
\end{equation}
$$

## Euler's Formula

复数平面 (Complex Plane) 上的圆周运动:

$$
\begin{equation}
  e^{ix}=\cos{x}+i\sin{x}
\end{equation}
$$

## Fourier Transform

Time to frequency transform:

$$
\begin{equation}
  \hat{f}(\xi)=\int_{-\infty}^{\infty}f(t)e^{-2\pi i\xi t}dt
\end{equation}
$$

Discrete Fourier Transform (DFT):

$$
\begin{equation}
  X[k]=\sum\limits_{n=0}^{N-1}x_n e^{-\frac{i2\pi}{N}kn}
\end{equation}
$$

outcomes

$$
\begin{bmatrix}
  1 & 1 & 1 & \dots & 1 \\
  1 & e^{\frac{2\pi i}{n}} & e^{\frac{2\pi i(2)}{n}}
  & \dots & e^{\frac{2\pi i(n-1)}{n}} \\
  1 & e^{\frac{2\pi i(2)}{n}} & e^{\frac{2\pi i(4)}{n}}
  & \dots & e^{\frac{2\pi i(2)(n-1)}{n}} \\
  \vdots & \vdots & \vdots & \ddots & \vdots \\
  1 & e^{\frac{2\pi i(n-1)}{n}} & e^{\frac{2\pi i(2)(n-1)}{n}}
  & \dots & e^{\frac{2\pi i(n-1)(n-1)}{n}}
\end{bmatrix}
$$

[![Fourier Transform](./figures/fourier-transform.png)](https://www.3blue1brown.com/lessons/fourier-transforms)

## Differential Equation

微分方程 (Differential Equation) 是描述变量之间关系的方程,
通常包含未知函数及其导数, 用于描述物理现象和自然规律.

### First Order Differential Equation

一阶微分方程:

$$
\begin{equation}
  \frac{d}{dt}\begin{bmatrix}x(t)\\y(t)\end{bmatrix}
  =\begin{bmatrix}a&b\\c&d\end{bmatrix}\begin{bmatrix}x(t)\\y(t)\end{bmatrix}
  \Rightarrow
  \begin{bmatrix}x(t)\\y(t)\end{bmatrix}
  =e^{\begin{bmatrix}a&b\\c&d\end{bmatrix}t}\begin{bmatrix}x(0)\\y(0)\end{bmatrix}
\end{equation}
$$

$$
\begin{split}
\text{if} \quad \vec{v}(t)&=e^{Mt}\vec{v}_0 \\
\text{then} \quad
  \frac{d}{dt}\vec{v}(t)
  &=\frac{d}{dt}e^{Mt}\vec{v}_0 \\
  &=\frac{d}{dt}\sum\limits_{n=0}^{\infty}\frac{M^n}{n!}t^n\vec{v}_0 \\
  &=\sum\limits_{n=0}^{\infty}\frac{M^n}{n!}nt^{n-1}\vec{v}_0 \\
  &=M\sum\limits_{n=0}^{\infty}\frac{M^{n-1}}{(n-1)!}t^{n-1}\vec{v}_0 \\
  &=Me^{Mt}\vec{v}_0 \\
  &=M\vec{v}(t)
\end{split}
$$

### Second Order Differential Equation

$$
\begin{equation}
  \ddot{x}(t)=-\mu\dot{x}(t)-\omega x(t)
\end{equation}
$$

Gravitational force equation:

$$
\begin{split}
  \ddot{y}(t)=-g, \quad &
  \dot{y}(t)=-gt+v_0
  \\
  \frac{d\vec{x}_1}{dt}=\vec{v}_1, \quad &
  \frac{d\vec{v}_1}{dt}=Gm_2\Big(\frac{\vec{x}_2-\vec{x}_1}{\|\vec{x}_2-\vec{x}_1\|}\Big)\Big(\frac{1}{\|\vec{x}_2-\vec{x}_1\|^2}\Big)
  \\
  & \ddot{\theta}(t)=-\mu\dot{\theta}(t)-\frac{g}{L}\sin\big({\theta}(t)\big)
\end{split}
$$

### Partial Differential Equation

[热传导方程](https://www.3blue1brown.com/lessons/heat-equation):

$$
\frac{\partial{T}}{\partial{t}}(x,t)=\alpha\frac{\partial^2{T}}{\partial{x^2}}(x,t)
$$

Black-Scholes / Merton equation:

$$
\frac{\partial{V}}{\partial{t}}+rS\frac{\partial{V}}{\partial{S}}+\frac{1}{2}\sigma^2S^2\frac{\partial^2{V}}{\partial{S^2}}-rV=0
$$

### Phase Space

相空间是描述系统状态的空间,
每个点代表系统的一个状态, 点的轨迹描述了系统的演化.

```python
import numpy as np

# Physical constants
g = 9.8
L = 2
mu = 0.1

THETA_0 = np.pi / 3  # 60 degrees
THETA_DOT_0 = 0  # No initial angular velocity

# Definition of ODE
def get_theta_double_dot(theta, theta_dot):
    return -mu * theta_dot - (g / L) * np.sin(theta)

# Solution to the differential equation (numerically)
def theta(t):
    theta = THETA_0
    theta_dot = THETA_DOT_0
    delta_t = 0.01  # Time step
    for _ in np.arange(0, t, delta_t):
        theta_double_dot = get_theta_double_dot(theta, theta_dot)
        theta += theta_dot * delta_t
        theta_dot += theta_double_dot * delta_t
    return theta
```

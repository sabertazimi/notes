---
sidebar_position: 2
tags: [AI, Math, Theory, LinearAlgebra]
---

# Linear Algebra

## Linear Space

[向量空间](https://www.3blue1brown.com/lessons/span)的一组基:
张成 (span) 该空间的一个线性无关 (linearly independent) 向量集.

## Linear Transformation

[线性变换](https://www.3blue1brown.com/lessons/linear-transformations)是指一个向量空间到另一个向量空间的映射,
满足加法和数乘运算的线性性质:

$$
\begin{equation}
  L(\alpha\vec{v}+\beta\vec{w})=\alpha{L(\vec{v})}+\beta{L(\vec{w})}
\end{equation}
$$

[Matrix representation](https://www.3blue1brown.com/lessons/matrix-multiplication):

$$
\begin{split}
  \vec{v}&=x\vec{i}+y\vec{j} \\
         &=\begin{bmatrix}x \\ y\end{bmatrix} \\

  A\vec{v}&=x\hat{i}+y\hat{j} \\
          &=x\begin{bmatrix}a \\ c\end{bmatrix}\vec{i}
            +y\begin{bmatrix}b \\ d\end{bmatrix}\vec{j} \\
          &=\begin{bmatrix}a & b \\ c & d\end{bmatrix}
            \begin{bmatrix}x \\ y\end{bmatrix} \\

  A_2A_1&=A_2\hat{i}+A_2\hat{j} \\
        &=(\begin{bmatrix}a_2 & b_2 \\ c_2 & d_2\end{bmatrix}
          \begin{bmatrix}a_1 \\ c_1 \end{bmatrix})\vec{i}
          +(\begin{bmatrix}a_2 & b_2 \\ c_2 & d_2\end{bmatrix}
          \begin{bmatrix}b_1 \\ d_1\end{bmatrix})\vec{j} \\
        &=(a_1\begin{bmatrix}a_2 \\ c_2\end{bmatrix}
          +c_1\begin{bmatrix}b_2 \\ d_2\end{bmatrix})\vec{i}
          +(b_1\begin{bmatrix}a_2 \\ c_2\end{bmatrix}
          +d_1\begin{bmatrix}b_2 \\ d_2\end{bmatrix})\vec{j} \\
        &=\begin{bmatrix}
            a_2a_1+b_2c_1 & a_2b_1+b_2d_1 \\
            c_2a_1+d_2c_1 & c_2b_1+d_2d_1
          \end{bmatrix}
\end{split}
$$

:::tip[Matrix Multiplication]

左乘矩阵相当于对列向量进行线性变换,
右乘矩阵相当于对行向量进行线性变换.

:::

$A_{m\times n}$ 表示 n 维空间到 m 维空间的线性变换:

- n 列: 输入空间有 n 个基向量, 即为 n 维空间.
- m 行: 输出空间每个基向量对应 m 个坐标, 即为 m 维空间.
- $A_{1\times n}$ 表示 n 维空间到一维空间的线性变换:
  向量点乘 (Dot Product) $\vec{v} \cdot \vec{w}$ 可以理解为
  $\vec{w}$ 通过 $V_{1\times n}$ 变换到一维空间后的投影.

:::tip[Dot Product and Cross Product]

- Dot Product: $\vec{v} \cdot \vec{w}=\|\vec{v}\|\|\vec{w}\|\cos{\theta}$.
- Cross Product: $\|\vec{v} \times \vec{w}\|=\|\vec{v}\|\|\vec{w}\|\sin{\theta}$.
- $\vec{v}\cdot(\vec{v}\times\vec{w})=0$,
  $\vec{w}\cdot(\vec{v}\times\vec{w})=0$.

:::

Basis changes, [translating transformations](https://www.3blue1brown.com/lessons/change-of-basis#translating-transformations):

$$
\vec{v_p}=P^{-1}AP\vec{w_p}
$$

## Determinant

$\det(A)$ 表示矩阵 A 的[行列式](https://www.3blue1brown.com/lessons/determinant),
表示该变换对空间的缩放因子:

[![Determinant](./figures/determinant.svg)](https://www.3blue1brown.com/lessons/determinant)

$\det(A)=0$ 时, 表示该变换将空间压缩到一个低维空间,
称矩阵 $A$ 为奇异矩阵 (Singular Matrix):

- 矩阵 $A$ 列向量线性相关.
- 矩阵 $A$ 不满秩 (Not full rank).
- 矩阵 $A$ 不可逆.

Determinant for 2d matrix:

$$
\begin{equation}
  \begin{vmatrix}a & b \\ c & d\end{vmatrix}=ad-bc
\end{equation}
$$

![Determinant Diagram](./figures/determinant-diagram.svg 'Determinant Diagram')

Determinant for 3d matrix:

$$
\begin{equation}
  \begin{vmatrix}a & b & c \\ d & e & f \\ g & h & i\end{vmatrix}
  =a\begin{vmatrix}e & f \\ h & i\end{vmatrix}
   -b\begin{vmatrix}d & f \\ g & i\end{vmatrix}
   +c\begin{vmatrix}d & e \\ g & h\end{vmatrix}
\end{equation}
$$

Determinant for matrix multiplication:

$$
\begin{equation}
  \det(A_1A_2)=\det(A_1)\det(A_2)
\end{equation}
$$

## Gaussian Elimination

高斯消元法求解线性方程组 (Linear System Of Equations):

首先第一行的第一个元素化为 1,
下面每行减去第一行乘以该行第一个元素的倍数,
从而把第一列除第一行外的全部元素都化为 0,
进而把第二列除前两个元素之外的元素都化为 0,
最后把矩阵化为上三角矩阵.
类似地, 从最后一行开始, 逐行把上三角矩阵化为单位矩阵.

$$
\begin{split}
  A\vec{x}&=\vec{v} \\
  A^{-1}A\vec{x}&=A^{-1}\vec{v} \\
  \vec{x}&=A^{-1}\vec{v}
\end{split}
$$

## Eigenvalue and Eigenvector

$A=\begin{bmatrix}
  a & b \\
  c & d
\end{bmatrix}$
eigenvalue $A\vec{v}=\lambda\vec{v}$ [quick calculation](https://www.3blue1brown.com/lessons/quick-eigen):

$$
\begin{split}
  \lambda&=m\pm\sqrt{m^2-p} \\
         &=\frac{\lambda_1+\lambda_2}{2}
           \pm\sqrt{(\frac{\lambda_1+\lambda_2}{2})^2-\lambda_1\lambda_2} \\
         &=\frac{a+d}{2}\pm\sqrt{(\frac{a+d}{2})^2-(ad-bc)}
\end{split}
$$

## References

- Interactive book: [impressive linear algebra](https://immersivemath.com/ila/index.html).

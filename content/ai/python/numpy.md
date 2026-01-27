---
sidebar_position: 20
tags: [AI, Language, Python, NumPy]
---

# NumPy

```python
import numpy as np

np.random.seed(seed=1234)
```

## Array

```python
x = np.array(6)
x.ndim
x.shape
x.size
x.dtype
```

```python
np.zeros((2, 2))
np.ones((2, 2))
np.eye((2))
np.random.random((2, 2))
```

## Index

```python
x = np.array([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])
x[:, 1]    # [2, 6, 10]
x[0, :]    # [1, 2, 3, 4]
x[:3, 1:3] # [[2, 3], [6, 7], [10, 11]]
x[[0, 1, 2], [0, 2, 1]] # [1, 7, 10]
```

```python
# Boolean array indexing
x = np.array([[1,2], [3, 4], [5, 6]])
print ("x:\n", x)
print ("x > 2:\n", x > 2)
print ("x[x > 2]:\n", x[x > 2])
# x:
#  [[1 2]
#  [3 4]
#  [5 6]]
# x > 2:
#  [[False False]
#  [ True  True]
#  [ True  True]]
# x[x > 2]:
#  [3 4 5 6]
```

## Matrix

- math: `x+y`/`x-y`/`x*y` `np.add/subtract/multiply`
- dot product: `a.dot(b)`
- sum: `np.sum(x)`
- column sum: `np.sum(x, axis=0)`
- row sum: `np.sum(x, axis=1)`
- transposing: `x.T`
- reshape: `np.reshape(x, (2, 3))`

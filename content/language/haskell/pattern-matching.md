---
sidebar_position: 4
tags: [Language, Haskell]
---

# Pattern Matching

当函数拥有多个函数体(模式)时,会从上至下进行匹配各模式,一旦匹配则只应用这一函数体.

## As

`all@(pattern)`: all 为指向 pattern 整体的引用.

```haskell
all@(x:y:xs) -- 其中all与(x:y:xs)等价
```

```haskell
capital :: String -> String
capital "" = "Empty string, whoops!"
capital all@(x:xs) = "The first letter of " ++ all ++ " is " ++ [x]
```

## List

- `x:xs`
- `x:y:z:xs`.

```haskell
head' :: [a] -> a
head' [] = error "Can't call head on an empty list, dummy!"
head' (x:_) = x
```

```haskell
length' :: (Num b) => [a] -> b
length' [] = 0
length' (_:xs) = 1 + length' xs
```

```haskell
sum' :: (Num a) => [a] -> a
sum' [] = 0
sum' (x:xs) = x + sum' xs
```

## Tuple

- (x, y)
- (x, y, z)

## Guard

子模式匹配: 运用布尔表达式实现判断, 应用对应函数体:

- 关键符号: `|` 与 `where`.
- `|` 分隔函数体.

```haskell
bmiTell :: (RealFloat a) => a -> a -> String
bmiTell weight height
    | bmi <= skinny = "You're underweight, you emo, you!"
    | bmi <= normal = "You're supposedly normal. Pet, I bet you're ugly!"
    | bmi <= fat    = "You're fat! Lose some weight, fatty!"
    | otherwise     = "You're a whale, congratulations!"
    where bmi = weight / height ^ 2
          skinny = 18.5
          normal = 25.0
          fat = 30.0
```

### Where binding

`where`:

- 可见性: 定义只对本模式可见的 (私有) 名字与 (私有) 函数.
- `where` 定义在最外层, 使得各模式共享 (私有) 名字与 (私有) 函数.
- 名字定义时可使用模式匹配 `where (head:_) = firstName`.

### Let binding

类似 where, 绑定对象为表达式/函数:

```haskell
let bindings
in  expressions
```

```haskell
let sideArea = 2 * pi * r * h
    topArea = pi * r ^2
in  sideArea + 2 * topArea
```

- 可见性: in 作用域, 只对本 guard 可见.
- 可使用模式匹配.
- 可用于 List Range 中.

## Case

- 模式匹配是 case 表达式的特殊情况(语法糖:简化写法).
- 在函数中, 模式匹配只能用于参数定义中, case 表达式可用于其他地方
  (let/where 绑定, 普通表达式, guard 语句).

```haskell
case expression of pattern -> result
                   pattern -> result
                   pattern -> result
                   ...
```

```haskell
describeList :: [a] -> String
describeList xs = "The list is " ++ case xs of [] -> "empty."
                                               [x] -> "a singleton list."
                                               xs -> "a longer list."
```

## Best Practices

- 代替 if-else/switch 语句
- 递归算法(将递归基础作为首模式,递归函数体作为尾模式)
- List Range 中亦可使用模式匹配

```haskell
addVectors :: (Num a) => (a, a) -> (a, a) -> (a, a)
addVectors (x1, y1) (x2, y2) = (x1 + x2, y1 + y2)
```

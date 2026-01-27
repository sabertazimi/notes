---
sidebar_position: 1
tags: [Language, Haskell, Toolchain, Type, Generic]
---

# Basics

## Toolchain

```bash
apt-get install haskell-Platform
apt-get install ghc-mod
atom plugins : language-haskell autocomplete-haskell ide-haskell haskell-ghc-mod
```

### Ghci

- `:l`: load file.
- `:r`: reload file.
- `:cd`.
- `:edit`: `$EDITOR`.
- `:m`: module.
- `:q`: quit.
- `:?`.
- `:k`: kind.
- `:t`: type function.
- `:info`: data/TypeClass.

### Ghc

```bash
runghc *.hs/*.lhs
```

## Unique Mark

- `:+`: 复数符, `2 :+ 3 -> 2+3i`.
- `_`: 泛匹配符, 表示不关心此部分具体内容.
- `<-`: 属于符号, 用于 ListRange 中.
- `=>`: 类型约束分隔符

## Expression

if 语句也是表达式

```haskell
doubleSmallNumber' x = (if x > 100 then x else x*2) + 1
```

## Primitives

```haskell
ghci> :t 'a'
'a' :: Char

ghci> :t True
True :: Bool

ghci> :t "HELLO!"
"HELLO!" :: [Char]

ghci> :t (True, 'a')
(True, 'a') :: (Bool, Char)
```

### Int

有限整数

### Integer

无限整数(效率低)

### Float

单精度浮点数

### Double

双精度浮点数

### Bool

True/False

### Char

### String

### Ordering

LT,GT,EQ

### Word

Data.Word - unsigned int

### Rational

有理数类型,用于高精度数学运算

## List

### Operator

- `++`.
- `:`.
- `!!`.
- `>`/`<`/`==`.

### Function

- head List 首元素.
- last List 尾元素.
- init List 除去尾元素的部分.
- tail List 除去首元素的部分.
- length List 长度.

:::tip

```haskell
fromIntegral (length [1,2,3,4]) + 3.2
```

:::

- null List BestPractice: 检查一个 List 是否为空

```haskell
ghci> null [1,2,3]
False
ghci> null []
True
```

- reverse List 反转
- take num List 返回 List 前 num 个元素组成的 List

```haskell
ghci> take 3 [5,4,3,2,1]
[5,4,3]
ghci> take 5 [1,2]
[1,2]
ghci> take 0 [6,6,6]
[]
```

- drop num List 删除 List 前 num 个元素

```haskell
ghci> drop 3 [8,4,2,1,5,6]
[1,5,6]
ghci> drop 0 [1,2,3,4]
[1,2,3,4]
ghci> drop 100 [1,2,3,4]
[]
```

- maximum List 返回最大元素
- minimum List 返回最小元素

- sum List 返回 List 元素和
- product List 返回 List 元素积

- elem `elem` List 判断元素存在性

```haskell
ghci> 4 `elem` [3,4,5,6]
True
ghci> 10 `elem` [3,4,5,6]
False
```

- cycle List 返回循环无限数组(_Haskell 惰性特性_)
- repeat Elem 返回循环无限数组(_Haskell 惰性特性_)
- replicate num Elem 返回循环无限数组

```haskell
take 10 (cycle [1,2,3]) -> [1,2,3,1,2,3,1,2,3,1]
take 10 (repeat 5)      -> [5,5,5,5,5,5,5,5,5,5]
replicate 3 10          -> [10,10,10]
```

- takeWhile :: (a -> Bool) -> `[a]` -> `[a]` 遇到不符合限制条件的元素便停止遍历 List

```haskell
ghci> sum (takeWhile (<10000) (filter odd (map (^2) [1..])))
166650
```

### Range

三要素: `,` 与 `..`

- 上限
- 下限
- 步长(_仅可标明一次_)

```haskell
上下限: [1..20]
步长为2: [2,4..20]
步长为13无限List: [13,26..]
take 24 [13,26..]
```

### Comprehension

由类似集合定义的离散数学定义,来定义复杂的 List:

`[expression | filter]`

`[expression | x <- Range, Predicate(断言/限制条件)]`

- Range: `,`分隔多个 Range(一般为 List)
- Predicate: `,`分隔多个断言;每个断言均为 Boolean 表达式

```haskell
ghci> [x*2 | x <- [1..10], x*2 >= 12]
[12,14,16,18,20]

ghci> [ x | x <- [50..100], x `mod` 7 == 3]
[52,59,66,73,80,87,94]

boomBangs xs = [ if x < 10 then "BOOM!" else "BANG!" | x <- xs, odd x]

ghci> boomBangs [7..13]
["BOOM!","BOOM!","BANG!","BANG!"]
```

- 多个 Range

```haskell
ghci> [ x*y | x <- [2,5,10], y <- [8,10,11]]
[16,20,22,40,50,55,80,100,110]
```

- 嵌套 Comprehension

```haskell
ghci> let xxs = [[1,3,5,2,3,1,2,4,5],[1,2,3,4,5,6,7,8,9],[1,2,4,2,1,6,3,1,3,2,3,6]]

ghci> [ [ x | x <- xs, even x ] | xs <- xxs]
[[2,2,4],[2,4,6,8],[2,4,2,6,2,6]]
```

## Tuple

### 内部差异性

- 同一 Tuple 里可存放不同 Type 的项

### 外部差异性

- 数目不同或某项不同的 Tuple 属于不同 Type
  - 不可置于同一 List 中
  - 不同长度的 Tuple 不可比较(比较符只可用于相同 Type)

### Pair

- `fst/snd tuple`: 返回首项/尾项.
- `zip List1 List2`: 对应项配对, 组成二元组 List.

```haskell
ghci> zip [5,3,2,6,2,7,2,5,4,6,6] ["im","a","turtle"]
[(5,"im"),(3,"a"),(2,"turtle")]

ghci> zip [1..] ["apple", "orange", "cherry", "mango"]
[(1,"apple"),(2,"orange"),(3,"cherry"),(4,"mango")]
```

### Triple

```haskell
first :: (a, b, c) -> a
first (x, _, _) = x

second :: (a, b, c) -> b
second (_, y, _) = y

third :: (a, b, c) -> c
third (_, _, z) = z
```

## Generics

运用 Type 变量 (只可为**单字符**), 实现泛型参数与多态函数.

借助 TypeClass 可轻松实现多态函数:

```haskell
ghci> :t head
head :: [a] -> a

-- a 和 b 可为同类型
-- 第一个参数与返回值必须同类型
ghci> :t fst
fst :: (a, b) -> a

-- 所有参数必须同类型,且必须为Num成员
ghci> :t (*)
(*) :: (Num a) => a -> a -> a
```

## Comments

- `--` 单行注释
- `{- -}` 块注释
- `{-# #-}` (文件头部)编译器参数

## References

- Haskell [book](https://github.com/MnO2/learnyouahaskell-zh).

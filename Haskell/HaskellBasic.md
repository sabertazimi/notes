# Haskell Basic Notes

## Operator

### List Operator

++ - List连接符,遍历前一List

```haskell
ghci> [1,2,3,4] ++ [9,10,11,12]
[1,2,3,4,9,10,11,12]
ghci> "hello" ++ " " ++ "world"
"hello world"
```

: - 连接单个元素

```haskell
ghci> 'A':" SMALL CAT"
"A SMALL CAT"
ghci> 5:[1,2,3,4,5]
[5,1,2,3,4,5]
```

!! - 引用符

```haskell
ghci> [9.4,33.2,96.2,11.2,23.25] !! 1
33.2```

## Expression

if语句也是表达式

```haskell
doubleSmallNumber' x = (if x > 100 then x else x*2) + 1
```

## List

### Operator

-   ++
-   :
-   !!
-   \>/</==

### Function

-   head List 首元素
-   last List 尾元素
-   init List 除去尾元素的部分 
-   tail List 除去首元素的部分

-   length List 长度
-   null List BestPractice: 检查一个 List 是否为空

```haskell
ghci> null [1,2,3]
False
ghci> null []
True
```

-   reverse List 反转

-   take num List 返回List前num个元素组成的List

```haskell
ghci> take 3 [5,4,3,2,1]
[5,4,3]
ghci> take 5 [1,2]
[1,2]
ghci> take 0 [6,6,6]
[]
```

-   drop num List 删除List前num个元素

```haskell
ghci> drop 3 [8,4,2,1,5,6]
[1,5,6]
ghci> drop 0 [1,2,3,4]
[1,2,3,4]
ghci> drop 100 [1,2,3,4]
[]
```

-   maximum List 返回最大元素
-   minimun List 返回最小元素

-   sum List 返回List元素和
-   product List 返回List元素积

-   elem ``elem`` List 判断元素存在性

```haskell
ghci> 4 `elem` [3,4,5,6]
True
ghci> 10 `elem` [3,4,5,6]
False
```

-   cycle List  返回循环无限数组(*Haskell惰性特性*)
-   repeat Elem 返回循环无限数组(*Haskell惰性特性*)
-   replicate num Elem 返回循环无限数组

```haskell
take 10 (cycle [1,2,3]) -> [1,2,3,1,2,3,1,2,3,1]
take 10 (repeat 5)      -> [5,5,5,5,5,5,5,5,5,5]
replicate 3 10          -> [10,10,10]
```

### Range

三要素: , 与 ..

-   上限
-   下限
-   步长(*仅可标明一次*)

```haskell
上下限: [1..20]
步长为2: [2,4..20]
步长为13无限List: [13,26..]
take 24 [13,26..]

```

### List Comprehension(数学定义)

由类似集合定义的离散数学定义,来定义复杂的List:

**[expression | filter]**

**[expression | x <\- Range, Predicate(断言/限制条件)]**

```haskell
ghci> [x*2 | x <- [1..10], x*2 >= 12]
[12,14,16,18,20]
```

```haskell
ghci> [ x | x <- [50..100], x `mod` 7 == 3]
[52,59,66,73,80,87,94]
```

## Function

### Basic

没有参数的函数 - “定义”(或者“名字”)

```haskell
tazimi = "It's a-me, tazimi!"
```

大部分函数为前缀函数

```haskell
> succ 8
9
```

``FunctionName``可使前缀函数变为中缀函数

```haskell
> 92 `div` 10 
9
```

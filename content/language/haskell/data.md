---
sidebar_position: 3
tags: [Language, Haskell, Type]
---

# Data

`data` type:

```haskell
data SelfDefinedTypeName =
  ValueConstructorName ValueType .. | .. deriving (TypeClass, ..)
```

```haskell
data Point = Point Float Float deriving (Show)
data Shape = Circle Point Float | Rectangle Point Point deriving (Show)
```

Export `data` type:

```haskell
module Shapes
( Point(..)
, Shape(..)
) where
```

后构造器 > 前构造器:

> e.g. True > False

```haskell
data Bool = False | True deriving (Ord)
```

## 函数特性

`data` type 也是函数, 若省略参数亦会造成 curry 化:

> e.g. map fx list

```haskell
ghci> map (Circle 10 20) [4,5,6,6]
[Circle 10.0 20.0 4.0,
Circle 10.0 20.0 5.0,
Circle 10.0 20.0 6.0,
Circle 10.0 20.0 6.0
]
```

- Value Constructor:使用`ValueConstructorName ValueType ..`可构造出一个该类型的定义/名字

```haskell
ghci > Circle 10 20 30
Circle 10 20 30
```

## Record Syntax

记录语法:

```haskell
data Person = Person { firstName :: String
                     , lastName :: String
                     , age :: Int
                     , height :: Float
                     , phoneNumber :: String
                     , flavor :: String
                     } deriving (Show)
```

- 使用

```haskell
ghci> Car {company="Ford", model="Mustang", year=1967}
Car {company = "Ford", model = "Mustang", year = 1967}
```

## Type Parameters

类型参数可提高代码的复用性:

```haskell
data Car a b c = Car { company :: a
                       , model :: b
                       , year :: c
                        } deriving (Show)
```

```haskell
tellCar :: (Show a) => Car String String a -> String
tellCar (Car {company = c, model = m, year = y}) =
  "This " ++ c ++ " " ++ m ++ " was made in " ++ show y
```

### Maybe Value Constructor

```haskell
data Maybe a = Nothing | Just a
```

- Just 可实现转化:

```haskell
Just :: a -> Maybe a
```

## Deriving

派生:

```haskell
data Day = Monday | Tuesday | Wednesday | Thursday | Friday | Saturday | Sunday
           deriving (Eq, Ord, Show, Read, Bounded, Enum)
```

```haskell
ghci> Wednesday
Wednesday
ghci> show Wednesday
"Wednesday"
ghci> read "Saturday" :: Day
Saturday

ghci> Saturday == Sunday
False
ghci> Saturday == Saturday
True
ghci> Saturday > Friday
True
ghci> Monday `compare` Wednesday
LT

ghci> minBound :: Day
Monday
ghci> maxBound :: Day
Sunday

ghci> succ Monday
Tuesday
ghci> pred Saturday
Friday
ghci> [Thursday .. Sunday]
[Thursday,Friday,Saturday,Sunday]

ghci> [minBound .. maxBound] :: [Day]
[Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday]
```

## Type Alias

`type` 为 `data` 声明别名:

```haskell
type String = [Char]
type PhoneNumber = String
type Name = String
type PhoneBook = [(Name,PhoneNumber)]
```

- type 类型参数: 匹配 data 类型参数

```haskell
type AssocList k v = [(k,v)]

type IntMap v = Map.Map Int v
type IntMap = Map.Map Int
```

类型别名,只可以在 Haskell 的类型部分中使用:

- 定义新类型
- 类型声明
- 类型注释(::)
- 禁止: 定义名字/定义 _AssocList [(1,2),(4,5),(7,9)]_

## 高级数据结构

### 栈

```haskell
type Stack = [Int]

pop :: Stack -> (Int,Stack)
pop (x:xs) = (x,xs)

push :: Int -> Stack -> ((),Stack)
push a xs = ((),a:xs)
```

### 链表

```haskell
data List a = Empty | Cons a (List a) deriving (Show, Read, Eq, Ord)
data List a = Empty
  | Cons { listHead :: a, listTail :: List a} deriving (Show, Read, Eq, Ord)
```

### 二叉树

```haskell
data Tree a = EmptyTree | Node a (Tree a) (Tree a) deriving (Show, Read, Eq)
```

```haskell
singleton :: a -> Tree a
singleton x = Node x EmptyTree EmptyTree

treeInsert :: (Ord a) => a -> Tree a -> Tree a
treeInsert x EmptyTree = singleton x
treeInsert x (Node a left right)
      | x == a = Node x left right
      | x < a  = Node a (treeInsert x left) right
      | x > a  = Node a left (treeInsert x right)

treeElem :: (Ord a) => a -> Tree a -> Bool
treeElem x EmptyTree = False
treeElem x (Node a left right)
    | x == a = True
    | x < a  = treeElem x left
    | x > a  = treeElem x right

ghci> let nums = [8,6,4,1,7,3,5]
ghci> let numsTree = foldr treeInsert EmptyTree nums
```

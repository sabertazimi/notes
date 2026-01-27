---
sidebar_position: 5
tags: [Language, Haskell, Function]
---

# Function

- 单个参数

```haskell
removeNonUppercase :: [Char] -> [Char]
removeNonUppercase st = [ c | c <- st, c `elem` ['A'..'Z']]
```

- 多个参数

```haskell
addThree :: Int -> Int -> Int -> Int
addThree x y z = x + y + z
```

## Recursive

- 边界条件
- 递归基础
- 递归函数体

### List

- 边界条件: 空 List
- 递归函数体: x:xs 取出首元素进行一般操作,对尾部进行递归操作.

```haskell
maximum' :: (Ord a) => [a] -> a
maximum' [] = error "maximum of empty list"
maximum' [x] = x
{-
maximum' (x:xs)
    | x > maxTail = x
    | otherwise = maxTail
    where maxTail = maximum' xs
-}
maximum' (x:xs) = max x (maximum' xs)
```

```haskell
replicate' :: (Num i, Ord i) => i -> a -> [a]
replicate' n x
    | n <= 0    = []
    | otherwise = x:replicate' (n-1) x
```

```haskell
take' :: (Num i, Ord i) => i -> [a] -> [a]
take' n _
    | n <= 0   = []
take' _ []     = []
take' n (x:xs) = x : take' (n-1) xs
```

```haskell
reverse' :: [a] -> [a]
reverse' [] = []
reverse' (x:xs) = reverse' xs ++ [x]
```

```haskell
repeat' :: a -> [a]
repeat' x = x:repeat' x
```

```haskell
zip' :: [a] -> [b] -> [(a,b)]
zip' _ [] = []
zip' [] _ = []
zip' (x:xs) (y:ys) = (x,y):zip' xs ys
```

```haskell
elem' :: (Eq a) => a -> [a] -> Bool
elem' a [] = False
elem' a (x:xs)
    | a == x    = True
    | otherwise = a `elem'` xs
```

Awesome Quick Sort

```haskell
quicksort :: (Ord a) => [a] -> [a]
quicksort [] = []
quicksort (x:xs) =
  let smallerSorted = quicksort [a | a <- xs, a <= x]
      biggerSorted = quicksort [a | a <- xs, a > x]
  in smallerSorted ++ [x] ++ biggerSorted
```

## Higher-Order

### Curry

当传入不全参数时,会改变函数的类型,_返回值从单类型变成函数类型_.

- 当传入不全参数时:
- compare 的类型变为 (Ord a) => a -> (a -> Ordering)

```haskell
compareWithHundred :: (Num a, Ord a) => a -> Ordering
compareWithHundred x = compare 100 x
```

- 通过给二元中缀函数传递唯一参数:
- 中缀函数类型由 a -> a -> a 转为 a -> a

```haskell
divideByTen :: (Floating a) => a -> a
divideByTen = (/10)

ghci> :t (/10)
(/10) :: (Fractional a) => a -> a
```

- 包装函数:
  - 传入一个二元函数作为参数,便可实现 zipWithFunc
  - 若在定义时便传入一个函数参数,便可实现 Curry 化

```haskell
zipWith' :: (a -> b -> c) -> [a] -> [b] -> [c]
zipWith' _ [] _ = []
zipWith' _ _ [] = []
zipWith' f (x:xs) (y:ys) = f x y : zipWith' f xs ys

ghci> zipWith' (+) [4,2,5,6] [2,6,2,3]
[6,8,7,9]
ghci> zipWith' max [6,3,2,1] [7,3,1,5]
[7,3,2,5]
ghci> zipWith' (++) ["foo "，"bar "，"baz "] ["fighters"，"hoppers"，"aldrin"]
["foo fighters","bar hoppers","baz aldrin"]
ghci> zipWith' (*) (replicate 5 2) [1..]
[2,4,6,8,10]
ghci> zipWith' (zipWith' (*)) [[1,2,3],[3,5,6],[2,3,4]] [[3,2,2],[3,4,5],[5,4,3]]
[[3,4,6],[9,20,30],[10,12,12]]
```

- 通过 Curry 化,还可省略参数

```haskell
foo a = bar b a ->
foo = bar b
```

### Map

映射函数 - List Comprehension 的函数化

```haskell
map :: (a -> b) -> [a] -> [b]
map _ [] = []
map f (x:xs) = f x : map f xs
```

- 如果 map 传入的函数参数的类型为 a -> a -> a,则返回的 List 类型为`[a -> a]`(f x 传参不完全,造成了 Curry 化).

```haskell
ghci> let listOfFun = map (*) [0..]
ghci> (listOfFun !! 4) 5
20
```

```haskell
ghci> map (+3) [1,5,3,1,6]
[4,8,6,4,9]
ghci> map (++ "!") ["BIFF"，"BANG"，"POW"]
["BIFF!","BANG!","POW!"]
ghci> map (replicate 3) [3..6]
[[3,3,3],[4,4,4],[5,5,5],[6,6,6]]
ghci> map (map (^2)) [[1,2],[3,4,5,6],[7,8]]
[[1,4],[9,16,25,36],[49,64]]
ghci> map fst [(1,2),(3,5),(6,3),(2,6),(2,5)]
[1,3,6,2,2]
```

### Filter

过滤函数 - Comprehension 的函数化

```haskell
filter :: (a -> Bool) -> [a] -> [a]
filter _ [] = []
filter p (x:xs)
    | p x       = x : filter p xs
    | otherwise = filter p xs
```

```haskell
ghci> filter (>3) [1,5,3,2,1,6,4,3,2,1]
[5,6,4]
ghci> filter (==3) [1,2,3,4,5]
[3]
ghci> filter even [1..10]
[2,4,6,8,10]
ghci> let notNull x = not (null x) in filter notNull [[1,2,3],[],[3,4,5],[2,2],[],[],[]]
[[1,2,3],[3,4,5],[2,2]]
ghci> filter (`elem` ['a'..'z']) "u LaUgH aT mE BeCaUsE I aM diFfeRent"
"uagameasadifeent"
ghci> filter (`elem` ['A'..'Z']) "i lauGh At You BecAuse u r aLL the Same"
"GAYBALLS"
```

### Fold and Scan

![折叠函数](./figures/foldl.png 'Fold Function')

> 如图中所示,左折叠时将 acc 视为第 0 个元素;右折叠时将 acc 视为最后一个元素.

- 三要素:
  - 二元函数 \acc x -> function 或 \x acc -> function
  - 初始累加值
  - 待折叠 List
- 工作原理:
  - 不断从 List 中取出元素,进行二元函数调用,直至 List 被取空
  - 调用参数分别为 新取出元素 x 与 之前 n 次调用后的累加值 acc
  - 返回值作为下次调用的累加值 acc
- 左折叠函数
  - foldl `\acc x ->`
  - foldl1: 取 List 首元素作为初始累加值

```haskell
foldl :: (Foldable t) => (b -> a -> b) -> b -> t a -> b
```

```haskell
sum' :: (Num a) => [a] -> a
sum' xs = foldl (\acc x -> acc + x) 0 xs
```

- 右折叠函数
  - foldr `\x acc ->`
  - foldr1: 取 List 尾元素作为初始累加值

```haskell
foldr :: (Foldable t) => (a -> b -> b) -> b -> t a -> b
```

```haskell
map' :: (a -> b) -> [a] -> [b]
map' f xs = foldr (\x acc -> f x : acc) [] xs
```

- 更多范例

```haskell
maximum' :: (Ord a) => [a] -> a
maximum' = foldr1 (\x acc -> if x > acc then x else acc)

reverse' :: [a] -> [a]
reverse' = foldl (\acc x -> x : acc) []

product' :: (Num a) => [a] -> a
product' = foldr1 (*)

filter' :: (a -> Bool) -> [a] -> [a]
filter' p = foldr (\x acc -> if p x then x : acc else acc) []

head' :: [a] -> a
head' = foldr1 (\x _ -> x)

last' :: [a] -> a
last' = foldl1 (_ x -> x)
```

- scanl/scanr/scanl1/scanr1 函数会将每次折叠的结果都记录在一个 List 中

```haskell
ghci> scanl (+) 0 [3,5,2,1]
[0,3,8,10,11]
ghci> scanr (+) 0 [3,5,2,1]
[11,8,3,1,0]
ghci> scanl1 (\acc x -> if x > acc then x else acc) [3,4,5,3,7,9,2,1]
[3,4,5,5,7,9,9,9]
ghci> scanl (flip (:)) [] [3,2,1]
[[],[3],[2,3],[1,2,3]]
```

- 逆波兰表达式

```haskell
import Data.List

solveRPN :: String -> Float
solveRPN = head . foldl foldingFunction [] . words
where   foldingFunction (x:y:ys) "*" = (x * y):ys
        foldingFunction (x:y:ys) "+" = (x + y):ys
        foldingFunction (x:y:ys) "-" = (y - x):ys
        foldingFunction (x:y:ys) "/" = (y / x):ys
        foldingFunction (x:y:ys) "^" = (y ** x):ys
        foldingFunction (x:xs) "ln" = log x:xs
        foldingFunction xs "sum" = [sum xs]
        foldingFunction xs numberString = read numberString:xs
```

### Lambda

`\args -> function`

```haskell
ghci> zipWith (\a b -> (a * 30 + 3) / b) [5,4,3,2,1] [1,2,3,4,5]
[153.0,61.5,31.0,15.75,6.6]

ghci> map (\(a,b) -> a + b) [(1,2),(3,5),(6,3),(2,6),(2,5)]
[3,8,9,8,7]

flip' :: (a -> b -> c) -> b -> a -> c
flip' f = \x y -> f y x
```

### `$`

`($) :: (a -> b) -> a -> b`

- 特性: 优先级最低,右结合
- 功能: 改变优先级,相当于在右方添加括号

```haskell
f (g (z x)) <-> f $ g $ z x
```

### Composition

`(.) :: (b -> c) -> (a -> b) -> a -> c`

`f . g = \x -> f (g x)` - f 的参数类型必须与 g 的返回值类型相同

- 功能: 可以去除函数调用括号

```haskell
fn x = ceiling (negate (tan (cos (max 50 x))))
-> 去括号: fn x = ceiling . negate . tan . cos . max 50 x
-> Curry化: fn = ceiling . negate . tan . cos . max 50
```

:::tip[Best Practice]

三种不同的函数写法:

```haskell
oddSquareSum :: Integer
oddSquareSum = sum (takeWhile (<10000) (filter odd (map (^2) [1..])))

oddSquareSum :: Integer
oddSquareSum = sum . takeWhile (<10000) . filter odd . map (^2) $ [1..]

oddSquareSum :: Integer
oddSquareSum =
    let oddSquares = filter odd $ map (^2) [1..]
        belowLimit = takeWhile (<10000) oddSquares
    in  sum belowLimit
```

:::

## 无参函数

“定义”(或者“名字”)

```haskell
sabertaz = "It's a-me, sabertaz!"
```

## 前缀函数

```haskell
> succ 8
9
```

\`FunctionName\` - 可使前缀函数变为中缀函数

```haskell
> 92 `div` 10
9
```

## 中缀函数

`+`: 从类型定义可以看出,+左右两边参数必须为同类型

```haskell
ghci> :t (+)
(+) :: (Num a) => a -> a -> a
```

`++`: List 连接符,遍历前一 List

```haskell
ghci> [1,2,3,4] ++ [9,10,11,12]
[1,2,3,4,9,10,11,12]
ghci> "hello" ++ " " ++ "world"
"hello world"
```

`:`: 连接单个元素

```haskell
ghci> 'A':" SMALL CAT"
"A SMALL CAT"
ghci> 5:[1,2,3,4,5]
[5,1,2,3,4,5]
```

`!!`: 引用符

```haskell
ghci> [9.4,33.2,96.2,11.2,23.25] !! 1
33.2
```

## 数学函数

- x `mod` y
- `even arg`
- `odd arg`

### System Random

- `random :: (RandomGen g, Random a) => g -> (a, g)`
- getStdGen
- newStdGen

## 数字函数

- fromInteger 函数 (Num a) => Integer -> a
- fromIntegral 函数 (Integral a, Num b) => a -> b

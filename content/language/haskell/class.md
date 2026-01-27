---
sidebar_position: 2
tags: [Language, Haskell, Class]
---

# Class

```haskell
ghci> :t (==)
(==) :: (Eq a) => a -> a -> Bool

ghci> :t fromIntegral
fromIntegral :: (Integral a, Num b) => a -> b
ghci> :info typeClassName
```

## =>

=> 左部: 类约束(Class Constraint)
=> 右部: 函数类型(参数/返回值类型),其中参数类型同属 Class

## Eq

- 功能: 成员类型可判断相等性
- 成员: 大部分基本类型(不包含函数类型)
- 方法: == 与 /= 函数

```haskell
class Eq a where
    (==) :: a -> a -> Bool
    (/=) :: a -> a -> Bool
    x == y = not (x /= y)
    x /= y = not (x == y)
```

## Ord

Ord 成员必为 Eq 成员: class (Eq a) => Ord a where

- 功能: 成员类型可排序
- 成员: 大部分基本类型(不包含函数类型)
- 方法:
  - `<` `>` `<=` `>=` 函数
  - compare 函数 (Ord a) => a -> a -> Ordering

## Show

- 功能: 成员类型可用字符串表示
- 成员: 大部分基本类型(不包含函数类型)
- 方法: show 函数 (Show a) => a -> String

:::tip

结合 Read, 可用于字符串与数值之间的转化

:::

## Read

- 功能: 可以将字串转为 Read 某成员类型
- 成员: 大部分基本类型(不包含函数类型)
- 方法: read 函数 (Read a) => String -> a

:::tip

结合 Show, 可用于字符串与数值之间的转化

:::

## Enum

- 功能: 连续性(可枚举), 其成员类型可用于**Range**中
- 成员: () Bool Char Ordering Int Integer Float Double

```haskell
[Thursday .. Sunday]
```

```haskell
ghci> succ Monday
Tuesday
ghci> pred Saturday
Friday
```

## Bounded

- 功能: 成员类型具有上下限
- 方法: minBound/maxBound 函数 (Bounded a) => a _无参多态常量/定义_

```haskell
ghci> minBound :: Day
Monday
ghci> maxBound :: Day
Sunday
```

## Num

- 功能: 成员类型具有数字特征.
- 成员: 实数 整数 (`Int`/`Integer`/`Float`/`Double`).
- 方法: `+`/`-`/`*`/`abs` 函数.
- 实例: 所有数字都是多态常量/定义(可视为函数).

```haskell
ghci> :t 20
20 :: (Num t) => t
```

## Integral

- 功能: 成员类型具有数字特征
- 成员: 整型 - Int Integer

## Floating

- 功能: 成员类型具有数字特征
- 成员: 浮点型 - Float Double

| TypeClass   | Method Feature          |
| :---------- | :---------------------- |
| Functor     | f a + (a -> b) -> f b   |
| Applicative | f a + f (a -> b) -> f b |
| Monad       | m a + (a -> m b) -> m b |

## _Functor_

- 成员: Maybe a, [], Either a, IO
  - 成员 kind 必须为 `* -> *`
  - f _一元类型构造符(type constructor)_
- 必须遵守准则:
  - fmap id = id
  - fmap (f . g) F = fmap f (fmap g F)

```haskell
ghci> :info Functor
class Functor (f :: * -> *) where
    fmap :: (a -> b) -> f a -> f b
    ($) :: a -> f b -> f a
```

```haskell
instance Functor [] where
    fmap = map

instance Functor Maybe where
    fmap f (Just x) = Just (f x)
    fmap f Nothing = Nothing

instance Functor (Either a) where
    fmap f (Right x) = Right (f x)
    fmap f (Left x) = Left x

instance Functor IO where
    fmap f action = do
        result <- action
        return (f result)
```

## Control Applicative

- 成员: `f :: * -> *` _一元类型构造符 (Type Constructor)_.
- `<*>`: 参数为 2 个 functor 实例, 其中一个包含一个函数.

```haskell
(<$>) :: (Functor f) => (a -> b) -> f a -> f b
f <$> x = fmap f x
```

- 作用: 可以用单一一个函数操作多个 functor

```haskell
class (Functor f) => Applicative f where
    pure :: a -> f a
    (<*>) :: f (a -> b) -> f a -> f b
```

### Maybe

```haskell
instance Applicative Maybe where
    pure = Just
    Nothing <*> _ = Nothing
    (Just f) <*> something = fmap f something
```

### Collection `[]`

```haskell
instance Applicative [] where
    pure x = [x]
    fs <*> xs = [f x | f <- fs, x <- xs]
```

### I/O

```haskell
instance Applicative IO where
    pure = return
    a <*> b = do
        f <- a
        x <- b
        return (f x)
```

### ZipList

```haskell
instance Applicative ZipList where
        pure x = ZipList (repeat x)
        ZipList fs <*> ZipList xs = ZipList (zipWith (\f x -> f x) fs xs)
```

### Multi Functor

```haskell
ghci> pure (+) <*> Just 3 <*> Just 5
Just 8
ghci> pure (+) <*> Just 3 <*> Nothing
Nothing
ghci> pure (+) <*> Nothing <*> Just 5
Nothing
```

```haskell
ghci> (*) <$> [2,5,10] <*> [8,10,11]
[16,20,22,40,50,55,80,100,110]
```

```haskell
myAction :: IO String
myAction = (++) <$> getLine <*> getLine
```

```haskell
ghci> getZipList $ max <$> ZipList [1,2,3,4,5,3] <*> ZipList [5,3,1,2]
[5,3,3,4]
```

### 高度封装函数

`liftA2`, 对两个 applicative 运用二元函数:

```haskell
liftA2 :: (Applicative f) => (a -> b -> c) -> f a -> f b -> f c
liftA2 f a b = f <$> a <*> b

ghci> liftA2 (:) (Just 3) (Just [4])
Just [3,4]
ghci> (:) <$> Just 3 <*> Just [4]
Just [3,4]
```

## Control Monad

- 成员: 类型构造符(type constructor)

```haskell
class Monad m where
    return :: a -> m a

{- bind -}(>>=) :: m a -> (a -> m b) -> m b

    (>>) :: m a -> m b -> m b
    x >> y = x >>= _ -> y

    fail :: String -> m a
    fail msg = error msg
```

- 特性: 允许返回值之间具有弹性交互

```haskell
{- 当出现异常后,之后所有的值都变为Nothing -}
ghci> return (0,0) >>= landRight 2 >>= landLeft 2 >>= landRight 2
Just (2,4)
ghci> return (0,0) >>= landLeft 1 >>= landRight 4
  \ >>= landLeft (-1) >>= landRight (-2)
Nothing
```

Monad Laws:

- return 满足 Left identity: `return x >>= f 等于 f x`
- return 满足 right identity: `m >>= return 等于 m`
- Associativity: 结合律 `(m >>= f) >>= g 等于 m >>= (\x -> f x >>= g)`

```haskell
ghci> return 3 >>= (\x -> Just (x+100000))
Just 100003
ghci> (\x -> Just (x+100000)) 3
Just 100003

ghci> Just "move on up" >>= (\x -> return x)
Just "move on up"
ghci> [1,2,3,4] >>= (\x -> return x)
[1,2,3,4]
ghci> putStrLn "Wah!" >>= (\x -> return x)
Wah!

(<=<) :: (Monad m) => (b -> m c) -> (a -> m b) -> (a -> m c)
f <=< g = (\x -> g x >>= f)
ghci> let f x = [x,-x]
ghci> let g x = [x*3,x*2]
ghci> let h = f <=< g
ghci> h 3
[9,-9,6,-6]
```

### Maybe Monad

具有失败可能性的 context 封装,灵活处理异常(返回值为 Nothing)

```haskell
applyMaybe :: Maybe a -> (a -> Maybe b) -> Maybe b
applyMaybe Nothing f  = Nothing
applyMaybe (Just x) f = f x
```

```haskell
instance Monad Maybe where
    return x = Just x
    Nothing >>= f = Nothing
    Just x >>= f  = f x
    fail _ = Nothing
```

do 表示法:

- 在 do expression 中，每一行都是一个 monadic value
- 检查返回值，使用 `<-`

```haskell
foo :: Maybe String
foo = do
    x <- Just 3
    y <- Just "!"
    Just (show x ++ y)

foo :: Maybe String
foo = Just 3   >>= (\x ->
      Just "!" >>= (\y ->
      Just (show x ++ y)))

routine :: Maybe Pole
routine = do
    start <- return (0,0)
    first <- landLeft 2 start
    Nothing
    second <- landRight 2 first
    landLeft 1 second
```

### List Monad

- non-determinism(不确定性)

```haskell
ghci> (*) <$> [1,2,3] <*> [10,100,1000]
[10,100,1000,20,200,2000,30,300,3000]
```

- 实现

```haskell
instance Monad [] where
    return x = [x]
    xs >>= f = concat (map f xs)
    fail _ = []
```

- 返回值交互: 下例中 n 与 return (n, ch) 进行交互
  - list comprehension 与 do 表示法 均是 >>= 的语法糖
- list comprehension: `<-` 与 条件表达式
- do 表示法: `<-` 与 guard 函数

```haskell
ghci> [1,2] >>= \n -> ['a','b'] >>= \ch -> return (n,ch)
[(1,'a'),(1,'b'),(2,'a'),(2,'b')]

{- do 表示法 -}
listOfTuples :: [(Int,Char)]
listOfTuples = do
    n <- [1,2]
    ch <- ['a','b']
    return (n,ch)

sevensOnly :: [Int]
sevensOnly = do
    x <- [1..50]
    guard ('7' `elem` show x)
    return x

{- list comprehension -}
ghci> [ (n,ch) | n <- [1,2], ch <- ['a','b'] ]
[(1,'a'),(1,'b'),(2,'a'),(2,'b')]
```

### MonadPlus

使 Monad 具有 Monoid 的性质(二元封闭运算)

```haskell
instance MonadPlus [] where
    mzero = []
    mplus = (++)
```

### Monad Algorithms

#### 马走日

- 计算出可移动位置

```haskell
moveKnight :: KnightPos -> [KnightPos]
moveKnight (c,r) = do
    (c',r') <- [(c+2,r-1),(c+2,r+1),(c-2,r-1),(c-2,r+1)
                ,(c+1,r-2),(c+1,r+2),(c-1,r-2),(c-1,r+2)
                ]
    guard (c' `elem` [1..8] && r' `elem` [1..8])
    return (c',r')
```

- 利用 >>= 向后传递多个可交互的位置

```haskell
in3 start = return start >>= moveKnight >>= moveKnight >>= moveKnight

in3 :: KnightPos -> [KnightPos]
in3 start = do
    first <- moveKnight start
    second <- moveKnight first
    moveKnight second
```

- 最后完成完整函数: 产生所有三步的可能位置，检查其中一个位置是否在里面

```haskell
canReachIn3 :: KnightPos -> KnightPos -> Bool
canReachIn3 start end = end `elem` in3 start
```

## Foldable

```haskell
import qualified Data.Foldable as F

foldMap :: (Monoid m, Foldable t) => (a -> m) -> t a -> m
```

```haskell
instance F.Foldable Tree where
    foldMap f Empty = mempty
    foldMap f (Node x l r) = F.foldMap f l `mappend`
                                f x           `mappend`
                                F.foldMap f r
```

## Data Monoid

- 成员: 必须为具体类型 (**不可是类型构造符 (Type Constructor)**).
- 准则 (Monoid Law):
  - _结合律_ `a·(b·c) = (a·b)·c`.
  - 无需满足 `a mappend b == b mappend a`.

```haskell
class Monoid m where
    mempty :: m             -- identity
    mappend :: m -> m -> m
    mconcat :: [m] -> m
    mconcat = foldr mappend mempty
```

- 实例

```haskell
instance Monoid [a] where
    mempty = []
    mappend = (++)
```

```haskell
newtype Product a =  Product { getProduct :: a }
    deriving (Eq, Ord, Read, Show, Bounded)

instance Num a => Monoid (Product a) where
    mempty = Product 1
    Product x `mappend` Product y = Product (x * y)

ghci> getProduct $ Product 3 `mappend` Product 4 `mappend` Product 2
24
```

```haskell
newtype Any = Any { getAny :: Bool }
    deriving (Eq, Ord, Read, Show, Bounded)

instance Monoid Any where
    mempty = Any False
    Any x `mappend` Any y = Any (x || y)

ghci> getAny . mconcat . map Any $ [False, False, False, True]
True
```

```haskell
newtype All = All { getAll :: Bool }
    deriving (Eq, Ord, Read, Show, Bounded)

instance Monoid All where
    mempty = All True
    All x `mappend` All y = All (x && y)

ghci> getAll . mconcat . map All $ [True, True, False]
False
```

```haskell
instance Monoid Ordering where
    mempty = EQ
    LT `mappend` _ = LT
    EQ `mappend` y = y
    GT `mappend` _ = GT
```

:::tip

```haskell
-- mappend 在左边不等于 EQ 的情况下都会回传左边的值。相反地则回传右边的值
-- 可代替多个 if/else 语句
import Data.Monoid

lengthCompare :: String -> String -> Ordering
lengthCompare x y = (length x `compare` length y) `mappend`
                    (vowels x `compare` vowels y) `mappend`
                    (x `compare` y)
    where vowels = length . filter (`elem` "aeiou")
```

:::

```haskell
instance Monoid a => Monoid (Maybe a) where
    mempty = Nothing
    Nothing `mappend` m = m
    m `mappend` Nothing = m
    Just m1 `mappend` Just m2 = Just (m1 `mappend` m2)

instance Monoid (First a) where
    mempty = First Nothing
    First (Just x) `mappend` _ = First (Just x)
    First Nothing `mappend` x = x

ghci> getFirst $ First (Just 'a') `mappend` First Nothing
Just 'a'
```

## Customization

- 创建新类: _可以只有声明没有实现_

```haskell
class ClassName where
    defining code
```

- 创建已有类的实例: _必须实现所有已声明函数_
  - 作用等同于 deriving(自由度更大)
  - 可以重写函数,去除默认函数处理,达到特定目的

```haskell
- 先创建新类型
data TrafficLight = Red | Yellow | Green

instance Eq TrafficLight where
    Red == Red = True
    Green == Green = True
    Yellow == Yellow = True
    _ == _ = False

instance Show TrafficLight where
    show Red = "Red light"
    show Yellow = "Yellow light"
    show Green = "Green light"
```

- 创建新类和实现实例时,使用 class constraint
  - 可达到**类似于**继承的效果
  - 可达到限制类型的效果

```haskell
class (Eq a) => Num a where
    ...

instance (Eq m) => Eq (Maybe m) where
    Just x == Just y = x == y
    Nothing == Nothing = True
    _ == _ = False
```

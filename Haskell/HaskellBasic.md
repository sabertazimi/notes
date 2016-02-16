# Haskell Basic Notes

函数式编程语言的一般思路：先取一个初始的集合并将其变形，执行过滤条件，最终取得正确的结果。




## Expression

if语句也是表达式

```haskell
doubleSmallNumber' x = (if x > 100 then x else x*2) + 1
```

## Type

### 基本类型

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

#### Int

有限整数

#### Integer

无限整数(效率低)

#### Float

单精度浮点数

#### Double

双精度浮点数

#### Bool

True/False

#### Char

#### [Char]/String

#### Ordering

LT,GT,EQ

### List

#### Operator

-   ++
-   :
-   !!
-   \>/</==

#### Function

-   head List 首元素
-   last List 尾元素
-   init List 除去尾元素的部分 
-   tail List 除去首元素的部分

-   length List 长度

*Tips*:

```haskell
fromIntegral (length [1,2,3,4]) + 3.2
```

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

#### Range

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

#### List Comprehension(数学定义)

由类似集合定义的离散数学定义,来定义复杂的List:

**[expression | filter]**

**[expression | x <\- Range, Predicate(断言/限制条件)]**

-   Range: `,`分隔多个Range(一般为List)
-   Predicate: `,`分隔多个断言;每个断言均为Boolean表达式

```haskell
ghci> [x*2 | x <- [1..10], x*2 >= 12]
[12,14,16,18,20]

ghci> [ x | x <- [50..100], x `mod` 7 == 3]
[52,59,66,73,80,87,94]


boomBangs xs = [ if x < 10 then "BOOM!" else "BANG!" | x <- xs, odd x]

ghci> boomBangs [7..13]
["BOOM!","BOOM!","BANG!","BANG!"]
```

-   多个Range


```haskell
ghci> [ x*y | x <- [2,5,10], y <- [8,10,11]]
[16,20,22,40,50,55,80,100,110]
```

-   嵌套Comprehension

```haskell
ghci> let xxs = [[1,3,5,2,3,1,2,4,5],[1,2,3,4,5,6,7,8,9],[1,2,4,2,1,6,3,1,3,2,3,6]]

ghci> [ [ x | x <- xs, even x ] | xs <- xxs]
[[2,2,4],[2,4,6,8],[2,4,2,6,2,6]]
```

### Tuple(原组)

#### 内部差异性

-   同一Tuple里可存放不同Type的项

#### 外部差异性

-   数目不同或某项不同的Tuple属于不同Type
	-   不可置于同一List中
	-   不同长度的Tuple不可比较(比较符只可用于相同Type)

#### Function

##### 二元组

fst/snd tuple 返回首项/尾项

zip List1 List2 对应项配对,组成二元组List

```haskell
ghci> zip [5,3,2,6,2,7,2,5,4,6,6] ["im","a","turtle"]
[(5,"im"),(3,"a"),(2,"turtle")]

ghci> zip [1..] ["apple", "orange", "cherry", "mango"]
[(1,"apple"),(2,"orange"),(3,"cherry"),(4,"mango")]
```

### 泛型

运用Type变量(只可为*单字符*),实现泛型参数与多态函数

借助Typeclass可轻松实现多态函数

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

### Typeclass

类似于Java中的Interface

```haskell
ghci> :t (==)  
(==) :: (Eq a) => a -> a -> Bool

ghci> :t fromIntegral
fromIntegral :: (Integral a, Num b) => a -> b
```

#### =>

=>左部: 类约束(Class Constraint)
=>右部: 函数类型(参数/返回值类型),其中参数类型同属Class

#### Basic Typeclass

##### Eq

-   功能: 成员类型可判断相等性
-   成员: 大部分基本类型(不包含函数类型)
-   实现: == 与 /= 函数

##### Ord

Ord成员必为Eq成员

-   功能: 成员类型可判断大小
-   成员: 大部分基本类型(不包含函数类型)
-   实现: < > <= >= 函数
-   实例: compare函数 (Ord a) => a -> a -> Ordering

##### Show

-   功能: 成员类型可用字符串表示
-   成员: 大部分基本类型(不包含函数类型)
-   实例: show函数 (Show a) => a -> String

##### Read

-   功能: 可以将字串转为Read某成员类型
-   成员: 大部分基本类型(不包含函数类型)
-   实例: read函数 (Read a) => String -> a

##### Enum

-   功能: 连续性(可枚举), 其成员类型可用于Range中
-   成员: () Bool Char Ordering Int Integer Float Double

##### Bounded

-   功能: 成员类型具有上下限
-   实例: minBound/maxBound函数 (Bounded a) => a 无参多态常量/定义

##### Num

-   功能: 成员类型具有数字特征
-   成员: 实数 整数 - Int Integer Float Double
-   实例: 所有数字都是多态常量/定义(可视为函数)

```haskell
ghci> :t 20  
20 :: (Num t) => t
```

##### Integral

-   功能: 成员类型具有数字特征
-   成员: 整型 - Int Integer

##### Floating

-   功能: 成员类型具有数字特征
-   成员: 浮点型 - Float Double

### 函数类型

-   单个参数

```haskell
removeNonUppercase :: [Char] -> [Char]
removeNonUppercase st = [ c | c <- st, c `elem` ['A'..'Z']]
```

-   多个参数

```haskell
addThree :: Int -> Int -> Int -> Int
addThree x y z = x + y + z
```

## Function

### 无参函数

“定义”(或者“名字”)

```haskell
tazimi = "It's a-me, tazimi!"
```

### 前缀函数

```haskell
> succ 8
9
```

\`FunctionName\` - 可使前缀函数变为中缀函数

```haskell
> 92 `div` 10 
9
```

### 中缀函数

#### +

从类型定义可以看出,+左右两边参数必须为同类型

```haskell
ghci> :t (+)
(+) :: (Num a) => a -> a -> a
```

#### ++

List连接符,遍历前一List

```haskell
ghci> [1,2,3,4] ++ [9,10,11,12]
[1,2,3,4,9,10,11,12]
ghci> "hello" ++ " " ++ "world"
"hello world"
```

#### :

连接单个元素

```haskell
ghci> 'A':" SMALL CAT"
"A SMALL CAT"
ghci> 5:[1,2,3,4,5]
[5,1,2,3,4,5]
```

#### !!

引用符

```haskell
ghci> [9.4,33.2,96.2,11.2,23.25] !! 1
33.2
```

### 数学函数

-   x `mod` y
-   `even arg`
-   `odd arg`

### 数字函数

-   fromInteger函数  (Num a) => Integer -> a
-   fromIntegral函数 (Integral a, Num b) => a -> b

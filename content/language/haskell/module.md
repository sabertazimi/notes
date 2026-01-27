---
sidebar_position: 6
tags: [Language, Haskell, Module]
---

# Module

## Import

```haskell
import Data.List
import Data.List (nub, sort)
import Data.List hiding (nub)
```

```haskell
import qualified Data.Map
```

调用 Map 中的 filter 时,必须使用 Data.Map.filter.

```haskell
import qualified Data.Map as M

Data.Map.filter <-> M.filter
```

## 建立模块

### 单一模块

新建一个 `Geometry.hs` 的文件

```haskell
module Geometry
( sphereVolume
, sphereArea
, cubeVolume
, cubeArea
, cuboidArea
, cuboidVolume
) where

sphereVolume :: Float -> Float
sphereVolume radius = (4.0 / 3.0) * pi * (radius ^ 3)

sphereArea :: Float -> Float
sphereArea radius = 4 * pi * (radius ^ 2)

cubeVolume :: Float -> Float
cubeVolume side = cuboidVolume side side side

cubeArea :: Float -> Float
cubeArea side = cuboidArea side side side

cuboidVolume :: Float -> Float -> Float -> Float
cuboidVolume a b c = rectangleArea a b * c

cuboidArea :: Float -> Float -> Float -> Float
cuboidArea a b c =
  rectangleArea a b * 2 + rectangleArea a c * 2 + rectangleArea c b * 2

rectangleArea :: Float -> Float -> Float
rectangleArea a b = a * b
```

- 使用

```haskell
import Geometry
```

### 子模块

把 `Geometry` 分成三个子模块

建立一个 `Geometry` 文件夹(注意**首字母**要大写),新建三个文件

- sphere.hs

```haskell
module Geometry.Sphere
( volume
, area
) where

volume :: Float -> Float
volume radius = (4.0 / 3.0) * pi * (radius ^ 3)

area :: Float -> Float
area radius = 4 * pi * (radius ^ 2)
```

- cuboid.hs

```haskell
module Geometry.Cuboid
( volume
, area
) where

volume :: Float -> Float -> Float -> Float
volume a b c = rectangleArea a b * c

area :: Float -> Float -> Float -> Float
area a b c =
  rectangleArea a b * 2 + rectangleArea a c * 2 + rectangleArea c b * 2

rectangleArea :: Float -> Float -> Float
rectangleArea a b = a * b
```

- cube.hs

```haskell
module Geometry.Cube
( volume
, area
) where

import qualified Geometry.Cuboid as Cuboid

volume :: Float -> Float
volume side = Cuboid.volume side side side

area :: Float -> Float
area side = Cuboid.area side side side
```

- 使用

```haskell
import Geometry.Sphere
```

```haskell
import qualified Geometry.Sphere as Sphere
import qualified Geometry.Cuboid as Cuboid
import qualified Geometry.Cube as Cube
```

## List

- intersperse
- intercalate
- transpose

```haskell
ghci> transpose [[1,2,3],[4,5,6],[7,8,9]]
[[1,4,7],[2,5,8],[3,6,9]]
ghci> transpose ["hey","there","guys"]
["htg","ehu","yey","rs","e"]
```

```haskell
ghci> map sum $ transpose [[0,3,5,9],[10,0,0,9],[8,5,1,-1]]
[18,8,6,17]
```

**foldl'** 和 **foldl1'** 是它们各自惰性实现的严格版本,可**防止溢出**问题.

**concat** - 移除一级嵌套

```haskell
ghci> concat ["foo","bar","car"]
"foobarcar"
ghci> concat [[3,4,5],[2,3,4],[2,1,1]]
[3,4,5,2,3,4,2,1,1]
```

**concatMap** 函数与 `map` 一个 List 之后再 `concat` 它等价

```haskell
ghci> concatMap (replicate 4) [1..3]
[1,1,1,1,2,2,2,2,3,3,3,3]
```

and

```haskell
ghci> and $ map (>4) [5,6,7,8]
True
ghci> and $ map (==4) [4,4,4,3,4]
False
```

or

```haskell
ghci> or $ map (==4) [2,3,4,5,6,1]
True
ghci> or $ map (>4) [1,2,3]
False
```

**any** 和 **all** 使用 `any` 或 `all` 会更多些

```haskell
ghci> any (==4) [2,3,5,6,1,4]
True
ghci> all (>4) [6,9,10]
True
ghci> all (`elem` ['A'..'Z']) "HEYGUYSwhatsup"
False
ghci> any (`elem` ['A'..'Z']) "HEYGUYSwhatsup"
True
```

**iterate** 取一个函数和一个值作参数.
它会用该值去调用该函数并用所得的结果再次调用该函数, 产生一个无限的 List.

```haskell
ghci> take 10 $ iterate (*2) 1
[1,2,4,8,16,32,64,128,256,512]
ghci> take 3 $ iterate (++ "haha") "haha"
["haha","hahahaha","hahahahahaha"]
```

splitAt

```haskell
ghci> splitAt 3 "heyman"
("hey","man")
ghci> splitAt 100 "heyman"
("heyman","")
ghci> splitAt (-3) "heyman"
("","heyman")
ghci> let (a,b) = splitAt 3 "foobar" in b ++ a
"barfoo"
```

**takeWhile** 一旦遇到不符合条件的某元素就停止

```haskell
ghci> takeWhile (>3) [6,5,4,3,2,1,2,3,4,5,4,3,2,1]
[6,5,4]
ghci> takeWhile (/=' ') "This is a sentence"
"This"
```

```haskell
ghci> sum $ takeWhile (<10000) $ map (^3) [1..]
53361
```

**dropWhile** 扔掉符合条件的元素.
一旦限制条件返回 `False`, 它就返回 List 的余下部分

```haskell
ghci> dropWhile (/=' ') "This is a sentence"
" is a sentence"
ghci> dropWhile (<3) [1,2,2,2,3,4,5,4,3,2,1]
[3,4,5,4,3,2,1]
```

**span** - 扩展`takeWhile`

```haskell
ghci> let (fw, rest) = span (/=' ')
\ "This is a sentence" in "First word:" ++ fw ++ ", the rest:" ++ rest
"First word: This, the rest: is a sentence"
```

**break** - 取反`span`

```haskell
ghci> break (==4) [1,2,3,4,5,6,7]
([1,2,3],[4,5,6,7])
ghci> span (/=4) [1,2,3,4,5,6,7]
([1,2,3],[4,5,6,7])
```

sort

```haskell
ghci> sort [8,5,3,2,1,6,4,2]
[1,2,2,3,4,5,6,8]
ghci> sort "This will be sorted soon"
" Tbdeehiillnooorssstw"
```

group

```haskell
ghci> group [1,1,1,1,2,2,2,2,3,3,2,2,2,5,6,7]
[[1,1,1,1],[2,2,2,2],[3,3],[2,2,2],[5],[6],[7]]
```

```haskell
ghci> map (\l@(x:xs) -> (x,length l)) . group . sort $ [1,1,1,1,2,2,2,2,3,3,2,2,2,5,6,7]
[(1,4),(2,7),(3,2),(5,1),(6,1),(7,1)]
```

**inits** 和 **tails**

```haskell
ghci> inits "w00t"
["","w","w0","w00","w00t"]
ghci> tails "w00t"
["w00t","00t","0t","t",""]
ghci> let w = "w00t" in zip (inits w) (tails w)
[("","w00t"),("w","00t"),("w0","0t"),("w00","t"),("w00t","")]
```

**isInfixOf** 从一个 List 中搜索一个子 List

```haskell
search :: (Eq a) => [a] -> [a] -> Bool
search needle haystack =
  let nLen = length needle
  in foldl (\acc x -> if take nLen x == needle then True else acc) False (tails haystack)
```

```haskell
ghci> "cat" `isInfixOf` "im a cat burglar"
True
ghci> "Cat" `isInfixOf` "im a cat burglar"
False
ghci> "cats" `isInfixOf` "im a cat burglar"
False
```

**isPrefixOf** 与 **isSuffixOf**

```haskell
ghci> "hey" `isPrefixOf` "hey there!"
True
ghci> "hey" `isPrefixOf` "oh hey there!"
False
ghci> "there!" `isSuffixOf` "oh hey there!"
True
ghci> "there!" `isSuffixOf` "oh hey there"
False
```

**elem** 与 **notElem**

partition

```haskell
ghci> partition (`elem` ['A'..'Z']) "BOBsidneyMORGANeddy"
("BOBMORGAN","sidneyeddy")
ghci> partition (>3) [1,3,5,6,3,2,1,0,3,7]
([5,6,7],[1,3,3,2,1,0,3])
```

find

```haskell
ghci> find (>4) [1,2,3,4,5,6]
Just 5
ghci> find (>9) [1,2,3,4,5,6]
Nothing
ghci> :t find
find :: (a -> Bool) -> [a] -> Maybe a
```

**elemIndex** '可能' (Maybe)返回我们找的元素的索引,若这一元素不存在, 就返回 `Nothing`.

```haskell
ghci> :t elemIndex
elemIndex :: (Eq a) => a -> [a] -> Maybe Int
ghci> 4 `elemIndex` [1,2,3,4,5,6]
Just 3
ghci> 10 `elemIndex` [1,2,3,4,5,6]
Nothing
```

**elemIndices** 与`elemIndex`相似.

```haskell
ghci> ' ' `elemIndices` "Where are the spaces?"
[5,9,13]
```

**findIndex** 与 `find` 相似.
**findIndices** 返回所有符合条件的索引.

```haskell
ghci> findIndex (==4) [5,3,2,1,6,4]
Just 5
ghci> findIndex (==7) [5,3,2,1,6,4]
Nothing
ghci> findIndices (`elem` ['A'..'Z']) "Where Are The Caps?"
[0,6,10,14]
```

```haskell
ghci> zipWith3 (\x y z -> x + y + z) [1,2,3] [4,5,2,2] [2,2,3]
[7,9,8]
ghci> zip4 [2,3,3] [2,2,2] [5,5,3] [2,2,2]
[(2,2,5,2),(3,2,5,2),(3,2,3,2)]
```

在处理来自文件或其它地方的输入时, **lines** 会非常有用.

```haskell
ghci> lines "first line\nsecond line\nthird line"
["first line","second line","third line"]
```

**unlines** 是 `lines` 的反函数.

```haskell
ghci> unlines ["first line", "second line", "third line"]
"first line\nsecond line\nthird line\n"
```

**words** 和 **unwords** 可以把一个字串分为一组单词或执行相反的操作.

```haskell
ghci> words "hey these are the words in this sentence"
["hey","these","are","the","words","in","this","sentence"]
ghci> words "hey these are the words in this\nsentence"
["hey","these","are","the","words","in","this","sentence"]
ghci> unwords ["hey","there","mate"]
"hey there mate"
```

**nub** 可以将一个 List 中的重复元素全部筛掉.

```haskell
ghci> nub [1,2,3,4,3,2,1,2,3,4,3,2,1]
[1,2,3,4]
ghci> nub "Lots of words and stuff"
"Lots fwrdanu"
```

delete

```haskell
ghci> delete 'h' "hey there ghang!"
"ey there ghang!"
ghci> delete 'h' . delete 'h' $ "hey there ghang!"
"ey tere ghang!"
ghci> delete 'h' . delete 'h' . delete 'h' $ "hey there ghang!"
"ey tere gang!"
```

**\\** 差集

```haskell
ghci> [1..10] \\ [2,5,9]
[1,3,4,6,7,8,10]
ghci> "Im a big baby" \\ "big"
"Im a  baby"
```

**union** 并集

```haskell
ghci> "hey man" `union` "man what's up"
"hey manwt'sup"
ghci> [1..7] `union` [5..10]
[1,2,3,4,5,6,7,8,9,10]
```

**intersection** 交集

```haskell
ghci> [1..7] `intersect` [5..10]
[5,6,7]
```

insert

```haskell
ghci> insert 4 [1,2,3,5,6,7]
[1,2,3,4,5,6,7]
ghci> insert 'g' $ ['a'..'f'] ++ ['h'..'z']
"abcdefghijklmnopqrstuvwxyz"
ghci> insert 3 [1,2,4,3,2,1]
[1,2,3,4,3,2,1]
```

### 修正 Prelude 模块

`length`, `take`, `drop`, `splitAt`, `!!` 和 `replicate`
`Data.List` 中包含了更通用的替代版,如:
`genericLength`, `genericTake`, `genericDrop`, `genericSplitAt`, `genericIndex` 和 `genericReplicate`

`nub`, `delete`, `union`, `intsect` 和 `group` 函数
也有各自的通用替代版 `nubBy`, `deleteBy`, `unionBy`, `intersectBy` 和 `groupBy`,
它们的区别就是前一组函数使用 `(==)` 来测试是否相等, 而带 `By` 的那组则取一个函数作参数来判定相等性.

```haskell
ghci> let values = [-4.3, -2.4, -1.2, 0.4, 2.3, 5.9, 10.5, 29.1, 5.3, -2.4, -14.5, 2.9, 2.3]
ghci> groupBy (\x y -> (x > 0) == (y > 0)) values
[[-4.3,-2.4,-1.2],[0.4,2.3,5.9,10.5,29.1,5.3],[-2.4,-14.5],[2.9,2.3]]
```

```haskell
on :: (b -> b -> c) -> (a -> b) -> a -> a -> c
f `on` g = \x y -> f (g x) (g y)
```

```haskell
ghci> groupBy ((==) `on` (> 0)) values
[[-4.3,-2.4,-1.2],[0.4,2.3,5.9,10.5,29.1,5.3],[-2.4,-14.5],[2.9,2.3]]
```

`sort`, `insert`, `maximum` 和 `min` 都有各自的通用版本.
如 `groupBy` 类似, **sortBy**, **insertBy**, **maximumBy**
和 **minimumBy** 都取一个函数来比较两个元素的大小.

```haskell
ghci> let xs = [[5,4,5,4,4],[1,2,3],[3,5,4,3],[],[2],[2,2]]
ghci> sortBy (compare `on` length) xs
[[],[2],[2,2],[1,2,3],[3,5,4,3],[5,4,5,4,4]]
```

## Char

- **isControl** 判断一个字符是否是控制字符.
- **isSpace** 判断一个字符是否是空格字符, 包括空格, tab, 换行符等.
- **isLower** 判断一个字符是否为小写.
- **isUpper** 判断一个字符是否为大写.
- **isAlpha** 判断一个字符是否为字母.
- **isAlphaNum** 判断一个字符是否为字母或数字.
- **isPrint** 判断一个字符是否是可打印的.
- **isDigit** 判断一个字符是否为数字.
- **isOctDigit** 判断一个字符是否为八进制数字.
- **isHexDigit** 判断一个字符是否为十六进制数字.
- **isLetter** 判断一个字符是否为字母.
- **isMark** 判断是否为 unicode 注音字符, 你如果是法国人就会经常用到的.
- **isNumber** 判断一个字符是否为数字.
- **isPunctuation** 判断一个字符是否为标点符号.
- **isSymbol**判断一个字符是否为货币符号.
- **isSeparator** 判断一个字符是否为 unicode 空格或分隔符.
- **isAscii** 判断一个字符是否在 unicode 字母表的前 128 位.
- **isLatin1** 判断一个字符是否在 unicode 字母表的前 256 位.
- **isAsciiUpper** 判断一个字符是否为大写的 ascii 字符.
- **isAsciiLower** 判断一个字符是否为小写的 ascii 字符.

```haskell
ghci> all isAlphaNum "bobby283"
True
ghci> all isAlphaNum "eddy the fish!"
False
```

```haskell
ghci> words "hey guys its me"
["hey","guys","its","me"]
ghci> groupBy ((==) `on` isSpace) "hey guys its me"
["hey"," ","guys"," ","its"," ","me"]
ghci>
```

```haskell
ghci> filter (not . any isSpace) . groupBy ((==) `on` isSpace) $ "hey guys its me"
["hey","guys","its","me"]
```

```haskell
ghci> generalCategory ' '
Space
ghci> generalCategory 'A'
UppercaseLetter
ghci> generalCategory 'a'
LowercaseLetter
ghci> generalCategory '.'
OtherPunctuation
ghci> generalCategory '9'
DecimalNumber
ghci> map generalCategory " \t\nA9?|"
[Space,Control,Control,UppercaseLetter,DecimalNumber,OtherPunctuation,MathSymbol]
```

- **toUpper** 将一个字符转为大写字母, 若该字符不是小写字母, 就按原值返回.
- **toLower** 将一个字符转为小写字母, 若该字符不是大写字母, 就按原值返回.
- **toTitle** 将一个字符转为 title-case, 对大多数字元而言, title-case 就是大写.
- **digitToInt** 将一个字符转为 Int 值, 而这一字符必须得在 `'1'..'9','a'..'f'`或`'A'..'F'` 的范围之内.

```haskell
ghci> map digitToInt "34538"
[3,4,5,3,8]
ghci> map digitToInt "FF85AB"
[15,15,8,5,10,11]
```

```haskell
ghci> intToDigit 15
'f'
ghci> intToDigit 5
'5'
```

**ord** 与 **char** 函数可以将字符与其对应的数字相互转换.

```haskell
ghci> ord 'a'
97
ghci> chr 97
'a'
ghci> map ord "abcdefgh"
[97,98,99,100,101,102,103,104]
```

```haskell
encode :: Int -> String -> String
encode shift msg =
  let ords = map ord msg
      shifted = map (+ shift) ords
  in map chr shifted
```

```haskell
decode :: Int -> String -> String
decode shift msg = encode (negate shift) msg
```

## Map

```haskell
findKey :: (Eq k) => k -> [(k,v)] -> v
findKey key xs = snd . head . filter (\(k,v) -> key == k) $ xs
```

```haskell
findKey :: (Eq k) => k -> [(k,v)] -> Maybe v
findKey key [] = Nothing
findKey key ((k,v):xs) =
     if key == k then
         Just v
     else
         findKey key xs
```

```haskell
findKey :: (Eq k) => k -> [(k,v)] -> Maybe v
findKey key = foldr (\(k,v) acc -> if key == k then Just v else acc) Nothing
```

**fromList** 取一个关联列表, 返回一个与之等价的 Map.

```haskell
Map.fromList :: (Ord k) => [(k, v)] -> Map.Map k v
```

若其中存在重复的键,就将其忽略.

```haskell
ghci> Map.empty
fromList []
```

insert

```haskell
ghci> Map.insert 5 600 (Map.insert 4 200 ( Map.insert 3 100  Map.empty))
fromList [(3,100),(4,200),(5,600)]
ghci> Map.insert 5 600 . Map.insert 4 200 . Map.insert 3 100 $ Map.empty
fromList [(3,100),(4,200),(5,600)]
```

```haskell
fromList' :: (Ord k) => [(k,v)] -> Map.Map k v
fromList' = foldr (\(k,v) acc -> Map.insert k v acc) Map.empty
```

null

```haskell
ghci> Map.null Map.empty
True
```

size

```haskell
ghci> Map.size $ Map.fromList [(2,4),(3,3),(4,2),(5,4),(6,4)]
5
```

singleton

```haskell
ghci> Map.singleton 3 9
fromList [(3,9)]
ghci> Map.insert 5 9 $ Map.singleton 3 9
fromList [(3,9),(5,9)]
```

lookup

member

```haskell
ghci> Map.member 3 $ Map.fromList [(3,6),(4,3),(6,9)]
True
ghci> Map.member 3 $ Map.fromList [(2,5),(4,5)]
False
```

**map** 与 **filter** 与其对应的 `List` 版本相似

`toList` 是 `fromList` 的反函数

```haskell
ghci> Map.toList . Map.insert 9 2 $ Map.singleton 4 3
[(4,3),(9,2)]
```

**keys** 与 **elems**

```haskell
phoneBook =
    [("betty","555-2938")
    ,("betty","342-2492")
    ,("bonnie","452-2928")
    ,("patsy","493-2928")
    ,("patsy","943-2929")
    ,("patsy","827-9162")
    ,("lucille","205-2928")
    ,("wendy","939-8282")
    ,("penny","853-2492")
    ,("penny","555-2111")
    ]
```

```haskell
phoneBookToMap :: (Ord k) => [(k, String)] -> Map.Map k String
phoneBookToMap xs = Map.fromListWith
  (\number1 number2 -> number1 ++ ", " ++ number2) xs
```

```haskell
ghci> Map.lookup "patsy" $ phoneBookToMap phoneBook
"827-9162, 943-2929, 493-2928"
ghci> Map.lookup "wendy" $ phoneBookToMap phoneBook
"939-8282"
ghci> Map.lookup "betty" $ phoneBookToMap phoneBook
"342-2492, 555-2938"
```

```haskell
phoneBookToMap :: (Ord k) => [(k, a)] -> Map.Map k [a]
phoneBookToMap xs = Map.fromListWith (++) $ map (\(k,v) -> (k,[v])) xs
ghci> Map.lookup "patsy" $ phoneBookToMap phoneBook
["827-9162","943-2929","493-2928"]
```

在遇到重复元素时, 单选最大的那个值.

```haskell
ghci> Map.fromListWith max [(2,3),(2,5),(2,100),(3,29),(3,22),(3,11),(4,22),(4,15)]
fromList [(2,100),(3,29),(4,22)]
```

将相同键的值都加在一起.

```haskell
ghci> Map.fromListWith (+) [(2,3),(2,5),(2,100),(3,29),(3,22),(3,11),(4,22),(4,15)]
fromList [(2,108),(3,62),(4,37)]
```

insertWith

```haskell
ghci> Map.insertWith (+) 3 100 $ Map.fromList [(3,4),(5,103),(6,339)]
fromList [(3,104),(5,103),(6,339)]
```

## Set

内部元素排序且唯一

```haskell
import qualified Data.Set as Set
```

fromList

```haskell
ghci> let set1 = Set.fromList text1
ghci> let set2 = Set.fromList text2
ghci> set1
fromList " .?AIRadefhijlmnorstuy"
ghci> set2
fromList " !Tabcdefghilmnorstuvwy"
```

```haskell
ghci> Set.intersection set1 set2
fromList " adefhilmnorstuy"
```

**difference** 差集

```haskell
ghci> Set.difference set1 set2
fromList ".?AIRj"
ghci> Set.difference set2 set1
fromList "!Tbcgvw"
```

`union` 并集

```haskell
ghci> Set.union set1 set2
fromList " !.?AIRTabcdefghijlmnorstuvwy"
```

`null`, `size`, `member`, `empty`, `singleton`, `insert`, `delete`

```haskell
ghci> Set.null Set.empty
True
ghci> Set.null $ Set.fromList [3,4,5,5,4,3]
False
ghci> Set.size $ Set.fromList [3,4,5,3,4,5]
3
ghci> Set.singleton 9
fromList [9]
ghci> Set.insert 4 $ Set.fromList [9,3,8,1]
fromList [1,3,4,8,9]
ghci> Set.insert 8 $ Set.fromList [5..10]
fromList [5,6,7,8,9,10]
ghci> Set.delete 4 $ Set.fromList [3,4,5,4,3,4,5]
fromList [3,5]
```

```haskell
ghci> Set.fromList [2,3,4] `Set.isSubsetOf` Set.fromList [1,2,3,4,5]
True
ghci> Set.fromList [1,2,3,4,5] `Set.isSubsetOf` Set.fromList [1,2,3,4,5]
True
ghci> Set.fromList [1,2,3,4,5] `Set.isProperSubsetOf` Set.fromList [1,2,3,4,5]
False
ghci> Set.fromList [2,3,4,8] `Set.isSubsetOf` Set.fromList [1,2,3,4,5]
False
```

执行 `map` 和 `filter`:

```haskell
ghci> Set.filter odd $ Set.fromList [3,4,5,6,7,2,3,4]
fromList [3,5,7]
ghci> Set.map (+1) $ Set.fromList [3,4,5,6,7,2,3,4]
fromList [3,4,5,6,7,8]
```

- 删除重复元素

```haskell
ghci> let setNub xs = Set.toList $ Set.fromList xs
ghci> setNub "HEY WHATS CRACKALACKIN"
" ACEHIKLNRSTWY"
ghci> nub "HEY WHATS CRACKALACKIN"
"HEY WATSCRKLIN"
```

## References

- Learn you a haskell [guide](https://github.com/MnO2/learnyouahaskell-zh/blob/develop/zh-cn/ch07/module.md).

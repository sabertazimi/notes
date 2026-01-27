---
sidebar_position: 8
tags: [Language, Haskell, I/O]
---

# I/O

## ByteString

- `Data.ByteString`
- `Data.ByteString.Lazy`

lazy byteStrings 像装了一堆大小为 64K 的 strict byteStrings 的 list

```haskell
import qualified Data.ByteString.Lazy as B
import qualified Data.ByteString as S
```

- pack/unpack
- fromChunks/toChunks
- cons/empty/head/tail/init/null/length/map/reverse/foldl/foldr/concat/takeWhile/filter

## File

- `hPutStr`
- `hPutStrLn`

### Handle

- `data IOMode = ReadMode | WriteMode | AppendMode | ReadWriteMode`
- `openFile :: FilePath(String) -> IOMode -> IO Handle`
- `hGetContents :: Handle -> IO String`
- `hClose :: Handle -> IO ()`

- `hGetChar`
- `hGetLine`

```haskell
import System.IO

main = do
    handle <- openFile "girlfriend.txt" ReadMode
    contents <- hGetContents handle
    putStr contents
    hClose handle
```

### With

`withFile :: FilePath -> IOMode -> (Handle -> IO a) -> IO a`

```haskell
import System.IO

main = do
    withFile "girlfriend.txt" ReadMode (\handle -> do
            contents <- hGetContents handle
            putStr contents)
```

### Read

```haskell
contents <- readFile "girlfriend.txt"
```

### Write

`writefile :: FilePath -> String -> IO ()` - WriteMode, not AppendMode

### Append

### Directory

- `removeFile`.
- `renameFile`.

## Input

### Char

`getChar :: IO Char`:

```haskell
main = do
    c <- getChar
    if c /= ' '
        then do
            putChar c
            main
        else return ()
```

### Contents

`getContents :: IO String` (lazy I/O),
内容暂存在文件, 需要使用时读取至内存区:

```haskell
import Data.Char

main = do
    contents <- getContents
    putStr (map toUpper contents)
```

## Output

### String

`putChar`/`putStr`/`putStrLn`:

```haskell
putStr :: String -> IO ()
putStr [] = return ()
putStr (x:xs) = do
    putChar x
    putStr xs
```

### Print

print = putStrLn . show

## Action

`name <- IO action`: 将 action 绑定至名字上,IO String -> String

```haskell
name <- getLine
name <- return String

name <- putStrLn String
```

在一个`do block`中,最后一个`action`不能绑定任何名字,它会被绑定成为`do block`的结果值.

```haskell
main = do
    foo <- putStrLn "Hello, what's your name?"
    name <- getLine
    putStrLn ("Hey " ++ name ++ ", you rock!")
```

### Return

- return 功能:将 pure value 包成 I/O actions,不会终止函数/程序
- return 作用:
  - if condition then I/O action else I/O action
  - 改变`do block形成的I/O action`的结果值: otherIOAction -> return pureValue

> e.g. return "haha" - String -> IO String

```haskell
main = do
    line <- getLine
    if null line
        then return ()
        else do
            putStrLn $ reverseWords line
            main

reverseWords :: String -> String
reverseWords = unwords . map reverse . words
```

### When

Control.Monad.when :: (Applicative f) => Bool -> f () -> f ()

`when bool表达式 I/O-Action` - 真时返回 Action,假时`return ()`

```haskell
import Control.Monad

main = do
    c <- getChar
    when (c /= ' ') $ do
        putChar c
        main
```

### Sequence

sequence :: `[IO a]` -> IO `[a]`

```haskell
main = do
    rs <- sequence [getLine, getLine, getLine]
    print rs
```

### Map

mapM, Control.Monad.forM:

= sequence . map

```haskell
ghci> mapM print [1,2,3]
1
2
3
[(),(),()]
ghci> mapM_ print [1,2,3]
1
2
3
```

### Control

接受一个 I/O action 并回传一个永远作同一件事的 I/O action

以下代码实现了循环结构:

```haskell
import Control.Monad
import Data.Char

main = forever $ do
    putStr "Give me some input: "
    l <- getLine
    putStrLn $ map toUpper l
```

### hSetBuffering

`data BufferMode = NoBuffering | LineBuffering | BlockBuffering (Maybe Int)`
`hSetBuffering :: Handle -> BufferMode -> IO ()`

```haskell
main = do
    withFile "something.txt" ReadMode (\handle -> do
        hSetBuffering handle $ BlockBuffering (Just 2048)
        contents <- hGetContents handle
        putStr contents)
```

### hFlush

## Command Line

> System.Environment

- getArgs: `getArgs :: IO [String]`
- getProgName: `getProgName :: IO String`

```haskell
import System.Environment
import Data.List

main = do
    args <- getArgs
    progName <- getProgName
    mapM putStrLn args
    putStrLn progName
```

```haskell
import System.Environment
import System.Directory
import System.IO
import Data.List

dispatch :: [(String, [String] -> IO ())]
dispatch =  [ ("add", add)
            , ("view", view)
            , ("remove", remove)
            ]

main = do
    (command:args) <- getArgs
    let (Just action) = lookup command dispatch
    action args

add :: [String] -> IO ()
add [fileName, todoItem] = appendFile fileName (todoItem ++ "\n")

view :: [String] -> IO ()
view [fileName] = do
    contents <- readFile fileName
    let todoTasks = lines contents
        numberedTasks = zipWith (\n line -> show n ++ " - " ++ line) [0..] todoTasks
    putStr $ unlines numberedTasks

remove :: [String] -> IO ()
remove [fileName, numberString] = do
    handle <- openFile fileName ReadMode
    (tempName, tempHandle) <- openTempFile "." "temp"
    contents <- hGetContents handle
    let number = read numberString
        todoTasks = lines contents
        newTodoItems = delete (todoTasks !! number) todoTasks
    hPutStr tempHandle $ unlines newTodoItems
    hClose handle
    hClose tempHandle
    removeFile fileName
    renameFile tempName fileName
```

## Lines

`lines :: String -> [String]` - 按换行符将段落切割成句子

## Interact

- arguments: String -> String 的函数
- return: 一个 I/O action
- function: I/O action 会读取输入，调用提供的函数，然后把函数的结果打印出来

```haskell
main = interact shortLinesOnly

shortLinesOnly :: String -> String
shortLinesOnly input =
    let allLines = lines input
        shortLines = filter (\line -> length line < 10) allLines
        result = unlines shortLines
    in result
```

```haskell
main = interact $ unlines . filter ((<10) . length) . lines
```

```haskell
respondPalindromes = unlines . map (\xs ->
    if isPalindrome xs then "palindrome" else "not a palindrome") . lines
        where isPalindrome xs = xs == reverse xs
```

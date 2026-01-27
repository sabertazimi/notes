---
sidebar_position: 9
tags: [Language, Haskell, Exception]
---

# Exception

System.IO.Error

## catch

catch :: IO a -> (IOError -> IO a) -> IO a

```haskell
import System.Environment
import System.IO
import System.IO.Error

main = toTry `catch` handler

toTry :: IO ()
toTry = do (fileName:_) <- getArgs
            contents <- readFile fileName
            putStrLn $ "The file has " ++ show (length (lines contents)) ++ " lines!"

handler :: IOError -> IO ()
handler e
    | isDoesNotExistError e = putStrLn "The file doesn't exist!"
    | isFullError e = freeSomeSpace
    | isIllegalOperation e = notifyCops
    | otherwise = ioError e
```

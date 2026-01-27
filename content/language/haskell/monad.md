---
sidebar_position: 7
tags: [Language, Haskell, Monad]
---

# Monad

## Writer

Writer 可以让我们在计算的同时搜集所有 log 纪录，并汇集成一个 log 并附加在结果上

```haskell
applyLog :: (a,String) -> (a -> (b,String)) -> (b,String)
applyLog (x,log) f = let (y,newLog) = f x in (y,log ++ newLog)
```

```haskell
ghci> (30, "A freaking platoon.") `applyLog` isBigGang
(True,"A freaking platoon.Compared gang size to 9")
ghci> ("BathCat","Got outlaw name.") `applyLog` (\x -> (length x, "Applied length"))
(7,"Got outlaw name.Applied length")
```

```haskell
instance (Monoid w) => Monad (Writer w) where
    return x = Writer (x, mempty)
    (Writer (x,v)) >>= f = let (Writer (y, v')) = f x in Writer (y, v `mappend` v')
```

```haskell
import Control.Monad.Writer

logNumber :: Int -> Writer [String] Int
logNumber x = Writer (x, ["Got number: " ++ show x])

multiWithLog :: Writer [String] Int
multiWithLog = do
    a <- logNumber 3
    b <- logNumber 5
    return (a*b)
```

## Reader

```haskell
instance Monad ((->) r) where
    return x = _ -> x
    h >>= f = \w -> f (h w) w
```

## State

```haskell
newtype State s a = State { runState :: s -> (a,s) }

instance Monad (State s) where
    return x = State $ \s -> (x,s)
    (State h) >>= f = State $ \s -> let (a, newState) = h s
                                        (State g) = f a
                                    in  g newState
```

```haskell
get = State $ \s -> (s,s)
put newState = State $ \s -> ((),newState)
```

```haskell
import Control.Monad.State

pop :: State Stack Int
pop = State $ \(x:xs) -> (x,xs)

push :: Int -> State Stack ()
push a = State $ \xs -> ((),a:xs)

stackManipulation :: State Stack Int
stackManipulation = do
  push 3
  a <- pop
  pop
```

## Error

```haskell
instance (Error e) => Monad (Either e) where
    return x = Right x
    Right x >>= f = f x
    Left err >>= f = Left err
    fail msg = Left (strMsg msg)
```

```haskell
ghci> :t strMsg
strMsg :: (Error a) => String -> a
ghci> strMsg "boom!" :: String
"boom!"
```

### liftM

### join

### filterM

### foldM

### `<=<` (组合函数)

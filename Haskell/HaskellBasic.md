# Haskell Basic Notes

## Expression

if语句也是表达式

```haskell
doubleSmallNumber' x = (if x > 100 then x else x*2) + 1
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

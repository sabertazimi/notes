---
sidebar_position: 13
tags: [Language, Java, Exception]
---

# Exceptions

## 分类

- 已检查异常: 需要抛出声明(非 RuntimeException)
- 未检查异常: 不可控(Error)/可避免(RuntimeException: 下标越界等)
- 子类覆盖父类方法(该方法)抛出必检异常数必须少于父类方法

## Catch

原则: 捕获知道如何处理的异常, 传递不知如何处理的异常

### Multiple

- 普通形式

```java
try
{
    语句组(可能抛出异常的语句: 抛出异常后, try语句块直接终止)
}
catch (匹配Exception ex)
{
    子子异常类名 异常处理语句组;
}
catch (匹配Exception ex)
{
    子异常类名 异常处理语句组;
}
catch (匹配Exception ex)
{
    父异常类名 异常处理语句组;
}
[ finally
{
    必定(即使try return)会被执行异常处理语句组: 用于释放资源, 不能捕获异常
}]
```

`catch`: `0 ~ n`,
`finally`: 可选项 (无论是否有 `break`/`return`, 都会被执行多遍).

更好的形式:

```java
try
{
    try
    {
        code that might throw exceptions{};
    }
    finally
    {
        in.close();
    }
}
catch (IOException e)
{
    show error message{};
    throw exception{};
    throw new exception{};
}
```

- 常用 catch 处理语句

```java
System.out.println("Error" + e);
System.out,println("Cause" + e.getCause());
throw e;
throw new Exception(String)/(String, e);
```

### Rethrow

- 将当前捕获的异常再次抛出: throw e;
- 重新生成并抛出一个新异常(沿调用堆栈传递)
  - throw new Exception("some message");
  - throw new Exception("some message", e);
  - 将原始异常作为新异常的 initCause

```java
catch (SQLException e)
{
    Throwable se = new ServletException("database error");
    se.initCause(e);
    throw se;
}
```

上级便可通过 se.getCause()方法得到原始异常

### Close

catch 语句体为空, 便可关闭捕获的异常

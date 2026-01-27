---
sidebar_position: 16
tags: [Language, Java, Testing, JUnit, Logging]
---

# Testing

## JUnit

```java
import static org.JUnit.Assert.*
```

为每个类构置一个 main 方法进行单元测试

## Logging

### 断言

assert 表达式: 字符串信息

### 代理

Logger.getGlobal().info(" ……" + targetVariableName);

### Stack Trace

- `Throwable.printStackTrace()`

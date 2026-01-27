---
sidebar_position: 12
tags: [Language, Java, Package]
---

# Package

## Structure

```java
package packageName;              //指定文件中的类所在的包, 0个或1个
import packageName.[className|*];   //指定引入的类/API, 0个或多个
public classDefinition                 //属性为public的类定义, 0个或1个
interfaceDefinition and classDefinition  //接口或类定义, 0个或多个
```

## Import

包的导入:

```java
import java.包路径.*   //导入指定包的所有类
```

静态导入:

```java
import static java.包路径.类名.*  //导入指令类的所有静态域和静态方法
```

## 类路径

```java
package 语句
```

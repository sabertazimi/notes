---
sidebar_position: 31
tags: [Language, Java, Style Guide, Comments]
---

# Comments

## Javadoc

Java 除了可以采用我们常见的注释方式 (`//`、`/* */` (二型注释不可嵌套)) 之外,
Java 语言规范还定义了一种特殊的 Javadoc 注释:

```java
/**
*@author    对类的说明              标明开发该类模块的作者
*@version   对类的说明              标明该类模块的版本
*@see      对类、属性、方法的说明  参考转向, 也就是相关主题
*@param    对方法的说明            对方法中某参数的说明
*@return    对方法的说明             对方法返回值的说明
*@exception 对方法的说明            对方法可能抛出的异常进行说明
*@Override   对方法覆盖的说明
*@FunctionalInterface 函数式接口: 包含不超过一个abstract方法 (可以有其他非abstract方法)
*/
```

## Class

位于类定义前:

```java
/**
*整体性描述
*
* @author 作者
* @version 1.0, 05/22/07
* @since version1.0
*/
```

## Method

位于方法定义前:

```java
/**
*整体性描述
*
*@param             对方法的说明            对方法中某参数的说明
*@return            对方法的说明             对方法返回值的说明
*@exception/throws 对方法的说明            对方法可能抛出的异常进行说明
*/
```

## Field

位于实例域定义前:

```java
/**
 * 备注信息
 */
```

## Link

`@see` 与 `@link`:

可在文档中看到引用(文本、类/方法/变量、超链接)

- `@see`/`@link` `package.class#feature` label
- `@see`/`@link` `<a href = "……">` label `</a>`
- `@see`/`@link` "text"

:::tip[区别]

- `@link` 注释可在任意位置
- `@see` 注释需在类/方法/变量定义前

:::

## Package

新建 `package-info.java` 源文件:

```java
package 包路径
/**
 * 包注释
 */
```

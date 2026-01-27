---
sidebar_position: 3
tags: [Language, Java, String]
---

# String

## Equals

- 内容相等: `stringOne.equals(stringTwo)` 方法返回值 `true`/`false`.
- 不区分大小写 `equalsIgnoreCase`.

## Substring

`stringTest.substring(a, b)` 方法返回长度为 `b-a` 的子串,
a (包括)、b (不包括) 为起止位置.

## APIs

- `contains()`/`indexOf()`/`lastIndexOf()`/`startsWith()`/`endsWith()`.
- `trim()`/`strip()`/`stripLeading()`/`stripTrailing()`.
- `isEmpty()`/`isBlank()`.
- `replace()`/`replaceAll()`.
- `split()`/`join()`.
- `s.formatted()`/`String.format()`.
- `String.valueOf()`/`Integer.parseInt()`/`Boolean.parseBoolean()`.

:::tip[Unicode]

Java 的 `String` 和 `char` 在内存中总是以 Unicode 编码表示.

:::

## Builder

StringBuilder 类:

- StringBuilder 是可变对象, 用来高效拼接字符串.
- StringBuilder 可以支持链式操作, 实现链式操作的关键是返回实例本身.

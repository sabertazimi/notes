---
sidebar_position: 20
tags: [Language, Java, I/O]
---

# I/O

## Scanner

监视器, 功能最强大的输入类, new Scanner(System.in)

## Format

`System.out.printf()`: 静态创建格式化字符串

## File

### Read

用 `File` 对象构造一个 `Scanner` 对象: `new Scanner(Paths.get("FileName"))`(反斜杠需双写)

### Write

用文件名构造一个 `PrintWriter` 对象:
`new PrintWriter("FileName")`, 之后调用`System.PrintWriter.print`方法.

## Input

- `InputStream` 类: `read` (字节)
- `Reader` 类: `read` (char)

## Output

- `OutputStream` 类: `write`、`flush`、`close`
- `Writer` 类: `write`(char, String)、`flush`、`close`

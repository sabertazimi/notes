---
sidebar_position: 11
tags: [Language, Verilog, Dataflow]
---

# Dataflow

- assign net = net/reg: **左式只能是 net**

## Operators

- [Operators List](https://hom-wang.gitbooks.io/verilog-hdl/content/Chapter_04.html)

```verilog
赋值: <=, =
>, <, <=, >=
!=. ==
[ ]. { }
<<, >>
+, -, *, /, %
```

## 整数提升

- 表达式所有中间取 最大位宽(最长(左/右)操作数)

### Pattern Matching

`{ }` 可实现 haskell 中的**模式匹配**:

```verilog
// 连接运算符
A = { 1'b0, 1'b1};                // A = 2'b01
A = { B[1:0], C[0], D[2] };    // A = B[1], B[2], C[0], D[2]
A = { 2{2'b01} };                  // A = 4'b0101
A = { 3'b101, 2{1'b0} };        // A = 5'b101_00
```

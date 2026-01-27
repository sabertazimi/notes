---
sidebar_position: 4
tags: [Language, Verilog, Data, Type]
---

# Data Types

## Keywords

```verilog
module
input, output, inout
wire, reg, parameter
always@(), assign
posedge, negedge
if-else, case, begin ... end
```

```verilog
port, signal
```

## 常量

- 0: 逻辑 0
- 1: 逻辑 1
- x/X: Unknown/Floating
- z/Z: 高阻抗状态(High Impedance)
- parameter: #define

```verilog
localparam idle = 2'b00;
parameter Bit = 8, cnt_up = 1'b1;

output [Bit - 1:0] A;
reg [Bit - 1:0] A;

A = A + cnt_up;
```

## 向量

```verilog
[MSB: LSB] 或 [LSB: MSB]
```

```verilog
output [3:0] A;    // 4 bit
reg [0:3] B, C;    // 4 bit
wire [63:0] D;    // 64 bit
wire E;               // 1 bit

A[2:1] = B[0] & C[1:2];    // A[2] = B[0] & C[1], A[1] = B[0] & C[2]
B[0:1] = 0;
C = 4'b1011;                   // C[0] = 1, C[1] = 0, C[2] = 1, C[3] = 1
```

```verilog
integer [7:0] A [3:0];        // 4元素数组. 每个元素为16bit元
reg B [3:0] [15:0];            // arr[4][16]数组, 每个元素为1bit元
reg [7:0] C [3:0] [15:0];    // arr[4][16]数组, 每个元素为8bit元

A[3] = 0;                     // 置零A中第三个元素(8 bit)
A = 0;                        // 置零A
B[1][0] = 1;                  // B[1][0](1 bit)置1
C[0][0][3:0] = 4'b0010;      // C[0][0] 低4bit为0010
C[2][8][5] = 1;               // C[2][8] 第5bit为1
```

### 部分位选

```verilog
vector[base_expr+: const_width];
vector[base_expr-: const_width];

inst_mode[mark+:2]; // => mark,mark+1
gpio_mode[mark-:4]; // => mark,mark-1,mark-2,mark-3
```

## 数字

```verilog
// size ' signed base value
<Bits长度>'[signed]<进制><数值>
```

- 位长不能用表达式表示,只可用固定的 parameter

```verilog
Num = 5'b01101;               // 二进制
Num = 22;                     // 十进制
Num = 12'b0000_1111_0000;    // 可读性
Num = 4'hf;                  // 十六进制(1111)
Num = 4'bxxx1;              // 前三位未知
Num = 4'bz01;               // 前两位为z, 后两位为01
```

### 有符号数

- signed reg
- signed wire
- integer
- 'sxx

### 无符号数

- reg
- wire
- 'xx

## Register

- reg/integer/time/real/realtime
- 有记忆性
- 默认值: x

### Integer

长度为 32 Bit, 补码表示, 常用于计数器

```verilog
always @(posedge CLK)
    begin
        integer i;
        for (i = 0;i <= 7; i = i + 1) tmp[i] = In;
    end
```

### Real

- real 默认值为 0,不可为 x/z
- 不可声明位宽

## Net

- wire/wand/wor
- 局部变量, 没有记忆性
- 默认值: z
- wire 间不可直接相连, wand/wor 间可直接相连
- 可用 wire 定义局部变量

## Macro

将多个 define 宏,放至 `_defines.v`, 作为全局宏.

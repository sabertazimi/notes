---
sidebar_position: 12
tags: [Language, Verilog, Behavior]
---

# Behavior

- `reg = net/reg`: 左式只能是 `reg`.

## 时延控制

```verilog
#num

parameter cycle = 30;

# 2
# cycle/2
```

## 事件控制

```verilog
@(*);
@( sel, a, b);
@(sel or a or b);
@(posedge CLK);
@(negedge CLK);
```

## 语句内/间控制

```verilog
q = @(posedge clk_iol) d; // 语句内事件控制

@(posedge clk_iol)        // 语句间事件控制
    q = temp;
```

## Always

```verilog
always @(事件1, 事件2, ...)
    begin
        ...;
    end
```

## If Else

- 必须添加 else

```verilog
if (condition1)
    begin
        ...;
    end
else if (condition2)
    begin
        ...;
    end
else
    begin
        ...;
    end
```

## Case

- expr: 常量/变量/连接运算符{ }/x/z
- casex: 当输入某一位为 x/z 时，忽略此位匹配(恒将此位匹配为真)
- casez: 当输入某一位为 z 时，忽略此位匹配(恒将此位匹配为真)

```verilog
case (expr)
    item 1:
        begin
            ...;
        end
    item 2:
        begin
            ...;
        end
    item 3:
        begin
            ...;
        end
    default:
        ...;
endcase
```

## Loop

### For

```verilog
for (循环初值; 循环条件; 控制部分)
    begin
        ...;
    end
```

### Repeat

- initial for **test bench**
- 当需 if/else 进行断言时,注意 **延时** 造成的错误逻辑

```verilog
// 重复事件控制:
// 先计算好右值, 等待时钟 clk 上出现2个负跳变沿, 再把右值赋给 result
result = repeat (2) @(negedge clk) hw_data + hr_data;

// repeat 循环语句:
repeat (2)
    @(posedge clk) result = hw_data + hr_data;
```

```verilog
initial begin
    inc_DAC = 1'b1;

    repeat(4095) @(posedge clk); // bring DAC right up to point of rollover
    inc_DAC = 1'b0;
    inc_sym = 1'b1;

    repeat(7)@(posedge clk); // bring sample count up to 7
    inc_sym = 1'b0;
end

initial begin
    #100 $finish; // run simulation for 100 units
end
```

### Forever

```verilog
// $stop, $finish 可以终止 forever loop
forever #10 clk = ~ clk;
```

## Force and Release

```verilog
initial
    begin
        force test_reset = penalty & rtc_intr;
        #5;
        release test_reset;
    end
```

## Blocking and Non-Blocking

- Blocking(`=`): 顺序执行
- Non-Blocking(`<=`): 并行执行

```verilog
output = input_logic;

output <= input_logic;
```

## Disable

```verilog
begin : break
    for (i = 0; i < n; i = i+1) begin : continue
        @(posedge clk)
        if (a == 0) // "continue" loop
            disable continue;
        if (a == b) // "break" from loop
            disable break;
        statement1
        statement2
    end
end
```

## Delay

- 语句内时延
- 语句间时延
- 语句内时延期间：右值保持稳定不变，才可成功赋给左值

```verilog
sum = (a ^ b) ^ cin;
#4 t1 = a & cin;
```

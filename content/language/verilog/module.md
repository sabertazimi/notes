---
sidebar_position: 3
tags: [Language, Verilog, Module, Function, Task]
---

# Module

- Inout(Net) -> (Net)Module(Net) -> Inout(Net)
- Input(Net/Register) -> (Net)Module(Net/Register) -> Output(Net)

```verilog
module moduleName( In1, In2, Out1, Out2, InOut1);
    // 输入输出定义: 说明端口是输入还是输出
    input In1, In2;
    output Out1, Out2;
    inout InOut1;

    // 数据类型定义: 说明端口数据类型 - Net/Register
    wire In1, In2, Out1;
    wire InOut1;
    reg Out2;
    // Instantiation of lower level modules
    Design u_2(.(端口(信号1), .(端口2(信号2), .(端口3(信号3));

    // Functionality

    // 三种层次的描述: 逻辑层次(Gate Level), 数据流层次(Dataflow Level), 行为层次(Behavior Level)
    // and/or - gate level
    and and1( Out1, In1, In2);
    // assign - dataflow level
    assign #2 Out1 = In1 & In2;
    // always/initial - behavior level
    always @(*)
        begin
            Out2 = In1 & In2
        end

    // Timing specification

endmodule
```

## 外部端口

- 封装内部端口,装饰者模式
- 一个内部端口可与多个外部端口相连

```verilog
module scram_b (
    .data(arb),
    .control(ctrl),
    .mem_word(mem_blk),
    .addr(byte)
);

    input [0:3] arb;
    input ctrl;
    input [8:0] mem_blk;
    output [0:3] byte;

endmodule
```

## Function

- 不含时间/事件控制
- 至少 1 个输入
- 至多 1 个输出
- 只含行为模块
- 只含阻塞赋值语句

```verilog
function  [7: 0]  aligned_word;    // function declaration
    input  [7: 0]  word;
    begin
      aligned_word = word;
      if (aligned_word != 0)
        while (aligned_word[7] == 0) aligned_word = aligned_word << 1;
    end
  endfunction
```

```verilog
module arithmetic_unit (result_1, result_2, operand_1, operand_2,);
  output   [4: 0] result_1;
  output  [3: 0] result_2;
  input   [3: 0] operand_1, operand_2;
  assign result_1 = sum_of_operands (operand_1, operand_2);
  assign result_2 = larger_operand (operand_1, operand_2);

  function [4: 0] sum_of_operands(input [3:0] operand_1, operand_2);
    sum_of_operands = operand_1 + operand_2;
  endfunction

  function [3: 0] larger_operand(input [3:0] operand_1, operand_2);
    larger_operand = (operand_1 >= operand_2) ? operand_1 : operand_2;
  endfunction
endmodule
```

## Task

将测试流程分为多个任务:

- 初始化任务
- 模拟生成任务
- 自我检查任务

```verilog
module adder_task (c_out, sum, clk, reset, c_in, data_a, data_b);
  output reg [3: 0]  sum;
  output reg  c_out;
  input  [3: 0]  data_a, data_b;
  input   clk, reset, c_in;

  always @(posedge clk or posedge reset) begin
    if (reset) {c_out, sum} <= 0;
    else add_values (sum, c_out, data_a, data_b, c_in); // invoke task
  end
  task add_values; // task declaration
    output reg [3: 0]  SUM;
    output reg  C_OUT;
    input  [3: 0]  DATA_A, DATA_B;
    input   C_IN;
            {C_OUT, SUM} = DATA_A + (DATA_B + C_IN);
   endtask
endmodule
```

常用的 task 有: $display("fmt", ...), $monitor("fmt", ...), $time, $finish

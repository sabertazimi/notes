---
sidebar_position: 50
tags: [Language, Verilog, Best Practice]
---

# Best Practices

## 不可综合结构

- initial: 只用于 test bench
- events: Events 同步测试各个组件
- real: Real 数据类型不可综合
- time: Time 数据类型不可综合
- force/release
- assign(reg)/deassign(reg)
- fork join
- primitive: 只有门级的原语（primitives）可综合
- table: 用户自定义原语（UDP）及 table 不可综合
- `#1` 延迟只用于仿真，综合器直接忽略延迟

## 混合编程

- 内部变量用 assign 赋值
- 输出变量通过监听 内部变量 改变输出值

```verilog
    assign DT0 = ...;
    assign DT1 = ...;

    always @(DT0) begin
        AOut <= DT0;
    end
    always @(DT1) begin
        BOut <= DT1;
    end
```

## 上升沿/下降沿

```verilog
    always @(posedge A or negedge B) begin
        if (A) ...
        else if (!B) ...
        else ...
    end
```

## Parameter

- 只在定义的模块内部起作用

### Overload Method

```verilog
module data_path
#(parameter DATA_WIDTH = 8)
(
    input A,
    input [(DATA_WIDTH - 1): 0] B,
    output [(DATA_WIDTH - 1): 0] C
);

    ......

endmodule
```

```verilog
module data_path_tb
(
);
    data_path #(.DATA_WIDTH(16)) DUT (.A(A), .B(B), .C(C));

    ......

endmodule
```

### Constant Variable

```verilog
reset_value = {{(DATA_WIDTH/2){1'b0}}, {(DATA_WIDTH/2){1'b1}}};
```

### Test Bench

```verilog
always begin
    clk = 0;
    forever #DELAY clk = ~clk;
end
```

```verilog
reg clock;
integer no_of_clocks;

parameter CLOCK_PERIOD = 5;
parameter TIME = 50000;

initial no_of_clocks = 0;
initial clock = 1'b0;

always #(CLOCK_PERIOD/2.0) clock = ~clock;

always @(posedge clock)
    no_of_clocks = no_of_clocks +1 ;

initial begin
    #TIME;
    $display("End of simulation time is %d ,
      total number of clocks seen is %d expected is %d",$time,no_of_clocks,($time/5));
    $finish;
end
```

## References

- Verilog HDL [guide](https://hom-wang.gitbooks.io/verilog-hdl/content/Chapter_07.html).

---
sidebar_position: 21
tags: [Language, Verilog, SystemVerilog]
---

# SystemVerilog

## Enum

```verilog
typedef enum logic [2:0] {
  RED, GREEN, BLUE, CYAN, MAGENTA, YELLOW
} color_t;

color_t my_color = GREEN;
initial $display("The color is %s", my_color.name());
```

## Struct and Union

```verilog
typedef struct packed {
  bit [10:0]  expo;
  bit         sign;
  bit [51:0]  man;
} FP;

FP zero = 64'b0;
```

## Procedural Block

- always_comb: 用于组合逻辑电路（相当于 Verilog 中对所有输入变量电平敏感的 always，但 always_comb 无需手动列出所有输入变量，系统会自动识别）
- always_ff: 用于触发器及相关的时序逻辑电路（相当于 Verilog 中对某个或某几个信号有效跳变沿敏感、并带有信号储存特性的 always）
- always_latch: 用于锁存器级相关的时序逻辑电路（相当于 Verilog 中对某个或某几个信号电平敏感、并带有信号储存特性的的 always）

```verilog
always_comb begin
  tmp = b * b - 4 * a * c;
  no_root = (tmp < 0);
end

always_ff @(posedge clk)
  count <= count + 1;

always_latch
  if (en) q <= d;
```

## Interface

```verilog
interface interfaceName;
  logic a;
  logic b;
  modport in (input a, output b);
  modport out (input b, output a);
endinterface

module top;
  interfaceName i ();
  u_a m1 (.i1(i));
  u_b m2 (.i2(i));
endmodule

module u_a (interfaceName.in i1);
endmodule

module u_b (interfaceName.out i2);
endmodule
```

## Testing

```verilog
module top;
  integer num_packets = $random;
  reg A, B, C, clk, reset_n;
  wire D;
  register_logic dut(A, B, C, clk, reset_n, D);

  // generate clock
  // ...

  initial begin
    run();
  end

  task run();
    reset_n  = 1;
    #20 reset_n = 0;
    @(posedge clk) reset_n <= #1 1;
    repeat (num_packets) begin
      A = $random; B = $random; C = $random;
      @(posedge clk);
      $display(A, B, C, D);
    end
    $finish;
  endtask
endmodule
```

```verilog
class Packet;
  string name;
  rand bit[3:0] sa, da;
  rand reg A, B, C;

  function void display(result);
    $display(A, B, C, result);
  endfunction
endclass: Packet

// inheritance
class Packet_da_3 extends Packet;
  constraint da_3 {
    da == 3;
  }

  function void display(result);
    super.display(result);
    $display(sa, da);
  endfunction
endclass: Packet_da_3

class Generator;
  Packet pkt;
  Channel out_chan;
  int num_packets;

  function void gen();
    pkt = new();
    pkt.randomize();
    out_chan.put(pkt);
  endfunction

  task run();
    while (num_packets-- != 0)
      gen();
  endtask
endclass

class Driver;
  Channel in_chan;

  task send();
    in_chan.get(pkt);
    top.A = pkt.A;
    top.B = pkt.B;
    top.C = pkt.C;
    @(posedge top.clk);
  endtask

  task run();
    forever send();
  endtask
endclass

module top;
  initial begin
    build();
    run();
  end

  task build();
    Config cfg = new();
    Channel chan = new();
    Generator gen = new();
    Driver drv = new();
    gen.out_chan = chan;
    drv.in_chan = chan;

    cfg.randomize() with { num_packets > 1500; }
    gen.num_packets = cfg.num_packets;
  endtask

  task run();
    fork
      gen.run();
      drv.run();
    join
    $finish;
  endtask
endmodule
```

---
sidebar_position: 10
tags: [Language, Verilog, Gate]
---

# Gate

- `and`
- `nand`: 与非
- `or`
- `nor`: 或非
- `xor`: 异或
- `xnor`: 同或

## Use

- 同一模块中, 实例名不能与线网名相同

```verilog
and (w1, In1, In2);        // w1 = Int and In2
or or1(w2, w1, In2);      // w2 = w1 or In2
xor xor(Out, w1, w2);    // Out = w1 xor w2
```

- 实例数组

```verilog
wire [3:0] irq, ctrl, sense;

/*
 * =>
 * nand
 *      u8nand3 (irq[3], ctrl[3], sense[3]);
 *      u8nand2 (irq[2], ctrl[2], sense[2]);
 *      u8nand1 (irq[1], ctrl[1], sense[1]);
 *      u8nand0 (irq[0], ctrl[0], sense[0]);
 */
nand u8nand [3:0] (irq, ctrl, sense);
```

```verilog
parameter NUM_BITS = 4;
wire [NUM_BITS - 1 : 0] gated_d, din;
wire bypass;

and #(1, 2) u0and [NUM_BITS - 1: 0] (gated_d, din, bypass);
```

## Self-Defined

- 可以有一个/多个输入
- 只能有一个输出
- 第一个端口必须是输出端口
- `-` 表示 值"无变化"

```verilog
primitive XOR2 (D_OUT, X1, X2);
    input X1, X2;
    output D_OUT;

    table // X1 X2 : D_OUT
        0 0 : 0;
        0 1 : 1;
        1 0 : 1;
        1 1 : 0;
    endtable
endprimitive
```

## 结构建模

### Generate

```verilog
generate
    for (gv_i = 0; gv_i < SIZE; gv_i = gv_i + 1)
        begin: blk
            xor uxor (y[gv_i], a[gv_i], b[gv_i]);
        end
endgenerate
// =>
// module.blk[0].uxor
// module.blk[1].uxor
// module.blk[2].uxor
// ...
```

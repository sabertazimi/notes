---
sidebar_position: 32
tags: [Language, Verilog, Component]
---

# Components

## Binary Multiplier

```verilog
   1100 (the multiplicand)
x  1011 (the multiplier)
   ----
   0000 (initial partial product, start with 0000)
   1100 (1st multiplier bit is 1, so add the multiplicand)
   ----
   1100 (sum)
   ----
   01100 (shift sum one position to the right)
   1100 (2nd multiplier bit is 1, so add multiplicand again)
   ----
  100100 (sum, with a carry generated on the left)
   ----
   100100 (shift sum once to the right, including carry)
   0100100 (3rd multiplier bit is 0, so skip add, shift once)
   ----
   1100 (4th multiplier bit is 1, so add multiplicand again)
   ----
  10000100 (sum, with a carry generated on the left)
   10000100 (shift sum once to the right, including carry)
```

## Multi-Hz

```verilog
/*
 * 利用计数器实现任意分频
 */
always @(posedge f_clk) begin

    //设定频率控制字p
    if (i == p) begin
        i=0;
        f_out=~f_out;
    end
    else begin
        i=i+1;
    end
end
```

## Clock

```verilog
/**
 * @module tick_divider
 * @author sabertazimi
 * @email sabertazimi@gmail.com
 * @brief simple clock divider
 * @param DATA_WIDTH data width
 * @input clk_src clock signal
 * @output clk_group divided clock signals
 */
module tick_divider
#(parameter DATA_WIDTH = 32)
(
    input clk_src,
    output reg [(DATA_WIDTH-1): 0] clk_group
);

    initial begin
        clk_group <= {(DATA_WIDTH){1'b0}};
    end

    always @(posedge clk_src) begin
        clk_group <= clk_group + 1;
    end
endmodule
```

## Signal

```verilog
/**
 * @module integer_to_segment
 * @author sabertazimi
 * @email sabertazimi@gmail.com
 * @brief raw data to segment encoder
 * @param DATA_WIDTH data width
 * @input data raw decimal data (4 bit)
 * @output seg_data bit data for cNodes
 */
module integer_to_segment
(
    input [3:0] int_data,
    output reg [7:0] seg_data
);

    always @(int_data) begin
        case (int_data)
            4'b0000:    seg_data <= 8'b11000000;    // 0
            4'b0001:    seg_data <= 8'b11111001;    // 1
            4'b0010:    seg_data <= 8'b10100100;    // 2
            4'b0011:    seg_data <= 8'b10110000;    // 3
            4'b0100:    seg_data <= 8'b10011001;    // 4
            4'b0101:    seg_data <= 8'b10010010;    // 5
            4'b0110:    seg_data <= 8'b10000010;    // 6
            4'b0111:    seg_data <= 8'b11111000;    // 7
            4'b1000:    seg_data <= 8'b10000000;    // 8
            4'b1001:    seg_data <= 8'b10010000;    // 9
            4'b1010:    seg_data <= 8'b10001000;    // a
            4'b1011:    seg_data <= 8'b10000011;    // b
            4'b1100:    seg_data <= 8'b11000110;    // c
            4'b1101:    seg_data <= 8'b10100001;    // d
            4'b1110:    seg_data <= 8'b10000110;    // e
            4'b1111:    seg_data <= 8'b10001110;    // f
            default:    seg_data <= 8'b11111111;    // off
        endcase
    end
endmodule
```

```verilog
/**
 * @module data_to_segment
 * @author sabertazimi
 * @email sabertazimi@gmail.com
 * @brief raw data to segment encoder
 * @param DATA_WIDTH data width
 * @input data raw decimal data
 * @output seg_data bit data for cNodes
 */
module data_to_segment
#(parameter DATA_WIDTH = 32)
(
    input [(DATA_WIDTH-1):0] data,
    output [(DATA_WIDTH*2)-1:0] seg_data
);

    integer_to_segment trans1 (
        .int_data(data[3:0]),
        .seg_data(seg_data[7:0])
    );

    integer_to_segment trans2 (
        .int_data(data[7:4]),
        .seg_data(seg_data[15:8])
    );

    integer_to_segment trans3 (
        .int_data(data[11:8]),
        .seg_data(seg_data[23:16])
    );

    integer_to_segment trans4 (
        .int_data(data[15:12]),
        .seg_data(seg_data[31:24])
    );

    integer_to_segment trans5 (
        .int_data(data[19:16]),
        .seg_data(seg_data[39:32])
    );

    integer_to_segment trans6 (
        .int_data(data[23:20]),
        .seg_data(seg_data[47:40])
    );

    integer_to_segment trans7 (
        .int_data(data[27:24]),
        .seg_data(seg_data[55:48])
    );

    integer_to_segment trans8 (
        .int_data(data[31:28]),
        .seg_data(seg_data[63:56])
    );

endmodule
```

```verilog
/**
 * @module led_unit
 * @author sabertazimi
 * @email sabertazimi@gmail.com
 * @brief led display module (bind to aNodes and cNodes in FPGA)
 * @param DATA_WIDTH data width
 * @input clk_src clock signal (light different led on in round turn)
 * @input led_data raw decimal data
 * @output aNodes determine which led light on at now
 * @output cNodes determine how led light on (number)
 */
module led_unit
#(parameter DATA_WIDTH = 32)
(
    input clk_src,
    input [(DATA_WIDTH-1):0] led_data,
    output reg [7:0] aNodes,
    output reg [7:0] cNodes
);

    reg [2:0] count; // 2^3 = 8
    wire [(DATA_WIDTH*2)-1:0] seg_data;

    initial begin
        count <= 0;
        aNodes <= 0;
        cNodes <= 0;
    end

    data_to_segment #(
        .DATA_WIDTH(DATA_WIDTH)
    ) data_to_segment (
        .data(led_data),
        .seg_data(seg_data)
    );

    always @(posedge clk_src) begin
        count = count + 1;
    end

    always @(count) begin
        case (count)
            3'b000: begin
            aNodes = 8'b11111110;
            cNodes = seg_data[7:0];
        end
            3'b001: begin
            aNodes = 8'b11111101;
            cNodes = seg_data[15:8];
        end
            3'b010:  begin
            aNodes = 8'b11111011;
            cNodes = seg_data[23:16];
        end
            3'b011: begin
            aNodes = 8'b11110111;
            cNodes = seg_data[31:24];
        end
            3'b100: begin
            aNodes = 8'b11101111;
            cNodes = seg_data[39:32];
        end
            3'b101: begin
            aNodes = 8'b11011111;
            cNodes = seg_data[47:40];
        end
            3'b110: begin
            aNodes = 8'b10111111;
            cNodes = seg_data[55:48];
        end
            3'b111: begin
            aNodes = 8'b01111111;
            cNodes = seg_data[63:56];
        end
            default: begin
            aNodes = 8'b11111110;
            cNodes = 8'b11111111;
        end
        endcase
    end

endmodule
```

## ALU

```verilog
/**
 * @module counter
 * @author sabertazimi
 * @email sabertazimi@gmail.com
 * @brief up counter
 * @param DATA_WIDTH data width
 * @param STEP counting step
 * @input clk clock signal
 * @input rst reset signal
 * @output en enable signal
 * @output count counting value
 */
module counter
#(parameter DATA_WIDTH = 1, STEP = 1)
(
    input clk,
    input rst,
    input en,
    output reg [(DATA_WIDTH-1):0] count
);

    always @(posedge clk) begin
        if (rst) begin
            count <= 0 ;
        end else if (en) begin
            count <= count + 1;
        end else begin
            count <= count;
        end
    end

endmodule // counter
```

```verilog
/**
 * @module latch_counter
 * @author sabertazimi
 * @email sabertazimi@gmail.com
 * @brief latch counter (latching when reaching max value)
 * @input clk clock signal
 * @input rst reset signal
 * @output en enable signal
 * @output count counting value
 */
module latch_counter
(
    input clk,
    input rst,
    input en,
    output reg count
);

    initial begin
        count <= 0;
    end

    always @(posedge clk) begin
        if (rst) begin
            count <= 0 ;
        end else if (en) begin
            if (count != 1) begin
                count <= count + 1;
            end else begin
                count <= count;
            end
        end else begin
            count <= count;
        end
    end

endmodule // latch_counter
```

```verilog
/**
 * @module alu_flags
 * @author sabertazimi
 * @email sabertazimi@gmail.com
 * @brief get flags after alu calculation
 * @param DATA_WIDTH data width
 * @input srcA A port data
 * @input srcB B port data
 * @input aluOP operation code
 * @output zero equal flag
 * @output of signed overflow flag
 * @output uof unsigned overflow flag
 */
module alu_flags
#(parameter DATA_WIDTH = 32)
(
    input [DATA_WIDTH-1:0] srcA,
    input [DATA_WIDTH-1:0] srcB,
    input [3:0] aluOP,
    output zero,
    output of,
    output uof
);

    wire [DATA_WIDTH-1:0] sum, diff;
    wire carry1, carry2;

    assign {carry1, sum} = srcA + srcB;    // awesome tip
    assign {carry2, diff} = srcA - srcB;    // awesome tip

    assign zero = (srcA == srcB);
    assign of = (aluOP == 4'd5) ? (
      (srcA[DATA_WIDTH-1] & srcB[DATA_WIDTH-1] & ~sum[DATA_WIDTH-1])
      | (~srcA[DATA_WIDTH-1] & ~srcB[DATA_WIDTH-1] & sum[DATA_WIDTH-1]))
                : (aluOP == 4'd6) ? (
      (srcA[DATA_WIDTH-1] & ~srcB[DATA_WIDTH-1] & ~diff[DATA_WIDTH-1])
      | (~srcA[DATA_WIDTH-1] & srcB[DATA_WIDTH-1] & diff[DATA_WIDTH-1]))
                : 0;
    assign uof = (aluOP == 4'd5) ? (carry1)
                : (aluOP == 4'd6) ? (carry2)
                : 0;

endmodule // alu_flags
```

```verilog
/**
 * @module alu
 * @author sabertazimi
 * @email sabertazimi@gmail.com
 * @param DATA_WIDTH data width
 * @input srcA A port data
 * @input srcB B port data
 * @input aluOP operation code
 * @output aluOut calculation result
 * @output zero equal flag
 * @output of signed overflow flag
 * @output uof unsigned overflow flag
 */
module alu
#(parameter DATA_WIDTH = 32)
(
    input [DATA_WIDTH-1:0] srcA,
    input [DATA_WIDTH-1:0] srcB,
    input [3:0] aluOP,
    output reg [DATA_WIDTH-1:0] aluOut,
    output zero,
    output of,
    output uof
);

    wire signed [DATA_WIDTH-1:0] signed_srcA;
    wire signed [DATA_WIDTH-1:0] signed_srcB;

    assign signed_srcA = $signed(srcA);
    assign signed_srcB = $signed(srcB);

    always @ ( * ) begin
        case (aluOP)
            4'd0: aluOut <= srcA << srcB;
            4'd1: aluOut <= signed_srcA >>> srcB;
            4'd2: aluOut <= srcA >> srcB;
            4'd3: aluOut <= srcA * srcB;
            4'd4: aluOut <= srcA / srcB;
            4'd5: aluOut <= srcA + srcB;  // awesome tip
            4'd6: aluOut <= srcA - srcB;
            4'd7: aluOut <= srcA & srcB;
            4'd8: aluOut <= srcA | srcB;
            4'd9: aluOut <= srcA ^ srcB;
            4'd10: aluOut <= ~(srcA | srcB);
            4'd11: aluOut <= (signed_srcA < signed_srcB) ? 1 : 0;
            4'd12: aluOut <= (srcA < srcB) ? 1 : 0;
            default: aluOut <= 0;
        endcase
    end

    alu_flags #(
        .DATA_WIDTH(DATA_WIDTH)
    ) FLAGS  (
        .srcA(srcA),
        .srcB(srcB),
        .aluOP(aluOP),
        .zero(zero),
        .of(of),
        .uof(uof)
    );

endmodule // alu
```

## Memory

- 其中数据文件中地址必须在系统任务中定义的范围内，系统任务中定义的地址必须在存储器定义的地址范围内
- 优先考虑数据文件中的地址>系统任务中定义的起始地址和结束地址>存储器定义的起始地址和结束地址

```verilog
/**
 * @module register
 * @author sabertazimi
 * @email sabertazimi@gmail.com
 * @brief D flip flop
 * @param DATA_WIDTH data width
 * @input clk clock signal
 * @input rst reset signal
 * @input en enable signal
 * @input din data in
 * @output dout data out
 */
module register
#(parameter DATA_WIDTH = 32)
(
    input clk,
    input rst,
    input en,
    input [DATA_WIDTH-1:0] din,
    output reg [DATA_WIDTH-1:0] dout
);

    always @ (posedge clk) begin
        if (rst) begin
            dout <= 0;      // reset
        end else if (en) begin
            dout <= din;    // update
        end else begin
            dout <= dout;   // hold
        end
    end

endmodule // register
```

```verilog
/**
 * @module regFile
 * @author sabertazimi
 * @email sabertazimi@gmail.com
 * @brief register files for MIPS CPU, contains 32 D flip-flop registers
 * @param DATA_WIDTH data width
 * @input clk clock signal
 * @input we write enable signal
 * @input raddrA read address (No.register) for A out port
 * @input raddrB read address (No.register) for B out port
 * @input waddr write address (No.register) for wdata (in port)
 * @input wdata data to write into regFile
 * @output regA A port output
 * @output regB B port output
 */
module regFile
#(parameter DATA_WIDTH = 32)
(
    input clk,
    input rst,
    input we,
    input [4:0] raddrA,
    input [4:0] raddrB,
    input [4:0] waddr,
    input [DATA_WIDTH-1:0] wdata,
    output [DATA_WIDTH-1:0] regA,
    output [DATA_WIDTH-1:0] regB,
    output [DATA_WIDTH-1:0] v0_data,
    output [DATA_WIDTH-1:0] a0_data
);

`include "defines.vh"

    reg [4:0] i;

    ///< three ported regFile contains 32 registers
    reg [DATA_WIDTH-1:0] regFile [0:31];

    always @ (posedge clk) begin
        if (rst) begin
            for (i = 0; i < 31; i = i + 1)
                begin
                    regFile[i] <= 0;
                end
        end else if (we && waddr != 0) begin
            regFile[waddr] <= wdata;
        end
    end

    assign regA = (we && waddr == raddrA) ? wdata
                : (raddrA != 0) ? regFile[raddrA]
                : 0;
    assign regB = (we && waddr == raddrB) ? wdata
                : (raddrB != 0) ? regFile[raddrB]
                : 0;
    assign v0_data = regFile[`V0];
    assign a0_data = regFile[`A0];

endmodule // regFile
```

```verilog
/**
 * @module imem
 * @author sabertazimi
 * @email sabertazimi@gmail.com
 * @brief instruction cache memory (ROM)
 * @param DATA_WIDTH data width
 * @param BUS_WIDTH bus width
 * @param CODE_FILE MIPS assembly hexadecimal code file
 * @input addr memory address
 * @output rdata instruction read out from memory
 */
module imem
#(parameter DATA_WIDTH = 32, BUS_WIDTH = 10, CODE_FILE= "mips/benchmark.hex")
(
    input [BUS_WIDTH-1:0] addr,
    output [DATA_WIDTH-1:0] rdata
);

    reg [DATA_WIDTH-1:0] ROM [0:(2**BUS_WIDTH)-1];

    initial begin
        $readmemh(CODE_FILE, ROM, 0, (2**BUS_WIDTH)-1);
    end

    assign rdata = ROM[addr];

endmodule // imem
```

```verilog
/**
 * @module dmem
 * @author sabertazimi
 * @email sabertazimi@gmail.com
 * @brief data cache memory (RAM)
 * @param DATA_WIDTH data width
 * @param BUS_WIDTH bus width
 * @input clk clock signal
 * @input re read enable signal
 * @input we write enable signal
 * @input addr memory address
 * @input wdata data write into memory
 * @output rdata data read out from memory
 */
module dmem
#(parameter DATA_WIDTH = 32, BUS_WIDTH = 10)
(
    input clk,
    input re,
    input we,
    input [BUS_WIDTH-1:0] addr,
    input [DATA_WIDTH-1:0] wdata,
    input [4:0] switch_addr,
    output [DATA_WIDTH-1:0] rdata,
    output [DATA_WIDTH-1:0] led_data
);

    reg [DATA_WIDTH-1:0] RAM [0:(2**BUS_WIDTH)-1];

    always @ (posedge clk) begin
        if (we) begin
            RAM[addr] <= wdata;
        end
    end

    assign rdata = re ? RAM[addr] : {(DATA_WIDTH-1){1'bx}};
    assign led_data = RAM[switch_addr];

endmodule // dmem
```

---
sidebar_position: 1
tags: [Language, Verilog, FPGA]
---

# Workflow

## Create Project

- `.v` (sources)
- `.xdc` (constraints)

## RTL Analysis

Schematic

## Simulate Design

- `_tb.v`: test bench
- simulation options: 500ns
- Scopes -> dut -> swt/led
- Schematic

## Synthesize Design

Schematic

## Implement Design

Schematic

## Post-Implementation Timing Simulate Design

## Generate Bit Stream

## Testing and Verification

low-level (circuit) simulation is much slower than high-level (C, HDL) simulation:

- check only functionality at high level (C, HDL)
- check only timing, power at low level (circuit)

```verilog
module testBench();
  reg         clk, reset;           // clock and reset are internal
  reg         a, b, c, yExpected;   // values from testVectors
  wire        y;                    // output of circuit
  reg  [31:0] vectorNum, errors;    // bookkeeping variables
  reg  [3:0]  testVectors[10000:0]; // array of testVectors

  // instantiate device under test
  sillyFunction dut(.a(a), .b(b), .c(c), .y(y) );

  // generate clock
  always     // no sensitivity list, so it always executes
    begin
      clk = 1; #5; clk = 0; #5;     // 10ns period
    end

  // at start of test, load vectors and pulse reset
  initial   // Only executes once
  begin
    $readmemb("example.tv", testVectors); // Read vectors: e.g. 000_0 001_1 ... xxx_x
    vectorNum = 0; errors = 0;            // Initialize
    reset = 1; #27; reset = 0;            // Apply reset wait
  end

  // Note: $readmemh reads testVector files written in
  // hexadecimal
  // apply test vectors on rising edge of clk
  always @(posedge clk)
  begin
    #1; {a, b, c, yExpected} = testVectors[vectorNum];
  end

  always @(negedge clk)
  begin
    if (~reset) // don't test during reset
    begin
      if (y !== yExpected)
      begin
        $display("Error: inputs = %b", {a, b, c});
        $display("  outputs = %b (%b exp)",y,yExpected);
        errors = errors + 1;
      end

      // increment array index and read next testVector
      vectorNum = vectorNum + 1;

      if (testVectors[vectorNum] === 4'bx)
      begin
        $display("%d tests completed with %d errors", vectorNum, errors);
        $finish;                 // End simulation
      end
    end
  end
endmodule
```

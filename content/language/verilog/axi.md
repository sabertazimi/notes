---
sidebar_position: 31
tags: [Language, Verilog, AXI]
---

# AXI Protocol

Advanced eXtensible Interface Protocol:

- handshake protocol: ready-valid protocol

## Channels

### Read Address

- arburst: burst type
- araddr: start address
- arlen: (# of transfers) - 1
- arsize: bytes/transfer
- arready (memory to host)
- arvalid

### Read Data

- rdata: data
- rresp: response (failure check)
- rlast: flag for last piece of data
- rready (host to memory)
- rvalid

### Write Address

- awburst: burst type
- awaddr: start address
- awlen: (# of transfers) - 1
- awsize: bytes/transfer
- awready (memory to host)
- awvalid

### Write Data

- wdata: data
- wstrb: write strobe -> write mask (1 bit mask for 1 byte data)
- wlast: flag for last piece of data
- wready (memory to host)
- wvalid

### Write Response

- bresp: response (failure check)
- bready (host to memory)
- bvalid

## Burst

| AxBURST[1:0] | Burst Type |
| -----------: | :--------- |
|         0b00 | FIXED      |
|         0b01 | INCR       |
|         0b10 | WRAP       |
|         0b11 | Reserved   |

burst length = AxLEN[7:0] + 1 (up to 256 transfers in each burst)

| AxSIZE[2:0] | Bytes in Transfer |
| ----------: | ----------------: |
|       0b000 |                 1 |
|       0b001 |                 2 |
|       0b010 |                 4 |
|       0b011 |                 8 |
|       0b100 |                16 |
|       0b101 |                32 |
|       0b110 |                64 |
|       0b111 |               128 |

### Read

![Read Burst Example](./figures/axi-read-burst.png 'Read Burst Example')

### Write

![Write Burst Example](./figures/axi-write-burst.png 'Write Burst Example')

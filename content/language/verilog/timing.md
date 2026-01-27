---
sidebar_position: 2
tags: [Language, Verilog, Timing]
---

# Timing

## Combination Circuit

- contamination delay (`t_cd`): minimum path in circuits, outputs start to change
- propagation delay (`t_pd`): maximum path in circuits, outputs complete change
- (delay) heavy dependence on **voltage** and **temperature**

## Sequential Circuit

minimize clock skew time:
requires intelligent **clock network** across a chip,
making clock arrives at all locations at roughly the same time.

```verilog
T_clock >= T_pcq + T_pd + (T_setup + T_skew)
T_ccq + T_cd > (T_hold + T_skew)
```

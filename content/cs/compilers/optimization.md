---
sidebar_position: 12
tags: [CS, Compiler, Optimization]
---

# Optimization

## Structure

### Activation Record and Frame

AR:

用于管理过程活性(procedure activation)的信息:

- result: 置于记录的顶层, 便于访问此结果
- argument
- return address
- control link: 指向调用者(上级)

### 全局变量

不存于 AR 中, 存于静态数据段

### 堆区

new/malloc 得到的变量/对象不存于 AR 中, 存于堆区

## Types

- Local optimizations
- Global optimizations
- Inter-procedural optimizations

## Local

- 常量折叠优化: 所有代入常量的地方全部代入常量 `1 + 2 => 3`
- 代数化简优化: `a=1*b => a=b` `2*a=>a<<1` (all tips from CSAPP)
- 复制传播(copy propagation)优化: 利用前面计算出来的结果, 直接替换后面所有出现在右边的已计算左式(寄存器)

## Global

### Dead Code

- CFG 中(控制流分析) 死代码块删除优化

### Constant Propagation

CFG 中(数据流分析-可达定义分析) 常量传播(constant propagation)优化:

- **forwards analysis**
- C(stm, x, in) = value of x before stm ; C(stm, x, out) = value of x after stm
- bottom < c < top => C(stm, x, in) = `least_upper_bound{ C(prev_stm_i, x, out) }`:
  - C(prev_stm, x, out) = top(nondeterministic) => C(stm, x, in) = top
  - C(prev_stm1, x, out) != C(prev_stm2, x, out) => C(stm, x, in) = top
  - C(prev_stm_i, x, out) = c/bottom(dead code) => C(stm, x, in) = c
- C(stm, x, in) = bottom => C(stm, x, out) = bottom
- C(x := c, x, out) = c
- C(x := f(), x, out) = top
- init: set entry to C = top, set anywhere else to C = bottom

### Liveness Analysis

CFG 中 数据流分析-活性分析(liveness analysis), 可用于复制传播优化与寄存器分配优化:

- backwards analysis
- L(stm, x, out) = `V { L(next_stm, x, in) }`
- L(... := f(x), x, in) = true
- L(x := e, x, in) = false
- L(none x, x, in) = L(none x, x, out)
- init: L(...) = false

### 寄存器分配

Register Allocation and Graph Coloring:

- 当 t1 与 t2 同时具有活性时, 不可共享寄存器; 反之, t1 与 t2 不同时具有活性, 可以共享寄存器
- 当 t1 与 t2 同时具有活性时, 添加一条边连接 t1 与 t2, 构建 register interference graph(RIG)
- colors number = registers number, k-colorable problem

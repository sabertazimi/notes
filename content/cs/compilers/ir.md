---
sidebar_position: 11
tags: [CS, Compiler, IR, Optimization]
---

# Intermediate Representation

IR:

- 树与有向无环图(DAG)
- 三地址码(3-address code)
- 控制流图(CFG)
- 静态单赋值形式(SSA)
- 连续传递风格(CPS)

## 三地址码

- 原子表达式
- 简单控制流 cjmp/jmp
- 抽象的机器代码(伪代码)

## Block

- block_t: `{ label_t; stm_list; jmp_t; }`
- 扫描三地址码, 生成 blocks
- 图论算法:结点为 blocks, 边为跳转边

死基本块删除优化：删除遍历不到的语句块

## 数据流分析与程序重写

- 根据数据流分析得到的信息, 对三地址码/控制流图进行重写
- 后端的每一个阶段都可进行数据流分析

> 常量传播优化: 将赋值语句右端变量直接替换为常量, 减少访存

### 到达定义分析

分析变量的哪些定义点可以到达变量的使用点处, 若可达定义唯一则可进行常量传播优化:

- in set = prior out set
- out set = self set + in set - kill set(重复定义点)

### 活性分析

- 寄存器分配优化 活跃区间不相交的变量可共用一个寄存器
- 并行优化 使用区间并行的计算可并行执行

##GCC/GDB/Kit
### GCC
- `gcc -01/-02/-03 source.c`  —— 编译优化等级
- `gcc -S source.c` —— 编译成汇编代码(文本文件)
- `gcc -o source.c` —— 编译成Object代码(二进制文件)

### GDB 
- `si`              单指令执行
- `x/i $pc`     执行si命令时打印汇编代码
- `disas`        显示汇编代码
- `bt`             查看函数堆栈
- `step1`       下一条汇编指令
- `info register`
- `x /numsizeformat $pc/rsp/rbp`  
### Objdump

## 位运算
- `^`：无进位
- `p && *p++` : NULL检查

编码：2^n  e.g 一副牌的编码 2位牌色位+4位数字位

## Address
### mov
movX  src dest  #X:b/w/l/q （1/2/4/8字节）
### address
- D(Rb, Ri, S) —— MEM[ Reg[Rb] + S * Reg[Ri] + D]
- leal命令
  - `leal D(Rb, Ri, S)   dest`
        - 将地址模式表达式的址存入dest
        - 作用
            - 快速给指针赋值`p = &x[i]` 即`Mem[Reg[x] + i * size]->(x, size, I)`
            - 快速计算二次多项式 `x + i * k`


## 常用命令
### 算术命令
### 转移命令
- Flags
    - CF：Carry Flag(unsigned)    进位标志——当有进位时设为1
    - OF：OverFolw Flag(signed) 溢出标志——当补码溢出时设为1
    - SF：Sign Flag(signed)           符号标志——当t<0时设为1
    - ZF：Zero Flag                        零标志——当t==0时设为1
- cmpX命令

    `cmpl Src2, Src1`
      根据Src1 – Src2(subl Src2, Src1)的结果设置标志寄存器的值
- testX命令

    `testl Src2, Src1`
      根据Src1 & Src2(andl Src2, Src1)的结果设置标志寄存器的值

    e.g testl %eax, %eax 实现符号函数
- 根据标志寄存器运算值，将值存入dest
    `setX dest`

## Control Flow
### if
`cmovC src, dest`(C表示Conditional——e/ne等)
    当条件成立时，src->dest  src与dest可分别用于存放两种情况的值

### loop
#### do/while
#### while/do
#### for

### switch(**Jump Table**)

`break; → leave`
              `ret`
- fallThrough(without break)
- mixing(连冒号)
- missing case
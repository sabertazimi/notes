---
tags: [Language, Assembly]
---

# Assembly

## Execution Model

Load-ALU-Store 模式 - 读入寄存器，算术逻辑单元运算，回写至内存

## Bitwise

- `^`：无进位
- `p && *p++` : NULL 检查

编码：2^n e.g. 一副牌的编码 2 位牌色位+4 位数字位

## Address

- `movX src dest`: X 可为 b/w/l/q （1/2/4/8 字节）
- `D(Rb, Ri, S)`: `MEM[ Reg[Rb] + S * Reg[Ri] + D]`.
- `leal` 命令:
  - `leal D(Rb, Ri, S) dest` - 将地址模式表达式的址存入 dest.
    作用为快速给指针赋值`p = &x[i]` 即`Mem[Reg[x] + i * size]->(x, size, I)`,
    快速计算二次多项式 `x + i * k`.

## Read

内存数据重复读入寄存器 - 使得汇编代码与上下文无关,减少 BUG 产生可能性

```cpp
R1 = MEM[SP + 8]
……
R1 = MEM[SP + 8]
……
R1 = MEM[SP + 8]
……
```

## Jump

Flags

- CF：Carry Flag(unsigned) 进位标志——当有进位时设为 1
- OF：OverFlow Flag(signed) 溢出标志——当补码溢出时设为 1
- SF：Sign Flag(signed) 符号标志——当 `t < 0` 时设为 1
- ZF：Zero Flag 零标志——当 `t == 0` 时设为 1

cmpX 命令: `cmpl Src2, Src1`,
根据 Src1 – Src2(subl Src2, Src1)的结果设置标志寄存器的值

testX 命令: `testl Src2, Src1`,
根据 Src1 & Src2(andl Src2, Src1)的结果设置标志寄存器的值

e.g. testl %eax, %eax 实现符号函数

setX 命令: `setX dest`,
根据标志寄存器运算值，将值存入 dest

## If

`cmovC src, dest`(C 表示 Conditional——e/ne 等)
当条件成立时，src->dest src 与 dest 可分别用于存放两种情况的值

## Switch

**Jump Table**:

`break; → leave`
`ret`

- fallThrough(without break)
- mixing(连冒号)
- missing case

## Stack Frame

```cpp
# 准备阶段
# Caller-Save: %eax %ecx %edx
# Callee-Save: %ebx %esi %edi
# 传参顺序: rdi, dsi, rdx, rcx, r8, r9, stack

pushl %ebp
movl %esp, %ebp
pushl %ebx

# 结束阶段

movl -4(%ebp), %ebx
movl %ebp, %esp
popl %ebp
ret
```

## Array

```cpp
int get_sea_digit(int index, int dig) {
    return sea[index][dig];
}
```

```cpp
# 访问二维数组元素
# %ecx = dig
# %eax = index
leal 0(,%ecx,4), %edx        # 4 * dig
leal (%eax,%eax,4), %eax     # 5 * index
movl sea(%edx,%eax,4), %eax  # * (sea + 4 * dig + 20 * index)
```

## Gcc

- `gcc -01/-02/-03 source.c` —— 编译优化等级
- `gcc -S source.c` —— 编译成汇编代码(文本文件)
- `gcc -o source.c` —— 编译成 Object 代码(二进制文件)

## Gdb

- `si` 单指令执行
- `x/i $pc` 执行 si 命令时打印汇编代码
- `disas` 显示汇编代码
- `bt` 查看函数堆栈
- `step1` 下一条汇编指令
- `info register`
- `x /numsizeformat $pc/rsp/rbp`

## Masm

```bash
masm /Zi/Zd src dist
masm /I(path)           // 引用 标准库/宏
masm /I..\include
```

## Link

```bash
link /DEBUG src
```

## Turbo Debugger

- `tab` 切换分区
- `alt` 功能键
- `ctrl` 子功能键
- `F2`: break
- `F7`: step into
- `F8`: step over

### Alt

- `Alt+F5` : 临时跳转至 dos 界面
- `Alt+Enter`: 全屏
- `Alt+X` : 退出

### 代码区

- `<C-A>` Assemble: 临时修改汇编指令
- `<C-C>` Caller : 从子程序处跳回至 Caller 处
- `<C-F>` Follow : 查看 CALL/JMP/INT 跳转至的子程序处
- `<C-O>` Origin : 跳转至 cs:ip 指向指令处

### 数据区

- `<C-C>` Change: 临时修改数据
- `<C-D>` Display: 选择显示格式 e.g. Byte/Word/Long/Comp/Float/Real/Double/Extended
- `<C-G>` Goto: 跳转至指定地址区

## Make

- `$<`: 源文件名
- `$?`: 所有源文件名
- `$@`: 全路径的目标文件
- `$*`: 除去扩展名的全路径的目标文件

```makefile
EXE = $(NAME).exe
OBJS = $(NAME).obj
SRCS = $(NAME).asm
SIMPLE_MODE = ;

LINK_FLAG = /subsystem:windows
ML_FLAG = /c/coff/Zi
MASM_FLAG = /Zi/Zd

$(EXE): $(OBJS)
    link $(LINK_FLAG) $(OBJS) $(SIMPLE_MODE)

$(OBJS): $(SRCS)
    masm $(MASM_FLAG) $(SRCS) $(SIMPLE_MODE)

clean:
    del *.obj
    del *.tr

test:
    td $(EXE)
```

## Objdump

`AT&T`反汇编工具

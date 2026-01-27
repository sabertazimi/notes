---
sidebar_position: 2
tags: [CS, System, OS, Boot]
---

# Boot

## GCC Inline Assembly

```cpp
asm ( assembler template // assembly language
  :=output operands // 约定输出
  :input operands // 约定输入
  :clobbers // 约定插入
);
```

constraints:

- m/v/o = memory
- r = register
- Q = ea/b/c/dx
- a = eax
- b = ebx
- c = ecx
- d = edx
- D = edi
- S = esi
- 0/n = first/nth constraints

## Sequence

寄存器 -> BIOS -> Boot Loader

## Registers

- CF: 初值 F000H
- EIP: 初值 FFF0H

(FFF)F0000H+FFF0H = FFFFFFF0H,
BIOS 的 EPROM(Erasable Programmable Read Only Memory) 处
加电后第一条指令一般是 ljmp(实模式下, 内存 !MB), 跳转地址为 `CF<<4+EIP`,
跳转至 BIOS 例行程序起始点.

## BIOS

- 基本输入输出程序
- 系统设置信息
- 开机后自检程序
- 系统自启动程序

BIOS 根据设置(硬盘/U 盘/网络启动),
加载存储设备的主引导扇区(Master Boot Record)(第一个扇区)的 512 字节至内存 0x7c00 处,
开始执行第一条指令(Boot Loader)

## Loader

实模式与保护模式带来的问题:

- 在实模式的寻址模式中, 令物理地址为 16 位段寄存器左移 4 位加 16 位逻辑地址的偏移所得的 20 位地址
- 若要访问 1MB 之后的内存, 则必须开启 A20 Line 开关(关闭 wrap around),
  将 32 位地址总线打开, 并进入保护模式(Protect Mode)
- 在实模式中, 0~4KB 为中断向量表保留, 640KB ~ 1MB 为显存与 BIOS 保留, 实际可用的内存只有 636KB
- 考虑到日后内核镜像的体积有超过 1MB 的可能, 所以将其装载到物理地址 1MB(0x100000) 之后连续的一块内存中更好.
- 若要装载内核到物理地址 1MB 之后(实模式下无法访问), 可在实模式中暂时将其装载到一个临时位置, 待进入保护模式之后再移动至合适位置

解决方案:

- 将内核镜像装入内存临时地址
- 开启保护模式
- 移动内核镜像至 1MB 之后合适位置
- 跳转至内核入口(`jmp addr` 用以修改 cs:eip)

### Flags

lab1/tools/sign.c:

- 有效字节小于 510 bytes
- 结尾为 0x55aa
- 总计字节小于 512 bytes

### 基本功能

- 切换到保护模式, 启动段机制
- 通过 8042 键盘控制器的端口, 开启 A20, 关闭 memory wrap around, 获取足够内存空间

```cpp
; 键盘控制器的命令
; 0xD0 Read Output Port
; 0xD1 Write Output Port
; 0xDD Enable A20 Address Line
; 0xDF Disable A20 Address Line
; 0x60 - 数据端口, 0x64 - 命令端口
call  empty_8042
mov   al,0xd1
out   0x64,al
call  empty_8042
mov   al,0xdf
out   0x60,al
call  empty_8042

empty_8042:
    dw    00ebh, 00ebh
    in    al,64h
    test  al,2
    jnz   empty_8042
    ret
```

- 置 cr0 保护模式标志位(bit0) 为 1
- 加载全局描述符表
- 设置各个通用寄存器与段寄存器

- 从硬盘上加载 某种(kernel in ELF) 格式的 os kernel(在硬盘中紧邻 MBR) 至内存的固定区域
- 跳转到 os kernel 的入口点(entry point), 转移控制权至 os

### 保护模式与段机制

- CS -> 全局描述符表(其起始地址与表大小位于 gdt 寄存器中)某项(每项存有 base/limit 等信息)
  -> 局部描述符表 -> 段选择子(段的基本信息) -> 基址+EIP -> 线性地址 ---页机制---> 物理地址
- 将 cr0 寄存器 bit0 置为 1, 表示进入了保护模式, 段机制开始起作用

## Bochs

### Installation

```bash
wget
\ http://sourceforge.net/projects/bochs/files/bochs/2.5.1/bochs-2.5.1.tar.gz/download
\ -O bochs.tar.gz
tar -xvfz bochs.tar.gz
cd bochs-2.5.1
./configure --enable-debugger --enable-debugger-gui --enable-disasm --with-x --with-term
make
sudo cp ./bochs /usr/bin/bochs-dbg
```

### Configuration

```bash
# BIOS与VGA镜像
romimage: file=/usr/share/bochs/BIOS-bochs-latest
vgaromimage: file=/usr/share/bochs/VGABIOS-lgpl-latest
# 内存大小
megs: 128
# 软盘镜像
floppya: 1_44=bin/kernel.images, status=inserted
# 硬盘镜像
ata0-master: type=disk, path="bin/rootfs.images",
\ mode=flat, cylinders=2, heads=16, spt=63
# 引导方式(软盘)
boot: a
# 日志输出
log: .bochsout
panic: action=ask
error: action=report
info: action=report
debug: action=ignore
# 杂项
vga_update_interval: 300000
keyboard_serial_delay: 250
keyboard_paste_delay: 100000
mouse: enabled=0
private_colormap: enabled=0
fullscreen: enabled=0
screenmode: name="sample"
keyboard_mapping: enabled=0, map=
keyboard_type: at
# 符号表(调试用)
debug_symbols: file=main.sym
# 键盘类型
keyboard_type: at
```

### Run

```bash
bochs -q -f .bochsrc
```

- b,vb,lb 分别为物理地址、虚拟地址、逻辑地址设置断点
- c 持续执行，直到遇到断点或者错误
- n 下一步执行
- step 单步执行
- r 显示当前寄存器的值
- sreg 显示当前的段寄存器的值
- info gdt, info idt, info tss, info tab 分别显示当前的 GDT、IDT、TSS、页表信息
- print-stack 打印当前栈顶的值
- help 显示帮助

## GNU Linker

`ld`:

```cpp
ENTRY(kmain)
SECTIONS {
    __bios__ = 0xa0000; # 绑定BIOS保留内存的地址到__bios__
    vgamem = 0xb8000; # 绑定vga缓冲区的地址到符号vgamem
    .text 0x100000 : { # 内核二进制镜像中的.text段(Section)，从0x100000开始
        __kbegin__ = .; # 内核镜像的开始地址
        __code__ = .;
        bin/entry.o(.text) bin/main.o(.text) *(.text); # 将bin/entry.o中的.text段安排到内核镜像的最前方
        . = ALIGN(4096); # .text段按4kb对齐
    }
    .data : {
        __data__ = .;
        *(.rodata);
        *(.data);
        . = ALIGN(4096);
    }
    .bss : {
        __bss__ = .;
        *(.bss);
        . = ALIGN(4096);
    }
    __kend__ = .; # 内核镜像的结束地址
}
```

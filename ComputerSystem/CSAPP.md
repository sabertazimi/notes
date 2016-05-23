# Computer Systems: A Programmer's Perspective - System Basic Notes

## 机器码与进制转换

### 浮点数

规格化浮点数: 1.xxx * 2^(exp - 127) - e.g `5 = 5.0 = 1.25 * 2^(129 - 127)`

-   xxx: 尾数
-   exp: 阶码

## Hardware and Software Interface

### Procedure and Stack

#### Memory Types

|分层|特性|
|:----------:|:----------:|
|Stack|Writable|
|Heap(Dynamic Data)|Writable|
|Static Data|Writable|
|Literals|Read-Only|
|Instructions|Read-Only|

#### Stack Frame

![stack frame](img/stack_frame.png)

```ass
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

`x86_64`: 可使用超出 Stack Pointer 128 bytes 的内存区域, 称为 Red Zone.

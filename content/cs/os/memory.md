---
sidebar_position: 7
tags: [CS, System, OS, Memory]
---

# Memory

## Boot Loader

### Target

- 抽象: 逻辑地址空间(线性物理地址映射)
- 保护: 独立地址空间(进程间互不影响)
- 共享: 访问相同内存(内核空间与共享库)
- 虚拟化: 独占内存空间假象

### 方式

- 重定位 (relocation)
- 分段 (segmentation): 代码段/数据段
- 分页 (paging)
- 虚拟存储 (virtual memory): 内存视作硬盘的缓存, 硬盘视作虚拟内存

### 探测机器内存分布

为内存管理模块提供基础: 在进入实模式前, 调用 int 15h(88h, e801h, e820h), 借助 BIOS 中断获取内存信息

### 地址生成

- 编译时
- 链接时
- 加载时
- 执行时(相对寻址)

### 地址映射

软硬件结合:

逻辑地址 ---> 物理地址

- 硬件(CPU/MMU)完成映射地址
- 操作系统建立映射规则(页表)

### 地址检查

软硬件结合:

- 操作系统设置的段机制和段长度
- 硬件(CPU/MMU)根据段信息进行地址检查(内存访问是否异常)

## 特权级

0: 最高特权级, 3: 最低特权级

### 检查

- CPL/RPL: 访问者特权级
- DRL: 段描述符/门描述符(中断/陷阱门)中保存的特权级, 表示被访问段/中断服务/陷阱的特权级
- CPL/RPL `<=` DRL e.g. 0 < 3

### 切换

#### Ring 0 to Ring 3

- interrupt/trap: push SS(**RPL=3**) -> ESP -> EFLAGS
  -> CS(**RPL=3**) -> EIP -> Error Code
- iret: pop above variables, move to ring 3

#### Ring 3 to Ring 0

特权级提升:

- interrupt/trap: stack switch
- push EFLAGS -> CS(**RPL=0**) -> EIP -> Error Code
- iret: pop above variables, move to ring 0

### TSS

Task State Segment:

保存不同特权级的堆栈信息(SS/ESP)

全局描述符表中保存一个 TSS Descriptor(TSS base + TSS limit):
allocate TSS memory -> init TSS
-> fill TSS descriptor in GDT -> set TSS selector(task register)

## 连续分配

- malloc
- free

### 内存碎片

- 外部碎片: 已分配单元间无法利用空闲单元(请求内存单元过大)
- 内部碎片: 已分配单元内空闲单元

### 动态分配

- Fist-fit(最先匹配): 使用第一个可利用空闲块 - 容易产生外部碎片, 分配大块效率低
- Best-fit(最佳匹配): 使用利用度最高的空闲块 - 外部碎片过小, 释放时需重新排列空闲块链表(升序)
- Worst-fit(最差匹配): 使用利用度最差的空闲块 - 分配中块效率高, 释放时需重新排列空闲块链表(降序)

### 碎片整理

## Ucore

- 连续存放 n 个 page 结构, 形式表示内存页, 并在连续内存块的首页(header page)保存此连续块的连续页数目
- 维护一个链表, 链表每项为大块连续内存块的起始页(header page address) 和 连续页数目, 管理分散的连续内存块

### 紧凑

Compaction, 将不同进程占用内存单元移至较为集中的地方:

- 只可移动 可动态重定位程序
- 只可移动 等待状态进程

### 分区对换

Swapping In and Swapping Out:

将等待状态进程的分区对换至外存,以增大可用内存单元

> e.g. Linux Swap 分区: 安装系统时一般切割大小为内存大小的 50%~100% 的外存作为 Swap 分区

## Malloc

### 启发式编程

Heuristic Programming:

- 建立已分配 void 指针表,free 函数执行时,只回收表中存在的指针;不存在则报错
- 对 heap 进行分区 - 小/中/大块内存请求,分别从不同区域(8/16/32 最小单位区)分配
- 记录当前堆块的信息，如长度，空闲状态
- 记录周围环境信息，如保留上/下一堆块的指针或记录上/下堆块空闲状态

### 伙伴系统

Buddy System:

- 可分配内存单元总大小为 2^n
- 总是将大小 **小于**请求大小的**2 倍**且为**2 的幂次方** 的某块内存单元分配出去(大小为 2^(i-1))

#### 合并空闲块

- 空闲块相邻
- 空闲块等大
- 低地址空闲块的 起始地址 必须为 空闲块大小 的 2 的幂次方倍(2 倍以上)

## 非连续分配

- 支持一个程序使用非连续的物理地址空间
- 支持共享代码与数据
- 支持动态加载与动态链接

## 段式

将逻辑地址划分, 低位表示段内偏移, 高位(取摸)表示段号(类比缓存中的内存地址)

### GDT

```cpp
typedef struct gdt_ptr {
    uint16_t gdt_limit;     // gdt_length - 1
    uint32_t gdt_base;
} __attribute__((packed)) gdt_ptr_t;
```

- 用 16 位来表示表的长度(2 ^ 16 = 65532 bytes), 除以每一个描述符的 8 字节, 最多能创建 8192 个描述符

## 页式

开启页机制:

- init page directory(首址位于 cr3 寄存器), page table
- update GDT
- update ds,es,ss
- update cs with jmp instruction
- cr0 寄存器 bit31(most bit) 置 1

### 虚拟地址

TLB (Translation Lookaside Buffer in CPU/PM):

- Virtual Address =
  `2^(bits of virtual page offset) * virtual page number + virtual page offset`.
- VA = VPN (virtual page number point to PPN) + VPO(virtual page offset = PPO).
- 根据 VPN 在页表中找到对应表项(VPN 表示项号), 每项保存着 PPN.
- TLB = TLBT (tag) + TLBI(index) + VPO.
- 因为内存局部性原理, TLB 一般只需要很小 (比如 **64 项**) 即可达到不错的效果.

### 物理地址

C(cache) PPO = VPO:

- Page Frame (帧): 高位为帧号, 低位为偏移.
- Physical Address =
  `2^(bits of phy page offset) * phy page/frame frame number + phy page offset`
- PA = PPN (physical page number) + PPO (physical page offset = VPO).
- CA = CT(tag) + CI(index) + CO(offset).

### 页表

页表由操作系统建立, 硬件(CPU/MMU)根据页表信息将虚拟地址映射为物理地址:

- FN/PPN
- 标志位: `resident` bit (存在位) + `dirty` bit (修改位) + `reference` bit (引用位)

:::caution[Cons]

- 两次访存: 第一次获取页表项, 第二次访问实际数据
- 页表占据大量内存单元

:::

### TLB

Translation Lookaside Buffer:

缓存页表项 - key: VPN, value: PPN 不用访问页表.

### 多级页表

- 切割页表: 建立子页表
- Page Directory -> Page Table -> Physical Address
- 将线性地址分成三部分 Directory+Table+Offset:
  cr3+Dir 取出 page table base,
  ptb+Tab 取出 physical address base, pab+offset = pa

> CR3 寄存器: 保存一级页表的基址

- 父页表表项保存子页表起始地址, 逻辑地址某部分保存偏移地址(子表项号)
- 存在位为 0 时, 不用保存子表, 节省内存单元

### 反置页表

- PPN 作为页表索引, 页表项保存 VPN(或者 Hash(VPN|PID))
- 将 VPN 映射为 PPN 时, 需遍历整个页表(但此页表只占用少量内存单元)

## 段页式

在页式存储管理基础上, 引入段式存储管理

`<--- vsn --- vpn --- vpo --->` 映射为 `<--- ppn --- ppo --->`

> sn: segment number, pn:page number, po: page offset

若以 4K(limit) 为 1 个页表大小, 则下级页表首址为 `段/页表中某项的值 << 12`(2^12 = 4K)

- 以 vsn 为索引在进程段表中找到段表项,
  获取段(页表)基址与段大小信息(item_value/limit):
  base = item_value `<<` log2(limit)
- 以 vpn 为索引在进程页表(页表基址 = base 中找到页表项, 获取 ppn
- ppn `<<` log2(limit) + vpo(ppo) 为实际物理地址

## 虚拟页式

虚拟内存 = 物理内存 + 外存:

- 只将运行进程所必需页面装入内存, 其余页面至于外存
- 进程发生缺页异常时, 将所要求缺页装入内存:
  选择目标物理页面 -> 无未占用物理页面, 则换出闲置物理页面(访问位)
  -> 装入物理内存,更新页表项
  (换入逻辑地址与换出逻辑地址对应的页表项的驻留位/修改位/访问位/锁定位以及物理页号 ppn)
- 监控已经装入内存的页面, 及时将不需要页面换出至外存
- 为每个进程分配一个 vma 块, 模拟一个完整的物理内存
- vmas 按起始**地址从小至大**形成一个双向链表, 且地址空间**没有任何交集**

```cpp
#define VM_READ  0x00000001
#define VM_WRITE 0x00000002
#define VM_EXEC  0x00000004
#define VM_USER  (VM_READ | VM_WRITE | VM_EXEC)

typedef struct __mm {
    list_entry_t mmap_list; // header of vmas' list
    vma *mmap_cache;        // current accessed vma(used for speed purpose)
    pde_t *pgdir;           // PDT for vmas
    int map_count;          // count of vmas
    void *sm_priv;          // private data for swap manager
} mm;

typedef struct __vma {
    struct mm *vm_mm;       // all vmas use the same PDT(page directory table)
    uintptr_t vm_start;     // start address of vma (align to PGSIZE)
    uintptr_t vm_end;       // end address of vma   (align to PGSIZE)
    uint32_t vm_flags;      // flags of vma
    list_entry_t vma_list;  // doubly linked list: sort all vmas by start address
} vma;
```

## Page Fault

- 虚拟地址越界: 访问不存在的虚拟地址
- 对只读地址进行写操作
- 访问未映射虚拟页 (swap in/out)
- CPU 将产生异常的的线性地址 (linear address) 存储在 `CR2` 寄存器中,
  将 errorCode (2 -> 访问权限异常, 1 -> 写异常, 0 -> 物理页不存在) 压入中断栈

> CR0: 处理器模式 (实/保护/分段/分页模式)
> CR2: Page Fault Linear Address
> CR3: Page-Directory Base Address Register

当出现缺页异常且物理内存已满时, 需要以页面置换算法为指导, 换出闲置物理页面, 换入所要求缺页, 并更新页表项:

- 尽可能减少物理页面的换入换出次数
- 只可交换映射到用户空间的物理页
- 当页表项中 `PTE_P` 为 0 时, 对应高位地址表示扇区地址(而不是物理位移)
- 换入时机: `Page Fault` 缺页
- 换出时机: 积极/消极换出策略

### 覆盖

Overlay:

将程序中相互独立的模块分成一组, 为每组按最大模块分配内存单元

### 交换

Swap:

将挂起进程的整个地址空间换出至外存(swap out), 将需用进程的整个地址空间换入至内存(swap in), 进程交替运行

### 标志位

- 驻留位: 此逻辑地址对应的页面在内存中
- 修改位: 此页面是否被修改过, 判定此页面换出时策略(写回外存/直接丢弃)
- 访问位: 此页面是否被读/写过, 判定此页面是否需要换出至外存
- 锁定位: 此页面不会被换出

### 局部置换

换入进程 A 的某个页面时, 只可换出进程 A 的某个页面: 为进程分配固定数目的页面

#### 最远未用

Least Recently Used (LRU) Algorithm:

- 利用**链表等线性结构**维护页面访问时间, 队首为最近一次访问页面(每次访问一个页面后, 把它从线性结构中间抽出至队首), 队尾为最远一次访问页面

#### 时钟

Clock Algorithm:

- 利用**循环链表**维护页面(指针指向最先换入内存的页面), 页表项访问位维护访问记录(访问后将访问位置 1)
- 缺页时, 从指针处开始查找页面进行置换: 若访问位为 0, 则进行置换; 若访问位为 1, 则将此页面访问位置 0, 继续查找未访问页面
- 改进: 增加修改位

| 指针扫描前    | 指针扫描后    |
| :------------ | :------------ |
| 访问位 修改位 | 访问位 修改位 |
| 0 0           | 置换          |
| 0 1           | 0 0           |
| 1 0           | 0 0           |
| 1 1           | 0 1           |

#### 最不常用

Least Frequently Used (LFU) Algorithm:

- 利用**链表等线性结构**维护页面访问时间, 队首为最多访问次数页面(每次访问一个页面后, 访问次数+1, 并排序), 队尾为最少访问次数页面

### 全局置换

- 换入进程 A 的某个页面时, 可换出其他进程的某个页面: 为进程分配可变数目的页面
- 关键: 确定为不同进程分配的页面数目
- 抖动(thrashing): 进程过多, 导致大部分进程的常驻集 `<` 工作集, 缺页率较高

#### 工作集

- 工作集(随时间动态变化集): 一个进程当前正在使用的逻辑页面集合,
  WorkingSet(currentTime, workingSetWindow(访问时间窗口)) `(cT - wSW, cT + wSW)`
- 根据工作集大小(逻辑页面集合), 为该进程分配常驻集(合适数目的物理页面集合): 若常驻集 > 工作集, 则缺页率较低
- 再额外维护一个类希 LRU 算法中的访存链表, 记录近期访问过的物理页面, 将其也加入常驻集

#### 缺页率

当缺页频繁时, 缺页时将缺页的页面加入常驻集; 当缺页不频繁时, 缺页时将不属于工作集的页面移出常驻集

## Toolchain

### Perf

### Trace

### Vmstat

check usage of virtual memory and swap region

```bash
vmstat 2
```

### Pmap

check detailed usage of memory

```bash
pmap PID
```

### Hot Plug

Memory hotplug user [guide](http://www.kernel.org/doc/Documentation/memory-hotplug.txt).

### TCMalloc

Google TCMalloc.

### Oprofile

Oprofile user [guide](http://oprofile.sourceforge.net).

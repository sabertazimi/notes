---
sidebar_position: 4
tags: [CS, System, OS, Process, Schedule]
---

# Process

资源分配单位:

- 独立性: 无副作用(确定性), 可重现
- 并发性(宏观并行, 微观串行): 提升效率, 共享资源, 高度模块化
- 一个独立的逻辑控制流(并行执行)
- 一个私有的地址空间(缓存与虚拟存储器)

## 特权级

- 处理机的态/处理机的特权级: 根据对资源和机器指令的使用权限, 将处理执行时的工作状态区分为不同的状态
- 管理(supervisor mode)/系统态: 使用全部机器指令(包括特权指令), 可使用所有资源, 允许访问整个内存区, 运行系统程序
- 用户态: 禁止使用特权指令(I/O 设备指令, 直接修改特殊寄存器指令, 改变机器状态指令),
  不可**直接**取用资源与改变机器状态, 只可访问自己的存储区域, 运行用户程序
- 用户态切换至管态: 错误/异常状态(除 0/缺页), 外部中断(I/O), 系统调用, 这一过程是由**硬件完成**的

## 生命周期

创建, 就绪(ready), 运行(running), 等待(wait/sleeping),
挂起(suspend: 进程由内存换出至外存), 结束(抢占, 唤醒):
进程优先级与剩余内存单元在一定程度上会影响进程状态

- 进程首先在 cpu 初始化或者 sys_fork 的时候被创建,当为该进程分配了一个进程控制块之后,该进程进入 uninit 态
- 当进程完全完成初始化之后,该进程转为 runnable 态
- 当到达调度点时,由调度器 sched_class 根据运行队列 rq 的内容来判断一个进程是否应该被运行,
  即把处于 runnable 态的进程转换成 running 状态,从而占用 CPU 执行
- running 态的进程通过 wait 等系统调用被阻塞,进入 sleeping 态
- sleeping 态的进程被 wake up 变成 runnable 态的进程
- running 态的进程主动 exit 变成 zombie 态, 然后由其父进程完成对其资源的最后释放,子进程的进程控制块成为 unused
- 所有从 runnable 态变成其他状态的进程都要出运行队列(dequeue), 反之，被放入某个运行队列中(enqueue)

## 上下文

- 代码/数据,堆/栈,通用寄存器,程序计数器,环境变量,文件描述符集合
- 上下文切换:用户模式与内核模式的切换
- 高速缓存污染(pollution): 每次切换后,总是会发生 cold cache miss

## 控制

Process control block:

通过组织管理 `PCB` (链表/索引表) 来组织管理进程; 在进程创建/终止的同时, 生成/回收改进程的 PCB:

- 进程信息: 名字/`pid`/`uid`
- 链表信息: 父进程指针/所属队列指针(就绪队列/`I/O` 等待队列/挂起队列)
- CPU 调度/运行时信息: `eflags`/`cr3`/状态
- 内存资源信息: 堆指针/栈指针/虚拟内存页面指针
- 上下文信息(用于进程/上下文切换时保存/恢复上下文): trap frame/context (register files)

```cpp
#include <sys/types.h>
#include <unistd.h>
#include <sys/wait.h>
#include <errno.h>
```

### 创建和终止进程

- 父进程与子进程获得 2 份独立的私有空间与 2 份独立的上下文, 不同的 `PID` (process id)
- 由于指针(如打开的文件描述符),有可能互相影响,但大体上互不影响

```cpp
/*
 * output: parent: x=0
 * output: child: x=2
 * 独立上下文代表拥有独立的通用寄存器与栈,代表拥有拷贝的自动变量(局部变量),互不影响地进行修改
 */
int main(void) {
    pid_t pid;
    int x = 1;

    pid = fork();

    if (pid == 0) { // child
        printf("child: x=%d\n", ++x);
        exit(0);
    }

    // parent
    printf("parent: x=%d\n", --x);
    exit(0);
}
```

### 回收子进程

```cpp
#define N 2

int main(void) {
    int status, i;
    pid_t pid[N], ret_pid;

    for (i = 0; i < N; i++) {
        if ((pid[i] = fork()) == 0) { // child
            exit(100+i);
        }
    }

    // parent reaps(回收) N children in order
    i = 0;
    while((ret_pid = waitpid(pid[i++], &status, 0)) > 0) {
        if (WIFEXITED(status)) {
            printf("child: %d terminated normally with exit status=%d\n",
              ret_pid, WEXITSTATUS(status));
        } else {
            printf("child %d terminated abnormally\n", ret_pid);
        }
    }

    // only if there are no more children, it can exit normally
    if (errno != ECHILD) {
        unix_error("waitpid error"); // exit with error log
    }

    exit(0); // exit normally
}
```

## 通信

- 直接通信: send(proc, msg), receive(proc, msg) `shmctl() shm*`
- 间接通信: send(msg_que, msg), receive(msg_que, msg) `msgctl() msg*`

## 线程

CPU 调度单位:

- 进程缺陷: 共享数据不便, 系统开销大
- 线程共享段表/共享库/数据/代码/环境变量/文件描述符集合/地址空间, 但拥有独立的堆/栈/通用寄存器
- 线程控制块(Thread Control Block)
- 用户线程与内核线程: 多为 1 对 1

### IDLE

0 号内核线程:

- 工作就是不停地查询，直至有其他内核线程处于就绪状态, 令调度器执行那个内核线程
- IDLE 内核线程是在操作系统没有其他内核线程可执行的情况下才会被调用
- 在所有进程中，只有 IDLE (内核创建的第一个内核线程) 没有父进程

### 内核线程与用户进程

- 内核线程只运行在内核态
- 用户进程会交替运行在用户态和内核态(系统调用/外设中断/异常中断)
- 所有内核线程直接使用共同的内核内存空间, 拥有相同的内核虚拟地址空间(包括物理地址空间)
- 每个用户进程拥有单独的用户内存空间(虚拟内存单元)

## 调度

Schedule:

- 从就绪队列中挑选下一个占用 CPU 的进程(挑选进程的内核函数)
- 从多个可用 CPU 中挑选使用 CPU 资源

### 时机

基本调度时机:

- 进程停止运行, 进入等待/挂起/终止状态
- 进程的中断请求完成时, 由等待状态进入就绪状态, 准备抢占 CPU 资源(准备从内核态返回用户态)

六大调度时机:

- proc.c::do_exit 用户线程执行结束,主动放弃 CPU 控制权
- proc.c::do_wait 用户线程等待子进程结束,主动放弃 CPU 控制权
- proc.c::init_main
  - initproc 内核线程等待所有用户进程结束,如果没有结束,就主动放弃 CPU 控制权
  - initproc 内核线程在所有用户进程结束后,让 kswapd 内核线程执行 10 次，用于回收空闲内存资源
- proc.c::cpu_idle idleproc 内核线程的工作就是等待有处于就绪态的进程或线程,如果有就调用 schedule 函数
- sync.h::lock 在获取锁的过程中,如果无法得到锁,则主动放弃 CPU 控制权
- trap.c::trap 如果在当前进程在用户态被打断,且当前进程控制块的成员变量 need_resched 设置为 1,则当前线程会放弃 CPU 控制权

### 策略

- CPU 有效使用率
- 吞吐量 (高带宽): 单位时间内完成进程数量
- 等待时间 (低延迟): 进程在就绪队列等待总时间
- 周转时间 (低延迟): 进程从初始化到结束总时间
- 响应时间 (低延迟): 从提交请求到产生响应总时间

### 先来先服务

First Come First Served (FCFS):

- 依次执行就绪队列中的各进程(先进入就绪队列先执行)
- CPU 利用率较低

### 短进程优先

Shortest process next (shortest remaining time):

- 优先执行周转耗时/剩余耗时最短的进程
- 若短进程过多, 则导致长进程一直无法执行

### 最高响应比优先

Highest Response Ratio Next:

- R = (waitTime + serviceTime) / serviceTime: 已等待时间越长, 优先级上升
- 修正短进程优先算法的缺点

### 时间片轮转

Round Robin:

- 在 FCFS 基础上, 设定一个基本时间单元, 每经过一个时间单元, 轮转至下一个先到进程(并进行循环轮转)
- 额外的上下文切换
- 时间片合适大小: 10 ms

### 多级队列

MQ:

- 将就绪队列分成多个独立子队列, 每个队列可采取不同调度算法
- 前台交互队列使用时间片轮转算法, 后台 IO 队列使用先来先服务算法
- 队列间使用时间片轮转算法

### 多级反馈队列

MLFQ:

- 优先级高的子队列时间片小, 优先级低的子队列时间片大
- CPU 密集型进程(耗时高)优先级下降很快
- IO 密集型进程(耗时低)停留在高优先级

## APIs

### Execution Context

执行现场/执行上下文:

- 设置好执行现场后, 一旦调度器选择了 initproc 执行, 就需要根据 initproc->context 中保存的执行现场来恢复 initproc 的执行
- 通过 proc_run 和进一步的 switch_to 函数完成两个执行现场的切换，具体流程如下:
  - 让 current 指向 next 内核线程 initproc
  - 设置任务状态段 ts 中特权态 0 下的栈顶指针 esp0 为 next 内核线程 initproc 的内核栈的栈顶,
    即 next->kstack + KSTACKSIZE
  - 设置 CR3 寄存器的值为 next 内核线程 initproc 的页目录表起始地址 next->cr3
  - 由 switch_to 函数完成具体的两个线程的执行现场切换, 即切换各个寄存器

### Fork

- 分配并初始化进程控制块(alloc_proc 函数)
- 分配并初始化内核栈(setup_stack 函数)
- 根据 clone_flag 标志复制或共享进程内存管理结构(copy_mm 函数)
- 设置进程在内核(或用户态)正常运行和调度所需的中断帧和执行上下文(copy_thread 函数)
- 把设置好的进程控制块放入 hash_list 和 proc_list 两个全局进程链表中
- 把进程状态设置为"就绪"态
- 设置返回码为子进程的 id 号

fork() 的主要行为:

- 申请 pid 与进程结构
- 设置 ppid 为父进程的 pid
- 复制用户相关的字段, 如 p_pgrp/p_gid/p_ruid/p_euid/p_rgid/p_egid
- 复制调度相关的字段, 如 p_cpu/p_nice/p_pri
- 复制父进程的文件描述符 (p_ofile), 并增加引用计数
- 复制父进程的信号处理例程 (p_sigact)
- 通过 vm_clone(), 复制父进程的地址空间(p_vm)
- 复制父进程的寄存器状态 (p_context)
- 复制父进程的中断上下文, 并设置 tf->eax 为 0, 使 fork()在子进程中返回 0。

### Execution

exec() 的主要行为:

- 读取文件的第一个块, 检查 Magic Number 是否正确
- 保存参数(argv)到临时分配的几个物理页, 其中的每个字符串单独一页
- 清空旧的进程地址空间(vm_clear()), 并结合可执行文件的 header, 初始化新的进程地址空间(vm_renew())
- 将 argv 与 argc 压入新地址空间中的栈
- 释放临时存放参数的几个物理页
- 关闭带有 FD_CLOEXEC 标识的文件描述符
- 清理信号处理例程
- 通过`_retu()`返回用户态

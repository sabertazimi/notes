---
sidebar_position: 5
tags: [CS, System, OS, Exceptions, Interrupts]
---

# Exception

## 异常控制流

理解异常控制流,有助于理解以下概念:

- 陷阱(trap)/系统调用(system call)
- 系统级 I/O
- 线程/进程(concurrency)
- 虚拟存储器
- 软件异常

### 分类

| 类别      | 原因              | 异步/同步 | 返回行为          | 例子          |
| :-------- | :---------------- | :-------- | :---------------- | :------------ |
| interrupt | 输入/输出外部中断 | async     | next(concurrency) | 磁盘          |
| trap      | 主动异常/系统调用 | sync      | next              | write/intN    |
| fault     | 潜在可恢复的错误  | sync      | current/abort     | seg/float exp |
| abort     | 不可恢复的错误    | sync      | abort(not return) | 硬件错误      |

### 处理程序

异常处理程序主要分为 3 类:

- 控制权返回给 Instruction_current
- 控制权返回给 Instruction_next
- abort/exit

### 非本地跳转

```cpp
#include <setjmp.h>
```

- setjmp - catch: 返回多次
- longjmp - throw: 不返回

## 信号

```cpp
#include <sys/types.h>
#include <unistd.h>
#include <signal.h>
```

- 一个只发出而未被处理的信号为待处理信号
- 一种类型至多有一个待处理信号, 多余待处理信号**不会进入处理队列**,只是**被简单丢弃**
- 不可以用信号对其他事件进行计数, 同一事件多次发生产生的信号有可能被简单丢弃

### 处理

```cpp
void handler(int sig) {
   pid_t pid;

   while ((pid = waitpid(-1, NULL, 0)) > 0)  {
       printf("Handler reaped child %d\n", (int)pid);
   }

   if (errno != ECHILD) {
       unix_error("waitpid error");
   } else {
       sleep(2);
   }

   return;
}

int main(void) {
    int i, n;
    char buf[MAX_BUF];
    pid_t pid;

    if (signal(SIGCHLD, handler) == SIG_ERR) {
        unix_error("signal error");
    }

    for (i = 0; i < 3; i++) {
        pid = fork();

        if (pid ==0) {
            printf("Hello from child %d\n", (int)getpid());
            sleep(1);
            exit(0);
        }
    }

    // manually restart the READ call
    while ((n = read(STDIN_FILENO, buf, sizeof(buf))) < 0) {
        if (errno != EINTR) {
            unix_error("read error");
        }

        printf("Parent processing input\n");

        while(1) {
            ;
        }

        exit(0);
    }
}
```

### 阻塞

```cpp
// how: SIG_BLOCK, SIG_UNBLOCK, SIG_SETMASK, 是否阻塞set中的信号合集
int sigprocmask(int how, const sigset_t *set, sigset_t *old_set);

int sigemptyset(sigset_t *set);
int sigfillset(sigset_t *set);
int sigaddset(sigset_t *set, int sig_num);
int sigdelset(sigset_t *set, int sig_num);
int sigismember(const sigset_t *set， int sig_num);
```

```cpp
void handler(int sig) {
    pid_t pid;

    while ((pid = waitpid(-1, NULL, 0)) > 0) {
        delete_job(pid);
    }

    if (errno != ECHILD) {
        unix_error("waitpid error");
    }
}

// 保证父进程先执行 add_job, 再执行 delete_job
int main(int argc, char **argv) {
    int pid;
    sigset_t mask;

    signal(SIGCHLD, handler);
    init_job();

    while (1) {
        sigemptyset(&mask);
        sigaddset(&mask, SIGCHLD);
        sigprocmask(SIG_BLOCK, &mask, NULL); // block SIGCHLD

        if ((pid = fork()) == 0) {
            // unblock SIGCHLD in child, make it can transfer signal
            sigprocmask(SIG_UNBLOCK, &mask, NULL);
            execve("/bin/date", argv, NULL);
        }

        // parent process
        add_job(pid);
        // after add_job, unblock SIGCHLD, make it can handle signal
        sigprocmask(SIG_UNBLOCK, &mask, NULL);
    }
}
```

## 中断

Interrupt Service Routine/Interrupt Quest:

- NMI 中断(Non Maskable Interrupt) 与 INTR 中断(可屏蔽中断)
- x86PC 中断控制芯片: 8259A PIC

### 进入

保护现场:

- push PSW(Program State Word): (cs:eip + eflags)
- push PC(Program Counter)
- 中断向量表(将中断向量表对应的中断的 PSW(高 2 字节) 与 PC(低 2 字节) 先后替换原 PSW 与 PC)
- 系统堆栈
- 中断屏蔽码: n 位 2 进制数(n 为中断总数), 允许响应 n 号中断则该位置 1

程序状态字:

- 当前执行指令(eip)
- 当前指令执行情况
- 处理机所处状态
- 中断屏蔽码(程序在执行时应屏蔽的中断)
- 寻址方法/编址/保护键
- 响应中断的内容

### 流程

硬件发生了某个事件后告诉中断控制器(PIC), 中断控制器汇报给 CPU,
CPU 从中断控制器处获取中断号, 根据中断号调用对应中断服务例程,
处理完成后重新回到之前的执行流程:

1. 发生中断, PIC 报告中断号给 CPU
2. CPU 调用对应处理程序 irsr_x/irq_x
3. irsr_x/irq_x 负责压入相关信息(中断号/错误码), 然后跳转至统一处理函数 `common_stub`
4. `common_stub`: 压栈 -> 调用 fault_handler/req_handler -> 出栈
5. 进入 handler 后, 再根据中断号/错误码(结构体)以及栈帧信息(结构体), 进行实际处理(真正处理逻辑)
6. 在进入 handler 之前, 都是通过汇编代码进行最简单的处理(压入相关信息), 将实际中断处理逻辑放在 C 语言中, 再辅以内联汇编, 可大大地提升中断处理程序的编写效率以及中断处理程序的处理能力

## 系统调用

- 保护系统安全, 提升可靠性与安全性
- 调用: 用户态, 执行: 管态/内核态

## 日志

```cpp
void unix_error(char *msg) {
    fprintf(stderr, "%s: %s\n", msg, strerror(errno));
    exit(0);
}

void posix_error(int code, char *msg) {
    fprintf(stderr, "%s: %s\n", msg, strerror(code));
    exit(0);
}

void dns_error(char *msg) {
    fprintf(stderr, "%s: DNS error %d\n", msg, h_errno);
    exit(0);
}

void app_error(char *msg) {
    fprintf(stderr, "%s\n", msg);
    exit(0);
}
```

---
tags: [Language, C]
---

# C

## 类型转换

### 机器码转换

- 有符号类型转换: 进行符号扩展
- 无符号类型转换: 进行零扩展

## Types

- 可检测字符

getc、fgetc、getchar 函数可返回值(EOF 值/unsigned char 类型)

- 不可检测字符

非 EOF 值/非 unsigned char 类型(_会引发严重错误_)

![CType Functions](./figures/ctype.h.jpg 'CType Functions')

## String

- men 系函数：操作任意字符序列
- strn 系函数：操作非空字符序列
- str 系函数：操作字符串序列('\0')

### Strdup

string duplicate - `char *strdup(string)` 封装 allocator 细节

### Strchr and Strstr

返回字符/串在字符串中出现的位置(地址)

### Strtok

### Strcasecmp

### Getopt

解析命令行参数, 轻松地提取以 - 或 / 开头的参数

## Float and Limits

- 宏定义：`CHAR/UCHAR/SCHAR/SHRT/USHRT/INT/UINT/LONG/ULONG/FLT/DBL/LDBL`有关的`MIN/MAX/EPSILON`

## 联合体

- 机器码 e.g. 理解 IEEE 754 标准
- 区分大/小端模式

## Pointer

### Error Prone

```cpp
int i = 37;
float f = *(float *)&i;

float f = 7.0;
short s = *(short *)&f;
```

- 悬挂指针
- 未初始化
- 改写未知区域
  - 下标越界
  - 内存上溢 e.g. `gets(string);`
- 指针相关运算符优先级与结合性
- 返回局部变量的地址
- 重复释放内存空间
- 内存泄漏 e.g. 未释放空间/未释放部分深度空间(多维数组)
- 不能引用 void 指针指向的内存单元

### Debugging Malloc

Tips: 中途运用强制类型转换,使得 void 指针可以执行指针加减运算

```cpp
void *target = (char *)void_pointer + ...;
```

## Generics

### Swap

```cpp
void swap(void *vp1, void *vp2, int size) {
    char buffer[size];
    memcpy(buffer, vp1, size);
    memcpy(vp1, vp2, size);
    memcpy(vp2, buffer, size);
}
```

### Search

```cpp
void *lsearch(void *key, void *base, int n, int elemSize,
  int (*cmp_fn)(void *, void *)) {
    for (int i = 0;i < n;i++) {
        void * elemAddr = (char *)base + i * elemSize;
        if (cmp_fn(key, elemAddr) == 0) {
            return elemAddr;
        }
    }

    return NULL;
}
```

```cpp
int IntCmp(void *elem1, void *elem2) {
    int *ip1 = (int *)elem1;
    int *ip2 = (int *)elem2;
    return *ip1 - *ip2;
}
```

```cpp
int array[] = {4, 2, 3, 7, 11, 6},
    size = 6,
    target = 7;

// 应进行强制类型转换
int * found = (int *)lsearch(&target, array, 6, sizeof(int), IntCmp);

if (found == NULL) {
    printf("Not Found");
} else {
    printf("Found");
}
```

```cpp
int StrCmp(void *vp1, void *vp2) {
    // 必须进行强制类型转换
    char *s1 = *(char **)vp1;
    char *s2 = *(char **)vp2;
    return strcmp(s1, s2);
}
```

```cpp
char *notes[] = {"Ab", "F#", "B", "Gb", "D"},
    *target = "Eb";
char ** found = lsearch(&target, notes, 5, sizeof(char *), StrCmp);
```

### Stack

```cpp
typedef struct {
    void *elements;
    int elemSize;
    int logLen;
    int allocLen;
} stack;

void StackNew(stack *s, int elemSize);
void StackDispose(stack *s);
void StackPush(stack *s, void *elemAddr);
void StackPop(stack *s, void *elemAddr);
```

```cpp
void StackNew(stack *s, int elemSize) {
    // 参数合法性检查
    if (s->elemSize <= 0) {
        perror("ElemSize <= 0");
        return;
    }

    s->elemSize = elemSize;
    s->logLen = 0;
    s->allocLen = 4;
    s->elements = (int *)malloc(s->allocLen * elemSize);

    // NULL检查
    if (s->elements == NULL) {
        perror("No Mem");
        exit(0);
    }
}

void StackPush(stack *s, void *elemAddr) {
    // 满栈检查
    if (s->logLen == s->allocLen) {
        s->allocLen *= 2;
        s->elements = (int *)malloc(s->elements, s->allocLen * s->elemSize);
    }

    void *target = (char *)s->elements + s->logLen * s->elemSize;
    memcpy(target, elemAddr, s->elemSize);
    s->logLen++;
}

void StackPop(stack *s, void *elemAddr) {
    // 空栈检查
    if (s->logLen == 0) {
        perror("Empty Stack");
        return;
    }

    s->logLen--;
    void *source = (char *)s->elements + s->logLen * s->elemSize;
    memcpy(elemAddr, source, s->elemSize);
}
```

## Memory

### Memset

### Free

**free 函数会回退 4/8 字节，取出 heap 块的长度/信息,根据此信息进行 heap 块的释放.**

## Locale

- 实现时间/单位/货币等一系列的国际化
- 常用函数

```cpp
_CRTIMP char * __cdecl setlocale(int, const char *);
_CRTIMP struct lconv * __cdecl localeconv(void);
```

- int 值

```cpp
#define LC_ALL          0
#define LC_COLLATE      1
#define LC_CTYPE        2
#define LC_MONETARY     3
#define LC_NUMERIC      4
#define LC_TIME         5
```

## Math

数学函数库(包括后缀 f(float)/l(long double))

## Process

- `getpid()`.
- `wait(int *child_status)`/`waitpid(pid)`.
- `exit()`.

### Fork and Execve

- fork(): 创建当前进程的拷贝
- execve(): 用另一程序的代码代替当前进程的代码
  - `int execve(char *filename, char *argv[], char *env_p[])`

```cpp
void fork_exec(char *path, char *argv[]) {
    pid_t pid = fork();

    if (0 != pid) {
        printf("Parent: created a child %d\n", pid);
    } else {
        printf("Child: exec-ing new program now\n");
        execv(path, argv);
    }

    printf("This line printed by parent only!\n");
}
```

## Thread

### PThread

```cpp
typedef unsigned long int pthread_t;

/**
 * create thread
 * @param  {指向线程标识符的指针}   pthread_t *__thread
 * @param  {设置线程属性}         __const pthread_attr_t *__attr
 * @param  {线程运行函数的起始地址} void *(*__start_routine) (void *)
 * @param  {运行函数的参数}        void *__arg
 */
extern int pthread_create __P ((
  pthread_t *__thread,
  __const pthread_attr_t *__attr,
  void *(*__start_routine) (void *)， void *__arg)
);

/**
 * 等待线程
 * @param  {被等待的线程标识符}                              pthread_t __th
 * @param  {一个用户定义的指针，它可以用来存储被等待线程的返回值} void **__thread_return
 */
extern int pthread_join __P ((pthread_t __th, void **__thread_return));

/**
 * 退出线程
 * @param  {函数的返回代码} (void *__retval)) __attribute__ ((__noreturn__)
 */
extern void pthread_exit __P ((void *__retval)) __attribute__ ((__noreturn__));

// 一个线程不能被多个线程等待，否则第一个接收到信号的线程成功返回，其余调用pthread_join的线程则返回错误代码 ESRCH

// 以下为互斥锁相关函数

pthread_mutex_init
pthread_mutexattr_init

/**
 * 设置属性 pshared
 * PTHREAD_PROCESS_PRIVATE
 * PTHREAD_PROCESS_SHARED
 */
pthread_mutexattr_setpshared

/**
 * 设置互斥锁类型
 * PTHREAD_MUTEX_NORMAL
 * PTHREAD_MUTEX_ERRORCHECK
 * PTHREAD_MUTEX_RECURSIVE
 * PTHREAD_MUTEX_DEFAULT
 */
pthread_mutexattr_settype

pthread_mutex_lock
pthread_mutex_unlock
pthread_delay_np
```

```cpp
InitThreadPackage;
ThreadNew;
ThreadSleep;
RunAllThreads;
SemaphoreNew(int > 0);
SemaphoreWait(lock);
SemaphoreSignal(lock);
```

### Semaphore

- 哲学家就餐问题
- 将 Semaphore 变量的值在允许范围内(不至于使得线程锁失效)使得其取最大值，减少线程阻塞
- EmptyBuf 8, FullBuf 0
- 双向通信，互相唤醒 - `Writer:sw(empty),ss(full);` `Reader:sw(full),ss(empty);`

```cpp
void SellTickets(int agent, int *ticketsNum, Semaphore lock) {
  while (true) {
    // 当 lock == 0 时,当前进程阻塞, 等待 lock > 0
    // 当 lock > 0 时, 当前进程继续进行, 并且 lock--
    SemaphoreWait(lock);

    if (*ticketsNum == 0) break;  // 票已售磬

    (*ticketsNum)--;  // 售出一张票
    printf("Sell One Ticket.\n");

    // lock++ 使得 lock > 0
    // 若有其他进程调用了SemaphoreWait, 且因之前 lock == 0 而被阻塞, 则此时其他进程可继续进行
    SemaphoreSignal(lock);
  }

    // break to here
  // 作用同循环内的 Signal 函数
  SemaphoreSignal(lock);
}
```

## Exceptions

perror(string) - 用来将上一个函数发生错误的原因输出到标准设备(stderr)

## Errno

- errno 的值在程序启动时为零，但是不会被任何库函数设为零

```cpp
errno = 0;
y = sqrt(x);
if (errno != 0) {
    printf("invalid x : %e\n", x);
}
```

```cpp
#ifndef _I386_ERRNO_H
#define _I386_ERRNO_H
#define EPERM 1 /* Operation not permitted */
#define ENOENT 2 /* No such file or directory */
#define ESRCH 3 /* No such process */
#define EINTR 4 /* Interrupted system call */
#define EIO 5 /* I/O error */
#define ENXIO 6 /* No such device or address */
#define E2BIG 7 /* Arg list too long */
#define ENOEXEC 8 /* Exec format error */
#define EBADF 9 /* Bad file number */
#define ECHILD 10 /* No child processes */
#define EAGAIN 11 /* Try again */
#define ENOMEM 12 /* Out of memory */
#define EACCES 13 /* Permission denied */
#define EFAULT 14 /* Bad address */
#define ENOTBLK 15 /* Block device required */
#define EBUSY 16 /* Device or resource busy */
#define EEXIST 17 /* File exists */
#define EXDEV 18 /* Cross-device link */
#define ENODEV 19 /* No such device */
#define ENOTDIR 20 /* Not a directory */
#define EISDIR 21 /* Is a directory */
#define EINVAL 22 /* Invalid argument */
#define ENFILE 23 /* File table overflow */
#define EMFILE 24 /* Too many open files */
#define ENOTTY 25 /* Not a typewriter */
#define ETXTBSY 26 /* Text file busy */
#define EFBIG 27 /* File too large */
#define ENOSPC 28 /* No space left on device */
#define ESPIPE 29 /* Illegal seek */
#define EROFS 30 /* Read-only file system */
#define EMLINK 31 /* Too many links */
#define EPIPE 32 /* Broken pipe */
#define EDOM 33 /* Math argument out of domain of func */
#define ERANGE 34 /* Math result not representable */
#define EDEADLK 35 /* Resource deadlock would occur */
#define ENAMETOOLONG 36 /* File name too long */
#define ENOLCK 37 /* No record locks available */
#define ENOSYS 38 /* Function not implemented */
#define ENOTEMPTY 39 /* Directory not empty */
#define ELOOP 40 /* Too many symbolic links encountered */
#define EWOULDBLOCK EAGAIN /* Operation would block */
#define ENOMSG 42 /* No message of desired type */
#define EIDRM 43 /* Identifier removed */
#define ECHRNG 44 /* Channel number out of range */
#define EL2NSYNC 45 /* Level 2 not synchronized */
#define EL3HLT 46 /* Level 3 halted */
#define EL3RST 47 /* Level 3 reset */
#define ELNRNG 48 /* Link number out of range */
#define EUNATCH 49 /* Protocol driver not attached */
#define ENOCSI 50 /* No CSI structure available */
#define EL2HLT 51 /* Level 2 halted */
#define EBADE 52 /* Invalid exchange */
#define EBADR 53 /* Invalid request descriptor */
#define EXFULL 54 /* Exchange full */
#define ENOANO 55 /* No anode */
#define EBADRQC 56 /* Invalid request code */
#define EBADSLT 57 /* Invalid slot */
#define EDEADLOCK EDEADLK
#define EBFONT 59 /* Bad font file format */
#define ENOSTR 60 /* Device not a stream */
#define ENODATA 61 /* No data available */
#define ETIME 62 /* Timer expired */
#define ENOSR 63 /* Out of streams resources */
#define ENONET 64 /* Machine is not on the network */
#define ENOPKG 65 /* Package not installed */
#define EREMOTE 66 /* Object is remote */
#define ENOLINK 67 /* Link has been severed */
#define EADV 68 /* Advertise error */
#define ESRMNT 69 /* Srmount error */
#define ECOMM 70 /* Communication error on send */
#define EPROTO 71 /* Protocol error */
#define EMULTIHOP 72 /* Multi hop attempted */
#define EDOTDOT 73 /* RFS specific error */
#define EBADMSG 74 /* Not a data message */
#define EOVERFLOW 75 /* Value too large for defined data type */
#define ENOTUNIQ 76 /* Name not unique on network */
#define EBADFD 77 /* File descriptor in bad state */
#define EREMCHG 78 /* Remote address changed */
#define ELIBACC 79 /* Can not access a needed shared library */
#define ELIBBAD 80 /* Accessing a corrupted shared library */
#define ELIBSCN 81 /* .lib section in a.out corrupted */
#define ELIBMAX 82 /* Attempting to link in too many shared libraries */
#define ELIBEXEC 83 /* Cannot exec a shared library directly */
#define EILSEQ 84 /* Illegal byte sequence */
#define ERESTART 85 /* Interrupted system call should be restarted */
#define ESTRPIPE 86 /* Streams pipe error */
#define EUSERS 87 /* Too many users */
#define ENOTSOCK 88 /* Socket operation on non-socket */
#define EDESTADDRREQ 89 /* Destination address required */
#define EMSGSIZE 90 /* Message too long */
#define EPROTOTYPE 91 /* Protocol wrong type for socket */
#define ENOPROTOOPT 92 /* Protocol not available */
#define EPROTONOSUPPORT 93 /* Protocol not supported */
#define ESOCKTNOSUPPORT 94 /* Socket type not supported */
#define EOPNOTSUPP 95 /* Operation not supported on transport endpoint */
#define EPFNOSUPPORT 96 /* Protocol family not supported */
#define EAFNOSUPPORT 97 /* Address family not supported by protocol */
#define EADDRINUSE 98 /* Address already in use */
#define EADDRNOTAVAIL 99 /* Cannot assign requested address */
#define ENETDOWN 100 /* Network is down */
#define ENETUNREACH 101 /* Network is unreachable */
#define ENETRESET 102 /* Network dropped connection because of reset */
#define ECONNABORTED 103 /* Software caused connection abort */
#define ECONNRESET 104 /* Connection reset by peer */
#define ENOBUFS 105 /* No buffer space available */
#define EISCONN 106 /* Transport endpoint is already connected */
#define ENOTCONN 107 /* Transport endpoint is not connected */
#define ESHUTDOWN 108 /* Cannot send after transport endpoint shutdown */
#define ETOOMANYREFS 109 /* Too many references: cannot splice */
#define ETIMEDOUT 110 /* Connection timed out */
#define ECONNREFUSED 111 /* Connection refused */
#define EHOSTDOWN 112 /* Host is down */
#define EHOSTUNREACH 113 /* No route to host */
#define EALREADY 114 /* Operation already in progress */
#define EINPROGRESS 115 /* Operation now in progress */
#define ESTALE 116 /* Stale NFS file handle */
#define EUCLEAN 117 /* Structure needs cleaning */
#define ENOTNAM 118 /* Not a XENIX named type file */
#define ENAVAIL 119 /* No XENIX semaphores available */
#define EISNAM 120 /* Is a named type file */
#define EREMOTEIO 121 /* Remote I/O error */
#define EDQUOT 122 /* Quota exceeded */
#define ENOMEDIUM 123 /* No medium found */
#define EMEDIUMTYPE 124 /* Wrong medium type */
#endif
```

## I/O

### String Scanf

可以用作简易匹配读取函数

```cpp
// 提取除 http:// 外的字符串
sscanf(buf, "http://%s", url_part);
```

## SetJMP

- 常用函数

```cpp
int setjmp(jmp_buf env);
void longjmp(jmp_buf env, int val);
```

- 使用：用于 if/else、loop、switch 语句
  1. 直接调用 setjmp 函数时，返回值为 0;
  2. 调用 longjmp 函数时，若 val 值不为 0,则跳转至上次 setjmp 返回值为 0 处，继续向后执行语句
- 功能
  1. 实现非本地(局部)跳转(跨越多层函数调用栈进行跳转)
  2. 实现类 Java 异常机制(异常抛出及捕获)

## Signal

信号处理程序中所有数据应为 volatile 类型

```cpp
_CRTIMP int __cdecl raise(int);
_CRTIMP void (__cdecl * __cdecl signal(int, void (__cdecl *)(int)))(int);
```

## Stdarg

用于编写可变参数函数

```cpp
void printargs(int arg1, ...) /* 输出所有int类型的参数，直到-1结束 */
{
    va_list ap;
    int i;
    va_start(ap, arg1);
    for (i = arg1; i != -1; i = va_arg(ap, int))
    printf("%d ", i);
    va_end(ap);
    putchar('\n');

}
```

## Stddef

- 宏
  - NULL Null 指针常量
  - `offsetof(type, member-designator)`
    获得字段在结构体中的偏移量
- 类型
  - `ptrdiff_t`
    带符号的整数类型, 用来表示指针相减的结果类型
  - `wchar_t`
    宽字符类型
  - `size_t`
    无符号整数类型, 用来表示 sizeof 操作符的结果类型

## Assert

- 关闭断言

```cpp
#define NDEBUG
#include <assert.h>
```

- 开启断言

```cpp
#undef NDEBUG
#include <assert.h>
```

## GCC

- -E: cpp(c preprocessor) 预处理 => .i
- -S: cll 编译 => .s
- -c: as(assemble) 汇编 => .o
- -time Time the execution of each subprocess
- `-std=<standard>` Assume that the input sources are for `<standard>`
- `-B <directory>` Add `<directory>` to the compiler's search paths
- -v Display the programs invoked by the compiler
- `-o <file>` Place the output into `<file>`
- -shared Create a shared library
- `-Wall`
- `-v --help`

## GDB

### Commands

- r(run)
- l(list)
- b(break)
  - b line_num
  - b filename:line_num
- display/format address

e.g. `display $pc`/`i $pc`.

- t 按二进制格式显示变量.
- d 按十进制格式显示变量.
- o 按八进制格式显示变量.
- u 按十六进制格式显示无符号整型.
- x 按十六进制格式显示变量.
- a 按十六进制格式显示变量.
- f 按浮点数格式显示变量.
- c 按字符格式显示变量.
- s 按字符串格式显示变量.
- disas 显示汇编代码.
- x /num-size-format `$pc`/rsp/rbp.

e.g. size:w(2 字节) format:x/d/s(十六进制/十进制/字符串)
2wx

- examine - 查看内存
  n、f、u 是可选的参数
  - n 是一个正整数，表示显示内存的长度，也就是说从当前地址向后显示几个地址的内容。
  - f 表示显示的格式，参见上面。如果地址所指的是字符串，那么格式可以是 s，如果地十是指令地址，那么格式可以是 i。
  - u 表示从当前地址往后请求的字节数，如果不指定的话，GDB 默认是 4 个 bytes.
    u 参数可以用下面的字符来代替，b 表示单字节，h 表示双字节，w 表示四字节，g 表示八字节.
    当我们指定了字节长度后，GDB 会从指内存定的内存地址开始，读写指定字节，并把其当作一个值取出来.
    表示一个内存地址.

> 命令：x/3uh 0x54320 表示，从内存地址 0x54320 读取内容，h 表示以双字节为一个单位，3 表示三个单位，u 表示按十六进制显示。

- s step into
  - step1 下一条汇编指令
- n next line
- p print
- q quit
- up last stack
- bt(back trace) function stack 显示堆栈回溯信息
- info breakpoints/register

### Set

- set disassembly
- set variable

### Shell

shell command

### Core Dump

```bash
ulimit -c unlimited
gdb -c core_file_path target_exe_path
```

### Disasm

- CS Segment

```bash
(gdb) disass
(gdb) x/i
(gdb) x/5i $pc
(gdb) ni/si
```

- Registers

```bash
(gdb) i r
(gdb) i r a
(gdb) i r ds
```

- DS Segment
- SS Segment

### Stack Frame

```bash
(gdb) bt
(gdb) frame n
(gdb) info locals
```

## Style Guide

### Abbreviations

| 原词           | 缩写        |
| :------------- | :---------- |
| addition       | add         |
| answer         | ans         |
| array          | arr         |
| average        | avg         |
| buffer         | buf 或 buff |
| capture        | cap 或 capt |
| check          | chk         |
| count          | cnt         |
| column         | col         |
| control        | ctrl        |
| decode         | dec         |
| define         | def         |
| delete         | del         |
| destination    | dst 或 dest |
| display        | disp        |
| division       | div         |
| encode         | enc         |
| environment    | env         |
| error          | err         |
| float          | flt         |
| frequency      | freq        |
| header         | hdr         |
| index          | idx         |
| image          | img         |
| increment      | inc         |
| initialize     | init        |
| iteration      | itr         |
| length         | len         |
| memory         | mem         |
| middle         | mid         |
| make           | mk          |
| message        | msg         |
| multiplication | mul         |
| number         | num         |
| operand        | opnd        |
| optimization   | opt         |
| operator       | optr        |
| packet         | pkt         |
| position       | pos         |
| previous       | pre/prev    |
| payload        | type        |
| pointer        | ptr/pt      |
| return         | code        |
| record         | rcd/rc      |
| receive        | recv        |
| result         | res         |
| return         | ret         |
| source         | src         |
| stack          | stk         |
| string         | str         |
| subtraction    | sub         |
| table          | tab         |
| temporary      | tmp 或 temp |
| total          | tot         |
| time           | stamp       |
| value          | val         |

### Macro

尽量添加足够的括号,减少宏定义的二义性:

- `#`: 字符串化
- `##`: 强制连接符
- `do { ... } while (0)`: 防止语法错误

## Best Practices

### Header File

防止其他文件重复 `#include` 本文件

```cpp
#ifndef MONGOOSE_HEADER_INCLUDED
#define MONGOOSE_HEADER_INCLUDED

/*.................................
 * do something here
 *.................................
 */

#endif /* MONGOOSE_HEADER_INCLUDED */
```

- 除了全局共享静态变量外, 头文件中的定义不允许申请实际的内存单元.
- 缺少标准库头文件:
  - 缺少函数原型: **链接成功**, 链接器自动装载库函数，不影响程序执行 **只警告，不报错**
  - 缺少宏定义: **链接失败**, 宏定义会被识别为函数，但链接器查找不到相应库函数
  - 覆盖标准库函数原型:
    - 定义过多参数原型，调用时传入过多参数，函数正确执行(无视多余参数)
    - 定义缺少参数原型，调用时传入不完整参数，函数错误执行，误把 0xc(%ebp)，0x10(%ebp)，…等更多内存单元当作函数参数

### 检查

#### 边界检查

- 空/满栈检查
- 参数合法性检查 e.g. elemSize > 0 检查

#### 指针检查

- Alloctor 失败，需添加 NULL 检查:
  - assert
  - exit

## Library

- 用于创建代码文档资料的 NDoc
- 用于生成解决方案的 NAnt
- 用于生成代码的 CodeSmith
- 用于监视代码的 FxCop
- 用于编译少量代码的 Snippet Compiler
- 两种不同的转换器工具：ASP.NET 版本转换器和 Visual Studio .NET 项目转换器
- 用于生成正则表达式的 Regulator
- 用于分析程序集的 .NET Reflector
- 用于单元测试的 NUnit
- Valgrind: 内存分析工具.

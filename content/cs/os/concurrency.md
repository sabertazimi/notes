---
sidebar_position: 6
tags: [CS, System, OS, Concurrency, Synchronization, Thread, Mutex, Semaphore]
---

# Concurrency

## 同步互斥

- 互斥 (Mutual Exclusion)
- 死锁 (Deadlock)
- 饥饿 (Starvation)

## 临界区的访问原则

- 空闲则入
- 忙则等待
- 有限等待

## 基于软件方法的同步互斥

```cpp
int turn; // 表示谁该进入临界区
bool flag[]; // 表示进程是否准备好进入临界区
```

```cpp
// 对于 2 个线程的情况
// Peterson Algorithm
// 线程 i
flag[i] = true;
turn = j; // 后设置 turn 标志的进程不可进入临界区, 会在 while 循环进行等待
while (flag[j] && turn == j) ;

...// critical section

flag[i] = false;
```

```cpp
// Dekkers Algorithm
// 线程 i
turn = 0;
flag[] = {false};

do {
  flag[i] = true;
  while (flag[j] == true) {
    if (turn != i) {
      flag[i] = false;
      while (turn != i) ;
      flag[i] = true;
    }
  }

  // critical section

  turn = j;
  flag[i] = false;
} while (true);
```

## Lock and Semaphore

利用原子操作实现互斥数据结构

```cpp
struct lock/semaphore {
  bool locked/sem = n; // n: 并发数/可用资源数
  wait_queue q;

  void acquire/prolaag() {
    locked/sem--;
    if (locked/sem < 0) sleep_and_enqueue(this_thread);
  };

  void release/verhoog() {
    locked/sem++;
    if (locked/sem <= 0) wakeup_and_dequeue(other_thread);
  };
};
```

## Monitor

- 与 semaphore 相反, 初始 0, `wait(++ && sleep)`, `signal(-- && wakeup)`
- 管程内可以中断执行, 并 notify 其他等待线程

## 死锁

非抢占持有互斥循环等待

防止死锁: 每对互斥锁(s, t), 每个线程顺序请求锁, 逆序释放锁

## Mutex

### Mutual Exclusion and Spinlock

- 当资源等待的时间较长,
  用互斥锁让线程休眠,
  会消耗更少的资源。
- 当资源等待的时间较短时,
  使用自旋锁将减少线程的切换,
  获得更高的性能。

### Readers–writer Lock

- 读写锁允许同一时刻被多个读线程访问。
- 写线程访问时, 所有的读线程和其他的写线程都会被阻塞。
- 读读不互斥, 读写互斥, 写写互斥。

## Prolaag and Verhoog

### Prolaag Semaphore

- 关中断。
- 判断当前信号量的 value 是否大于 0。
- 如果是> 0, 则表明可以获得信号量,
  故让 value 减一, 并打开中断返回。
- 如果不是> 0, 则表明无法获得信号量,
  故需要将当前的进程加入到等待队列中,
  并打开中断, 然后运行调度器选择另外一个进程执行。
- 如果被 V 操作唤醒,
  则把自身关联的 wait 从等待队列中删除
  (此过程需要先关中断, 完成后开中断).

### Verhoog Semaphore

- 关中断。
- 如果信号量对应的 wait queue 中没有进程在等待,
  直接把信号量的 value 加一，然后开中断返回。
- 如果有进程在等待且进程等待的原因是 semaphore 设置的,
  则调用 `wakeup_wait` 函数将 wait queue 中等待的第一个 wait 删除,
  且把此 wait 关联的进程唤醒, 最后开中断返回。

## 管程

管程由四部分组成：

- 管程内部的共享变量(mutex):
  一个二值信号量,
  是实现每次只允许一个进程进入管程的关键元素,
  确保了互斥访问性质。
- 管程内部的条件变量:
  通过执行 `wait_cv`, 会使得等待某个条件 C 为真的进程能够离开管程并睡眠,
  且让其他进程进入管程继续执行;
  而进入管程的某进程设置条件 C 为真并执行 `signal_cv` 时,
  能够让等待某个条件 C 为真的睡眠进程被唤醒, 从而继续进入管程中执行。
- 管程内部并发执行的进程。
- 对局部于管程内部的共享数据设置初始值的语句。
- 成员变量信号量 `next`:
  配合进程对条件变量 cv 的操作而设置的,
  由于发出 `signal_cv` 的进程 A 会唤醒睡眠进程 B,
  进程 B 执行会导致进程 A 睡眠,
  直到进程 B 离开管程,
  进程 A 才能继续执行,
  这个同步过程是通过信号量 `next` 完成。
- 整形变量 `next_count`:
  表示由于发出 `signal_cv` 而睡眠的进程个数。

```cpp
typedef struct monitor{
    // 管程内部的共享变量
    // 用于让进程互斥地进入管程
    semaphore_t mutex;
    // 用于发出信号后的进程睡眠
    semaphore_t next;
    int next_count;     // 由于发出 signal 而睡眠的进程个数
    proc condvar_t *cv; // 管程内的条件变量
} monitor_t;
```

### Conditional Variable

- wait_cv： 被一个进程调用, 以等待断言 Pc 被满足后该进程可恢复执行。 进程挂在该条件变量上等待时, 不被认为是占用了管程
- signal_cv：被一个进程调用, 以指出断言 Pc 现在为真, 从而可以唤醒等待断言 Pc 被满足的进程继续执行
- 信号量 sem: 用于让发出 wait_cv 操作的等待某个条件 C 为真的进程睡眠, 而让发出 signal_cv 操作的进程通过这个 sem 来唤醒睡眠的进程
- count: 表示等在这个条件变量上的睡眠进程的个数
- owner: 表示此条件变量的宿主是哪个管程

```cpp
typedef struct condvar{
// 用于让进程在该条件变量上睡眠
semaphore_t sem;
int count; // 等在该条件变量上的睡眠进程个数
condvar monitor_t * owner; // 该条件变量属于哪个管程
} condvar_t;
```

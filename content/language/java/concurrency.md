---
sidebar_position: 22
tags: [Language, Java, Concurrency]
---

# Concurrency

## Thread

线程: 分享 CPU、共享内存(多个线程访问同一数据/对象)

线程一般用于需长时间执行的任务: 循环、下载、浏览图片

### Create

创建线程的方法:

- 父类:继承 Thread 类, 重写 run 方法
- 接口:new Thread(Runnable Task)实现 Runnable 接口的类: 实名类/匿名类/Lambda 表达式

### Runnable

thread.start() 线程处于可运行状态: 可能在运行, 可能不在运行, 不必始终保持运行

### Block

- blocked
- waiting
- timed waiting

#### Blocked

获取锁不得时, 进入阻塞状态

#### Waiting

等待调度器时, 进入等待状态

#### Timed waiting

调用含超时参数的方法时, 进入计时等待状态保持到超时或通知

Object.wait、Thread.sleep、Thread.join、Lock.tryLock、Condition.await

### Terminated

run 方法正常退出或抛出未捕获异常时, 进入(自然/意外)死亡状态

### 优先级

- 默认情况下继承父线程的优先级
- 需防止低优先级线程被饿死(因此不要依赖优先级进行编程)
- MIN_PRIORITY(1)~NORM_PRIORITY(5)~MAX_PRIORITY(10)
- 每当线程调度器选择新线程时,首选具有较高优先级的线程

### Daemon

- Thread.setDaemon(true)
- 设置为后台线程: 随时可能中断
- 虚拟机会在只有后台线程时退出,后台线程不可访问固有资源(文件、数据库等)

### 未捕获异常

实现 Thread.UncaughtExceptionHandler 接口

不安装默认处理器时,默认处理器为空

## 中断

### Interrupt

对一个线程调用此方法时,线程将进入中断状态

### Interrupted Exception

对一个阻塞线程(调用 sleep/wait 方法等)调用 interrupt 方法时, 抛出此异常

## 同步

两个线程都有多个语句, 无法保证一个线程所有语句全部执行完再调用另一个线程,必然会出现交错调用不同线程中的语句现象, 导致调用混乱现象

### 锁对象 (实例域)

可重复(持有计数), 可共用(共用锁对象的方法可互相调用)

### 条件对象 (实例域)

管理有锁却不能正常工作的线程

一个锁对象可以有多个相关的条件对象

### 内部锁

- synchronized 关键字
- 每个对象都有一个内部锁, 可将静态方法声明为 synchronized
- 等价于 wait/notifyAll
- 等价于 await/signalAll

### 截获内部锁

### 读写锁

### 监视器

### volatile 关键字:修饰实例域

声明一个域可并发更新,通知编译器和虚拟器注意此特性

### 死锁

所有线程处于等待或阻塞状态

e.g. 两个线程互相等待状态

### Thread Local Helper

## 线程安全

`java.util.concurrent` 并发 API: 线程安全(同时只有一个线程调用某对象)

### 原子整数

```java
AtomicInteger.getAndIncrement();    // cnt++
AtomicInteger.getAndDecrement();    // cnt—
AtomicBoolean
AtomicLong
AtomicReference
```

### 集合

- 阻塞队列
- 高效映射表、队列
- 写数组列表和写数组集的拷贝 - CopyOnWriteArrayList 类、CopyOnWriteArraySet 类
- 同步包装器(synchronization wrapper) - 任何集合类通过同步包装器变成线程安全集合类

## 异步计算

### 执行器

线程池: 创建大量生命周期短的线程

- CachedThreadPool: 提交任务多, 创建新线程
- FixedThreadPool: 提交任务多, 等待当前任务完成再运行其他任务
- SingleThreadExecutor: 逐一执行提交任务
- ScheduledExecutorService 接口: 预定执行/重复执行任务

以上工厂方法返回: 实现 ExecutorService 接口的 ThreadPoolExecutor 对象

- 创建

```java
ExecutorService pool = Executors.newCachedThreadPool();
```

- 方法

```java
pool.execute(myTask);
pool.shutdown();
```

- Future 对象用于查询任务完成情况

## Swing

事件分配线程不应进行 input/output/sleep 调用(可能使线程阻塞)

- Timer 类(亦是线程): 每隔一段时间重复执行 MyTask
- 更新图形化界面: SwingUtilities.invokeLater(Runnable MyTask);

```java
EventQueue.invokeLater(new Runnable()
{
public void run()
{
    Statements;
}
});
```

- 指定布局(Layout)

以下可合成一个方法:

- 创建组件(Component)
- 添加组件(getContentPane.add(Component) //得到 Container 类)
- 响应事件(Event)
- 设置属性(size、location、bounds、locationByPlatform、title、iconImage、visible、resizable、undecorated、extendedState)

```java
// 取得点击按钮的名字
String itemName = ((JRadioButton) e.getSource()).getText();
// Source: 事件源(点击按钮事件)
```

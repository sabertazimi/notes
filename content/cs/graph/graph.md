---
tags: [CS, System, Architecture, Graph Processing]
---

# Graph Processing

## Graph System

| Classification | In-memory  | Out-of-core |
| :------------: | :--------: | :---------: |
| Single machine |   Ligra    |  GraphChi   |
|                |  Polymer   |  X-Stream   |
|                |   Galois   |  GridGraph  |
|                |            |   Mosaic    |
|  Distributed   |   Pregel   |    Chaos    |
|                | PowerGraph |             |
|                | PowerLyra  |             |
|                |   Gemini   |             |

## NUMA

引入了 Node 和 Distance:

- 对于 CPU 和 Memory 这两种最宝贵的硬件资源,
  NUMA 用近乎严格的方式划分了所属的资源组 (Node), 而每个资源组内的 CPU 和 Memory 几乎相等
- 资源组的数量取决于物理 CPU 的个数
- Distance 用来定义各个 Node 之间调用资源的开销, 为资源调度优化算法提供数据支持

每个进程(或线程)都会从父进程继承 NUMA 策略, 并分配有一个优先 node. 如果 NUMA 策略允许的话，进程可以调用其他 node 上的资源.

### CPU

- CPU Node Bind: 规定进程运行在某几个 node 之上
- Physical CPU Bind: 精细地规定进程运行在哪些核上

### Memory

- Local Allocation: 从当前 Node 上请求分配内存
- Preferred: 比较宽松地指定了一个推荐的 node 来获取内存, 如果被推荐的 node 上没有足够内存, 进程可以尝试别的 node
- Memory Bind: 可以指定若干个 node,进 程只能从这些指定的 node 上请求分配内存
- Interleave: 规定进程从指定的若干个 node 上以 RR (Round Robin) 交织地请求分配内存

NUMA 默认的内存分配策略是优先在进程所在 CPU 的本地内存中分配, 会导致 CPU 节点之间内存分配不均衡.
当某个 CPU 节点的内存不足时, 会导致 swap 产生, 而不是从远程节点分配内存, 这就是 **swap insanity** 现象

### Toolchain

```bash
grep -i numa /var/log/dmesg
```

```bash
sudo apt install -y numactl
numactl --show
numactl --hardware
numactl --interleave=all
```

```bash
numastat
```

## Dataset

- [LiveJournal social network](http://snap.stanford.edu/data/soc-LiveJournal1.html)
- [twitter rv](http://an.kaist.ac.kr/traces/WWW2010.html)
- [us road](http://www.dis.uniroma1.it/challenge9/download.shtml)

## GCC

### Strict-alias Warnings

for strict-aliasing warnings:

1. use a union to represent the memory need to reinterpret
2. use a reinterpret_cast, cast via `char *` at the point where reinterpret
   the memory - `char *` are defined as being able to alias anything
3. use a type which has `__attribute__((__may_alias__))`
4. turn off the aliasing assumptions globally using -fno-strict-aliasing

## Time Stamp Counter

- [definition](http://en.wikipedia.org/wiki/Time_Stamp_Counter)

### RDTSC

### Clock Get Time

```bash
gcc *.c -o *.o ... -lrt # link with librt
```

```cpp
#include <time.h>

struct timespec ts;
clock_gettime(CLOCK_MONOTONIC, ts);
printf("%d %d", ts.tv_sec, ts.tv_nsec);
```

## Library

### Concurrency

- [TaskFlow](https://github.com/cpp-taskflow/cpp-taskflow)

### Performance

- [FlameGraph](https://github.com/brendangregg/FlameGraph)
- [Intel PCM](https://software.intel.com/en-us/articles/intel-performance-counter-monitor)
- [PAPI](https://www.icl.utk.edu/publications/papi-portable-interface-hardware-performance-counters)

### Parallelism

- [OpenMP](https://www.openmp.org)

### Math

- [Lib BLAS](http://www.netlib.org/blas/)

### DRAMSim2

- [Overview of DRAMSim2’s Memory Structure](https://cinwell.wordpress.com/2013/09/25/general-overview-of-dramsim2s-memory-structure/)

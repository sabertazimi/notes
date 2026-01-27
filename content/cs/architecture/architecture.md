---
tags: [CS, Architecture]
---

# Architecture

## SuperPipeline and SuperScalar

A superpipeline processor own a 5-20 stage pipeline,
a superscalar issues 3-8 instructions in parallel
(more functional units like integer/float units).

### Instructions Dependencies and Latencies

The number of cycles between when an instruction reaches the execute stage
and when its result is available for use by other instructions is called the
instruction's latency.
The deeper the pipeline, the more stages and thus the longer the **latency**.
The processor will need to stall the execution of the instructions until
their data is available (**dependencies**),
inserting a bubble into the pipeline where no work gets done, making multiple
issue in this case impossible.

### Branch Prediction

Another key problem for pipelining is branches
(flush out all instructions of wrong branch).
Unfortunately, even the best branch prediction techniques are sometimes wrong,
and with a deep pipeline many instructions might need to be cancelled.
This is called the mispredict penalty.
The deeper the pipeline, the further into the future you must try to predict,
the more likely you'll be wrong,
and the greater the mispredict penalty when you are.

Predication can be used to eliminate branches such as `cmovle`
(move data only when testing flag stays less or equal state).
The Alpha architecture had a conditional move instruction from the very beginning.
MIPS, SPARC, x86 added it later and the ARM architecture
was the first architecture with a **fully predicated** instruction set
(though the early ARM processors only had short pipelines and small mispredict penalties).

## VLIW

Very long instruction word:
In cases where backward compatibility is not an issue,
it is possible for the instruction set itself to be designed
to explicitly group instructions to be executed in parallel.
A VLIW processor's instruction flow is much like a super-scalar,
except the decode/dispatch stage is much simpler
and only occurs for each group of sub-instructions.
No VLIW designs have yet been commercially successful as mainstream CPUs.

## Out of Order Execution

If branches and long-latency instructions are going to cause bubbles in the pipeline(s),
then perhaps those empty cycles can be used to do other work.
To achieve this, the instructions in the program must be reordered
(**instruction scheduling** and **register renaming**).
Compiler completes static instruction scheduling
(rearranged instruction stream at compile time),
processor completes dynamic instruction scheduling
(renaming registers and reorder instruction stream at runtime).
The processor must keep a mapping of the instructions
in flight at any moment and the physical registers they use.
The extra logic of scheduler is particularly **power-hungry**
because those transistors are **always** working.

### The Brainiac vs Speed-demon Debate

Brainiac designs are at the smart-machine end of the spectrum,
with lots of OOO hardware trying to squeeze every last drop of
instruction-level parallelism out of the code,
even if it costs millions of logic transistors and years of design effort to do it.
In contrast, speed-demon designs are simpler and smaller,
relying on a smart compiler and willing to sacrifice a little bit of
instruction-level parallelism
for the other benefits that simplicity brings.
Which would you rather have: 4 powerful brainiac cores, or 8 simpler in-order cores?
When it comes to the brainiac debate,
many vendors have gone down one path then changed their mind and switched to
the other side.

### Power Wall and ILP Wall

Power usage goes up even faster than clock speed does
(increasing clock speed by 20% with 50% more power usage,
O(power) = `frequency * Voltage * Voltage`).
Leakage current also goes up as the voltage is increased,
leakage generally goes up as the temperature increases as well.
The power and heat problems become unmanageable,
because it's simply not possible to provide that much power and cooling to a
silicon chip.
Thus, going purely for clock speed is not the best strategy.

normal programs just don't have a lot of fine-grained parallelism in them,
due to a combination of load latencies, cache misses,
branches and dependencies between instructions.
This limit of available instruction-level parallelism is called the ILP wall.

### Decoupled x86 micro-architecture

Dynamically decode the x86 instructions into simple,
RISC-like micro-instructions (μops, pronounced "micro-ops"),
which can then be executed by a fast,
RISC-style register-renaming OOO superscalar core.
The pipeline depth of Core i*2/i*3 Sandy/Ivy Bridge
was shown as 14/19 stages in the earlier section on superpipeline,
it is 14 stages when the processor is running from its L0 μop cache
(which is the common case),
but 19 stages when running from the L1 instruction cache
and having to decode x86 instructions and translate them into μops.

## SMT

Hardware threads:
Even the most aggressively brainiac OOO superscalar processor
will still almost never exceed an average of about 2-3 instructions per cycle
when running most mainstream, real-world software,
due to a combination of load latencies, cache misses,
branching and dependencies between instructions.

Simultaneous multi-threading (**SMT**) is a processor design technique
which exploits thread-level parallelism
(other running programs, or other threads within the same program).
The instructions come from multiple threads running at the same time,
all on the one processor core.
An SMT processor uses just one physical processor core
to present two or more logical processors to the system.
Separate units include the program counter, the architecturally-visible registers,
the memory mappings held in the TLB,
shared units include the decoders and dispatch logic,
the functional units, and the caches.
SMT is essentially a way to **convert TLP into ILP**.

However, in practice, at least for desktops, laptops, tablets, phones and small servers,
it is rarely the case that several different programs
are actively executing at the same time,
so it usually comes down to just the **one task**
the machine is currently being used for.
Some applications, such as database systems, image and video processing,
audio processing, 3D graphics rendering and scientific code,
do have obvious high-level (coarse-grained) parallelism available and easy to exploit,
but many of these applications which are easy
to parallelize are primarily limited by **memory bandwidth**, not by the processor.

If one thread saturates just one functional unit which the other threads need,
it effectively stalls all of the other threads,
even if they only need relatively little use of that unit.
**Competition** between the threads for cache space may produce worse results
than letting just one thread have all the cache space available,
particularly for software where the critical working set is highly cache-size sensitive,
such as hardware simulators/emulators, virtual machines and high-quality video encoding.

Due to above 3 reasons, SMT performance can actually
be worse than single-thread performance
(traditional context switching between threads) sometimes.

### More cores or Wider cores

Very wide superscalar designs scale very badly
in terms of both chip area and clock speed,
so a single 10-issue core would actually
be both larger and slower than two 5-issue cores:

- the complex multiple-issue dispatch logic scales up as (issue width)^2
- highly multi-ported register files
  and caches to service all those simultaneous accesses

Today, a "typical" SMT design implies both a wide execution core
and OOO execution logic,
including multiple decoders,
the large and complex superscalar dispatch logic and so on.
For applications with lots of active but **memory-latency-limited** threads
(database systems, 3D graphics rendering),
more **simple cores** would be better
because big/wide cores would spend most of their time waiting for memory anyway.
For **most applications**, however,
there simply are not enough threads active to make this viable,
and the performance of just a single thread is much more important,
so a design with **fewer but bigger, wider**, more brainiac cores is more appropriate.

Intel's Xeon Haswell, the server version of Core `i*4` Haswell,
uses 5.7 billion transistors to provide 18 cores (up from 8 in Xeon Sandy Bridge),
each a very aggressively brainiac 8-issue design (up from 6-issue in Sandy Bridge),
each still with 2-thread SMT.
IBM's POWER8 uses 4.4 billion transistors to
move to a considerably more brainiac core design than POWER7,
and at the same time provide 12 cores (up from 8 in POWER7),
each with 8-thread SMT (up from 4 in POWER7).

In the future we might see **asymmetric designs**,
with one or two big, wide,
brainiac cores plus a large number of smaller, narrower, simpler cores.
IBM's Cell processor (used in the Sony PlayStation 3)
was arguably the first such design,
but unfortunately it suffered from severe programmability problems
because the ISA incompatible between small cores and large main core
and had limited by awkward access to main memory.
Some modern ARM designs also use an asymmetric approach,
with several large cores paired with one or a few smaller, simpler "companion" cores,
to increase battery life.

## DLP

data-level parallelism:
Rather than looking for ways to execute groups of instructions in parallel,
the idea is to look for ways to make one instruction
apply to a group of data values in parallel.

### SIMD Vector Instructions

One of DLP methods called **SIMD** parallelism (single instruction, multiple data).
More often, it's called **vector processing**.
With some thought, a small set of vector instructions
can enable some impressive speedups,
such as packing/unpacking, byte shuffling, bit masking instructions,
just like x86 Matrix Math Extensions (MMX),
Streaming SIMD Extensions (SSE),
and ongoing revisions of Advanced Vector Extensions (AVX).
MMX provide 64-bit vectors, x86 SSE added 8 new 128-bit registers,
then widened to 256 bits with AVX.

## Memory

### Wall

Latency is especially bad for loads from memory,
which make up about a quarter of all instructions.
Using a modern SDRAM with a CAS latency of 11,
will typically be **24 cycles of the memory system bus**,
1 to send the address to the DIMM (memory module),
RAS-to-CAS delay of 11 for the row access,
CAS latency of 11 for the column access,
and a final 1 to send the first piece of data up to the processor (or E-cache).
On a multi-processor system, even more bus cycles
may be required to support **cache coherency** between the processors.
There are the cycles within the processor itself,
checking the various on-chip caches before the address
even gets sent to the memory controller, accounting for **20 CPU cycles**.
For 2.4GHz processor and 800MHz SDRAM memory,
summing up to `(1+11+11+1) * 2400/800 + 20 = 92` CPU cycles,
a 4.0 GHz processor would wait a staggering 140 cycles to access main memory.
This problem of the large, and slowly growing,
gap between the processor and main memory is called the memory wall.

### Caches

Modern processors solve the problem of the memory wall with caches.
A cache is a small but fast type of memory located on or near the processor chip.
Its role is to keep **faster copies** of small pieces of main memory,
L1 caches around 8-64K in size, L2 caches around 100K-10M in size,
larger and slower L3 caches.
A modern primary (L1) cache has a latency of just 2 to 4 processor cycles,
with around 90% caches hit rates.

> The memory hierarchy of a modern desktop/laptop: Core i4 Haswell.

| Level      | Size   | Latency (cycles) | Location                   |
| ---------- | ------ | ---------------- | -------------------------- |
| L1 Cache   | 32KB   | 4                | inside each core           |
| L2 Cache   | 256KB  | 12               | beside each core           |
| L3 Cache   | 6MB    | ~21              | shared between all cores   |
| L4 E-Cache | 128MB  | ~58              | separate eDRAM chip        |
| RAM        | 8+GB   | ~117             | SDRAM DIMMs on motherboard |
| Swap       | 100+GB | 10000+           | hard disk or SSD           |

#### Locality

Temporal locality is exploited by merely keeping recently accessed data in the cache.
To take advantage of spatial locality,
data is transferred from main memory up into the cache
in blocks of a few dozen bytes at a time, called a cache line.

#### Layout

Using the virtual address might cause caches
need to be flushed on every context switch (**thrashing**)
(2 programs mapping a same virtual address to different physical address).
Using the physical address means the V2N mapping must be performed,
making every cache lookup slower.
A common trick is to use virtual addresses
for the cache indexing but physical addresses for the tags.
The virtual-to-physical mapping (TLB lookup) can then
be performed in parallel with the cache indexing
so that it will be ready in time for the tag comparison.
Such a scheme is called a virtually-indexed physically-tagged cache.

Set-associative caches are able to avoid some unfortunate cache conflicts.
Unfortunately, the more highly associative a cache is, the slower it is to access.
The instruction L1 cache can afford to be highly set-associative
(prefetching and buffering in pipeline),
but the data L1 cache settled on 4-way set-associative as the sweet spot.
The large L2/L3 cache (LLC for "last-level cache")
is also usually highly associative, perhaps as much as 12- or 16-way.
External E-cache is sometimes direct-mapped for flexibility of size and implementation.

### Latency and Bandwidth

Lower-latency designs will be better for pointer-chasing code,
such as compilers and database systems.
Bandwidth-oriented (adding more memory banks and making the busses wider)
systems have the advantage for programs with simple, linear access patterns,
such as image processing and scientific code.

Latency is much harder to improve than bandwidth.
Synchronously clocked DRAM (SDRAM) allowed pipelining of the memory system.
This reduces effective latency because it allows
a new memory access to be started before the current one has completed,
while an asynchronous memory system had
to wait for the transfer of half a cache line
from the previous access before starting a new request.

## Distributed System

- 小型机是专门设计的硬件和专门设计的软件，只面向这种规模（例如几百颗 CPU）的计算
- 小型机是完全闭源的，不需要考虑扩展性，特定的几种硬件在稳定性上前进了一大步
- x86 的 IO 性能被架构锁死了，各种总线、PCI、PCIe、USB、SATA、以太网，为了个人计算机的便利性，牺牲了很多的性能和可靠性
- 小型机使用总线通信，可以实现极高的信息传递效率，极其有效的监控以及极高的故障隔离速度

x86 服务器基于`网络的分布式`具有天然的缺陷:

- 操作系统决定了网络性能不足
- 网络需要使用事件驱动处理，比总线电路的延迟高几个数量级
- PC 机的硬件不够可靠，故障率高
- 很难有效监控，隔离故障速度慢

## References

- Modern microprocessors: a 90-minute [guide](http://www.lighterra.com/papers/modernmicroprocessors).

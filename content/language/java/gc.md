---
sidebar_position: 23
tags: [Language, Java, GC, Performance, Optimization]
---

# Garbage Collection

## Optimization

GC 优化的核心思路:
尽可能让对象在新生代中分配和回收,
尽量避免过多对象进入老年代,
导致对老年代频繁进行垃圾回收,
同时给系统足够的内存减少新生代垃圾回收次数.

分析系统的运行状况:

- 系统每秒请求数, 每个请求创建多少对象, 占用多少内存
- Young GC 触发频率, 对象进入老年代的速率
- 老年代占用内存, Full GC 触发频率, Full GC 触发的原因, 长时间 Full GC 的原因

## Library

- 监控告警系统: Zabbix、Prometheus、Open-Falcon
- jdk 自动实时内存监控工具: VisualVM
- 堆外内存监控:
  Java VisualVM 安装 Buffer Pools 插件,
  google perf 工具,
  Java NMT (Native Memory Tracking) 工具
- GC 日志分析: GCViewer、gceasy

```bash
# jstat: JVM 自带命令行工具, 可用于统计内存分配速率、GC 次数, GC 耗时
jstat -gc <pid> <统计间隔时间>  <统计次数>

# jmap: JVM 自带命令行工具, 可用于了解系统运行时的对象分布
jmap -histo <pid>
jmap -dump:live,format=b,file=dump.prof <pid>

# 用来查看正在运行的 Java 应用程序的扩展参数
# 包括 Java System 属性和 JVM 命令行参数
jinfo <pid>
```

---
sidebar_position: 24
tags: [Programming, OS, Linux, Debug, Log, Performance, Profile]
---

# Profile

## `dmesg`

```bash
dmesg -T | tail
```

## Journal

### Unit

```bash
journalctl -u <service-name>
```

### Level

```bash
journalctl -p 3
```

### Reverse

```bash
journalctl -r
```

### Entries

```bash
journalctl -n 50
```

### Boot

```bash
last -x shutdown reboot

journalctl -b
journalctl -b -1
journalctl --list-boots
# Last 50 logs from last boot
journalctl -n 50 -b -1
```

### Error

```bash
journalctl -p 3 -xb
journalctl -p 3 -x -b -1
```

### User

```bash
journalctl -xe --user -u <service-name>
```

### Kernel

```bash
journalctl -k -b -0 --no-pager | rg -i "mce|hardware error|reset reason"
journalctl _TRANSPORT=kernel --since "2026-02-25" --no-pager | rg -i "mce|hardware error|reset reason"
```

## Core Dump

```bash
coredumpctl list
coredumpctl info <PID>
```

## `perf`

`perf` [cookbook](http://www.brendangregg.com/perf.html)

```bash
perf list # events
perf stat <command>
perf stat -e <events> <command>
perf record -e <events> -a <command>
perf report
```

```bash
perf record -F 99 -a -g -- sleep 10

perf report -n --stdio
perf report -n -g 'flamegraph'
```

## Stress

```bash
sudo pacman -S s-tui
```

## Toolchain

![Linux Performance Toolchain](./figures/linux-performance-toolchain.png 'Linux Performance Toolchain')

- [`dmesg`](#dmesg).
- [`uptime`](./process.md#uptime).
- [`vmstat`](./process.md#vmstat).
- [`mpstat`](./process.md#mpstat).
- [`pidstat`](./process.md#pidstat).
- [`iostat`](./process.md#iostat).
- [`free`](./process.md#free).
- [`top`](./process.md#top).
- [`iotop`](./process.md#iotop).
- [`sar`](./network.md#sar).

Performance analysis in 60,000 milliseconds
from [Netflix blog](https://netflixtechblog.com/linux-performance-analysis-in-60-000-milliseconds-accc10403c55):

```bash
# Load average
uptime

# Kernel errors
dmesg -T | tail

# Overall stats by time
vmstat 1

# CPU balance
mpstat -P ALL 1

# Process usage
pidstat 1

# Disk I/O
iostat -xz 1

# Memory usage
free -m

# Network I/O
sar -n DEV 1

# TCP stats
sar -n TCP,ETCP 1

# Check overview
top
```

---
sidebar_position: 21
tags: [Programming, OS, Linux, System, Process]
---

# Process

## `uptime`

Average load information:

```bash
uptime
```

## `ps`

Report a snapshot of current processes

```bash
ps aux
ps aux --sort=-%mem

ps -u <username> | grep -v PID | sort -k4 -n -r | head -n 10
ps -u <username> | grep -v PID | awk '{print $1}' | xargs kill -9
```

## `vmstat`

Outputs a snapshot of system resource usage:

- CPU usage
- Context switch times
- Interrupt times (`/proc/interrupts`)
- Running and exclusive process status
- Memory usage
- Swap space
- Disk I/O usage

```bash
vmstat 1
```

## `mpstat`

- CPU usage
- Software interrupt times (`/proc/interrupts`)

```bash
mpstat -P ALL 1
```

## `pidstat`

Process and Thread:

- CPU usage
- Context switch times
- Interrupt times (`/proc/interrupts`)

```bash
pidstat 1
```

## `top`

`top`/`htop`:

- Display tasks
- Average load
- Process status
- CPU usage

`atop`:

- Memory usage
- Disk I/O usage
- Network usage

## `lscpu`

Show `/proc/cpuinfo`.

## `jobs`

List active jobs.

## `bg`

Place a job in the background.

## `fg`

Place a job in the foreground.

## `kill`

Send a signal to a process:

```bash
kill -9 <pid>
```

## `killall`

Kill processes by name.

## `shutdown`

Shut down or reboot the system:

```bash
shutdown now
```

## `pstree`

Outputs a process list arranged in a tree-like pattern.

## Load

Draws a graph showing system load over time:

```bash
xload
tload
```

## `screen`

```bash
screen -S screenName
screen -ls
screen -r
```

- `Ctrl+d`: detach window
- `Ctrl+k`: kill window

## `iostat`

```bash
iostat -xz 1
iostat -xmhy 1 4
```

## `iotop`

```bash
iotop -o
```

## `free`

```bash
free -m
```

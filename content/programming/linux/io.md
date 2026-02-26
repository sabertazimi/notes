---
sidebar_position: 30
tags: [Programming, OS, Linux, I/O, Swap, File, Zip]
---

# I/O

## File

### Cat

concatenate files

### Sort

sort lines of text

### Uniq

report or omit repeated lines

### Wc

print newline, word, and byte counts for each file

### Head and Tail

output the first/last part of a file

```bash
head -n 5 filename
tail -f filename
```

### Tee

read from standard input and write to standard output and files

```bash
[me@linuxBox ~]$ ls /usr/bin | tee ls.txt | grep zip
bunzip2
bzip2
....
```

### Nl

number lines

### Fold

wrap each line to a specified length

### Fmt

a simple text formatter

### Pr

prepare text for printing

### Printf

format and print data

## Compression

### Zip

- `zip -r(目录) 压缩文件 源文件/源目录`.
- `unzip 源文件 -d 指定路径`.

```bash
zip -r archive_name.zip folder_to_compress
unzip archive_name.zip

zipinfo archive_name.zip
unzip -l archive_name.zip
```

### Gz

- `gzip 源文件`.
- `gzip –c 源文件 > 压缩文件`.
- `gzip -r 源目录 将源目录下所有子文件分别单独压缩`.
- `gzip –d(解压缩) 文件`.
- `gunzip 压缩文件`.

### Bz2

不可压缩目录:

- `bzip2 –k(保留源文件) 源文件`.
- `bzip2 –d(解压缩) –k(保留压缩文件) 压缩文件`.
- `bunzip2 –k(保留压缩文件) 压缩文件`.

### Tar

`.tar.gz`/`.tar.bz2`:

`tar [可选参数] 压缩文件(可指定压缩路径) [-c 解压缩路径]源文件/源目录`:

- `-z`: 将 `.tar` 压缩为 `.tar.gz`.
- `-j`: 将 `.tar` 压缩为 `.tar.bz2`.
- `-c`: 打包 `-x` 解打包.
- `-t`: 查看压缩文件.
- `-v`: 显示过程.
- `-f`: 指定压缩文件名.
- `-C`: 指定解压缩路径.
- `-zcvf`/`-zxvf`/`-ztcf`.
- `-jcvf`/`-jxvf`/`-jtvf`.

```bash
tar -xzf archive.tar.gz
```

### 7z

- `a`: add.
- `x`: extract.
- `-r`: recursive.
- `-o`: specific path.
- `-t`: type.

```bash
7z x manager.7z -r -o /home/xx
7z a -t7z -r manager.7z /home/manager/*
```

### UnAr

Decompress files of any format:

```bash
unar archive_name.zip
unar archive_name.7z
unar archive_name.rar
unar archive_name.ISO
unar archive_name.tar.gz
```

### LsAr

Peek files in a compress file of any format:

```bash
lsar -l archive_name.zip
lsar -l archive_name.7z
lsar -l archive_name.ISO
lsar -l archive_name.rar
lsar -l archive_name.tar.gz
```

## Zero Copy

- `read` + `write`: 4 context switch, 4 data copy (2 DMA, 2 CPU).
- `mmap` + `write`: 4 context switch, 3 data copy (2 DMA, 1 CPU).
- `sendfile`: 2 context switch, 3 data copy (2 DMA, 1 CPU).
- scatter and gather `sendfile`: 2 context switch, 2 data copy (1 DMA, 1 SG-DMA).
- 传输大文件 (无法命中内核 PageCache) 使用 `异步 I/O` + `直接 I/O`,
  传输小文件使用 Zero Copy.

```nginx
location /video/ {
    sendfile on;
    aio on;
    directio 1024m;
}
```

## Swap

```bash
dd if=/dev/zero of=/swapfile bs=1G count=4
mkswap /swapfile
swapon /swapfile
```

## Mount

主分区 (primary) 与延伸分区 (extended) 延伸分区可以继续划分成逻辑分区 (logical).

```bash
mount [-t 文件系统][-o 特殊选项] 设备文件名 挂载点(挂载目录/media /misc /mnt)
```

- 无参数: 显示当前挂载设备.
- `-a`: 依据 `/etc/fstab` 文件配置, 自动挂载.

```bash
umount 设备文件名/挂载点
```

```bash
fdisk –l
```

## Repair

```bash
sudo debugfs /dev/sda9
> debugfs: lsdel
```

## Partition

### Fdisk

分区表类型 MBR

n p e l 新 主 逻辑 扩展 分区 w 激活

### Parted

分区表类型 MBR/GPT

- mklabel 选择分区表类型
- print 打印分区信息
- mkpart 新建分区
- rm 删除分区
- unit 选择单位
- quit 结束分区

### Du

```bash
du -sh /home/user
```

## Host System Information

```bash
#!/bin/bash

# Simple print cpu topology

# numactl --hardware
# ls /sys/devices/system/node/node0
# lscpu

function get_nr_processor()
{
    grep '^processor' /proc/cpuinfo | wc -l
}

function get_nr_socket()
{
    grep 'physical id' /proc/cpuinfo | awk -F: '{
            print $2 | "sort -un"}' | wc -l
}

function get_nr_siblings()
{
    grep 'siblings' /proc/cpuinfo | awk -F: '{
            print $2 | "sort -un"}'
}

function get_nr_cores_of_socket()
{
    grep 'cpu cores' /proc/cpuinfo | awk -F: '{
            print $2 | "sort -un"}'
}

echo '===== CPU Topology Table ====='
echo

echo '+--------------+---------+-----------+'
echo '| Processor ID | Core ID | Socket ID |'
echo '+--------------+---------+-----------+'

while read line; do
    if [ -z "$line" ]; then
        printf '| %-12s | %-7s | %-9s |\n' $p_id $c_id $s_id
        echo '+--------------+---------+-----------+'
        continue
    fi

    if echo "$line" | grep -q "^processor"; then
        p_id=`echo "$line" | awk -F: '{print $2}' | tr -d ' '`
    fi

    if echo "$line" | grep -q "^core id"; then
        c_id=`echo "$line" | awk -F: '{print $2}' | tr -d ' '`
    fi

    if echo "$line" | grep -q "^physical id"; then
        s_id=`echo "$line" | awk -F: '{print $2}' | tr -d ' '`
    fi
done < /proc/cpuinfo

echo

awk -F: '{
    if ($1 ~ /processor/) {
        gsub(/ /,"",$2);
        p_id=$2;
    } else if ($1 ~ /physical id/){
        gsub(/ /,"",$2);
        s_id=$2;
        arr[s_id]=arr[s_id] " " p_id
    }
}

END{
    for (i in arr)
        printf "Socket %s:%s\n", i, arr[i];
}' /proc/cpuinfo

echo
echo '===== CPU Info Summary ====='
echo

nr_processor=`get_nr_processor`
echo "Logical processors: $nr_processor"

nr_socket=`get_nr_socket`
echo "Physical socket: $nr_socket"

nr_siblings=`get_nr_siblings`
echo "Siblings in one socket: $nr_siblings"

nr_cores=`get_nr_cores_of_socket`
echo "Cores in one socket: $nr_cores"

let nr_cores*=nr_socket
echo "Cores in total: $nr_cores"

if [ "$nr_cores" = "$nr_processor" ]; then
    echo "Hyper-Threading: off"
else
    echo "Hyper-Threading: on"
fi

echo
echo '===== END ====='
```

## Screen Monitor

### Xrandr

```bash
xrandr -s 1920x1800 # set resolution
```

### Monitor Info

```bash
sudo apt-get install read-edid
sudo get-edid | parse-edid
```

## Touch Pad Synoptics

```bash
synclient TouchpadOff=0
```

## Audio Server

[Pipewire](https://gitlab.freedesktop.org/pipewire/pipewire):

```bash
pactl info | grep "Server Name"
systemctl --user status pipewire

wpctl status
wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+ # 音量增加  5%
wpctl set-volume @DEFAULT_AUDIO_SINK@ 0.5 # 音量设为 50%

pw-top
pw-cli ls Node
pw-cli info <ID>
pw-play <filename>
pw-record <filename>
```

## Bluetooth

```bash
sudo pacman -S bluez bluez-utils
sudo systemctl enable --now bluetooth
```

```bash
bluetoothctl
> help
> power on
> agent on
> default-agent
> scan on
> pair [MAC]
> trust [MAC]
> connect [MAC]
> devices
> exit
```

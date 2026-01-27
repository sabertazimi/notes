---
sidebar_position: 8
tags: [CS, System, OS, Device, I/O, Network]
---

# Device I/O

## 设备管理

- CPU 一般都是通过寄存器的形式来访问外部设备
- 外设的寄存器通常包括控制寄存器、状态寄存器与数据寄存器三类, 分别用于发送命令/读取状态/读写数据.

### CGA EGA and ChromaText Video Buffer

在内存的低 1MB 中, 有许多地址被映射至外部设备, 其中就包含文字显示模块(显卡控制显示器):

- 从 0xB8000 开始, 每 2 个字节表示屏幕上显示的一个字符(80 x 25)
- 前一个字节为 字符 ASCII 码, 后一个字节为
  字符颜色和属性的控制信息
  (back_twinkle, back_r, back_g, back_b, front_light, front_r, front_g, front_b)

### Input and Output

调用 `io_delay()` 函数: 对于一些老式总线的外部设备, 读写 I/O 端口的速度若过快就容易出现丢失数据的现象

![I/O Model](./figures/io-model.png 'I/O Model')

## 系统级 I/O

```cpp
// robust I/O
ssize_t rio_read_n(int fd, void *usr_buf, size_t n) {
    size_t n_left = n;
    ssize_t n_read;
    char *buf_p = usr_buf;

    while (n_left > 0) {
        if ((n_read = read(fd, buf_p, n_left)) < 0) {
            if (errno == EINTR) {
                n_read = 0; // interrupted by signal_handler, re-call read()
            } else {
                return -1;
            }
        } else if (n_read == 0) {
            break;
        }

        n_left -= n_read;
        buf_p += n_read; // remove data from buf_p
    }

    return (n - n_left);
}

ssize_t rio_write_n(int fd, void *usr_buf, size_t n) {
    size_t n_left = n;
    ssize_t n_written;
    char *buf_p = usr_buf;

    while (n_left > 0) {
        if ((n_written = read(fd, buf_p, n_left)) < 0) {
            if (errno == EINTR) {
                n_written = 0; // interrupted by signal_handler, re-call read()
            } else {
                return -1;
            }
        }

        n_left -= n_written;
        buf_p += n_written; // remove data from buf_p
    }

    return n;
}
```

## socket I/O

### 限制

输出函数+输入函数: 中间必须插入 fflush, fseek, fsetpos, rewind
输入函数+输出函数: 中间必须插入 fseek, fsetpos, rewind

### I/O 函数的选择

- sprintf+rio_written: 格式化输出至套接口
- rio_readlineb + sscanf: 格式化输入

## Zero Copy

`read()`: 2 次状态切换, 1 次 CPU Copy, 1 次 DMA Copy.
`write()`: 2 次状态切换, 1 次 CPU Copy, 1 次 DMA Copy.

总计 4 次状态切换, 2 次 CPU Copy, 2 次 DMA Copy.
涉及多次空间切换和数据冗余拷贝, 效率低下，可使用零拷贝技术进行优化:

- `mmap` + `write`: 4 次状态切换, 1 次 CPU Copy, 2 次 DMA Copy.
- `sendfile`: 2 次状态切换, 1 次 CPU Copy, 2 次 DMA Copy.
- `sendfile` + `DMA 收集`: 2 次状态切换, 0 次 CPU Copy, 2 次 DMA Copy (只可读).
- `splice`: 2 次状态切换, 0 次 CPU Copy, 2 次 DMA Copy (只可管道).

## Network

```cpp
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>

int main(int argc, char *argv) {
    char **pp;
    struct in_addr addr;
    struct hostent *host_p;

    if (argc != 2) {
        fprintf(stderr, "usage: %s <domain name or dotted-decimal>\n", argv[0]);
        exit(0);
    }

    if (inet_aton(argv[1], &addr) != 0) {
        host_p = gethostbyaddr((const char*)&addr, sizeof(addr), AF_INET);
    } else {
        host_p = gethostbyname(argv[1]);
    }

    printf("official hostname: %s\n:", host_p->h_name);

    for (pp = host_p->h_aliases; *pp != NULL; pp++) {
        printf("alias: %s\n", *pp);
    }

    for (pp = host_p->h_addr_list; *pp != NULL; pp++) {
        addr.s_addr = ((struct in_addr *)*pp)->s_addr;
        printf("address: %s\n", inet_ntoa(addr));
    }

    exit(0);
}
```

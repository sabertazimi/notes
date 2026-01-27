---
sidebar_position: 9
tags: [CS, System, OS, Filesystem]
---

# Filesystem

File System:

- 分配文件磁盘空间: 分配与管理
- 管理文件集合: 定位, 命名, 文件系统结构
- 数据可靠和安全: 持久化保存, 防止数据丢失(系统崩溃时)
- 基本操作单位: 数据块
- 文件访问模式: 顺序访问/随机访问/索引访问
- 文件系统种类: 磁盘/数据库/日志/网络/分布式/虚拟文件系统

## 文件组成

- 文件头: 文件属性(名称/类型/大小/权限/路径/创建者/创建时间/最近修改时间)
- 文件头: 文件存储位置与顺序
- 文件体: 实际字节序列

## 文件系统基本数据结构

Super Block -> Directory Entry -> vnode/inode

### 文件卷控制块

Super Block:

- 每个文件系统只有一个控制块
- 描述该文件系统全局信息: 数据块(大小等信息), 空余块信息, 文件指针/引用计数

### 目录项

Directory Entry:

- 目录是一类特殊的文件: 其内容为文件索引表(文件名/文件指针), 内部采取哈希表存储
- 目录与文件构成树状结构
- 每个目录项属于一个目录, 一个目录可有多个目录项
- 保存目录相关信息: 指向文件控制块, 父目录/子目录信息

### 文件控制块

vnode/inode:

- 每个文件有一个文件控制块
- 保存该文件详细信息: 访问权限, 所属者/组, 文件大小, 数据块位置(索引)

### 文件描述符

操作系统在打开文件表中维护的打开文件状态与信息:

- 文件指针: 最近一次读写位置
- 文件打开计数(引用计数): 引用计数为 0 时, 回收相关资源
- 文件磁盘位置
- 访问权限

### 打开文件表

- 系统打开文件表: 保存文件描述符
- 进程打开文件表: 指向系统打开文件表某项, 并附加额外信息

## 文件分配

- 分配方式: 连续分配, 琏式分配, 索引分配
- 琏式索引分配: 琏式链接多个索引块
- 多级索引分配: 索引分配 + 多级琏式索引块

## 空闲空间管理

- bit 位图, 链表, 琏式索引: 保存空闲数据块位置与顺序

## 冗余磁盘阵列

Redundant Array of Inexpensive Disks (RAID):

- RAID-0: 磁盘条带化
- RAID-1: 磁盘镜像(冗余拷贝), 提高可靠性
- RAID-4: 带奇偶校验(校验和)的磁盘条带化, 提高可靠性
- RAID-5: 带分布式奇偶校验的磁盘条带化, 减少校验和所在物理磁盘的读写压力
- RAID-6: 每组条带块有两个冗余块, 可以检查到 2 个磁盘错误

## FS 实现

### FS Mount

`sfs_do_mount`函数中:

- 完成了加载位于硬盘上的 SFS 文件系统的超级块 superblock 和 freemap 的工作 l
- 在内存中有了 SFS 文件系统的全局信息

### FS Index

- 对于普通文件，索引值指向的 block 中保存的是文件中的数据
- 对于目录，索引值指向的数据保存的是目录下所有的文件名以及对应的索引节点所在的索引块（磁盘块）所形成的数组

### FS Node

内存 inode 包含了 SFS 的硬盘 inode 信息, 而且还增加了其他一些信息, 这属于是便于进行是判断否改写、互斥操作、回收和快速地定位等作用.
一个内存 inode 是在打开一个文件后才创建的, 如果关机则相关信息都会消失.
而硬盘 inode 的内容是保存在硬盘中的, 只是在进程需要时才被读入到内存中, 用于访问文件或目录的具体内容数据.

```cpp
struct inode {
    union {
        //包含不同文件系统特定inode信息的union成员变量
        struct device __device_info; //设备文件系统内存inode信息
        struct sfs_inode __sfs_inode_info; //SFS文件系统内存inode信息
    } in_info;

    enum {
        inode_type_device_info = 0x1234,
        inode_type_sfs_inode_info,
    } in_type; //此inode所属文件系统类型

    atomic_t ref_count; //此inode的引用计数
    atomic_t open_count; //打开此inode对应文件的个数

    struct fs *in_fs; //抽象的文件系统，包含访问文件系统的函数指针
    const struct inode_ops *in_ops; //抽象的inode操作，包含访问inode的函数指针
};
```

```cpp
struct inode_ops {
    unsigned long vop_magic;
    int (*vop_open)(struct inode *node, uint32_t open_flags);
    int (*vop_close)(struct inode *node);
    int (*vop_read)(struct inode *node, struct iobuf *iob);
    int (*vop_write)(struct inode *node, struct iobuf *iob);
    int (*vop_getdirentry)(struct inode *node, struct iobuf *iob);
    int (*vop_create)(
        struct inode *node,
        const char *name,
        bool excl,
        struct inode **node_store);
    int (*vop_lookup)(struct inode *node, char *path, struct inode **node_store);

    …….

};
```

### Device

利用 `vfs_dev_t` 数据结构，
就可以让文件系统通过一个链接 `vfs_dev_t` 结构的双向链表找到 device 对应的 inode 数据结构，
一个 inode 节点的成员变量 in_type 的值是 0x1234，
则此 inode 的成员变量 in_info 将成为一个 device 结构。
这样 inode 就和一个设备建立了联系，这个 inode 就是一个设备文件

## ELF File Format

```cpp
#include "common.h"
#include <stdlib.h>
#include <elf.h>

char *exec_file = NULL;

static char *strtab = NULL;
static Elf32_Sym *symtab = NULL;
static int nr_symtab_entry;

void load_elf_tables(int argc, char *argv[]) {
  int ret;
  Assert(argc == 2, "run NEMU with format 'nemu [program]'");
  exec_file = argv[1];

  FILE *fp = fopen(exec_file, "rb");
  Assert(fp, "Can not open '%s'", exec_file);

  uint8_t buf[sizeof(Elf32_Ehdr)];
  ret = fread(buf, sizeof(Elf32_Ehdr), 1, fp);
  assert(ret == 1);

  /* The first several bytes contain the ELF header. */
  Elf32_Ehdr *elf = (void *)buf;
  char magic[] = {ELFMAG0, ELFMAG1, ELFMAG2, ELFMAG3};

  /* Check ELF header */
  assert(memcmp(elf->e_ident, magic, 4) == 0); // magic number
  assert(elf->e_ident[EI_CLASS] == ELFCLASS32); // 32-bit architecture
  assert(elf->e_ident[EI_DATA] == ELFDATA2LSB); // little-endian
  assert(elf->e_ident[EI_VERSION] == EV_CURRENT); // current version
  assert(elf->e_ident[EI_OSABI] == ELFOSABI_SYSV || // UNIX System V ABI
      elf->e_ident[EI_OSABI] == ELFOSABI_LINUX); // UNIX - GNU
  assert(elf->e_ident[EI_ABIVERSION] == 0); // should be 0
  assert(elf->e_type == ET_EXEC); // executable file
  assert(elf->e_machine == EM_386); // Intel 80386 architecture
  assert(elf->e_version == EV_CURRENT); // current version

  /* Load symbol table and string table for future use */

  /* Load section header table */
  uint32_t sh_size = elf->e_shentsize * elf->e_shnum;
  Elf32_Shdr *sh = malloc(sh_size);
  fseek(fp, elf->e_shoff, SEEK_SET);
  ret = fread(sh, sh_size, 1, fp);
  assert(ret == 1);

  /* Load section header string table */
  char *section_header_string_table = malloc(sh[elf->e_shstrndx].sh_size);
  fseek(fp, sh[elf->e_shstrndx].sh_offset, SEEK_SET);
  ret = fread(section_header_string_table, sh[elf->e_shstrndx].sh_size, 1, fp);
  assert(ret == 1);

  int i;
  for(i = 0; i < elf->e_shnum; i ++) {
    if(sh[i].sh_type == SHT_SYMTAB &&
        strcmp(section_header_string_table + sh[i].sh_name, ".symtab") == 0) {
      /* Load symbol table from exec_file */
      symtab = malloc(sh[i].sh_size);
      fseek(fp, sh[i].sh_offset, SEEK_SET);
      ret = fread(symtab, sh[i].sh_size, 1, fp);
      assert(ret == 1);
      nr_symtab_entry = sh[i].sh_size / sizeof(symtab[0]);
    }
    else if(sh[i].sh_type == SHT_STRTAB &&
        strcmp(section_header_string_table + sh[i].sh_name, ".strtab") == 0) {
      /* Load string table from exec_file */
      strtab = malloc(sh[i].sh_size);
      fseek(fp, sh[i].sh_offset, SEEK_SET);
      ret = fread(strtab, sh[i].sh_size, 1, fp);
      assert(ret == 1);
    }
  }

  free(sh);
  free(section_header_string_table);

  assert(strtab != NULL && symtab != NULL);

  fclose(fp);
}
```

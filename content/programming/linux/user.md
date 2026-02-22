---
sidebar_position: 13
tags: [Programming, OS, Linux, Security, User, Group]
---

# User

- `w/who`: 查看用户详细信息
- `last`: 显示所有用户登陆信息(/var/log/wtmp)
- `lastlog`: 显示所有用户最后一次登陆时间(/var/log/lastlog)

## 组

### 创建组

groupadd test

### 修改组

groupmod -n test2 test -g

### 删除组

groupdel test2

### 查看组

- groups someUser
- cat /etc/group

```bash
cat /etc/passwd | awk -F [:] ‘{print $4}’
\ |sort|uniq | getent group |awk -F [:] ‘{print $1}’
```

`/etc/passwd` is a configuration file which stores user account information.
It is a plain text-based file containing information like
username, user ID and group ID.

## 用户

### 增加用户

```bash
useradd [options] LOGIN
```

Options:

- -b, --base-dir BASE_DIR 设置基本路径作为用户的登录目录
- -c, --comment COMMENT 对用户的注释
- -d, --home-dir HOME_DIR 设置用户的登录目录
- -D, --defaults 改变设置
- -e, --expiredate EXPIRE_DATE 设置用户的有效期
- -f, --inactive INACTIVE 用户过期后，让密码无效
- -g, --gid GROUP 使用户只属于某个组
- -G, --groups GROUPS 使用户加入某个组(附设组)
- -h, --help 帮助
- -k, --skel SKEL_DIR 指定其他的 skel 目录
- -K, --key KEY=VALUE 覆盖 /etc/login.defs 配置文件
- -m, --create-home 自动创建登录目录
- -l, 不把用户加入到 lastlog 文件中
- -M, 不自动创建登录目录
- -r, 建立系统账号
- -o, --non-unique 允许用户拥有相同的 UID
- -p, --password PASSWORD 为新用户使用加密密码
- -s, --shell SHELL 登录时候的 shell
- -u, --uid UID 为新用户指定一个 UID
- -Z, --selinux-user SEUSER use a specific SEUSER for the SELinux user mapping

```bash
useradd -s bash -m testUser
passwd testUser # modify `/etc/passwd`, then add to `/etc/sudoers`

useradd -s /sbin/nologin username
```

`adduser` is a perl script which uses `useradd` binary in back-end,
`adduser` is more user friendly and interactive.

### 修改用户

usermod -d /home/test -G test2 test

- -l 新用户名 旧用户名 修改用户名
- -g 新用户组 目标用户 改变用户所属组

gpasswd -a test test2 将用户 test 加入到 test2 组(附设组)

gpasswd -d test test2 将用户 test 从 test2 组中移出

```bash
usermod -aG sudo <username>
```

### 删除用户

userdel test -r 同时删除用户登录目录(/home/xxx)

### 查看用户

w/who 查看当前登录的所有用户

whoami 查看当前登录用户名

finger apacheUser 查看单个用户信息

### 限制用户

- passwd -l 用户名 锁定用户
- passwd -u 用户名 解锁用户
- passwd -d 用户名 清除用户密码

## Common Privilege

- chown 用户名：组名 文件名
- chgrp 组名 文件名
- umask 存储位置 ——/etc/profile
- 文件默认权限 = 文件默认最大权限 rw-(666) 减去 umask 值(如----w--w-)(022)
- 目录默认权限 = 目录默认最大权限 rwx(777) 减去 umask 值
- `id <username>`

## ACL Privilege

- 查看分区 ACL 权限是否开启 dumpe2fs -h 设备分区名
- 临时开启分区 ACL 权限 mount -o remount,acl 设备分区名
- 永久开启分区 ACL 权限 /etc/fstab

- setfacl -m (d:默认权限) u/g:用户名/组名:权限(rwx) 文件名
- getfacl 文件名——查看文件 ACL 权限

## Sudo Privilege

/etc/sudoers.tmp

## SetUID and SetGID

可执行程序/目录+普通用户临时获得 root 权限 （rws）:

- chmod 0xxx 取消双权限
- chmod 2xxx 设置 SetGID 权限
- chmod 4xxx 设置 SetUID 权限
- chmod 6xxx 设置双权限

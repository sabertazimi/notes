---
sidebar_position: 14
tags: [Programming, OS, Linux, System, Boot, Grub, SSH, Administration, Monitoring, Crontab, Power]
---

# System

## Information

```bash
sudo pacman -S dmidecode
sudo dmidecode
```

## GRUB

### Boot System

- 自动挂载项 `/etc/fstab`, `etc/rc.local`.
- 自定义脚本: 新建目录 (加入环境变量).
- 自定义别名 `~/.bashrc`.

```bash
genfstab -U /mnt > /mnt/etc/fstab
pacman -S grub efibootmgr
grub-install --target=x86_64-efi --efi-directory=/boot --boot-directory=/boot --removable
# grub-install --target=x86_64-efi --efi-directory=/efi --boot-directory=/efi --removable
# ln -s /efi/grub /boot/grub
grub-mkconfig -o /boot/grub/grub.cfg
```

:::tip[UEFI Mode]

```bash
ls /sys/firmware/efi/efivars
```

:::

### Configuration

`/etc/default/grub`配置文件, 用于一些基本的修改项,
如默认启动项, GRUB 界面等待时长, GRUB 主题 etc.
`info -f grub -n 'Simple configuration'`:

```bash
# Default Startup OS
GRUB_DEFAULT=0

# Default Timeout
GRUB_TIMEOUT=5

# https://github.com/vinceliuice/grub2-themes
GRUB_THEME="/boot/grub/themes/tela/theme.txt"
```

`/etc/grub.d/*`生成`/boot/grub/grub.cfg`的执行脚本 (`update-grub`命令),
可以更细致地修改启动项, 如各个启动项的名称、顺序等.

### Windows Repair

1. `easyBCD` for non-EFI loader.
2. For EFI loader, run command:

```bash
# root commander
bcdedit /set "{bootmgr}" path \EFI\ubuntu\grubx64.efi
```

### Ubuntu Live Repair

```bash
sudo add-apt add-apt-repository ppa:yannubuntu/boot-repair
sudo apt update
sudo apt install boot-repair
boot-repair
```

## SSH

### Key

```bash
ssh-keygen -t rsa
ssh-add ~/.ssh/id_rsa
```

### SSHD

- config file in `/etc/ssh/sshd_config`

```bash
sudo systemctl reload sshd
sudo service restart sshd
```

```bash
AllowUsers root
AllowUsers sabertaz
```

### Config File

`~/.ssh/config`:

- Host 别名
  - HostName 主机名(ip) `ssh user@ip`
  - Port 可忽略
  - User 登录用户名 `ssh user@ip`
  - PreferredAuthentications publicKey
  - IdentityFile 密钥文件完整路径 `ssh -i file`

```bash
Host github.com
  HostName github.com
  PreferredAuthentications publicKey
  IdentityFile ~/.ssh/id_rsa
Host cs.github.com
  HostName github.com
  PreferredAuthentications publicKey
  IdentityFile ~/.ssh/cs
Host cloud
    HostName xx.org
    User  root
    IdentityFile ~/.ssh/dsl_private_key
Host bwg
    HostName 23.106.150.152
    User root
    Port 29692
```

```bash
git clone git@github.com:user/repo
git clone git@cs.github.com:user/repo
```

```bash
ssh -qTfnN -D 1080 bwg
google-chrome socks5 127.0.0.1 1080
```

### Key File

Set up [SSH key](https://github.com/appleboy/ssh-action):

```bash
# Generate SSH key
ssh-keygen -t ed25519 -a 200 -C "your_email@example.com"

# Add SSH public key to remote host
cat ~/.ssh/id_ed25519.pub | ssh b@B 'cat >> ~/.ssh/authorized_keys'

# Add SSH public key to remote host
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@192.168.x.xxx

# Copy SSH private key to clipboard
xclip < ~/.ssh/id_ed25519
```

```bash
# Login to remote host
ssh -i sabertaz root@119.29.140.60

# File transfer
sftp -i sabertaz root@119.29.140.60

# Login to database
mysql -h 10.66.135.125 -P 3306 -u root -p
```

### 远程传输文件

```bash
rsync -ax -e 'ssh -c blowfish' /root/start_dir root@x.x.x.x:/root/dest_dir
```

```bash
sshpass -p "$DEPLOY_PASSWORD" \
  scp -o StrictHostKeyChecking=no \
      -P $DEPLOY_PORT \
      -r ./build $DEPLOY_USER@$DEPLOY_ADDR:/var/www/html
```

## Systemctl

```bash
systemctl enable local
```

in `/etc/init.d/local`

```bash
#!/bin/bash
### BEGIN INIT INFO
# Provides:          local
# Required-Start:    $all
# Required-Stop:
# Default-Start:     3 4 5
# Default-Stop:
# Short-Description: Personal start script

sslocal -c shadowsocks.json -d start
```

内存控制

```bash
sysctl vm [-options] CONFIG
swapoff
```

### Custom Service

```bash
sudo vim /etc/systemd/system/ruoyi-server.service
sudo systemctl daemon-reload
sudo systemctl enable --now ruoyi-server
sudo systemctl status ruoyi-server
sudo journalctl -u ruoyi-server -e -f
```

```bash
[Unit]
Description=RuoYi Server Service
After=network.target

[Service]
ExecStart=/usr/bin/java -jar /root/ruoyi-admin.jar
WorkingDirectory=/root
User=root
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

### Systemd Analyze

系统启动性能分析工具, 用于诊断启动时间和服务依赖:

```bash
# 查看总体启动时间
systemd-analyze time
# 按服务启动耗时排序, 找出启动最慢的服务
systemd-analyze blame
# 显示启动关键路径, 找出影响启动时间的瓶颈
systemd-analyze critical-chain
# 生成 SVG 启动依赖图
systemd-analyze plot > boot.svg
# 生成点格式依赖图 (需 graphviz 渲染)
systemd-analyze dot | dot -Tsvg > boot-deps.svg
```

### Verify Unit Files

检查服务配置文件语法:

```bash
systemd-analyze verify [service-file]
```

## Crontab

- `/etc/crontab`
- [Crontab Quick Tutorial](https://linuxtools-rst.readthedocs.io/zh_CN/latest/tool/crontab.html)
- [Crontab Generator](https://crontab.guru)

```bash
crontab -l(list)
crontab -e(establish)
```

- `m,n`: 分隔多个时间.
- `m-n`: 表示时间范围.
- `/n`: 表示每隔 n 时间.
- `天数`与`星期`之间为`逻辑或`关系.
- `/var/spool/cron/user_name/`.
- `/var/log/con`.
- `/etc/cron.*ly`: 时间表.
- `/etc/anacrontab`: 异步时间表.

## Job

### Background

- jobs —— 所有作业
- atq —— 延时作业队列
- at -M(不使用邮件发送运行结果) -f filename deltaTime
- atrm 作业号/名
- bg/fg 作业号/名
- nohup 脚本 & —— 脱离控制台并后台运行脚本
  19 ~ -20 （-20 优先级最高）
- nice -n number 作业号/名
- renice number -p PID

### Startup

- /etc/rc.local —— 系统开机任务
- /etc/profile/ /etc/bash.bashrc —— bash 启动任务/远程登陆任务
- /etc/bash.bashrc —— SSH 连接任务

## Parallel Execution

命令间插入符

- command1;command2 顺序执行，相当于 C 语言中语句结束符
- command1&&command2 命令同时执行(当 1 正确时)或同时不执行(当 1 出错时)
- command1 || command2 只执行一个命令(正确命令)
- command1 | command2 前一正确命令的输出结果作为后一命令的输入结果

> e.g. ls && echo yes >> .log || echo no >> .log

## Power Management

### UPower

Enumerate power devices:

```bash
upower -e
```

Show detailed device information:

```bash
upower -i /org/freedesktop/UPower/devices/battery_BAT0
```

Monitor device changes:

```bash
upower --monitor
upower --monitor-detail
```

### Systemd Power Targets

```bash
systemctl suspend      # Suspend to RAM
systemctl hibernate    # Suspend to disk
systemctl hybrid-sleep # Both RAM and disk
systemctl suspend-then-hibernate
```

### TLP

Advanced power management for Linux (optimize battery life):

```bash
sudo tlp start        # Start battery saving
sudo tlp-stat -s      # Show battery status
sudo tlp-stat         # Show all configuration
```

### CPU Power

CPU frequency and voltage scaling:

```bash
cpupower frequency-info
cpupower frequency-set -g performance  # performance / powersave / conservative
```

### Thermald

Thermal daemon for Intel CPUs:

```bash
systemctl status thermald
```

## Kernel Module

### Blocklist

`/etc/modprobe.d/blacklist.conf`:

```bash
# 禁用蜂鸣器内核模块
blacklist pcspkr
```

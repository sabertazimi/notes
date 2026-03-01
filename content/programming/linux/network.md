---
sidebar_position: 22
tags: [Programming, OS, Linux, Network]
---

# Network

## Certificate

[CertBot](https://github.com/certbot/certbot)
for SSL certificates.

## Wget

- 下载全站资料
- -P 表示下载到哪个目录
- -r 表示递归下载
- -np 表示不下载旁站连接.
- -k 表示将下载的网页里的链接修改为本地链接.
- -p 获得所有显示网页所需的元素

```bash
wget -r -p -np -k -P ~/tmp/ http://java-er.com
```

## IP

| 用途           | net-tool(被淘汰) | iproute2         |
| :------------- | :--------------- | :--------------- |
| 地址和链路配置 | ifconfig         | ip addr, ip link |
| 路由表         | route            | ip route         |
| 邻居           | arp              | ip neigh         |
| VLAN           | vconfig          | ip link          |
| 隧道           | iptunnel         | ip tunnel        |
| 组播           | ipmaddr          | ip maddr         |
| 统计           | netstat          | ss               |

```bash
ip link show
ip address show
ip route show

# add commands to /etc/init.d/local.sh

rm -fr /etc/udev/rules.d/70-persistent-net.rules

# start up network adapter
ip link set eth0 up

# add/delete static ip
ip address add 192.168.1.1/24 dev eth0
ip address del 192.168.1.1/24 dev eth0

# add/delete static route
ip route add 192.168.1.0/24 dev eth0
ip route del 192.168.1.0/24 dev eth0
ip route add default via 192.168.0.196

# watch packets
watch -n 1 "ifconfig eth0"
watch -n 1 "ifconfig eth1"
watch -n 1 "ifconfig eth2"
```

## Network Manager

`nmcli` for CLI tool,
`nmtui` for terminal user interface:

```bash
nmcli dev wifi connect <name> password <password>
```

## Wi-Fi

```bash
lspci -k | grep Network
rfkill list # 查看无线连接是否被禁用 (blocked: yes)
ip link set wlan0 up
rfkill unblock wifi

iwctl # 进入交互式命令行
device list # 列出无线网卡设备名
station wlan0 scan # 扫描网络
station wlan0 get-networks # 列出所有 Wi-Fi 网络
station wlan0 connect wifi-name # 进行连接
exit # 退出交互式命令行
```

## Ufw

```bash
ufw status
ufw enable
ufw allow ssh
ufw allow http
ufw allow https
```

## Iptables

## Fail2ban

## Arp

`arp -a`显示地址解析协议 (IP 地址—网卡地址):

- 网际互联层：IP 协议(网际)、IGMP 协议(互联网组管理)、ICMP 协议(互联网控制报文)
- 传输层：TCP 协议(传输控制)、UDP 协议(用户数据报)

## Netstat

`netstat -an`查看本机启用的端口:

- (-a 查看所有连接和监听端口 -n 显示 IP 地址和端口号)
- -t tcp 协议端口
- -u udp 协议端口
- -l 监听状态服务

## Nslookup

`nslookup domain_name` 查看 DNS 解析器: `/etc/network/interfaces`.

主机名:

- `/etc/hostname`.
- `/etc/sysconfig/network`.
- `/etc/resolv.conf`.

## Ping

`ping -c ip/domain`探测网络状况

## Telnet

`telnet [ip/domain] [端口]`远程管理与端口探测命令

## Traceroute

- `traceroute [-n IP] domain`路由跟踪命令
- `traceroute -n -I -T -p`路由扫描

## Nftables

nftables 命令行工具 (network filter): nft.

## Fping

`fping -a -u -g -f [target]`批量扫描主机地址

## Hping

`hping -p -S -a`可伪造 IP 地址

## Mtr

路由扫描

## Nmap

批量主机服务扫描:

- -P ICMP
- -sS TCP SYN
- -sT TCP connect()
- -sU UDP

## Ncat

批量主机服务扫描:

- -w 设置超时时间
- -v 显示命令执行过程
- -z 一个输入输出模式
- -u UDP 协议

## Socat

```bash
sudo pacman -S socat
# 将本地 8080 端口的流量转发到远程服务器的 80 端口
socat TCP4-LISTEN:8080,fork TCP4:remote-server.com:80
# 读写串口设备
socat - /dev/ttyS0,raw,echo=0,crnl
```

## Sar

Check network interface throughput:

```bash
`sar -n DEV 1`
```

Check key TCP metrics:

```bash
`sar -n TCP,ETCP 1`
```

## GFW

### Hosts

[GitHub520](https://github.com/521xueweihan/GitHub520):

```bash
curl -L https://raw.hellogithub.com/hosts >> /etc/hosts
```

### Client

- [Verge](https://github.com/clash-verge-rev/clash-verge-rev):
  Clash Meta (Mihomo) GUI based on Tauri.
- [Party](https://github.com/mihomo-party-org/clash-party):
  Another Mihomo GUI.
- [ProxyChains](https://github.com/rofl0r/proxychains-ng):
  Proxy any TCP connection.

### Server

- [DuYao](https://duyaoss.com):
  机场测速.
- [Nexitally](https://github.com/winston779/nexitally):
  奶昔机场.
- [Tag](https://github.com/winston779/tagInternet):
  Tag 机场.
- [Flower](https://github.com/winston779/flowercloud):
  花云机场.
- [Sublink](https://github.com/7Sageer/sublink-worker):
  下一代订阅管理中心.
- [SingBox](https://github.com/233boy/sing-box):
  Sing-box server scripts.

### VPN

- [GFWList](https://github.com/gfwlist/gfwlist):
  GFW list.
- [OpenVPN](https://github.com/OpenVPN/openvpn):
  Open source VPN daemon.
- [DockerVPN](https://github.com/hwdsl2/docker-ipsec-vpn-server):
  Docker image to run an IPsec VPN server.

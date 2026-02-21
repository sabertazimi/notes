---
sidebar_position: 12
tags: [Programming, OS, Linux, Distribution, WSL]
---

# WSL

## Installation

[Upgrade to WSL2](https://docs.microsoft.com/windows/wsl/install-manual):

```bash
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Restart computer.

wget https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi
wsl --set-default-version 2
wsl --set-version Ubuntu-22.04 2
wsl -l -v
```

## Connection

[Gzip for WSL2](https://github.com/microsoft/WSL/issues/4461#issuecomment-1174011640):

```bash
echo -en '\x10' | sudo dd of=/usr/bin/gzip count=1 bs=1 conv=notrunc seek=$((0x189))
```

[Winsock for WSL2](https://github.com/microsoft/WSL/issues/4194):

```bash
netsh winsock reset
```

## Proxy

[Network](https://learn.microsoft.com/windows/wsl/networking)
and [proxy](https://zinglix.xyz/2020/04/18/wsl2-proxy)
for WSL2:

```bash
# HostIP=$(cat /etc/resolv.conf | grep nameserver | awk '{ print $2 }')
HostIP=$(ip route show | grep -i default | awk '{ print $3}')
WslIP=$(hostname -I | awk '{print $1}')
Port=1080
PROXY_SOCKS="socks5://${HostIP}:${Port}"

# For Git CLI.
git config --global http.proxy "${PROXY_SOCKS}"
git config --global https.proxy "${PROXY_SOCKS}"

# For GitHub CLI.
export HTTP_PROXY="${PROXY_SOCKS}"
export HTTPS_PROXY="${PROXY_SOCKS}"
```

:::caution[Socks Client]

主机代理客户端需要[允许](https://github.com/microsoft/WSL/issues/4402#issuecomment-570474468)
VLAN (或其他网络) 设备访问本地代理连接.

:::

当本地配置系统代理后，需要更改 WSL2 网络配置:

```ini
# ~/.wslconfig
[wsl2]
networkingMode=mirrored
dnsTunneling=true
firewall=true
autoProxy=true
```

## Wi-Fi

Win 11 MediaTek Wi-Fi 6 delay start:
set `Network Connections` and `WLAN AutoConfig`
to auto-start in services.

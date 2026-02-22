---
sidebar_position: 15
tags: [Programming, OS, Linux, Virtualization, QEMU, KVM]
---

# Virtualization

## Windows Virtual Machine

```bash
sudo pacman -S qemu-full virt-manager swtpm
sudo systemctl enable --now libvirtd
sudo virsh net-start default
sudo virsh net-autostart default

sudo usermod -aG libvirt $(whoami)
sudo sed -i "s/^#user = \"libvirt-qemu\"/user = \"$USER\"/" /etc/libvirt/qemu.conf
sudo sed -i "s/^#group = \"libvirt-qemu\"/group = \"$(id -gn)\"/" /etc/libvirt/qemu.conf
sudo systemctl restart libvirtd
```

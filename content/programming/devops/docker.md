---
tags: [Programming, DevOps, Container, Docker, Internals]
---

# Docker

## Installation

```bash
 sudo apt-get update
 sudo apt-get install \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg \
  lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io
```

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo DRY_RUN=1 sh get-docker.sh
```

```bash
sudo systemctl status docker
sudo usermod -aG docker $USER
```

## Uninstallation

```bash
docker container stop $(docker container ls -aq)
docker system prune -a --volumes
sudo apt purge docker-ce docker-ce-cli containerd.io
sudo apt autoremove
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
```

## Pull

```bash
docker images
docker images -a
docker search <images>
docker pull <images:tag>
```

## Build

```bash
docker build . -t image-name

# use Dockerfile at the root of the repository
docker build <github-repo-url> -t image-name
```

## Run

- `run`.
- `start`.
- `stop`.
- `restart`.

```bash
# docker run -dp <host-port>:<container-port> [docker-image]
docker run -d -p 80:80 --name app-name docker/getting-started
docker run -d -p 80:80/tcp -p 80:80/udp --name app-name docker/getting-started
```

## List

```bash
docker ps
docker ps -l
docker ps -a
docker ps -q
```

## Execute

```bash
docker exec -it <container> <command>
docker exec -it <container> bash
```

## Remove

```bash
docker rm <container>
```

## Log

```bash
docker logs -f <container>
```

## Dockerfile

### Directives

- `FROM`: source image.
- `ENV`: set environment variable.
- `WORKDIR`: change directory.
- `COPY`: copy file.
- `RUN`: run command.
- `CMD`: final command.
- `EXPOSE`: expose port.

```Dockerfile
FROM centos:7
RUN yum -y install httpd
COPY index.html /usr/share/httpd/noindex/index.html
EXPOSE 80
CMD ["/usr/sbin/httpd", "-D", "FOREGROUND"]
```

```Dockerfile
FROM centos:7
RUN rpm -Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
RUN yum -y install nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Hub

### Mirrors

- Docker [mirrors](https://github.com/dongyubin/DockerHub).
- [HubProxy](https://github.com/sky22333/hubproxy).

## Internals

`Docker` is **process-level** `Linux` virtual container:

- `Namespace`: IPC/network/PID/UTS/user isolation.
- `Cgroup`: resources control.
- `rootfs`: file system isolation.

```go
// https://github.com/lizrice/containers-from-scratch
package main

import (
    "fmt"
    "io/ioutil"
    "os"
    "os/exec"
    "path/filepath"
    "strconv"
    "syscall"
)

// go run main.go run <cmd> <args>
func main() {
    switch os.Args[1] {
    case "run":
        run()
    case "child":
        child()
    default:
        panic("help")
    }
}

func run() {
    fmt.Printf("Running %v \n", os.Args[2:])

    cmd := exec.Command("/proc/self/exe", append([]string{"child"}, os.Args[2:]...)...)
    cmd.Stdin = os.Stdin
    cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stderr
    cmd.SysProcAttr = &syscall.SysProcAttr{
        Cloneflags:   syscall.CLONE_NEWUTS | syscall.CLONE_NEWPID | syscall.CLONE_NEWNS,
        Unshareflags: syscall.CLONE_NEWNS,
    }

    must(cmd.Run())
}

func child() {
    fmt.Printf("Running %v \n", os.Args[2:])

    cg()

    cmd := exec.Command(os.Args[2], os.Args[3:]...)
    cmd.Stdin = os.Stdin
    cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stderr

    must(syscall.Sethostname([]byte("container")))
    must(syscall.Chroot("/home/liz/ubuntufs"))
    must(os.Chdir("/"))
    must(syscall.Mount("proc", "proc", "proc", 0, ""))
    must(syscall.Mount("thing", "myTemp", "tmpfs", 0, ""))

    must(cmd.Run())

    must(syscall.Unmount("proc", 0))
    must(syscall.Unmount("thing", 0))
}

func cg() {
    cgroups := "/sys/fs/cgroup/"
    pids := filepath.Join(cgroups, "pids")
    os.Mkdir(filepath.Join(pids, "liz"), 0755)
    must(ioutil.WriteFile(filepath.Join(pids, "liz/pids.max"), []byte("20"), 0700))
    // Removes the new cgroup in place after the container exits
    must(ioutil.WriteFile(
        filepath.Join(pids, "liz/notify_on_release"),
        []byte("1"),
        0700
    ))
    must(ioutil.WriteFile(
        filepath.Join(pids, "liz/cgroup.procs"),
        []byte(strconv.Itoa(os.Getpid())),
        0700
    ))
}

func must(err error) {
    if err != nil {
        panic(err)
    }
}
```

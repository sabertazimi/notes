---
sidebar_position: 2
tags: [Programming, OS, Linux, Shell, Bash, Zsh]
---

# Shell Scripts

## Warnings

- `=` 左右无空格.
- `()` `[]` 内部最好有空格.
- 数值运算用 `(())` 或 `$(())`.

## 文件重定向

- `> 文件设备名`: 覆盖标准输出重定向.
- `>> 文件设备名`: 追加标准输出重定向.
- `2>文件设备名`: 覆盖错误输出重定向.
- `2>>文件设备名`: 追加错误输出重定向.
- `>/>> 文件 2>&1 &>/&>>文件`: 覆盖/追加正确输出与错误输出同时重定向.
- `< 文件设备名`/`<< 文件设备名`: 覆盖/追加标准输入重定向.

### Here Document

```bash
command << END
...
END

command << EOF
...
EOF
```

```bash
#!/bin/bash
gnuplot -persist <<EOF
set data style linespoints
show timestamp
set title "$1"
set xlabel "time (seconds)"
set ylabel "Segments (cwnd, ssthresh)"
plot "$1" using 1:7 title "snd_cwnd", \\
     "$1" using 1:($8>=2147483647 ? 0 : $8) title "snd_ssthresh"
EOF
```

## Variables

- `=` : 左右两端不可有空格.
- `' '`: 完全标准字符串.
- `" "`: 格式化字符串.
- 调用变量值：`$变量名`.
- `set`/`unset`: 设置/取消变量.

### Built-in

- `$*`/`$@`: `argv[1], ..., argv[n]`
- `$0/$1/../$n`: `argv[0], ..., argv[n]`
- `$#`: argc
- `$?`: exit code of last command

```bash
if [ "$?" -ne "0" ];then
    echo "sorry, command execution failed!"
fi
```

每次 `shift` 命令执行的时候,
变量 `$2` 的值会移动到变量 `$1` 中,
变量 `$3` 的值会移动到变量 `$2` 中.
变量 `$#` 的值也会相应的减 1.

```bash
#!/bin/bash
# posit-param2: script to display all arguments
count=1
while [[ $# -gt 0 ]]; do
    echo "Argument $count = $1"
    count=$((count + 1))
    shift
done
```

```bash
usage () {
    echo "$PROGNAME: usage: $PROGNAME [-f file | -i]"
    return
}
# process command line options
interactive=
filename=
while [[ -n $1 ]]; do
    case $1 in
    -f | --file)            shift
                            filename=$1
                            ;;
    -i | --interactive)     interactive=1
                            ;;
    -h | --help)            usage
                            exit
                            ;;
    *)                      usage >&2
                            exit 1
                            ;;
    esac
    shift
done
```

### Environment

- `/etc/profile.d/*.sh`.
- `~/.bash_profile`.
- `~/.bashrc`.
- `/etc/profile`.
- `/etc/bash.bashrc`.
- `/etc/issue`: shell 登录信息.
- `PS1` 环境变量: shell 头行打印信息.
- `PATH` 环境变量.

```bash
export PATH=$PATH:/usr/local/bin
env
printenv
```

## Expansions

- `$(())` or `$[]`: arithmetic expansion

一般地, 将数值运算用 `(())` `[[]]` 或 `$(())` 括起, 可以确保变量不会被识别为 string

```bash
read x
read y

echo $((x + y))
echo $((a < b ? a : b))

if ((a > b))
then
    echo "a > b"
fi

if [[ a -gt b ]]
then
    echo "a > b"
fi

if [ "$a" -gt "$b" ]
then
    echo "a > b"
fi
```

- `[[ xxx ]]`: condition
- `(( xxx ))`: arithmetic condition

| operator              | function                                          |
| :-------------------- | :------------------------------------------------ |
| ! EXPRESSION          | The EXPRESSION is false                           |
| -n STRING             | The length of STRING is greater than zero         |
| -z STRING             | The length of STRING is zero (ie it is empty)     |
| STRING1 == STRING2    | STRING1 is equal to STRING2                       |
| STRING1 != STRING2    | STRING1 is not equal to STRING2                   |
| STRING1 > STRING2     | STRING1 sorts after STRING2                       |
| STRING1 < STRING2     | STRING1 sorts before STRING2                      |
| INTEGER1 -eq INTEGER2 | INTEGER1 is numerically equal to INTEGER2         |
| INTEGER1 -gt INTEGER2 | INTEGER1 is numerically greater than INTEGER2     |
| INTEGER1 -lt INTEGER2 | INTEGER1 is numerically less than INTEGER2        |
| -d FILE               | FILE exists and is a directory                    |
| -e FILE               | FILE exists                                       |
| -r FILE               | FILE exists and the read permission is granted    |
| -s FILE               | FILE exists and it's size is greater than zero    |
| -w FILE               | FILE exists and the write permission is granted   |
| -x FILE               | FILE exists and the execute permission is granted |
| `AND -a &&`           |                                                   |
| `OR -o \|\|`          |                                                   |
| `NOT ! !`             |                                                   |

- {}: group regexp

```bash
echo a{A{1,2},B{3,4}}b
aA1b aA2b aB3b aB4b
```

- `${}`: string expansion
  - `${parameter:-word}`: 若 parameter 没有设置（例如，不存在）或者为空，展开结果是 word 的值。
    若 parameter 不为空，则展开结果是 parameter 的值
  - `${parameter:+word}`: 若 parameter 没有设置或为空，展开结果为空。
    若 parameter 不为空， 展开结果是 word 的值会替换掉 parameter 的值
  - `${parameter:=word}`: 若 parameter 没有设置或为空，展开结果是 word 的值。
    另外，word 的值会赋值给 parameter。
    若 parameter 不为空，展开结果是 parameter 的值
  - `${parameter:?word}`: 若 parameter 没有设置或为空，这种展开导致脚本带有错误退出，
    并且 word 的内容会发送到标准错误。
    若 parameter 不为空， 展开结果是 parameter 的值
  - `${!prefix*}` `${!prefix@}`: 这种展开会返回以 prefix 开头的已有变量名
  - `${#parameter}`: 展开成由 parameter 所包含的字符串的长度
  - `${parameter:offset}` `${parameter:offset:length}`: 提取一部分字符
  - `${parameter,,}` 把 parameter 的值全部展开成小写字母
  - `${parameter,}` 仅仅把 parameter 的第一个字符展开成小写字母
  - `${parameter^^}` 把 parameter 的值全部转换成大写字母
  - `${parameter^}` 仅仅把 parameter 的第一个字符转换成大写字母
  - `${parameter#pattern}` `${parameter##pattern}`,
    `${parameter%pattern}` `${parameter%%pattern}`: 从 parameter 所包含的字符串中清除开头/末尾一部分文本
  - `${parameter/pattern/string}`, `${parameter//pattern/string}`,
    `${parameter/#pattern/string}`, `${parameter/%pattern/string}`: replace

```bash
foo=file.txt.zip
echo ${foo#*.}
txt.zip
echo ${foo##*.}
zip

foo=file.txt.zip
echo ${foo%.*}
file.txt
echo ${foo%%.*}
file
```

```bash
foo=JPG.JPG
echo ${foo/JPG/jpg}
jpg.JPG
echo ${foo//JPG/jpg}
jpg.jpg
echo ${foo/#JPG/jpg}
jpg.JPG
echo ${foo/%JPG/jpg}
JPG.jpg
```

- `$()`: command result.
- `""`: allow expansions string.
- `''`: disallow expansions string.

## Flow Control

### If

```bash
if [[ 条件判断式 ]] ; then
    程序
fi
if [[ 条件判断式 ]]
    then
        程序
    else
        程序
fi

if [[ 条件判断式1 ]]
    then
        程序1
elif [[ 条件判断式2 ]]
    then
        程序2
else
        程序n
fi
```

```bash
#!/usr/bin/bash

i=1;
for flag in "$@"
do
  if [[ $flag == "-o" ]]
  then
    open=1;
  fi
done

exclude="--exclude-dir=node_modules --exclude-dir=build  --exclude-dir=.yarn --exclude-dir=.cache --exclude-dir=.next --exclude-dir=coverage --exclude-dir=public --exclude-dir=.git --exclude-dir=dist --exclude=package-lock.json --exclude=yarn.lock --exclude=CHANGELOG.md"

if [[ -n $open ]]
then
  grep -r $1 $exclude | awk -F : '{print $1}' | xargs code;
else
  grep -r $1 $exclude;
fi
```

### Case

```bash
case $变量名 in
    “值1”)
            程序
            ;;
    “值2”)
            程序
            ;;
    *)
            程序
;;
esac
```

| case pattern   | function                              |
| :------------- | :------------------------------------ |
| `a)`           | word equals "a"                       |
| `[[:alpha:]])` | word is a single alphabetic character |
| `???)`         | word is exactly three characters long |
| `*.txt)`       | word ends with the characters “.txt”  |
| `*)`           | any value of word                     |

```bash
#!/bin/bash
# case-menu: a menu driven system information program
clear
echo "
Please Select:
1. Display System Information
2. Display Disk Space
3. Display Home Space Utilization
0. Quit
"
read -p "Enter selection [0-3] > "
case $REPLY in
    0)  echo "Program terminated."
        exit
        ;;
    1)  echo "Hostname: $HOSTNAME"
        uptime
        ;;
    2)  df -h
        ;;
    3)  if [[ $(id -u) -eq 0 ]]; then
            echo "Home Space Utilization (All Users)"
            du -sh /home/*
        else
            echo "Home Space Utilization ($USER)"
            du -sh $HOME
        fi
        ;;
    *)  echo "Invalid entry" >&2
        exit 1
        ;;
esac
```

or case pattern

```bash
#!/bin/bash
# case-menu: a menu driven system information program
clear
echo "
Please Select:
A. Display System Information
B. Display Disk Space
C. Display Home Space Utilization
Q. Quit
"
read -p "Enter selection [A, B, C or Q] > "
case $REPLY in
q|Q) echo "Program terminated."
     exit
     ;;
a|A) echo "Hostname: $HOSTNAME"
     uptime
     ;;
b|B) df -h
     ;;
c|C) if [[ $(id -u) -eq 0 ]]; then
         echo "Home Space Utilization (All Users)"
         du -sh /home/*
     else
         echo "Home Space Utilization ($USER)"
         du -sh $HOME
     fi
     ;;
*)   echo "Invalid entry" >&2
     exit 1
     ;;
esac
```

fall through case pattern (`;;&`)

```bash
#!/bin/bash
# case4-2: test a character
read -n 1 -p "Type a character > "
echo
case $REPLY in
    [[:upper:]])    echo "'$REPLY' is upper case." ;;&
    [[:lower:]])    echo "'$REPLY' is lower case." ;;&
    [[:alpha:]])    echo "'$REPLY' is alphabetic." ;;&
    [[:digit:]])    echo "'$REPLY' is a digit." ;;&
    [[:graph:]])    echo "'$REPLY' is a visible character." ;;&
    [[:punct:]])    echo "'$REPLY' is a punctuation symbol." ;;&
    [[:space:]])    echo "'$REPLY' is a whitespace character." ;;&
    [[:xdigit:]])   echo "'$REPLY' is a hexadecimal digit." ;;&
esac
```

### For

```bash
for 变量 in 值1 值2 值3 …… 值n
    do
        程序
    done

$(seq 1 50)  # 1 2 ... 50
{1..50}     # 1 2 ... 50
{0..10..2}  # 0 2 4 6 8 10

for (( 初始值;循环控制条件;变量变化 )); do
    程序
done
```

### While and Until

```bash
while [[ 条件判断式 ]]
    do
        程序
    done

until [[ 条件判断式 ]]
    do
        程序
    done
```

```bash
(( expression1 ))
while (( expression2 )); do
    commands
    (( expression3 ))
done
```

```bash
#!/bin/bash
# while-menu: a menu driven system information program
DELAY=3 # Number of seconds to display results
while [[ $REPLY != 0 ]]; do
    clear
    cat <<- _EOF_
        Please Select:
        1. Display System Information
        2. Display Disk Space
        3. Display Home Space Utilization
        0. Quit
    _EOF_
    read -p "Enter selection [0-3] > "
    if [[ $REPLY =~ ^[0-3]$ ]]; then
        if [[ $REPLY == 1 ]]; then
            echo "Hostname: $HOSTNAME"
            uptime
            sleep $DELAY
        fi
        if [[ $REPLY == 2 ]]; then
            df -h
            sleep $DELAY
        fi
        if [[ $REPLY == 3 ]]; then
            if [[ $(id -u) -eq 0 ]]; then
                echo "Home Space Utilization (All Users)"
                du -sh /home/*
            else
                echo "Home Space Utilization ($USER)"
                du -sh $HOME
            fi
            sleep $DELAY
        fi
    else
        echo "Invalid entry."
        sleep $DELAY
    fi
done
echo "Program terminated."
```

```bash
#!/bin/bash
# while-read: read lines from a file
while read dist version release; do
    printf "Dist: %s\tVersion: %s\tReleased: %s\n" \
        $dist \
        $version \
        $release
done < dist.txt
```

### Do While

```bash
while : ; do
    actions
    [[ current_time <= $cutoff ]] || break
done
```

## Array

- [Array Reference](http://billie66.github.io/TLCL/book/chap36.html)

## Function

- 函数局部变量 `local 变量名`.
- 函数参数 : `$`/`+`/`#`/`?`/`@`/`n`.
- 引用函数库文件: `source sh 文件名`/`. sh 文件名`, 可修改 `~/.bashrc` 文件.

## I/O

```bash
#!/bin/bash
# read-validate: validate input
invalid_input () {
    echo "Invalid input '$REPLY'" >&2
    exit 1
}
read -p "Enter a single item > "
# input is empty (invalid)
[[ -z $REPLY ]] && invalid_input
# input is multiple items (invalid)
(( $(echo $REPLY | wc -w) > 1 )) && invalid_input
# is input a valid filename?
if [[ $REPLY =~ ^[-[:alnum:]\._]+$ ]]; then
    echo "'$REPLY' is a valid filename."
    if [[ -e $REPLY ]]; then
        echo "And file '$REPLY' exists."
    else
        echo "However, file '$REPLY' does not exist."
    fi
    # is input a floating point number?
    if [[ $REPLY =~ ^-?[[:digit:]]*\.[[:digit:]]+$ ]]; then
        echo "'$REPLY' is a floating point number."
    else
        echo "'$REPLY' is not a floating point number."
    fi
    # is input an integer?
    if [[ $REPLY =~ ^-?[[:digit:]]+$ ]]; then
        echo "'$REPLY' is an integer."
    else
        echo "'$REPLY' is not an integer."
    fi
else
    echo "The string '$REPLY' is not a valid filename."
fi
```

```bash
#!/bin/bash
# read-menu: a menu driven system information program
clear
echo "
Please Select:

    1. Display System Information
    2. Display Disk Space
    3. Display Home Space Utilization
    0. Quit
"
read -p "Enter selection [0-3] > "

if [[ $REPLY =~ ^[0-3]$ ]]; then
    if [[ $REPLY == 0 ]]; then
        echo "Program terminated."
        exit
    fi
    if [[ $REPLY == 1 ]]; then
        echo "Hostname: $HOSTNAME"
        uptime
        exit
    fi
    if [[ $REPLY == 2 ]]; then
        df -h
        exit
    fi
    if [[ $REPLY == 3 ]]; then
        if [[ $(id -u) -eq 0 ]]; then
            echo "Home Space Utilization (All Users)"
            du -sh /home/*
        else
            echo "Home Space Utilization ($USER)"
            du -sh $HOME
        fi
        exit
    fi
else
    echo "Invalid entry." >&2
    exit 1
fi
```

```bash
# interactive mode
if [[ -n $interactive ]]; then
    while true; do
        read -p "Enter name of output file: " filename
        if [[ -e $filename ]]; then
            read -p "'$filename' exists. Overwrite? [y/n/q] > "
            case $REPLY in
            Y|y)    break
                    ;;
            Q|q)    echo "Program terminated."
                    exit
                    ;;
            *)      continue
                    ;;
            esac
        elif [[ -z $filename ]]; then
            continue
        else
            break
        fi
    done
fi
```

## Signal

- `man 7 signal`: 传递信号给进程.
- `CTRL + C`: SIGINT.
- `CTRL + Z`: SIGSTP.
- `kill/killall`: SIGINT.
- `trap SIG*`/`trap EXIT`: 捕捉信号(后 + 忽略信号/默认处理信号/自定义处理信号).
- `trap – SIG*`/`trap - EXIT`: 移除信号.

## Debugging

`-x` option:

```bash
#!/bin/bash -x
# trouble: script to demonstrate common errors
number=1
if [ $number = 1 ]; then
    echo "Number is equal to 1."
else
    echo "Number is not equal to 1."
fi
```

```bash
#!/bin/bash
# trouble: script to demonstrate common errors
number=1
echo "number=$number" # DEBUG
set -x # Turn on tracing
if [ $number = 1 ]; then
    echo "Number is equal to 1."
else
    echo "Number is not equal to 1."
fi
set +x # Turn off tracing
```

## Interaction

### Root Validation

```bash
if (( $EUID != 0 )); then
    echo "Please run as root!"
    exit
fi
```

```bash
# run as root directly
sudo chown root <filename>
sudo chmod +s <filename>
```

### Help Option

```bash
#!/bin/sh
if [[ ${#@} -ne 0 ]] && [[ "${@#"--help"}" = "" ]]; then
  printf -- '...help...\n';
  exit 0;
fi;
```

### Silent Option

```bash
#!/bin/sh
if [[ ${#@} -ne 0 ]] && [[ "${@#"--silent"}" = "" ]]; then
  stty -echo;
fi;
# ...
# before point of intended output:
stty +echo && printf -- 'intended output\n';
# silence it again till end of script
stty -echo;
# ...
stty +echo;
exit 0;
```

### Command Validation

```bash
#!/bin/sh
_=$(command -v docker);
if [[ "$?" != "0" ]]; then
  printf -- 'You don\'t seem to have Docker installed.\n';
  printf -- 'Get it: https://www.docker.com/community-edition\n';
  printf -- 'Exiting with code 127...\n';
  exit 127;
fi;
```

### Get Absolute Path

```bash
#!/bin/sh
CUR_DIR="$(dirname $0);"
printf -- 'moving application to /opt/app.jar';
mv "${CUR_DIR}/application.jar" /opt/app.jar;
```

### Error Handle

```bash
#!/bin/sh
error_handle() {
  stty echo;
}

if [[ ${#@} -ne 0 ]] && [[ "${@#"--silent"}" = "" ]]; then
  stty -echo;
  trap error_handle INT;
  trap error_handle TERM;
  trap error_handle KILL;
  trap error_handle EXIT;
fi;
# ...
```

### Loading Progress

```bash
#!/bin/sh
printf -- 'Performing asynchronous action..';
./trigger-action;
DONE=0;
while [ $DONE -eq 0 ]; do
  ./async-checker;
  if [ "$?" = "0" ]; then DONE=1; fi;
  printf -- '.';
  sleep 1;
done;
printf -- ' DONE!\n';
```

## Zsh

```bash
# Install zsh and powerline
sudo apt install zsh powerline powerline-status

# Install oh-my-zsh
sh -c "$(wget -O- https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Install zsh themes
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
git clone --depth=1 https://github.com/sabertazimi/dragon-zsh-theme.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/dragon

plugins=(fzf git history vi-mode)
```

Install zsh on [Windows](https://gist.github.com/fworks/af4c896c9de47d827d4caa6fd7154b6b):

```bash
# Download zsh and extract into "C:\Program Files\Git":
curl -O https://mirror.msys2.org/msys/x86_64/zsh-5.9-3-x86_64.pkg.tar.zst

# Open git bash and configure zsh:
zsh

# Install oh-my-zsh:
git clone https://github.com/ohmyzsh/ohmyzsh
bash ohmyzsh/tools/install.sh

# Edit ~/.bashrc:
# Launch Zsh
if [ -t 1 ]; then
exec zsh
fi
```

## Best Practices

- [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- 指定默认解释器`cat /etc/shells`
- 设置`bash strict mode`
- 条件判断使用`[[ ]]`
- 使用变量时用双引号把变量包起来 `cp -r "$src_dir" "$dest_dir"`
- 使用`$()`获取表达式的值
- 使用`${arr[@]}`进行列表循环

```bash
#!/usr/bin/env bash

# 设置命令回显
set -x

# 遇到未声明的变量则报错停止
set -u
# 遇到执行错误则停止
set -e
# 管道命令其中一步失败则中止
set -o pipefail
```

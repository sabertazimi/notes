* [Download](#download)
* [Install](#install)
* [Run](#run)

## Download

-   http://pan.baidu.com/s/1o6qKdxo#path=%252Fmatlab

## Install

```shell
sudo mkdir /media/matlab
mount -o loop [path][filename].iso /media/matlab
cd /media/matlab
sudo ./install
```

-   安装过程中使用readme.txt中的序列号
-   安装完成后使用crack下的 license进行激活

```shell
cp -fr crack/libmwservices.so /usr/local/MATLAB/R2014A/bin/glnxa64/
```

## Run

```shell
sudo matlab
```


* [MongoDB Basic Notes](#mongodb-basic-notes)
	* [Set Up](#set-up)
		* [Install](#install)
		* [Not Upgrade](#not-upgrade)
		* [Start/Stop/Restart](#startstoprestart)
		* [Uninstall](#uninstall)

# MongoDB Basic Notes

## Set Up

### Install

```shell
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
$ echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list 
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org mongodb-org-server mongodb-org-shell mongodb-org-mongos mongodb-org-tools
```

### Not Upgrade

```shell
$ echo "mongodb-org hold" | sudo dpkg --set-selections
$ echo "mongodb-org-server hold" | sudo dpkg --set-selections
$ echo "mongodb-org-shell hold" | sudo dpkg --set-selections
$ echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
$ echo "mongodb-org-tools hold" | sudo dpkg --set-selections
```

### Start/Stop/Restart

```shell
$ sudo service mongod start
$ sudo service mongod stop
$ sudo service mongod restart
```

### Uninstall

```shell
$ sudo service mongod stop
$ sudo apt-get purge mongodb-org*
$ sudo rm -r /var/log/mongodb
$ sudo rm -r /var/lib/mongodb
```



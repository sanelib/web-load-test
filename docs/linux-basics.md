===========Instance Setup===================

sudo apt-get install debian-goodies

#debian packages with size
dpigs


## User management

```

sudo adduser vagrant
sudo usermod -aG sudo vagrant

```

## List network process

```script

$ sudo lsof -i -P -n
$ sudo lsof -i -P -n | grep LISTEN
$ doas lsof -i -P -n | grep LISTEN ### [OpenBSD] ###

$ netstat -tulpn | grep LISTEN

$ sudo ss -tulw
$ sudo ss -tulwn

#-t : Show only TCP sockets on Linux
#-u : Display only UDP sockets on Linux
#-l : Show listening sockets. For example, TCP port 22 is opened by SSHD server.
#-p : List process name that opened sockets
#-n : Don’t resolve service names i.e. don’t use DNS

```

##The Linux Directory Structure, Explained

[https://www.howtogeek.com/117435/htg-explains-the-linux-directory-structure-explained/]

```script

/ – The Root Directory
/bin – Essential User Binaries
/boot – Static Boot Files
/cdrom – Historical Mount Point for CD-ROMs
/dev – Device Files
/etc – Configuration Files
/home – Home Folders
/lib – Essential Shared Libraries
/lost+found – Recovered Files
/media – Removable Media
/mnt – Temporary Mount Points
/opt – Optional Packages
/proc – Kernel & Process Files
/root – Root Home Directory
/run – Application State Files
/sbin – System Administration Binaries
/selinux – SELinux Virtual File System
/srv – Service Data
/tmp – Temporary Files
/usr – User Binaries & Read-Only Data
/var – Variable Data Files

```

##System sockets
Refer this link: [https://easyengine.io/tutorials/linux/sysctl-conf/]


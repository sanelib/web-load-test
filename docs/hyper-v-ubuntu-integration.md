## hyper-v migration

VBoxManage clonehd source.vdi target.vhd --format vhd

.\dsfok\dsfo.exe ./mongod-m103/box-disk1.vmdk 512 1024 ./mongod-m103/descriptor1.txt

ConvertTo-MvmcVirtualHardDisk -SourceLiteralPath ./mongod-m103/box-disk1.vmdk -VhdType DynamicHardDisk -VhdFormat vhdx -destination ./mongod-m103/.


Convert from qemu:

"C:\Program Files\qemu\qemu-img.exe" convert -f vmdk -O vhdx .\mongod-m103\box-disk1.vmdk .\mongod-m103\mongod-m103.vhdx -o subformat=dynamic

"C:\Program Files\qemu\qemu-img.exe" info .\mongod-m103\mongod-m103.vhdx

fsutil sparse setflag .\mongod-m103\mongod-m103.vhdx 0

## Mount hyper-v ubuntu iso image.

Attach iso file.
mkdir /mnt/cddrive
mount /dev/cdrom /mnt/cddrive


```script

#!/bin/bash 
# Microsoft Hyper-V Intergration Services (Ubuntu/Debian Install Script)
# Author: Simon Lee
# Script Revision: 1.0
# Description: Install linux-virtual kernal for Ubuntu/Debian Server

#cd /tmp && wget https://raw.githubusercontent.com/hypervlab/hypervlab-resources/master/hyper-v/linux/setup_ubuntulis.sh && sudo bash setup_ubuntulis.sh 

# Clear Current Screen
clear

# Check Session Status
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root"
   exit 1
elif [[ $EUID -eq 0 ]]; then
   echo -e "Session Running as \e[36mROOT\e[0m"
fi

```

# Update Local System Packages 
apt update && apt -y upgrade

# Add hv_modules to /etc/initramfs-tools/modules
echo 'hv_vmbus' >> /etc/initramfs-tools/modules
echo 'hv_storvsc' >> /etc/initramfs-tools/modules
echo 'hv_blkvsc' >> /etc/initramfs-tools/modules
echo 'hv_netvsc' >> /etc/initramfs-tools/modules

# Replace Out of Box Kernal with linux-virtual
apt -y install linux-virtual linux-cloud-tools-virtual linux-tools-virtual

# Update Initramfs
update-initramfs -u

# Reboot Server
reboot



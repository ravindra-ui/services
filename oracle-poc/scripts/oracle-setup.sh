#!/bin/bash

## Add Repo
wget https://yum.oracle.com/RPM-GPG-KEY-oracle-ol7 -O /etc/pki/rpm-gpg/RPM-GPG-KEY-oracle
sleep 1s
gpg --quiet --with-fingerprint /etc/pki/rpm-gpg/RPM-GPG-KEY-oracle
sleep 1s

cat <<EOF >> /etc/yum.repos.d/ol7-temp.repo
[ol7_latest]
name=Oracle Linux \$releasever Latest (\$basearch)
baseurl=https://yum.oracle.com/repo/OracleLinux/OL7/latest/\$basearch/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-oracle
gpgcheck=1
enabled=1
EOF

sudo yum update -y
sleep 2s
sudo yum install oraclelinux-release-el7 -y
sleep 2s
sudo yum --enablerepo=ol7_latest install oracle-database-preinstall-19c -y 
sleep 2s
sudo rpm -Uvh /tmp/oracle-database-ee-19c-1.0-1.x86_64.rpm 
sudo /etc/init.d/oracledb_ORCLCDB-19c configure 

echo "Akki@#1234" | passwd --stdin oracle
echo "oracle  ALL=(ALL) NOPASSWD: ALL" | sudo tee -a /etc/sudoers

export oldpath=ORCLCDB:/opt/oracle/product/19c/dbhome_1:N
export newpath=ORCLCDB:/opt/oracle/product/19c/dbhome_1:Y
sed -i "s=$oldpath=$newpath=" /etc/oratab

cat <<EOF >> /etc/sysconfig/ORCLCDB.oracledb
ORACLE_BASE=/opt/oracle/oradata
ORACLE_HOME=/opt/oracle/product/19c/dbhome_1
ORACLE_SID=ORCLCDB
EOF

/bin/su -c "/tmp/oracle-user.sh" - oracle


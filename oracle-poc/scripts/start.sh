#!/bin/bash

echo "Starting of DB Setup Steps" >> /home/$USER/task.list
sudo yum update -y
echo "Done STEP - 1" >> /home/$USER/task.list
sudo yum install gcc python3-devel python3-setuptools redhat-rpm-config wget -y
echo "Done STEP - 2" >> /home/$USER/task.list
sudo pip3 install --no-cache-dir -U crcmod
echo "Done STEP - 3" >> /home/$USER/task.list
sudo gsutil -m cp gs://single-bucket/oracle19c/oracle-database-ee-19c-1.0-1.x86_64.rpm /tmp/
sudo gsutil -m cp gs://single-bucket/scripts/*.sh /tmp/
echo "Done STEP - 4" >> /home/$USER/task.list
sudo chmod +x /tmp/oracle-setup.sh
sudo chmod +x /tmp/oracle-user.sh
sudo /tmp/oracle-setup.sh >>/tmp/oracle-setup.log
echo "Done - Everything is working now" >> /home/$USER/task.list

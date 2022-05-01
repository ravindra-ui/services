#!/bin/bash

cat <<EOF >> ~/.bash_profile
umask 022
export ORACLE_SID=ORCLCDB
export ORACLE_BASE=/opt/oracle/oradata
export ORACLE_HOME=/opt/oracle/product/19c/dbhome_1
export PATH=\$PATH:\$ORACLE_HOME/bin 
EOF

source ~/.bash_profile
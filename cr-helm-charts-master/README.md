## ReadME

```bash
# ----------------------------------- Infrastructure and databases Versions ----------------------- #


# Databases & Istio
============================================

# Cassandra - 3.11.3
# Mongodb - 4.4.4
# Kafka - 2.7.0
# Redis - 5.0.3
# elasticsearch - 6.8.2
# Neo4j - 3.4.16
# Istio - 1.9.1

# Infrastructure Specifications
============================================

# Project-id: comrate-307109
# Kubernetes Version - 1.19.9-gke.1900
# NodePool - default-pool
# Region - asia-east2
# Cluster Type - Regional
# Nodes - 6
# Machine Type - e2-standard-4 ( 4 CPU, 16GB RAM ) = Total 24CPU, 96GB RAM


# ----------------------------------- Services & There Databases --------------------------------- #

# Cassandra
- cr-account
- cr-filemanager
- cr-network
- cr-post
- cr-review

# Redis
- cr-account
- cr-auth
- cr-company
- cr-presence

# Mongodb
- cr-account
- cr-company
- cr-notification

# Elasticserach
- cr-search

# Neo4j
- cr-network

# Kafka
- cr-notification
- cr-message

```

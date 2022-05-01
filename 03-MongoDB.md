## 1.0 Bitnami Mongo Setup Guide

### 1.1 Installation

```bash
===================================================================
# Repo -- https://github.com/bitnami/charts/tree/master/bitnami/mongodb/#installing-the-chart
# Helm 3 ( required )
# MongoDB Version -- Tecore Test -- 4.0.6
# MongoDB Version -- Tecore Prod -- 4.4.4
# Note : RootPassword -- TLMongo##
===================================================================

# Installation steps
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm repo update


$ helm pull bitnami/mongodb
$ tar -zxvf ./x.tar.gz

---value.yaml
architecture: standalone
useStatefulSet: true

auth:
  enabled: true
  rootPassword: "TLMongo##"
  username: lb-user
  password: "YgH6NufaWEeXW4LDp"
  database: lugbee

podSecurityContext:
  enabled: true
  fsGroup: 0

containerSecurityContext:
  enabled: true
  runAsUser: 0
  runAsNonRoot: false

resources:
  limits:
    cpu: 400m
    memory: 512Mi
  requests:
    cpu: 400m
    memory: 512Mi

persistence:
  enabled: true

service:
  type: NodePort
  port: 27017
  portName: mongodb
  nodePort: 30175

serviceAccount:
  create: true

volumePermissions:
  enabled: true
  resources:
    limits:
      cpu: 100m
      memory: 128Mi
    requests:
      cpu: 100m
      memory: 128Mi
  securityContext:
    runAsUser: 0
---

# Install Helm Chart
$ helm install mongodb ./mongodb

# NOTE: To connect to mongodb from outside cluster : NODE_IP:30175
---

# Create user and role
$ vim createUser.js
db.createUser(
  {
    user  : "lb-user",
    pwd   : "YgH6NufaWEeXW4LDp",
    roles : [
      {
        role : "dbAdmin",
        db   : "lugbee"
      }
    ]
  }
)

# Login as a root user
$ mongo --username root --password TLMongo##

# change to db
> use lugbee

# load this config file
> load("createUser.js")
Successfully added user: {
        "user" : "lb-user",
        "roles" : [
                {
                        "role" : "dbAdmin",
                        "db" : "lugbee"
                }
        ]
}
true

# check authentication
> db.auth("lb-user", "YgH6NufaWEeXW4LDp")
1

> exit
bye

# To test
$ mongo mongodb://lb-user:YgH6NufaWEeXW4LDp@127.0.0.1:27017/lugbee

# Lugbee-Dev-Env
mongo mongodb://lbDev:YgH6NufaWEeXW4LDp@127.0.0.1:27017/lugbeeDev 

```

---

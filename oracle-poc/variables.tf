variable "instance_name" {
  description = "name of instance"
  type        = string
}

variable "machine_type" {
  description = "specified image id for instance"
  type        = string
}

variable "region" {
  description = "gcp region for specified instance"
  type        = string
}

variable "project" {
  description = "project name in which we will create all instance"
  type        = string
}

variable "disk_image" {
  description = "image type for given instance"
  type        = string
}

variable "disk_size" {
  description = "size of the disk"
  type        = number
}

variable "disk_type" {
  description = "disk type"
  type        = string
}

variable "network" {
  description = "network for given instance"
  type        = string
}

variable "credential" {
  description = "credential file path different for different users"
  type        = string
}

variable "startup_script" {
  description = "path of startup script"
  type        = string
}

variable "ssh_key" {
  description = "path of ssh key"
  type        = string
}

# variable "bucket_name" {
#   description = "name of the state backend bucket"
#   default     = "ar-sandbox--tf-state"
# }

# variable "bucket_credential" {
#   description = "JSON Credentials for state backend bucket"
#   default     = "bucket-credential.json"
# }

variable "service_account" {
  description = "name of service account used in vm"
  type        = string
}

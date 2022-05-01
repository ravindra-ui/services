terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.1.0"
    }
  }
  backend "gcs" {
    bucket      = "single-bucket"
    prefix      = "TFstate"
    credentials = "./credentials/ravi-sandbox.json"
  }
}

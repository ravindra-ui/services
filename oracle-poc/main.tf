provider "google" {
  credentials = file(var.credential)
  project     = var.project
  region      = var.region
}

resource "google_compute_instance" "default" {
  name                      = var.instance_name
  machine_type              = var.machine_type
  zone                      = "${var.region}-a"
  allow_stopping_for_update = true
  tags                      = ["sandbox"]

  labels = {
    env = "sandbox"
  }

  boot_disk {
    initialize_params {
      image = var.disk_image
      size  = var.disk_size
      type  = var.disk_type
    }
    auto_delete = true
  }

  network_interface {
    network = var.network

    access_config {
      // Ephemeral public IP
    }
  }

  metadata = {
    ssh-keys = "ravi:${file(var.ssh_key)}"
  }

  metadata_startup_script = file(var.startup_script)

  service_account {
    # Google recommends custom service accounts that have cloud-platform scope and permissions granted via IAM Roles.
    email  = var.service_account
    scopes = ["cloud-platform"]
  }
}

output "ip" {
  value = google_compute_instance.default.network_interface.0.access_config.0.nat_ip
}

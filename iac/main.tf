terraform {
  backend "gcs" {
    bucket  = "resume-site-tfstate"
    prefix  = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_storage_bucket" "resume_site" {
  name                        = var.bucket_name
  location                    = var.region
  uniform_bucket_level_access = true
  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }
}

resource "google_storage_bucket_iam_member" "public_rule" {
  bucket = google_storage_bucket.resume_site.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

resource "google_compute_backend_bucket" "static_backend" {
  name        = "static-backend"
  bucket_name = google_storage_bucket.resume_site.name
  enable_cdn  = true
}

resource "google_compute_url_map" "lb_url_map" {
  name            = "static-url-map"
  default_service = google_compute_backend_bucket.static_backend.id
}


resource "google_compute_managed_ssl_certificate" "ssl_cert" {
  name = "ssl-cert"

  managed {
    domains = [var.domain_name]
  }
}

resource "google_compute_target_https_proxy" "https_proxy" {
  name             = "https-proxy"
  url_map          = google_compute_url_map.lb_url_map.self_link
  ssl_certificates = [google_compute_managed_ssl_certificate.ssl_cert.self_link]
}

resource "google_compute_global_address" "static_ip" {
  name = "static-ip"
}

resource "google_compute_global_forwarding_rule" "https_forwarding_rule" {
  name       = "https-forwarding-rule"
  ip_address = google_compute_global_address.static_ip.address
  port_range = "443"
  target     = google_compute_target_https_proxy.https_proxy.self_link
}

output "bucket_url" {
  value = "http://${google_storage_bucket.resume_site.name}.storage.googleapis.com"
}

output "load_balancer_ip" {
  value = google_compute_global_address.static_ip.address
}


resource "google_compute_url_map" "http_redirect" {
  name = "http-redirect-map"

  default_url_redirect {
    https_redirect = true
    strip_query    = false
  }
}

resource "google_compute_target_http_proxy" "http_proxy" {
  name    = "http-proxy"
  url_map = google_compute_url_map.http_redirect.self_link
}

resource "google_compute_global_forwarding_rule" "http_forwarding_rule" {
  name       = "http-forwarding-rule"
  ip_address = google_compute_global_address.static_ip.address
  port_range = "80"
  target     = google_compute_target_http_proxy.http_proxy.self_link
}



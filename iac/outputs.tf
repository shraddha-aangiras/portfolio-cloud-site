output "website_url" {
  value = "http://${google_storage_bucket.resume_site.name}.storage.googleapis.com"
}

variable "project_id" {
  type = string
}

variable "region" {
  type    = string
  default = "US"
}

variable "bucket_name" {
  type = string
}

variable "domain_name" {
  description = "The custom domain name to be used for SSL certificate"
  type        = string
}

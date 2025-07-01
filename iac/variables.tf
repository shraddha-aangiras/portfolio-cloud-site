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

variable "uptime_check_name" {
  default = "visitor-api-uptime"
}

variable "uptime_check_url" {
  description = "The API Gateway URL with /health-check endpoint"
  type        = string
}

variable "notification_email" {
  type = string
}


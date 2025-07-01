resource "google_monitoring_notification_channel" "email" {
  display_name = "Email Notifications"
  type         = "email"
  labels = {
    email_address = var.notification_email
  }
}

resource "google_monitoring_uptime_check_config" "api" {
  display_name = var.uptime_check_name
  timeout      = "10s"
  period       = "60s"
  checker_type = "STATIC_IP_CHECKERS"

  http_check {
    path           = "/health-check"
    port           = 443
    request_method = "GET"
    use_ssl        = true
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.project_id
      host       = replace(var.uptime_check_url, "https://", "")
    }
  }
}

resource "google_monitoring_alert_policy" "uptime_alert" {
  display_name          = "Uptime Check Failure Alert"
  combiner              = "OR"
  notification_channels = [google_monitoring_notification_channel.email.id]

  conditions {
    display_name = "Uptime failure"
    condition_threshold {
      filter = "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" AND resource.type=\"uptime_url\""
      comparison = "COMPARISON_LT"
      threshold_value = 1
      duration = "60s"
      trigger {
        count = 1
      }
    }
  }
}

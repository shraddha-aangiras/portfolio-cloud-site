# Cloud Native Resume Site

A full-fledged, production-grade **cloud-native application** — complete with automated CI/CD, infrastructure-as-code, real-time analytics, robust API design, monitoring + alerting, and integrations across Google Cloud, GitHub Actions, and Slack.

### 🌐 Live Project
🔗 [aangiras.com](https://www.aangiras.com) 

---

## 🧩 Tech Stack Overview

| Layer                | Technologies Used                                                                 |
|----------------------|------------------------------------------------------------------------------------|
| **Frontend**         | HTML, CSS, JavaScript, GitHub Actions, Google Cloud Storage (Static Hosting), Google Cloud CDN |
| **Backend/API**      | Python, Flask, Google Cloud Run, Firestore, Google API Gateway |
| **CI/CD**            | GitHub Actions (multi-step workflows for frontend & backend), Terraform            |
| **Infrastructure-as-Code (IaC)** | Terraform (modular config for GCS, Load Balancer, SSL, API Gateway, Monitoring) |
| **Monitoring & Alerting** | Google Cloud Monitoring, PagerDuty, Slack Webhook Integration, Error Reporting |
| **Testing**          | Cypress (E2E browser testing)                                                      |
| **Misc**             | CORS, JSON APIs, RESTful design principles, Slack ChatOps                          |

---

## 💡 Key Features

- ✅ **API-first architecture** using Flask on Cloud Run with serverless deployment
- 📊 **Live visitor counter** backed by Firestore DB
- 🌎 **CDN-accelerated global delivery** via GCP Load Balancer and Google Cloud CDN
- 🔐 **HTTPS everywhere** with managed SSL certs and automatic HTTP to HTTPS redirection
- 🛠️ **End-to-End CI/CD pipelines** using GitHub Actions for both frontend and backend
- 🧪 **Browser-based smoke tests** using Cypress, integrated into deployment workflows
- 🔔 **Monitoring & alerts** for uptime, latency, and crash notifications via GCP Monitoring, Email & Slack
- 📈 **Fully modular and declarative** infrastructure using Terraform
- ⚡ **Fully serverless, autoscaling backend** — zero-maintenance infrastructure
- 🧠 **Security best practices**: Service accounts, GitHub Secrets, no hardcoded creds

---

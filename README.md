# Cloud Native Resume Site

A full-fledged, production-grade **cloud-native application** — complete with automated CI/CD, infrastructure-as-code, real-time analytics, robust API design, monitoring + alerting, and integrations across Google Cloud, GitHub Actions, and Slack.

### 🌐 Live Project
🔗 [aangiras.com](https://www.aangiras.com) - dummy website with not much info. Made it to learn DevOps & Full Stack Dev! Currently down to minimize costs.

---

## 🧩 Tech Stack Overview

| Layer                | Technologies Used                                                                 |
|----------------------|------------------------------------------------------------------------------------|
| **Frontend**         | HTML, CSS, JavaScript, GitHub Actions, Google Cloud Storage (Static Hosting), Google Cloud CDN |
| **Backend/API**      | Python, Flask, Google Cloud Run, Firestore, Google API Gateway |
| **CI/CD**            | GitHub Actions with multi-step workflows for frontend, backend, Terraform, and Cypress |
| **Infrastructure-as-Code (IaC)** | Terraform (modular config for GCS, Load Balancer, SSL, API Gateway, Monitoring) |
| **Testing**          | Cypress (E2E browser testing)                                                      |
| **Misc**             | CORS, JSON APIs, RESTful design principles, Slack ChatOps, Usage Metrics           |

---

## 💡 Key Features
- ✅ **Real-time unique visitor tracking** powered by a custom API built with Python and Flask, persisting data in Firestore
- 🧠 **Session-aware counting logic** ensures visitors are only counted once per defined period
- 🌎 **Fast and globally-distributed frontend** using Google Cloud CDN with optimized caching strategies
- 🛠️ **Full-stack CI/CD automation** for backend, frontend, and infrastructure using GitHub Actions (Terraform deploys, GCS sync, API integration, Cypress validation)
- 🔔 **Robust alerting system** with Google Cloud Monitoring, email, Slack, and PagerDuty integration for production-grade reliability
- 📦 **Smoke-tested deployments** using Cypress to ensure API responses are correctly rendered on the frontend
- 🔐 **Secure, production-grade backend API**, deployed on Cloud Run behind API Gateway and served over HTTPS
- ⚙️ **Custom-coded API endpoints** for data read/write operations, built in Flask and triggered via HTTP
- 🔁 **Fully idempotent Infrastructure-as-Code setup** using Terraform to provision and manage GCP resources end-to-end
- 🌩️ **Comprehensive DevOps setup**: Load balancing, IAM roles, SSL certs, health checks, API Gateway, DNS routing — all declared and version-controlled


---


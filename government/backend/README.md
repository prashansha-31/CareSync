# CareSync — Government Health Administration & Regulatory Backend

Production-ready backend for the **CareSync Government Portal**, built with **Python 3.12**, **FastAPI**, and **Firebase** (Firebase Authentication & Cloud Firestore).

---

## 🌟 Key Architecture Features

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) with asynchronous request handling and OpenAPI (Swagger/ReDoc) generation.
- **Authentication**: **Firebase Authentication** ID Token verification via the official `firebase-admin` SDK with Role-Based Access Control (RBAC).
- **Database**: **Google Cloud Firestore** (NoSQL document store) with structured collections for Hospitals, Grievances, Advisories, Staff, and Audit Trails.
- **Seamless Local Development**: Automatic dual-mode database engine:
  - **Live Mode**: Directly connects to Cloud Firestore when `serviceAccountKey.json` is provided.
  - **Local Dev Mode**: Automatically falls back to an in-memory Firestore emulation if credentials are not configured, enabling instant local development and testing out of the box with zero setup hurdles.
- **Seeded Starter Data**: Initializes realistic healthcare establishments, district capacities, and advisory records automatically on first startup.

---

## 📂 Directory Structure

```
government/backend/
├── app/
│   ├── core/
│   │   ├── config.py             # App & CORS settings (Pydantic BaseSettings)
│   │   ├── firebase.py           # Firebase Admin SDK & In-Memory Firestore Fallback
│   │   ├── security.py           # Token verification & Role-Based Access Control (RBAC)
│   │   └── seed_data.py          # Realistic initial regulatory seed records
│   ├── models/                   # Pydantic Schemas & DTOs
│   │   ├── hospital.py           # Hospital licensing & capacity schemas
│   │   ├── monitoring.py         # District capacity rollup schemas
│   │   ├── complaint.py          # Citizen grievance & investigation schemas
│   │   ├── announcement.py       # Health notice & advisory schemas
│   │   ├── staff.py              # Directory & regulatory audit log schemas
│   │   └── stats.py              # Dashboard summary KPI models
│   ├── services/                 # Business logic & Firestore operations
│   │   ├── hospital_service.py   # Hospital CRUD, approvals, and suspensions
│   │   ├── monitoring_service.py # Bed & ICU aggregation across districts
│   │   ├── complaint_service.py  # Citizen grievance tracking & audit history
│   │   ├── announcement_service.py # Health notice drafts & publications
│   │   ├── staff_service.py      # Personnel management & audit logging
│   │   └── dashboard_service.py  # Aggregated metrics calculation
│   ├── routers/                  # REST API Endpoints (/api/v1)
│   │   ├── auth.py               # /api/v1/auth (Token verification & /me)
│   │   ├── hospitals.py          # /api/v1/hospitals (Review, approval, suspend)
│   │   ├── monitoring.py         # /api/v1/monitoring (Capacities & trends)
│   │   ├── complaints.py         # /api/v1/complaints (Grievance management)
│   │   ├── announcements.py      # /api/v1/announcements (Public health notices)
│   │   ├── staff.py              # /api/v1/staff & /api/v1/activity-logs
│   │   └── dashboard.py          # /api/v1/dashboard/stats
│   └── main.py                   # FastAPI application initialization & CORS
├── venv/                         # Python virtual environment
├── requirements.txt              # Production dependencies
├── firestore.rules               # Production Firestore Security Rules
├── serviceAccountKey.sample.json # Firebase service account template
├── .env.example                  # Environment configuration template
├── test_api.py                   # Automated API test suite
└── README.md                     # Documentation
```

---

## 🚀 Quickstart Guide

### 1. Activate the Virtual Environment

Open PowerShell in `government/backend/`:

```powershell
.\venv\Scripts\Activate.ps1
```

*(Dependencies are already installed in `venv`. To install or refresh manually: `pip install -r requirements.txt`)*

### 2. Run the Development Server

```powershell
.\venv\Scripts\uvicorn.exe app.main:app --reload --host 127.0.0.1 --port 8000
```

The server will be available at:
- **API Base URL**: `http://127.0.0.1:8000`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
- **ReDoc Documentation**: `http://127.0.0.1:8000/redoc`

### 3. Run the Automated Test Suite

```powershell
.\venv\Scripts\python.exe test_api.py
```

---

## 🔐 Firebase Configuration

### Setting up Live Firebase / Firestore:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create or select your CareSync project.
3. Enable **Authentication** (Email/Password).
4. Enable **Cloud Firestore** in Native Mode.
5. In **Project Settings** > **Service Accounts**, click **Generate New Private Key**.
6. Save the downloaded JSON file as `serviceAccountKey.json` inside `government/backend/`.
7. Deploy the provided `firestore.rules` to secure your Firestore database.

*(If `serviceAccountKey.json` is omitted, the backend automatically operates in development mock mode so you can build and test immediately.)*

---

## 📋 API Endpoints Reference

All API routes are prefixed with `/api/v1`:

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/` | Root health status & backend mode | No |
| `GET` | `/health` | Health check & database connection | No |
| `GET` | `/api/v1/auth/me` | Current authenticated officer profile | Yes (Bearer Token) |
| `POST` | `/api/v1/auth/verify-token` | Verify Firebase ID Token | No |
| `POST` | `/api/v1/auth/demo-session` | Generate demo token for local testing | No |
| `GET` | `/api/v1/dashboard/stats` | Aggregated dashboard KPI counters | Yes |
| `GET` | `/api/v1/hospitals` | List hospitals with filters (`district`, `status`, `search`) | Yes |
| `GET` | `/api/v1/hospitals/{id}` | Get hospital details & documents | Yes |
| `POST` | `/api/v1/hospitals` | Submit new hospital registration | Yes |
| `POST` | `/api/v1/hospitals/{id}/review` | Approve or reject hospital application | Yes |
| `POST` | `/api/v1/hospitals/{id}/suspend` | Suspend hospital clinical license | Yes |
| `GET` | `/api/v1/monitoring/capacities` | District bed & ICU capacity rollups | Yes |
| `GET` | `/api/v1/monitoring/trends` | Monthly hospital registration trends | Yes |
| `GET` | `/api/v1/complaints` | List citizen grievances with filters | Yes |
| `GET` | `/api/v1/complaints/{id}` | Get grievance details & history | Yes |
| `POST` | `/api/v1/complaints` | Lodge new citizen grievance | No |
| `PATCH` | `/api/v1/complaints/{id}/status` | Update grievance status & notes | Yes |
| `POST` | `/api/v1/complaints/{id}/assign` | Assign grievance to investigator | Yes |
| `POST` | `/api/v1/complaints/{id}/notes` | Add inspection note to grievance | Yes |
| `GET` | `/api/v1/announcements` | List health advisories & notices | Yes |
| `GET` | `/api/v1/announcements/{id}` | Get health advisory by ID | Yes |
| `POST` | `/api/v1/announcements` | Draft or publish health notice | Yes |
| `PUT` | `/api/v1/announcements/{id}` | Update advisory details | Yes |
| `PATCH` | `/api/v1/announcements/{id}/status`| Publish or archive advisory | Yes |
| `GET` | `/api/v1/staff` | List staff & regulatory directory | Yes |
| `GET` | `/api/v1/staff/{id}` | Get officer details | Yes |
| `POST` | `/api/v1/staff` | Register new health officer | Yes |
| `GET` | `/api/v1/activity-logs` | Retrieve regulatory audit trails | Yes |
| `POST` | `/api/v1/activity-logs` | Record administrative audit action | Yes |

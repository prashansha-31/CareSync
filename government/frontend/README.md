# CareSync — Government Admin Portal (Frontend)

## Overview
The **CareSync Government Admin Portal** is an industry-grade national healthcare command center designed for the **Ministry of Health & Family Welfare** and statutory healthcare regulatory authorities. 

It provides regulatory oversight across:
1. **Hospital Licensing & Accreditation**: Facility registration, application processing, inspection reviews, mandatory statutory clearance checks, approvals, rejections with cause, and license suspensions.
2. **Healthcare Capacity & Telemetry**: District-level bed tracking, ICU reserves, mechanical ventilator availability, and 24/7 casualty emergency triage readiness calculated dynamically from registered facilities.
3. **Citizen Grievance & Ombudsman Redressal**: Real-time logging and investigation into reported overcharging, medical negligence, lack of sanitation, and emergency care refusal.
4. **Public Health Directives & Advisories**: Official gazette bulletins, disease outbreak surveillance notices, and vaccination campaigns with draft/publish workflows and live Gazette document preview.
5. **Administrative Roster & Audit Trails**: Traceable inspector records, dynamic officer commissioning, and immutable administrative action logs.

> **Note**: This is **Portal 1 of 5** for the CareSync ecosystem (Government Admin, Hospital, Doctor, Patient, Creator/Influencer). Work is strictly frontend-first. Backend services (Firebase Auth, Firestore, Cloud Functions) are segregated in `government/backend/` and slated for Phase 2.

---

## Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Pure Vanilla CSS Design System (`src/index.css`) — no Tailwind CSS dependencies; uses custom CSS tokens, dark command headers, responsive data tables, modern cards, and animated modal sheets.
- **Routing**: React Router v7
- **Analytics & Visualizations**: Recharts (trend area charts, registration bar graphs, capacity distribution donuts)
- **Icons**: Lucide React
- **Notifications**: Integrated custom toast alert provider (`useToast`)
- **Storage Layer**: Zero dummy data initial state (`[]`). Persistent browser storage with real-time reactive event listeners, allowing operators to register real hospitals, submit grievances, create health advisories, and commission regulatory staff.

---

## Zero Dummy Data Architecture

In accordance with strict requirements:
- All initial datasets in `src/data/` start completely empty `[]`.
- All dashboard KPIs, bed counts, and occupancy percentages are calculated dynamically from registered facilities.
- The user interface includes prominent action triggers to populate real records:
  - **Register Hospital**: Form to submit facility name, type, registration number, district, contact, bed capacity, ICU beds, and ventilator units.
  - **Log Citizen Grievance**: Form to report hospital complaints with urgency levels, complainant details, and district categorization.
  - **Draft Health Advisory**: Create official public health directives, targeted districts, categories, and gazette bulletins.
  - **Commission Staff Officer**: Add certified health inspectors, medical commissioners, and audit officers.

---

## Directory Structure

```text
government/frontend/
├── public/
├── src/
│   ├── assets/              # Static branding and emblems
│   ├── components/
│   │   ├── common/          # ToastContext, StatusBadge, ConfirmDialog, Pagination, DemoNoticeBanner
│   │   ├── layout/          # DashboardLayout, Sidebar, TopNav
│   │   ├── dashboard/       # StatCards, RegistrationChart, StatusBreakdownChart, DistrictOverview, etc.
│   │   ├── hospitals/       # HospitalFilters, HospitalTable, HospitalDetailsModal, HospitalReviewModal, HospitalRegisterModal
│   │   ├── healthcare/      # CapacityMetricCards, CapacityCharts, MonitoringFilters, HospitalCapacityTable
│   │   ├── complaints/      # ComplaintFilters, ComplaintTable, ComplaintDetailsDrawer, ComplaintRegisterModal
│   │   ├── announcements/   # AnnouncementList, AnnouncementFormModal, AnnouncementPreviewModal
│   │   └── staff/           # StaffDirectoryTable, ActivityLogTable, StaffRegisterModal
│   ├── pages/               # LoginPage, DashboardPage, HospitalManagementPage, HealthcareMonitoringPage, etc.
│   ├── routes/              # AppRoutes definition
│   ├── hooks/               # useToast and helper hooks
│   ├── services/            # Storage & business logic services ready for Firebase integration
│   ├── types/               # Strict TypeScript definitions
│   ├── utils/               # Formatters and class helper utilities
│   ├── data/                # Empty initial state structures & district constants
│   ├── index.css            # Comprehensive Vanilla CSS design system
│   ├── App.tsx              # Root application provider
│   └── main.tsx             # Entrypoint
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

---

## Quick Start & Installation

### Prerequisites
- Node.js (v18.0.0 or higher, tested on v24.x)
- npm (v9.0.0 or higher)

### 1. Navigate to the Frontend Directory
```bash
cd CareSync/government/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```

The terminal will launch the local Vite development server (typically at `http://localhost:5173/`).

### 4. Build for Production
To validate TypeScript types and compile the optimized production bundle:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## Authentication & Operational Workflows

1. **Sign In**:
   - Enter your administrator or health commissioner email and password on the Login page (e.g. `admin@caresync.gov.in`).
   - Click **"Quick Fill Demo Session"** or enter any valid credentials to generate an authorized session.

2. **Register & Manage Hospitals**:
   - Navigate to **Hospital Licensing**.
   - Click **"Register Hospital"** to submit a facility with bed telemetry.
   - Click **"Review"** to perform compliance audits, check statutory approvals (Fire, Bio-Waste, AERB), and approve or reject applications.
   - Click **"Inspect"** to view detailed registration credentials.

3. **Monitor Live Capacity**:
   - Navigate to **Healthcare Capacity**.
   - Review bed capacity, ICU availability, and ventilator ratios calculated dynamically from approved hospitals.

4. **Ombudsman Grievances**:
   - Navigate to **Grievance Redressal**.
   - Click **"Log Grievance"** to record an incident.
   - Open any grievance to assign investigating officers, change status, and record resolution notes.

5. **Directives & Gazette Advisories**:
   - Navigate to **Health Advisories**.
   - Click **"Draft New Advisory"** to create a directive.
   - Click **"Official Gazette Preview"** to inspect the formal Ministry document.

6. **Personnel & Audit Trails**:
   - Navigate to **Staff & Audit Logs**.
   - Click **"Add Staff Officer"** to commission regulatory inspectors.
   - Switch to **Audit Logs** to view immutable event trails.

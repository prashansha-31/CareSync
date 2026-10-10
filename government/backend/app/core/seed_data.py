import datetime
import logging
from app.core.firebase import get_db

logger = logging.getLogger("caresync.seed")


def seed_initial_data():
    """
    Populates clean, realistic starter data into Firestore or the in-memory mock store
    if collections are currently empty.
    """
    db = get_db()
    today = datetime.date.today().isoformat()
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # 1. Seed Hospitals if empty
    existing_hospitals = list(db.collection("hospitals").stream())
    if not existing_hospitals:
        logger.info("Seeding initial registered hospitals...")
        hospitals_seed = [
            {
                "id": "HSP-001",
                "name": "All India Institute of Medical Sciences (AIIMS)",
                "registration_number": "REG-DEL-2024-001",
                "license_number": "LIC-2024-DEL-001",
                "district": "Central Metro",
                "state": "Delhi",
                "category": "Super-Specialty",
                "ownership": "Government",
                "contact_person": "Dr. Randeep Guleria",
                "phone": "+91 11 2658 8500",
                "email": "director@aiims.edu",
                "address": "Ansari Nagar, New Delhi",
                "total_beds": 2400,
                "available_beds": 312,
                "icu_beds": 280,
                "available_icu_beds": 24,
                "ventilators": 180,
                "available_ventilators": 14,
                "emergency_services": True,
                "ambulance_count": 28,
                "accreditation": "NABH Accredited",
                "status": "Approved",
                "applied_date": "2024-01-15",
                "reviewed_date": "2024-01-20",
                "reviewed_by": "Chief Medical Officer",
                "documents": [
                    {"name": "Clinical Establishment Certificate", "type": "PDF", "size": "2.8 MB", "verified": True},
                    {"name": "Fire Safety NOC", "type": "PDF", "size": "1.5 MB", "verified": True},
                    {"name": "Pollution Control Board Clearance", "type": "PDF", "size": "1.2 MB", "verified": True}
                ]
            },
            {
                "id": "HSP-002",
                "name": "Safdarjung Hospital & Vardhman Mahavir Medical College",
                "registration_number": "REG-DEL-2024-002",
                "license_number": "LIC-2024-DEL-002",
                "district": "Central Metro",
                "state": "Delhi",
                "category": "Multi-Specialty",
                "ownership": "Government",
                "contact_person": "Dr. S. V. Arya",
                "phone": "+91 11 2616 5060",
                "email": "admin@safdarjung.nic.in",
                "address": "Ring Road, Opposite AIIMS, New Delhi",
                "total_beds": 1530,
                "available_beds": 194,
                "icu_beds": 150,
                "available_icu_beds": 12,
                "ventilators": 90,
                "available_ventilators": 8,
                "emergency_services": True,
                "ambulance_count": 18,
                "accreditation": "State Certified",
                "status": "Approved",
                "applied_date": "2024-02-10",
                "reviewed_date": "2024-02-15",
                "reviewed_by": "Chief Medical Officer",
                "documents": [
                    {"name": "Clinical Registration", "type": "PDF", "size": "3.1 MB", "verified": True},
                    {"name": "Fire NOC", "type": "PDF", "size": "1.9 MB", "verified": True}
                ]
            },
            {
                "id": "HSP-003",
                "name": "Max Super Speciality Hospital (Saket)",
                "registration_number": "REG-DEL-2024-003",
                "license_number": "LIC-2024-DEL-003",
                "district": "South District",
                "state": "Delhi",
                "category": "Super-Specialty",
                "ownership": "Private",
                "contact_person": "Dr. Sandeep Buddhiraja",
                "phone": "+91 11 2651 5050",
                "email": "contact@maxhealthcare.com",
                "address": "1, 2 Press Enclave Road, Saket, New Delhi",
                "total_beds": 530,
                "available_beds": 84,
                "icu_beds": 95,
                "available_icu_beds": 11,
                "ventilators": 60,
                "available_ventilators": 9,
                "emergency_services": True,
                "ambulance_count": 14,
                "accreditation": "NABH Accredited",
                "status": "Approved",
                "applied_date": "2024-03-05",
                "reviewed_date": "2024-03-12",
                "reviewed_by": "Senior Healthcare Regulator",
                "documents": [
                    {"name": "NABH Accreditation Certificate", "type": "PDF", "size": "4.2 MB", "verified": True},
                    {"name": "Bio-Medical Waste NOC", "type": "PDF", "size": "2.1 MB", "verified": True}
                ]
            },
            {
                "id": "HSP-004",
                "name": "Metro North General Hospital & Trauma Center",
                "registration_number": "REG-DEL-2026-004",
                "license_number": "LIC-2026-DEL-004",
                "district": "North District",
                "state": "Delhi",
                "category": "General Hospital",
                "ownership": "Public-Private",
                "contact_person": "Dr. Vikas Saxena",
                "phone": "+91 11 2744 3311",
                "email": "info@metronorthhealth.org",
                "address": "Sector 9, Rohini, New Delhi",
                "total_beds": 350,
                "available_beds": 65,
                "icu_beds": 40,
                "available_icu_beds": 5,
                "ventilators": 20,
                "available_ventilators": 4,
                "emergency_services": True,
                "ambulance_count": 8,
                "accreditation": "ISO 9001:2015",
                "status": "Pending",
                "applied_date": today,
                "documents": [
                    {"name": "Clinical Establishment License Application", "type": "PDF", "size": "2.4 MB", "verified": True},
                    {"name": "Fire Safety Clearance NOC", "type": "PDF", "size": "1.8 MB", "verified": True}
                ]
            },
            {
                "id": "HSP-005",
                "name": "East Coast Community Health Center",
                "registration_number": "REG-DEL-2026-005",
                "license_number": "LIC-2026-DEL-005",
                "district": "East District",
                "state": "Delhi",
                "category": "Community Health Center",
                "ownership": "Government",
                "contact_person": "Dr. Meenakshi Sundaram",
                "phone": "+91 11 2250 8899",
                "email": "chc.east@delhihealth.gov.in",
                "address": "Main Road, Laxmi Nagar, Delhi",
                "total_beds": 120,
                "available_beds": 22,
                "icu_beds": 12,
                "available_icu_beds": 2,
                "ventilators": 6,
                "available_ventilators": 1,
                "emergency_services": True,
                "ambulance_count": 4,
                "accreditation": "State Certified",
                "status": "Pending",
                "applied_date": today,
                "documents": [
                    {"name": "District Health Department Endorsement", "type": "PDF", "size": "1.5 MB", "verified": True}
                ]
            }
        ]
        for h in hospitals_seed:
            doc_id = h["id"]
            db.collection("hospitals").document(doc_id).set(h)

    # 2. Seed Complaints if empty
    existing_complaints = list(db.collection("complaints").stream())
    if not existing_complaints:
        logger.info("Seeding initial citizen grievances...")
        complaints_seed = [
            {
                "id": "CMP-2026-001",
                "hospital_id": "HSP-003",
                "hospital_name": "Max Super Speciality Hospital (Saket)",
                "district": "South District",
                "category": "Overcharging / Billing Irregularity",
                "priority": "High",
                "status": "In Progress",
                "submitted_by": "Ramesh Chawla",
                "contact_email": "r.chawla@gmail.com",
                "description": "Patient was billed for disposable consumables above the ceiling tariff capped under government guidelines.",
                "submitted_date": today,
                "assigned_to": "Dr. Anjali Verma (Senior Healthcare Regulator)",
                "resolution_notes": "Preliminary billing audit initiated. Billing department summoned for documentation.",
                "history": [
                    {
                        "id": "H-CMP-2026-001-01",
                        "action": "Complaint Lodged",
                        "actor": "Ramesh Chawla",
                        "timestamp": f"{today} 09:30",
                        "notes": "Citizen grievance recorded in the official health regulatory registry."
                    },
                    {
                        "id": "H-CMP-2026-001-02",
                        "action": "Assigned to Dr. Anjali Verma (Senior Healthcare Regulator)",
                        "actor": "Administrative Officer",
                        "timestamp": f"{today} 11:15",
                        "notes": "Investigation assigned for tariff compliance verification."
                    }
                ]
            },
            {
                "id": "CMP-2026-002",
                "hospital_id": "HSP-004",
                "hospital_name": "Metro North General Hospital & Trauma Center",
                "district": "North District",
                "category": "Denial of Emergency Care",
                "priority": "Urgent",
                "status": "Escalated",
                "submitted_by": "Priya Sharma",
                "contact_email": "priya.sharma99@yahoo.com",
                "description": "Emergency triage refused stabilization to an accident patient demanding cash deposit first.",
                "submitted_date": today,
                "assigned_to": "Dr. Rajesh Sharma (District Health Inspector)",
                "resolution_notes": "Emergency show-cause notice issued under Clinical Establishments Act Section 12.",
                "history": [
                    {
                        "id": "H-CMP-2026-002-01",
                        "action": "Complaint Lodged",
                        "actor": "Priya Sharma",
                        "timestamp": f"{today} 08:10",
                        "notes": "Urgent grievance flagged by emergency helpline."
                    },
                    {
                        "id": "H-CMP-2026-002-02",
                        "action": "Status updated to 'Escalated'",
                        "actor": "Chief Medical Officer",
                        "timestamp": f"{today} 08:45",
                        "notes": "Critical statutory violation: Immediate on-site inspection ordered."
                    }
                ]
            }
        ]
        for c in complaints_seed:
            db.collection("complaints").document(c["id"]).set(c)

    # 3. Seed Announcements if empty
    existing_announcements = list(db.collection("announcements").stream())
    if not existing_announcements:
        logger.info("Seeding initial health notices...")
        announcements_seed = [
            {
                "id": "ANN-2026-001",
                "title": "Seasonal Dengue & Vector-Borne Disease Readiness Advisory",
                "summary": "Mandatory isolation fever bed reserves and diagnostic pricing ceiling.",
                "content": "All registered clinical establishments are directed to maintain at least 10% reserve beds for fever and dengue patients during the peak vector-borne transmission window. Platelet testing fees must strictly adhere to the state regulatory price cap.",
                "category": "Disease Outbreak Alert",
                "target_audience": "Hospitals & Healthcare Facilities",
                "target_districts": ["All Districts"],
                "priority": "High",
                "status": "Published",
                "reference_number": "GOV-ADV-2026-001",
                "author": "Directorate of Health Services",
                "created_date": today,
                "published_date": today
            },
            {
                "id": "ANN-2026-002",
                "title": "Mandatory Real-Time ICU & Oxygen Bed Availability Telemetry",
                "summary": "Clinical establishments must synchronize live bed counts every 6 hours.",
                "content": "Under the State Health Emergency Framework, all public and private multi-specialty hospitals must update their occupied and available general, ICU, and ventilator beds on the CareSync regulatory portal daily.",
                "category": "Regulatory Policy Update",
                "target_audience": "Hospitals & Healthcare Facilities",
                "target_districts": ["All Districts"],
                "priority": "Urgent",
                "status": "Published",
                "reference_number": "GOV-ADV-2026-002",
                "author": "Ministry of Health & Family Welfare",
                "created_date": today,
                "published_date": today
            }
        ]
        for a in announcements_seed:
            db.collection("announcements").document(a["id"]).set(a)

    # 4. Seed Staff Directory if empty
    existing_staff = list(db.collection("staff").stream())
    if not existing_staff:
        logger.info("Seeding initial staff directory...")
        staff_seed = [
            {
                "id": "STF-001",
                "name": "Dr. Arvind Rao",
                "badge_id": "GOV-DELHI-001",
                "email": "admin.officer@health.gov.in",
                "role": "Chief Medical Officer",
                "department": "Ministry of Health & Family Welfare",
                "district": "Central Metro",
                "status": "Active",
                "assigned_cases_count": 3,
                "joined_date": "2021-08-01"
            },
            {
                "id": "STF-002",
                "name": "Dr. Anjali Verma",
                "badge_id": "REG-4491",
                "email": "anjali.verma@health.gov.in",
                "role": "Senior Healthcare Regulator",
                "department": "Clinical Establishments Regulatory Cell",
                "district": "South District",
                "status": "Active",
                "assigned_cases_count": 4,
                "joined_date": "2022-03-15"
            },
            {
                "id": "STF-003",
                "name": "Dr. Rajesh Sharma",
                "badge_id": "REG-3810",
                "email": "rajesh.sharma@health.gov.in",
                "role": "District Health Inspector",
                "department": "Directorate of Health Services",
                "district": "North District",
                "status": "Active",
                "assigned_cases_count": 2,
                "joined_date": "2023-01-10"
            }
        ]
        for s in staff_seed:
            db.collection("staff").document(s["id"]).set(s)

    # 5. Seed Activity Logs if empty
    existing_logs = list(db.collection("activity_logs").stream())
    if not existing_logs:
        logger.info("Seeding initial activity audit trail...")
        logs_seed = [
            {
                "id": "LOG-0001",
                "action_type": "ADMIN_LOGIN",
                "actor": "Dr. Arvind Rao",
                "actor_role": "Chief Medical Officer",
                "related_record": "SESSION-DELHI-01",
                "details": "Authorized secure administrative session initialized.",
                "ip_address": "10.14.80.22",
                "timestamp": now_str
            },
            {
                "id": "LOG-0002",
                "action_type": "HOSPITAL_APPROVED",
                "actor": "Dr. Arvind Rao",
                "actor_role": "Chief Medical Officer",
                "related_record": "HSP-001",
                "details": "Hospital 'AIIMS' registration verified and approved.",
                "ip_address": "10.14.80.22",
                "timestamp": now_str
            }
        ]
        for l in logs_seed:
            db.collection("activity_logs").document(l["id"]).set(l)

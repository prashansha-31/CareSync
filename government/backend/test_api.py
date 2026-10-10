from fastapi.testclient import TestClient
from app.main import app

def test_backend_endpoints():
    with TestClient(app) as client:
        # 1. Health & Root
        print("Testing / ...")
        r = client.get("/")
        assert r.status_code == 200, f"Root failed: {r.status_code}"
        print("[OK] Root passed:", r.json())

        print("Testing /health ...")
        r = client.get("/health")
        assert r.status_code == 200, f"Health failed: {r.status_code}"
        print("[OK] Health passed:", r.json())

        # 2. Auth me with demo token
        print("Testing /api/v1/auth/me ...")
        headers = {"Authorization": "Bearer demo-token-123"}
        r = client.get("/api/v1/auth/me", headers=headers)
        assert r.status_code == 200, f"Auth me failed: {r.status_code}"
        print("[OK] Auth passed:", r.json()["name"])

        # 3. Dashboard stats
        print("Testing /api/v1/dashboard/stats ...")
        r = client.get("/api/v1/dashboard/stats", headers=headers)
        assert r.status_code == 200, f"Stats failed: {r.status_code}"
        stats = r.json()
        print("[OK] Dashboard stats passed:", stats)

        # 4. Hospitals list and filter
        print("Testing /api/v1/hospitals ...")
        r = client.get("/api/v1/hospitals", headers=headers)
        assert r.status_code == 200, f"Hospitals failed: {r.status_code}"
        hospitals = r.json()
        assert len(hospitals) > 0, "No seeded hospitals found"
        print(f"[OK] Hospitals retrieved: {len(hospitals)} records")

        # 5. Review Hospital (approve/reject)
        hosp_id = hospitals[-1]["id"]
        print(f"Testing /api/v1/hospitals/{hosp_id}/review ...")
        r = client.post(
            f"/api/v1/hospitals/{hosp_id}/review",
            json={"action": "approve", "reason": "Documents verified"},
            headers=headers
        )
        assert r.status_code == 200, f"Hospital review failed: {r.status_code}"
        print(f"[OK] Hospital review passed for {hosp_id}: status is {r.json()['status']}")

        # 6. Monitoring Capacities & Trends
        print("Testing /api/v1/monitoring/capacities ...")
        r = client.get("/api/v1/monitoring/capacities", headers=headers)
        assert r.status_code == 200, f"Monitoring failed: {r.status_code}"
        print(f"[OK] Monitoring capacities passed: {len(r.json())} districts reported")

        print("Testing /api/v1/monitoring/trends ...")
        r = client.get("/api/v1/monitoring/trends", headers=headers)
        assert r.status_code == 200, f"Trends failed: {r.status_code}"
        print("[OK] Trends passed:", len(r.json()), "months")

        # 7. Complaints
        print("Testing /api/v1/complaints ...")
        r = client.get("/api/v1/complaints", headers=headers)
        assert r.status_code == 200, f"Complaints failed: {r.status_code}"
        complaints = r.json()
        print(f"[OK] Complaints list passed: {len(complaints)} records")

        # Create new complaint
        print("Testing POST /api/v1/complaints ...")
        r = client.post(
            "/api/v1/complaints",
            json={
                "hospital_name": "Metro North General Hospital",
                "district": "North District",
                "category": "Infrastructure / Sanitation",
                "priority": "Medium",
                "submitted_by": "Vikas Patel",
                "contact_email": "vikas.patel@example.com",
                "description": "Restrooms on 2nd floor lack regular sanitization."
            }
        )
        assert r.status_code == 201, f"Create complaint failed: {r.status_code}"
        new_cmp = r.json()
        print("[OK] New complaint created:", new_cmp["id"])

        # Update complaint status
        r = client.patch(
            f"/api/v1/complaints/{new_cmp['id']}/status",
            json={"status": "In Progress", "notes": "Inspector sent on-site."},
            headers=headers
        )
        assert r.status_code == 200, f"Update complaint status failed: {r.status_code}"
        print(f"[OK] Complaint {new_cmp['id']} status updated to {r.json()['status']}")

        # 8. Announcements
        print("Testing /api/v1/announcements ...")
        r = client.get("/api/v1/announcements", headers=headers)
        assert r.status_code == 200, f"Announcements failed: {r.status_code}"
        print(f"[OK] Announcements passed: {len(r.json())} records")

        # 9. Staff Directory & Activity Logs
        print("Testing /api/v1/staff ...")
        r = client.get("/api/v1/staff", headers=headers)
        assert r.status_code == 200, f"Staff directory failed: {r.status_code}"
        print(f"[OK] Staff list passed: {len(r.json())} officers")

        print("Testing /api/v1/activity-logs ...")
        r = client.get("/api/v1/activity-logs", headers=headers)
        assert r.status_code == 200, f"Activity logs failed: {r.status_code}"
        print(f"[OK] Activity logs passed: {len(r.json())} audit entries")

        print("\n>>> ALL BACKEND API ENDPOINTS PASSED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    test_backend_endpoints()

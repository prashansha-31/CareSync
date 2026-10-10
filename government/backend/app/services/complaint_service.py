import datetime
from typing import List, Optional
from app.core.firebase import get_db
from app.models.complaint import (
    ComplaintCreate,
    ComplaintResponse,
    ComplaintStatusUpdate,
    ComplaintHistoryEntry,
)


class ComplaintService:
    def __init__(self):
        self.collection_name = "complaints"

    def get_all(
        self,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        district: Optional[str] = None,
        search: Optional[str] = None,
    ) -> List[ComplaintResponse]:
        db = get_db()
        docs = db.collection(self.collection_name).stream()
        results: List[ComplaintResponse] = []

        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id

            if status and status.lower() != "all" and data.get("status") != status:
                continue
            if priority and priority.lower() != "all" and data.get("priority") != priority:
                continue
            if district and district.lower() != "all" and data.get("district") != district:
                continue
            if search:
                s = search.lower()
                h_name = data.get("hospital_name", "").lower()
                sub = data.get("submitted_by", "").lower()
                desc = data.get("description", "").lower()
                cid = doc.id.lower()
                if s not in h_name and s not in sub and s not in desc and s not in cid:
                    continue

            results.append(ComplaintResponse(**data))

        # Sort newest first
        results.sort(key=lambda x: x.submitted_date, reverse=True)
        return results

    def get_by_id(self, complaint_id: str) -> Optional[ComplaintResponse]:
        db = get_db()
        doc = db.collection(self.collection_name).document(complaint_id).get()
        if not doc.exists:
            return None
        data = doc.to_dict()
        data["id"] = doc.id
        return ComplaintResponse(**data)

    def create(self, data: ComplaintCreate) -> ComplaintResponse:
        db = get_db()
        today = datetime.date.today().isoformat()
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

        existing = list(db.collection(self.collection_name).stream())
        doc_id = f"CMP-2026-{str(len(existing) + 1).zfill(3)}"

        initial_history = [
            {
                "id": f"H-{doc_id}-01",
                "action": "Complaint Lodged",
                "actor": data.submitted_by,
                "timestamp": now,
                "notes": "Citizen grievance recorded in the official health regulatory registry."
            }
        ]

        payload = data.model_dump()
        payload.update({
            "status": "Open",
            "submitted_date": today,
            "assigned_to": None,
            "resolution_notes": None,
            "history": initial_history
        })

        db.collection(self.collection_name).document(doc_id).set(payload)
        payload["id"] = doc_id
        return ComplaintResponse(**payload)

    def update_status(
        self,
        complaint_id: str,
        update: ComplaintStatusUpdate,
        actor: str = "Regulator Officer"
    ) -> Optional[ComplaintResponse]:
        db = get_db()
        doc_ref = db.collection(self.collection_name).document(complaint_id)
        doc = doc_ref.get()
        if not doc.exists:
            return None

        data = doc.to_dict()
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        history = data.get("history", [])

        history.append({
            "id": f"H-{complaint_id}-{len(history) + 1}",
            "action": f"Status updated to '{update.status}'",
            "actor": actor,
            "timestamp": now,
            "notes": update.notes or f"Case marked as {update.status}"
        })

        updates = {
            "status": update.status,
            "history": history
        }
        if update.notes:
            updates["resolution_notes"] = update.notes

        doc_ref.update(updates)
        return self.get_by_id(complaint_id)

    def assign(
        self,
        complaint_id: str,
        staff_name: str,
        actor: str = "Administrative Officer"
    ) -> Optional[ComplaintResponse]:
        db = get_db()
        doc_ref = db.collection(self.collection_name).document(complaint_id)
        doc = doc_ref.get()
        if not doc.exists:
            return None

        data = doc.to_dict()
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        history = data.get("history", [])

        history.append({
            "id": f"H-{complaint_id}-{len(history) + 1}",
            "action": f"Assigned to {staff_name}",
            "actor": actor,
            "timestamp": now,
            "notes": f"Investigation task delegated to {staff_name}"
        })

        updates = {
            "assigned_to": staff_name,
            "status": "In Progress" if data.get("status") == "Open" else data.get("status"),
            "history": history
        }

        doc_ref.update(updates)
        return self.get_by_id(complaint_id)

    def add_notes(
        self,
        complaint_id: str,
        notes: str,
        actor: str = "Investigating Officer"
    ) -> Optional[ComplaintResponse]:
        db = get_db()
        doc_ref = db.collection(self.collection_name).document(complaint_id)
        doc = doc_ref.get()
        if not doc.exists:
            return None

        data = doc.to_dict()
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        history = data.get("history", [])

        history.append({
            "id": f"H-{complaint_id}-{len(history) + 1}",
            "action": "Inspection / Case Note Added",
            "actor": actor,
            "timestamp": now,
            "notes": notes
        })

        doc_ref.update({"history": history})
        return self.get_by_id(complaint_id)


complaint_service = ComplaintService()

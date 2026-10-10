import datetime
from typing import List, Optional
from app.core.firebase import get_db
from app.models.hospital import (
    HospitalCreate,
    HospitalResponse,
    HospitalDocument,
    HospitalStatus,
)


STANDARD_DOCUMENTS = [
    HospitalDocument(name="Clinical Establishment Registration Certificate", type="PDF", size="2.4 MB", verified=True),
    HospitalDocument(name="Fire Safety Clearance NOC", type="PDF", size="1.8 MB", verified=True),
    HospitalDocument(name="Bio-Medical Waste Authorization", type="PDF", size="1.1 MB", verified=True),
]


class HospitalService:
    def __init__(self):
        self.collection_name = "hospitals"

    def get_all(
        self,
        district: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[HospitalResponse]:
        db = get_db()
        docs = db.collection(self.collection_name).stream()
        results: List[HospitalResponse] = []

        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id

            # Apply filters
            if district and district.lower() != "all" and data.get("district") != district:
                continue
            if status and status.lower() != "all" and data.get("status") != status:
                continue
            if search:
                s = search.lower()
                name = data.get("name", "").lower()
                lic = data.get("license_number", "").lower()
                reg = data.get("registration_number", "").lower()
                if s not in name and s not in lic and s not in reg:
                    continue

            results.append(HospitalResponse(**data))

        # Sort newest first
        results.sort(key=lambda x: x.applied_date, reverse=True)
        return results

    def get_by_id(self, hospital_id: str) -> Optional[HospitalResponse]:
        db = get_db()
        doc = db.collection(self.collection_name).document(hospital_id).get()
        if not doc.exists:
            return None
        data = doc.to_dict()
        data["id"] = doc.id
        return HospitalResponse(**data)

    def create(self, data: HospitalCreate) -> HospitalResponse:
        db = get_db()
        today = datetime.date.today().isoformat()
        
        # Count existing docs to form ID
        existing = list(db.collection(self.collection_name).stream())
        doc_id = f"HSP-{str(len(existing) + 1).zfill(3)}"

        reg_num = data.registration_number or f"REG-2026-{doc_id}"
        docs = data.documents if data.documents else STANDARD_DOCUMENTS

        payload = data.model_dump()
        payload.update({
            "registration_number": reg_num,
            "status": "Pending",
            "applied_date": today,
            "documents": [d.model_dump() for d in docs]
        })

        db.collection(self.collection_name).document(doc_id).set(payload)
        payload["id"] = doc_id
        return HospitalResponse(**payload)

    def review(
        self,
        hospital_id: str,
        action: str,
        reason: Optional[str] = None,
        reviewer_name: str = "Chief Medical Officer"
    ) -> Optional[HospitalResponse]:
        db = get_db()
        doc_ref = db.collection(self.collection_name).document(hospital_id)
        doc = doc_ref.get()
        if not doc.exists:
            return None

        today = datetime.date.today().isoformat()
        updates = {
            "reviewed_date": today,
            "reviewed_by": reviewer_name,
        }

        if action == "approve":
            updates["status"] = "Approved"
            updates["rejection_reason"] = None
        else:
            updates["status"] = "Rejected"
            updates["rejection_reason"] = reason or "Did not satisfy mandatory statutory clearances."

        doc_ref.update(updates)
        return self.get_by_id(hospital_id)

    def suspend(self, hospital_id: str, reason: str) -> Optional[HospitalResponse]:
        db = get_db()
        doc_ref = db.collection(self.collection_name).document(hospital_id)
        doc = doc_ref.get()
        if not doc.exists:
            return None

        updates = {
            "status": "Suspended",
            "suspension_reason": reason,
        }
        doc_ref.update(updates)
        return self.get_by_id(hospital_id)


hospital_service = HospitalService()

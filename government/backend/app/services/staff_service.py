import datetime
from typing import List, Optional
from app.core.firebase import get_db
from app.models.staff import (
    StaffMemberCreate,
    StaffMemberResponse,
    ActivityLogCreate,
    ActivityLogResponse,
)


class StaffService:
    def __init__(self):
        self.staff_collection = "staff"
        self.log_collection = "activity_logs"

    def get_all(
        self,
        role: Optional[str] = None,
        district: Optional[str] = None,
        status: Optional[str] = None,
    ) -> List[StaffMemberResponse]:
        db = get_db()
        docs = db.collection(self.staff_collection).stream()
        results: List[StaffMemberResponse] = []

        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id

            if role and role.lower() != "all" and data.get("role") != role:
                continue
            if district and district.lower() != "all" and data.get("district") != district:
                continue
            if status and status.lower() != "all" and data.get("status") != status:
                continue

            results.append(StaffMemberResponse(**data))

        return results

    def get_by_id(self, staff_id: str) -> Optional[StaffMemberResponse]:
        db = get_db()
        doc = db.collection(self.staff_collection).document(staff_id).get()
        if not doc.exists:
            return None
        data = doc.to_dict()
        data["id"] = doc.id
        return StaffMemberResponse(**data)

    def create(self, data: StaffMemberCreate) -> StaffMemberResponse:
        db = get_db()
        today = datetime.date.today().isoformat()
        existing = list(db.collection(self.staff_collection).stream())
        seq = str(len(existing) + 1).zfill(3)
        doc_id = f"STF-{seq}"

        payload = data.model_dump()
        payload.update({
            "joined_date": today,
            "badge_id": data.badge_id or f"GOV-{seq}"
        })

        db.collection(self.staff_collection).document(doc_id).set(payload)
        payload["id"] = doc_id
        return StaffMemberResponse(**payload)

    def log_activity(self, log_in: ActivityLogCreate) -> ActivityLogResponse:
        db = get_db()
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        existing = list(db.collection(self.log_collection).stream())
        doc_id = f"LOG-{str(len(existing) + 1).zfill(4)}"

        payload = log_in.model_dump()
        payload["timestamp"] = now

        db.collection(self.log_collection).document(doc_id).set(payload)
        payload["id"] = doc_id
        return ActivityLogResponse(**payload)

    def get_activity_logs(self, limit: int = 50) -> List[ActivityLogResponse]:
        db = get_db()
        docs = db.collection(self.log_collection).stream()
        results: List[ActivityLogResponse] = []

        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            results.append(ActivityLogResponse(**data))

        # Sort reverse chronological
        results.sort(key=lambda x: x.timestamp, reverse=True)
        return results[:limit]


staff_service = StaffService()

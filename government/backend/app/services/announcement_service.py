import datetime
from typing import List, Optional
from app.core.firebase import get_db
from app.models.announcement import (
    AnnouncementCreate,
    AnnouncementUpdate,
    AnnouncementResponse,
    AnnouncementStatus,
)


class AnnouncementService:
    def __init__(self):
        self.collection_name = "announcements"

    def get_all(
        self,
        status: Optional[str] = None,
        category: Optional[str] = None,
        priority: Optional[str] = None,
    ) -> List[AnnouncementResponse]:
        db = get_db()
        docs = db.collection(self.collection_name).stream()
        results: List[AnnouncementResponse] = []

        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id

            if status and status.lower() != "all" and data.get("status") != status:
                continue
            if category and category.lower() != "all" and data.get("category") != category:
                continue
            if priority and priority.lower() != "all" and data.get("priority") != priority:
                continue

            results.append(AnnouncementResponse(**data))

        # Sort newest first
        results.sort(key=lambda x: x.created_date, reverse=True)
        return results

    def get_by_id(self, announcement_id: str) -> Optional[AnnouncementResponse]:
        db = get_db()
        doc = db.collection(self.collection_name).document(announcement_id).get()
        if not doc.exists:
            return None
        data = doc.to_dict()
        data["id"] = doc.id
        return AnnouncementResponse(**data)

    def create(self, data: AnnouncementCreate, author: str = "Ministry of Health") -> AnnouncementResponse:
        db = get_db()
        today = datetime.date.today().isoformat()

        existing = list(db.collection(self.collection_name).stream())
        seq = str(len(existing) + 1).zfill(3)
        doc_id = f"ANN-2026-{seq}"
        ref_num = f"GOV-ADV-2026-{seq}"

        payload = data.model_dump()
        payload.update({
            "reference_number": ref_num,
            "author": author,
            "created_date": today,
            "published_date": today if data.status == "Published" else None
        })

        db.collection(self.collection_name).document(doc_id).set(payload)
        payload["id"] = doc_id
        return AnnouncementResponse(**payload)

    def update(self, announcement_id: str, data: AnnouncementUpdate) -> Optional[AnnouncementResponse]:
        db = get_db()
        doc_ref = db.collection(self.collection_name).document(announcement_id)
        doc = doc_ref.get()
        if not doc.exists:
            return None

        update_data = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
        if update_data:
            doc_ref.update(update_data)

        return self.get_by_id(announcement_id)

    def update_status(self, announcement_id: str, new_status: AnnouncementStatus) -> Optional[AnnouncementResponse]:
        db = get_db()
        doc_ref = db.collection(self.collection_name).document(announcement_id)
        doc = doc_ref.get()
        if not doc.exists:
            return None

        existing_data = doc.to_dict()
        today = datetime.date.today().isoformat()
        updates = {"status": new_status}

        if new_status == "Published" and not existing_data.get("published_date"):
            updates["published_date"] = today

        doc_ref.update(updates)
        return self.get_by_id(announcement_id)


announcement_service = AnnouncementService()

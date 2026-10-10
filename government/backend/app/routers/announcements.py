from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.core.security import get_current_user, CurrentUser
from app.models.announcement import (
    AnnouncementCreate,
    AnnouncementUpdate,
    AnnouncementResponse,
    AnnouncementStatusUpdate,
)
from app.models.staff import ActivityLogCreate
from app.services.announcement_service import announcement_service
from app.services.staff_service import staff_service

router = APIRouter(prefix="/announcements", tags=["Health Advisories & Public Notices"])


@router.get("", response_model=List[AnnouncementResponse], summary="List all health advisories")
async def list_announcements(
    status: Optional[str] = Query(None, description="Filter by status (Draft, Published, Archived)"),
    category: Optional[str] = Query(None, description="Filter by advisory category"),
    priority: Optional[str] = Query(None, description="Filter by priority (Normal, High, Urgent)"),
    user: CurrentUser = Depends(get_current_user),
):
    """
    Returns public health advisories, outbreak notices, and protocol advisories.
    """
    return announcement_service.get_all(status=status, category=category, priority=priority)


@router.get("/{announcement_id}", response_model=AnnouncementResponse, summary="Get advisory by ID")
async def get_announcement(
    announcement_id: str,
    user: CurrentUser = Depends(get_current_user),
):
    item = announcement_service.get_by_id(announcement_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Announcement '{announcement_id}' not found."
        )
    return item


@router.post("", response_model=AnnouncementResponse, status_code=status.HTTP_201_CREATED, summary="Create health advisory")
async def create_announcement(
    payload: AnnouncementCreate,
    user: CurrentUser = Depends(get_current_user),
):
    """
    Drafts or publishes a new public health advisory.
    """
    created = announcement_service.create(payload, author=f"{user.name} ({user.department})")

    if created.status == "Published":
        staff_service.log_activity(
            ActivityLogCreate(
                action_type="ANNOUNCEMENT_PUBLISHED",
                actor=user.name,
                actor_role=user.role,
                related_record=created.id,
                details=f"Public health notice published: {created.title} ({created.reference_number})"
            )
        )

    return created


@router.put("/{announcement_id}", response_model=AnnouncementResponse, summary="Update advisory details")
async def update_announcement(
    announcement_id: str,
    payload: AnnouncementUpdate,
    user: CurrentUser = Depends(get_current_user),
):
    updated = announcement_service.update(announcement_id, payload)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Announcement '{announcement_id}' not found."
        )
    return updated


@router.patch("/{announcement_id}/status", response_model=AnnouncementResponse, summary="Publish or archive advisory")
async def update_announcement_status(
    announcement_id: str,
    req: AnnouncementStatusUpdate,
    user: CurrentUser = Depends(get_current_user),
):
    """
    Transitions advisory status between Draft, Published, and Archived.
    """
    updated = announcement_service.update_status(announcement_id, req.status)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Announcement '{announcement_id}' not found."
        )

    action_type = "ANNOUNCEMENT_PUBLISHED" if req.status == "Published" else "ANNOUNCEMENT_ARCHIVED"
    staff_service.log_activity(
        ActivityLogCreate(
            action_type=action_type,
            actor=user.name,
            actor_role=user.role,
            related_record=updated.id,
            details=f"Announcement marked as {req.status}: {updated.title}"
        )
    )

    return updated

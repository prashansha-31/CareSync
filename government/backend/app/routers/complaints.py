from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.core.security import get_current_user, CurrentUser
from app.models.complaint import (
    ComplaintCreate,
    ComplaintResponse,
    ComplaintStatusUpdate,
    ComplaintAssignRequest,
    ComplaintAddNotesRequest,
)
from app.models.staff import ActivityLogCreate
from app.services.complaint_service import complaint_service
from app.services.staff_service import staff_service

router = APIRouter(prefix="/complaints", tags=["Citizen Grievance Redressal"])


@router.get("", response_model=List[ComplaintResponse], summary="List all citizen complaints with filters")
async def list_complaints(
    status: Optional[str] = Query(None, description="Filter by status (Open, In Progress, Resolved, Escalated)"),
    priority: Optional[str] = Query(None, description="Filter by priority (Low, Medium, High, Urgent)"),
    district: Optional[str] = Query(None, description="Filter by district"),
    search: Optional[str] = Query(None, description="Search keyword in hospital name or description"),
    user: CurrentUser = Depends(get_current_user),
):
    """
    Returns registered grievances with multi-criteria filtering.
    """
    return complaint_service.get_all(status=status, priority=priority, district=district, search=search)


@router.get("/{complaint_id}", response_model=ComplaintResponse, summary="Get grievance by ID")
async def get_complaint(
    complaint_id: str,
    user: CurrentUser = Depends(get_current_user),
):
    complaint = complaint_service.get_by_id(complaint_id)
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint with ID '{complaint_id}' not found."
        )
    return complaint


@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED, summary="Submit a citizen complaint")
async def create_complaint(
    payload: ComplaintCreate,
):
    """
    Public or administrative submission of a hospital grievance.
    Does not require login to ensure citizens can register complaints easily.
    """
    created = complaint_service.create(payload)

    staff_service.log_activity(
        ActivityLogCreate(
            action_type="ADMIN_LOGIN",
            actor=payload.submitted_by,
            actor_role="Citizen Complainant",
            related_record=created.id,
            details=f"Grievance lodged against {created.hospital_name} ({created.category})"
        )
    )

    return created


@router.patch("/{complaint_id}/status", response_model=ComplaintResponse, summary="Update complaint status")
async def update_complaint_status(
    complaint_id: str,
    req: ComplaintStatusUpdate,
    user: CurrentUser = Depends(get_current_user),
):
    """
    Updates the resolution status of an active complaint.
    """
    updated = complaint_service.update_status(
        complaint_id=complaint_id,
        update=req,
        actor=f"{user.name} ({user.role})"
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint with ID '{complaint_id}' not found."
        )

    staff_service.log_activity(
        ActivityLogCreate(
            action_type="COMPLAINT_STATUS_UPDATED",
            actor=user.name,
            actor_role=user.role,
            related_record=updated.id,
            details=f"Complaint status updated to '{req.status}'. Notes: {req.notes or 'No notes added'}"
        )
    )

    return updated


@router.post("/{complaint_id}/assign", response_model=ComplaintResponse, summary="Assign complaint to regulator officer")
async def assign_complaint(
    complaint_id: str,
    req: ComplaintAssignRequest,
    user: CurrentUser = Depends(get_current_user),
):
    """
    Delegates a grievance investigation to an authorized health inspector or regulator.
    """
    updated = complaint_service.assign(
        complaint_id=complaint_id,
        staff_name=req.staff_name,
        actor=user.name
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint with ID '{complaint_id}' not found."
        )

    staff_service.log_activity(
        ActivityLogCreate(
            action_type="COMPLAINT_ASSIGNED",
            actor=user.name,
            actor_role=user.role,
            related_record=updated.id,
            details=f"Grievance assigned to inspector: {req.staff_name}"
        )
    )

    return updated


@router.post("/{complaint_id}/notes", response_model=ComplaintResponse, summary="Add case note to complaint")
async def add_complaint_notes(
    complaint_id: str,
    req: ComplaintAddNotesRequest,
    user: CurrentUser = Depends(get_current_user),
):
    """
    Adds inspection observation or audit note to complaint chronological history.
    """
    updated = complaint_service.add_notes(
        complaint_id=complaint_id,
        notes=req.notes,
        actor=f"{user.name} ({user.role})"
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint with ID '{complaint_id}' not found."
        )
    return updated

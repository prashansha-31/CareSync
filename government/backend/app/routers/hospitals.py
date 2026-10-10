from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.core.security import get_current_user, CurrentUser
from app.models.hospital import (
    HospitalCreate,
    HospitalResponse,
    HospitalReviewRequest,
    HospitalSuspendRequest,
)
from app.models.staff import ActivityLogCreate
from app.services.hospital_service import hospital_service
from app.services.staff_service import staff_service

router = APIRouter(prefix="/hospitals", tags=["Hospital Licensing & Approvals"])


@router.get("", response_model=List[HospitalResponse], summary="List all hospitals with filters")
async def list_hospitals(
    district: Optional[str] = Query(None, description="Filter by district name"),
    status: Optional[str] = Query(None, description="Filter by approval status (Pending, Approved, Rejected, Suspended)"),
    search: Optional[str] = Query(None, description="Search by hospital name or license number"),
    user: CurrentUser = Depends(get_current_user),
):
    """
    Returns registered hospitals and pending licensing applications.
    Supports filtering by district, status, and search keywords.
    """
    return hospital_service.get_all(district=district, status=status, search=search)


@router.get("/{hospital_id}", response_model=HospitalResponse, summary="Get hospital by ID")
async def get_hospital(
    hospital_id: str,
    user: CurrentUser = Depends(get_current_user),
):
    hospital = hospital_service.get_by_id(hospital_id)
    if not hospital:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hospital with ID '{hospital_id}' not found."
        )
    return hospital


@router.post("", response_model=HospitalResponse, status_code=status.HTTP_201_CREATED, summary="Submit hospital application")
async def register_hospital(
    payload: HospitalCreate,
    user: CurrentUser = Depends(get_current_user),
):
    """
    Submits a new hospital licensing application to the government registry.
    """
    created = hospital_service.create(payload)

    # Record regulatory activity log
    staff_service.log_activity(
        ActivityLogCreate(
            action_type="ADMIN_LOGIN",
            actor=user.name,
            actor_role=user.role,
            related_record=created.id,
            details=f"New hospital application registered: {created.name}"
        )
    )

    return created


@router.post("/{hospital_id}/review", response_model=HospitalResponse, summary="Approve or reject hospital application")
async def review_hospital(
    hospital_id: str,
    req: HospitalReviewRequest,
    user: CurrentUser = Depends(get_current_user),
):
    """
    Approves or rejects a hospital registration application.
    Requires administrative clearance.
    """
    if req.action == "reject" and not req.reason:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A reason must be stated when rejecting a hospital registration."
        )

    reviewer = req.reviewer_name or user.name
    updated = hospital_service.review(
        hospital_id=hospital_id,
        action=req.action,
        reason=req.reason,
        reviewer_name=reviewer,
    )

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hospital '{hospital_id}' not found."
        )

    # Record regulatory audit log
    action_type = "HOSPITAL_APPROVED" if req.action == "approve" else "HOSPITAL_REJECTED"
    staff_service.log_activity(
        ActivityLogCreate(
            action_type=action_type,
            actor=user.name,
            actor_role=user.role,
            related_record=updated.id,
            details=f"Hospital '{updated.name}' was {updated.status}. Reason: {req.reason or 'All clearance documents verified'}"
        )
    )

    return updated


@router.post("/{hospital_id}/suspend", response_model=HospitalResponse, summary="Suspend hospital license")
async def suspend_hospital(
    hospital_id: str,
    req: HospitalSuspendRequest,
    user: CurrentUser = Depends(get_current_user),
):
    """
    Enforces regulatory suspension on a hospital establishment.
    """
    updated = hospital_service.suspend(hospital_id=hospital_id, reason=req.reason)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hospital '{hospital_id}' not found."
        )

    staff_service.log_activity(
        ActivityLogCreate(
            action_type="HOSPITAL_SUSPENDED",
            actor=user.name,
            actor_role=user.role,
            related_record=updated.id,
            details=f"Hospital '{updated.name}' license suspended. Notice reason: {req.reason}"
        )
    )

    return updated

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.core.security import get_current_user, CurrentUser
from app.models.staff import (
    StaffMemberCreate,
    StaffMemberResponse,
    ActivityLogCreate,
    ActivityLogResponse,
)
from app.services.staff_service import staff_service

router = APIRouter(tags=["Staff Directory & Activity Logs"])


@router.get("/staff", response_model=List[StaffMemberResponse], summary="List staff directory")
async def list_staff(
    role: Optional[str] = Query(None, description="Filter by official role"),
    district: Optional[str] = Query(None, description="Filter by assigned district"),
    status: Optional[str] = Query(None, description="Filter by status (Active, On Leave, Suspended)"),
    user: CurrentUser = Depends(get_current_user),
):
    """
    Returns healthcare administration officers, inspectors, and regulators.
    """
    return staff_service.get_all(role=role, district=district, status=status)


@router.get("/staff/{staff_id}", response_model=StaffMemberResponse, summary="Get staff member by ID")
async def get_staff_member(
    staff_id: str,
    user: CurrentUser = Depends(get_current_user),
):
    member = staff_service.get_by_id(staff_id)
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Staff member with ID '{staff_id}' not found."
        )
    return member


@router.post("/staff", response_model=StaffMemberResponse, status_code=status.HTTP_201_CREATED, summary="Register staff member")
async def register_staff_member(
    payload: StaffMemberCreate,
    user: CurrentUser = Depends(get_current_user),
):
    """
    Registers a new health inspector or regulatory officer.
    """
    return staff_service.create(payload)


@router.get("/activity-logs", response_model=List[ActivityLogResponse], summary="Get regulatory activity logs")
async def get_activity_logs(
    limit: int = Query(50, ge=1, le=200, description="Number of log entries to retrieve"),
    user: CurrentUser = Depends(get_current_user),
):
    """
    Returns immutable regulatory audit trails of administrative actions.
    """
    return staff_service.get_activity_logs(limit=limit)


@router.post("/activity-logs", response_model=ActivityLogResponse, status_code=status.HTTP_201_CREATED, summary="Record audit log entry")
async def record_activity_log(
    payload: ActivityLogCreate,
    user: CurrentUser = Depends(get_current_user),
):
    """
    Records an administrative action in the compliance audit trail.
    """
    return staff_service.log_activity(payload)

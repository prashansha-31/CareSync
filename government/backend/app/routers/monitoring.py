from typing import List
from fastapi import APIRouter, Depends
from app.core.security import get_current_user, CurrentUser
from app.models.monitoring import DistrictCapacityResponse
from app.services.monitoring_service import monitoring_service

router = APIRouter(prefix="/monitoring", tags=["Real-Time Capacity Monitoring"])


@router.get("/capacities", response_model=List[DistrictCapacityResponse], summary="Get district-level bed and ICU capacities")
async def get_district_capacities(
    user: CurrentUser = Depends(get_current_user),
):
    """
    Returns live aggregated hospital capacity across districts, including
    total beds, occupied beds, ICU units, and ventilator status.
    """
    return monitoring_service.get_district_capacities()


@router.get("/trends", response_model=List[dict], summary="Get monthly application trends")
async def get_registration_trends(
    user: CurrentUser = Depends(get_current_user),
):
    """
    Returns licensing and registration trend metrics over recent months.
    """
    return monitoring_service.get_registration_trends()

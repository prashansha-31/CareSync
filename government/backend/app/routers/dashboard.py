from fastapi import APIRouter, Depends
from app.core.security import get_current_user, CurrentUser
from app.models.stats import DashboardStatsResponse
from app.services.dashboard_service import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["Administrative Dashboard"])


@router.get("/stats", response_model=DashboardStatsResponse, summary="Get summary statistics for dashboard")
async def get_dashboard_stats(
    user: CurrentUser = Depends(get_current_user),
):
    """
    Returns aggregated metrics for hospitals, beds, complaints, and active notices.
    """
    return dashboard_service.get_stats()

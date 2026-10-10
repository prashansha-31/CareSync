from pydantic import BaseModel


class DashboardStatsResponse(BaseModel):
    total_registered_hospitals: int = 0
    hospitals_awaiting_approval: int = 0
    reported_available_beds: int = 0
    total_beds_capacity: int = 0
    open_complaints: int = 0
    urgent_complaints: int = 0
    active_announcements: int = 0
    bed_occupancy_rate: int = 0

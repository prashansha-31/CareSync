from app.models.stats import DashboardStatsResponse
from app.services.hospital_service import hospital_service
from app.services.complaint_service import complaint_service
from app.services.announcement_service import announcement_service


class DashboardService:
    def get_stats(self) -> DashboardStatsResponse:
        all_hospitals = hospital_service.get_all()
        approved_hospitals = [h for h in all_hospitals if h.status == "Approved"]
        pending_hospitals = [h for h in all_hospitals if h.status == "Pending"]

        total_beds = sum(h.total_beds for h in approved_hospitals)
        available_beds = sum(h.available_beds for h in approved_hospitals)
        occupied_beds = max(0, total_beds - available_beds)

        occupancy_rate = 0
        if total_beds > 0:
            occupancy_rate = int((occupied_beds / total_beds) * 100)

        all_complaints = complaint_service.get_all()
        open_complaints = sum(1 for c in all_complaints if c.status in ["Open", "In Progress"])
        urgent_complaints = sum(1 for c in all_complaints if c.priority == "Urgent" or c.status == "Escalated")

        all_announcements = announcement_service.get_all()
        active_announcements = sum(1 for a in all_announcements if a.status == "Published")

        return DashboardStatsResponse(
            total_registered_hospitals=len(approved_hospitals),
            hospitals_awaiting_approval=len(pending_hospitals),
            reported_available_beds=available_beds,
            total_beds_capacity=total_beds,
            open_complaints=open_complaints,
            urgent_complaints=urgent_complaints,
            active_announcements=active_announcements,
            bed_occupancy_rate=occupancy_rate,
        )


dashboard_service = DashboardService()

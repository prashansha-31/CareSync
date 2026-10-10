from typing import List, Optional, Literal
from pydantic import BaseModel, Field


ComplaintPriority = Literal['Low', 'Medium', 'High', 'Urgent']
ComplaintStatus = Literal['Open', 'In Progress', 'Resolved', 'Escalated']
ComplaintCategory = Literal[
    'Overcharging / Billing Irregularity',
    'Medical Negligence',
    'Infrastructure / Sanitation',
    'Staff Misconduct',
    'Denial of Emergency Care',
    'Essential Medicine Shortage',
]


class ComplaintHistoryEntry(BaseModel):
    id: str
    action: str
    actor: str
    timestamp: str
    notes: Optional[str] = None


class ComplaintCreate(BaseModel):
    hospital_id: Optional[str] = None
    hospital_name: str = Field(..., example="City Care Hospital")
    district: str = Field(..., example="North District")
    category: ComplaintCategory = "Overcharging / Billing Irregularity"
    priority: ComplaintPriority = "High"
    submitted_by: str = Field(..., example="Sunil Kumar")
    contact_email: str = Field(..., example="sunil.kumar@example.com")
    description: str = Field(..., min_length=10, example="Patient was denied admission without an upfront deposit.")


class ComplaintStatusUpdate(BaseModel):
    status: ComplaintStatus
    notes: Optional[str] = Field(None, description="Resolution or investigation notes")


class ComplaintAssignRequest(BaseModel):
    staff_name: str = Field(..., example="Dr. Anjali Verma (Senior Healthcare Regulator)")


class ComplaintAddNotesRequest(BaseModel):
    notes: str = Field(..., min_length=3, example="Investigation completed. Show-cause notice issued.")


class ComplaintResponse(BaseModel):
    id: str
    hospital_id: Optional[str] = None
    hospital_name: str
    district: str
    category: ComplaintCategory
    priority: ComplaintPriority
    status: ComplaintStatus
    submitted_by: str
    contact_email: str
    description: str
    submitted_date: str
    assigned_to: Optional[str] = None
    resolution_notes: Optional[str] = None
    history: List[ComplaintHistoryEntry] = []

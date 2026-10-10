from typing import Optional, Literal
from pydantic import BaseModel, Field


StaffRole = Literal[
    'Chief Medical Officer',
    'Senior Healthcare Regulator',
    'District Health Inspector',
    'Compliance & Audit Officer',
    'Grievance Redressal Officer',
]

StaffStatus = Literal['Active', 'On Leave', 'Suspended']

ActionCategory = Literal[
    'HOSPITAL_APPROVED',
    'HOSPITAL_REJECTED',
    'HOSPITAL_SUSPENDED',
    'COMPLAINT_STATUS_UPDATED',
    'COMPLAINT_ASSIGNED',
    'ANNOUNCEMENT_PUBLISHED',
    'ANNOUNCEMENT_ARCHIVED',
    'ADMIN_LOGIN',
]


class StaffMemberCreate(BaseModel):
    name: str = Field(..., example="Dr. Rajesh Sharma")
    badge_id: Optional[str] = Field(None, example="REG-4491")
    email: str = Field(..., example="rajesh.sharma@health.gov.in")
    role: StaffRole = "District Health Inspector"
    department: str = Field("Directorate of Health Services", example="Directorate of Health Services")
    district: str = Field("Central Metro", example="Central Metro")
    status: StaffStatus = "Active"
    assigned_cases_count: int = 0


class StaffMemberResponse(StaffMemberCreate):
    id: str
    joined_date: str


class ActivityLogCreate(BaseModel):
    action_type: ActionCategory
    actor: str
    actor_role: str
    related_record: str
    details: str
    ip_address: Optional[str] = "10.14.80.22"


class ActivityLogResponse(ActivityLogCreate):
    id: str
    timestamp: str

from typing import List, Optional, Literal
from pydantic import BaseModel, Field


AnnouncementStatus = Literal['Draft', 'Published', 'Archived']
AnnouncementPriority = Literal['Normal', 'High', 'Urgent']
AnnouncementCategory = Literal[
    'Disease Outbreak Alert',
    'Vaccination Drive',
    'Healthcare Protocol Advisory',
    'Emergency Health Warning',
    'Regulatory Policy Update',
]


class AnnouncementBase(BaseModel):
    title: str = Field(..., example="Seasonal Dengue & Vector-Borne Disease Advisory")
    summary: str = Field(..., example="Emergency bed reserve guidelines and platelet stock mandates.")
    content: str = Field(..., example="All licensed clinical establishments must maintain mandatory fever triage beds.")
    category: AnnouncementCategory = "Disease Outbreak Alert"
    target_audience: str = Field("Hospitals & Healthcare Facilities", example="Hospitals & Healthcare Facilities")
    target_districts: List[str] = Field(default_factory=lambda: ["All Districts"])
    priority: AnnouncementPriority = "High"


class AnnouncementCreate(AnnouncementBase):
    status: AnnouncementStatus = "Draft"


class AnnouncementUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    category: Optional[AnnouncementCategory] = None
    target_audience: Optional[str] = None
    target_districts: Optional[List[str]] = None
    priority: Optional[AnnouncementPriority] = None


class AnnouncementStatusUpdate(BaseModel):
    status: AnnouncementStatus


class AnnouncementResponse(AnnouncementBase):
    id: str
    status: AnnouncementStatus
    reference_number: str
    author: str
    created_date: str
    published_date: Optional[str] = None

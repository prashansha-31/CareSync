from typing import List, Optional, Literal
from pydantic import BaseModel, Field


HospitalStatus = Literal['Pending', 'Approved', 'Rejected', 'Suspended']
HospitalCategory = Literal[
    'General Hospital',
    'Multi-Specialty',
    'Super-Specialty',
    'District Hospital',
    'Community Health Center',
]
OwnershipType = Literal['Government', 'Public-Private', 'Private', 'Trust / Non-Profit']
AccreditationType = Literal['NABH Accredited', 'JCI Accredited', 'ISO 9001:2015', 'State Certified', 'Under Review']


class HospitalDocument(BaseModel):
    name: str
    type: str = "PDF"
    size: str = "1.5 MB"
    verified: bool = True


class HospitalBase(BaseModel):
    name: str = Field(..., example="All India Institute of Medical Sciences")
    registration_number: Optional[str] = Field(None, example="REG-AIIMS-01")
    license_number: str = Field(..., example="LIC-2026-DEL-001")
    district: str = Field(..., example="Central Metro")
    state: str = Field("Delhi", example="Delhi")
    category: HospitalCategory = "Multi-Specialty"
    ownership: OwnershipType = "Government"
    contact_person: str = Field("Medical Director", example="Dr. Director")
    phone: str = Field("+91 11 2658 8500", example="+91 11 2658 8500")
    email: str = Field("admin@aiims.edu", example="admin@aiims.edu")
    address: str = Field("Ansari Nagar, New Delhi", example="Ansari Nagar, New Delhi")
    total_beds: int = Field(500, ge=0)
    available_beds: int = Field(120, ge=0)
    icu_beds: int = Field(60, ge=0)
    available_icu_beds: int = Field(15, ge=0)
    ventilators: int = Field(30, ge=0)
    available_ventilators: int = Field(8, ge=0)
    emergency_services: bool = True
    ambulance_count: int = Field(10, ge=0)
    accreditation: AccreditationType = "NABH Accredited"


class HospitalCreate(HospitalBase):
    documents: Optional[List[HospitalDocument]] = None


class HospitalReviewRequest(BaseModel):
    action: Literal["approve", "reject"]
    reason: Optional[str] = Field(None, description="Mandatory when declining application")
    reviewer_name: Optional[str] = None


class HospitalSuspendRequest(BaseModel):
    reason: str = Field(..., min_length=5, description="Reason for regulatory suspension")


class HospitalResponse(HospitalBase):
    id: str
    status: HospitalStatus = "Pending"
    applied_date: str
    reviewed_date: Optional[str] = None
    reviewed_by: Optional[str] = None
    rejection_reason: Optional[str] = None
    suspension_reason: Optional[str] = None
    documents: List[HospitalDocument] = []

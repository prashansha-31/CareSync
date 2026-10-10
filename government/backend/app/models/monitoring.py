from typing import Literal
from pydantic import BaseModel, Field


EmergencyStatus = Literal['Normal', 'Elevated', 'High', 'Critical']


class DistrictCapacityResponse(BaseModel):
    district: str
    total_hospitals: int = 0
    total_beds: int = 0
    occupied_beds: int = 0
    available_beds: int = 0
    icu_total: int = 0
    icu_occupied: int = 0
    icu_available: int = 0
    ventilator_total: int = 0
    ventilator_available: int = 0
    emergency_status: EmergencyStatus = "Normal"
    reported_at: str = "Just now"


class DistrictCapacityUpdate(BaseModel):
    available_beds: int = Field(..., ge=0)
    available_icu_beds: int = Field(..., ge=0)
    available_ventilators: int = Field(..., ge=0)
    emergency_status: EmergencyStatus = "Normal"

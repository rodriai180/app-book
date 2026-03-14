from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum

class ScraperStatus(str, Enum):
    SUCCESS = "success"
    PARTIAL_SUCCESS = "partial_success"
    NOT_FOUND = "not_found"
    UNAVAILABLE = "unavailable"
    ERROR = "error"

class PreviousHolder(BaseModel):
    name: Optional[str] = None
    identifier: Optional[str] = None
    from_date: Optional[str] = None
    to_date: Optional[str] = None

class TransferRecord(BaseModel):
    date: Optional[str] = None
    reference: Optional[str] = None
    description: Optional[str] = None

class LienInfo(BaseModel):
    has_liens: bool = False
    details: List[str] = []

class DomainReservationOrFinancing(BaseModel):
    has_domain_reservation: bool = False
    has_financing: bool = False
    details: List[str] = []

class InspectionRecord(BaseModel):
    date: Optional[str] = None
    result: Optional[str] = None
    observations: Optional[str] = None
    expiration_date: Optional[str] = None

class MileageRecord(BaseModel):
    date: str
    mileage: int

class DecommissionDamageInfo(BaseModel):
    is_decommissioned: bool = False
    is_damaged: bool = False
    details: List[str] = []

class SourceResult(BaseModel):
    source_name: str
    status: ScraperStatus
    timestamp: datetime = Field(default_factory=datetime.now)
    error_message: Optional[str] = None

class VehicleReport(BaseModel):
    plate: str
    normalized_plate: str
    status: ScraperStatus = ScraperStatus.UNAVAILABLE
    registration_date: Optional[str] = None
    previous_holders: List[PreviousHolder] = []
    transfer_history: List[TransferRecord] = []
    liens: LienInfo = Field(default_factory=LienInfo)
    domain_reservation_or_financing: DomainReservationOrFinancing = Field(default_factory=DomainReservationOrFinancing)
    inspections: List[InspectionRecord] = []
    itv_mileage_records: List[MileageRecord] = []
    decommission_or_damage: DecommissionDamageInfo = Field(default_factory=DecommissionDamageInfo)
    use_type: Optional[str] = None
    sources: List[SourceResult] = []
    
    class Config:
        use_enum_values = True

class VehicleQueryResponse(BaseModel):
    plate: str
    registrationDate: Optional[str] = None

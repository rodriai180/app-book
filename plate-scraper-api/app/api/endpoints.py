from fastapi import APIRouter, HTTPException, Path
from app.services.aggregation_service import AggregationService
from app.models.vehicle import VehicleQueryResponse

router = APIRouter()
service = AggregationService()

@router.get("/vehicle/{plate}", response_model=VehicleQueryResponse)
async def get_vehicle_info(
    plate: str = Path(..., description="License plate to lookup", example="4131KCC")
):
    """
    Lookup vehicle information by license plate.
    """
    result = await service.lookup_plate(plate)
    return result

@router.post("/vehicle/lookup", response_model=VehicleQueryResponse)
async def post_vehicle_lookup(plate: str):
    """
    Lookup vehicle information by license plate via POST.
    """
    result = await service.lookup_plate(plate)
    return result

from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class BookingCreate(BaseModel):
    user_id: str
    departure_date: str
    return_date: str
    destination_id: str
    accommodation_id: str
    package_id: str
    travelers: int
    special_requests: Optional[str] = None
    total_price: float

class BookingResponse(BaseModel):
    id: str
    user_id: str
    departure_date: str
    return_date: str
    destination_id: str
    accommodation_id: str
    package_id: str
    travelers: int
    special_requests: Optional[str] = None
    total_price: float
    status: str  # e.g., "Confirmed", "Pending", "Cancelled"
    created_at: str
    
class BookingDetail(BaseModel):
    id: str
    user_id: str
    departure_date: str
    return_date: str
    destination_id: str
    destination_name: str
    accommodation_id: str
    accommodation_name: str
    package_id: str
    package_name: str
    travelers: int
    special_requests: Optional[str] = None
    total_price: float
    status: str
    created_at: str
    updated_at: Optional[str] = None
    payment_status: Optional[str] = None
    boarding_passes: Optional[List[Dict[str, Any]]] = None
    countdown_to_departure: Optional[int] = None  # Days remaining
    travel_documents: Optional[List[Dict[str, Any]]] = None
    
class BookingUpdate(BaseModel):
    departure_date: Optional[str] = None
    return_date: Optional[str] = None
    accommodation_id: Optional[str] = None
    package_id: Optional[str] = None
    travelers: Optional[int] = None
    special_requests: Optional[str] = None
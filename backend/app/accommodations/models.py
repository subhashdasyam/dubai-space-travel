from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class Accommodation(BaseModel):
    id: str
    destination_id: str
    name: str
    type: str  # e.g., "Luxury Hotel", "Space Station", "Orbital Villa" 
    description: str
    amenities: List[str]
    price_per_night: float
    capacity: int
    rating: float
    css_style_data: Dict[str, Any]  # CSS styling for frontend visualization
    availability: Dict[str, Any]  # Availability calendar data

class AccommodationResponse(BaseModel):
    id: str
    destination_id: str
    name: str
    type: str
    description: str
    amenities: List[str]
    price_per_night: float
    capacity: int
    rating: float
    css_style_data: Dict[str, Any]
    
class AccommodationDetail(BaseModel):
    id: str
    destination_id: str
    name: str
    type: str
    description: str
    amenities: List[str]
    price_per_night: float
    capacity: int
    rating: float
    css_style_data: Dict[str, Any]
    gravity_simulation: Optional[bool] = None
    view_type: Optional[str] = None  # e.g., "Earth View", "Deep Space", "Lunar Surface"
    room_types: Optional[List[Dict[str, Any]]] = None
    special_features: Optional[List[str]] = None
    oxygen_quality: Optional[str] = None
    construction_year: Optional[int] = None
    last_renovated: Optional[int] = None
    reviews: Optional[List[Dict[str, Any]]] = None
    distance_from_main_attractions: Optional[Dict[str, float]] = None  # Distance in km
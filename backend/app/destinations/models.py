from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class Destination(BaseModel):
    id: str
    name: str
    distance: float  # Distance from Earth in kilometers
    travel_time: int  # Travel time in hours
    description: str
    features: List[str]
    css_style_data: Dict[str, Any]  # CSS styling for frontend visualization
    price_factor: float  # Base price multiplier for this destination

class DestinationResponse(BaseModel):
    id: str
    name: str
    distance: float
    travel_time: int
    description: str
    features: List[str]
    css_style_data: Dict[str, Any]
    price_factor: float
    accommodations_count: int  # Number of available accommodations
    
class DestinationDetail(BaseModel):
    id: str
    name: str
    distance: float
    travel_time: int
    description: str
    features: List[str]
    css_style_data: Dict[str, Any]
    price_factor: float
    gravity: Optional[float] = None  # Gravity relative to Earth (Earth = 1.0)
    atmosphere: Optional[str] = None  # Description of atmosphere
    temperature_range: Optional[Dict[str, float]] = None  # Temperature range in Celsius
    points_of_interest: Optional[List[Dict[str, Any]]] = None  # Special locations at the destination
    safety_rating: Optional[int] = None  # Safety rating from 1-10
    recommended_stay_duration: Optional[int] = None  # Recommended stay in Earth days
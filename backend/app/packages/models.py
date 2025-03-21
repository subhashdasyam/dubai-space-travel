from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class Package(BaseModel):
    id: str
    name: str
    class_type: str  # e.g., "Luxury", "Business", "Economy"
    price: float  # Base price
    features: List[str]
    capacity: int
    css_style_data: Dict[str, Any]  # CSS styling for frontend visualization
    
class PackageResponse(BaseModel):
    id: str
    name: str
    class_type: str
    price: float
    features: List[str]
    capacity: int
    css_style_data: Dict[str, Any]
    
class PackageDetail(BaseModel):
    id: str
    name: str
    class_type: str
    price: float
    features: List[str]
    capacity: int
    css_style_data: Dict[str, Any]
    cabin_layout: Optional[Dict[str, Any]] = None
    meal_options: Optional[List[str]] = None
    entertainment: Optional[List[str]] = None
    amenity_kits: Optional[Dict[str, Any]] = None
    baggage_allowance: Optional[Dict[str, Any]] = None
    special_services: Optional[List[str]] = None
    transfer_options: Optional[List[Dict[str, Any]]] = None
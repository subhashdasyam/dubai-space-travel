from fastapi import APIRouter, HTTPException, status, Depends
from typing import List

from ..database import get_all_destinations, get_destination_by_id, get_accommodations_by_destination
from ..auth.utils import get_current_user
from .models import DestinationResponse, DestinationDetail

router = APIRouter()

@router.get("/", response_model=List[DestinationResponse])
async def get_destinations():
    """Get all available space destinations"""
    destinations = await get_all_destinations()
    
    # Enhance destinations with accommodation count
    enhanced_destinations = []
    for destination in destinations:
        accommodations = await get_accommodations_by_destination(destination["id"])
        destination_with_count = {
            **destination,
            "accommodations_count": len(accommodations)
        }
        enhanced_destinations.append(destination_with_count)
    
    return enhanced_destinations

@router.get("/{destination_id}", response_model=DestinationDetail)
async def get_destination(destination_id: str):
    """Get detailed information about a specific destination"""
    destination = await get_destination_by_id(destination_id)
    
    if not destination:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination not found"
        )
    
    # Additional detailed information would come from the destination's detailed fields
    return destination

@router.get("/{destination_id}/popular-times", response_model=dict)
async def get_destination_popular_times(
    destination_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get popular booking times for a destination"""
    destination = await get_destination_by_id(destination_id)
    
    if not destination:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination not found"
        )
    
    # This would normally be calculated from booking data
    # For now, we'll return mock data
    popular_times = {
        "months": {
            "January": 85,
            "February": 65,
            "March": 40,
            "April": 30,
            "May": 25,
            "June": 35,
            "July": 55,
            "August": 80,
            "September": 95,
            "October": 75,
            "November": 60,
            "December": 90
        },
        "peak_months": ["September", "December"],
        "off_peak_months": ["April", "May"]
    }
    
    return popular_times
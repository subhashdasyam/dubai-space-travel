from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional

from ..database import get_accommodations_by_destination, get_accommodation_by_id, get_destination_by_id
from ..auth.utils import get_current_user
from .models import AccommodationResponse, AccommodationDetail

router = APIRouter()

@router.get("/", response_model=List[AccommodationResponse])
async def get_accommodations(
    destination_id: Optional[str] = Query(None, description="Filter by destination ID"),
    type: Optional[str] = Query(None, description="Filter by accommodation type"),
    min_price: Optional[float] = Query(None, description="Minimum price per night"),
    max_price: Optional[float] = Query(None, description="Maximum price per night"),
    min_rating: Optional[float] = Query(None, description="Minimum rating"),
):
    """Get accommodations with optional filtering"""
    # If destination_id is provided, get accommodations for that destination
    if destination_id:
        # Verify destination exists
        destination = await get_destination_by_id(destination_id)
        if not destination:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Destination not found"
            )
        
        accommodations = await get_accommodations_by_destination(destination_id)
    else:
        # Get all accommodations (this would typically be paginated in a real app)
        # For simplicity, let's assume we have a function to get all accommodations
        # In reality, you'd want to paginate this
        accommodations = []
        destinations = await get_destination_by_id()
        for destination in destinations:
            dest_accommodations = await get_accommodations_by_destination(destination["id"])
            accommodations.extend(dest_accommodations)
    
    # Apply filters
    filtered_accommodations = accommodations
    
    if type:
        filtered_accommodations = [a for a in filtered_accommodations if a["type"] == type]
    
    if min_price is not None:
        filtered_accommodations = [a for a in filtered_accommodations if a["price_per_night"] >= min_price]
    
    if max_price is not None:
        filtered_accommodations = [a for a in filtered_accommodations if a["price_per_night"] <= max_price]
    
    if min_rating is not None:
        filtered_accommodations = [a for a in filtered_accommodations if a["rating"] >= min_rating]
    
    return filtered_accommodations

@router.get("/{accommodation_id}", response_model=AccommodationDetail)
async def get_accommodation(accommodation_id: str):
    """Get detailed information about a specific accommodation"""
    accommodation = await get_accommodation_by_id(accommodation_id)
    
    if not accommodation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Accommodation not found"
        )
    
    return accommodation

@router.get("/{accommodation_id}/availability")
async def get_accommodation_availability(
    accommodation_id: str,
    start_date: str,
    end_date: str,
    current_user: dict = Depends(get_current_user)
):
    """Get availability for a specific accommodation within a date range"""
    accommodation = await get_accommodation_by_id(accommodation_id)
    
    if not accommodation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Accommodation not found"
        )
    
    # In a real app, you would query a booking system
    # For now, we'll return mock availability data
    availability = {
        "accommodation_id": accommodation_id,
        "available_dates": [
            "2025-04-01", "2025-04-02", "2025-04-03",
            "2025-04-07", "2025-04-08", "2025-04-09",
            "2025-04-15", "2025-04-16", "2025-04-17"
        ],
        "booked_dates": [
            "2025-04-04", "2025-04-05", "2025-04-06",
            "2025-04-10", "2025-04-11", "2025-04-12",
            "2025-04-13", "2025-04-14"
        ]
    }
    
    return availability

@router.get("/{accommodation_id}/reviews")
async def get_accommodation_reviews(
    accommodation_id: str,
    limit: int = 10,
    offset: int = 0
):
    """Get reviews for a specific accommodation"""
    accommodation = await get_accommodation_by_id(accommodation_id)
    
    if not accommodation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Accommodation not found"
        )
    
    # In a real app, you would query a reviews database
    # For now, we'll return mock review data
    reviews = [
        {
            "id": "rev1",
            "user_name": "Space Explorer",
            "rating": 5,
            "comment": "Amazing view of Earth from the lunar suite!",
            "date": "2024-12-15"
        },
        {
            "id": "rev2",
            "user_name": "Cosmic Traveler",
            "rating": 4,
            "comment": "Great zero-G experience, but food could be better.",
            "date": "2024-11-22"
        },
        {
            "id": "rev3",
            "user_name": "Star Voyager",
            "rating": 5,
            "comment": "Worth every penny! The Mars sunset view was breathtaking.",
            "date": "2024-10-30"
        }
    ]
    
    return {
        "total": len(reviews),
        "reviews": reviews[offset:offset+limit]
    }
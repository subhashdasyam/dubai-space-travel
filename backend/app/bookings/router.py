from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from datetime import datetime, timedelta

from ..auth.utils import get_current_user
from ..database import (
    create_booking, get_bookings_by_user_id, get_booking_by_id,
    update_booking, delete_booking, get_destination_by_id,
    get_accommodation_by_id, get_package_by_id
)
from .models import BookingCreate, BookingResponse, BookingDetail, BookingUpdate

router = APIRouter()

@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_new_booking(
    booking_data: BookingCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new booking"""
    # Verify destination exists
    destination = await get_destination_by_id(booking_data.destination_id)
    if not destination:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination not found"
        )
    
    # Verify accommodation exists and belongs to the selected destination
    accommodation = await get_accommodation_by_id(booking_data.accommodation_id)
    if not accommodation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Accommodation not found"
        )
    
    if accommodation["destination_id"] != booking_data.destination_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Selected accommodation is not available at the chosen destination"
        )
    
    # Verify package exists
    package = await get_package_by_id(booking_data.package_id)
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Package not found"
        )
    
    # Ensure user ID in the booking matches the authenticated user
    if booking_data.user_id != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot create booking for another user"
        )
    
    # Create booking with status "Confirmed"
    new_booking_data = booking_data.dict()
    new_booking_data["status"] = "Confirmed"
    new_booking_data["created_at"] = datetime.now().isoformat()
    
    created_booking = await create_booking(new_booking_data)
    
    if not created_booking:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create booking"
        )
    
    return created_booking

@router.get("/", response_model=List[BookingResponse])
async def get_user_bookings(
    current_user: dict = Depends(get_current_user),
    status: Optional[str] = Query(None, description="Filter by booking status")
):
    """Get bookings for the current user"""
    bookings = await get_bookings_by_user_id(current_user["id"])
    
    # Apply status filter if provided
    if status:
        bookings = [b for b in bookings if b["status"].lower() == status.lower()]
    
    return bookings

@router.get("/{booking_id}", response_model=BookingDetail)
async def get_booking_details(
    booking_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get detailed information about a specific booking"""
    booking = await get_booking_by_id(booking_id)
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Ensure the booking belongs to the authenticated user
    if booking["user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot access booking details for another user"
        )
    
    # Get additional information for the booking
    destination = await get_destination_by_id(booking["destination_id"])
    accommodation = await get_accommodation_by_id(booking["accommodation_id"])
    package = await get_package_by_id(booking["package_id"])
    
    # Calculate countdown to departure
    departure_date = datetime.fromisoformat(booking["departure_date"])
    today = datetime.now()
    countdown = (departure_date - today).days
    
    # Create enhanced booking detail
    booking_detail = {
        **booking,
        "destination_name": destination["name"],
        "accommodation_name": accommodation["name"],
        "package_name": package["name"],
        "countdown_to_departure": countdown if countdown > 0 else 0,
        # Mock data for the additional fields
        "updated_at": booking.get("updated_at", booking["created_at"]),
        "payment_status": "Paid",
        "boarding_passes": [
            {
                "traveler_name": "Primary Traveler",
                "seat": "A1",
                "launch_number": "DXB-SPACE-001",
                "gate": "G7",
                "boarding_time": "2 hours before departure"
            }
        ],
        "travel_documents": [
            {
                "name": "Space Travel Visa",
                "status": "Approved"
            },
            {
                "name": "Health Certificate",
                "status": "Pending"
            },
            {
                "name": "Travel Insurance",
                "status": "Confirmed"
            }
        ]
    }
    
    return booking_detail

@router.put("/{booking_id}", response_model=BookingResponse)
async def update_user_booking(
    booking_id: str,
    booking_update: BookingUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update an existing booking"""
    booking = await get_booking_by_id(booking_id)
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Ensure the booking belongs to the authenticated user
    if booking["user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot update booking for another user"
        )
    
    # If accommodation is being updated, verify it exists and is at the correct destination
    if booking_update.accommodation_id:
        accommodation = await get_accommodation_by_id(booking_update.accommodation_id)
        if not accommodation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="New accommodation not found"
            )
        
        if accommodation["destination_id"] != booking["destination_id"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Selected accommodation is not available at the chosen destination"
            )
    
    # If package is being updated, verify it exists
    if booking_update.package_id:
        package = await get_package_by_id(booking_update.package_id)
        if not package:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="New package not found"
            )
    
    # Update the booking
    update_data = booking_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.now().isoformat()
    
    updated_booking = await update_booking(booking_id, update_data)
    
    if not updated_booking:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update booking"
        )
    
    return updated_booking

@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_booking(
    booking_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Cancel a booking"""
    booking = await get_booking_by_id(booking_id)
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Ensure the booking belongs to the authenticated user
    if booking["user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot cancel booking for another user"
        )
    
    # Instead of deleting, we update the status to "Cancelled"
    await update_booking(booking_id, {"status": "Cancelled", "updated_at": datetime.now().isoformat()})
    
    return None

@router.get("/{booking_id}/invoice")
async def get_booking_invoice(
    booking_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get invoice for a booking"""
    booking = await get_booking_by_id(booking_id)
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Ensure the booking belongs to the authenticated user
    if booking["user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot access invoice for another user's booking"
        )
    
    # Get additional information
    destination = await get_destination_by_id(booking["destination_id"])
    accommodation = await get_accommodation_by_id(booking["accommodation_id"])
    package = await get_package_by_id(booking["package_id"])
    
    # Calculate duration
    departure_date = datetime.fromisoformat(booking["departure_date"])
    return_date = datetime.fromisoformat(booking["return_date"])
    duration = (return_date - departure_date).days
    
    # Create invoice
    invoice = {
        "booking_id": booking_id,
        "invoice_number": f"INV-{booking_id[:8]}",
        "issue_date": datetime.now().isoformat(),
        "customer": {
            "name": current_user["name"],
            "email": current_user["email"],
            "id": current_user["id"]
        },
        "booking_details": {
            "destination": destination["name"],
            "accommodation": accommodation["name"],
            "package": package["name"],
            "departure_date": booking["departure_date"],
            "return_date": booking["return_date"],
            "duration": duration,
            "travelers": booking["travelers"]
        },
        "costs": {
            "base_package": package["price"] * booking["travelers"],
            "accommodation": accommodation["price_per_night"] * duration * booking["travelers"],
            "destination_fee": 500 * booking["travelers"],  # Example fee
            "space_visa": 300 * booking["travelers"],  # Example fee
            "insurance": 200 * booking["travelers"]  # Example fee
        },
        "total": booking["total_price"],
        "payment_status": "Paid"
    }
    
    return invoice
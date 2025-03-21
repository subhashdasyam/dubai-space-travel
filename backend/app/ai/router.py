from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import Optional

from ..auth.utils import get_current_user
from ..database import get_destination_by_id
from .utils import generate_travel_recommendations, generate_packing_list, answer_space_travel_question

router = APIRouter()

@router.post("/recommendations")
async def get_travel_recommendations(
    user_preferences: dict = Body(...),
    destination_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get AI-generated travel recommendations based on user preferences"""
    # Verify destination if provided
    if destination_id:
        destination = await get_destination_by_id(destination_id)
        if not destination:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Destination not found"
            )
    
    # Generate recommendations
    recommendations = await generate_travel_recommendations(user_preferences, destination_id)
    
    return {
        "recommendations": recommendations
    }

@router.post("/packing-list")
async def get_packing_list(
    destination_id: str,
    duration: int,
    user_preferences: Optional[dict] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get AI-generated packing list for a space trip"""
    # Verify destination
    destination = await get_destination_by_id(destination_id)
    if not destination:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination not found"
        )
    
    # Generate packing list
    packing_list = await generate_packing_list(destination_id, duration, user_preferences)
    
    return {
        "destination": destination["name"],
        "duration": duration,
        "packing_list": packing_list
    }

@router.post("/ask")
async def ask_question(
    question: str = Body(..., embed=True),
    current_user: Optional[dict] = Depends(get_current_user)
):
    """Ask a question about space travel and get an AI-generated answer"""
    # Prepare user context if authenticated
    user_context = None
    if current_user:
        user_context = {
            "name": current_user["name"],
            "preferences": current_user["preferences"]
        }
    
    # Generate answer
    answer = await answer_space_travel_question(question, user_context)
    
    return {
        "question": question,
        "answer": answer
    }

@router.post("/trip-planner")
async def plan_space_trip(
    trip_data: dict = Body(...),
    current_user: dict = Depends(get_current_user)
):
    """Generate a personalized space trip itinerary"""
    # Build prompt for AI
    destination_id = trip_data.get("destination_id")
    duration = trip_data.get("duration", 7)
    activities = trip_data.get("preferred_activities", [])
    budget = trip_data.get("budget", "medium")
    
    # Verify destination
    destination = await get_destination_by_id(destination_id)
    if not destination:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination not found"
        )
    
    # Use user's preferences + trip data to create context
    user_preferences = {
        "name": current_user["name"],
        "preferred_activities": activities,
        "budget": budget,
        **current_user.get("preferences", {})
    }
    
    # Build a custom prompt for trip planning
    prompt = f"Plan a {duration}-day space trip to {destination['name']} for a traveler with these preferences:\n\n"
    for key, value in user_preferences.items():
        if key != "name":
            prompt += f"- {key}: {value}\n"
    
    prompt += "\nCreate a day-by-day itinerary with activities, meals, and experiences."
    
    # Generate the itinerary
    itinerary = await answer_space_travel_question(prompt)
    
    return {
        "destination": destination["name"],
        "duration": duration,
        "user_preferences": user_preferences,
        "itinerary": itinerary
    }
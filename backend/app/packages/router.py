from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional

from ..database import get_all_packages, get_package_by_id
from .models import PackageResponse, PackageDetail

router = APIRouter()

@router.get("/", response_model=List[PackageResponse])
async def get_packages(
    class_type: Optional[str] = Query(None, description="Filter by class type")
):
    """Get all available travel packages with optional filtering"""
    packages = await get_all_packages()
    
    # Apply filters if provided
    if class_type:
        packages = [p for p in packages if p["class_type"] == class_type]
    
    return packages

@router.get("/{package_id}", response_model=PackageDetail)
async def get_package(package_id: str):
    """Get detailed information about a specific package"""
    package = await get_package_by_id(package_id)
    
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Package not found"
        )
    
    return package

@router.get("/compare", response_model=List[PackageDetail])
async def compare_packages(package_ids: str):
    """Compare multiple packages side by side"""
    # Split the comma-separated package IDs
    ids = package_ids.split(",")
    
    if len(ids) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide at least two package IDs to compare"
        )
    
    # Get details for each package
    packages = []
    for package_id in ids:
        package = await get_package_by_id(package_id)
        if not package:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Package with ID {package_id} not found"
            )
        packages.append(package)
    
    return packages

@router.get("/calculate-price")
async def calculate_package_price(
    package_id: str,
    destination_id: str,
    duration: int = Query(..., description="Duration in days")
):
    """Calculate package price for a specific destination and duration"""
    package = await get_package_by_id(package_id)
    
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Package not found"
        )
    
    # In a real app, you would have a pricing algorithm
    # For now, we'll use a simple calculation
    base_price = package["price"]
    
    # Apply destination factor (would typically come from destination data)
    destination_factor = 1.5  # Example factor
    
    # Apply duration factor
    duration_factor = 1.0
    if duration > 7:
        duration_factor = 0.9  # 10% discount for longer stays
    elif duration > 14:
        duration_factor = 0.85  # 15% discount for even longer stays
    
    # Calculate final price
    final_price = base_price * destination_factor * duration_factor * duration
    
    return {
        "package_id": package_id,
        "destination_id": destination_id,
        "duration": duration,
        "base_price": base_price,
        "destination_factor": destination_factor,
        "duration_factor": duration_factor,
        "final_price": final_price
    }
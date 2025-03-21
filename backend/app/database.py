from supabase import create_client
from .config import settings

# Initialize Supabase client
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

# Define database tables for reference
USERS_TABLE = "users"
BOOKINGS_TABLE = "bookings"
DESTINATIONS_TABLE = "destinations"
ACCOMMODATIONS_TABLE = "accommodations"
PACKAGES_TABLE = "packages"

# Helper functions for common database operations
async def get_user_by_email(email: str):
    response = supabase.table(USERS_TABLE).select("*").eq("email", email).execute()
    return response.data[0] if response.data else None

async def get_user_by_id(user_id: str):
    response = supabase.table(USERS_TABLE).select("*").eq("id", user_id).execute()
    return response.data[0] if response.data else None

async def create_user(user_data: dict):
    response = supabase.table(USERS_TABLE).insert(user_data).execute()
    return response.data[0] if response.data else None

async def update_user(user_id: str, user_data: dict):
    response = supabase.table(USERS_TABLE).update(user_data).eq("id", user_id).execute()
    return response.data[0] if response.data else None

async def get_all_destinations():
    response = supabase.table(DESTINATIONS_TABLE).select("*").execute()
    return response.data

async def get_destination_by_id(destination_id: str):
    response = supabase.table(DESTINATIONS_TABLE).select("*").eq("id", destination_id).execute()
    return response.data[0] if response.data else None

async def get_accommodations_by_destination(destination_id: str):
    response = supabase.table(ACCOMMODATIONS_TABLE).select("*").eq("destination_id", destination_id).execute()
    return response.data

async def get_accommodation_by_id(accommodation_id: str):
    response = supabase.table(ACCOMMODATIONS_TABLE).select("*").eq("id", accommodation_id).execute()
    return response.data[0] if response.data else None

async def get_all_packages():
    response = supabase.table(PACKAGES_TABLE).select("*").execute()
    return response.data

async def get_package_by_id(package_id: str):
    response = supabase.table(PACKAGES_TABLE).select("*").eq("id", package_id).execute()
    return response.data[0] if response.data else None

async def create_booking(booking_data: dict):
    response = supabase.table(BOOKINGS_TABLE).insert(booking_data).execute()
    return response.data[0] if response.data else None

async def get_bookings_by_user_id(user_id: str):
    response = supabase.table(BOOKINGS_TABLE).select("*").eq("user_id", user_id).execute()
    return response.data

async def get_booking_by_id(booking_id: str):
    response = supabase.table(BOOKINGS_TABLE).select("*").eq("id", booking_id).execute()
    return response.data[0] if response.data else None

async def update_booking(booking_id: str, booking_data: dict):
    response = supabase.table(BOOKINGS_TABLE).update(booking_data).eq("id", booking_id).execute()
    return response.data[0] if response.data else None

async def delete_booking(booking_id: str):
    response = supabase.table(BOOKINGS_TABLE).delete().eq("id", booking_id).execute()
    return response.data[0] if response.data else None
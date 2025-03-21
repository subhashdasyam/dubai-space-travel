from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
import re

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    preferences: Optional[dict] = {}
    
    @validator('password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    preferences: Optional[dict] = {}

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[str] = None

class UserPreferences(BaseModel):
    preferred_destinations: Optional[List[str]] = []
    preferred_accommodation_types: Optional[List[str]] = []
    budget_range: Optional[dict] = {}
    has_space_experience: Optional[bool] = False
    notification_preferences: Optional[dict] = {}
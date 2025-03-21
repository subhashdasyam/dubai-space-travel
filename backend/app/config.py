import os
from pydantic import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "Dubai to Stars Space Travel API"
    APP_DESCRIPTION: str = "API for the Dubai to Stars Space Travel Booking Platform"
    APP_VERSION: str = "1.0.0"
    
    # Supabase settings
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    # JWT settings
    JWT_SECRET: str = os.getenv("JWT_SECRET", "your-secret-key")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60 * 24  # 24 hours
    
    # OpenAI settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # CORS settings
    CORS_ORIGINS: list = ["*"]
    CORS_HEADERS: list = ["*"]
    CORS_METHODS: list = ["*"]
    
    class Config:
        env_file = ".env"

settings = Settings()
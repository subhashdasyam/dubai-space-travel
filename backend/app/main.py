from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .auth.router import router as auth_router
from .bookings.router import router as bookings_router
from .destinations.router import router as destinations_router
from .accommodations.router import router as accommodations_router
from .packages.router import router as packages_router
from .ai.router import router as ai_router

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=settings.CORS_METHODS,
    allow_headers=settings.CORS_HEADERS,
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(destinations_router, prefix="/api/destinations", tags=["Destinations"])
app.include_router(accommodations_router, prefix="/api/accommodations", tags=["Accommodations"])
app.include_router(packages_router, prefix="/api/packages", tags=["Packages"])
app.include_router(bookings_router, prefix="/api/bookings", tags=["Bookings"])
app.include_router(ai_router, prefix="/api/ai", tags=["AI Assistant"])

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": settings.APP_VERSION}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
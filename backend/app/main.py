"""
Main application module for the Lead Scoring API.
This module initializes the FastAPI application and includes all the route handlers.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import leads, tags, scoring, imports
from app.core.config import settings

# Create FastAPI app instance
app = FastAPI(
    title="Lead Scoring API",
    description="API for scoring real estate leads based on distress indicators",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
async def root():
    """Health check endpoint that returns a status message."""
    return {"status": "ok", "message": "Lead Scoring API is running"}

# Import and include API routers
app.include_router(leads.router, prefix=settings.API_V1_STR)
app.include_router(tags.router, prefix=settings.API_V1_STR)
app.include_router(scoring.router, prefix=settings.API_V1_STR)
app.include_router(imports.router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    # This block will be executed when running the file directly
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 
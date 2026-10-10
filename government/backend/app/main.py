import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.firebase import initialize_firebase, is_mock_mode
from app.core.seed_data import seed_initial_data
from app.routers import (
    auth,
    hospitals,
    monitoring,
    complaints,
    announcements,
    staff,
    dashboard,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("caresync")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Firebase and seed initial data if empty
    logger.info("Initializing CareSync Government Backend...")
    initialize_firebase()
    seed_initial_data()
    mode_str = "Mock / In-Memory Store" if is_mock_mode() else "Live Firebase / Cloud Firestore"
    logger.info("Backend running in mode: %s", mode_str)
    yield
    # Shutdown
    logger.info("CareSync Government Backend shut down cleanly.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="CareSync Health Administration & Regulatory Portal Backend built with Python, FastAPI, and Firebase.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health & Root Endpoints
@app.get("/", tags=["Health Check"])
async def root():
    return {
        "app": settings.PROJECT_NAME,
        "status": "online",
        "api_version": "v1",
        "docs_url": "/docs",
        "firebase_mode": "mock_development" if is_mock_mode() else "live_firebase",
    }


@app.get("/health", tags=["Health Check"])
async def health_check():
    return {
        "status": "healthy",
        "database": "mock_in_memory" if is_mock_mode() else "cloud_firestore",
        "auth_provider": "firebase_admin_sdk",
    }


# Mount API v1 Routers
api_prefix = settings.API_V1_STR
app.include_router(auth.router, prefix=api_prefix)
app.include_router(hospitals.router, prefix=api_prefix)
app.include_router(monitoring.router, prefix=api_prefix)
app.include_router(complaints.router, prefix=api_prefix)
app.include_router(announcements.router, prefix=api_prefix)
app.include_router(staff.router, prefix=api_prefix)
app.include_router(dashboard.router, prefix=api_prefix)

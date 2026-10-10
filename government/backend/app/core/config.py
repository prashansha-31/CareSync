import os
from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "CareSync Government Admin Portal API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    API_V1_STR: str = "/api/v1"
    DESCRIPTION: str = (
        "National Healthcare Command & Regulatory Administration API for CareSync. "
        "Provides hospital licensing, real-time bed capacity monitoring, citizen grievance redressal, "
        "public health directives, and inspector audit logs with Firebase Authentication and Cloud Firestore."
    )

    # CORS settings for frontend integration
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:4173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:4173",
    ]

    # Firebase Configuration
    FIREBASE_PROJECT_ID: str = Field(default="caresync-gov-portal", env="FIREBASE_PROJECT_ID")
    FIREBASE_CREDENTIALS_PATH: str = Field(
        default="serviceAccountKey.json", env="FIREBASE_CREDENTIALS_PATH"
    )
    FIREBASE_STORAGE_BUCKET: str = Field(
        default="caresync-gov-portal.appspot.com", env="FIREBASE_STORAGE_BUCKET"
    )
    
    # Dev / Simulation mode when real service account JSON is not yet provided
    USE_MOCK_FIREBASE_IF_NO_CREDS: bool = True

    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()

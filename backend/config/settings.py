from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Database Configuration
    database_url: str = "sqlite:///./effectiveclass.db"
    redis_url: str = "redis://localhost:6379"
    
    # API Keys
    openai_api_key: str = ""
    openrouter_api_key: str = ""
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    
    # Application Settings
    secret_key: str = "your_secret_key_here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # File Storage
    upload_dir: str = "media/uploads"
    max_file_size: str = "500MB"
    allowed_video_extensions: List[str] = ["mp4", "avi", "mov", "wmv", "flv", "webm"]
    
    # AI Model Settings
    whisper_model: str = "base"
    confidence_threshold: float = 0.7
    
    # Translation Settings
    default_languages: List[str] = ["en", "ru", "tj"]
    
    # CORS Settings
    allowed_origins: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

# Create upload directory if it doesn't exist
os.makedirs(settings.upload_dir, exist_ok=True) 
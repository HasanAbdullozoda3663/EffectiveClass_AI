from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class LanguageEnum(str, Enum):
    ENGLISH = "en"
    RUSSIAN = "ru"
    TAJIK = "tj"


class SubjectEnum(str, Enum):
    MATHEMATICS = "mathematics"
    PHYSICS = "physics"
    CHEMISTRY = "chemistry"
    BIOLOGY = "biology"
    HISTORY = "history"
    GEOGRAPHY = "geography"
    LITERATURE = "literature"
    LANGUAGE = "language"
    COMPUTER_SCIENCE = "computer_science"
    ART = "art"
    MUSIC = "music"
    PHYSICAL_EDUCATION = "physical_education"
    OTHER = "other"


class VideoUploadRequest(BaseModel):
    subject: SubjectEnum = Field(..., description="Subject of the lesson")
    theme: str = Field(..., min_length=1, max_length=200, description="Theme or topic of the lesson")
    language: LanguageEnum = Field(..., description="Language of instruction")
    
    class Config:
        schema_extra = {
            "example": {
                "subject": "mathematics",
                "theme": "Quadratic Equations",
                "language": "en"
            }
        }


class FeedbackRequest(BaseModel):
    video_analysis_id: int = Field(..., description="ID of the video analysis")
    language: LanguageEnum = Field(..., description="Language for feedback output")
    
    class Config:
        schema_extra = {
            "example": {
                "video_analysis_id": 1,
                "language": "en"
            }
        }


class ProcessingStatusRequest(BaseModel):
    video_analysis_id: int = Field(..., description="ID of the video analysis")
    
    class Config:
        schema_extra = {
            "example": {
                "video_analysis_id": 1
            }
        } 
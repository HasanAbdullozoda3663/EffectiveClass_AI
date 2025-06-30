from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class StatusEnum(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class VideoUploadResponse(BaseModel):
    id: int
    video_filename: str
    subject: str
    theme: str
    language: str
    status: StatusEnum
    created_at: datetime
    message: str
    
    class Config:
        from_attributes = True


class ProcessingStatusResponse(BaseModel):
    id: int
    status: StatusEnum
    progress: float = Field(..., ge=0.0, le=1.0)
    current_task: Optional[str] = None
    estimated_time_remaining: Optional[int] = None  # in seconds
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class EngagementMetrics(BaseModel):
    face_detection_count: int
    motion_activity_score: float
    attention_span_avg: float
    engagement_periods: List[Dict[str, Any]]
    
    class Config:
        from_attributes = True


class TechnicalAnalysis(BaseModel):
    video_quality_score: float
    audio_quality_score: float
    lighting_analysis: Dict[str, Any]
    camera_stability_score: float
    
    class Config:
        from_attributes = True


class AIFeedbackResponse(BaseModel):
    id: int
    language: str
    teaching_quality_score: float = Field(..., ge=0.0, le=10.0)
    student_engagement_score: float = Field(..., ge=0.0, le=10.0)
    overall_score: float = Field(..., ge=0.0, le=10.0)
    strengths: str
    areas_for_improvement: str
    specific_recommendations: str
    technical_analysis: Optional[TechnicalAnalysis] = None
    engagement_metrics: Optional[EngagementMetrics] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class VideoAnalysisResponse(BaseModel):
    id: int
    video_filename: str
    subject: str
    theme: str
    language: str
    status: StatusEnum
    transcription: Optional[str] = None
    ai_feedback: List[AIFeedbackResponse] = []
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)


class SuccessResponse(BaseModel):
    message: str
    data: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.now) 
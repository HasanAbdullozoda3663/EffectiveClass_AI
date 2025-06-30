from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import json

Base = declarative_base()


class VideoAnalysis(Base):
    __tablename__ = "video_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    video_filename = Column(String(255), nullable=False)
    video_path = Column(String(500), nullable=False)
    subject = Column(String(100), nullable=False)
    theme = Column(String(200), nullable=False)
    language = Column(String(10), nullable=False)
    
    # Processing status
    status = Column(String(20), default="pending")  # pending, processing, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Analysis results
    transcription = Column(Text, nullable=True)
    audio_path = Column(String(500), nullable=True)
    
    # Video analysis data (stored as JSON strings for SQLite compatibility)
    face_detection_data = Column(Text, nullable=True)
    motion_analysis_data = Column(Text, nullable=True)
    engagement_metrics = Column(Text, nullable=True)
    
    # AI feedback
    ai_feedback = relationship("AIFeedback", back_populates="video_analysis", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<VideoAnalysis(id={self.id}, subject='{self.subject}', status='{self.status}')>"


class AIFeedback(Base):
    __tablename__ = "ai_feedbacks"
    
    id = Column(Integer, primary_key=True, index=True)
    video_analysis_id = Column(Integer, ForeignKey("video_analyses.id"), nullable=False)
    language = Column(String(10), nullable=False)  # en, ru, tj
    
    # Feedback content
    teaching_quality_score = Column(Float, nullable=True)
    student_engagement_score = Column(Float, nullable=True)
    overall_score = Column(Float, nullable=True)
    
    # Detailed feedback
    strengths = Column(Text, nullable=True)
    areas_for_improvement = Column(Text, nullable=True)
    specific_recommendations = Column(Text, nullable=True)
    
    # Technical analysis (stored as JSON string for SQLite compatibility)
    technical_analysis = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    video_analysis = relationship("VideoAnalysis", back_populates="ai_feedback")
    
    def __repr__(self):
        return f"<AIFeedback(id={self.id}, language='{self.language}', video_analysis_id={self.video_analysis_id})>"


class ProcessingTask(Base):
    __tablename__ = "processing_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    video_analysis_id = Column(Integer, ForeignKey("video_analyses.id"), nullable=False)
    task_type = Column(String(50), nullable=False)  # audio_extraction, transcription, video_analysis, ai_feedback
    status = Column(String(20), default="pending")  # pending, running, completed, failed
    progress = Column(Float, default=0.0)  # 0.0 to 1.0
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<ProcessingTask(id={self.id}, task_type='{self.task_type}', status='{self.status}')>" 
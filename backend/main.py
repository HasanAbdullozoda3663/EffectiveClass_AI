import os
import shutil
import logging
from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime
import json
import time

from config.settings import settings
from database.connection import get_db, create_tables, SessionLocal
from models.database import VideoAnalysis, AIFeedback, Base
from schemas.requests import VideoUploadRequest, LanguageEnum, SubjectEnum
from schemas.responses import VideoUploadResponse, ProcessingStatusResponse, StatusEnum, ErrorResponse
from services.ai_service import AIService

logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)

app = FastAPI(title="EffectiveClass AI Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI service
ai_service = AIService()

# Initialize database tables
@app.on_event("startup")
async def startup_event():
    try:
        create_tables()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise

@app.post("/upload-video", response_model=VideoUploadResponse)
def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    subject: SubjectEnum = Form(...),
    theme: str = Form(...),
    language: LanguageEnum = Form(...),
    feedback_language: LanguageEnum = Form(...),
    db: Session = Depends(get_db)
):
    try:
        # Validate file extension
        ext = file.filename.split(".")[-1].lower()
        if ext not in settings.allowed_video_extensions:
            raise HTTPException(status_code=400, detail=f"Invalid file type: .{ext}")

        # Save file
        save_path = os.path.join(settings.upload_dir, file.filename)
        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Create DB record
        video = VideoAnalysis(
            video_filename=file.filename,
            video_path=save_path,
            subject=subject.value,
            theme=theme,
            language=language.value,
            status=StatusEnum.PENDING.value,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        db.add(video)
        db.commit()
        db.refresh(video)

        # Start background processing with feedback language
        background_tasks.add_task(process_video_pipeline, video.id, feedback_language.value)

        return VideoUploadResponse(
            id=video.id,
            video_filename=video.video_filename,
            subject=video.subject,
            theme=video.theme,
            language=video.language,
            status=video.status,
            created_at=video.created_at,
            message="Video uploaded and processing started."
        )
    except Exception as e:
        logger.error(f"Error in upload_video: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

def process_video_pipeline(video_id: int, feedback_language: str):
    """
    Complete AI processing pipeline for video analysis
    """
    db = SessionLocal()
    try:
        logger.info(f"[Pipeline] Start processing video_id={video_id}")
        
        # Update status to processing
        video = db.query(VideoAnalysis).filter(VideoAnalysis.id == video_id).first()
        if not video:
            logger.error(f"Video not found: {video_id}")
            return
        
        video.status = StatusEnum.PROCESSING.value
        video.updated_at = datetime.utcnow()
        db.commit()
        
        # Step 1: Audio Extraction
        logger.info(f"[Pipeline] Step 1: Audio extraction for video_id={video_id}")
        audio_path = ai_service.extract_audio_from_video(video.video_path)
        if audio_path:
            video.audio_path = audio_path
            db.commit()
        
        # Step 2: Transcription
        logger.info(f"[Pipeline] Step 2: Transcription for video_id={video_id}")
        transcription_result = ai_service.transcribe_audio(audio_path or video.video_path, video.language)
        if transcription_result:
            video.transcription = transcription_result.get('text', '')
            db.commit()
        
        # Step 3: Video Analysis (placeholder for now)
        logger.info(f"[Pipeline] Step 3: Video analysis for video_id={video_id}")
        # TODO: Implement video analysis with OpenCV/MediaPipe
        
        # Step 4: AI Feedback Generation
        logger.info(f"[Pipeline] Step 4: AI feedback generation for video_id={video_id}")
        generate_ai_feedback(video_id, db, video, feedback_language)
        
        # Update status to completed
        video.status = StatusEnum.COMPLETED.value
        video.updated_at = datetime.utcnow()
        db.commit()
        
        logger.info(f"[Pipeline] Completed processing video_id={video_id}")
        
    except Exception as e:
        logger.error(f"[Pipeline] Error processing video_id={video_id}: {str(e)}")
        # Update status to failed
        video = db.query(VideoAnalysis).filter(VideoAnalysis.id == video_id).first()
        if video:
            video.status = StatusEnum.FAILED.value
            video.updated_at = datetime.utcnow()
            db.commit()
    finally:
        db.close()

def generate_ai_feedback(video_id: int, db: Session, video: VideoAnalysis, feedback_language: str):
    """Generate AI feedback for the specific language of the video"""
    try:
        # Prepare video data for AI analysis
        video_data = {
            'subject': video.subject,
            'theme': video.theme,
            'transcription': video.transcription or '',
            'language': video.language
        }
        
        # Generate feedback only for the video's language
        feedback = ai_service.generate_ai_feedback(video_data, feedback_language)
        
        ai_feedback = AIFeedback(
            video_analysis_id=video_id,
            language=feedback_language,
            teaching_quality_score=feedback.get('teaching_quality_score', 7.5),
            student_engagement_score=feedback.get('student_engagement_score', 6.5),
            overall_score=feedback.get('overall_score', 7.0),
            strengths=feedback.get('strengths', 'Good teaching structure and clear explanations.'),
            areas_for_improvement=feedback.get('areas_for_improvement', 'Consider adding more interactive elements.'),
            specific_recommendations=feedback.get('specific_recommendations', 'Include more student participation opportunities.'),
            technical_analysis=json.dumps(feedback.get('technical_analysis', {}))
        )
        db.add(ai_feedback)
        db.commit()
        
        logger.info(f"Generated AI feedback for video_id={video_id}, language={feedback_language}")
        
    except Exception as e:
        logger.error(f"Error generating AI feedback: {str(e)}")
        db.rollback()  # Rollback any pending transaction

@app.get("/status/{video_id}", response_model=ProcessingStatusResponse, responses={404: {"model": ErrorResponse}})
def get_status(video_id: int, db: Session = Depends(get_db)):
    video = db.query(VideoAnalysis).filter(VideoAnalysis.id == video_id).first()
    if not video:
        return JSONResponse(status_code=404, content=ErrorResponse(error="Not found", detail=f"Video ID {video_id} not found").dict())
    
    # Calculate progress based on status
    progress_map = {
        StatusEnum.PENDING: 0.0,
        StatusEnum.PROCESSING: 0.5,
        StatusEnum.COMPLETED: 1.0,
        StatusEnum.FAILED: 0.0
    }
    
    return ProcessingStatusResponse(
        id=video.id,
        status=video.status,
        progress=progress_map.get(video.status, 0.0),
        current_task="Processing video analysis" if video.status == StatusEnum.PROCESSING else None,
        estimated_time_remaining=None,
        error_message=None,
        created_at=video.created_at,
        updated_at=video.updated_at or video.created_at
    )

@app.get("/get-feedback/{video_id}")
def get_feedback(video_id: int, db: Session = Depends(get_db)):
    """Get AI feedback for a video"""
    video = db.query(VideoAnalysis).filter(VideoAnalysis.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    feedbacks = db.query(AIFeedback).filter(AIFeedback.video_analysis_id == video_id).all()
    
    return {
        "video_id": video_id,
        "status": video.status,
        "transcription": video.transcription,
        "feedbacks": [
            {
                "language": feedback.language,
                "teaching_quality_score": feedback.teaching_quality_score,
                "student_engagement_score": feedback.student_engagement_score,
                "overall_score": feedback.overall_score,
                "strengths": feedback.strengths,
                "areas_for_improvement": feedback.areas_for_improvement,
                "specific_recommendations": feedback.specific_recommendations,
                "technical_analysis": json.loads(feedback.technical_analysis) if feedback.technical_analysis else {}
            }
            for feedback in feedbacks
        ]
    } 
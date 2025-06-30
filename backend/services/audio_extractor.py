import os
import logging
from moviepy.editor import VideoFileClip
from config.settings import settings
from typing import Optional

logger = logging.getLogger(__name__)


class AudioExtractor:
    def __init__(self):
        self.upload_dir = settings.upload_dir
    
    def extract_audio(self, video_path: str) -> Optional[str]:
        """
        Extract audio from video file using moviepy
        
        Args:
            video_path: Path to the video file
            
        Returns:
            Path to the extracted audio file or None if failed
        """
        try:
            # Generate audio file path
            video_filename = os.path.basename(video_path)
            audio_filename = f"{os.path.splitext(video_filename)[0]}_audio.wav"
            audio_path = os.path.join(self.upload_dir, audio_filename)
            
            logger.info(f"Extracting audio from {video_path}")
            
            # Load video and extract audio
            video = VideoFileClip(video_path)
            audio = video.audio
            
            if audio is None:
                logger.warning(f"No audio track found in video: {video_path}")
                return None
            
            # Save audio to file
            audio.write_audiofile(audio_path, verbose=False, logger=None)
            
            # Clean up
            video.close()
            audio.close()
            
            logger.info(f"Audio extracted successfully to: {audio_path}")
            return audio_path
            
        except Exception as e:
            logger.error(f"Error extracting audio from {video_path}: {str(e)}")
            return None
    
    def cleanup_audio(self, audio_path: str) -> bool:
        """
        Clean up audio file after processing
        
        Args:
            audio_path: Path to the audio file
            
        Returns:
            True if cleanup successful, False otherwise
        """
        try:
            if os.path.exists(audio_path):
                os.remove(audio_path)
                logger.info(f"Cleaned up audio file: {audio_path}")
                return True
            return False
        except Exception as e:
            logger.error(f"Error cleaning up audio file {audio_path}: {str(e)}")
            return False
    
    def get_audio_duration(self, audio_path: str) -> Optional[float]:
        """
        Get duration of audio file in seconds
        
        Args:
            audio_path: Path to the audio file
            
        Returns:
            Duration in seconds or None if failed
        """
        try:
            audio = VideoFileClip(audio_path)
            duration = audio.duration
            audio.close()
            return duration
        except Exception as e:
            logger.error(f"Error getting audio duration for {audio_path}: {str(e)}")
            return None 
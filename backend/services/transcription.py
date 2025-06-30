import logging
from faster_whisper import WhisperModel
from config.settings import settings
from typing import Optional, Dict, Any
import os

logger = logging.getLogger(__name__)


class TranscriptionService:
    def __init__(self):
        self.model = WhisperModel(
            settings.whisper_model,
            device="cpu",  # Change to "cuda" if GPU is available
            compute_type="int8"  # Change to "float16" for better accuracy
        )
        self.confidence_threshold = settings.confidence_threshold
    
    def transcribe_audio(self, audio_path: str, language: str = None) -> Optional[Dict[str, Any]]:
        """
        Transcribe audio file using Whisper
        
        Args:
            audio_path: Path to the audio file
            language: Language code (optional, for better accuracy)
            
        Returns:
            Dictionary with transcription data or None if failed
        """
        try:
            if not os.path.exists(audio_path):
                logger.error(f"Audio file not found: {audio_path}")
                return None
            
            logger.info(f"Transcribing audio: {audio_path}")
            
            # Language mapping for Whisper
            language_map = {
                "en": "en",
                "ru": "ru", 
                "tj": "tg"  # Tajik language code for Whisper
            }
            
            whisper_language = language_map.get(language, None)
            
            # Transcribe with Whisper
            segments, info = self.model.transcribe(
                audio_path,
                language=whisper_language,
                beam_size=5,
                best_of=5,
                temperature=0.0,
                condition_on_previous_text=True,
                initial_prompt="This is a classroom lecture."
            )
            
            # Process segments
            transcription_text = ""
            segments_data = []
            
            for segment in segments:
                # Filter by confidence
                if segment.avg_logprob > self.confidence_threshold:
                    transcription_text += segment.text + " "
                    segments_data.append({
                        "start": segment.start,
                        "end": segment.end,
                        "text": segment.text,
                        "avg_logprob": segment.avg_logprob,
                        "no_speech_prob": segment.no_speech_prob
                    })
            
            # Clean up transcription
            transcription_text = transcription_text.strip()
            
            result = {
                "text": transcription_text,
                "segments": segments_data,
                "language": info.language,
                "language_probability": info.language_probability,
                "duration": info.duration
            }
            
            logger.info(f"Transcription completed. Length: {len(transcription_text)} characters")
            return result
            
        except Exception as e:
            logger.error(f"Error transcribing audio {audio_path}: {str(e)}")
            return None
    
    def transcribe_video(self, video_path: str, language: str = None) -> Optional[Dict[str, Any]]:
        """
        Transcribe video file directly (extracts audio internally)
        
        Args:
            video_path: Path to the video file
            language: Language code (optional)
            
        Returns:
            Dictionary with transcription data or None if failed
        """
        try:
            logger.info(f"Transcribing video directly: {video_path}")
            
            # Language mapping for Whisper
            language_map = {
                "en": "en",
                "ru": "ru", 
                "tj": "tg"
            }
            
            whisper_language = language_map.get(language, None)
            
            # Transcribe video directly
            segments, info = self.model.transcribe(
                video_path,
                language=whisper_language,
                beam_size=5,
                best_of=5,
                temperature=0.0,
                condition_on_previous_text=True,
                initial_prompt="This is a classroom lecture."
            )
            
            # Process segments
            transcription_text = ""
            segments_data = []
            
            for segment in segments:
                if segment.avg_logprob > self.confidence_threshold:
                    transcription_text += segment.text + " "
                    segments_data.append({
                        "start": segment.start,
                        "end": segment.end,
                        "text": segment.text,
                        "avg_logprob": segment.avg_logprob,
                        "no_speech_prob": segment.no_speech_prob
                    })
            
            transcription_text = transcription_text.strip()
            
            result = {
                "text": transcription_text,
                "segments": segments_data,
                "language": info.language,
                "language_probability": info.language_probability,
                "duration": info.duration
            }
            
            logger.info(f"Video transcription completed. Length: {len(transcription_text)} characters")
            return result
            
        except Exception as e:
            logger.error(f"Error transcribing video {video_path}: {str(e)}")
            return None 
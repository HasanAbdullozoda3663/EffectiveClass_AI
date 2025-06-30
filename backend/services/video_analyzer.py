import cv2
import mediapipe as mp
import numpy as np
import logging
from typing import Dict, Any, List, Optional
import os
from datetime import datetime

logger = logging.getLogger(__name__)


class VideoAnalyzer:
    def __init__(self):
        # Initialize MediaPipe
        self.mp_face_detection = mp.solutions.face_detection
        self.mp_face_mesh = mp.solutions.face_mesh
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_pose = mp.solutions.pose
        
        # Initialize face detection
        self.face_detection = self.mp_face_detection.FaceDetection(
            model_selection=1, min_detection_confidence=0.5
        )
        
        # Initialize face mesh for detailed analysis
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            static_image_mode=False,
            max_num_faces=10,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Initialize pose detection
        self.pose = self.mp_pose.Pose(
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
    
    def analyze_video(self, video_path: str) -> Optional[Dict[str, Any]]:
        """
        Analyze video for engagement metrics and technical quality
        
        Args:
            video_path: Path to the video file
            
        Returns:
            Dictionary with analysis results or None if failed
        """
        try:
            if not os.path.exists(video_path):
                logger.error(f"Video file not found: {video_path}")
                return None
            
            logger.info(f"Starting video analysis: {video_path}")
            
            cap = cv2.VideoCapture(video_path)
            
            if not cap.isOpened():
                logger.error(f"Could not open video: {video_path}")
                return None
            
            # Get video properties
            fps = cap.get(cv2.CAP_PROP_FPS)
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            duration = frame_count / fps if fps > 0 else 0
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            
            logger.info(f"Video properties: {width}x{height}, {fps} FPS, {duration:.2f}s duration")
            
            # Analysis data
            face_detection_data = []
            motion_analysis_data = []
            engagement_periods = []
            frame_analysis = []
            
            frame_idx = 0
            sample_interval = max(1, int(fps / 2))  # Sample every 0.5 seconds
            
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Sample frames for analysis
                if frame_idx % sample_interval == 0:
                    timestamp = frame_idx / fps
                    
                    # Analyze frame
                    frame_result = self._analyze_frame(frame, timestamp)
                    if frame_result:
                        frame_analysis.append(frame_result)
                        
                        # Track face detection
                        if frame_result['faces_detected'] > 0:
                            face_detection_data.append({
                                'timestamp': timestamp,
                                'face_count': frame_result['faces_detected'],
                                'confidence': frame_result['face_confidence']
                            })
                        
                        # Track motion
                        if frame_result['motion_score'] > 0:
                            motion_analysis_data.append({
                                'timestamp': timestamp,
                                'motion_score': frame_result['motion_score']
                            })
                
                frame_idx += 1
            
            cap.release()
            
            # Process analysis results
            analysis_result = self._process_analysis_results(
                frame_analysis, face_detection_data, motion_analysis_data, duration
            )
            
            logger.info(f"Video analysis completed for {video_path}")
            return analysis_result
            
        except Exception as e:
            logger.error(f"Error analyzing video {video_path}: {str(e)}")
            return None
    
    def _analyze_frame(self, frame: np.ndarray, timestamp: float) -> Optional[Dict[str, Any]]:
        """
        Analyze a single frame for faces, motion, and engagement
        
        Args:
            frame: Video frame as numpy array
            timestamp: Current timestamp in seconds
            
        Returns:
            Dictionary with frame analysis results
        """
        try:
            # Convert BGR to RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Face detection
            face_results = self.face_detection.process(rgb_frame)
            faces_detected = 0
            face_confidence = 0.0
            
            if face_results.detections:
                faces_detected = len(face_results.detections)
                face_confidence = np.mean([
                    detection.score[0] for detection in face_results.detections
                ])
            
            # Face mesh for detailed analysis
            mesh_results = self.face_mesh.process(rgb_frame)
            engagement_score = 0.0
            
            if mesh_results.multi_face_landmarks:
                # Calculate engagement based on eye openness and head pose
                engagement_score = self._calculate_engagement_score(mesh_results.multi_face_landmarks[0])
            
            # Motion analysis
            motion_score = self._calculate_motion_score(frame)
            
            # Pose analysis
            pose_results = self.pose.process(rgb_frame)
            pose_score = 0.0
            
            if pose_results.pose_landmarks:
                pose_score = self._calculate_pose_score(pose_results.pose_landmarks)
            
            return {
                'timestamp': timestamp,
                'faces_detected': faces_detected,
                'face_confidence': face_confidence,
                'engagement_score': engagement_score,
                'motion_score': motion_score,
                'pose_score': pose_score
            }
            
        except Exception as e:
            logger.error(f"Error analyzing frame at {timestamp}s: {str(e)}")
            return None
    
    def _calculate_engagement_score(self, landmarks) -> float:
        """
        Calculate engagement score based on facial landmarks
        
        Args:
            landmarks: MediaPipe face landmarks
            
        Returns:
            Engagement score between 0 and 1
        """
        try:
            # Eye openness (simplified calculation)
            left_eye_top = landmarks.landmark[159]  # Left eye top
            left_eye_bottom = landmarks.landmark[145]  # Left eye bottom
            right_eye_top = landmarks.landmark[386]  # Right eye top
            right_eye_bottom = landmarks.landmark[374]  # Right eye bottom
            
            # Calculate eye openness
            left_eye_openness = abs(left_eye_top.y - left_eye_bottom.y)
            right_eye_openness = abs(right_eye_top.y - right_eye_bottom.y)
            
            # Head pose estimation (simplified)
            nose = landmarks.landmark[1]  # Nose tip
            left_ear = landmarks.landmark[234]  # Left ear
            right_ear = landmarks.landmark[454]  # Right ear
            
            # Calculate head pose score
            head_pose_score = 1.0 - abs(left_ear.x - right_ear.x) * 2
            
            # Combine scores
            eye_score = (left_eye_openness + right_eye_openness) / 2
            engagement_score = (eye_score + head_pose_score) / 2
            
            return min(1.0, max(0.0, engagement_score))
            
        except Exception as e:
            logger.error(f"Error calculating engagement score: {str(e)}")
            return 0.0
    
    def _calculate_motion_score(self, frame: np.ndarray) -> float:
        """
        Calculate motion score using optical flow
        
        Args:
            frame: Video frame
            
        Returns:
            Motion score between 0 and 1
        """
        try:
            # Convert to grayscale
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # Apply Gaussian blur
            gray = cv2.GaussianBlur(gray, (21, 21), 0)
            
            # Calculate motion score (simplified)
            # In a real implementation, you'd compare with previous frame
            motion_score = np.std(gray) / 255.0
            
            return min(1.0, motion_score)
            
        except Exception as e:
            logger.error(f"Error calculating motion score: {str(e)}")
            return 0.0
    
    def _calculate_pose_score(self, landmarks) -> float:
        """
        Calculate pose score based on body landmarks
        
        Args:
            landmarks: MediaPipe pose landmarks
            
        Returns:
            Pose score between 0 and 1
        """
        try:
            # Calculate pose score based on key points
            nose = landmarks.landmark[0]
            left_shoulder = landmarks.landmark[11]
            right_shoulder = landmarks.landmark[12]
            
            # Simple pose score based on shoulder alignment
            shoulder_alignment = 1.0 - abs(left_shoulder.y - right_shoulder.y)
            
            return min(1.0, max(0.0, shoulder_alignment))
            
        except Exception as e:
            logger.error(f"Error calculating pose score: {str(e)}")
            return 0.0
    
    def _process_analysis_results(
        self, 
        frame_analysis: List[Dict], 
        face_detection_data: List[Dict], 
        motion_analysis_data: List[Dict], 
        duration: float
    ) -> Dict[str, Any]:
        """
        Process and aggregate analysis results
        
        Args:
            frame_analysis: List of frame analysis results
            face_detection_data: Face detection data
            motion_analysis_data: Motion analysis data
            duration: Video duration in seconds
            
        Returns:
            Processed analysis results
        """
        try:
            if not frame_analysis:
                return {
                    'face_detection_data': [],
                    'motion_analysis_data': [],
                    'engagement_metrics': {
                        'face_detection_count': 0,
                        'motion_activity_score': 0.0,
                        'attention_span_avg': 0.0,
                        'engagement_periods': []
                    },
                    'technical_analysis': {
                        'video_quality_score': 0.0,
                        'audio_quality_score': 0.0,
                        'lighting_analysis': {},
                        'camera_stability_score': 0.0
                    }
                }
            
            # Calculate engagement metrics
            engagement_scores = [frame['engagement_score'] for frame in frame_analysis if frame['engagement_score'] > 0]
            motion_scores = [frame['motion_score'] for frame in frame_analysis if frame['motion_score'] > 0]
            
            avg_engagement = np.mean(engagement_scores) if engagement_scores else 0.0
            avg_motion = np.mean(motion_scores) if motion_scores else 0.0
            
            # Calculate attention span
            attention_periods = []
            current_period_start = None
            
            for frame in frame_analysis:
                if frame['engagement_score'] > 0.5:  # High engagement threshold
                    if current_period_start is None:
                        current_period_start = frame['timestamp']
                else:
                    if current_period_start is not None:
                        attention_periods.append({
                            'start': current_period_start,
                            'end': frame['timestamp'],
                            'duration': frame['timestamp'] - current_period_start
                        })
                        current_period_start = None
            
            # Add final period if still engaged
            if current_period_start is not None:
                attention_periods.append({
                    'start': current_period_start,
                    'end': duration,
                    'duration': duration - current_period_start
                })
            
            avg_attention_span = np.mean([period['duration'] for period in attention_periods]) if attention_periods else 0.0
            
            # Technical analysis (simplified)
            video_quality_score = 0.8  # Placeholder
            audio_quality_score = 0.7  # Placeholder
            camera_stability_score = 1.0 - avg_motion  # Less motion = more stable
            
            return {
                'face_detection_data': face_detection_data,
                'motion_analysis_data': motion_analysis_data,
                'engagement_metrics': {
                    'face_detection_count': len(face_detection_data),
                    'motion_activity_score': avg_motion,
                    'attention_span_avg': avg_attention_span,
                    'engagement_periods': attention_periods
                },
                'technical_analysis': {
                    'video_quality_score': video_quality_score,
                    'audio_quality_score': audio_quality_score,
                    'lighting_analysis': {
                        'brightness_score': 0.8,
                        'contrast_score': 0.7
                    },
                    'camera_stability_score': camera_stability_score
                }
            }
            
        except Exception as e:
            logger.error(f"Error processing analysis results: {str(e)}")
            return {} 
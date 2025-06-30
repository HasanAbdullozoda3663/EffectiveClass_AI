import os
import logging
import json
import httpx
import time
import random
from typing import Optional, Dict, Any, List
from datetime import datetime

# AI/ML imports
try:
    from moviepy.editor import VideoFileClip
    MOVIEPY_AVAILABLE = True
except ImportError:
    MOVIEPY_AVAILABLE = False
    logging.warning("MoviePy not available. Audio extraction will be skipped.")

try:
    from faster_whisper import WhisperModel
    WHISPER_AVAILABLE = True
except ImportError:
    WHISPER_AVAILABLE = False
    logging.warning("Faster-Whisper not available. Transcription will use placeholder.")

from config.settings import settings

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        self.whisper_model = None
        
        # OpenRouter free models
        self.free_models = {
            "feedback": "meta-llama/llama-4-scout:free",  # Primary - potentially longer responses
            "chat": "mistralai/mistral-7b-instruct:free",  # Fallback
            "analysis": "deepseek-chat-v3-0324:free",      # Analysis
            "vision": "moonshotai/kimi-vl-a3b-thinking:free"   # For image/video analysis
        }
        
        # Initialize AI models
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize AI models"""
        try:
            # Initialize Whisper for transcription
            if WHISPER_AVAILABLE and settings.whisper_model:
                self.whisper_model = WhisperModel(
                    settings.whisper_model,
                    device="cpu",  # Change to "cuda" if GPU available
                    compute_type="int8"
                )
                logger.info("Whisper model initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing AI models: {e}")
    
    def extract_audio_from_video(self, video_path: str) -> Optional[str]:
        """Extract audio from video using MoviePy"""
        if not MOVIEPY_AVAILABLE:
            logger.warning("MoviePy not available, skipping audio extraction")
            return None
        
        try:
            # Generate audio file path
            video_filename = os.path.basename(video_path)
            audio_filename = f"{os.path.splitext(video_filename)[0]}_audio.wav"
            audio_path = os.path.join(settings.upload_dir, audio_filename)
            
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
    
    def transcribe_audio(self, audio_path: str, language: str = None) -> Optional[Dict[str, Any]]:
        """Transcribe audio using Whisper"""
        if not WHISPER_AVAILABLE or not self.whisper_model:
            logger.warning("Whisper not available, using placeholder transcription")
            return {
                "text": "This is a placeholder transcription. Install faster-whisper for real transcription.",
                "language": language or "en",
                "segments": []
            }
        
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
            segments, info = self.whisper_model.transcribe(
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
                if segment.avg_logprob > settings.confidence_threshold:
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
            
            # If no transcription found, provide a fallback
            if not transcription_text:
                logger.warning(f"No speech detected in audio file: {audio_path}")
                transcription_text = "No clear speech detected in the video. This could be due to background music, unclear audio, or no speech content."
            
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
            return {
                "text": f"Error transcribing audio: {str(e)}",
                "language": language or "en",
                "segments": []
            }
    
    def generate_ai_feedback(self, video_data: Dict[str, Any], language: str) -> Optional[Dict[str, Any]]:
        """Generate AI feedback using OpenRouter free models"""
        try:
            if not settings.openrouter_api_key:
                logger.warning("No OpenRouter API key available, using template feedback")
                return self._get_template_feedback(language)
            
            logger.info(f"Generating real AI feedback for language: {language}")
            
            # Prepare prompt for AI
            prompt = self._create_feedback_prompt(video_data, language)
            
            # Use OpenRouter with free models
            return self._generate_with_openrouter_free(prompt, language)
                
        except Exception as e:
            logger.error(f"Error generating AI feedback: {str(e)}")
            return self._get_template_feedback(language)
    
    def _create_feedback_prompt(self, video_data: Dict[str, Any], language: str) -> str:
        """Create a prompt for AI feedback generation"""
        subject = video_data.get('subject', 'general')
        theme = video_data.get('theme', '')
        transcription = video_data.get('transcription', '')
        
        language_names = {"en": "English", "ru": "Russian", "tj": "Tajik"}
        lang_name = language_names.get(language, "English")
        
        # Special instruction for Tajik
        language_instruction = ""
        if language == "tj":
            language_instruction = """
IMPORTANT: You MUST respond in Tajik language (тоҷикӣ) using Cyrillic script. 
Do NOT respond in English or any other language. Use proper Tajik grammar and vocabulary.
"""
        elif language == "ru":
            language_instruction = """
IMPORTANT: You MUST respond in Russian language (русский) using Cyrillic script.
Do NOT respond in English or any other language. Use proper Russian grammar and vocabulary.
"""
        
        # Handle cases with no transcription
        transcription_info = ""
        if not transcription or "no clear speech" in transcription.lower():
            transcription_info = "Note: No clear speech was detected in the video. Please provide feedback based on general teaching principles and the subject/theme information provided."
        else:
            transcription_info = f"Transcription: {transcription[:800]}..."
        
        # Create detailed subject-specific guidance
        subject_guidance = self._get_subject_specific_guidance(subject, theme, language)
        
        prompt = f"""
        You are an expert educational consultant analyzing a classroom video. 
        {language_instruction}
        Please provide EXTREMELY comprehensive, detailed feedback in {lang_name} language ONLY.
        
        SUBJECT: {subject}
        THEME: {theme}
        {transcription_info}
        
        {subject_guidance}
        
        Please provide EXTREMELY detailed feedback in the following JSON format, responding in {lang_name} language:
        {{
            "teaching_quality_score": 0-10,
            "student_engagement_score": 0-10,
            "overall_score": 0-10,
            "strengths": "Provide 5-7 EXTREMELY detailed strengths specific to {subject} and {theme}. Include specific examples, observations from the video, teaching techniques used, and their effectiveness. Be very comprehensive and detailed.",
            "areas_for_improvement": "Provide 5-7 EXTREMELY detailed areas for improvement specific to {subject} and {theme}. Be very specific about what could be enhanced, include concrete examples, and explain why these improvements would be beneficial.",
            "specific_recommendations": "Provide 6-8 EXTREMELY specific, actionable recommendations for improving teaching in {subject}. Include concrete examples, step-by-step strategies, specific activities, assessment methods, and implementation tips. Be very detailed and practical."
        }}
        
        CRITICAL REQUIREMENTS FOR MAXIMUM DETAIL:
        1. Use the subject ({subject}) and theme ({theme}) information extensively throughout your feedback
        2. Make feedback extremely specific to the subject area, not generic
        3. Provide detailed explanations with multiple concrete examples for each point
        4. Focus on practical, actionable advice with step-by-step implementation
        5. Consider subject-specific teaching methodologies and best practices
        6. Respond ONLY in {lang_name} language, not in English
        7. Be extremely comprehensive and detailed in your analysis
        8. Include specific teaching strategies, assessment methods, and classroom activities
        9. Provide detailed explanations of why each recommendation would be effective
        10. Use the transcription content to provide specific examples and observations
        11. Aim for maximum detail and comprehensiveness in every section
        """
        
        return prompt
    
    def _get_subject_specific_guidance(self, subject: str, theme: str, language: str) -> str:
        """Get subject-specific guidance for feedback generation"""
        subject_lower = subject.lower()
        
        guidance = {
            "en": {
                "mathematics": f"Focus on mathematical concepts, problem-solving approaches, clarity of explanations, use of visual aids, step-by-step demonstrations, and student understanding of {theme}.",
                "science": f"Focus on scientific methodology, experimental design, hypothesis testing, use of scientific equipment, safety procedures, and understanding of {theme} concepts.",
                "language": f"Focus on language acquisition, grammar instruction, vocabulary building, pronunciation, reading comprehension, and {theme} language skills.",
                "history": f"Focus on historical analysis, source evaluation, chronological understanding, cultural context, and interpretation of {theme} historical events.",
                "literature": f"Focus on literary analysis, text interpretation, critical thinking, creative expression, and understanding of {theme} literary works.",
                "physics": f"Focus on physical concepts, mathematical applications, experimental demonstrations, problem-solving, and understanding of {theme} principles.",
                "chemistry": f"Focus on chemical reactions, laboratory safety, molecular understanding, practical applications, and {theme} chemical concepts.",
                "biology": f"Focus on biological systems, scientific observation, classification, ecological relationships, and understanding of {theme} biological processes."
            },
            "ru": {
                "mathematics": f"Сосредоточьтесь на математических концепциях, подходах к решению задач, ясности объяснений, использовании наглядных пособий, пошаговых демонстрациях и понимании студентами {theme}.",
                "science": f"Сосредоточьтесь на научной методологии, экспериментальном дизайне, проверке гипотез, использовании научного оборудования, процедурах безопасности и понимании концепций {theme}.",
                "language": f"Сосредоточьтесь на приобретении языка, обучении грамматике, построении словарного запаса, произношении, понимании чтения и языковых навыках {theme}.",
                "history": f"Сосредоточьтесь на историческом анализе, оценке источников, хронологическом понимании, культурном контексте и интерпретации исторических событий {theme}.",
                "literature": f"Сосредоточьтесь на литературном анализе, интерпретации текста, критическом мышлении, творческом выражении и понимании литературных произведений {theme}.",
                "physics": f"Сосредоточьтесь на физических концепциях, математических приложениях, экспериментальных демонстрациях, решении задач и понимании принципов {theme}.",
                "chemistry": f"Сосредоточьтесь на химических реакциях, лабораторной безопасности, молекулярном понимании, практических применениях и химических концепциях {theme}.",
                "biology": f"Сосредоточьтесь на биологических системах, научном наблюдении, классификации, экологических отношениях и понимании биологических процессов {theme}."
            },
            "tj": {
                "mathematics": f"Ба мафҳумҳои математикӣ, усулҳои ҳалли масъалаҳо, равшании шарҳҳо, истифодаи воситаҳои намоишӣ, намоишҳои қадам ба қадам ва фаҳмиши донишҷӯён аз {theme} диққат диҳед.",
                "science": f"Ба усули илмӣ, тарҳрезии таҷрибавӣ, санҷиши фарзияҳо, истифодаи таҷҳизоти илмӣ, процедураҳои бехатарӣ ва фаҳмиши мафҳумҳои {theme} диққат диҳед.",
                "language": f"Ба омӯзиши забон, таълими грамматика, сохтани луғат, талаффуз, фаҳмиши хондан ва маҳоратҳои забонӣ {theme} диққат диҳед.",
                "history": f"Ба таҳлили таърихӣ, арзёбии манбаъҳо, фаҳмиши хронологикӣ, контексти фарҳангӣ ва тафсири вокеъҳои таърихӣ {theme} диққат диҳед.",
                "literature": f"Ба таҳлили адабӣ, тафсири матн, фикри интиқодӣ, ибрози иҷодӣ ва фаҳмиши асарҳои адабӣ {theme} диққат диҳед.",
                "physics": f"Ба мафҳумҳои физикӣ, истифодаи математикӣ, намоишҳои таҷрибавӣ, ҳалли масъалаҳо ва фаҳмиши принсипҳои {theme} диққат диҳед.",
                "chemistry": f"Ба реаксияҳои химиявӣ, бехатарии лабораторӣ, фаҳмиши молекулярӣ, истифодаи амалӣ ва мафҳумҳои химиявӣ {theme} диққат диҳед.",
                "biology": f"Ба системаҳои биологӣ, мушоҳидаи илмӣ, тасниф, муносибатҳои экологӣ ва фаҳмиши равандҳои биологӣ {theme} диққат диҳед."
            }
        }
        
        # Find matching subject
        for key in guidance[language].keys():
            if key in subject_lower:
                return guidance[language][key]
        
        # Default guidance
        return guidance[language].get("science", f"Focus on general teaching effectiveness and student engagement in {subject}.")
    
    def _generate_with_openrouter_free(self, prompt: str, language: str) -> Optional[Dict[str, Any]]:
        """Generate feedback using OpenRouter free models with retry logic"""
        max_retries = 3
        base_delay = 2  # Start with 2 seconds
        
        for attempt in range(max_retries):
            try:
                headers = {
                    "Authorization": f"Bearer {settings.openrouter_api_key}",
                    "Content-Type": "application/json"
                }
                
                # Use Llama for educational feedback (best for this use case)
                model = self.free_models["feedback"]
                
                # Language mapping
                language_names = {"en": "English", "ru": "Russian", "tj": "Tajik"}
                
                data = {
                    "model": model,
                    "messages": [
                        {"role": "system", "content": f"You are an expert educational consultant with deep knowledge of teaching methodologies and classroom dynamics. You MUST respond in {language_names.get(language, 'English')} language only. Provide EXTREMELY detailed and comprehensive feedback with specific examples and actionable recommendations."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 3000,  # Significantly increased for very detailed feedback
                    "top_p": 0.9
                }
                
                with httpx.Client(timeout=60.0) as client:  # Increased timeout for longer responses
                    response = client.post(
                        f"{settings.openrouter_base_url}/chat/completions",
                        headers=headers,
                        json=data
                    )
                    response.raise_for_status()
                    
                    result = response.json()
                    content = result["choices"][0]["message"]["content"]
                    logger.info(f"Generated feedback using {model}")
                    return self._parse_ai_response(content, language)
                    
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 429:  # Rate limit exceeded
                    if attempt < max_retries - 1:
                        delay = base_delay * (2 ** attempt) + random.uniform(0, 1)  # Exponential backoff with jitter
                        logger.warning(f"Rate limit exceeded for {language}, retrying in {delay:.1f} seconds (attempt {attempt + 1}/{max_retries})")
                        time.sleep(delay)
                        continue
                    else:
                        logger.error(f"Rate limit exceeded for {language} after {max_retries} attempts, using fallback")
                        return self._generate_with_fallback_model(prompt, language)
                else:
                    logger.error(f"HTTP error {e.response.status_code} for {language}: {str(e)}")
                    if attempt < max_retries - 1:
                        time.sleep(base_delay)
                        continue
                    else:
                        return self._generate_with_fallback_model(prompt, language)
                        
            except Exception as e:
                logger.error(f"Error with OpenRouter API for {language}: {str(e)}")
                if attempt < max_retries - 1:
                    time.sleep(base_delay)
                    continue
                else:
                    return self._generate_with_fallback_model(prompt, language)
        
        # If all retries failed
        return self._generate_with_fallback_model(prompt, language)
    
    def _generate_with_fallback_model(self, prompt: str, language: str) -> Optional[Dict[str, Any]]:
        """Generate feedback using fallback free model with retry logic"""
        max_retries = 2  # Fewer retries for fallback
        base_delay = 3  # Longer delay for fallback
        
        for attempt in range(max_retries):
            try:
                headers = {
                    "Authorization": f"Bearer {settings.openrouter_api_key}",
                    "Content-Type": "application/json"
                }
                
                # Use Mistral as fallback
                model = self.free_models["chat"]
                
                data = {
                    "model": model,
                    "messages": [
                        {"role": "system", "content": "You are an educational expert providing classroom feedback."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2500  # Significantly increased for very detailed feedback
                }
                
                with httpx.Client(timeout=60.0) as client:  # Increased timeout for longer responses
                    response = client.post(
                        f"{settings.openrouter_base_url}/chat/completions",
                        headers=headers,
                        json=data
                    )
                    response.raise_for_status()
                    
                    result = response.json()
                    content = result["choices"][0]["message"]["content"]
                    logger.info(f"Generated feedback using fallback model {model}")
                    return self._parse_ai_response(content, language)
                    
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 429:  # Rate limit exceeded
                    if attempt < max_retries - 1:
                        delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
                        logger.warning(f"Fallback rate limit exceeded for {language}, retrying in {delay:.1f} seconds (attempt {attempt + 1}/{max_retries})")
                        time.sleep(delay)
                        continue
                    else:
                        logger.error(f"Fallback rate limit exceeded for {language} after {max_retries} attempts, using template")
                        return self._get_template_feedback(language)
                else:
                    logger.error(f"Fallback HTTP error {e.response.status_code} for {language}: {str(e)}")
                    if attempt < max_retries - 1:
                        time.sleep(base_delay)
                        continue
                    else:
                        return self._get_template_feedback(language)
                        
            except Exception as e:
                logger.error(f"Error with fallback model for {language}: {str(e)}")
                if attempt < max_retries - 1:
                    time.sleep(base_delay)
                    continue
                else:
                    return self._get_template_feedback(language)
        
        # If all retries failed
        return self._get_template_feedback(language)
    
    def _parse_ai_response(self, content: str, language: str) -> Dict[str, Any]:
        """Parse AI response and extract feedback"""
        try:
            logger.info(f"Parsing AI response for language: {language}")
            logger.debug(f"Raw AI response: {content[:200]}...")
            
            # Try to extract JSON from response
            import re
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                try:
                    feedback = json.loads(json_match.group())
                    logger.info(f"Successfully extracted JSON feedback for {language}")
                    
                    # Check if response is in the correct language (for Tajik)
                    if language in ["tj", "ru"] and self._is_english_response(feedback):
                        logger.warning(f"AI responded in English instead of {language}, using template")
                        return self._get_template_feedback(language)
                    
                    # Validate and normalize scores
                    feedback = self._validate_feedback_scores(feedback)
                    logger.info(f"Generated real AI feedback for {language}: {len(str(feedback))} characters")
                    return feedback
                except json.JSONDecodeError as e:
                    logger.error(f"JSON decode error for {language}: {str(e)}")
                    # Try to extract feedback manually from the response
                    return self._extract_feedback_manually(content, language)
            else:
                # Try to extract feedback manually from the response
                return self._extract_feedback_manually(content, language)
        except Exception as e:
            logger.error(f"Error parsing AI response for {language}: {str(e)}")
            return self._get_template_feedback(language)
    
    def _extract_feedback_manually(self, content: str, language: str) -> Dict[str, Any]:
        """Extract feedback manually from AI response when JSON parsing fails"""
        try:
            logger.info(f"Attempting manual feedback extraction for {language}")
            
            # Create a basic feedback structure
            feedback = {
                "teaching_quality_score": 7.0,
                "student_engagement_score": 6.5,
                "overall_score": 6.8,
                "strengths": "",
                "areas_for_improvement": "",
                "specific_recommendations": ""
            }
            
            # Try to extract strengths, improvements, and recommendations from the text
            lines = content.split('\n')
            current_section = None
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                # Look for section headers
                if any(keyword in line.lower() for keyword in ['strength', 'сильная', 'қувва']):
                    current_section = 'strengths'
                elif any(keyword in line.lower() for keyword in ['improvement', 'улучшение', 'беҳтар']):
                    current_section = 'areas_for_improvement'
                elif any(keyword in line.lower() for keyword in ['recommendation', 'рекомендация', 'тавсия']):
                    current_section = 'specific_recommendations'
                elif current_section and line and not line.startswith('{') and not line.startswith('}'):
                    # Add content to current section
                    if feedback[current_section]:
                        feedback[current_section] += " " + line
                    else:
                        feedback[current_section] = line
            
            # If we couldn't extract meaningful content, use template
            if not any([feedback['strengths'], feedback['areas_for_improvement'], feedback['specific_recommendations']]):
                logger.warning(f"Could not extract meaningful feedback for {language}, using template")
                return self._get_template_feedback(language)
            
            logger.info(f"Successfully extracted manual feedback for {language}")
            return feedback
            
        except Exception as e:
            logger.error(f"Error in manual feedback extraction for {language}: {str(e)}")
            return self._get_template_feedback(language)
    
    def _is_english_response(self, feedback: Dict[str, Any]) -> bool:
        """Check if the feedback is in English instead of the requested language"""
        # More sophisticated check for different languages
        feedback_text = " ".join([
            str(feedback.get("strengths", "")),
            str(feedback.get("areas_for_improvement", "")),
            str(feedback.get("specific_recommendations", ""))
        ]).lower()
        
        # Check for Cyrillic characters (Russian/Tajik)
        cyrillic_chars = set('абвгдеёжзийклмнопрстуфхцчшщъыьэюя')
        has_cyrillic = any(char in cyrillic_chars for char in feedback_text)
        
        # Check for English words that shouldn't be in Tajik/Russian
        english_indicators = ["the", "teacher", "students", "learning", "could", "would", "should", "improve", "teaching", "classroom"]
        english_word_count = sum(1 for indicator in english_indicators if indicator in feedback_text)
        
        # If it has Cyrillic characters, it's likely not English
        if has_cyrillic:
            return False
        
        # If it has many English words, it's likely English
        if english_word_count >= 3:
            return True
        
        return False
    
    def _validate_feedback_scores(self, feedback: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and normalize feedback scores"""
        try:
            # Ensure scores are within 0-10 range
            for score_key in ['teaching_quality_score', 'student_engagement_score', 'overall_score']:
                if score_key in feedback:
                    score = feedback[score_key]
                    if isinstance(score, (int, float)):
                        feedback[score_key] = max(0.0, min(10.0, float(score)))
                    else:
                        feedback[score_key] = 7.0  # Default score
            
            # Ensure required fields exist and are strings (not lists)
            required_fields = ['strengths', 'areas_for_improvement', 'specific_recommendations']
            for field in required_fields:
                if field not in feedback or not feedback[field]:
                    feedback[field] = "Analysis in progress."
                else:
                    # Convert lists to strings if needed
                    if isinstance(feedback[field], list):
                        feedback[field] = " ".join(str(item) for item in feedback[field])
                    elif not isinstance(feedback[field], str):
                        feedback[field] = str(feedback[field])
            
            return feedback
        except Exception as e:
            logger.error(f"Error validating feedback scores: {str(e)}")
            return self._get_template_feedback("en")
    
    def _get_template_feedback(self, language: str) -> Dict[str, Any]:
        """Get template feedback for a specific language"""
        logger.warning(f"Using TEMPLATE feedback for language: {language}")
        
        feedback_templates = {
            "en": {
                "teaching_quality_score": 7.5,
                "student_engagement_score": 6.5,
                "overall_score": 7.0,
                "strengths": "The teacher demonstrates good preparation and organization of the lesson. The use of visual aids and step-by-step explanations helps students understand complex concepts. The teacher maintains a clear and structured approach to content delivery.",
                "areas_for_improvement": "Student participation could be enhanced through more interactive activities and group discussions. The pace of instruction might need adjustment to accommodate different learning speeds. Consider incorporating more real-world examples to make abstract concepts more relatable.",
                "specific_recommendations": "1. Implement think-pair-share activities to increase student interaction. 2. Use formative assessment techniques like exit tickets to gauge understanding. 3. Incorporate technology tools for interactive learning. 4. Provide more opportunities for student-led discussions. 5. Consider differentiated instruction strategies for diverse learners."
            },
            "ru": {
                "teaching_quality_score": 7.5,
                "student_engagement_score": 6.5,
                "overall_score": 7.0,
                "strengths": "Учитель демонстрирует хорошую подготовку и организацию урока. Использование наглядных пособий и пошаговых объяснений помогает учащимся понимать сложные концепции. Учитель поддерживает четкий и структурированный подход к подаче материала.",
                "areas_for_improvement": "Участие учащихся можно улучшить с помощью более интерактивных занятий и групповых обсуждений. Темп обучения может потребовать корректировки для учета различных скоростей обучения. Рассмотрите возможность включения большего количества примеров из реальной жизни.",
                "specific_recommendations": "1. Внедрите деятельность 'думай-обсуждай-делись' для увеличения взаимодействия учащихся. 2. Используйте методы формирующего оценивания. 3. Включите технологические инструменты для интерактивного обучения. 4. Предоставьте больше возможностей для обсуждений под руководством учащихся. 5. Рассмотрите стратегии дифференцированного обучения."
            },
            "tj": {
                "teaching_quality_score": 7.5,
                "student_engagement_score": 6.5,
                "overall_score": 7.0,
                "strengths": "Муаллим тайёрӣ ва ташкили хубро дар дарс нишон медиҳад. Истифодаи воситаҳои намоишӣ ва шарҳҳои қадам ба қадам ба донишҷӯён дар фаҳмиши мафҳумҳои мураккаб кӯмак мекунад. Муаллим усули равшан ва сохташударо дар пешниҳоди мундариҷа нигоҳ медорад.",
                "areas_for_improvement": "Иштироки донишҷӯёнро метавон бо воситаи фаъолиятҳои интерактивӣ ва муҳокимаҳои гурӯҳӣ беҳтар кард. Суриати таълим метавонад барои ҳисобгирии суръатҳои гуногуни омӯзиш тағйир дода шавад. Имконияти илова кардани мисолҳои ҳақиқӣро дида бароед.",
                "specific_recommendations": "1. Фаъолиятҳои 'фикр кунед-муҳокима кунед-ҳамроҳ шавед' -ро барои зиёд кардани муоширати донишҷӯён ворид кунед. 2. Усулҳои арзёбии ташаккулӣ истифода баред. 3. Абзорҳои технологӣ барои омӯзиши интерактивӣ илова кунед. 4. Имкониятҳои бештар барои муҳокимаҳо дар зери роҳбарии донишҷӯён пешниҳод кунед. 5. Стратегияҳои таълими фарқкунандаро дида бароед."
            }
        }
        
        return feedback_templates.get(language, feedback_templates["en"]) 
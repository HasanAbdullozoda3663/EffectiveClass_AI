// API service for communicating with the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface VideoUploadRequest {
  subject: string;
  theme: string;
  language: string;
}

export interface VideoUploadResponse {
  id: number;
  video_filename: string;
  subject: string;
  theme: string;
  language: string;
  status: string;
  created_at: string;
  message: string;
}

export interface ProcessingStatusResponse {
  id: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  current_task?: string;
  estimated_time_remaining?: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface FeedbackResponse {
  language: string;
  teaching_quality_score: number;
  student_engagement_score: number;
  overall_score: number;
  strengths: string;
  areas_for_improvement: string;
  specific_recommendations: string;
  technical_analysis: any;
}

export interface GetFeedbackResponse {
  video_id: number;
  status: string;
  transcription: string;
  feedbacks: FeedbackResponse[];
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Language mapping from frontend to backend
  private mapLanguageToBackend(language: string): string {
    const languageMap: { [key: string]: string } = {
      'english': 'en',
      'russian': 'ru', 
      'tajik': 'tj'
    }
    return languageMap[language] || 'en'
  }

  // Upload video file
  async uploadVideo(
    file: File,
    subject: string,
    theme: string,
    language: string,
    feedbackLanguage: string
  ): Promise<VideoUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject', subject);
    formData.append('theme', theme);
    formData.append('language', this.mapLanguageToBackend(language));
    formData.append('feedback_language', this.mapLanguageToBackend(feedbackLanguage));

    const response = await fetch(`${this.baseUrl}/upload-video`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Upload error response:', errorData);
      
      // Handle validation errors (422)
      if (response.status === 422 && errorData.detail) {
        if (Array.isArray(errorData.detail)) {
          // Multiple validation errors
          const errorMessages = errorData.detail.map((err: any) => 
            `${err.loc?.join('.')}: ${err.msg}`
          ).join(', ');
          throw new Error(`Validation errors: ${errorMessages}`);
        } else {
          // Single validation error
          throw new Error(`Validation error: ${errorData.detail}`);
        }
      }
      
      // Handle other errors
      const errorMessage = errorData.detail || errorData.message || 'Failed to upload video';
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Get processing status
  async getStatus(videoId: number): Promise<ProcessingStatusResponse> {
    const response = await fetch(`${this.baseUrl}/status/${videoId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get status');
    }

    return response.json();
  }

  // Get feedback results
  async getFeedback(videoId: number): Promise<GetFeedbackResponse> {
    const response = await fetch(`${this.baseUrl}/get-feedback/${videoId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get feedback');
    }

    return response.json();
  }

  // Poll status until completion
  async pollStatus(videoId: number, onProgress?: (status: ProcessingStatusResponse) => void): Promise<ProcessingStatusResponse> {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.getStatus(videoId);
          
          if (onProgress) {
            onProgress(status);
          }

          if (status.status === 'completed' || status.status === 'failed') {
            resolve(status);
          } else {
            // Poll again in 2 seconds
            setTimeout(poll, 2000);
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }
}

export const apiService = new ApiService(); 
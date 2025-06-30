# EffectiveClass AI Backend Setup

## 🚀 Quick Setup with OpenRouter Free Models

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements-ai.txt
```

### 2. Get OpenRouter API Key (FREE!)
1. Go to [https://openrouter.ai/](https://openrouter.ai/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Create `.env` file:
```bash
cp env.example .env
# Edit .env and add your OpenRouter API key
```

### 3. Start the Server
```bash
uvicorn main:app --reload
```

## 🆓 Free Models Used

| Model | Purpose | Use Case |
|-------|---------|----------|
| `mistralai/mistral-7b-instruct:free` | Primary feedback | Educational analysis |
| `deepseek-chat-v3-0324:free` | Fallback feedback | Conversational responses |
| `meta-llama/llama-4-scout:free` | Deep analysis | Long-context understanding |
| `moonshotai/kimi-vl-a3b-thinking:free` | Vision analysis | Image/video processing |

## 🎯 Features

✅ **Real audio extraction** with MoviePy  
✅ **Real transcription** with Whisper  
✅ **Real AI feedback** with OpenRouter free models  
✅ **Multilingual support** (EN, RU, TJ)  
✅ **Zero cost** - all models are free!  

## 📊 API Endpoints

- `POST /upload-video` - Upload video for analysis
- `GET /status/{video_id}` - Check processing status
- `GET /get-feedback/{video_id}` - Get AI feedback

## 🔧 Configuration

Edit `.env` file:
```env
OPENROUTER_API_KEY=your_key_here
UPLOAD_DIR=media/uploads
DEFAULT_LANGUAGES=en,ru,tj
```

## 🧪 Test the System

1. Go to [http://localhost:8000/docs](http://localhost:8000/docs)
2. Upload a video with subject, theme, and language
3. Check status and get feedback

## 💡 Tips

- Free models have rate limits but are perfect for testing
- System falls back to templates if API is unavailable
- All feedback is generated in real-time using AI 
# 🎓 EffectiveClass AI

**AI-Powered Classroom Analysis Platform**

Transform your teaching with intelligent video analysis, multilingual feedback, and actionable insights for educational improvement.

![EffectiveClass AI](https://img.shields.io/badge/EffectiveClass-AI-blue?style=for-the-badge&logo=robot)
![Python](https://img.shields.io/badge/Python-3.8+-green?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-red?style=for-the-badge&logo=fastapi)
![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)

## 🌟 Features

### 🤖 AI-Powered Analysis
- **Real-time video processing** with advanced AI models
- **Multilingual feedback** in Tajik, Russian, and English
- **Teaching quality assessment** with detailed scoring
- **Student engagement analysis** using computer vision
- **Comprehensive recommendations** for improvement

### 🎯 Educational Focus
- **Subject-specific analysis** (Mathematics, Science, Language, History, etc.)
- **Theme-based feedback** tailored to lesson content
- **Actionable insights** with concrete examples
- **Professional development** recommendations

### 🌍 Multilingual Support
- **Tajik (тоҷикӣ)** - Native language support with Cyrillic script
- **Russian (русский)** - Comprehensive Russian language feedback
- **English** - International standard analysis

### 🚀 Technical Excellence
- **Real-time processing** with background tasks
- **Rate limiting protection** for API stability
- **Graceful fallbacks** ensuring system reliability
- **Scalable architecture** ready for production

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Architecture](#-architecture)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- OpenRouter API key (free)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/effectiveclass-ai.git
cd effectiveclass-ai
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements-ai.txt
cp env.example .env
# Edit .env with your OpenRouter API key
python main.py
```

### 3. Frontend Setup
```bash
cd ..
npm install
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

## 📦 Installation

### Backend Dependencies

#### Full Installation (Recommended)
```bash
cd backend
pip install -r requirements-ai.txt
```

#### Minimal Installation
```bash
cd backend
pip install -r requirements-minimal.txt
```

### Frontend Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

## ⚙️ Configuration

### 1. Get OpenRouter API Key (FREE!)
1. Visit [https://openrouter.ai/](https://openrouter.ai/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env` file

### 2. Environment Variables
```env
# OpenRouter Configuration
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Database Configuration
DATABASE_URL=sqlite:///./effectiveclass.db

# File Storage
UPLOAD_DIR=media/uploads
MAX_FILE_SIZE=500MB
ALLOWED_VIDEO_EXTENSIONS=["mp4","avi","mov","wmv","flv","webm"]

# AI Model Settings
WHISPER_MODEL=base
CONFIDENCE_THRESHOLD=0.7

# Application Settings
SECRET_KEY=your_secret_key_here
DEFAULT_LANGUAGES=["en","ru","tj"]
```

## 🎯 Usage

### 1. Upload a Video
1. Go to the web interface
2. Select your video file
3. Choose subject and theme
4. Select language preference
5. Upload and wait for processing

### 2. View Results
- **Real-time status** updates during processing
- **Multilingual feedback** in all supported languages
- **Detailed analysis** with scores and recommendations
- **Downloadable reports** for professional use

### 3. API Usage
```bash
# Upload video
curl -X POST "http://localhost:8000/upload-video" \
  -F "file=@your_video.mp4" \
  -F "subject=mathematics" \
  -F "theme=Quadratic Equations" \
  -F "language=en"

# Check status
curl "http://localhost:8000/status/{video_id}"

# Get feedback
curl "http://localhost:8000/get-feedback/{video_id}"
```

## 📚 API Documentation

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/upload-video` | POST | Upload video for analysis |
| `/status/{video_id}` | GET | Check processing status |
| `/get-feedback/{video_id}` | GET | Get AI feedback results |

### Response Format
```json
{
  "video_id": 1,
  "status": "completed",
  "transcription": "Lesson transcript...",
  "feedbacks": [
    {
      "language": "en",
      "teaching_quality_score": 8.5,
      "student_engagement_score": 7.2,
      "overall_score": 7.85,
      "strengths": "Detailed strengths analysis...",
      "areas_for_improvement": "Specific improvement areas...",
      "specific_recommendations": "Actionable recommendations..."
    }
  ]
}
```

## 🏗️ Architecture

### Backend Stack
- **FastAPI** - High-performance web framework
- **SQLAlchemy** - Database ORM
- **Whisper** - Audio transcription
- **MoviePy** - Video processing
- **OpenRouter** - AI model integration
- **SQLite** - Database (production-ready alternatives available)

### Frontend Stack
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Hook Form** - Form handling

### AI Models Used
| Model | Purpose | Provider |
|-------|---------|----------|
| `meta-llama/llama-4-scout:free` | Primary feedback | OpenRouter |
| `mistralai/mistral-7b-instruct:free` | Fallback feedback | OpenRouter |
| `deepseek-chat-v3-0324:free` | Analysis | OpenRouter |
| `whisper/base` | Transcription | OpenAI |

## 🔧 Development

### Project Structure
```
EffectiveClass-AI/
├── backend/                 # FastAPI backend
│   ├── config/             # Configuration
│   ├── database/           # Database models
│   ├── models/             # Data models
│   ├── schemas/            # Pydantic schemas
│   ├── services/           # AI services
│   └── main.py            # FastAPI app
├── app/                    # Next.js frontend
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   └── page.tsx           # Main page
├── components/             # Shared components
├── locales/               # Internationalization
└── public/                # Static assets
```

### Running in Development
```bash
# Backend (with auto-reload)
cd backend
uvicorn main:app --reload

# Frontend (with hot reload)
npm run dev
```

### Testing
```bash
# Backend tests
cd backend
pytest

# Frontend tests
npm test
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker
docker-compose up -d
```

### Production Setup
1. **Database**: Use PostgreSQL or MySQL
2. **File Storage**: Use cloud storage (AWS S3, Google Cloud)
3. **Caching**: Add Redis for performance
4. **Monitoring**: Add logging and monitoring
5. **SSL**: Configure HTTPS

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Style
- **Python**: Follow PEP 8
- **JavaScript/TypeScript**: Use ESLint and Prettier
- **Commits**: Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenRouter** for providing free AI model access
- **OpenAI** for Whisper transcription
- **FastAPI** community for the excellent framework
- **Next.js** team for the React framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/effectiveclass-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/effectiveclass-ai/discussions)
- **Email**: support@effectiveclass.ai

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/effectiveclass-ai&type=Date)](https://star-history.com/#yourusername/effectiveclass-ai&Date)

---

**Made with ❤️ for better education**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/effectiveclass-ai?style=social)](https://github.com/yourusername/effectiveclass-ai/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/effectiveclass-ai?style=social)](https://github.com/yourusername/effectiveclass-ai/network)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/effectiveclass-ai)](https://github.com/yourusername/effectiveclass-ai/issues)
[![GitHub license](https://img.shields.io/github/license/yourusername/effectiveclass-ai)](https://github.com/yourusername/effectiveclass-ai/blob/main/LICENSE)
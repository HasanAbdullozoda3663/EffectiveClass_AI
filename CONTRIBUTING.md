# 🤝 Contributing to EffectiveClass AI

Thank you for your interest in contributing to EffectiveClass AI! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Code Style](#-code-style)
- [Testing](#-testing)
- [Pull Request Process](#-pull-request-process)
- [Issue Reporting](#-issue-reporting)
- [Feature Requests](#-feature-requests)
- [Community Guidelines](#-community-guidelines)

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- Git
- OpenRouter API key (free)

### Fork and Clone
1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/effectiveclass-ai.git
   cd effectiveclass-ai
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/original-owner/effectiveclass-ai.git
   ```

## 🔧 Development Setup

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements-ai.txt
cp env.example .env
# Edit .env with your OpenRouter API key
```

### Frontend Setup
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Database Setup
```bash
cd backend
# The database will be created automatically on first run
python main.py
```

## 📝 Code Style

### Python (Backend)
- Follow **PEP 8** style guide
- Use **type hints** for all functions
- Maximum line length: **88 characters** (Black formatter)
- Use **docstrings** for all public functions and classes

```python
def process_video(video_path: str, language: str = "en") -> Dict[str, Any]:
    """
    Process a video file and generate AI feedback.
    
    Args:
        video_path: Path to the video file
        language: Language code for analysis
        
    Returns:
        Dictionary containing processing results
        
    Raises:
        FileNotFoundError: If video file doesn't exist
    """
    # Implementation here
```

### TypeScript/JavaScript (Frontend)
- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Use **functional components** with hooks
- Follow **React best practices**

```typescript
interface VideoUploadProps {
  onUpload: (file: File) => void;
  maxSize?: number;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ 
  onUpload, 
  maxSize = 500 * 1024 * 1024 
}) => {
  // Implementation here
};
```

### Git Commit Messages
Use **conventional commit messages**:

```
feat: add new video processing feature
fix: resolve rate limiting issue
docs: update API documentation
style: format code with prettier
refactor: improve error handling
test: add unit tests for AI service
chore: update dependencies
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest
pytest --cov=services --cov-report=html
```

### Frontend Testing
```bash
npm test
npm run test:coverage
```

### Integration Testing
```bash
# Start backend
cd backend && python main.py

# In another terminal, start frontend
npm run dev

# Run integration tests
npm run test:integration
```

## 🔄 Pull Request Process

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes
- Write clean, well-documented code
- Add tests for new functionality
- Update documentation if needed
- Follow the code style guidelines

### 3. Test Your Changes
```bash
# Backend tests
cd backend && pytest

# Frontend tests
npm test

# Linting
npm run lint
cd backend && flake8 .
```

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: add new video processing feature"
```

### 5. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Link to related issues
- Screenshots for UI changes
- Test results

### 6. PR Review Process
- All PRs require at least one review
- Address review comments promptly
- Ensure all CI checks pass
- Update documentation if needed

## 🐛 Issue Reporting

### Bug Reports
When reporting bugs, please include:

1. **Clear description** of the problem
2. **Steps to reproduce** the issue
3. **Expected vs actual behavior**
4. **Environment details**:
   - OS and version
   - Python version
   - Node.js version
   - Browser (for frontend issues)
5. **Error messages** and logs
6. **Screenshots** if applicable

### Issue Template
```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 11, macOS 14]
- Python: [e.g., 3.11.0]
- Node.js: [e.g., 18.17.0]
- Browser: [e.g., Chrome 120]

## Additional Information
Any other context, logs, or screenshots
```

## 💡 Feature Requests

### Before Submitting
1. Check existing issues and PRs
2. Search the documentation
3. Consider if it aligns with project goals

### Feature Request Template
```markdown
## Feature Description
Clear description of the feature

## Use Case
Why this feature is needed

## Proposed Solution
How you think it should work

## Alternatives Considered
Other approaches you've considered

## Additional Context
Any other relevant information
```

## 🌟 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow project conventions

### Communication
- Use GitHub Issues for bugs and features
- Use GitHub Discussions for questions
- Be clear and concise in communications
- Use English as the primary language

### Recognition
Contributors will be recognized in:
- GitHub contributors list
- Project documentation
- Release notes
- Community acknowledgments

## 🛠️ Development Areas

### High Priority
- [ ] Improve AI model accuracy
- [ ] Add more language support
- [ ] Enhance video analysis
- [ ] Optimize performance

### Medium Priority
- [ ] Add user authentication
- [ ] Implement caching
- [ ] Add export functionality
- [ ] Improve UI/UX

### Low Priority
- [ ] Add mobile app
- [ ] Integrate with LMS
- [ ] Add analytics dashboard
- [ ] Create API client libraries

## 📚 Resources

### Documentation
- [API Documentation](http://localhost:8000/docs)
- [Frontend Documentation](./docs/frontend.md)
- [Backend Documentation](./docs/backend.md)

### Tools
- [OpenRouter API](https://openrouter.ai/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)

### Community
- [GitHub Discussions](https://github.com/yourusername/effectiveclass-ai/discussions)
- [Discord Server](https://discord.gg/effectiveclass-ai)
- [Email Support](mailto:support@effectiveclass.ai)

## 🙏 Thank You

Thank you for contributing to EffectiveClass AI! Your contributions help make education better for everyone.

---

**Happy coding! 🎉** 
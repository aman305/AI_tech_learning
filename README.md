# AI Tech Platform - AI Mentor Platform

A comprehensive AI-powered educational platform that delivers personalized, adaptive learning experiences through intelligent tutoring, dynamic course generation, and multi-LLM provider support.

## 🎯 Overview

The AI Tech Platform is an intelligent tutoring system designed to provide students with personalized learning experiences. It combines:

- **Adaptive Learning Engine** - Adjusts difficulty and pacing based on student performance
- **Socratic Teaching Method** - Guides students through problems using strategic questioning
- **Multi-Role Support** - Separate interfaces for students, teachers, and administrators
- **Multi-LLM Integration** - Support for multiple AI providers (Google Gemini, Azure AI)
- **Curriculum Generation** - Automatically generates structured learning paths
- **Session Management** - Tracks student progress and learning history

## 📋 Quick Links

- [Setup Guide](./SETUP_GUIDE.md) - Installation and configuration
- [Architecture](./ARCHITECTURE.md) - System design and components
- [API Documentation](./API_DOCUMENTATION.md) - REST API endpoints
- [Learning Engine](./LEARNING_ENGINE.md) - Pedagogical framework and algorithms
- [Contributing](./CONTRIBUTING.md) - Development guidelines

## 🚀 Quick Start

```bash
# Clone and install dependencies
npm install
cd server && npm install && cd ..

# Configure environment
cd server
cp .env.example .env
# Edit .env with your API keys

# Start the server
npm start

# In another terminal, run the frontend
python -m http.server 8000
```

Access at:
- **Main Interface**: http://localhost:8000/index.html
- **Learning**: http://localhost:8000/learn.html
- **Teacher Dashboard**: http://localhost:8000/teacher.html

## 📁 Project Structure

```
AI_tech_plateform/
├── Frontend Files
│   ├── index.html              # Main landing page
│   ├── learn.html              # Student learning interface
│   ├── teacher.html            # Teacher/instructor dashboard
│   ├── style.css               # Global styling
│   ├── promptEngine.js         # Prompt construction and management
│   └── wizard.js               # Interactive setup wizard
│
├── server/                     # Backend Node.js/Express server
│   ├── server.js               # Main server entry point
│   ├── aiLearningEngine.js     # Core tutoring algorithm
│   ├── courseGenerator.js      # Dynamic curriculum generation
│   ├── llmRouter.js            # Multi-provider LLM routing
│   ├── .env                    # Environment variables
│   ├── memory/
│   │   └── learningMemory.js   # Session and progress persistence
│   └── providers/
│       └── azureProvider.js    # Azure AI integration
│
└── Configuration
    ├── package.json            # Frontend dependencies
    ├── aura_cam.code-workspace # VS Code workspace config
    └── 7 Steps.txt             # Setup instructions
```

## 🔧 Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Responsive styling
- **JavaScript (ES6+)** - Dynamic interactions
- **Fetch API** - REST communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - REST API framework
- **Google Generative AI** - Gemini LLM integration
- **Dotenv** - Configuration management
- **CORS** - Cross-origin requests
- **Morgan** - HTTP logging

### External Services
- **Google Gemini API** - Primary LLM provider
- **Azure AI Services** - Alternative provider

## 💡 Key Features

### 1. Adaptive Learning
- Tracks student performance across sessions
- Adjusts difficulty based on accuracy rates
- Skips concepts when mastered

### 2. Socratic Method Implementation
- Strategic questioning guides learning
- Active recall reinforcement
- Error-driven feedback loop

### 3. Multi-Provider LLM Support
- Route requests to different AI providers
- Fallback mechanism for reliability
- Provider-specific configuration

### 4. Session Management
- Persistent session storage
- Multi-user support
- Learning history tracking

### 5. Dynamic Curriculum Generation
- Generates topic sequences based on:
  - Student level (Beginner/Intermediate/Advanced)
  - Technology/subject area
  - Learning objectives

## 🔌 API Endpoints

### POST /chat
Main endpoint for student-tutor interaction.

**Request:**
```json
{
  "message": "What is a variable?",
  "sessionId": "user_123",
  "setup": {
    "technology": "Python",
    "level": "Beginner",
    "language": "en"
  }
}
```

**Response:**
```json
{
  "reply": "A variable is a named container that stores a value...",
  "sessionId": "user_123",
  "metadata": {
    "topic": "Variables aur Data Types",
    "progress": 0.25
  }
}
```

See [API Documentation](./API_DOCUMENTATION.md) for complete endpoint reference.

## 🎓 Learning Algorithm

The system uses a 7-step pedagogical framework:

1. **Concept Presentation** - Introduce topic with intuition-first approach
2. **Example Demonstration** - Show practical examples
3. **Active Question** - Pose a question to learner
4. **Answer Evaluation** - Assess student response
5. **Error Correction** - Provide immediate feedback
6. **Concept Scaffolding** - Build on previous knowledge
7. **Progress Advancement** - Move to next topic when ready

See [Learning Engine Documentation](./LEARNING_ENGINE.md) for detailed pedagogy.

## 🔐 Configuration

Environment variables required in `server/.env`:

```bash
# LLM Configuration
GOOGLE_API_KEY=your_google_api_key
AZURE_API_KEY=your_azure_key
AZURE_ENDPOINT=your_azure_endpoint
LLM_PROVIDER=google  # or 'azure'

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:8000,http://localhost:3000
```

## 📊 Session Structure

Each session maintains:

```javascript
{
  setup: {
    technology: "Python",
    level: "Beginner",
    language: "en"
  },
  curriculum: ["Topic 1", "Topic 2", ...],
  currentLesson: 0,
  awaitingAnswer: false,
  studentModel: {
    correctCount: 5,
    partialCount: 2,
    incorrectCount: 1
  },
  history: [
    { question: "...", answer: "...", correct: true }
  ]
}
```

## 🧪 Testing

```bash
# Test server connectivity
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello",
    "sessionId": "test_123",
    "setup": {"technology": "Python", "level": "Beginner"}
  }'
```

## 📝 Development

### Adding a New LLM Provider

1. Create provider file in `server/providers/`
2. Implement standard interface in `llmRouter.js`
3. Update environment variables
4. Add routing logic

### Customizing the Learning Engine

1. Modify curriculum topics in `aiLearningEngine.js`
2. Adjust evaluation criteria in `parseEvaluation()`
3. Update difficulty progression logic
4. Test with `7 Steps.txt` guide

### Extending the UI

1. Add pages in root directory (e.g., `admin.html`)
2. Reference in navigation files
3. Add CSS to `style.css`
4. Import shared components from existing pages

## 🐛 Troubleshooting

### Server Won't Start
- Check Node.js version (v14+)
- Verify all dependencies installed: `npm install`
- Check .env configuration
- Review error logs from morgan middleware

### LLM Timeouts
- Verify API keys are valid
- Check network connectivity
- Review rate limits on provider account
- Check system resources

### CORS Errors
- Verify frontend port matches ALLOWED_ORIGINS
- Check CORS middleware configuration in server.js
- Clear browser cache and cookies

## 📚 Documentation Files

- **README.md** (this file) - Project overview
- **SETUP_GUIDE.md** - Installation and configuration
- **ARCHITECTURE.md** - System design and data flow
- **API_DOCUMENTATION.md** - REST API reference
- **LEARNING_ENGINE.md** - Pedagogical framework
- **CONTRIBUTING.md** - Development guidelines

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Code style guidelines
- Pull request process
- Testing requirements
- Commit message format

## 📄 License

[Add your license here]

## 👥 Authors

- Created for AI-powered educational platform

## 📞 Support

For issues, questions, or suggestions:
- Check documentation files
- Review `7 Steps.txt` for setup help
- Check existing issues/discussions
- Create a new issue with detailed description

---

**Last Updated**: April 2026  
**Version**: 1.0.0

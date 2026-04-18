# System Architecture - AI Tech Platform

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  index.html      learn.html      teacher.html      wizard.js     │
│  (Landing)       (Student)       (Instructor)      (Setup)       │
└────────────────────────┬──────────────────────────────────────────┘
                         │
                    HTTP/REST
                         │
┌─────────────────────────┴──────────────────────────────────────────┐
│                      EXPRESS SERVER                                │
│                    (server.js:3000)                                │
├────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │  /chat Endpoint  │  │  Middleware      │  │  Session Manager │ │
│  │  Request Handler │  │  (CORS, Morgan)  │  │  (Memory Store)  │ │
│  └────────┬─────────┘  └──────────────────┘  └──────────────────┘ │
└───────────┼─────────────────────────────────────────────────────────┘
            │
┌───────────┴──────────────────────────────────────────────────────────┐
│              PROCESSING PIPELINE                                      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  1. Parse Request → 2. Build Session → 3. Learning Engine Process    │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │              AI LEARNING ENGINE (aiLearningEngine.js)          │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │  • Curriculum Generation                                       │  │
│  │  • Student Model Tracking                                      │  │
│  │  • Concept Sequencing                                          │  │
│  │  • Answer Evaluation                                           │  │
│  │  • Adaptive Difficulty                                         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                          │                                            │
│                          ▼                                            │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │              PROMPT ENGINE (promptEngine.js)                   │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │  • Build LLM Prompts                                           │  │
│  │  • Add Context & History                                       │  │
│  │  • Format Instructions                                         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                          │                                            │
│                          ▼                                            │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │               LLM ROUTER (llmRouter.js)                        │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │  • Provider Selection (Google/Azure)                           │  │
│  │  • API Key Management                                          │  │
│  │  • Request Formatting                                          │  │
│  │  • Response Parsing                                            │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                          │                                            │
└──────────────────────────┼────────────────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
┌──────────────────────┐         ┌──────────────────────┐
│  Google Gemini API   │         │   Azure AI Services  │
│  (Primary Provider)  │         │  (Alternative)       │
└──────────────────────┘         └──────────────────────┘
        │                                     │
        └──────────────────┬──────────────────┘
                           │
                    LLM Response
                           │
                           ▼
         ┌─────────────────────────────────┐
         │  Response Processing & Caching  │
         └─────────────────────────────────┘
                           │
                           ▼
         ┌─────────────────────────────────┐
         │  Session Update & Memory Store  │
         └─────────────────────────────────┘
                           │
                           ▼
         ┌─────────────────────────────────┐
         │  Return to Frontend Client      │
         └─────────────────────────────────┘
```

## Component Details

### 1. Frontend Layer

#### index.html
- Landing page with project information
- Navigation to learn.html and teacher.html
- Project overview and feature showcase

#### learn.html
- Primary student learning interface
- Chat interface for interacting with AI tutor
- Progress tracking display
- Topic/lesson navigation

#### teacher.html
- Instructor dashboard
- Student progress monitoring
- Curriculum management
- Analytics and reporting

#### wizard.js
- Interactive setup wizard for new sessions
- Collects user preferences (technology, level, language)
- Initializes student model

#### promptEngine.js
- Constructs LLM prompts with context
- Manages conversation history
- Formats system instructions

### 2. Backend Server (Express)

#### server.js
**Purpose**: Main Express application and route handler

**Key Components**:
- CORS middleware for cross-origin requests
- JSON body parser for request handling
- Morgan logger for HTTP logging
- Session management (in-memory object)

**Main Endpoint**: 
```
POST /chat
├── Input: { message, sessionId, setup }
├── Processing: Session lookup/creation
├── Flow: Message → Learning Engine → LLM → Response
└── Output: { reply, sessionId, metadata }
```

**Session Structure**:
```javascript
sessions = {
  "user_123": {
    setup: { technology, level, language },
    curriculum: ["Topic1", "Topic2", ...],
    currentLesson: 0,
    awaitingAnswer: false,
    studentModel: { correctCount, partialCount, incorrectCount },
    history: []
  }
}
```

### 3. AI Learning Engine (aiLearningEngine.js)

**Responsibilities**:
1. **Curriculum Generation** - Creates topic sequence
2. **Student Modeling** - Tracks performance metrics
3. **Concept Sequencing** - Manages lesson progression
4. **Response Evaluation** - Assesses student answers
5. **Adaptive Difficulty** - Adjusts based on performance

**Algorithm Flow**:

```
Input: Student Message
  │
  ├─ Session exists? 
  │   ├─ NO → Generate curriculum
  │   └─ YES → Retrieve curriculum
  │
  ├─ Parse student input
  │
  ├─ Special commands?
  │   ├─ "jump-to:" → Change lesson
  │   ├─ "reset" → Clear progress
  │   ├─ "help" → Show commands
  │   └─ Otherwise → Process as answer
  │
  ├─ If awaiting answer from previous question:
  │   ├─ Evaluate correctness
  │   ├─ Update student model
  │   ├─ Provide feedback
  │   └─ Consider moving to next topic
  │
  ├─ Generate next question
  │
  └─ Return: { explanation, question, topic }
```

**Student Model**:
```javascript
{
  correctCount: number,      // Correct answers
  partialCount: number,      // Partially correct
  incorrectCount: number,    // Incorrect answers
  mastery: percentage,       // Calculated mastery level
  ready: boolean            // Ready for next concept
}
```

**Curriculum Topics** (Example - Python Beginner):
1. Variables aur Data Types
2. Conditional Logic
3. Loops
4. Functions
5. Lists aur Dictionaries
6. Object-Oriented Basics

### 4. Prompt Engine (promptEngine.js)

**Functions**:
- `buildPrompt(basePrompt, setup, history)` - Constructs full LLM prompt

**Prompt Structure**:
```
System Instructions:
- You are an AI tutor
- Student level: [Level]
- Subject: [Technology]

Current Topic: [Topic]

Conversation History:
- [Previous exchanges]

User Message: [Current message]

Instructions:
- Explain in simple terms
- Use [Language]
- Ask follow-up questions
```

### 5. LLM Router (llmRouter.js)

**Purpose**: Abstract LLM provider selection and API management

**Key Functions**:
- `askLLM(prompt)` - Route request to configured provider
- Provider detection from .env
- Error handling and fallback

**Supported Providers**:
1. **Google Gemini** (Default)
   - API: Google Generative AI
   - Model: gemini-pro
   - Authentication: GOOGLE_API_KEY

2. **Azure AI** (Alternative)
   - API: Azure OpenAI
   - Authentication: AZURE_API_KEY + AZURE_ENDPOINT

**Routing Logic**:
```
askLLM(prompt)
  ├─ Check LLM_PROVIDER env
  ├─ If "azure" → azureProvider.askLLM()
  ├─ Else → Use googleProvider (default)
  └─ Return response or error
```

### 6. Memory Management (memory/learningMemory.js)

**Responsibilities**:
- Session persistence (currently in-memory)
- Learning history tracking
- Student profile storage
- Progress analytics

**Data Stored**:
```javascript
{
  sessionId: string,
  userId: string,
  startTime: timestamp,
  curriculum: string[],
  progress: {
    currentLesson: number,
    completedLessons: number,
    totalTime: number
  },
  performance: {
    correct: number,
    partial: number,
    incorrect: number
  }
}
```

### 7. Provider Integration (providers/azureProvider.js)

**Purpose**: Handle Azure-specific API calls

**Functions**:
- Authentication with Azure credentials
- Request formatting for Azure API
- Response parsing
- Error handling

## Data Flow

### Request-Response Cycle

```
1. Client sends POST /chat
   ├─ message: "What is a variable?"
   ├─ sessionId: "user_123"
   └─ setup: { technology: "Python", level: "Beginner" }

2. Server receives request
   ├─ Extract parameters
   ├─ Check session exists, create if needed
   └─ Pass to learning engine

3. Learning Engine processes
   ├─ Check curriculum generated
   ├─ Parse student message
   ├─ Evaluate if awaiting answer
   └─ Build response with prompt + context

4. Build LLM Prompt (promptEngine)
   ├─ Add system instructions
   ├─ Add conversation context
   ├─ Add current topic
   └─ Return formatted prompt

5. Route to LLM (llmRouter)
   ├─ Select provider (Google/Azure)
   ├─ Add API key
   ├─ Send request
   └─ Await response

6. LLM Response received
   ├─ Parse response
   ├─ Extract explanation/question
   └─ Return to learning engine

7. Learning Engine processes response
   ├─ Update session state
   ├─ Update student model
   ├─ Set awaitingAnswer = true
   └─ Format final response

8. Server returns response
   ├─ reply: "A variable is..."
   ├─ sessionId: "user_123"
   └─ metadata: { topic, progress }

9. Client receives and displays
   ├─ Show AI response
   ├─ Enable input for next message
   └─ Update progress display
```

## Session Lifecycle

```
Session Creation
  └─ Triggered by first /chat request with new sessionId
     ├─ Create session object
     ├─ Store setup parameters
     └─ Initialize empty curriculum

Curriculum Generation
  └─ On first substantive interaction
     ├─ Ask LLM for topic sequence
     ├─ Parse topics from response
     ├─ Store in session.curriculum
     └─ Set currentLesson = 0

Active Learning Loop
  └─ For each student message
     ├─ Check if awaiting answer
     ├─ Evaluate response (if answer)
     ├─ Generate question (if explanation needed)
     ├─ Update student model
     └─ Determine lesson advancement

Lesson Advancement
  └─ When student masters topic
     ├─ Calculate mastery percentage
     ├─ If > 70% correct → Advance
     ├─ Increment currentLesson
     └─ Repeat loop with next topic

Session Persistence
  └─ Currently in-memory
     ├─ Lost on server restart
     ├─ Future: Database integration
     └─ Can be exported to JSON

Session End
  └─ User closes app or timeout
     ├─ Session remains in memory
     ├─ Can resume with same sessionId
     └─ History preserved
```

## Technology Stack Rationale

| Component | Technology | Why |
|-----------|-----------|-----|
| Runtime | Node.js | Async I/O, JavaScript ecosystem |
| Framework | Express.js | Lightweight, flexible routing |
| LLM | Google Gemini | Free tier, good performance |
| Config | Dotenv | Secure credential management |
| Logging | Morgan | HTTP request logging |
| CORS | CORS middleware | Cross-domain requests |

## Scalability Considerations

### Current Limitations
- In-memory session storage (single server only)
- No database backend
- Synchronous API calls

### Future Improvements
1. **Database Integration** (MongoDB/PostgreSQL)
   - Persistent session storage
   - User authentication
   - Historical analytics

2. **Distributed Caching** (Redis)
   - Session sharing across servers
   - Faster response times
   - Memory efficiency

3. **Async Job Queue** (Bull/RabbitMQ)
   - Handle long-running processes
   - Curriculum pre-generation
   - Batch operations

4. **Load Balancing**
   - Multiple server instances
   - API gateway routing
   - Health checks

## Security Considerations

- API keys stored in .env (not committed)
- CORS configured for allowed origins
- Input validation in progress
- Rate limiting recommended
- HTTPS for production

---

**Last Updated**: April 2026  
**Architecture Version**: 1.0

# API Documentation - AI Tech Platform

## Base URL

```
http://localhost:3000
```

## Authentication

Currently, the API uses session-based identification via `sessionId`. No authentication headers required.

Future versions will implement:
- JWT tokens
- API key authentication
- User session management

---

## Endpoints

### 1. POST /chat

Main endpoint for student-tutor interaction. Sends a message to the AI tutor and receives adaptive responses.

**URL**: `POST /chat`

**Description**: 
Processes student input, manages learning state, generates adaptive responses based on student performance, and returns AI tutor feedback with questions or explanations.

#### Request

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "message": "What is a variable?",
  "sessionId": "student_001",
  "setup": {
    "technology": "Python",
    "level": "Beginner",
    "language": "en"
  }
}
```

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | string | Yes | Student's message or answer |
| `sessionId` | string | Yes | Unique session identifier |
| `setup` | object | No* | Initial setup config (required for new sessions) |
| `setup.technology` | string | No | Subject/technology (e.g., "Python", "JavaScript") |
| `setup.level` | string | No | Proficiency level: "Beginner", "Intermediate", "Advanced" |
| `setup.language` | string | No | Response language: "en", "hi", etc. |

*Required only on first request with a new sessionId

#### Response

**Status**: `200 OK`

**Body**:
```json
{
  "reply": "A variable is a named container that stores a value. Think of it like a labeled box where you can put data...",
  "sessionId": "student_001",
  "status": "success",
  "metadata": {
    "topic": "Variables aur Data Types",
    "currentLesson": 0,
    "totalLessons": 6,
    "progress": 0.25,
    "studentModel": {
      "correctCount": 2,
      "partialCount": 1,
      "incorrectCount": 0,
      "masteryPercentage": 85
    }
  }
}
```

**Response Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `reply` | string | AI tutor's response message |
| `sessionId` | string | Session identifier (echoed from request) |
| `status` | string | Response status: "success", "error" |
| `metadata` | object | Session and progress metadata |
| `metadata.topic` | string | Current learning topic |
| `metadata.currentLesson` | number | Current lesson index (0-based) |
| `metadata.totalLessons` | number | Total lessons in curriculum |
| `metadata.progress` | number | Overall progress (0-1) |
| `metadata.studentModel` | object | Current student performance metrics |

#### Example Usage

**cURL**:
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, I want to learn Python",
    "sessionId": "student_001",
    "setup": {
      "technology": "Python",
      "level": "Beginner",
      "language": "en"
    }
  }'
```

**JavaScript (Fetch API)**:
```javascript
const response = await fetch('http://localhost:3000/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: "What is a variable?",
    sessionId: "student_001",
    setup: {
      technology: "Python",
      level: "Beginner",
      language: "en"
    }
  })
});

const data = await response.json();
console.log(data.reply);
```

**Python (Requests)**:
```python
import requests

payload = {
    "message": "What is a variable?",
    "sessionId": "student_001",
    "setup": {
        "technology": "Python",
        "level": "Beginner",
        "language": "en"
    }
}

response = requests.post('http://localhost:3000/chat', json=payload)
data = response.json()
print(data['reply'])
```

#### Error Responses

**400 Bad Request**:
```json
{
  "error": "No message received.",
  "status": "error"
}
```

**500 Internal Server Error**:
```json
{
  "error": "LLM API error: Rate limit exceeded",
  "status": "error",
  "sessionId": "student_001"
}
```

---

## Special Commands

The API recognizes special commands prefixed with keywords. Send them as regular messages.

### Jump to Lesson
**Command**: `jump-to:<lesson_number>`

**Example**:
```json
{
  "message": "jump-to:3",
  "sessionId": "student_001"
}
```

**Effect**: Moves to specified lesson number (0-indexed)

### Reset Progress
**Command**: `reset`

**Example**:
```json
{
  "message": "reset",
  "sessionId": "student_001"
}
```

**Effect**: Clears all progress, restarts from lesson 0

### Help
**Command**: `help`

**Example**:
```json
{
  "message": "help",
  "sessionId": "student_001"
}
```

**Effect**: Returns list of available commands and tips

### Current Status
**Command**: `status`

**Example**:
```json
{
  "message": "status",
  "sessionId": "student_001"
}
```

**Effect**: Returns current session progress and topic

---

## Learning Flow

### Step 1: Initialize Session
```
Client Request:
POST /chat
{
  "message": "Start",
  "sessionId": "new_student",
  "setup": {
    "technology": "Python",
    "level": "Beginner"
  }
}

Server Response:
{
  "reply": "Welcome! Let's start learning Python. First topic: Variables...",
  "sessionId": "new_student",
  "metadata": { "topic": "Variables", "currentLesson": 0 }
}
```

### Step 2: Receive Explanation
```
Client Request:
POST /chat
{
  "message": "What is a variable?",
  "sessionId": "new_student"
}

Server Response:
{
  "reply": "A variable is like a labeled box that holds a value. In Python, you create one with: name = value",
  "sessionId": "new_student",
  "metadata": { ... }
}
```

### Step 3: Answer Question
```
Client Request:
POST /chat
{
  "message": "So x = 5 creates a variable named x with value 5?",
  "sessionId": "new_student"
}

Server Response:
{
  "reply": "Exactly right! You've got it. Now, what do you think happens if we do y = x?",
  "sessionId": "new_student",
  "metadata": { "studentModel": { "correctCount": 1 } }
}
```

### Step 4: Progress to Next Topic
```
When student demonstrates mastery (>70% correct), automatically advances:

Client Request:
POST /chat
{
  "message": "I'm ready for the next topic",
  "sessionId": "new_student"
}

Server Response:
{
  "reply": "Great job on Variables! Now let's learn about Conditional Logic...",
  "metadata": { "topic": "Conditional Logic", "currentLesson": 1 }
}
```

---

## Session Management

### Session Object Structure

```javascript
{
  "student_001": {
    setup: {
      technology: "Python",
      level: "Beginner",
      language: "en"
    },
    curriculum: [
      "Variables aur Data Types",
      "Conditional Logic",
      "Loops",
      "Functions",
      "Lists aur Dictionaries",
      "Object-Oriented Basics"
    ],
    currentLesson: 2,
    awaitingAnswer: true,
    studentModel: {
      correctCount: 8,
      partialCount: 2,
      incorrectCount: 1
    },
    history: [
      {
        topic: "Variables",
        question: "What is a variable?",
        studentAnswer: "A box for data",
        correct: true,
        feedback: "Correct!"
      },
      ...
    ]
  }
}
```

### Session Persistence

**Current**: In-memory (lost on server restart)

**Future Plans**:
- MongoDB storage
- Redis caching
- Session export/import

---

## Technologies & Providers

### LLM Providers

The system supports multiple LLM providers configured via environment variables.

#### Google Gemini (Default)
```bash
LLM_PROVIDER=google
GOOGLE_API_KEY=your_api_key_here
```

**Model**: `gemini-pro`  
**Base URL**: `https://generativelanguage.googleapis.com/v1beta/models`

#### Azure OpenAI
```bash
LLM_PROVIDER=azure
AZURE_API_KEY=your_api_key
AZURE_ENDPOINT=https://your-resource.openai.azure.com/
```

**Model**: `gpt-4` or `gpt-3.5-turbo`  
**Version**: `2024-02-15-preview`

---

## Rate Limits

### Current Implementation
- No built-in rate limiting
- Depends on LLM provider limits

### Recommended Limits (Production)
- 100 requests per minute per session
- 10,000 requests per day per API key
- Implement via middleware

---

## Error Handling

### Common Error Scenarios

**1. Missing Message**
```json
{
  "error": "No message received.",
  "status": "error",
  "code": "MISSING_MESSAGE"
}
```

**2. LLM API Error**
```json
{
  "error": "LLM API error: Rate limit exceeded",
  "status": "error",
  "code": "LLM_API_ERROR",
  "details": "retry_after_seconds: 30"
}
```

**3. Invalid Session Setup**
```json
{
  "error": "Invalid technology specified",
  "status": "error",
  "code": "INVALID_SETUP",
  "details": "Supported: Python, JavaScript, Java"
}
```

**4. Server Error**
```json
{
  "error": "Internal server error",
  "status": "error",
  "code": "SERVER_ERROR",
  "sessionId": "student_001"
}
```

### Error Codes

| Code | HTTP | Meaning | Solution |
|------|------|---------|----------|
| `MISSING_MESSAGE` | 400 | No message in request | Include "message" field |
| `LLM_API_ERROR` | 503 | LLM provider error | Retry after delay |
| `INVALID_SETUP` | 400 | Bad setup config | Check technology/level |
| `SERVER_ERROR` | 500 | Server exception | Check logs, retry |
| `SESSION_TIMEOUT` | 408 | Session expired | Create new session |

---

## Best Practices

### 1. Session Management
```javascript
// Store sessionId persistently (e.g., localStorage)
localStorage.setItem('tutorSessionId', sessionId);

// Reuse on page reload
const sessionId = localStorage.getItem('tutorSessionId') || generateNewId();
```

### 2. Error Handling
```javascript
try {
  const response = await fetch('/chat', { ... });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (data.status === 'error') throw new Error(data.error);
  return data;
} catch (error) {
  console.error('Chat error:', error);
  // Show user-friendly message
}
```

### 3. Request Queueing
```javascript
// Queue requests to prevent race conditions
const messageQueue = [];
let isProcessing = false;

async function sendMessage(message) {
  messageQueue.push(message);
  if (!isProcessing) processQueue();
}

async function processQueue() {
  isProcessing = true;
  while (messageQueue.length > 0) {
    const message = messageQueue.shift();
    await fetch('/chat', { ... });
  }
  isProcessing = false;
}
```

### 4. Response Caching
```javascript
// Cache student model for quick UI updates
let lastMetadata = {};
function updateUI(response) {
  lastMetadata = response.metadata;
  // Update progress bar, topic display, etc.
}
```

---

## Examples

### Complete Conversation Flow

```javascript
const sessionId = `student_${Date.now()}`;

// Step 1: Initialize
async function startSession() {
  const response = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Start learning',
      sessionId,
      setup: {
        technology: 'Python',
        level: 'Beginner',
        language: 'en'
      }
    })
  });
  return response.json();
}

// Step 2: Interact
async function sendMessage(message) {
  const response = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      sessionId
    })
  });
  return response.json();
}

// Usage
const initial = await startSession();
console.log(initial.reply); // Welcome message

const q1 = await sendMessage('What is a variable?');
console.log(q1.reply); // Explanation

const q2 = await sendMessage('So x = 5 means x stores 5?');
console.log(q2.reply); // Feedback + next question
```

---

## Webhook Support (Future)

Planned feature for notifications:

```json
{
  "webhookUrl": "https://yourapp.com/tutoring-events",
  "events": [
    "student.lesson_completed",
    "student.concept_mastered",
    "student.struggling",
    "student.progress_milestone"
  ]
}
```

---

## API Versioning

**Current Version**: `v1.0`

**Planned**:
- `/api/v1/chat` - Current
- `/api/v2/chat` - Enhanced response format (future)

---

## Support & Debugging

### Debug Mode
```bash
# Enable detailed logging
DEBUG=tutoring:* npm start

# Monitor request/response
curl -v http://localhost:3000/chat
```

### Common Issues

**Q: Responses are slow**  
A: Check LLM provider status, network latency, server load

**Q: Session data lost after restart**  
A: Session storage is in-memory; implement database backend

**Q: LLM gives inconsistent responses**  
A: Normal for generative models; use temperature/seed parameters

---

**Last Updated**: April 2026  
**API Version**: 1.0.0

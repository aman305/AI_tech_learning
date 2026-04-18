# Contributing to AI Tech Platform

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Reporting Issues](#reporting-issues)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please treat all community members with respect and kindness.

### Expected Behavior

- Be respectful and inclusive
- Welcome diverse perspectives and backgrounds
- Focus on constructive feedback
- Collaborate in good faith

### Unacceptable Behavior

- Harassment, discrimination, or hate speech
- Personal attacks or derogatory comments
- Spam or self-promotion
- Any form of abuse

---

## Getting Started

### Before You Begin

1. **Fork the Repository**
   ```bash
   # Visit GitHub repository
   # Click "Fork" in top-right corner
   # Clone your fork locally
   git clone https://github.com/your-username/ai-tech-platform.git
   cd ai-tech-platform
   ```

2. **Create a Development Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Keep Your Fork Updated**
   ```bash
   # Add upstream remote
   git remote add upstream https://github.com/original-owner/ai-tech-platform.git
   
   # Sync with main repo
   git fetch upstream
   git rebase upstream/main
   ```

---

## Development Setup

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment

```bash
cd server

# Create .env file
touch .env

# Add your API keys (get from Setup Guide)
# GOOGLE_API_KEY=your_key_here
# LLM_PROVIDER=google
```

### 3. Verify Setup

```bash
# Test server
cd server && npm start
# Should output: Server running on port 3000

# Test frontend (new terminal)
python -m http.server 8000
# Visit: http://localhost:8000
```

---

## Coding Standards

### JavaScript Style Guide

#### General Rules

```javascript
// ✓ Good: Clear variable names
const studentPerformance = calculateAccuracy(responses);

// ✗ Bad: Unclear abbreviations
const sp = calcAcc(r);

// ✓ Good: Descriptive function names
function isStudentReady() { ... }

// ✗ Bad: Single-letter names
function isReady() { ... }
```

#### File Organization

```javascript
// 1. Imports
import express from 'express';
import { askLLM } from './llmRouter.js';

// 2. Constants
const DEFAULT_LEVEL = 'Beginner';
const MAX_LESSONS = 10;

// 3. Main functions
export async function runLearningEngine(message, session) {
  // Implementation
}

// 4. Helper functions
function parseTopics(text) {
  // Implementation
}
```

#### Naming Conventions

| Type | Style | Example |
|------|-------|---------|
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_KEY` |
| Variables | camelCase | `studentCount`, `isReady` |
| Functions | camelCase | `calculateScore()`, `parseResponse()` |
| Classes | PascalCase | `StudentModel`, `LearningEngine` |
| Private functions | _camelCase | `_formatPrompt()` |

#### Code Formatting

```javascript
// Line length: Max 80 characters
// Example:
const explanation = generateExplanation(
  currentTopic,
  studentLevel,
  previousResponses
);

// Spacing: 2 spaces for indentation
if (score > 70) {
  performanceLevel = 'Advanced';
} else if (score > 50) {
  performanceLevel = 'Intermediate';
} else {
  performanceLevel = 'Beginner';
}

// Comments for complex logic
// Regular evaluation uses LLM to assess accuracy
const evaluation = await evaluateAnswerWithLLM(studentAnswer);
```

#### Error Handling

```javascript
// ✓ Good: Specific error handling
try {
  const response = await askLLM(prompt);
  if (!response) throw new Error('Empty LLM response');
  return parseResponse(response);
} catch (error) {
  console.error('LLM processing failed:', error.message);
  throw new Error('Failed to generate explanation');
}

// ✗ Bad: Generic error handling
try {
  const response = await askLLM(prompt);
  return parseResponse(response);
} catch (e) {
  console.log('Error');
}
```

### HTML/CSS Standards

```html
<!-- Semantic HTML -->
<section class="learning-container">
  <header>
    <h1>Learning Module</h1>
  </header>
  
  <main id="content">
    <article class="lesson">
      <!-- Content -->
    </article>
  </main>
  
  <footer>
    <!-- Footer content -->
  </footer>
</section>

<!-- CSS: Use classes, not IDs for styling -->
/* ✓ Good */
.lesson-card {
  padding: 1rem;
  background: #f5f5f5;
}

/* ✗ Bad */
#lesson-card {
  padding: 1rem;
}

/* Use variables for colors */
:root {
  --primary: #0066cc;
  --success: #28a745;
  --danger: #dc3545;
}
```

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

Must be one of:
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons)
- **refactor**: Code refactoring without feature/fix changes
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Dependency updates, build changes

### Scope

Where the change is made:
- `learning-engine`
- `llm-router`
- `api`
- `frontend`
- `docs`
- `config`

### Subject

- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at end
- Limit to 50 characters

### Body

- Explain what and why (not how)
- Reference issues: "Closes #123"
- Wrap at 72 characters

### Examples

```
feat(learning-engine): implement adaptive difficulty adjustment

Add logic to increase/decrease difficulty based on student
performance. When accuracy > 80%, move to harder concepts.
When < 50%, provide more scaffolding.

Closes #456
```

```
fix(llm-router): handle API timeout gracefully

Add retry logic with exponential backoff for failed API
calls. Timeout set to 30 seconds.

Fixes #789
```

```
docs: update setup guide with Azure configuration

Add detailed steps for configuring Azure OpenAI provider
including key management and authentication.
```

---

## Pull Request Process

### Before Submitting PR

1. **Update Main Branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run Tests**
   ```bash
   npm test
   cd server && npm test && cd ..
   ```

3. **Verify Code Style**
   ```bash
   npm run lint
   ```

4. **Update Documentation**
   - Update README.md if behavior changes
   - Update API_DOCUMENTATION.md for API changes
   - Add comments for complex logic

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Testing
Describe testing performed:
- [ ] Manual testing on Windows/Mac/Linux
- [ ] API endpoint testing
- [ ] UI testing
- [ ] Error handling verification

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass
- [ ] No breaking changes
```

### PR Review

- Respond to reviewer feedback promptly
- Discuss concerns respectfully
- Make requested changes in separate commits
- Request re-review after changes

### Merging

- PRs require at least 1 approval
- All checks must pass
- Branch must be up to date with main
- Squash commits if requested

---

## Testing

### Writing Tests

```javascript
// Example test file: server/tests/aiLearningEngine.test.js

import { describe, it, expect, beforeEach } from '@jest/globals';
import { runLearningEngine } from '../aiLearningEngine.js';

describe('AI Learning Engine', () => {
  let mockSession;

  beforeEach(() => {
    mockSession = {
      setup: { technology: 'Python', level: 'Beginner' },
      curriculum: ['Variables', 'Loops', 'Functions'],
      currentLesson: 0,
      awaitingAnswer: false
    };
  });

  it('should generate curriculum on first interaction', async () => {
    const result = await runLearningEngine(
      'Hello',
      mockSession,
      mockAskLLM
    );
    
    expect(mockSession.curriculum).toBeDefined();
    expect(mockSession.curriculum.length).toBeGreaterThan(0);
  });

  it('should evaluate student answers correctly', async () => {
    const evaluation = evaluateAnswer('Variable is a container');
    expect(evaluation).toBe('correct');
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test server/tests/aiLearningEngine.test.js

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Test Coverage Goals

- **Line Coverage**: ≥ 80%
- **Branch Coverage**: ≥ 75%
- **Function Coverage**: ≥ 80%

---

## Documentation

### Updating Documentation

1. **README.md** - Project overview changes
2. **SETUP_GUIDE.md** - Installation/setup changes
3. **API_DOCUMENTATION.md** - API endpoint changes
4. **ARCHITECTURE.md** - Architecture/design changes
5. **LEARNING_ENGINE.md** - Pedagogy/algorithm changes
6. **Code Comments** - Complex logic explanation

### Documentation Standards

```javascript
/**
 * Evaluates a student's answer for correctness
 * @param {string} answer - The student's response
 * @param {string} question - The question asked
 * @param {Object} context - Additional context
 * @returns {Promise<string>} - "correct", "partial", or "incorrect"
 */
export async function evaluateAnswer(
  answer,
  question,
  context
) {
  // Implementation
}
```

---

## Reporting Issues

### Issue Template

```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: Windows 10
- Node.js: v18.0.0
- npm: v9.0.0

## Screenshots
[If applicable]

## Additional Context
[Any other information]
```

### Bug Priority

- **Critical**: Server crashes, data loss, security issue
- **High**: Major feature not working
- **Medium**: Feature works but with issues
- **Low**: Minor issues, nice-to-have improvements

---

## Development Tips

### Useful Commands

```bash
# Run server in development mode
cd server && npm start

# Run frontend server
python -m http.server 8000

# Check for code issues
npm run lint

# Format code
npm run format

# Run type checking (if using TypeScript)
npm run type-check

# Debug server
DEBUG=* npm start

# Monitor file changes
npm run watch
```

### Debugging

```javascript
// Add debug logging
import debug from 'debug';
const log = debug('tutoring:learning-engine');

// Use in code
log('Evaluating answer:', answer);
log('Student model:', studentModel);
```

### Performance Testing

```bash
# Profile server performance
clinic doctor -- npm start

# Memory usage
node --trace-gc server/server.js

# Load testing (using autocannon)
npm install -g autocannon
autocannon -d 30 -c 10 http://localhost:3000/chat
```

---

## Getting Help

- **Questions**: Check existing issues and discussions
- **Documentation**: See README.md and other docs
- **Chat**: Join community discussion
- **Issues**: Check if your question is already answered

---

## Recognition

Contributors are recognized in:
- CONTRIBUTORS.md
- Release notes
- Project website

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Last Updated**: April 2026  
**Contributing Guidelines Version**: 1.0

Thank you for contributing! 🙏

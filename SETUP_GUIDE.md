# Setup Guide - AI Tech Platform

Complete installation and configuration guide for the AI Tech Platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Verification](#verification)
5. [Troubleshooting](#troubleshooting)
6. [Deployment](#deployment)

---

## Prerequisites

### System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **Disk Space**: 500 MB minimum
- **RAM**: 2 GB minimum

### Required Accounts

1. **Google Cloud Account** (for Gemini API)
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a project
   - Enable Generative AI API

2. **Azure Account** (optional, for Azure provider)
   - Go to [Azure Portal](https://portal.azure.com)
   - Create Azure OpenAI resource
   - Get API key and endpoint

### Verify Prerequisites

```bash
# Check Node.js version
node --version
# Should output: v14.0.0 or higher

# Check npm version
npm --version
# Should output: v6.0.0 or higher
```

---

## Installation

### Step 1: Clone or Download Project

```bash
# If using Git
git clone <repository-url>
cd AI_tech_plateform

# Or download ZIP and extract
cd AI_tech_plateform
```

### Step 2: Install Frontend Dependencies

```bash
# From project root
npm install
```

**Expected output**:
```
added X packages in Y seconds
```

**Dependency List**:
- @google/generative-ai@^0.24.1
- cors@^2.8.6
- dotenv@^17.3.1
- express@^5.2.1
- morgan@^1.10.1
- node-fetch@^3.3.2

### Step 3: Install Server Dependencies

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Return to root
cd ..
```

**Expected packages installed**:
- express
- @google/generative-ai
- cors
- dotenv
- morgan
- node-fetch

### Step 4: Verify Installation

```bash
# Check if all packages are installed
npm ls

# Check server packages
cd server && npm ls && cd ..
```

---

## Configuration

### Step 1: Get API Keys

#### Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Select "Create new API key in new project"
4. Copy the generated API key
5. Keep it secure (never commit to Git)

#### Azure OpenAI API Key (Optional)

1. Go to [Azure Portal](https://portal.azure.com)
2. Create Azure OpenAI resource or use existing
3. Go to "Keys and Endpoint" section
4. Copy Key 1 and Endpoint URL
5. Keep credentials secure

### Step 2: Create Environment File

```bash
# Navigate to server directory
cd server

# Create .env file from template (if exists)
# Or create manually:
# On Windows:
type nul > .env

# On macOS/Linux:
touch .env
```

### Step 3: Configure Environment Variables

Edit `server/.env` and add:

```bash
# LLM Configuration
LLM_PROVIDER=google
GOOGLE_API_KEY=your_google_api_key_here

# Optional: Azure Configuration (if using Azure provider)
# AZURE_API_KEY=your_azure_key_here
# AZURE_ENDPOINT=https://your-resource.openai.azure.com/

# Server Configuration
PORT=3000
NODE_ENV=development

# Logging
LOG_LEVEL=info

# CORS Configuration (for production)
# ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

### Step 4: Create .gitignore Entry

Ensure `.env` is not committed:

```bash
# Add to .gitignore
echo ".env" >> .gitignore
echo "node_modules/" >> .gitignore
echo ".DS_Store" >> .gitignore
```

### Step 5: Verify Configuration

```bash
# From server directory
node -e "import('./server.js').catch(e => console.log('Config Error:', e.message))"
```

---

## Verification

### Verify Installation

```bash
# Test frontend file structure
ls -la    # or dir on Windows

# Should show:
# - index.html
# - learn.html
# - teacher.html
# - style.css
# - promptEngine.js
# - wizard.js
# - package.json
# - server/ (directory)
```

### Test Server Startup

```bash
# From server directory
cd server

# Start server
npm start

# Expected output:
# Server running on port 3000
# Morgan HTTP logger initialized
# Ready for connections
```

### Test API Endpoint

In another terminal:

```bash
# Test with curl
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello",
    "sessionId": "test_user",
    "setup": {
      "technology": "Python",
      "level": "Beginner",
      "language": "en"
    }
  }'

# Should return JSON response (may take 5-10 seconds)
```

### Test Frontend

```bash
# Option 1: Use Python's built-in server
cd path/to/AI_tech_plateform
python -m http.server 8000

# Option 2: Use Node's http-server
npm install -g http-server
http-server

# Option 3: Use VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

Visit in browser:
- http://localhost:8000/index.html
- http://localhost:8000/learn.html
- http://localhost:8000/teacher.html

---

## Project Structure After Setup

```
AI_tech_plateform/
├── node_modules/          # Frontend dependencies
├── server/
│   ├── node_modules/      # Server dependencies
│   ├── .env               # Environment config (created)
│   ├── package.json
│   ├── server.js
│   ├── aiLearningEngine.js
│   ├── courseGenerator.js
│   ├── llmRouter.js
│   ├── promptEngine.js
│   ├── memory/
│   └── providers/
├── public/                # (Optional) Static files
├── index.html
├── learn.html
├── teacher.html
├── style.css
├── package.json
├── .gitignore
└── README.md
```

---

## Troubleshooting

### Issue: "npm command not found"

**Solution**:
```bash
# Install Node.js from https://nodejs.org/
# Then verify installation:
node --version
npm --version
```

### Issue: "ENOENT: no such file or directory, open '.env'"

**Solution**:
```bash
# Create .env file in server directory
cd server
touch .env  # or: type nul > .env (Windows)

# Add required variables (see Configuration section)
```

### Issue: "Cannot find module '@google/generative-ai'"

**Solution**:
```bash
# Reinstall dependencies
cd server
rm -rf node_modules package-lock.json
npm install

# Or specific package
npm install @google/generative-ai
```

### Issue: "CORS error" or "Cannot reach server"

**Solution**:
```bash
# Ensure server is running on correct port
# Check if port 3000 is available:

# On Windows:
netstat -ano | findstr :3000

# On macOS/Linux:
lsof -i :3000

# If port is in use, change PORT in .env:
PORT=3001
```

### Issue: "LLM API error: Invalid API Key"

**Solution**:
```bash
# Verify API key in .env
cat server/.env  # Check GOOGLE_API_KEY value

# Test API key directly:
curl https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY

# Get new key if needed:
# - Google: https://makersuite.google.com/app/apikey
# - Azure: Azure Portal → Keys and Endpoint
```

### Issue: "Server crashes on startup"

**Solution**:
```bash
# Check for syntax errors:
node --check server/server.js

# Run with detailed logging:
DEBUG=* npm start

# Check Node.js version compatibility:
node --version  # Must be v14+

# Clear npm cache:
npm cache clean --force
npm install
```

### Issue: "Frontend not connecting to backend"

**Solution**:
```bash
# Verify backend is running:
curl http://localhost:3000/chat

# Check CORS configuration
# In server/.env, add:
ALLOWED_ORIGINS=http://localhost:8000

# Verify frontend has correct server URL
# Edit learn.html and check:
fetch('http://localhost:3000/chat', ...)
```

### Issue: "Slow responses from LLM"

**Solution**:
- Check internet connection
- Verify API quota limits (Google/Azure)
- Check server resource usage: `top` or Task Manager
- Consider response caching

### Issue: "Module not found" errors

**Solution**:
```bash
# Verify all imports use correct paths
# Files should be in:
- server/server.js ✓
- server/aiLearningEngine.js ✓
- server/promptEngine.js ✓
- server/llmRouter.js ✓
- server/memory/learningMemory.js ✓
- server/providers/azureProvider.js ✓

# If files missing, restore from backup
# or recreate following project structure
```

---

## Development Workflow

### Local Development

```bash
# Terminal 1: Start backend server
cd server
npm start
# Output: Server running on port 3000

# Terminal 2: Start frontend server
python -m http.server 8000
# Output: Serving HTTP on port 8000

# Terminal 3: Monitor logs (optional)
tail -f server.log
```

### Testing Endpoints

```bash
# Use REST client or curl for testing
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is a for loop?",
    "sessionId": "dev_test",
    "setup": {"technology": "Python", "level": "Beginner"}
  }'
```

### Debug Mode

```bash
# Enable debug logging
cd server
DEBUG=tutoring:* npm start

# With more verbosity
DEBUG=* npm start
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] All environment variables set in production .env
- [ ] API keys are production keys (not development)
- [ ] Database configured (if adding persistence)
- [ ] HTTPS enabled
- [ ] CORS configured for allowed origins
- [ ] Rate limiting configured
- [ ] Error logging set up
- [ ] Backups scheduled

### Deploy to Production

#### Option 1: Traditional VPS/Server

```bash
# Connect to server
ssh user@your-server.com

# Clone repository
git clone <repo-url>
cd AI_tech_plateform

# Install dependencies
npm install
cd server && npm install && cd ..

# Configure environment
cd server
cat > .env << EOF
LLM_PROVIDER=google
GOOGLE_API_KEY=prod_key_here
PORT=3000
NODE_ENV=production
EOF

# Start with process manager (PM2)
npm install -g pm2
pm2 start server/server.js --name "ai-tutor"
pm2 save
```

#### Option 2: Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set GOOGLE_API_KEY=your_key_here
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

#### Option 3: Docker

```bash
# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
EOF

# Build image
docker build -t ai-tutor .

# Run container
docker run -e GOOGLE_API_KEY=your_key -p 3000:3000 ai-tutor
```

### Post-Deployment

```bash
# Verify production deployment
curl https://your-production-url.com/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test","sessionId":"prod_test","setup":{"technology":"Python"}}'

# Monitor logs
pm2 logs ai-tutor
# or
heroku logs --tail
# or
docker logs <container_id>
```

---

## Maintenance

### Regular Tasks

```bash
# Update dependencies
npm outdated
npm update

# Check for security vulnerabilities
npm audit
npm audit fix

# Clear cache
npm cache clean --force

# Backup data (if using database)
# Schedule daily backups
```

### Monitoring

```bash
# Monitor server uptime
pm2 status

# Check memory usage
pm2 monit

# View error logs
pm2 logs ai-tutor --err

# Performance monitoring
npm install -g clinic
clinic doctor -- npm start
```

---

## Additional Resources

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Google Gemini API Docs](https://ai.google.dev/)
- [Azure OpenAI Docs](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/)
- [npm Documentation](https://docs.npmjs.com/)

---

**Last Updated**: April 2026  
**Setup Guide Version**: 1.0

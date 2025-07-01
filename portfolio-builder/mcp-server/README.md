# 🤖 AI Server for Portfolio Builder - Complete Setup Guide

This is the AI server that powers your portfolio builder. It runs locally on your computer and provides intelligent content generation without any external API costs!

## 🎯 What This Does

- **Generates professional content** for all portfolio sections
- **Runs completely locally** - no internet needed after setup
- **Completely free** - no API costs or subscriptions
- **Privacy-focused** - all data stays on your computer
- **Multiple AI models** - choose what works best for you
- **Real-time processing** - instant content generation
- **Smart suggestions** - context-aware recommendations

## 🚀 Super Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
# Run this command in the mcp-server folder
npm install
```

### Step 2: Build the Server
```bash
# Compile TypeScript to JavaScript
npm run build
```

### Step 3: Start the Server
```bash
# Start the AI server
npm run start:http
```

**That's it!** The server will be running on `http://localhost:3001`

## 📋 Detailed Setup (For Beginners)

### What You Need
- **Node.js 18+**: Download from [nodejs.org](https://nodejs.org/) (choose "LTS" version)
- **At least 4GB RAM** on your computer
- **About 5GB free disk space** for AI models
- **Git**: For cloning the repository

### Step-by-Step Instructions

#### 1. Install Node.js
1. Go to [nodejs.org](https://nodejs.org/)
2. Click the big green "LTS" button to download
3. Run the installer and click "Next" through all steps
4. **Restart your computer** after installation

#### 2. Open Terminal/Command Prompt
- **Mac**: Press `Cmd + Space`, type "Terminal", press Enter
- **Windows**: Press `Win + R`, type "cmd", press Enter
- **Linux**: Press `Ctrl + Alt + T`

#### 3. Navigate to the AI Server Folder
```bash
# If you're in the main portfolio-builder folder:
cd mcp-server

# You should see files like package.json, src/, etc.
ls
```

#### 4. Install Dependencies
```bash
npm install
```
**Wait for this to finish** - you'll see a progress bar and lots of text.

#### 5. Build the Server
```bash
npm run build
```
This compiles the TypeScript code to JavaScript.

#### 6. Start the Server
```bash
npm run start:http
```

**You should see:**
```
MCP HTTP Server running on port 3001
Health check: http://localhost:3001/health
Generate content: http://localhost:3001/generate
Available models: http://localhost:3001/models
```

**Keep this terminal window open!** The server needs to keep running.

## 🎮 How to Use

### Starting the Server
```bash
# Production mode (recommended)
npm run start:http

# Development mode (auto-restarts when you make changes)
npm run dev
```

### Stopping the Server
- Press `Ctrl + C` in the terminal where the server is running
- Or close the terminal window

### Checking if Server is Working
```bash
# Test the server health
curl http://localhost:3001/health

# Should return something like:
# {"status":"ok","model":{"name":"llama2","provider":"ollama"}}

# Check available models
curl http://localhost:3001/models

# Should return available AI models
```

## 🤖 AI Models Explained

### 🦙 Ollama (Recommended)
- **What it is**: AI that runs on your computer
- **Cost**: Completely free
- **Speed**: Fast (no internet needed)
- **Privacy**: All data stays on your computer
- **Setup**: One-time download (about 4GB)
- **Best for**: Students, developers, privacy-conscious users

### 🎭 Mock Model
- **What it is**: Pre-written professional responses
- **Cost**: Free
- **Speed**: Instant
- **Setup**: No setup needed
- **Use case**: Testing, development, offline use
- **Best for**: Quick testing and development

### 🤖 OpenAI
- **What it is**: Cloud-based AI (like ChatGPT)
- **Cost**: ~$0.002 per 1,000 words
- **Speed**: Depends on internet connection
- **Setup**: Requires API key
- **Use case**: High-quality content generation
- **Best for**: Professional portfolios, high-quality content

## 🔧 Troubleshooting

### "Command not found: npm"
**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

### "Port 3001 is already in use"
**Solution**:
```bash
# Find what's using the port
lsof -i :3001

# Kill the process (replace XXXX with the number you see)
kill -9 XXXX

# Or use the stop script from the main directory
cd ..
./stop.sh
```

### "Ollama not available"
**Solution**:
1. Install Ollama: [ollama.ai](https://ollama.ai)
2. Start Ollama: `ollama serve`
3. Download model: `ollama pull llama2`
4. Verify installation: `ollama list`

### "Server won't start"
**Solution**:
1. Check if you're in the right folder: `ls` should show `package.json`
2. Try: `npm install` again
3. Check the error message and look it up online
4. Make sure you built the project: `npm run build`

### "AI generation not working"
**Solution**:
1. Make sure server is running: `curl http://localhost:3001/health`
2. Check the AI Model Status panel in your portfolio builder
3. Try switching to a different model
4. Restart the server: `Ctrl + C`, then `npm run start:http`
5. Check server logs for error messages

### "Build errors"
**Solution**:
1. Make sure TypeScript is installed: `npm install -g typescript`
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Check TypeScript version: `npx tsc --version`

## 📁 What Each File Does

```
mcp-server/
├── package.json          # Lists all the software needed
├── tsconfig.json         # TypeScript configuration
├── src/
│   ├── http-server.ts    # The main Express server file
│   ├── index.ts          # MCP server entry point
│   ├── server.ts         # Server configuration
│   ├── types.ts          # TypeScript type definitions
│   ├── models/           # Different AI model implementations
│   │   ├── ollama.ts     # Local AI model (Ollama)
│   │   ├── mock.ts       # Pre-written responses
│   │   └── openai.ts     # Cloud AI model (OpenAI)
│   └── prompts.ts        # Templates for AI requests
├── dist/                 # Compiled JavaScript files
└── README.md             # This file
```

## 🎯 Tips for Best Performance

### For Faster AI Responses
1. **Use Ollama**: It's faster than cloud APIs
2. **Close other apps**: Free up RAM for AI models
3. **Use smaller models**: `llama2:7b` is faster than `llama2`
4. **Optimize prompts**: Shorter, more specific prompts work better

### For Better AI Suggestions
1. **Be specific**: "React Developer" instead of "Developer"
2. **Include context**: Mention your experience level and industry
3. **Use keywords**: Include relevant technologies and frameworks
4. **Provide examples**: Give AI concrete examples to work with
5. **Iterate**: Use AI suggestions as a starting point, then customize

### For Server Performance
1. **Monitor memory usage**: Keep an eye on RAM usage
2. **Restart periodically**: Restart the server if it gets slow
3. **Use development mode**: `npm run dev` for auto-restart during development
4. **Check logs**: Monitor terminal output for errors

## 🆘 Getting Help

### Common Questions

**Q: Do I need to understand AI to use this?**
A: No! The server handles everything automatically. Just start it and it works.

**Q: What if the server fails to start?**
A: Check the troubleshooting section above, or try restarting your computer.

**Q: Can I use this without internet?**
A: Yes! Once set up, everything works offline (except OpenAI model).

**Q: Is this safe to use?**
A: Yes! All AI processing happens on your computer, no data is sent anywhere.

**Q: What if I get an error?**
A: Check the troubleshooting section above, or restart the server.

**Q: How do I update the AI models?**
A: For Ollama: `ollama pull llama2:latest`. For others, restart the server.

**Q: Can I use multiple AI models at once?**
A: Yes! The server can switch between models dynamically.

### Debug Mode
```bash
# Start server with detailed logs
DEBUG=* npm run dev

# Check server status
curl http://localhost:3001/health

# Test content generation
curl -X POST http://localhost:3001/generate \
  -H "Content-Type: application/json" \
  -d '{"section":"about","content":"John Doe, Software Developer"}'
```

### Check Server Status
```bash
# Test if server is working
curl http://localhost:3001/health

# Check available models
curl http://localhost:3001/models

# Test content generation
curl -X POST http://localhost:3001/generate \
  -H "Content-Type: application/json" \
  -d '{"section":"skills","content":"React, JavaScript"}'
```

## 🔄 API Endpoints

### Health Check
```
GET /health
```
Returns server status and current AI model.

### Available Models
```
GET /models
```
Returns list of available AI models.

### Generate Content
```
POST /generate
Content-Type: application/json

{
  "section": "about|experience|education|skills|awards|testimonials|contact",
  "content": "Your existing content",
  "model": "ollama|mock|openai" (optional)
}
```

### Example Request
```bash
curl -X POST http://localhost:3001/generate \
  -H "Content-Type: application/json" \
  -d '{
    "section": "skills",
    "content": "React, JavaScript, Node.js",
    "model": "ollama"
  }'
```

## 🎉 Success!

When everything is working, you should see:
- ✅ Server running on port 3001
- ✅ AI models available and responding
- ✅ Portfolio builder can connect to the server
- ✅ AI generation working in your portfolio builder
- ✅ Fast response times for content generation

**Your AI server is now ready to help create amazing portfolios!** 🚀

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

*This AI server is designed to be simple, reliable, and powerful. If you follow the steps above, it should work perfectly!* 
# 🎨 Portfolio Builder with AI - Complete Guide

A beautiful portfolio builder that uses local AI to generate professional content without any external API costs. Perfect for students, developers, and anyone who wants to create stunning portfolios!

## 🎯 What You'll Get

- **✨ Beautiful Portfolio Builder**: Create professional portfolios with a step-by-step wizard
- **🤖 Local AI Assistant**: Generate content using AI that runs on your computer (no API costs!)
- **🎨 Multiple Themes**: Choose from different visual styles
- **📱 Responsive Design**: Looks great on desktop, tablet, and mobile
- **💾 Export Options**: Download as HTML or JSON
- **🔒 Privacy First**: All AI processing happens locally on your machine

## 🚀 Quick Start (5 Minutes)

### Step 1: Download and Setup

```bash
# 1. Open Terminal/Command Prompt
# 2. Navigate to where you want to install the project
cd ~/Documents

# 3. Clone the project
git clone <your-repo-url>
cd portfolio-builder/portfolio-builder

# 4. Install dependencies
npm install
```

### Step 2: Setup AI Server (One-time setup)

```bash
# 1. Navigate to the AI server folder
cd mcp-server

# 2. Run the automated setup (this will take a few minutes)
./setup.sh

# 3. Start the AI server
npm run start:http
```

**Keep this terminal window open!** The AI server needs to keep running.

### Step 3: Start Portfolio Builder

```bash
# 1. Open a NEW terminal window
# 2. Navigate back to the main project
cd ~/Documents/portfolio-builder/portfolio-builder

# 3. Start the portfolio builder
npm run dev
```

### Step 4: Use Your Portfolio Builder

1. **Open your browser** and go to: `http://localhost:3001`
2. **Click "Create My Portfolio"**
3. **Fill in each section** with your information
4. **Use AI to generate content** by clicking "Generate with AI" buttons
5. **Preview your portfolio** in real-time
6. **Download your portfolio** when finished

## 🛠️ Detailed Installation Guide

### Prerequisites

- **Node.js 18+**: [Download here](https://nodejs.org/)
- **Git**: [Download here](https://git-scm.com/)
- **At least 4GB RAM** (for AI models)

### Step-by-Step Installation

#### 1. Install Node.js
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the "LTS" version
3. Run the installer and follow the instructions
4. Verify installation: Open terminal and type `node --version`

#### 2. Install Git
1. Go to [git-scm.com](https://git-scm.com/)
2. Download for your operating system
3. Run the installer with default settings
4. Verify installation: Open terminal and type `git --version`

#### 3. Download the Project
```bash
# Open Terminal (Mac/Linux) or Command Prompt (Windows)
# Navigate to your Documents folder
cd ~/Documents

# Download the project
git clone <your-repo-url>
cd portfolio-builder/portfolio-builder
```

#### 4. Install Dependencies
```bash
# Install all required packages
npm install
```

#### 5. Setup AI Server
```bash
# Navigate to AI server folder
cd mcp-server

# Run automated setup
./setup.sh

# This will:
# - Install AI dependencies
# - Download AI models (this may take 10-15 minutes)
# - Create configuration files
# - Test the setup
```

#### 6. Configure Environment
```bash
# Go back to main project folder
cd ..

# Create environment file
echo "NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:3002" > .env.local
```

## 🚀 Running the Application

### Option 1: Quick Start (Recommended)

**Terminal 1 - AI Server:**
```bash
cd mcp-server
npm run start:http
```
You should see: `MCP HTTP Server running on port 3002`

**Terminal 2 - Portfolio Builder:**
```bash
npm run dev
```
You should see: `Local: http://localhost:3001`

### Option 2: Development Mode

**Terminal 1 - AI Server (with auto-restart):**
```bash
cd mcp-server
npm run dev
```

**Terminal 2 - Portfolio Builder (with auto-restart):**
```bash
npm run dev
```

## 🎨 Using the Portfolio Builder

### 1. Create Your Portfolio

1. **Open**: `http://localhost:3001`
2. **Click**: "Create My Portfolio"
3. **Follow the steps**:
   - **About**: Your name, role, and bio
   - **Experience**: Work history and achievements
   - **Education**: Academic background
   - **Skills**: Technical abilities and proficiency levels
   - **Awards**: Recognition and achievements
   - **Testimonials**: Client or colleague feedback
   - **Contact**: How people can reach you

### 2. Using AI Features

#### AI Model Status Panel
- Look for the "AI Model Status" panel on the right side
- Shows which AI models are available:
  - 🦙 **Ollama** (Recommended): Free, runs on your computer
  - 🎭 **Mock**: Always available, predefined responses
  - 🤖 **OpenAI**: Requires API key (paid)

#### Generate Content with AI
1. **Fill in basic information** in any section
2. **Click "Generate with AI"** button
3. **Review the suggestions** provided by AI
4. **Save the content** you like
5. **Edit and customize** as needed

#### Example: Skills Section
1. Enter your current skills: "React (Expert), Python (Intermediate)"
2. Click "Generate with AI"
3. AI suggests additional skills: "TypeScript, Node.js, Docker, AWS"
4. Select the skills you want to add
5. Choose proficiency levels for each

### 3. Customize Your Portfolio

#### Themes
- **Light Theme**: Clean, professional look
- **Dark Theme**: Modern, sleek appearance
- **Custom Colors**: Adjust to match your brand

#### Layout Options
- **Single Page**: Everything on one page
- **Multi-Page**: Separate pages for each section

#### Export Options
- **HTML**: Complete website file
- **JSON**: Data backup
- **PDF**: Print-friendly version

## 🤖 AI Models Explained

### 🦙 Ollama (Recommended for Students)
- **Cost**: Completely free
- **Setup**: One-time installation
- **Speed**: Fast (runs on your computer)
- **Privacy**: All data stays on your machine
- **Quality**: Good for most use cases

### 🎭 Mock Model
- **Cost**: Free
- **Setup**: No setup required
- **Speed**: Instant
- **Quality**: Predefined professional responses
- **Use Case**: Testing and development

### 🤖 OpenAI
- **Cost**: ~$0.002 per 1,000 words
- **Setup**: Requires API key
- **Speed**: Depends on internet
- **Quality**: High quality
- **Use Case**: Production use

## 🔧 Troubleshooting

### Common Issues

#### "Port already in use"
```bash
# Check what's using the port
lsof -i :3001
lsof -i :3002

# Kill the process if needed
kill -9 <PID>
```

#### "MCP server not available"
1. Make sure AI server is running in Terminal 1
2. Check the URL in `.env.local`: `NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:3002`
3. Restart the portfolio builder: `npm run dev`

#### "Ollama not available"
1. Install Ollama: [ollama.ai](https://ollama.ai)
2. Start Ollama: `ollama serve`
3. Download model: `ollama pull llama2`

#### "AI generation not working"
1. Check the AI Model Status panel
2. Try switching to a different model
3. Check browser console for errors
4. Restart both servers

### Getting Help

#### Debug Mode
```bash
# AI Server with detailed logs
cd mcp-server
DEBUG=* npm run dev

# Portfolio Builder with detailed logs
DEBUG=* npm run dev
```

#### Check Server Status
```bash
# Test AI server
curl http://localhost:3002/health

# Should return: {"status":"ok","model":{...}}
```

## 📁 Project Structure

```
portfolio-builder/
├── app/                          # Portfolio builder application
│   ├── components/builder/       # UI components
│   ├── utils/ai.ts              # AI integration
│   └── ...
├── mcp-server/                   # AI server
│   ├── src/
│   │   ├── models/              # AI model implementations
│   │   └── http-server.ts       # API server
│   └── ...
└── README.md                     # This file
```

## 🎯 Tips for Best Results

### For Better AI Suggestions
1. **Be specific**: Instead of "developer", write "Full Stack React Developer"
2. **Include context**: Mention your experience level and industry
3. **Use keywords**: Include relevant technologies and skills
4. **Provide examples**: Give AI something to work with

### For Better Portfolio
1. **Start with basics**: Fill in name, role, and basic info first
2. **Use AI for enhancement**: Let AI suggest improvements
3. **Customize everything**: Edit AI suggestions to match your voice
4. **Add real examples**: Include actual projects and achievements
5. **Keep it updated**: Regularly update your portfolio

## 🆘 Need Help?

### Common Questions

**Q: Do I need to pay for anything?**
A: No! The entire system runs locally and is completely free.

**Q: What if I don't have technical skills?**
A: The setup script automates everything. Just follow the steps!

**Q: Can I use this offline?**
A: Yes! Once set up, everything works without internet.

**Q: Is my data private?**
A: Yes! All AI processing happens on your computer.

**Q: What if something doesn't work?**
A: Check the troubleshooting section above, or restart both servers.

### Getting Support

1. **Check this README** first
2. **Look at the troubleshooting section**
3. **Check the console** for error messages
4. **Restart both servers** if needed

## 🎉 Success!

You now have a complete portfolio builder with local AI that:
- ✅ Works without any external costs
- ✅ Respects your privacy
- ✅ Provides professional AI suggestions
- ✅ Is perfect for students and developers
- ✅ Can be used offline

**Happy portfolio building!** 🚀

---

*Made with ❤️ for students and developers who want to create amazing portfolios without breaking the bank!*

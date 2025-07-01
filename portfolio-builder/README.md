# 🎨 Portfolio Builder with AI - Complete Guide

A beautiful, modern portfolio builder that uses local AI to generate professional content without any external API costs. Perfect for students, developers, designers, and anyone who wants to create stunning portfolios with AI assistance!

## ✨ Features

- **🎯 Step-by-Step Builder**: Guided wizard interface for easy portfolio creation
- **🤖 Local AI Assistant**: Generate content using AI that runs on your computer (no API costs!)
- **🎨 Multiple Themes**: Choose from beautiful light and dark themes
- **📱 Responsive Design**: Looks perfect on desktop, tablet, and mobile
- **💾 Export Options**: Download as HTML, JSON, or PDF
- **🔒 Privacy First**: All AI processing happens locally on your machine
- **⚡ Real-time Preview**: See changes instantly as you build
- **🎭 Multiple AI Models**: Ollama (local), Mock (instant), OpenAI (cloud)

## 🚀 Quick Start (2 Minutes!)

### Prerequisites

- **Node.js 18+**: [Download here](https://nodejs.org/)
- **Git**: [Download here](https://git-scm.com/)
- **At least 4GB RAM** (for AI models)
- **5GB free disk space** (for AI model downloads)

### One-Command Setup & Run

#### On Mac/Linux:
```bash
# 1. Clone the project
git clone <your-repo-url>
cd portfolio-builder

# 2. Run everything with one command!
./start.sh
```

#### On Windows:
```cmd
# 1. Clone the project
git clone <your-repo-url>
cd portfolio-builder

# 2. Run everything with one command!
start.bat
```

That's it! The script will:
- ✅ Install all dependencies automatically
- ✅ Configure ports and environment
- ✅ Start the AI server on port 3001
- ✅ Start the portfolio builder on port 3000
- ✅ Open your browser to `http://localhost:3000`

### Stop the Application

#### On Mac/Linux:
```bash
# To stop all servers and free ports
./stop.sh
```

#### On Windows:
```cmd
# To stop all servers and free ports
stop.bat
```

## 🎨 Using Your Portfolio Builder

1. **Open your browser** and go to: `http://localhost:3000`
2. **Click "Create My Portfolio"** to start building
3. **Fill in each section** with your information:
   - **About**: Your name, role, bio, and profile picture
   - **Experience**: Work history, achievements, and responsibilities
   - **Education**: Academic background, degrees, and certifications
   - **Skills**: Technical abilities with proficiency levels
   - **Awards**: Recognition, achievements, and honors
   - **Testimonials**: Client or colleague feedback
   - **Contact**: How people can reach you
4. **Use AI to generate content** by clicking "Generate with AI" buttons
5. **Preview your portfolio** in real-time
6. **Customize themes** and styling
7. **Download your portfolio** when finished

## 🛠️ Manual Setup (Advanced)

If you prefer to run servers manually:

### Start AI Server
```bash
cd mcp-server
npm install
npm run build
npm run start:http
```

### Start Portfolio Builder (in new terminal)
```bash
npm install
npm run dev
```

## 🔧 Troubleshooting

### "Permission denied: ./start.sh"
```bash
chmod +x start.sh
./start.sh
```

### "Port already in use"
The start script automatically handles this, but if you need to manually free ports:
```bash
./stop.sh
```

### "AI server not available"
1. Make sure you ran `./start.sh` (not manual commands)
2. Check that both servers are running:
   - Portfolio Builder: `http://localhost:3000`
   - AI Server: `http://localhost:3001`
3. Restart with `./stop.sh && ./start.sh`

### "Ollama not available"
1. Install Ollama: [ollama.ai](https://ollama.ai)
2. Start Ollama: `ollama serve`
3. Download model: `ollama pull llama2`

## ✅ Success Checklist

When everything is working, you should have:

- ✅ **Portfolio Builder**: Running at `http://localhost:3000`
- ✅ **AI Server**: Running at `http://localhost:3001`
- ✅ **AI Features**: "Generate with AI" buttons working
- ✅ **Theme Selection**: Light/dark theme switching
- ✅ **Real-time Preview**: Changes visible immediately
- ✅ **Clean Shutdown**: `./stop.sh` frees all ports

## 🎨 Portfolio Sections

### About Section
- **Name & Title**: Your full name and professional title
- **Bio**: Professional summary and personal story
- **Profile Picture**: Upload or use AI-generated avatar
- **Social Links**: LinkedIn, GitHub, Twitter, etc.

### Experience Section
- **Job History**: Company, role, dates, and achievements
- **Responsibilities**: Key duties and accomplishments
- **Technologies Used**: Tools and technologies for each role
- **AI Enhancement**: Generate detailed job descriptions

### Education Section
- **Academic Background**: Degrees, institutions, and dates
- **Certifications**: Professional certifications and courses
- **Achievements**: Academic honors and awards
- **Relevant Coursework**: Key subjects and projects

### Skills Section
- **Technical Skills**: Programming languages, frameworks, tools
- **Proficiency Levels**: Beginner, Intermediate, Expert
- **Categories**: Frontend, Backend, DevOps, Design, etc.
- **AI Suggestions**: Get skill recommendations based on your experience

### Awards Section
- **Recognition**: Professional awards and honors
- **Achievements**: Competition wins and milestones
- **Certifications**: Industry-recognized credentials
- **Publications**: Papers, articles, and contributions

### Testimonials Section
- **Client Feedback**: Professional recommendations
- **Colleague Reviews**: Team member testimonials
- **Project Reviews**: Success story testimonials
- **AI Generation**: Create professional testimonials

### Contact Section
- **Contact Information**: Email, phone, location
- **Social Media**: Professional social profiles
- **Availability**: Work status and response time
- **Contact Form**: Direct messaging capability

## 🤖 AI Models Explained

### 🦙 Ollama (Recommended)
- **Cost**: Completely free
- **Setup**: One-time installation (~4GB download)
- **Speed**: Fast (runs on your computer)
- **Privacy**: All data stays on your machine
- **Quality**: Good for most use cases
- **Best for**: Students, developers, privacy-conscious users

### 🎭 Mock Model
- **Cost**: Free
- **Setup**: No setup required
- **Speed**: Instant
- **Quality**: Predefined professional responses
- **Use Case**: Testing, development, offline use
- **Best for**: Quick testing and development

### 🤖 OpenAI
- **Cost**: ~$0.002 per 1,000 words
- **Setup**: Requires API key
- **Speed**: Depends on internet connection
- **Quality**: High quality, advanced responses
- **Use Case**: Production use, high-quality content
- **Best for**: Professional portfolios, high-quality content

## 📁 Project Structure

```
portfolio-builder/
├── app/                          # Next.js application
│   ├── api/                      # API routes
│   ├── builder/                  # Portfolio builder pages
│   ├── components/               # React components
│   │   ├── builder/             # Builder-specific components
│   │   │   ├── sections/        # Portfolio section components
│   │   │   ├── AIModelStatus.tsx # AI model status panel
│   │   │   ├── BuilderForm.tsx  # Main builder form
│   │   │   ├── PortfolioPreview.tsx # Real-time preview
│   │   │   ├── StepTracker.tsx  # Progress indicator
│   │   │   └── ThemeSelector.tsx # Theme switching
│   │   └── ui/                  # Reusable UI components
│   ├── store/                   # State management (Zustand)
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
├── mcp-server/                   # AI server
│   ├── src/
│   │   ├── models/              # AI model implementations
│   │   ├── http-server.ts       # Express API server
│   │   └── prompts.ts           # AI prompt templates
│   └── package.json             # AI server dependencies
├── start.sh                      # One-command startup script
├── stop.sh                       # Clean shutdown script
└── package.json                  # Main application dependencies
```

## 🎯 Tips for Best Results

### For Better AI Suggestions
1. **Be specific**: Instead of "developer", write "Full Stack React Developer with 3 years experience"
2. **Include context**: Mention your experience level, industry, and goals
3. **Use keywords**: Include relevant technologies, frameworks, and tools
4. **Provide examples**: Give AI concrete examples to work with
5. **Iterate**: Use AI suggestions as a starting point, then customize

### For Better Portfolio
1. **Start with basics**: Fill in name, role, and basic info first
2. **Use AI for enhancement**: Let AI suggest improvements and additions
3. **Customize everything**: Edit AI suggestions to match your voice and style
4. **Add real examples**: Include actual projects, achievements, and metrics
5. **Keep it updated**: Regularly update your portfolio with new experiences
6. **Test different themes**: Try both light and dark themes for different contexts

### For Better Performance
1. **Use Ollama**: It's faster and more private than cloud APIs
2. **Close other apps**: Free up RAM for AI models
3. **Use smaller models**: `llama2:7b` is faster than larger models
4. **Batch AI requests**: Generate content for multiple sections at once

## 🆘 Need Help?

### Common Questions

**Q: Do I need to be a programmer?**
A: No! Just run `./start.sh` and you're ready to go. The interface is designed for everyone.

**Q: What if something doesn't work?**
A: Run `./stop.sh` then `./start.sh` again. This fixes most issues.

**Q: Can I use this offline?**
A: Yes! Once set up, everything works without internet (except OpenAI model).

**Q: Is this safe?**
A: Yes! All AI processing happens on your computer. No data is sent to external servers.

**Q: How do I stop the application?**
A: Press `Ctrl+C` in the terminal or run `./stop.sh`

**Q: Can I customize the themes?**
A: Yes! The portfolio builder includes multiple themes and you can further customize the styling.

**Q: What file formats can I export?**
A: HTML (complete website), JSON (data backup), and PDF (print-friendly).

### Getting Help

1. **Check the troubleshooting section** above
2. **Restart the application**: `./stop.sh && ./start.sh`
3. **Check server status**: Visit `http://localhost:3001/health` for AI server
4. **Review the logs**: Check terminal output for error messages

## 🎯 Next Steps

1. **Create your portfolio** using the step-by-step wizard
2. **Customize themes** to match your personal brand
3. **Generate AI content** for each section
4. **Add your real projects** and achievements
5. **Export your portfolio** as HTML or JSON
6. **Deploy online** or share locally
7. **Keep it updated** with new experiences

## 🎉 Success!

You now have a complete portfolio builder with local AI that:
- ✅ Works without any external costs
- ✅ Respects your privacy completely
- ✅ Provides professional AI suggestions
- ✅ Is perfect for students and developers
- ✅ Can be used offline
- ✅ Exports to multiple formats
- ✅ Has beautiful, responsive design

**Happy portfolio building!** 🚀

---

*Made with ❤️ for students and developers who want to create amazing portfolios without breaking the bank!*

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

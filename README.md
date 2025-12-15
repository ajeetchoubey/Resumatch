# Resumatch 🎯

An **AI-powered Resume Optimizer** that tailors resumes to specific job descriptions using semantic analysis and LLMs.

## Features

- 📄 **Smart Resume Parsing** - Upload PDF/DOCX and extract structured data
- 🔍 **Job Description Analysis** - Extract key requirements and skills
- 🧠 **AI-Powered Optimization** - Get intelligent suggestions via Google Gemini
- ✏️ **Interactive Editor** - Accept/reject suggestions in real-time
- 📊 **Match Scoring** - See how well your resume matches the JD
- 📥 **Export** - Download optimized resume as PDF

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, TailwindCSS |
| Backend | Node.js, Express |
| Database | Supabase (PostgreSQL + pgvector) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| AI | Google Gemini API |

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase Account
- Google AI Studio API Key

### Installation

```bash
# Clone the repo
git clone https://github.com/ajeetchoubey/Resumatch.git
cd Resumatch

# Install dependencies
cd frontend && npm install
cd ../backend && npm install
```

### Environment Variables

Create `.env` files in both `frontend/` and `backend/` directories:

```env
# Supabase
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key

# Gemini
GEMINI_API_KEY=your_api_key
```

## License

MIT

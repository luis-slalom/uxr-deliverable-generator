# UXR Deliverable Generator

An intelligent full-stack application that helps UX researchers and designers create comprehensive user experience deliverables from research documents using AI-powered analysis.

## Overview

This tool streamlines the creation of key UX research artifacts by transforming uploaded research files and contextual information into professional, actionable deliverables. Built with a distinctive retro terminal aesthetic, it combines modern web technologies with a nostalgic computing interface.

## What It Creates

### User Journey Maps
Visualize the end-to-end experience of users as they interact with your product or service, highlighting touchpoints, emotions, pain points, and opportunities.

### Service Blueprints
Map out the complete service delivery process, including frontstage customer actions, backstage employee actions, and supporting systems and processes.

### User Personas
Generate detailed, research-backed personas that represent your key user segments, including demographics, goals, motivations, pain points, and behaviors.

## How It Works

Simply provide context about your users, research findings, or product requirements, and the application will generate structured, professional UX deliverables ready for stakeholder presentations and design decision-making.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uxr-deliverable-generator
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   Backend (`backend/.env`):
   ```env
   PORT=3001
   ANTHROPIC_API_KEY=your_api_key_here
   DATABASE_PATH=./database/uxr.db
   UPLOAD_DIR=./uploads
   FRONTEND_URL=http://localhost:5173
   ```

   Frontend (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:3001
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The API will be running at `http://localhost:3001`

2. **Start the frontend (in a new terminal)**
   ```bash
   cd frontend
   npm run dev
   ```
   The app will be running at `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173` to use the application

## Usage

1. **Upload Research Files** - Upload PDF, Word, CSV, Excel, or text files containing your research data
2. **Add Context** - Provide additional context or specific parameters for analysis
3. **Select Deliverable Type** - Choose between User Persona, Journey Map, or Service Blueprint
4. **Generate** - Click the generate button to create your deliverable
5. **View & Save** - Review the generated deliverable and it's automatically saved to your project archive

## Features

✨ **Multi-Format File Support**
- PDF documents
- Word documents (.docx, .doc)
- Excel spreadsheets (.xlsx, .xls)
- CSV files
- Text files (.txt, .md)

🤖 **AI-Powered Generation**
- Powered by Anthropic's Claude 3.5 Sonnet
- Context-aware deliverable creation
- Professional, structured output

💾 **Project Management**
- Save and organize generated deliverables
- SQLite database for persistent storage
- View project history and archive
- Delete unwanted projects

🎨 **Retro Terminal Aesthetic**
- Distinctive green-on-black terminal interface
- VT323 monospace font
- Nostalgic computing experience with modern functionality

## Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7.3.1 (fast, modern development experience)
- **Styling**: CSS Modules (scoped, maintainable styles)
- **State Management**: React Context API with useReducer
- **HTTP Client**: Axios for API communication
- **File Upload**: react-dropzone for drag-and-drop functionality
- **Module System**: ES Modules (ESNext)

### Backend
- **Runtime**: Node.js with Express + TypeScript
- **Database**: SQLite with better-sqlite3 (file-based, zero configuration)
- **AI Integration**: Anthropic Claude API (@anthropic-ai/sdk)
  - Model: claude-3-5-sonnet-20241022
  - Max tokens: 4096
- **File Upload**: Multer middleware
- **File Processing**:
  - PDF: `pdf-parse` library
  - Word: `mammoth` library (extractRawText)
  - Spreadsheets: `xlsx` library (CSV/Excel)
  - Text: Native Node.js fs module
- **Module System**: ES Modules (ESNext)
- **Development**: tsx for TypeScript execution with hot reload
- **CORS**: Configured for frontend-backend communication
- **Environment**: dotenv for configuration management

## API Endpoints

### Projects
- `GET /api/projects` - List all projects with count
- `GET /api/projects/:id` - Get specific project details
- `GET /api/projects/:id/deliverables` - Get project deliverables
- `PUT /api/projects/:id` - Update project name
- `DELETE /api/projects/:id` - Delete project and associated deliverables

### File Upload & Generation
- `POST /api/upload` - Upload and parse research files
- `POST /api/generate` - Generate deliverable from uploaded files

### Health Check
- `GET /health` - Server health status

## Project Structure

```
uxr-deliverable-generator/
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Header/
│   │   │   ├── FileUpload/
│   │   │   ├── PromptInput/
│   │   │   ├── OutputTypeSelector/
│   │   │   ├── GenerateButton/
│   │   │   ├── ProjectArchive/
│   │   │   ├── DeliverableViewer/
│   │   │   └── Footer/
│   │   ├── context/          # React Context for state management
│   │   ├── services/         # API service layer
│   │   ├── styles/           # Global styles and CSS variables
│   │   └── types/            # TypeScript type definitions
│   ├── .env                  # Environment configuration
│   └── package.json
├── backend/                   # Express API server
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── routes/           # API route handlers
│   │   ├── services/         # Business logic services
│   │   │   ├── claude.service.ts      # AI integration
│   │   │   ├── database.service.ts    # Database operations
│   │   │   └── fileParser.service.ts  # File parsing
│   │   ├── middleware/       # Express middleware
│   │   └── utils/            # Utility functions & prompts
│   ├── database/             # SQLite database (gitignored)
│   ├── uploads/              # Uploaded files (gitignored)
│   ├── .env                  # Environment configuration
│   └── package.json
└── README.md
```

## Database Schema

```sql
-- Projects table
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  deliverable_type TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Deliverables table
CREATE TABLE deliverables (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  content TEXT NOT NULL,
  context_used TEXT,
  file_names TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

## Development Notes

### ES Modules
This project uses ES Modules (ESNext) throughout:
- All imports use `.js` extensions (TypeScript convention)
- Type-only imports use the `type` keyword
- CommonJS modules (pdf-parse, mammoth) are imported using `createRequire`

### File Size Limits
- Default max file size: 10MB (configurable via `MAX_FILE_SIZE` env var)
- Supported MIME types validated by multer middleware

### Hot Module Replacement
- Frontend: Vite provides instant HMR for fast development
- Backend: tsx with watch mode for automatic TypeScript reloading

## Troubleshooting

### Module Import Errors
If you encounter errors like "does not provide an export named":
- Ensure all type imports use the `type` keyword: `import type { ... }`
- Verify imports use `.js` extensions: `from './module.js'`
- Clear node_modules and reinstall if issues persist

### Backend Not Starting
- Verify `.env` file exists with `ANTHROPIC_API_KEY`
- Check port 3001 is not in use: `lsof -ti:3001`
- Ensure all dependencies are installed: `npm install`

### Frontend Build Errors
- Clear Vite cache: `rm -rf node_modules/.vite`
- Verify environment variables in `.env`
- Check that backend is running on the configured API URL

### Database Issues
- Database is auto-created on first backend startup
- Located at `backend/database/uxr.db`
- Delete and restart backend to reset database

## Deployment

This application can be deployed with the frontend on Vercel and the backend on Railway, Render, or Fly.io.

### Quick Deploy Guide

**Frontend (Vercel)**
1. Push your code to GitHub
2. Import repository at [vercel.com/new](https://vercel.com/new)
3. Add environment variable: `VITE_API_URL=your-backend-url`
4. Deploy

**Backend (Railway - Recommended)**
1. Create new project at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Add environment variables (see below)
5. Add persistent volumes:
   - Mount point: `/app/backend/database` (for SQLite)
   - Mount point: `/app/backend/uploads` (for file storage)
6. Deploy and copy the generated URL

**Required Backend Environment Variables:**
```env
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
FRONTEND_URL=https://your-vercel-app.vercel.app
DATABASE_PATH=./database/uxr.db
UPLOAD_DIR=./uploads
```

**📚 For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

---

Built with ❤️ for UX Researchers and Designers
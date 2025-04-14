# ChartEye Tech Stack & Structure Template

## Frontend Framework & Core Technologies
- **Next.js 15.2.4** (React Framework)
- **React 18.2.0**
- **TypeScript**
- **TailwindCSS** for styling
- **Framer Motion** for animations

## UI Components & Libraries
- **Headless UI** (@headlessui/react) for accessible UI components
- **Hero Icons** (@heroicons/react) for icons
- **Lucide React** for additional icons
- **React Hot Toast** for notifications
- **React Syntax Highlighter** for code display

## Backend & Database
- **Firebase** ecosystem:
  - Firebase Authentication
  - Firestore Database
  - Firebase Storage
  - Firebase Admin SDK
- **Next.js API Routes** for backend functionality

## AI & Language Processing
- **LangChain** ecosystem:
  - @langchain/community
  - @langchain/core
  - @langchain/openai
  - @langchain/textsplitters
- **OpenAI** integration

## Payment Processing
- **Square** API integration

## Development Tools & Configuration
- **ESLint** for code linting
- **PostCSS** for CSS processing
- **TypeScript** for type safety
- **Firebase Tools** for deployment

## Project Structure
```
charteye/
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # Reusable React components
│   ├── contexts/      # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── lib/          # Utility functions and configurations
│   └── types/        # TypeScript type definitions
├── public/           # Static assets
├── scripts/          # Utility scripts
└── news-data/        # Data storage
```

## Key Features
1. Authentication system using Firebase Auth
2. Database operations with Firestore
3. File storage with Firebase Storage
4. AI-powered features using LangChain and OpenAI
5. Payment processing with Square
6. News scraping functionality (Python-based)
7. Responsive UI with TailwindCSS
8. Type-safe development with TypeScript

## Development Workflow
- Development server: `npm run dev`
- Production build: `npm run build`
- Production start: `npm run start`
- Linting: `npm run lint`

## Deployment
- Vercel deployment configuration
- Firebase deployment setup
- Environment variables management
- Deployment scripts and documentation

## Usage Instructions
This template represents a modern, full-stack web application with:
- Server-side rendering capabilities
- Real-time database functionality
- AI integration
- Payment processing
- Authentication
- Type safety
- Modern UI/UX practices

You can use this template to instruct other AI agents to build similar applications by following this structure and incorporating these technologies. The combination provides a robust foundation for building scalable web applications with modern features and best practices. 
# Italian Recipe Suggestions

AI-powered Italian recipe suggestion application with ingredient-based recipe generation and variations.

## Project Overview

This project consists of an AI agent that generates Italian recipes based on user-provided ingredients and suggests recipe variations. The application is built using VoltAgent for AI capabilities and will be extended with a Next.js frontend.

## Architecture

- **AI Agent**: VoltAgent-powered recipe generation (located in `/agent`)
- **Frontend**: Next.js 14 with React 18 (planned)
- **Backend**: Next.js API Routes (planned)
- **Database**: Supabase PostgreSQL (planned)
- **Authentication**: Supabase Auth (planned)
- **Deployment**: Vercel (planned)

## Current Implementation Status

### ✅ Completed
- VoltAgent AI agent setup
- Project structure and documentation
- Development environment configuration

### 🚧 In Progress
- Recipe generation tools and workflows

### 📋 Planned
- Next.js frontend application
- Supabase database integration
- User authentication
- Recipe management features
- Deployment to Vercel

## Quick Start

### Prerequisites

- Node.js 20+
- npm
- OpenAI API Key

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Italian-recipe-suggestions
   ```

2. Install dependencies:
   ```bash
   cd agent
   npm install
   ```

3. Configure environment variables:
   ```bash
   cd agent
   cp .env.example .env
   # Edit .env with your OpenAI API key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
Italian-recipe-suggestions/
├── README.md                   # This file
├── PROMPT_TEMPLATE.md          # Project specifications and design
├── .gitignore                  # Git ignore rules
├── agent/                      # VoltAgent AI implementation
│   ├── src/
│   │   ├── index.ts           # Main entry point
│   │   ├── tools/             # Custom tools
│   │   └── workflows/         # Workflow definitions
│   ├── package.json           # Dependencies and scripts
│   ├── tsconfig.json          # TypeScript configuration
│   └── README.md              # Agent-specific documentation
└── .serena/                   # Serena project configuration
    └── project.yml            # Project settings
```

## Development Commands

### Agent Development
```bash
cd agent

# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix
```

## Tech Stack

### Current Implementation
- **VoltAgent**: AI agent framework
- **TypeScript**: Type-safe JavaScript
- **OpenAI GPT-4o-mini**: Language model
- **Biome**: Linting and formatting
- **Zod**: Schema validation

### Planned Additions
- **Next.js 14**: React framework with App Router
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: State management
- **React Hook Form + Zod**: Form handling
- **Supabase**: Database, authentication, and storage
- **Vercel**: Deployment platform

## Features

### Core Features (Planned)
- 🍝 Italian recipe generation based on ingredients
- 🔄 Recipe variations and alternatives
- 👤 User authentication and profiles
- ❤️ Favorite recipes management
- 📱 Responsive web interface
- 🔍 Recipe search and filtering

### AI Agent Features (Current)
- Ingredient-based recipe generation
- Recipe variation suggestions
- Cooking tips and instructions
- Difficulty level assessment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions and support, please open an issue in the GitHub repository.
# Italian-recipe-suggestions

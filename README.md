# News Intelligence Hub

A futuristic, AI-powered news exploration platform built with Next.js 14, TypeScript, and Framer Motion.

## Features

- **Futuristic Glass-morphism Design**: Modern UI with glass effects and neon accents
- **AI-Powered Search**: Intelligent news search with real-time results
- **Live Webhook Feed**: Real-time updates from content management systems
- **Smart Filtering**: Date range and tag-based filtering system
- **Responsive Design**: Optimized for all screen sizes
- **Dark/Light Mode**: Theme toggle with smooth transitions
- **Smooth Animations**: Framer Motion powered interactions

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom glass-morphism utilities
- **Animations**: Framer Motion
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

1. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Open your browser** and navigate to `http://localhost:3000`

## API Integration

The app is designed to integrate with a Node.js/Express + MongoDB backend with these endpoints:

- `GET /search?query=<string>` - Returns JSON array of news entries
- `POST /webhook` - Receives Contentstack webhook events
- `GET /webhook-feed` - Returns recent webhook events (optional)

## Project Structure

\`\`\`
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main page combining hero and dashboard
│   └── globals.css         # Global styles with custom utilities
├── components/
│   ├── hero.tsx            # Landing hero section
│   ├── dashboard.tsx       # Main dashboard layout
│   ├── sidebar.tsx         # Collapsible filters sidebar
│   ├── search-bar.tsx      # Animated search interface
│   ├── result-card.tsx     # News article cards
│   ├── live-feed.tsx       # Real-time webhook feed
│   ├── detail-drawer.tsx   # Article detail modal
│   └── theme-toggle.tsx    # Dark/light mode toggle
└── lib/
    └── api.ts              # API utilities and mock data
\`\`\`

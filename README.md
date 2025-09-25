# ContentStack News Intelligence UI


Elegant Next.js 14 + Tailwind frontend for the Techsurf 2025 Build & Pitch Challenge.
This web app lets users search, browse, and monitor real-time news updates with a beautiful dark-mode interface.

![App Screenshot](https://i.ibb.co/vvhqcXjq/Screenshot-from-2025-09-25-13-37-42.png)
## Related Repositories

- [Backend API](https://github.com/AakashShah07/Content_Stack_Backend)
    :  Express + MongoDB service providing vector-search & Contentstack webhooks.

- [News Updater](https://github.com/AakashShah07/News-Updates) : Scheduled service that fetches & pushes topic/country news to the backend.

## Features
* Semantic Search – Query the news database with natural language and get AI-powered results.

* Live Webhook Feed – Real-time sidebar showing incoming Contentstack updates.

* Dark / Light Themes – Automatic theme switching using next-themes.

* Quick Filters – One-click category chips for Bitcoin, AI, Climate, Healthcare, etc.

* Smooth Animations – Framer Motion & Radix UI for delightful interactions.


## Tech Stack

* Framework	Next.js 14(App Router)
* Language	TypeScript
* Styling	Tailwind CSS v4 + tailwind-merge + tailwindcss-animate
* UI Components	Radix UI + shadcn/ui patterns
* State/Forms	React Hook Form + Zod validation
* Charts	Recharts
* Animations	Framer Motion
* Theming	next-themes
* Deployment	Vercel (recommended)

## Project Structure


```bash
contentStackUI/
├── app/                 # Next.js App Router pages & layouts
├── components/          # Reusable UI + feature components
│   ├── dashboard.tsx
│   ├── detail-drawer.tsx
│   ├── hero.tsx
│   ├── live-feed.tsx
│   ├── result-card.tsx
│   ├── search-bar.tsx
│   ├── sidebar.tsx
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   └── ui/              # shadcn/ui primitives
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions (API clients, helpers)
├── public/              # Static assets (add screenshot as preview.png)
├── styles/              # Global Tailwind styles
└── next.config.mjs      # Next.js configuration


```

### Environment Variables

```bash
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com


```

## Local Setup

```bash
# 1. Clone repository
git clone https://github.com/AakashShah07/Content_stack_UI.git
cd Content_stack_UI

# 2. Install dependencies (pnpm recommended)
npm install   

# 3. Run development server
npm dev        # runs on http://localhost:4000


```

### Production Build

```bash
npm run build

```
## Scheduled Tasks

fetchTopicAndCountryNews runs every 30 minutes to keep the dataset fresh by calling:

 * https://news-updates-sooty.vercel.app/push-topic-news

*  https://news-updates-sooty.vercel.app/push-country-news


## Contribution Guidelines

* Fork the repo & create a feature 
"branch: git checkout -b feature/your-feature"

* Commit changes with descriptive messages.

* Open a pull request for review.
## Support

Made with ❤️ for Techsurf 2025 Hackathon

Developer: [Aakash Shah](https://github.com/AakashShah07)


# The Limelight Post 🟢

A modern tabloid-style blog covering social media influencers and celebrities across four verticals: Arts & Music, Fashion & Culture, Sports & Leisure, and Business & News.

## Features

- 🤖 **AI-Powered Story Generation** - Uses OpenAI and Tavily Search to create fresh takes on trending topics
- 📅 **Automated Scheduling** - Daily story generation at customizable times
- ✍️ **Manual Story Writing** - Create custom stories with AI polish feature
- 🔒 **Admin Authentication** - Protected backend controls
- 📸 **Real Unsplash Integration** - Dynamic, relevant images for every story
- 🎥 **YouTube Embeds** - Rich media support
- 🗄️ **Smart Storage** - Auto-cleanup with "Keep Forever" option
- 🎨 **Modern UI** - Lime green branding (#84cc16) with dynamic layouts

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **AI**: OpenAI GPT-4 + Tavily Search API
- **Images**: Unsplash API
- **Deployment**: Vercel

## Environment Variables

Required environment variables in Vercel:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_OPENAI_API_KEY=your_openai_key
VITE_TAVILY_API_KEY=your_tavily_key
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_key
```

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Contact

- 📧 Email: andrew@limelightpost.com
- 📱 Instagram: [@thelimelightpost](https://instagram.com/thelimelightpost)
- 🐦 X: [@liMelitepoSt](https://x.com/liMelitepoSt)
- 📺 YouTube: [@THELIMELIGHTPOST](https://youtube.com/@THELIMELIGHTPOST)
- 🎵 TikTok: [@limelightpost](https://tiktok.com/@limelightpost)

## License

All rights reserved © 2025 The Limelight Post

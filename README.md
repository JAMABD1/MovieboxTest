# MovieBox

A modern streaming application built with Next.js that allows users to browse movies and TV shows using the TMDB API. Features Google OAuth authentication for secure access.

## Features

- 🎬 Browse movies and TV shows
- 🔍 Search functionality
- 📱 Responsive design
- 🔐 Google OAuth authentication
- 🎨 Modern UI with Tailwind CSS
- ⚡ Built with Next.js 16 and React 19

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google OAuth credentials
- TMDB API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd moviebox
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# TMDB API Configuration
TMDB_API_KEY=your_tmdb_api_key
# Optional: TMDB user session for account features (favorites, watchlist, ratings, lists)
TMDB_SESSION_ID=your_tmdb_session_id
```

### Environment Variables

- **GOOGLE_CLIENT_ID**: Your Google OAuth Client ID from [Google Cloud Console](https://console.cloud.google.com/)
- **GOOGLE_CLIENT_SECRET**: Your Google OAuth Client Secret
- **NEXTAUTH_URL**: The base URL of your application (e.g., `http://localhost:3000` for development)
- **NEXTAUTH_SECRET**: A random secret string for encrypting cookies (generate with `openssl rand -base64 32`)
- **TMDB_API_KEY**: Your TMDB API key from [TMDB](https://www.themoviedb.org/settings/api)
- **TMDB_SESSION_ID** (optional): A TMDB v3 session id used for account-specific features (favorites, watchlist, ratings, lists)

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
npm start
```

## Authentication

The application uses NextAuth.js with Google OAuth provider. Users must sign in with their Google account to access the MovieBox application.

## Tech Stack

- **Framework**: Next.js 16
- **React**: 19
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Query
- **API**: TMDB API

## Project Structure

```
moviebox/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/    # NextAuth configuration
│   ├── components/                # React components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── Header.tsx
│   │   ├── MovieBoxApp.tsx
│   │   └── ...
│   ├── contexts/                 # React contexts
│   ├── hooks/                    # Custom hooks
│   ├── lib/                      # Utilities
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── .env                          # Environment variables
└── package.json
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [TMDB API Documentation](https://developers.themoviedb.org/)

## License

This project is private and proprietary.

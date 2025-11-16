# Mshkur - AI Studio + Digital Cards Platform

**Unified AI-Powered Digital Business Card & Chat Platform**

![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![Version](https://img.shields.io/badge/Version-2.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-brightgreen)

## Overview

Mshkur is an integrated platform combining:
- **AI Chat Interface** (Genkit AI) - Advanced conversational AI
- **Digital Business Cards** - Smart card management & sharing
- **Dashboard** - User management & analytics
- **Firebase Backend** - Secure cloud infrastructure

## Features

### AI Studio
- 🤖 Genkit AI Integration
- 💬 Real-time Chat Interface
- 🎨 Customizable UI Components (Radix UI)
- 🌐 Multi-language Support

### Digital Cards
- 📇 Smart Business Cards
- 🔗 QR Code Integration
- 📊 Analytics & Tracking
- 🎯 Contact Management

### Core
- 🔐 Firebase Authentication
- 💾 Firestore Database
- ☁️ Cloud Storage
- 🚀 Optimized Performance

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Firebase Account

### Installation

```bash
# Clone repository
git clone https://github.com/mshkuralwaleed-collab/mshkur.git
cd mshkur

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### Environment Variables (.env.local)

```bash
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gemini-smart-card.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gemini-smart-card
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gemini-smart-card.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Genkit AI
GOOGLE_GENAI_API_KEY=your_genai_key

# App Config
NEXT_PUBLIC_APP_URL=https://mshkur.com
```

## Deployment

### Build for Production

```bash
# Build Next.js project
npm run build

# Output in 'out/' directory
ls out/
```

### Deploy to Hostinger

1. **Via FTP/SFTP:**
   - Upload contents of `out/` to `public_html/`
   - Upload `.htaccess` from `public/`

2. **Via cPanel:**
   - Navigate to public_html
   - Upload all files from `out/`
   - Upload `.htaccess`

3. **Verify Deployment:**
   - Visit https://mshkur.com
   - Check console for errors
   - Test authentication flow

## Project Structure

```
mshkur/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── context/          # State management
│   ├── firebase/         # Firebase config
│   ├── services/         # Business logic
│   └── types/            # TypeScript types
├── public/               # Static files
├── docs/                 # Documentation
├── next.config.ts        # Next.js config
├── package.json          # Dependencies
└── .env.local            # Environment variables
```

## Documentation

Detailed guides available in `/docs`:

- **[MSHKUR_INTEGRATION_GUIDE.md](docs/MSHKUR_INTEGRATION_GUIDE.md)** - Complete integration guide (350+ lines)
- **[QUICK_START.md](docs/QUICK_START.md)** - 5-minute quick start
- **[IMPLEMENTATION_CHECKLIST.md](docs/IMPLEMENTATION_CHECKLIST.md)** - 8-phase checklist

## Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 15 |
| Frontend | React 19 |
| Styling | Tailwind CSS |
| UI Library | Radix UI |
| Database | Firestore |
| Auth | Firebase Auth |
| AI | Genkit AI |
| Language | TypeScript |

## API Endpoints

API routes available at `/api/*`:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/cards` - Fetch user cards
- `POST /api/cards` - Create new card
- `GET /api/chat` - Chat interface

## Security

- ✅ Firebase Security Rules configured
- ✅ HTTPS enforced
- ✅ CORS configured
- ✅ Input validation
- ✅ Rate limiting
- ✅ Secure authentication

## Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## Issues & Support

- **Issues:** [GitHub Issues](https://github.com/mshkuralwaleed-collab/mshkur/issues)
- **Discussions:** [GitHub Discussions](https://github.com/mshkuralwaleed-collab/mshkur/discussions)
- **Email:** support@mshkur.com

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Firebase for backend services
- Genkit AI for conversational AI
- Radix UI for component library
- Next.js team for framework

## Project Links

- 🌐 **Website:** https://mshkur.com
- 🐙 **GitHub:** https://github.com/mshkuralwaleed-collab/mshkur
- 🚀 **Live Demo:** https://mshkur.com
- 📚 **Docs:** https://github.com/mshkuralwaleed-collab/mshkur/tree/main/docs

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 2.0.0 | 2025-11-16 | Major integration release |
| 1.0.0 | 2025-11-15 | Initial release |

---

**Last Updated:** November 16, 2025  
**Maintainer:** mshkuralwaleed-collab  
**Status:** ✅ Production Ready

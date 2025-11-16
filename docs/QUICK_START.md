# Quick Start - 5 Minutes Setup

## Prerequisites
- Node.js 18+ installed
- npm or yarn
- Git
- Firebase credentials

## Quick Setup

### 1. Clone & Install
```bash
git clone https://github.com/mshkuralwaleed-collab/mshkur.git
cd mshkur
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit with your Firebase keys
```

### 3. Start Development
```bash
npm run dev
# Open http://localhost:3000
```

### 4. Test
- Homepage loads
- AI Chat works
- Login accessible
- Dashboard protected

## What's Merged

**mshkur (AI Studio)**
- Genkit AI integration
- Chat interface
- Next.js 15, React 19

**cardify (Digital Cards)**
- Authentication
- Card management
- Dashboard

## Key Commands
```bash
npm run dev      # Start development
npm run build    # Build for production
npm run start    # Start production server
```

## Troubleshooting

**npm install fails:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 in use:**
```bash
npm run dev -- -p 3001
```

**Firebase not working:**
- Check .env.local
- Verify Firebase project active
- Clear browser cookies

## Next Steps

1. Read full guide: `docs/MSHKUR_INTEGRATION_GUIDE.md`
2. Deploy to Hostinger
3. Custom domain setup

## Support

- Issues: https://github.com/mshkuralwaleed-collab/mshkur/issues
- Docs: https://github.com/mshkuralwaleed-collab/mshkur/tree/main/docs

---

Ready to build? Let's go!

# BV Studios Website

Professional video production services in Lexington, Kentucky.

## Features

- Modern, responsive design
- Next.js 14 with App Router and Pages Router
- NextAuth.js authentication
- Prisma database integration
- Tailwind CSS styling
- Framer Motion animations

## Development

```bash
npm install
npm run dev
```

### 🚫 **Prevent Duplicates with Claude Code (IMPORTANT!)**

Before creating new components/files, always check for existing functionality:

```bash
# Claude Code workflow (recommended)
npm run claude:check                 # Full duplicate analysis
npm run claude:search [feature]      # Search specific functionality
npm run claude:imports               # View available imports

# Quick duplicate check
npm run check-duplicates

# Search for specific functionality
grep -r "function.*ComponentName" .
```

**Guides**: 
- `docs/CLAUDE_CODE_WORKFLOW.md` - Complete Claude Code integration
- `docs/QUICK_REFERENCE.md` - Quick commands reference
- `docs/DUPLICATE_PREVENTION_GUIDE.md` - Full prevention guide

## Deployment

This project is deployed on Vercel.

**Last deployment trigger: 2025-01-27 - Navigation button removal**

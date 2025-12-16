# Environment Variables Setup

This document explains how to configure environment variables for the Waste Management System.

## Environment Files

### `.env.example`
Template file showing all available environment variables. **This file is committed to the repository.**

### `.env.local`
Your local development environment variables. **This file is ignored by git and should contain your actual values.**

### `.env.production` (optional)
Production environment variables for deployment.

## Required Variables

### Supabase Configuration
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### App Configuration
```bash
VITE_APP_NAME=Waste Management System
VITE_APP_VERSION=1.0.0
VITE_DEBUG_MODE=true
```

### API Configuration (optional)
```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

## Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Update values in `.env.local`:**
   - Replace placeholder values with your actual Supabase credentials
   - Adjust other configuration as needed

3. **Restart the development server:**
   ```bash
   npm run dev
   ```

## Using Environment Variables in Code

### Import the config object:
```typescript
import { config } from '@/config/env';

// Access Supabase URL
const supabaseUrl = config.supabase.url;

// Access app name
const appName = config.app.name;

// Check environment
const isDev = config.env.isDevelopment;
```

### Direct access (not recommended):
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
```

## Variable Naming Convention

- All frontend environment variables must start with `VITE_`
- Use SCREAMING_SNAKE_CASE for variable names
- Group related variables with prefixes (e.g., `VITE_SUPABASE_*`, `VITE_APP_*`)

## Validation

The app automatically validates required environment variables on startup. Check the browser console for any missing variable warnings.

## Security Notes

- Never commit `.env.local` or any file with actual secrets
- The `VITE_SUPABASE_ANON_KEY` is safe to expose to the frontend
- Never put sensitive server-side secrets in `VITE_*` variables

## Troubleshooting

1. **Variables not loading:** Make sure they start with `VITE_`
2. **Changes not reflected:** Restart the dev server after changing variables
3. **Missing variables:** Check the browser console for validation warnings
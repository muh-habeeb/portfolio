# Setup Guide

## Prerequisites
- Node.js 18+
- npm
- Convex account
- Clerk account (for authentication)

## Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in SMTP, Convex, Clerk, and other required values
4. Start development server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## SMTP Setup
- For Gmail, use App Passwords
- For other providers, use their SMTP credentials
- Example:
  ```env
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=your-email@gmail.com
  SMTP_PASS=your-app-password
  EMAIL_FROM=your-email@gmail.com
  ```

## Convex Setup
- Create a Convex project
- Set `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` in `.env.local`

## Clerk Setup
- Create a Clerk project
- Set publishable and secret keys in `.env.local`

## Troubleshooting
- For bulk errors, ensure message IDs are valid
- For email issues, check SMTP credentials
- For Convex issues, run `npx convex codegen` and restart dev server

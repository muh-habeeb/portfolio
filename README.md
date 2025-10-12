# Personal Portfolio with Admin Dashboard

A modern, fast, and production-ready Next.js portfolio website with a protected admin dashboard for content management.

## 🚀 Features

### Public Site
- **Modern Design**: Clean, responsive design with dark/light mode support
- **Hero Section**: Animated introduction with CTA buttons
- **About Section**: Personal information with photo and skills overview
- **Projects Showcase**: Featured and regular projects with tech stack tags
- **Skills Display**: Categorized skills with proficiency levels and animations
- **Experience Timeline**: Work history and education with detailed descriptions
- **Contact Form**: Working contact form with email notifications
- **SEO Optimized**: Meta tags, structured data, and optimized images

### Admin Dashboard
- **Secure Authentication**: Google sign-in via Clerk with admin email protection
- **Content Management**: Full CRUD operations for projects, skills, and experience
- **Contact Messages**: View and manage contact form submissions
- **Settings Management**: Update personal information and site settings
- **Real-time Updates**: Changes reflect immediately on the public site

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router and TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **Database**: Convex (serverless, low-latency)
- **Authentication**: Clerk (Google sign-in)
- **Email**: Nodemailer with SMTP support
- **Hosting**: Vercel-ready
- **State Management**: Convex React hooks

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env.local` and fill in the required values:
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Convex**
   ```bash
   npx convex dev --configure
   ```

5. **Seed the database**
   ```bash
   npx convex run seed:seedData
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database (automatically filled by Convex)
CONVEX_DEPLOYMENT=your_deployment_id
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin

# Admin Configuration
ADMIN_EMAIL=your_admin_email@domain.com

# Email Configuration (for contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=your_gmail@gmail.com

# Site Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🎯 Setup Guide

### 1. Convex Database Setup

1. Visit [Convex Dashboard](https://dashboard.convex.dev/)
2. Create a new project
3. Run `npx convex dev --configure` to link your local project
4. The database schema is automatically created from `convex/schema.ts`

### 2. Clerk Authentication Setup

1. Visit [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Enable Google OAuth provider:
   - Go to "Configure" → "SSO Connections"
   - Add Google provider
   - Configure OAuth credentials
4. Copy the publishable key and secret key to your `.env.local`
5. Set your admin email in `ADMIN_EMAIL` environment variable

### 3. Email Configuration

#### For Development (Gmail SMTP):
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the app password in `SMTP_PASS`

#### For Production (Recommended):
Use a transactional email service like:
- **SendGrid**: [sendgrid.com](https://sendgrid.com/) (100 emails/day free)
- **Resend**: [resend.com](https://resend.com/) (100 emails/day free)
- **Mailgun**: [mailgun.com](https://mailgun.com/) (5,000 emails/month free)

### 4. Adding Your Content

#### Method 1: Admin Dashboard (Recommended)
1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000/admin`
3. Sign in with Google using your admin email
4. Use the dashboard to add/edit content

#### Method 2: Database Seeding
1. Edit the dummy data in `convex/seed.ts`
2. Run `npx convex run seed:seedData` to populate the database

### 5. Customizing Images

Replace placeholder images in the `public` folder:
- `avatar.jpg` - Your profile photo
- `og-image.jpg` - Open Graph image for social sharing
- `projects/` folder - Project screenshots

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com/)
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Deploy

3. **Update Convex for production**
   ```bash
   npx convex deploy --cmd 'npm run build'
   ```

4. **Update Clerk settings**
   - Add your production domain to Clerk dashboard
   - Update redirect URLs if needed

### Environment Variables for Production

Make sure to add all environment variables to your Vercel dashboard:
- All variables from `.env.local`
- Update `NEXT_PUBLIC_BASE_URL` to your production domain
- Update email settings for production email service

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── api/               # API routes
│   │   ├── sign-in/           # Authentication pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── sections/          # Page sections
│   │   └── ui/                # shadcn/ui components
│   ├── lib/                   # Utility functions
│   └── providers/             # Context providers
├── convex/                    # Convex backend
│   ├── schema.ts              # Database schema
│   ├── public.ts              # Public queries/mutations
│   ├── admin.ts               # Admin mutations
│   └── seed.ts                # Database seeding
├── public/                    # Static assets
└── README.md
```

## 🔒 Security Features

- **Admin Protection**: Only specified admin email can access dashboard
- **Input Validation**: All forms use Zod schema validation
- **Rate Limiting**: Contact form includes basic abuse prevention
- **Secure Headers**: CSP and security headers configured
- **Environment Variables**: Sensitive data stored securely

## 📈 Performance Features

- **Server-Side Rendering**: Fast initial page loads
- **Image Optimization**: Next.js Image component with optimization
- **Code Splitting**: Automatic code splitting for optimal bundles
- **Caching**: Convex provides automatic query caching
- **Incremental Static Regeneration**: Fast static pages with dynamic updates

## 🎨 Customization

### Styling
- Edit `tailwind.config.js` for theme customization
- Modify `src/app/globals.css` for global styles
- Update shadcn/ui theme in `components.json`

### Content Structure
- Modify `convex/schema.ts` to change data structure
- Update corresponding React components
- Re-run database migrations if needed

### Email Templates
- Edit email templates in `src/app/api/contact/route.ts`
- Add HTML email templates for better formatting

## 🐛 Troubleshooting

### Common Issues

1. **Convex connection issues**
   - Ensure `NEXT_PUBLIC_CONVEX_URL` is set correctly
   - Check if Convex development server is running

2. **Clerk authentication not working**
   - Verify Clerk keys are correct
   - Check if Google OAuth is properly configured
   - Ensure admin email matches exactly

3. **Email not sending**
   - Verify SMTP credentials
   - Check Gmail app password (not regular password)
   - Ensure 2FA is enabled for Gmail

4. **Images not loading**
   - Add actual image files to `public` folder
   - Update image paths in the database

### Development Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Reset database (⚠️ destroys all data)
npx convex run seed:seedData
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Create a Pull Request

## 💡 Support

If you have questions or need help:

1. Check the troubleshooting section above
2. Review [Convex documentation](https://docs.convex.dev/)
3. Check [Clerk documentation](https://clerk.com/docs)
4. Open an issue on GitHub

---

Built with ❤️ using Next.js, Convex, and Clerk

# Admin Panel Documentation

## Overview
The admin panel provides full control over portfolio content, messages, and user experience. All features are accessible via the `/admin` route after authentication.

## Sections
- **Dashboard**: Quick overview and navigation
- **Projects**: Add, edit, delete, and reorder portfolio projects
- **Skills**: Manage skills and categories
- **Work Experience**: Add/edit work history
- **Education**: Add/edit education history
- **Social Links**: Manage social profiles
- **Messages**: Gmail-like message management

## Message Management
- **Bulk Actions**: Select multiple messages for status updates or deletion
- **Reply**: Send professional email replies via Nodemailer
- **Status Tracking**: Messages can be marked as new, read, or replied
- **Search & Filter**: Quickly find messages by status, sender, or content

## Email Reply System
- Replies are sent directly to the sender's email using SMTP
- Configure SMTP in `.env.local`
- Reply status and history are tracked in Convex

## Navigation Loading Spinner
- When navigating between admin sections, a spinner indicates loading
- Improves user experience for slow connections

## Authentication
- Only authenticated admins can access `/admin`
- Uses Clerk for secure login

## Troubleshooting
- If bulk actions fail, check browser console for invalid message IDs
- Ensure SMTP credentials are correct for email replies
- For Convex errors, restart the dev server and run `npx convex codegen`

## Support
For proprietary support, contact the author directly.

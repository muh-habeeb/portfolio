# Image Upload Error Fix

## Problem
You're getting this error when trying to upload images in production:
```
Error: EROFS: read-only file system, open '/var/task/public/images/projects/...'
```

## Root Cause
This happens because:
1. In production (Vercel), the file system is **read-only**
2. Your app is trying to save images to local storage (`/public/images/`)
3. Local storage only works in development, not production

## Solution: Configure Cloudinary

### Step 1: Get Cloudinary Account
1. Go to [Cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Go to your Dashboard
4. Copy these values:
   - **Cloud Name**
   - **API Key** 
   - **API Secret**

### Step 2: Add Environment Variables
Add these to your **production environment** (Vercel dashboard):

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### Step 3: Deploy
After adding the environment variables, redeploy your app.

## How It Works Now
✅ **Development**: Uses local storage (`/public/images/`)  
✅ **Production**: Automatically uses Cloudinary cloud storage  

## Verification
After setup, your images will be stored on Cloudinary and URLs will look like:
```
https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/portfolio/projects/image.jpg
```

## Benefits of Cloudinary
- ✅ Works in production environments
- ✅ Automatic image optimization
- ✅ Fast CDN delivery
- ✅ Multiple format support
- ✅ Free tier available
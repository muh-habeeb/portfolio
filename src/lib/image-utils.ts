import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

export type ImageSection = 'profile' | 'projects' | 'general';

/**
 * Upload image to Cloudinary
 */
export async function uploadToCloudinary(
  filePath: string,
  section: ImageSection,
  oldPublicId?: string
): Promise<ImageUploadResult> {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary not configured');
    }

    // Delete old image if exists
    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId);
      } catch (error) {
        console.warn('Failed to delete old Cloudinary image:', error);
      }
    }

    // Upload new image
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `portfolio/${section}`,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * Upload image to local storage
 */
export async function uploadToLocal(
  fileBuffer: Buffer,
  fileName: string,
  section: ImageSection,
  oldFileName?: string
): Promise<ImageUploadResult> {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'images', section);
    
    // Ensure directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Delete old image if exists
    if (oldFileName) {
      const oldPath = path.join(uploadsDir, oldFileName);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (error) {
          console.warn('Failed to delete old local image:', error);
        }
      }
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = path.extname(fileName);
    const baseName = path.basename(fileName, extension);
    const newFileName = `${baseName}-${timestamp}${extension}`;
    
    const filePath = path.join(uploadsDir, newFileName);
    
    // Write file
    fs.writeFileSync(filePath, fileBuffer);
    
    const url = `/images/${section}/${newFileName}`;
    
    return {
      success: true,
      url,
      publicId: newFileName
    };
  } catch (error) {
    console.error('Local upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

/**
 * Delete image from storage
 */
export async function deleteImage(imageUrl: string, publicId?: string): Promise<boolean> {
  try {
    const uploadStrategy = process.env.NEXT_PUBLIC_UPLOAD_STRATEGY || 'local';
    
    if (uploadStrategy === 'cloudinary' && publicId && process.env.CLOUDINARY_CLOUD_NAME) {
      await cloudinary.uploader.destroy(publicId);
    } else if (uploadStrategy === 'local' && imageUrl.startsWith('/images/')) {
      const filePath = path.join(process.cwd(), 'public', imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete image:', error);
    return false;
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: { name: string; size: number; type: string }): { 
  valid: boolean; 
  error?: string; 
} {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB default
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, and WebP images are allowed'
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    };
  }
  
  return { valid: true };
}

/**
 * Get file name from URL
 */
export function getFileNameFromUrl(url: string): string | null {
  if (url.startsWith('/images/')) {
    return path.basename(url);
  }
  return null;
}
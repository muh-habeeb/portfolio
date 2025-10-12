import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { 
  uploadToCloudinary, 
  uploadToLocal, 
  deleteImage, 
  validateImageFile,
  getFileNameFromUrl,
  type ImageSection 
} from '@/lib/image-utils';

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

async function isAdmin(): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    const adminEmail = process.env.ADMIN_EMAIL;
    const userEmail = user.emailAddresses.find((email: { id: string; emailAddress: string }) => email.id === user.primaryEmailAddressId)?.emailAddress;

    return userEmail === adminEmail;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const section = formData.get('section') as ImageSection;
    const oldImage = formData.get('oldImage') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!section || !['profile', 'projects', 'general'].includes(section)) {
      return NextResponse.json(
        { error: 'Invalid section' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateImageFile({
      name: file.name,
      size: file.size,
      type: file.type
    });

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Determine upload strategy
    const uploadStrategy = process.env.NEXT_PUBLIC_UPLOAD_STRATEGY || 'local';
    let result;

    if (uploadStrategy === 'cloudinary' && process.env.CLOUDINARY_CLOUD_NAME) {
      // Upload to Cloudinary
      // First convert file to buffer and save temporarily
      const buffer = Buffer.from(await file.arrayBuffer());
      const tempPath = `/tmp/${Date.now()}-${file.name}`;
      
      // For Cloudinary, we need to use a temp file path
      const fs = await import('fs');
      fs.writeFileSync(tempPath, buffer);
      
      // Extract old public ID if exists
      let oldPublicId: string | undefined;
      if (oldImage && !oldImage.startsWith('/images/')) {
        // Cloudinary URL format: extract public_id
        const matches = oldImage.match(/\/([^/.]+)\.[^/]+$/);
        if (matches) {
          oldPublicId = `portfolio/${section}/${matches[1]}`;
        }
      }
      
      result = await uploadToCloudinary(tempPath, section, oldPublicId);
      
      // Clean up temp file
      try {
        fs.unlinkSync(tempPath);
      } catch (error) {
        console.warn('Failed to clean up temp file:', error);
      }
    } else {
      // Upload to local storage
      const buffer = Buffer.from(await file.arrayBuffer());
      const oldFileName = oldImage ? getFileNameFromUrl(oldImage) : undefined;
      
      result = await uploadToLocal(buffer, file.name, section, oldFileName || undefined);
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Upload failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const publicId = searchParams.get('publicId');

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL provided' },
        { status: 400 }
      );
    }

    const success = await deleteImage(imageUrl, publicId || undefined);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Delete API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
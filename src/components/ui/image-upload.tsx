/**
 * Enhanced ImageUpload Component
 * 
 * Supports both file upload and URL input with tabbed interface
 */

"use client";

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, Link, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  onImageRemove?: () => void;
  currentImage?: string;
  className?: string;
  acceptedTypes?: string[];
  maxSizeInMB?: number;
  width?: number;
  height?: number;
  section?: "profile" | "hero" | "about" | "projects" | "contact" | "general" | "skills" | "social";
}

export function ImageUpload({
  onImageUpload,
  onImageRemove,
  currentImage,
  className = '',
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSizeInMB = 5,
  width = 400,
  height = 300,
  section = 'general'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate if URL points to a valid image
  const validateImageUrl = useCallback(async (url: string): Promise<boolean> => {
    try {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
        // Timeout after 10 seconds
        setTimeout(() => resolve(false), 10000);
      });
    } catch {
      return false;
    }
  }, []);

  // Handle URL input submission
  const handleUrlSubmit = useCallback(async () => {
    if (!imageUrl.trim()) {
      toast.error('Please enter a valid image URL');
      return;
    }

    setIsValidatingUrl(true);
    try {
      const isValid = await validateImageUrl(imageUrl);
      if (isValid) {
        onImageUpload(imageUrl);
        setImageUrl('');
        toast.success('Image URL added successfully!');
      } else {
        toast.error('Invalid image URL. Please check the URL and try again.');
      }
    } catch (error) {
      console.error('Error validating image URL:', error);
      toast.error('Failed to validate image URL');
    } finally {
      setIsValidatingUrl(false);
    }
  }, [imageUrl, onImageUpload, validateImageUrl]);

  const validateFile = useCallback((file: File): boolean => {
    if (!acceptedTypes.includes(file.type)) {
      toast.error(`Only ${acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')} files are allowed`);
      return false;
    }

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error(`File size must be less than ${maxSizeInMB}MB`);
      return false;
    }

    return true;
  }, [acceptedTypes, maxSizeInMB]);

  const uploadFile = useCallback(async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('section', section);
      
      if (currentImage) {
        formData.append('oldImage', currentImage);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        onImageUpload(result.url);
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = 'Failed to upload image';
      
      if (error instanceof Error) {
        if (error.message.includes('EROFS') || error.message.includes('read-only file system')) {
          errorMessage = 'Upload failed: Please configure Cloudinary for production use. Check IMAGE_UPLOAD_FIX.md for setup instructions.';
        } else if (error.message.includes('Cloudinary not configured')) {
          errorMessage = 'Cloudinary not configured. Please set up CLOUDINARY environment variables.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [section, currentImage, onImageUpload, validateFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => acceptedTypes.includes(file.type));
    
    if (imageFile) {
      uploadFile(imageFile);
    } else {
      toast.error('Please drop a valid image file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemoveImage = () => {
    if (onImageRemove) {
      onImageRemove();
      toast.success('Image removed successfully');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Image Preview */}
      {currentImage && (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative" style={{ width, height: Math.min(height, 300) }}>
              <Image
                src={currentImage}
                alt="Current image"
                fill
                className="object-cover rounded-lg"
                unoptimized={currentImage.startsWith('/images/')}
              />
              {onImageRemove && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                  disabled={isUploading || isValidatingUrl}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Upload Options */}
      <Tabs defaultValue="file" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file" className="flex items-center gap-2">
            <FileImage className="w-4 h-4" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            Image URL
          </TabsTrigger>
        </TabsList>

        {/* File Upload Tab */}
        <TabsContent value="file" className="space-y-4">
          <Card>
            <CardContent
              className={`p-6 border-2 border-dashed transition-colors cursor-pointer ${
                isDragOver 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center space-y-4">
                {isUploading ? (
                  <>
                    <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
                    <p className="text-lg font-medium">Uploading...</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Please wait while we upload your image
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium mb-2">
                        Drop your image here, or click to browse
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Drag and drop an image file, or click to select one from your device
                      </p>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                      <p>Accepted formats: {acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}</p>
                      <p>Maximum size: {maxSizeInMB}MB</p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploading}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Select Image
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* URL Input Tab */}
        <TabsContent value="url" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image-url" className="text-sm font-medium">
                    Image URL
                  </Label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Enter a direct link to an image (jpg, png, gif, webp, etc.)
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Input
                    id="image-url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    disabled={isValidatingUrl}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleUrlSubmit();
                      }
                    }}
                  />
                  <Button
                    onClick={handleUrlSubmit}
                    disabled={isValidatingUrl || !imageUrl.trim()}
                    className="px-6"
                  >
                    {isValidatingUrl ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Link className="w-4 h-4 mr-2" />
                        Add
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p>Supported: Direct image URLs from any website</p>
                  <p>Examples: Unsplash, Pexels, your own hosting, etc.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

export default ImageUpload;
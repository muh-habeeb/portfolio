"use client";

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { toast } from 'sonner';

export type ImageSection = 'profile' | 'projects' | 'general';

interface ImageUploadProps {
  section: ImageSection;
  currentImage?: string;
  onImageUpload: (imageUrl: string) => void;
  onImageRemove?: () => void;
  className?: string;
  acceptedTypes?: string[];
  maxSizeInMB?: number;
  width?: number;
  height?: number;
}

export default function ImageUpload({
  section,
  currentImage,
  onImageUpload,
  onImageRemove,
  className = '',
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxSizeInMB = 5,
  width = 300,
  height = 200
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): boolean => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      toast.error(`Only ${acceptedTypes.map(t => t.split('/')[1]).join(', ')} files are allowed`);
      return false;
    }

    // Check file size
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
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }, [section, currentImage, onImageUpload, validateFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  }, [uploadFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleRemoveImage = () => {
    if (onImageRemove) {
      onImageRemove();
      toast.success('Image removed');
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
                  disabled={isUploading}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
            : 'border-gray-300 dark:border-gray-600'
        } ${isUploading ? 'opacity-50' : ''}`}
      >
        <CardContent 
          className="p-6"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="text-center space-y-4">
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Uploading image...
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <ImageIcon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {currentImage ? 'Replace Image' : 'Upload Image'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Drag and drop or click to select
                  </p>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <p>Accepted formats: {acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}</p>
                  <p>Maximum size: {maxSizeInMB}MB</p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
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
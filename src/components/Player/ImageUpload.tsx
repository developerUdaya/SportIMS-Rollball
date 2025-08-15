import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Camera, Loader } from 'lucide-react';
import { uploadPlayerImage } from '../../lib/storage';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  playerId?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  currentImage,
  playerId,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setUploading(true);

    try {
      // Upload to Supabase
      const tempId = playerId || `temp-${Date.now()}`;
      const imageUrl = await uploadPlayerImage(file, tempId);
      
      if (imageUrl) {
        onImageUpload(imageUrl);
      } else {
        setPreview(currentImage || null);
        alert('Failed to upload image. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setPreview(currentImage || null);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      URL.revokeObjectURL(previewUrl);
    }
  }, [onImageUpload, playerId, currentImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  const removeImage = () => {
    setPreview(null);
    onImageUpload('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Player Photo
      </label>
      
      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Player preview"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
          {!uploading && (
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <Loader className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`w-24 h-24 border-2 border-dashed rounded-full flex items-center justify-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <Loader className="h-6 w-6 text-gray-400 animate-spin" />
          ) : (
            <div className="text-center">
              <Camera className="h-6 w-6 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Upload</p>
            </div>
          )}
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        Click or drag image here (max 5MB)
      </p>
    </div>
  );
};

export default ImageUpload;
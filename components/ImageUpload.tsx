'use client';

import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, AlertCircle, ArrowLeft } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (imageUrl: string, file: File) => void;
  onBack: () => void;
}

export default function ImageUpload({ onUpload, onBack }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      setError('Please upload a JPEG or PNG image');
      return false;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    setError('');
    
    if (!validateFile(file)) {
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleContinue = () => {
    if (preview && selectedFile) {
      onUpload(preview, selectedFile);
    }
  };

  return (
    <div className="paper-card p-6 paper-texture">
      <div className="flex items-center space-x-2 mb-6">
        <ImageIcon className="w-6 h-6 text-warm-600" />
        <h2 className="text-2xl font-display font-bold text-paper-900">
          Upload Your Image
        </h2>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-3 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all mb-6 ${
          isDragging
            ? 'border-warm-500 bg-warm-50'
            : preview
            ? 'border-green-400 bg-green-50'
            : 'border-paper-300 hover:border-warm-400 hover:bg-paper-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {!preview ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-warm-100 p-4 rounded-full">
                <Upload className="w-12 h-12 text-warm-600" />
              </div>
            </div>
            <div>
              <p className="text-lg font-medium text-paper-900 mb-2">
                Drop your image here or click to browse
              </p>
              <p className="text-sm text-paper-600">
                Supports JPEG and PNG (max 10MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 rounded-lg shadow-md"
              />
              <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                ✓ Ready
              </div>
            </div>
            <p className="text-sm text-paper-600">
              Click to change image
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onBack}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button
          onClick={handleContinue}
          disabled={!preview}
          className="btn-primary flex-1"
        >
          Continue to Checkout
        </button>
      </div>
    </div>
  );
}

// File: components/sociope/image-upload.tsx
import { Upload, X } from 'lucide-react';
import React, { useCallback } from 'react';

interface ImageUploadProps {
  onChange: (files: string[]) => void;
  value: string[];
  maxImages?: number;
}

export function ImageUpload({ onChange, value = [], maxImages = 4 }: ImageUploadProps) {
  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files?.length) return;

      // In a real app, you'd upload to a storage service
      // For now, we'll create object URLs
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      onChange([...value, ...newImages].slice(0, maxImages));
    },
    [value, onChange, maxImages]
  );

  const removeImage = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange]
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {value.map((image, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={image}
              alt={`Upload ${index + 1}`}
              className="h-full w-full rounded-lg object-cover"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute -right-2 -top-2 rounded-full bg-primary-dark/80 p-1 text-white hover:bg-primary-dark"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        {value.length < maxImages && (
          <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-primary/40 hover:border-primary">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
            <Upload className="h-6 w-6 text-primary/60" />
          </label>
        )}
      </div>
    </div>
  );
}

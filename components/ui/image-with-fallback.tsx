// components/ui/image-with-fallback.tsx

import Image from 'next/image';
import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function ImageWithFallback({ src, alt, width, height, className }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {error ? (
        <div
          className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800"
          style={{ width, height }}
        >
          <span className="text-sm text-gray-500 dark:text-gray-400">{alt}</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          onError={() => setError(true)}
          loading="lazy"
          quality={90}
        />
      )}
    </div>
  );
}

// lib/image-utils.ts

interface ImageGeneratorOptions {
  type: 'avatar' | 'post';
  seed?: string;
  width?: number;
  height?: number;
}

export function generateImageUrl({
  type,
  seed = 'default',
  width = 400,
  height = 400
}: ImageGeneratorOptions): string {
  if (type === 'avatar') {
    return `https://picsum.photos/seed/${seed}-avatar/${width}/${height}`;
  }
  return `https://picsum.photos/seed/${seed}-post/${width}/${height}`;
}

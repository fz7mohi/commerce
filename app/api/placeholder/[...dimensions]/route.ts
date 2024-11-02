// app/api/placeholder/[...dimensions]/route.ts

import { NextRequest } from 'next/server';

interface RouteParams {
  dimensions: string[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> | RouteParams }
): Promise<Response> {
  try {
    // Await the params
    const resolvedParams = await params;
    const [width, height] = resolvedParams.dimensions;

    // Generate a unique seed based on dimensions
    const seed = encodeURIComponent(`${width}x${height}`);

    // Use Picsum with a consistent seed for caching
    const imageUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`;

    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const blob = await response.blob();

    // Return the image with appropriate headers
    return new Response(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        Vary: 'Accept'
      }
    });
  } catch (error) {
    // Fallback SVG with the requested dimensions
    const resolvedParams = await params;
    const [width, height] = resolvedParams.dimensions;

    const svg = `
      <svg 
        width="${width}" 
        height="${height}" 
        viewBox="0 0 ${width} ${height}" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <rect width="100%" height="100%" fill="url(#pattern)"/>
        <text 
          x="50%" 
          y="50%" 
          font-family="system-ui" 
          font-size="16" 
          fill="#666" 
          text-anchor="middle" 
          dy=".3em"
        >
          ${width} × ${height}
        </text>
        <defs>
          <pattern 
            id="pattern" 
            width="16" 
            height="16" 
            patternUnits="userSpaceOnUse" 
            patternTransform="rotate(45)"
          >
            <rect width="1" height="16" fill="#ddd" fill-opacity="0.5"/>
          </pattern>
        </defs>
      </svg>
    `.trim();

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  }
}

export const runtime = 'edge';

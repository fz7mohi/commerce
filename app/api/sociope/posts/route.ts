// File: app/api/sociope/posts/route.ts
import { prisma } from '@/lib/prisma';
import { getProducts } from '@/lib/shopify';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// Types
interface CreatePostRequest {
  content: string;
  images: string[];
  productIds: string[];
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const posts = await prisma.socialPost.findMany({
      take: limit,
      skip,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        likes: {
          select: {
            userId: true
          }
        },
        comments: {
          select: {
            id: true,
            content: true,
            userId: true,
            user: {
              select: {
                name: true,
                image: true
              }
            },
            createdAt: true
          },
          take: 3,
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    // Fetch product details for each post
    const postsWithProducts = await Promise.all(
      posts.map(async (post) => {
        const products =
          post.products.length > 0
            ? await getProducts({
                query: `id:${post.products.join(' OR id:')}`,
                sortKey: 'RELEVANCE'
              })
            : [];

        return {
          ...post,
          products
        };
      })
    );

    return NextResponse.json(postsWithProducts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, images, productIds }: CreatePostRequest = await req.json();

    // Validate input
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Create post
    const post = await prisma.socialPost.create({
      data: {
        userId: session.user.id,
        content,
        images: images || [],
        products: productIds || []
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Error creating post' }, { status: 500 });
  }
}

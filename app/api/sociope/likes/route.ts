// File: app/api/sociope/likes/route.ts
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = await req.json();

    const like = await prisma.like.create({
      data: {
        userId: session.user.id,
        postId
      }
    });

    return NextResponse.json(like);
  } catch (error) {
    console.error('Error creating like:', error);
    return NextResponse.json({ error: 'Error creating like' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    await prisma.like.deleteMany({
      where: {
        userId: session.user.id,
        postId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing like:', error);
    return NextResponse.json({ error: 'Error removing like' }, { status: 500 });
  }
}

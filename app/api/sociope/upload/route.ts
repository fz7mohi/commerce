// File: app/api/sociope/upload/route.ts
import { writeFile } from 'fs/promises';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { join } from 'path';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // In production, you would upload to a cloud storage service like S3
    // This is a simple example saving to the public directory
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename
    const uniqueName = `${Date.now()}-${file.name}`;
    const path = join(process.cwd(), 'public/uploads', uniqueName);

    await writeFile(path, buffer);

    return NextResponse.json({
      url: `/uploads/${uniqueName}`
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}

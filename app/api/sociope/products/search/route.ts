import { getProducts } from '@/lib/shopify';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Search query required' }, { status: 400 });
    }

    const products = await getProducts({
      query,
      sortKey: 'RELEVANCE'
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json({ error: 'Error searching products' }, { status: 500 });
  }
}

// app/page.tsx

import { CollectionShowcase } from 'components/collection-showcase';
import { loadCollectionData } from 'components/collection-showcase/loader';
import { HeroBanner } from 'components/HeroBanner';
import Footer from 'components/layout/footer';
import { Suspense } from 'react';

function CollectionShowcaseFallback() {
  return <div className="min-h-[400px] animate-pulse bg-neutral-100 dark:bg-neutral-900" />;
}

export default async function HomePage() {
  const collections = await loadCollectionData();

  return (
    <>
      <HeroBanner />
      <Suspense fallback={<CollectionShowcaseFallback />}>
        {collections.length > 0 && <CollectionShowcase collections={collections} />}
      </Suspense>

      <Footer />
    </>
  );
}

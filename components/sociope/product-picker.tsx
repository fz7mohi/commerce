// File: components/sociope/product-picker.tsx
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { sociopeApi } from '@/lib/sociope/api';
import { Search, X } from 'lucide-react';
import React, { useCallback, useState } from 'react';

interface Product {
  id: string;
  title: string;
  featuredImage: {
    url: string;
    altText: string;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface ProductPickerProps {
  onSelect: (products: Product[]) => void;
  selectedProducts: Product[];
  maxProducts?: number;
}

export function ProductPicker({
  onSelect,
  selectedProducts = [],
  maxProducts = 4
}: ProductPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const products = await sociopeApi.searchProducts(searchQuery);
      setResults(products);
    } catch (error) {
      console.error('Failed to search products:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    searchProducts(debouncedQuery);
  }, [debouncedQuery, searchProducts]);

  const handleSelect = (product: Product) => {
    if (selectedProducts.length < maxProducts) {
      onSelect([...selectedProducts, product]);
    }
  };

  const handleRemove = (productId: string) => {
    onSelect(selectedProducts.filter((p) => p.id !== productId));
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-primary-dark/40" />
        <Input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {query && (
        <div className="rounded-lg border border-primary/20 bg-white p-2 shadow-lg dark:bg-primary-dark">
          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-primary-dark/60">No products found</div>
          ) : (
            <div className="max-h-64 space-y-2 overflow-auto">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  disabled={selectedProducts.some((p) => p.id === product.id)}
                  className="w-full rounded-lg p-2 text-left hover:bg-primary/5 disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.featuredImage?.url || '/api/placeholder/48/48'}
                      alt={product.title}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                    <div>
                      <div className="font-medium">{product.title}</div>
                      <div className="text-sm text-primary">
                        {product.priceRange.minVariantPrice.amount}{' '}
                        {product.priceRange.minVariantPrice.currencyCode}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedProducts.length > 0 && (
        <div className="space-y-2">
          <div className="font-medium">Selected Products</div>
          <div className="grid gap-2">
            {selectedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-lg border border-primary/20 p-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.featuredImage?.url || '/api/placeholder/32/32'}
                    alt={product.title}
                    className="h-8 w-8 rounded-md object-cover"
                  />
                  <span className="font-medium">{product.title}</span>
                </div>
                <button
                  onClick={() => handleRemove(product.id)}
                  className="text-primary-dark/60 hover:text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

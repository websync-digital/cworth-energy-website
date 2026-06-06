import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { products as initialProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { LogIn, Sun, Moon } from "lucide-react";
import ProductSkeleton from "@/components/ProductSkeleton";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';
import { optimizeCloudinaryUrl } from '@/lib/cloudinaryClient';
import { COMPANY_PHONE, formatWhatsAppMessage, formatNaira } from '@/lib/constants';
import usePageTitle from '@/hooks/usePageTitle';

const Product = () => {
  usePageTitle('Products');
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavs = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      if (isDark && !isMobile) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    return () => window.removeEventListener('resize', checkMobile);
  }, [isDark]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, short_description, full_description, price_cents, image_url')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const mapped = data.map((p: any) => ({
            id: p.id,
            name: p.name ?? p.title ?? 'Untitled',
            shortDescription: p.short_description ?? '',
            fullDescription: p.full_description ?? '',
            price: p.price_cents ? Number(p.price_cents) : 0,
            image: optimizeCloudinaryUrl(p.image_url ?? '', { width: 400, height: 300 }) || '/placeholder-product.svg'
          }));

          setProducts(mapped);
          try { localStorage.setItem('products', JSON.stringify(mapped)); } catch { }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-3 py-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-3 text-foreground">
            Our Solar Collection
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Quality solar energy products for your sustainable future
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 mb-4">
          <input
            aria-label="Search products"
            placeholder="Search products..."
            className="w-full border rounded-lg px-3 py-2 text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <Button
              onClick={() => setSearch('')}
              variant="outline"
              className="shrink-0"
            >
              Clear
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center text-destructive py-8">{error}</div>
        ) : (
          <FilteredGrid products={products} search={search} favorites={favorites} toggleFavorite={toggleFavorite} setQuickViewProduct={setQuickViewProduct} />
        )}
      </div>



      <Dialog open={!!quickViewProduct} onOpenChange={() => setQuickViewProduct(null)}>
        <DialogContent className="w-full max-w-2xl mx-auto p-6">
          {quickViewProduct && (
            <div>
              <h2 className="text-2xl font-bold mb-4">{quickViewProduct?.name}</h2>
              <p className="text-2xl font-bold text-black mb-6">{formatNaira(quickViewProduct.price)}</p>

              <div className="text-sm text-gray-700 space-y-4 mb-8">
                {quickViewProduct.shortDescription && (
                  <p className="mb-4">{quickViewProduct.shortDescription}</p>
                )}
                <div className="space-y-2">
                  {quickViewProduct.fullDescription.split('\n').map((line: string, i: number) => (
                    line.trim() && (
                      <p key={i} className="flex gap-2">
                        <span>•</span>
                        <span>{line.trim()}</span>
                      </p>
                    )
                  ))}
                </div>
              </div>

              <a
                href={`https://wa.me/${COMPANY_PHONE.replace(/\D/g, '')}?text=${encodeURIComponent(formatWhatsAppMessage(quickViewProduct.name, quickViewProduct.price))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
                onClick={() => toast.success('Opening WhatsApp...', { duration: 2000 })}
              >
                <Button
                  className="w-full h-14 text-lg font-semibold text-white bg-[#25D366] hover:bg-[#1fa855]"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Order via WhatsApp
                </Button>
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {quickViewProduct && (
        // Mobile floating action button (FAB) — smaller and less intrusive than a full-width bar
        <div
          className="md:hidden"
          style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 9999, paddingRight: 'env(safe-area-inset-right)', paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <a
            href={`https://wa.me/${COMPANY_PHONE.replace(/\D/g, '')}?text=${encodeURIComponent(formatWhatsAppMessage(quickViewProduct.name, quickViewProduct.price))}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Order via WhatsApp"
          >
            <button
              className="rounded-full shadow-lg flex items-center justify-center"
              style={{ width: 56, height: 56, backgroundColor: '#25D366', color: '#fff', border: 'none' }}
            >
              <MessageCircle className="h-6 w-6" />
            </button>
          </a>
        </div>
      )}
    </div>
  );
};

const FilteredGrid = ({ products, search, favorites, toggleFavorite, setQuickViewProduct }: any) => {
  const filtered = useMemo(() => {
    const q = (search || '').toLowerCase().trim();
    let list = products.slice();

    if (q) {
      list = list.filter((p: any) =>
        (p.name || '').toLowerCase().includes(q) || (p.shortDescription || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [products, search]);

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No products match your search.</p>
      </div>
    );
  }

  return (
    <div>
      {search && (
        <p className="text-sm text-muted-foreground mb-3">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
        </p>
      )}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 animate-fade-in">
      {filtered.map((product: any) => (
        <ProductCard key={product.id} product={product} isFavorite={favorites.includes(product.id)} toggleFavorite={() => toggleFavorite(product.id)} setQuickViewProduct={setQuickViewProduct} />
      ))}
    </div>
    </div>
  );
};

export default Product;

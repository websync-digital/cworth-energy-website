import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { products as initialProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { LogIn, Sun, Moon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";
import { supabase } from '@/lib/supabaseClient';

const Product = () => {
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
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
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
            image: p.image_url ?? '/src/assets/placeholder.svg'
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
      <div className="max-w-7xl mx-auto px-4 py-12">


        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Our Premium Solar Collection
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our comprehensive range of high-quality solar energy products designed to power your sustainable future
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 mb-6">
          <input
            aria-label="Search products"
            placeholder="Search products..."
            className="w-full md:w-1/2 border rounded px-3 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={() => setSearch('')} variant="outline">Clear</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">Loading products...</div>
        ) : error ? (
          <div className="text-center text-destructive py-8">{error}</div>
        ) : (
          <FilteredGrid products={products} search={search} favorites={favorites} toggleFavorite={toggleFavorite} setQuickViewProduct={setQuickViewProduct} />
        )}
      </div>



      <Dialog open={!!quickViewProduct} onOpenChange={() => setQuickViewProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{quickViewProduct?.name}</DialogTitle>
            <DialogDescription>{quickViewProduct?.shortDescription}</DialogDescription>
          </DialogHeader>
          {quickViewProduct && (
            <div className="space-y-4">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="w-full h-48 object-cover rounded"
                loading="lazy"
              />
              <p className="text-2xl font-bold text-primary">₦{quickViewProduct.price.toLocaleString()}</p>
              <p className="text-muted-foreground">{quickViewProduct.fullDescription}</p>
              <div className="flex gap-2">
                <Link to={`/product/${quickViewProduct.id}`} className="flex-1">
                  <Button className="w-full">View Full Details</Button>
                </Link>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hi! I'm interested in the ${quickViewProduct.name} priced at ₦${quickViewProduct.price.toLocaleString()}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Order
                  </Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {quickViewProduct && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 md:hidden z-50">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Hi! I'm interested in the ${quickViewProduct.name} priced at ₦${quickViewProduct.price.toLocaleString()}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button className="w-full bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground font-semibold py-3">
              <MessageCircle className="mr-2 h-5 w-5" />
              Order via WhatsApp
            </Button>
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
        <p className="text-lg text-muted-foreground">No products match your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
      {filtered.map((product: any) => (
        <ProductCard key={product.id} product={product} isFavorite={favorites.includes(product.id)} toggleFavorite={() => toggleFavorite(product.id)} setQuickViewProduct={setQuickViewProduct} />
      ))}
    </div>
  );
};

export default Product;

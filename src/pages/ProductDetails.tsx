import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { products as initialProducts } from "@/data/products";

const ProductDetails = () => {
  const { id } = useParams();
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // normalize fields (support both demo data and supabase shape)
  const imageSrc = (product as any).image_url || (product as any).image || (product as any).imageUrl || '';
  const priceVal = (product as any).price ?? (product as any).price_cents ?? 0;
  const description = (product as any).fullDescription || (product as any).full_description || (product as any).short_description || '';

  const formatPrice = (v: number) => `₦${new Intl.NumberFormat('en-NG').format(v)}`;

  const whatsappMessage = `Hi, I'm interested in the ${product.name} priced at ${formatPrice(priceVal)}.`;
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Button>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 p-8 items-start">
            {/* Left: large image */}
            <div className="rounded-xl overflow-hidden bg-muted">
              {imageSrc ? (
                <img src={imageSrc} alt={product.name} className="w-full h-[520px] object-cover rounded-lg" />
              ) : (
                <div className="w-full h-[520px] bg-muted flex items-center justify-center text-muted-foreground">No image</div>
              )}
            </div>

            {/* Right: details */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-foreground uppercase">
                  {product.name}
                </h1>

                <div className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {formatPrice(Number(priceVal))}
                </div>

                <p className="text-base text-muted-foreground leading-relaxed mb-8">{description}</p>
              </div>

              <div>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl shadow-lg flex items-center justify-center gap-3">
                    <MessageCircle className="h-5 w-5" /> Order via WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

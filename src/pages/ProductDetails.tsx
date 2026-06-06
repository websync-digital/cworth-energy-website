import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { COMPANY_PHONE, formatWhatsAppMessage, formatNaira } from "@/lib/constants";
import { optimizeCloudinaryUrl } from "@/lib/cloudinaryClient";
import usePageTitle from "@/hooks/usePageTitle";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";

interface ProductRow {
  id: string;
  name: string;
  short_description: string;
  full_description: string;
  price_cents: number;
  image_url: string;
}

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('products')
      .select('id, name, short_description, full_description, price_cents, image_url')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setProduct(data);
        setLoading(false);
      });
  }, [id]);

  usePageTitle(product?.name);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex-grow flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/product">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const rawImage = product.image_url || '/placeholder-product.svg';
  const imageSrc = optimizeCloudinaryUrl(rawImage, { width: 800, height: 600, crop: 'fit' });
  const description = product.full_description || product.short_description || '';

  const whatsappMessage = formatWhatsAppMessage(product.name, formatNaira(product.price_cents));
  const whatsappLink = `https://wa.me/${COMPANY_PHONE.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Link to="/product">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
              </Button>
            </Link>
          </div>

          <div className="bg-white">
            <div className="max-w-4xl mx-auto p-6">
              <div className="space-y-6">
                {/* Product Image */}
                <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
                  <img src={imageSrc} alt={product.name} className="w-full h-full object-contain" />
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {product.name}
                  </h1>

                  <div className="text-3xl font-bold text-gray-900">
                    {formatNaira(product.price_cents)}
                  </div>

                  <div className="prose prose-gray max-w-none">
                    <h2 className="text-xl font-semibold mb-4">Product Description</h2>
                    {description.split('\n').map((line, i) => (
                      line.trim() && (
                        <p key={i} className="flex items-start gap-2 text-gray-600 mb-2">
                          <span className="mt-1.5">•</span>
                          <span>{line.trim()}</span>
                        </p>
                      )
                    ))}
                  </div>

                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block mt-8 mb-8" onClick={() => toast.success('Opening WhatsApp...', { duration: 2000 })}>
                    <Button className="w-full bg-[#25D366] hover:bg-[#1fa855] text-white h-14 text-lg font-semibold">
                      <MessageCircle className="h-6 w-6 mr-2" />
                      Order via WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>

  );
};

export default ProductDetails;

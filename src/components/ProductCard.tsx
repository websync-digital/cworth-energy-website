import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Star, Heart, Eye } from "lucide-react";
import { Product } from "@/data/products";
import { formatNaira } from "@/lib/constants";

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  toggleFavorite: () => void;
  setQuickViewProduct: (product: any) => void;
}

const ProductCard = ({ product, isFavorite, toggleFavorite, setQuickViewProduct }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.shortDescription}
        </p>
        <p className="text-xl font-bold text-blue-600 mb-4">{formatNaira(product.price)}</p>
        <Link to={`/product/${product.id}`}>
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Inquire More
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

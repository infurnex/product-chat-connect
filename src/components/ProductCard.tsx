
import { Product } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const handleAddToCart = () => {
    toast.success(`${product.name} added to cart!`);
  };

  const handleViewDetails = () => {
    toast.info(`Viewing details for ${product.name}`);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md animate-fade-in">
      <CardHeader className="p-0 relative">
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-medium shadow-sm">
          {product.source}
        </div>
        <div className="aspect-[4/3] bg-muted flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-32 h-32 object-contain"
          />
        </div>
      </CardHeader>
      <CardContent className="py-4 flex-grow">
        <h3 className="font-medium text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <p className="font-bold text-xl mt-3">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="pt-0 pb-4 flex flex-col gap-2 sm:flex-row">
        <Button 
          variant="outline" 
          className="w-full" 
          size="sm"
          onClick={handleViewDetails}
        >
          <Eye className="w-4 h-4 mr-2" /> View Details
        </Button>
        <Button 
          className="w-full bg-shopping-blue hover:bg-shopping-blue-dark" 
          size="sm"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

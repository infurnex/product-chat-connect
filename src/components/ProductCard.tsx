
import { Product } from "@/types/database";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, CreditCard, Star } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const handleCheckout = () => {
    toast.success(`Proceeding to checkout for ${product.name}!`);
  };

  const handleViewDetails = () => {
    toast.info(`Viewing details for ${product.name}`);
  };

  const truncateTitle = (title: string, maxLength: number = 30) => {
    if (title.length <= maxLength) return title;
    return title.slice(0, maxLength) + "...";
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md animate-fade-in">
      <CardHeader className="p-0 relative">
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-medium shadow-sm">
          {product.seller}
        </div>
        <div className="aspect-[4/3] bg-muted flex items-center justify-center">
          <img 
            src={product.image_url || '/placeholder.svg'} 
            alt={product.name}
            className="w-32 h-32 object-contain"
          />
        </div>
      </CardHeader>
      <CardContent className="py-4 flex-grow">
        <h3 className="font-medium text-lg mb-1" title={product.name}>
          {truncateTitle(product.name)}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{product.description}</p>
        {product.ratings && product.reviews && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.ratings}</span>
            <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
          </div>
        )}
        <p className="font-bold text-xl text-shopping-blue">${Number(product.price).toFixed(2)}</p>
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
          onClick={handleCheckout}
        >
          <CreditCard className="w-4 h-4 mr-2" /> Checkout
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

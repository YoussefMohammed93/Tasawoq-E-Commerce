"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/contexts/wishlist-context";
import { useCart } from "@/contexts/cart-context";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: {
    _id: Id<"products">;
    name: string;
    description: string;
    price: number;
    discountPercentage: number;
    mainImageUrl: string | null;
    badges?: string[];
    categoryId?: Id<"categories">;
    quantity?: number;
  };
  className?: string;
  aspectRatio?: "square" | "portrait" | "custom";
  variant?: "default" | "compact";
  showAddToCart?: boolean;
  showWishlistButton?: boolean;
  onAddToCart?: (productId: Id<"products">, e: React.MouseEvent) => void;
}

export function ProductCard({
  product,
  className,
  aspectRatio = "square",
  variant = "default",
  showAddToCart = true,
  showWishlistButton = true,
  onAddToCart,
}: ProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart, isProductInCart } = useCart();
  const isWishlisted = isInWishlist(product._id);
  const isInCart = isProductInCart(product._id);

  // Calculate discounted price
  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  // Check if product is out of stock
  const isOutOfStock = product.quantity !== undefined && product.quantity <= 0;

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Starting add to cart process...");

    // Don't add to cart if out of stock
    if (isOutOfStock) {
      e.preventDefault();
      return;
    }

    if (onAddToCart) {
      console.log("Using provided onAddToCart handler");
      onAddToCart(product._id, e);
    } else {
      console.log("Using default addToCart from context");
      // The addToCart function will automatically select the smallest size and first color
      addToCart(product._id, 1);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  // Determine aspect ratio class
  const aspectRatioClass = {
    square: "aspect-square",
    portrait: "aspect-[4/3]",
    custom: "",
  }[aspectRatio];

  return (
    <Link href={`/products/${product._id}`} className="block relative">
      <Card
        className={cn(
          "h-full flex flex-col p-0 overflow-hidden hover:bg-muted/50 transition-colors duration-300",
          variant === "compact"
            ? "h-[380px]"
            : "h-[450px] sm:h-[470px] lg:h-[450px]",
          className
        )}
      >
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl z-40">
            <div className="flex flex-col items-center gap-2 text-muted/90 bg-muted/20 p-6 rounded-full">
              <AlertTriangle className="size-8" />
              <span>نفذ المنتج</span>
            </div>
          </div>
        )}
        <div
          className={cn("relative w-full overflow-hidden", aspectRatioClass)}
        >
          <Image
            src={
              product.mainImageUrl &&
              typeof product.mainImageUrl === "string" &&
              product.mainImageUrl.startsWith("http")
                ? product.mainImageUrl
                : "/hoodie.png"
            }
            alt={product.name}
            fill
            className="object-contain p-2 sm:p-4 sm:pb-0 rounded-t-lg"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={(e) => {
              console.error(
                `Error loading image for product ${product._id}:`,
                e
              );
              (e.target as HTMLImageElement).src = "/hoodie.png";
            }}
          />

          {/* Out of Stock Overlay */}

          {/* Badges Container */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 flex flex-col gap-2">
            {/* Discount Badge */}
            {product.discountPercentage > 0 && (
              <Badge variant="destructive" className="w-full text-center">
                خصم {product.discountPercentage}%
              </Badge>
            )}

            {/* New Badge */}
            {product.badges?.includes("جديد") && (
              <Badge
                variant="default"
                className="w-full text-center bg-green-500"
              >
                جديد
              </Badge>
            )}

            {/* Special Offer Badge */}
            {product.badges?.includes("عرض خاص") && (
              <Badge
                variant="default"
                className="w-full text-center bg-blue-500"
              >
                عرض خاص
              </Badge>
            )}

            {/* Best Seller Badge */}
            {product.badges?.includes("الأكثر مبيعاً") && (
              <Badge
                variant="default"
                className="w-full text-center bg-amber-500"
              >
                الأكثر مبيعاً
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          {showWishlistButton && (
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={handleWishlistToggle}
            >
              <Heart
                className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5",
                  isWishlisted
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                )}
              />
            </Button>
          )}
        </div>

        <div className="p-3 pt-0 sm:p-4 flex flex-col gap-2 flex-1">
          <h3 className="font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-auto mb-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="font-bold text-primary text-sm sm:text-base">
                {discountedPrice.toFixed(2)} ر.س
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-xs text-muted-foreground line-through">
                  {product.price.toFixed(2)} ر.س
                </span>
              )}
            </div>
          </div>

          {showAddToCart && (
            <Button
              className="w-full gap-2 text-sm sm:text-base mt-auto"
              onClick={handleAddToCart}
              variant={
                isInCart
                  ? "secondary"
                  : isOutOfStock
                    ? "destructive"
                    : "default"
              }
              disabled={isInCart || isOutOfStock} // Disable if in cart or out of stock
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              {isInCart
                ? "في السلة"
                : isOutOfStock
                  ? "نفذ المنتج"
                  : "إضافة للسلة"}
            </Button>
          )}
        </div>
      </Card>
    </Link>
  );
}

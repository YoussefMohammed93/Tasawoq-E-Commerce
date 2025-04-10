"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/ui/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/contexts/cart-context";
import { Id } from "@/convex/_generated/dataModel";

const NewArrivalsSkeleton = () => {
  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-64 sm:w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index}>
              <Skeleton className="h-[380px] w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const NewArrivalsSection = () => {
  // Get the addToCart function from the cart context
  const { addToCart } = useCart();

  // Fetch products from backend
  const productsData = useQuery(api.products.getProducts);
  const isLoading = productsData === undefined;

  const handleAddToCart = (productId: Id<"products">, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Call the addToCart function with the product ID
    addToCart(productId, 1);
  };

  if (isLoading) {
    return <NewArrivalsSkeleton />;
  }

  // Filter products with "جديد" or "new" badge
  const newArrivals = productsData
    .filter(
      (product) =>
        product.badges &&
        (product.badges.includes("جديد") || product.badges.includes("new"))
    )
    .map((product) => ({
      ...product,
      mainImageUrl:
        product.mainImageUrl && typeof product.mainImageUrl === "string"
          ? product.mainImageUrl
          : "/hoodie.png",
    }))
    .slice(0, 4); // Limit to 4 products

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-8">
          <SectionHeading
            title="وصل حديثا"
            description="اكتشف أحدث المنتجات في متجرنا"
          />
        </div>
        {newArrivals.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">لا توجد منتجات جديدة حاليا</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                variant="compact"
                onAddToCart={(productId, e) => handleAddToCart(productId, e)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

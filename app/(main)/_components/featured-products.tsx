"use client";

import "keen-slider/keen-slider.min.css";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useKeenSlider } from "keen-slider/react";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/ui/section-heading";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProductCard } from "@/components/ui/product-card";
import { useCart } from "@/contexts/cart-context";
import { Id } from "@/convex/_generated/dataModel";

const ProductSkeletonItem = () => {
  return (
    <div className="keen-slider__slide">
      <Card className="h-[400px] lg:h-[380px] flex flex-col p-0">
        <div className="relative w-full h-[250px] lg:h-[230px]">
          <Skeleton className="absolute inset-0 w-full h-full rounded-t-xl rounded-b-none" />
          <Skeleton className="absolute top-3 right-3 h-6 w-16" />
          <Skeleton className="absolute top-3 left-3 h-9 w-9" />
        </div>
        <div className="flex flex-col flex-1 p-4 pt-0 gap-2.5">
          <div className="flex items-center gap-2 justify-between">
            <Skeleton className="h-5 w-20" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full mt-auto" />
        </div>
      </Card>
    </div>
  );
};

export const ProductsSectionSkeleton = () => {
  return (
    <section className="pb-16 pt-0 bg-background">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-5">
          <Skeleton className="h-10 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-64 sm:w-96 mx-auto" />
        </div>
        <div className="relative">
          <div className="keen-slider">
            <div className="w-full sm:hidden">
              <div className="block sm:hidden">
                <ProductSkeletonItem />
              </div>
            </div>
            <div className="hidden sm:block w-full">
              <div className="hidden w-full sm:grid sm:grid-cols-2 md:grid-cols-4 sm:gap-5">
                <ProductSkeletonItem />
                <ProductSkeletonItem />
                <ProductSkeletonItem />
                <ProductSkeletonItem />
              </div>
            </div>
          </div>
          <div className="flex flex-row-reverse justify-center gap-2 mt-4">
            {[...Array(4)].map((_, idx) => (
              <Skeleton key={idx} className="w-2 h-2 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const ProductsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Get the addToCart function from the cart context
  const { addToCart } = useCart();

  // Fetch products from backend
  const productsData = useQuery(api.products.getProducts);
  const isLoading = productsData === undefined;

  // No need to get wishlist functionality here as it's handled in the ProductCard component

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    rtl: true,
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 2, spacing: 16 },
        rtl: false,
      },
      "(min-width: 1024px)": {
        slides: { perView: 3, spacing: 16 },
      },
      "(min-width: 1280px)": {
        slides: { perView: 4, spacing: 16 },
      },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  if (isLoading) {
    return <ProductsSectionSkeleton />;
  }

  // Filter products with "عرض خاص" or "الأكثر مبيعاً" badge
  const featuredProducts = productsData
    .filter(
      (product) =>
        product.badges &&
        (product.badges.includes("عرض خاص") ||
          product.badges.includes("الأكثر مبيعاً"))
    )
    .slice(0, 10); // Limit to 10 products

  const totalSlides = instanceRef.current?.track.details.slides.length || 0;
  const perView =
    typeof instanceRef.current?.options.slides === "object"
      ? instanceRef.current?.options?.slides &&
        "perView" in instanceRef.current.options.slides
        ? instanceRef.current.options.slides.perView
        : 1
      : 1;
  // Reverse the logic for RTL
  const isAtStart =
    currentSlide >= totalSlides - (typeof perView === "number" ? perView : 1);
  const isAtEnd = currentSlide === 0;

  const handleAddToCart = (productId: Id<"products">, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Call the addToCart function with the product ID
    addToCart(productId, 1);
  };

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-5">
          <SectionHeading
            title="منتجات مميزة"
            description="اكتشف مجموعة متنوعة من المنتجات العصرية والأنيقة"
          />
        </div>
        {featuredProducts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">لا توجد منتجات مميزة حال</p>
          </div>
        ) : (
          <div className="relative">
            <div ref={sliderRef} className="keen-slider">
              {featuredProducts.map((product) => (
                <div className="keen-slider__slide" key={product._id}>
                  <ProductCard
                    key={product._id}
                    product={product}
                    variant="compact"
                    onAddToCart={(productId, e) =>
                      handleAddToCart(productId, e)
                    }
                  />
                </div>
              ))}
            </div>
            {loaded && instanceRef.current && (
              <>
                <Button
                  size="icon"
                  className="absolute top-1/2 -translate-y-1/2 -left-2 sm:-left-4 xl:-left-16 rounded-full flex opacity-100 disabled:opacity-50 transition-opacity"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    instanceRef.current?.next();
                  }}
                  disabled={!instanceRef.current || isAtStart}
                >
                  <ChevronLeft className="size-5" />
                </Button>

                <Button
                  size="icon"
                  className="absolute top-1/2 -translate-y-1/2 -right-2 sm:-right-4 xl:-right-16 rounded-full flex opacity-100 disabled:opacity-50 transition-opacity"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    instanceRef.current?.prev();
                  }}
                  disabled={!instanceRef.current || isAtEnd}
                >
                  <ChevronRight className="size-5" />
                </Button>
                {instanceRef.current &&
                  instanceRef.current.track &&
                  instanceRef.current.track.details &&
                  instanceRef.current.track.details.slides &&
                  instanceRef.current.track.details.slides.length > 0 && (
                    <div className="flex flex-row justify-center gap-2 mt-6">
                      {[
                        ...Array(
                          instanceRef.current.track.details.slides.length
                        ),
                      ].map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            instanceRef.current?.moveToIdx(idx);
                          }}
                          className={`w-2 h-2 rounded-full transition-all ${
                            currentSlide === idx
                              ? "bg-primary w-4"
                              : "bg-primary/20"
                          }`}
                          aria-label={`الانتقال إلى الشريحة ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

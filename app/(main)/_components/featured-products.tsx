"use client";

import Link from "next/link";
import Image from "next/image";
import "keen-slider/keen-slider.min.css";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useKeenSlider } from "keen-slider/react";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/ui/section-heading";
import { ShoppingCart, ChevronLeft, ChevronRight, Heart } from "lucide-react";

const products = [
  {
    id: 1,
    title: "حقيبة يد جلدية فاخرة",
    image: "/t-shirt.png",
    description: "حقيبة يد نسائية مصنوعة من الجلد الطبيعي الفاخر",
    category: "حقائب نسائية",
    price: 799.99,
    discountPercentage: 15,
  },
  {
    id: 2,
    title: "ساعة ذكية رياضية",
    image: "/t-shirt.png",
    description: "ساعة ذكية متعددة الوظائف لتتبع النشاط الرياضي",
    category: "الساعات الذكية",
    price: 499.99,
    discountPercentage: 10,
  },
  {
    id: 3,
    title: "نظارة شمسية كلاسيكية",
    image: "/t-shirt.png",
    description: "نظارة شمسية بتصميم كلاسيكي أنيق",
    category: "نظارات",
    price: 299.99,
    discountPercentage: 0,
  },
  {
    id: 4,
    title: "عطر فاخر للرجال",
    image: "/t-shirt.png",
    description: "عطر رجالي فاخر برائحة منعشة",
    category: "عطور",
    price: 450.99,
    discountPercentage: 5,
  },
  {
    id: 5,
    title: "عطر فاخر للرجال",
    image: "/t-shirt.png",
    description: "عطر رجالي فاخر برائحة منعشة",
    category: "عطور",
    price: 450.99,
    discountPercentage: 5,
  },
];

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
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ProductsSectionSkeleton />;
  }

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleAddToWishlist = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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

        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {products.map((product) => {
              const originalPrice =
                product.discountPercentage > 0
                  ? product.price / (1 - product.discountPercentage / 100)
                  : product.price;

              return (
                <div className="keen-slider__slide" key={product.id}>
                  <Link
                    href={`/products/${product.id}`}
                    className="block group"
                  >
                    <Card className="h-[400px] lg:h-[380px] flex flex-col p-0">
                      <div className="relative w-full h-[250px] lg:h-[230px] overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-contain rounded-t-xl p-4"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        />
                        {product.discountPercentage > 0 && (
                          <Badge
                            variant="destructive"
                            className="absolute top-3 right-3 z-10 shadow-md"
                          >
                            خصم {product.discountPercentage}%
                          </Badge>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute top-3 left-3 z-10"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToWishlist();
                          }}
                        >
                          <Heart className="h-5 w-5 text-primary" />
                        </Button>
                      </div>
                      <div className="flex flex-col flex-1 p-4 pt-0 gap-2.5">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary text-base">
                              {product.price.toFixed(2)} ر.س
                            </span>
                            {product.discountPercentage > 0 && (
                              <span className="text-muted-foreground line-through text-xs">
                                {originalPrice.toFixed(2)} ر.س
                              </span>
                            )}
                          </div>
                        </div>
                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {product.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                          {product.description}
                        </p>
                        <Button
                          className="w-full gap-2 mt-auto"
                          size="default"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(e);
                          }}
                        >
                          <ShoppingCart className="h-5 w-5" />
                          إضافة للسلة
                        </Button>
                      </div>
                    </Card>
                  </Link>
                </div>
              );
            })}
          </div>

          {loaded && instanceRef.current && (
            <>
              <Button
                size="icon"
                className="absolute top-1/2 -translate-y-1/2 -left-2 sm:-left-4 xl:-left-16 rounded-full flex opacity-100 disabled:opacity-50 transition-opacity"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  instanceRef.current?.next(); // Changed from prev() to next()
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
                  instanceRef.current?.prev(); // Changed from next() to prev()
                }}
                disabled={!instanceRef.current || isAtEnd}
              >
                <ChevronRight className="size-5" />
              </Button>

              <div className="flex flex-row justify-center gap-2 mt-6">
                {[
                  ...Array(instanceRef.current.track.details.slides.length),
                ].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      instanceRef.current?.moveToIdx(idx);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentSlide === idx ? "bg-primary w-4" : "bg-primary/20"
                    }`}
                    aria-label={`الانتقال إلى الشريحة ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import "keen-slider/keen-slider.min.css";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useKeenSlider } from "keen-slider/react";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/ui/section-heading";
import { ShoppingCart, ChevronLeft, ChevronRight, Heart } from "lucide-react";

const AUTOPLAY_INTERVAL = 3000;

const salesProducts = [
  {
    id: 1,
    title: "حقيبة يد جلدية فاخرة",
    image: "https://picsum.photos/400/400?random=20",
    description: "حقيبة يد نسائية مصنوعة من الجلد الطبيعي الفاخر",
    category: "حقائب نسائية",
    price: 799.99,
    discountPercentage: 25,
  },
  {
    id: 2,
    title: "ساعة ذكية رياضية",
    image: "https://picsum.photos/400/400?random=21",
    description: "ساعة ذكية متعددة الوظائف لتتبع النشاط الرياضي",
    category: "الساعات الذكية",
    price: 499.99,
    discountPercentage: 30,
  },
  {
    id: 3,
    title: "نظارة شمسية كلاسيكية",
    image: "https://picsum.photos/400/400?random=22",
    description: "نظارة شمسية بتصميم كلاسيكي أنيق",
    category: "نظارات",
    price: 299.99,
    discountPercentage: 20,
  },
  {
    id: 4,
    title: "عطر فاخر للرجال",
    image: "https://picsum.photos/400/400?random=23",
    description: "عطر رجالي فاخر برائحة منعشة",
    category: "عطور",
    price: 450.99,
    discountPercentage: 15,
  },
  {
    id: 5,
    title: "عطر للرجال",
    image: "https://picsum.photos/400/400?random=24",
    description: "عطر رجالي فاخر برائحة منعشة",
    category: "عطور",
    price: 150.99,
    discountPercentage: 5,
  },
];

const SalesSkeletonItem = () => {
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

export const SalesSectionSkeleton = () => {
  return (
    <section className="pb-16 pt-0 bg-background">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-5">
          <Skeleton className="h-10 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="relative">
          <div className="keen-slider">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <SalesSkeletonItem key={index} />
              ))}
            </div>
          </div>
          <Skeleton className="absolute top-1/2 -translate-y-1/2 -left-4 xl:-left-16 h-10 w-10 rounded-full" />
          <Skeleton className="absolute top-1/2 -translate-y-1/2 -right-4 xl:-right-16 h-10 w-10 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export const SalesSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isMobile = useIsMobile();

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
    dragStarted() {
      setIsPaused(true);
    },
    dragEnded() {
      setIsPaused(false);
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded || !instanceRef.current || isPaused || !isMobile) return;

    const interval = setInterval(() => {
      if (instanceRef.current) {
        const lastSlide =
          currentSlide === instanceRef.current.track.details.slides.length - 1;

        if (lastSlide) {
          instanceRef.current.moveToIdx(0);
        } else {
          instanceRef.current.next();
        }
      }
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [loaded, currentSlide, instanceRef, isPaused, isMobile]);

  if (isLoading) {
    return <SalesSectionSkeleton />;
  }

  const totalSlides = instanceRef.current?.track.details.slides.length || 0;
  const perView =
    typeof instanceRef.current?.options.slides === "object"
      ? instanceRef.current?.options?.slides &&
        "perView" in instanceRef.current.options.slides
        ? instanceRef.current.options.slides.perView
        : 1
      : 1;
  const isAtStart = currentSlide === 0;
  const isAtEnd =
    currentSlide >= totalSlides - (typeof perView === "number" ? perView : 1);

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
            title="تخفيضات حصرية"
            description="اكتشف أفضل العروض والتخفيضات على منتجاتنا المميزة"
          />
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div ref={sliderRef} className="keen-slider">
            {salesProducts.map((product) => {
              const originalPrice =
                product.price / (1 - product.discountPercentage / 100);

              return (
                <div className="keen-slider__slide" key={product.id}>
                  <Link
                    href={`/products/${product.id}`}
                    className="block group"
                  >
                    <Card className="h-[400px] lg:h-[380px] flex flex-col p-0">
                      <div className="relative w-full h-[250px] lg:h-[230px] overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
                        />
                        <Badge
                          variant="destructive"
                          className="absolute top-3 right-3 z-10 shadow-md"
                        >
                          خصم {product.discountPercentage}%
                        </Badge>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute top-3 left-3 z-10"
                          onClick={handleAddToWishlist}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-col p-4 flex-1">
                        <div className="flex items-center gap-2 justify-between">
                          <Badge variant="outline">{product.category}</Badge>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary">
                              {product.price} ر.س
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {originalPrice.toFixed(2)} ر.س
                            </span>
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
                          onClick={handleAddToCart}
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
                className={`absolute top-1/2 -translate-y-1/2 -left-4 xl:-left-16 rounded-full hidden md:flex ${
                  isAtEnd ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => instanceRef.current?.next()}
                disabled={isAtEnd}
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                size="icon"
                className={`absolute top-1/2 -translate-y-1/2 -right-4 xl:-right-16 rounded-full hidden md:flex ${
                  isAtStart ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => instanceRef.current?.prev()}
                disabled={isAtStart}
              >
                <ChevronRight className="size-5" />
              </Button>
              <div className="flex md:hidden flex-row-reverse justify-center gap-2 mt-4">
                {[...Array(totalSlides)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      instanceRef.current?.moveToIdx(idx);
                      setIsPaused(true);
                      setTimeout(() => setIsPaused(false), 5000);
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

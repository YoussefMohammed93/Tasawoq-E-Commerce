"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useKeenSlider } from "keen-slider/react";
import { Calendar, StarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Removed hardcoded reviews

const ReviewSkeletonItem = () => {
  return (
    <div className="keen-slider__slide">
      <Card className="p-6 pb-0 h-[200px]">
        <div className="flex items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-5 w-32 mb-2" />
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, idx) => (
                <Skeleton key={idx} className="h-4 w-4" />
              ))}
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-4/5 mb-2" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center gap-2 mt-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const ReviewsSectionSkeleton = () => {
  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-10">
          <Skeleton className="h-10 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-80 sm:w-96 mx-auto" />
        </div>
        <div className="relative">
          <div className="keen-slider">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ReviewSkeletonItem />
              <div className="hidden sm:block">
                <ReviewSkeletonItem />
              </div>
              <div className="hidden lg:block">
                <ReviewSkeletonItem />
              </div>
            </div>
          </div>
          <Skeleton className="absolute top-1/2 -translate-y-1/2 -left-4 xl:-left-16 h-10 w-10 rounded-md hidden md:block" />
          <Skeleton className="absolute top-1/2 -translate-y-1/2 -right-4 xl:-right-16 h-10 w-10 rounded-md hidden md:block" />
          <div className="flex flex-row-reverse justify-center gap-2 mt-4 md:hidden">
            <Skeleton className="w-2 h-2 rounded-full" />
            <div className="hidden sm:block">
              <Skeleton className="w-2 h-2 rounded-full" />
            </div>
            <div className="hidden lg:block">
              <Skeleton className="w-2 h-2 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ReviewsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Fetch featured reviews from the backend
  const featuredReviews = useQuery(api.reviews.getFeaturedReviews) || [];
  const isLoading = featuredReviews === undefined;

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
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  if (isLoading) {
    return <ReviewsSectionSkeleton />;
  }

  // If no featured reviews, don't show the section
  if (featuredReviews.length === 0) {
    return null;
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

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-10">
          <SectionHeading
            title="آراء العملاء"
            description="ماذا يقول عملاؤنا عن تجربتهم معنا"
          />
        </div>
        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {featuredReviews.map((review) => (
              <div key={review._id} className="keen-slider__slide">
                <Card className="p-6 pb-0 h-[200px]">
                  <div className="flex items-start gap-4">
                    <div className="relative w-10 h-10">
                      <Image
                        src={review.userImage || "/avatar.png"}
                        alt={review.userName}
                        fill
                        className="object-contain rounded-full"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1">{review.userName}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-amber-500 fill-amber-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground line-clamp-3">
                        <b>{review.comment}</b>
                      </p>
                      <div className="flex items-center gap-2 text-muted-foreground mt-3">
                        <Calendar className="size-3.5" />
                        <p className="text-sm mt-1">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString(
                                "ar-SA"
                              )
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
          {loaded && instanceRef.current && (
            <>
              <Button
                size="icon"
                className={`absolute top-1/2 -translate-y-1/2 -left-2 sm:-left-4 xl:-left-16 rounded-full flex ${
                  isAtEnd ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => instanceRef.current?.next()}
                disabled={isAtEnd}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                size="icon"
                className={`absolute top-1/2 -translate-y-1/2 -right-2 sm:-right-4 xl:-right-16 rounded-full flex ${
                  isAtStart ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => instanceRef.current?.prev()}
                disabled={isAtStart}
              >
                <ChevronRight className="size-4" />
              </Button>
              <div className="flex justify-center gap-2 mt-6">
                {[...Array(totalSlides)].map((_, idx) => (
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

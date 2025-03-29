/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftIcon, ShoppingBagIcon } from "lucide-react";

const HeroSectionSkeleton = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-5 relative py-20 pt-28">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 xl:gap-16">
          <div className="flex flex-col justify-center space-y-4 max-w-xl w-full">
            <div className="space-y-2">
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-4/5" />
            </div>
            <div className="flex flex-col gap-2 min-[450px]:flex-row">
              <Skeleton className="h-12 w-full min-[450px]:w-36" />
              <Skeleton className="h-12 w-full min-[450px]:w-36" />
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex -space-x-4 rtl:space-x-reverse">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-10 rounded-full" />
                ))}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
          <div className="w-full max-w-[550px] flex-shrink-0">
            <Skeleton className="aspect-[2/2] w-full rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export const HeroSection = () => {
  const heroData = useQuery(api.hero.getHero);
  const mainImageUrl = useQuery(
    api.files.getImageUrl,
    heroData?.mainImage ? { storageId: heroData.mainImage } : "skip"
  );
  const customerImageUrls = useQuery(
    api.files.getMultipleImageUrls,
    heroData?.customerImages ? { storageIds: heroData.customerImages } : "skip"
  );

  if (!heroData) {
    return <HeroSectionSkeleton />;
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-5 relative py-20 pt-28">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 xl:gap-16">
          <div className="flex flex-col justify-center space-y-4 max-w-xl">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                {heroData.title}
              </h1>
              <p className="text-gray-500 md:text-xl dark:text-gray-400">
                {heroData.description}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[450px]:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href={heroData.primaryButtonHref}>
                  {heroData.primaryButtonText}
                  <ShoppingBagIcon className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href={heroData.secondaryButtonHref}>
                  {heroData.secondaryButtonText}
                  <ArrowLeftIcon className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex -space-x-4 rtl:space-x-reverse">
                {customerImageUrls?.map((url, i) => (
                  <div
                    key={i}
                    className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-background"
                  >
                    <img
                      src={url ?? `https://picsum.photos/100/100?random=${i}`}
                      alt={`Customer ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-medium">
                  +{heroData.customerCount} {heroData.customerText}
                </p>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full max-w-[550px] flex-shrink-0">
            <div className="relative aspect-[2/2] w-full overflow-hidden rounded-xl">
              <img
                src={mainImageUrl ?? "https://picsum.photos/800/1200?random=2"}
                alt={heroData.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

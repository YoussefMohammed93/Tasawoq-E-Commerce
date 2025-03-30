"use client";

import Link from "next/link";
import Image from "next/image";
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
                {[...Array(5)].map((_, i) => (
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
    heroData?.customerImages?.length
      ? { storageIds: heroData.customerImages }
      : "skip"
  );

  if (
    heroData === undefined ||
    (heroData?.mainImage && mainImageUrl === undefined) ||
    (heroData?.customerImages?.length && customerImageUrls === undefined)
  ) {
    return <HeroSectionSkeleton />;
  }

  const data = heroData || {
    title: "العنوان الرئيسي",
    description: "وصف القسم الرئيسي",
    mainImage: null,
    primaryButtonText: "الزر الرئيسي",
    primaryButtonHref: "/",
    secondaryButtonText: "الزر الثانوي",
    secondaryButtonHref: "/",
    customerCount: 100,
    customerText: "عميل سعيد",
    customerImages: ["/avatar.png"],
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-background/70 to-background/95" />
        <div className="absolute inset-0 opacity-30 mix-blend-soft-light">
          <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,var(--primary),transparent)]" />
        </div>
      </div>
      <div
        role="presentation"
        className="absolute hidden md:block top-60 -left-64 w-96 h-96 bg-primary/10 dark:bg-primary/15 rounded-full blur-3xl animate-pulse"
      />
      <div
        role="presentation"
        className="absolute hidden md:block top-12 -right-64 w-96 h-96 bg-primary/15 dark:bg-primary/10 rounded-full blur-3xl animate-pulse"
      />
      <div
        role="presentation"
        className="absolute hidden lg:block bottom-20 left-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse"
      />
      <div
        role="presentation"
        className="absolute hidden lg:block top-1/3 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="max-w-7xl mx-auto px-5 relative py-12 pt-28">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 xl:gap-16">
          <div className="flex flex-col justify-center space-y-4 max-w-xl">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                {data.title}
              </h1>
              <p className="text-muted-foreground py-3">{data.description}</p>
            </div>
            <div className="flex flex-col gap-2 min-[450px]:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href={data.primaryButtonHref}>
                  {data.primaryButtonText}
                  <ShoppingBagIcon className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href={data.secondaryButtonHref}>
                  {data.secondaryButtonText}
                  <ArrowLeftIcon className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex -space-x-4 rtl:space-x-reverse">
                {(customerImageUrls || data.customerImages).map((url, i) => (
                  <div
                    key={i}
                    className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-background"
                  >
                    <Image
                      src={
                        typeof url === "string" && url.startsWith("http")
                          ? url
                          : "/avatar.png"
                      }
                      alt={`Customer ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-medium">
                  +{data.customerCount} {data.customerText}
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
              <Image
                src={
                  typeof mainImageUrl === "string" &&
                  mainImageUrl.startsWith("http")
                    ? mainImageUrl
                    : "/hero.png"
                }
                alt={data.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 550px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

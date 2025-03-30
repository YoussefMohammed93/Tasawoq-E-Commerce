"use client";

import Link from "next/link";
import Image from "next/image";
import { TagIcon } from "lucide-react";
import { useQuery } from "convex/react";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/ui/section-heading";

const LoadingSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
    {[...Array(8)].map((_, i) => (
      <Skeleton key={i} className="h-[160px]" />
    ))}
  </div>
);

export const CategoriesSection = () => {
  const categories = useQuery(api.categories.getCategories);
  const pageData = useQuery(api.categories.getCategoriesPage);

  const categoryImageUrls = useQuery(
    api.files.getMultipleImageUrls,
    categories?.length
      ? {
          storageIds: categories.map((category) => category.image),
        }
      : "skip"
  );

  if (categories === undefined || pageData === undefined) {
    return (
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  if (!pageData?.isVisible) {
    return null;
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center pb-12">
        <div className="bg-muted p-5 rounded-full mb-4">
          <TagIcon className="h-9 w-9 text-muted-foreground" />
        </div>
        <h3 className="text-lg sm:text-xl font-medium mb-2">
          لا توجد فئات متاحة حاليًا.
        </h3>
        <p className="text-sm sm:text-lg text-muted-foreground max-w-[500px]">
          لم يتم إضافة أي فئات بعد, يرجى العودة لاحقٍ.
        </p>
      </div>
    );
  }

  const getGridCols = (itemCount: number) => {
    if (itemCount <= 2) return "lg:grid-cols-2";
    if (itemCount === 3) return "lg:grid-cols-3";
    if (itemCount === 4) return "lg:grid-cols-4";
    if (itemCount === 5) return "lg:grid-cols-5";
    if (itemCount === 6) return "lg:grid-cols-6";
    if (itemCount === 7) return "lg:grid-cols-7";
    if (itemCount === 8) return "lg:grid-cols-8";

    return "lg:grid-cols-8";
  };

  const gridCols = getGridCols(categories.length);

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-12">
          <SectionHeading
            title={pageData.title || "تصفح حسب الفئات"}
            description={
              pageData.description || "اكتشف منتجاتنا المميزة في مختلف الفئات"
            }
          />
        </div>
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${gridCols} gap-4`}
        >
          {categories.map((category) => (
            <Link
              key={category._id}
              href={category.href}
              className="block h-[160px]"
            >
              <Card className="group h-full relative overflow-hidden transition-all duration-300">
                <div
                  className={`absolute inset-0 translate-x-[-100%] translate-y-[-100%] group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300 ease-in-out group-hover:bg-primary/5`}
                />
                <div className="relative h-full w-full flex flex-col items-center justify-center gap-3">
                  <div className="w-18 h-18 flex items-center justify-center rounded-full bg-primary/10">
                    <Image
                      src={
                        categoryImageUrls?.[
                          categories.findIndex((c) => c._id === category._id)
                        ] ?? "/placeholder.png"
                      }
                      alt={category.name}
                      width={40}
                      height={40}
                      className="h-10 w-10"
                    />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground duration-300 ease-in-out group-hover:text-foreground">
                    {category.name}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

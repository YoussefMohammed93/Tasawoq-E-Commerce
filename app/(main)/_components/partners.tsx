"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { Building2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/ui/section-heading";

const PartnersSectionSkeleton = () => {
  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-16">
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center sm:hidden"
            >
              <Skeleton className="w-full aspect-square mb-4" />
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="hidden sm:flex flex-col items-center justify-center"
            >
              <Skeleton className="w-full aspect-square mb-4" />
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const PartnersSection = () => {
  const partners = useQuery(api.partners.getPartners);
  const pageData = useQuery(api.partners.getPartnersPage);

  if (partners === undefined || pageData === undefined) {
    return <PartnersSectionSkeleton />;
  }

  if (!pageData?.isVisible) {
    return null;
  }

  if (!partners?.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center pb-12">
        <div className="bg-muted p-5 rounded-full mb-4">
          <Building2 className="h-9 w-9 text-muted-foreground" />
        </div>
        <h3 className="text-lg sm:text-xl font-medium mb-2">
          لا يوجد شركاء متاحين حاليًا.
        </h3>
        <p className="text-sm sm:text-lg text-muted-foreground max-w-[500px]">
          لم يتم إضافة أي شركاء بعد, يرجى العودة لاحقًا.
        </p>
      </div>
    );
  }

  const sortedPartners = [...partners].sort((a, b) => a.order - b.order);

  const getGridCols = (itemCount: number) => {
    if (itemCount <= 2) return "lg:grid-cols-2";
    if (itemCount === 3) return "lg:grid-cols-3";
    if (itemCount === 4) return "lg:grid-cols-4";
    if (itemCount === 5) return "lg:grid-cols-5";
    if (itemCount === 6) return "lg:grid-cols-6";
    if (itemCount === 7) return "lg:grid-cols-7";
    return "lg:grid-cols-8";
  };

  const gridCols = getGridCols(sortedPartners.length);

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-12">
          <SectionHeading
            title={pageData?.title || "شركاؤنا المعتمدون"}
            description={
              pageData?.description ||
              "نفخر بشراكتنا مع أكبر العلامات التجارية العالمية"
            }
          />
        </div>
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${gridCols} gap-16`}
        >
          {sortedPartners.map((partner) => (
            <div
              key={partner._id}
              className="flex flex-col items-center justify-center group"
            >
              <div className="relative w-full aspect-[1/1] mb-4">
                <Image
                  src={partner.imageUrl || "/placeholder.png"}
                  alt={partner.name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-sm sm:text-lg sm:font-semibold text-muted-foreground group-hover:text-primary transition-colors duration-300">
                {partner.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

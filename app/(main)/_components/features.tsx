"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeading } from "@/components/ui/section-heading";

export const FeaturesSection = () => {
  const features = useQuery(api.features.getFeatures);
  const pageData = useQuery(api.features.getFeaturesPage);

  if (features === undefined || pageData === undefined) {
    return (
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="block sm:hidden">
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="flex flex-col my-5 items-center justify-center"
              >
                <Skeleton className="h-48 w-full" />
              </div>
            ))}
          </div>
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="relative rounded-lg bg-card">
                <Skeleton className="h-48 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!pageData?.isVisible) {
    return null;
  }

  if (!features?.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="bg-muted p-5 rounded-full mb-4">
          <Sparkles className="h-9 w-9 text-muted-foreground" />
        </div>
        <h3 className="text-lg sm:text-xl font-medium mb-2">
          لا توجد مميزات متاحة حاليًا
        </h3>
        <p className="text-sm sm:text-lg text-muted-foreground max-w-[500px]">
          لم يتم إضافة أي مميزات بعد, يرجى العودة لاحقًا
        </p>
      </div>
    );
  }

  const sortedFeatures = [...features].sort((a, b) => a.order - b.order);

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-12">
          <SectionHeading
            title={pageData?.title || "مميزات المتجر"}
            description={
              pageData?.description || "نقدم لكم أفضل الخدمات لتجربة تسوق مميزة"
            }
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedFeatures.map((feature) => (
            <div
              key={feature._id}
              className="group relative p-6 rounded-lg border bg-card overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0" />
              <div className="relative z-10 flex flex-col items-center text-center transition-colors duration-300">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-white/10">
                  <Image
                    src={feature.imageUrl ?? ""}
                    alt={feature.name}
                    width={40}
                    height={40}
                    className="transition-colors"
                  />
                </div>
                <h3 className="font-semibold mb-2 transition-colors duration-300 group-hover:text-white">
                  {feature.name}
                </h3>
                <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-white/80">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

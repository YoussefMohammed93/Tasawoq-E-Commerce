/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const newArrivals = [
  {
    id: 1,
    title: "حقيبة كتف عصرية",
    image: "https://picsum.photos/400/400?random=10",
    description: "حقيبة كتف نسائية أنيقة مناسبة للاستخدام اليومي",
    category: "حقائب نسائية",
    price: 299.99,
    isNew: true,
  },
  {
    id: 2,
    title: "سماعات بلوتوث لاسلكية",
    image: "https://picsum.photos/400/400?random=11",
    description: "سماعات بجودة صوت عالية مع خاصية إلغاء الضوضاء",
    category: "إلكترونيات",
    price: 499.99,
    isNew: true,
  },
  {
    id: 3,
    title: "نظارة شمسية أنيقة",
    image: "https://picsum.photos/400/400?random=12",
    description: "نظارة شمسية بتصميم عصري وحماية UV",
    category: "اكسسوارات",
    price: 199.99,
    isNew: true,
  },
  {
    id: 4,
    title: "نظارة شمسية جيدة",
    image: "https://picsum.photos/400/400?random=13",
    description: "نظارة شمسية بتصميم عصري وحماية UV",
    category: "اكسسوارات",
    price: 149.99,
    isNew: true,
  },
];

export const NewArrivalsSection = () => {
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
        <div className="text-center mb-8">
          <SectionHeading
            title="وصل حديثا"
            description="اكتشف أحدث المنتجات في متجرنا"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <Link
              key={product.id}
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
                    variant="secondary"
                    className="absolute top-3 right-3 z-10 shadow-md bg-primary text-white"
                  >
                    جديد
                  </Badge>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-3 left-3 z-10"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToWishlist();
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col p-4 flex-1">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary text-base">
                      {product.price} ر.س
                    </span>
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      أضف للسلة
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

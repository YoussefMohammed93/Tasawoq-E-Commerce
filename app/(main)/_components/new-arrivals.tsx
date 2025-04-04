"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/ui/product-card";
import { Id } from "@/convex/_generated/dataModel";

const newArrivals = [
  {
    _id: "1" as Id<"products">,
    name: "حقيبة كتف عصرية",
    mainImageUrl: "/t-shirt.png",
    description: "حقيبة كتف نسائية أنيقة مناسبة للاستخدام اليومي",
    price: 299.99,
    discountPercentage: 0,
    badges: ["جديد"],
  },
  {
    _id: "2" as Id<"products">,
    name: "سماعات بلوتوث لاسلكية",
    mainImageUrl: "/t-shirt.png",
    description: "سماعات بجودة صوت عالية مع خاصية إلغاء الضوضاء",
    price: 499.99,
    discountPercentage: 0,
    badges: ["جديد"],
  },
  {
    _id: "3" as Id<"products">,
    name: "نظارة شمسية أنيقة",
    mainImageUrl: "/t-shirt.png",
    description: "نظارة شمسية بتصميم عصري وحماية UV",
    price: 199.99,
    discountPercentage: 0,
    badges: ["جديد"],
  },
  {
    _id: "4" as Id<"products">,
    name: "نظارة شمسية جيدة",
    mainImageUrl: "/t-shirt.png",
    description: "نظارة شمسية بتصميم عصري وحماية UV",
    price: 149.99,
    discountPercentage: 0,
    badges: ["جديد"],
  },
];

export const NewArrivalsSection = () => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
            <ProductCard
              key={product._id}
              product={product}
              variant="compact"
              onAddToCart={(_, e) => handleAddToCart(e)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

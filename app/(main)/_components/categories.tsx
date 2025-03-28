"use client";

import {
  ShoppingBag,
  Watch,
  Smartphone,
  Headphones,
  Shirt,
  ShoppingBasket,
  Footprints,
  Glasses,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const categories = [
  {
    name: "حقائب",
    icon: ShoppingBag,
    href: "/categories/bags",
    color: "bg-pink-500/10 text-pink-500",
    hoverColor: "group-hover:bg-pink-500",
  },
  {
    name: "ساعات",
    icon: Watch,
    href: "/categories/watches",
    color: "bg-blue-500/10 text-blue-500",
    hoverColor: "group-hover:bg-blue-500",
  },
  {
    name: "إلكترونيات",
    icon: Smartphone,
    href: "/categories/electronics",
    color: "bg-purple-500/10 text-purple-500",
    hoverColor: "group-hover:bg-purple-500",
  },
  {
    name: "اكسسوارات",
    icon: Headphones,
    href: "/categories/accessories",
    color: "bg-amber-500/10 text-amber-500",
    hoverColor: "group-hover:bg-amber-500",
  },
  {
    name: "ملابس",
    icon: Shirt,
    href: "/categories/clothes",
    color: "bg-green-500/10 text-green-500",
    hoverColor: "group-hover:bg-green-500",
  },
  {
    name: "أدوات منزلية",
    icon: ShoppingBasket,
    href: "/categories/home",
    color: "bg-red-500/10 text-red-500",
    hoverColor: "group-hover:bg-red-500",
  },
  {
    name: "أحذية",
    icon: Footprints,
    href: "/categories/shoes",
    color: "bg-indigo-500/10 text-indigo-500",
    hoverColor: "group-hover:bg-indigo-500",
  },
  {
    name: "نظارات",
    icon: Glasses,
    href: "/categories/glasses",
    color: "bg-teal-500/10 text-teal-500",
    hoverColor: "group-hover:bg-teal-500",
  },
];

export const CategoriesSection = () => {
  const getGridCols = (itemCount: number) => {
    if (itemCount >= 8) return "lg:grid-cols-8";
    if (itemCount >= 6) return "lg:grid-cols-6";
    if (itemCount >= 4) return "lg:grid-cols-4";
    if (itemCount >= 3) return "lg:grid-cols-3";
    return "lg:grid-cols-2";
  };

  const gridCols = getGridCols(categories.length);

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-12">
          <SectionHeading
            title="تصفح حسب الفئات"
            description="اكتشف منتجاتنا المميزة في مختلف الفئات"
          />
        </div>
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${gridCols} gap-4`}
        >
          {categories.map((category) => (
            <Link 
              key={category.name} 
              href={category.href}
              className="block h-[160px]"
            >
              <Card className="group h-full relative overflow-hidden transition-all duration-300">
                <div
                  className={`absolute inset-0 translate-x-[-100%] translate-y-[-100%] group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300 ease-in-out ${category.hoverColor} opacity-10`}
                />
                <div className="relative h-full w-full flex flex-col items-center justify-center gap-3">
                  <div
                    className={`w-14 h-14 flex items-center justify-center rounded-full ${category.color} transition-colors duration-300`}
                  >
                    <category.icon
                      className={`h-7 w-7 transition-colors duration-300 ${category.hoverColor.replace(
                        "bg-",
                        "group-hover:text-white"
                      )}`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium text-muted-foreground transition-colors duration-300 ${category.hoverColor.replace(
                      "bg-",
                      "group-hover:text-"
                    )}`}
                  >
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



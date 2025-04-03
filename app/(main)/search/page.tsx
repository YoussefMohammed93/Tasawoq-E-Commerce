"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Heart, Search, ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/ui/header";
import { Badge } from "@/components/ui/badge";

const ITEMS_PER_PAGE = 12;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const [currentPage, setCurrentPage] = useState(1);

  const products = useQuery(api.products.getProducts);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (!products) {
    return <SearchSkeleton />;
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push("...");
      }
    }
    return pages;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 mt-20 sm:mt-16">
          <div className="max-w-lg mx-auto mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
              البحث عن منتجات
            </h1>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="ابحث عن منتج..."
                className="pr-10 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {paginatedProducts.map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product._id}`}
                    className="block group"
                  >
                    <Card className="h-[465px] md:h-[520px] lg:h-[470px] xl:h-[450px] flex flex-col p-0">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={
                            product.mainImageUrl ?? "/placeholder-product.jpg"
                          }
                          alt={product.name}
                          fill
                          className="object-contain p-2 sm:p-4 sm:pb-0"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {product.discountPercentage > 0 && (
                          <Badge
                            variant="destructive"
                            className="absolute top-2 sm:top-3 right-2 sm:right-3"
                          >
                            خصم {product.discountPercentage}%
                          </Badge>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute top-2 sm:top-3 left-2 sm:left-3"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </div>
                      <div className="p-3 pt-0 sm:p-4 flex flex-col gap-2 flex-1">
                        <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <span className="font-bold text-primary text-sm sm:text-base">
                              {(
                                product.price *
                                (1 - product.discountPercentage / 100)
                              ).toFixed(2)}{" "}
                              ر.س
                            </span>
                            {product.discountPercentage > 0 && (
                              <span className="text-xs text-muted-foreground line-through">
                                {product.price} ر.س
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          className="w-full gap-2 text-sm sm:text-base mt-auto"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                          إضافة للسلة
                        </Button>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1);
                          scrollToTop();
                        }
                      }}
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">الصفحة السابقة</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Button>
                    {getPageNumbers().map((page, i) => (
                      <Button
                        key={i}
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        onClick={() => {
                          if (typeof page === "number") {
                            setCurrentPage(page);
                            scrollToTop();
                          }
                        }}
                        disabled={typeof page !== "number"}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1);
                          scrollToTop();
                        }
                      }}
                      disabled={currentPage === totalPages}
                    >
                      <span className="sr-only">الصفحة التالية</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 rotate-180"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="bg-muted p-5 rounded-full mb-4">
                <Search className="h-9 w-9 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                لم يتم العثور على نتائج
              </h3>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mb-2">
                  لا توجد منتجات تطابق {searchQuery}
                </p>
              )}
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="mt-4"
              >
                عرض جميع المنتجات
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 mt-20 sm:mt-16">
          <div className="max-w-lg mx-auto mb-8">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <Card
                key={i}
                className="h-[465px] md:h-[520px] lg:h-[470px] xl:h-[430px] flex flex-col p-0"
              >
                <div className="relative aspect-[4/3]">
                  <Skeleton className="absolute inset-0 w-full h-full rounded-t-lg" />
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                  </div>
                </div>
                <div className="p-3 pt-0 sm:p-4 flex flex-col gap-2 flex-1">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full mt-auto" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}


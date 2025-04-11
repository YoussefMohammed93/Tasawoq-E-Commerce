"use client";

import { useParams, notFound } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ProductCard } from "@/components/ui/product-card";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { PackageX } from "lucide-react";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import CategoryLoadingSkeleton from "./loading-skeleton";

// Number of products per page
const ITEMS_PER_PAGE = 12;

const EmptyStateMessage = ({ categoryName }: { categoryName: string }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <div className="bg-muted p-5 rounded-full mb-4">
        <PackageX className="h-9 w-9 text-muted-foreground" />
      </div>
      <h3 className="text-lg sm:text-xl font-medium mb-2">
        لا توجد منتجات في {categoryName}
      </h3>
      <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-[500px]">
        لم يتم إضافة أي منتجات إلى هذه الفئة بعد. يمكنك تصفح الفئات الأخرى
        للعثور على ما تبحث عنه.
      </p>
    </div>
  );
};

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params._id as Id<"categories">;
  const [currentPage, setCurrentPage] = useState(1);

  // Get category and its products
  const category = useQuery(api.categories.getCategory, { categoryId });
  const products = useQuery(api.categories.getProductsByCategory, {
    categoryId,
  });

  // Get image URLs for products
  const productImageUrls = useQuery(
    api.files.getMultipleImageUrls,
    products?.length
      ? { storageIds: products.map((product) => product.mainImage) }
      : "skip"
  );

  // Show 404 if category doesn't exist
  if (category === null) {
    notFound();
  }

  // Show loading skeleton only if category data is still loading
  if (category === undefined) {
    return <CategoryLoadingSkeleton />;
  }

  // If we have the category but products are still undefined, show loading skeleton
  if (products === undefined) {
    return <CategoryLoadingSkeleton />;
  }

  // If we have products but they need images and images are still loading, show loading skeleton
  if (products.length > 0 && productImageUrls === undefined) {
    return <CategoryLoadingSkeleton />;
  }

  // Pagination logic
  const totalProducts = products?.length || 0;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = products?.slice(startIndex, endIndex) || [];
  const paginatedImageUrls = productImageUrls?.slice(startIndex, endIndex);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 pt-20">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
            <p className="text-muted-foreground">
              {totalProducts} {totalProducts === 1 ? "منتج" : "منتجات"}
            </p>
          </div>

          {!products?.length ? (
            <EmptyStateMessage categoryName={category.name} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product, index) => (
                  <ProductCard
                    key={product._id}
                    product={{
                      ...product,
                      mainImageUrl: paginatedImageUrls?.[index] || null,
                    }}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex flex-col items-center gap-3 sm:gap-4">
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    عرض {startIndex + 1} إلى {Math.min(endIndex, totalProducts)}{" "}
                    من {totalProducts} منتج
                  </div>
                  <Pagination>
                    <PaginationContent className="flex-wrap justify-center gap-1">
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            handlePageChange(Math.max(1, currentPage - 1))
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                      {getPageNumbers().map((pageNumber, index) =>
                        pageNumber === "..." ? (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              isActive={currentPage === pageNumber}
                              onClick={() =>
                                handlePageChange(Number(pageNumber))
                              }
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            handlePageChange(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

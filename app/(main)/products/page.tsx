"use client";

import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Header } from "@/components/ui/header";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, FilterIcon, ShoppingCart } from "lucide-react";
import { ProductCard } from "@/components/ui/product-card";
import { Card } from "@/components/ui/card";

const ProductsSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 mt-20 sm:mt-16 lg:mt-0">
          <div className="lg:hidden mb-4">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="hidden lg:block w-64 flex-shrink-0 mt-16">
              <div className="sticky h-fit top-24 space-y-5">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-2">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-9 w-full" />
                    ))}
                  </div>
                </div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-6 w-24" />
                    <div className="space-y-2">
                      {[...Array(4)].map((_, j) => (
                        <Skeleton key={j} className="h-9 w-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 mt-4 lg:mt-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
                <div className="lg:col-span-6">
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 lg:col-span-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className={cn("h-10 w-full", i === 5 ? "sm:hidden" : "")}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="group">
                    <Card className="h-[400px] sm:h-[450px] flex flex-col p-0">
                      <div className="relative aspect-square">
                        <Skeleton className="absolute inset-0 w-full h-full rounded-t-lg" />
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1 sm:gap-2">
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="absolute top-2 sm:top-3 left-2 sm:left-3 h-9 w-9" />
                      </div>
                      <div className="p-3 sm:p-4 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-6 w-24" />
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
              <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3 sm:gap-4">
                <Skeleton className="h-5 w-48" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-10" />
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-10" />
                  ))}
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 pt-28">
      <div className="bg-muted p-5 rounded-full mb-4">
        <ShoppingCart className="h-9 w-9 text-muted-foreground" />
      </div>
      <h3 className="text-lg sm:text-xl font-medium mb-2">
        لا توجد منتجات متاحة حاليًا
      </h3>
      <p className="text-sm sm:text-lg text-muted-foreground max-w-[500px]">
        لم يتم إضافة أي منتجات بعد, يرجى العودة لاحقًا
      </p>
    </div>
  );
};

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const products = useQuery(api.products.getProducts);
  const categoriesData = useQuery(api.categories.getCategories);

  if (!products || !categoriesData) {
    return <ProductsSkeleton />;
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-4 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 mt-20 sm:mt-16 lg:mt-0">
            <EmptyState />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categories = [{ _id: "all", name: "الكل" }, ...categoriesData];

  const colors = [
    { name: "أسود", value: "#1a1a1a" },
    { name: "رمادي", value: "#6b7280" },
    { name: "أبيض", value: "#dedede" },
    { name: "أزرق", value: "#3b82f6" },
    { name: "أخضر", value: "#22c55e" },
    { name: "أحمر", value: "#ef4444" },
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const ITEMS_PER_PAGE = 9;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const statusOptions = [
    { id: "all", label: "الكل" },
    { id: "جديد", label: "جديد" },
    { id: "الأكثر مبيعاً", label: "الأكثر مبيعاً" },
    { id: "خصم", label: "خصم" },
    { id: "عرض خاص", label: "عرض خاص" },
  ];

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">الفئات</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category._id} className="flex items-center">
              <Checkbox
                id={`category-${category._id}`}
                className="ml-2"
                checked={selectedCategory === category.name}
                onCheckedChange={() => {
                  setSelectedCategory(category.name);
                  setCurrentPage(1);
                }}
              />
              <label htmlFor={`category-${category._id}`} className="text-sm">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-3">نطاق السعر</h3>
        <Slider
          defaultValue={priceRange}
          max={1000}
          min={0}
          step={1}
          className="mb-2"
          onValueChange={(value) => {
            setPriceRange(value as [number, number]);
            setCurrentPage(1);
          }}
        />
        <div className="flex justify-between text-sm">
          <span>{priceRange[0]} ر.س</span>
          <span>{priceRange[1]} ر.س</span>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-3">الألوان</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.value}
              className={cn(
                "size-8 rounded-full cursor-pointer mx-0.5 transition-all",
                "ring-offset-2 ring-offset-background",
                selectedColors.includes(color.name)
                  ? "ring-2 ring-primary"
                  : "",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
              style={{ backgroundColor: color.value }}
              aria-label={color.name}
              onClick={() => {
                setSelectedColors((prev) =>
                  prev.includes(color.name)
                    ? prev.filter((c) => c !== color.name)
                    : [...prev, color.name]
                );
                setCurrentPage(1);
              }}
            />
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-3">المقاسات</h3>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <Button
              key={size}
              variant={selectedSizes.includes(size) ? "default" : "outline"}
              size="sm"
              className="w-full"
              onClick={() => {
                setSelectedSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((s) => s !== size)
                    : [...prev, size]
                );
                setCurrentPage(1);
              }}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
      {(selectedCategory !== "الكل" ||
        priceRange[0] !== 0 ||
        priceRange[1] !== 1000 ||
        selectedColors.length > 0 ||
        selectedSizes.length > 0 ||
        selectedStatus !== "all" ||
        searchQuery) && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setSelectedCategory("الكل");
            setPriceRange([0, 1000]);
            setSelectedColors([]);
            setSelectedSizes([]);
            setSelectedStatus("all");
            setSearchQuery("");
            setCurrentPage(1);
            setIsMobileFiltersOpen(false);
          }}
        >
          مسح جميع المرشحات
        </Button>
      )}
    </div>
  );

  const filteredProducts = products.filter((product) => {
    const matchesStatus =
      selectedStatus === "all"
        ? true
        : selectedStatus === "خصم"
          ? product.discountPercentage > 0
          : product.badges.includes(selectedStatus);

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "الكل" ||
      categoriesData.find((cat) => cat.name === selectedCategory)?._id ===
        product.categoryId;

    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    const matchesColors =
      selectedColors.length === 0 ||
      selectedColors.some((colorName) =>
        product.colors.some((color) => color.name === colorName)
      );

    const matchesSizes =
      selectedSizes.length === 0 ||
      selectedSizes.some((size) =>
        product.sizes.some((productSize) => productSize.name === size)
      );

    return (
      matchesStatus &&
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesColors &&
      matchesSizes
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pageNumbers.push(i);
      } else if (
        typeof pageNumbers[pageNumbers.length - 1] === "number" &&
        (pageNumbers[pageNumbers.length - 1] as number) + 1 < i
      ) {
        pageNumbers.push("...");
      }
    }
    return pageNumbers;
  };

  interface NoResultsMessageProps {
    filters: {
      search: string;
      status: string;
      category: string;
      priceRange: [number, number];
      colors: string[];
      sizes: string[];
    };
    onClear: () => void;
  }

  const NoResultsMessage = ({ filters, onClear }: NoResultsMessageProps) => {
    const activeFilters = [];

    if (filters.search) {
      activeFilters.push(`البحث: "${filters.search}"`);
    }
    if (filters.status !== "all") {
      activeFilters.push(
        `الحالة: "${statusOptions.find((s) => s.id === filters.status)?.label}"`
      );
    }
    if (filters.category !== "الكل") {
      activeFilters.push(`الفئة: "${filters.category}"`);
    }
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000) {
      activeFilters.push(
        `السعر: ${filters.priceRange[0]} - ${filters.priceRange[1]} ر.س`
      );
    }
    if (filters.colors.length > 0) {
      activeFilters.push(`الألوان: ${filters.colors.join("، ")}`);
    }
    if (filters.sizes.length > 0) {
      activeFilters.push(`المقاسات: ${filters.sizes.join("، ")}`);
    }

    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="bg-muted p-5 rounded-full mb-4">
          <Search className="h-9 w-9 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">لم يتم العثور على نتائج</h3>
        {activeFilters.length > 0 && (
          <p className="text-sm text-muted-foreground mb-2">
            المرشحات المطبقة: {activeFilters.join(" ، ")}
          </p>
        )}
        <Button variant="outline" onClick={onClear} className="mt-4">
          مسح المرشحات
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 mt-20 sm:mt-16 lg:mt-0">
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <FilterIcon className="h-4 w-4 ml-2" />
              تصفية المنتجات
              {(selectedCategory !== "الكل" ||
                selectedColors.length > 0 ||
                selectedSizes.length > 0) && (
                <span className="inline-flex items-center justify-center w-5 h-5 ml-2 text-xs font-medium text-white bg-primary rounded-full">
                  {(selectedCategory !== "الكل" ? 1 : 0) +
                    selectedColors.length +
                    selectedSizes.length}
                </span>
              )}
            </Button>
          </div>
          <Sheet
            open={isMobileFiltersOpen}
            onOpenChange={setIsMobileFiltersOpen}
          >
            <SheetContent side="right" className="w-full max-w-md p-5">
              <SheetHeader className="p-0">
                <SheetTitle>تصفية المنتجات</SheetTitle>
              </SheetHeader>
              <FiltersContent />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
                <Button
                  className="w-full"
                  onClick={() => setIsMobileFiltersOpen(false)}
                >
                  عرض النتائج
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="hidden lg:block w-64 flex-shrink-0 mt-16">
              <div className="sticky h-fit top-24 space-y-5 overflow-y-auto pb-8">
                <FiltersContent />
              </div>
            </div>
            <div className="flex-1 mt-4 lg:mt-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
                <div className="relative lg:col-span-6">
                  <Search className="absolute right-3 top-4.5 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث عن منتج..."
                    className="pr-9 w-full"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 lg:col-span-6">
                  {statusOptions.map((status) => (
                    <Button
                      key={status.id}
                      variant={
                        selectedStatus === status.id ? "default" : "outline"
                      }
                      className="w-full text-sm"
                      onClick={() => {
                        setSelectedStatus(status.id);
                        setCurrentPage(1);
                      }}
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>
              {paginatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onAddToCart={(_, e) => e.preventDefault()}
                    />
                  ))}
                </div>
              ) : (
                <NoResultsMessage
                  filters={{
                    search: searchQuery,
                    status: selectedStatus,
                    category: selectedCategory,
                    priceRange,
                    colors: selectedColors,
                    sizes: selectedSizes,
                  }}
                  onClear={() => {
                    setSelectedCategory("الكل");
                    setPriceRange([0, 1000]);
                    setSelectedColors([]);
                    setSelectedSizes([]);
                    setSelectedStatus("all");
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                />
              )}
              {filteredProducts.length > 0 && (
                <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3 sm:gap-4">
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    عرض {startIndex + 1} إلى{" "}
                    {Math.min(endIndex, filteredProducts.length)} من{" "}
                    {filteredProducts.length} منتج
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
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

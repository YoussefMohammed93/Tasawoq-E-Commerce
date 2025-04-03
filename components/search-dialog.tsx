"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CommandDialog } from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { Loader2, Search, ShoppingBag, Tag } from "lucide-react";
import Image from "next/image";

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const products = useQuery(api.products.getProducts);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (error) {
        console.error("Failed to parse recent searches", error);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;

    const newRecentSearches = [
      query,
      ...recentSearches.filter((item) => item !== query),
    ].slice(0, 5);

    setRecentSearches(newRecentSearches);
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
  };

  // Filter products by name
  const filteredProducts = React.useMemo(() => {
    if (!products || !searchQuery.trim()) return [];

    return products
      .filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
  }, [products, searchQuery]);

  // Handle recent search selection
  const handleSelectRecentSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle view all results
  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
      onOpenChange(false);
    }
  };

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onOpenChange, open]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">بحث المنتجات</DialogTitle>
      <div className="rounded-lg border shadow-md">
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 opacity-50" />
          <input
            className="flex h-11 w-full rounded-md bg-transparent py-3 px-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="ابحث عن منتج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {!products && searchQuery && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {searchQuery && filteredProducts.length === 0 && (
            <div className="py-6 text-center text-sm">
              لم يتم العثور على نتائج
            </div>
          )}

          {/* Recent searches */}
          {!searchQuery && recentSearches.length > 0 && (
            <div className="px-2 py-3">
              <div className="px-2 text-xs font-medium text-muted-foreground">
                عمليات البحث الأخيرة
              </div>
              {recentSearches.map((search) => (
                <div
                  key={search}
                  onClick={() => handleSelectRecentSearch(search)}
                  className="flex items-center gap-2 rounded-sm px-2 py-1.5 cursor-pointer hover:bg-accent"
                >
                  <Search className="h-4 w-4 opacity-50" />
                  <span className="text-sm">{search}</span>
                </div>
              ))}
            </div>
          )}

          {/* Search results */}
          {searchQuery && filteredProducts.length > 0 && (
            <div className="px-2 py-3">
              <div className="px-2 text-xs font-medium text-muted-foreground mb-2">
                المنتجات
              </div>
              {filteredProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  onClick={() => {
                    saveRecentSearch(searchQuery);
                    onOpenChange(false);
                  }}
                  className="flex items-center gap-2 rounded-sm p-2 hover:bg-accent"
                >
                  <div className="relative h-10 w-10 overflow-hidden rounded-md border">
                    {product.mainImageUrl && (
                      <Image
                        src={product.mainImageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{product.name}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {product.discountPercentage > 0 ? (
                          <span className="text-primary font-medium">
                            {(
                              product.price *
                              (1 - product.discountPercentage / 100)
                            ).toFixed(2)}{" "}
                            ر.س
                            <span className="text-muted-foreground line-through mr-1">
                              {product.price.toFixed(2)} ر.س
                            </span>
                          </span>
                        ) : (
                          <span>{product.price.toFixed(2)} ر.س</span>
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              {filteredProducts.length > 0 && (
                <Link
                  href={`/search?search=${encodeURIComponent(searchQuery)}`}
                  onClick={handleViewAllResults}
                  className="flex justify-center rounded-sm px-2 py-1.5 text-primary text-sm font-medium hover:bg-accent"
                >
                  عرض كل النتائج
                </Link>
              )}
            </div>
          )}

          {/* Quick links */}
          {!searchQuery && (
            <div className="px-2 py-3">
              <div className="px-2 text-xs font-medium text-muted-foreground mb-2">
                روابط سريعة
              </div>
              <Link
                href="/products"
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-2 rounded-sm p-2 text-sm hover:bg-accent"
              >
                <ShoppingBag className="h-4 w-4 opacity-50" />
                <span>تصفح جميع المنتجات</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </CommandDialog>
  );
}

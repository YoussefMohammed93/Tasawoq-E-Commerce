/* eslint-disable @next/next/no-img-element */
"use client";

import {
  StarIcon,
  SearchIcon,
  FilterIcon,
  ArrowUpIcon,
  MessageCircleIcon,
  TrashIcon,
  PackageIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent } from "@/components/ui/card";

const generateReviews = () => {
  const products = [
    { name: "حقيبة يد جلدية", image: "https://picsum.photos/200/200?random=1" },
    { name: "ساعة ذكية", image: "https://picsum.photos/200/200?random=2" },
    { name: "حذاء رياضي", image: "https://picsum.photos/200/200?random=3" },
    { name: "نظارة شمسية", image: "https://picsum.photos/200/200?random=4" },
    { name: "سماعات لاسلكية", image: "https://picsum.photos/200/200?random=5" },
    { name: "محفظة جلدية", image: "https://picsum.photos/200/200?random=6" },
  ];

  const customers = [
    "أحمد محمد",
    "سارة أحمد",
    "محمد علي",
    "فاطمة حسن",
    "عمر خالد",
    "ليلى عبدالله",
    "يوسف إبراهيم",
    "نور محمد",
  ];

  const comments = [
    "منتج رائع! الجودة ممتازة والتوصيل كان سريع. أنصح به بشدة.",
    "جودة المنتج تستحق السعر. راضٍ عن الشراء.",
    "تجربة شراء موفقة، المنتج مطابق للمواصفات.",
    "منتج جيد ولكن السعر مرتفع قليلاً.",
    "الجودة متوسطة، يحتاج لبعض التحسينات.",
    "خدمة ممتازة وتوصيل سريع.",
    "المنتج يستحق التجربة، سعيد بالشراء.",
    "تجربة شراء إيجابية، سأكرر التجربة.",
  ];

  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    customerName: customers[Math.floor(Math.random() * customers.length)],
    ...products[Math.floor(Math.random() * products.length)],
    rating: Math.floor(Math.random() * 3) + 3,
    comment: comments[Math.floor(Math.random() * comments.length)],
    date: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0],
  }));
};

export default function ReviewsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const ITEMS_PER_PAGE = 5;

  const allReviews = generateReviews();

  const filteredReviews = allReviews.filter((review) => {
    const matchesSearch =
      review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRating =
      ratingFilter === "all" || review.rating === parseInt(ratingFilter);

    return matchesSearch && matchesRating;
  });

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReviews = filteredReviews.slice(
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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleRatingFilter = (value: string) => {
    setRatingFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-14 mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-5">
          <Heading
            title="التقييمات"
            description="إدارة وعرض جميع التقييمات الواردة في متجرك."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border py-4">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MessageCircleIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  إجمالي التقييمات
                </p>
                <p className="text-2xl font-bold">{allReviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border py-4">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-amber-500/10 p-3 rounded-full">
                <StarIcon className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">متوسط التقييم</p>
                <p className="text-2xl font-bold">
                  {(
                    allReviews.reduce((acc, review) => acc + review.rating, 0) /
                    allReviews.length
                  ).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border py-4">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-green-500/10 p-3 rounded-full">
                <PackageIcon className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  المنتجات المقيمة
                </p>
                <p className="text-2xl font-bold">
                  {new Set(allReviews.map((review) => review.name)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في التقييمات..."
              className="pr-9 w-full"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <Select value={ratingFilter} onValueChange={handleRatingFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="التقييم" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            <SelectItem value="5">5 نجوم</SelectItem>
            <SelectItem value="4">4 نجوم</SelectItem>
            <SelectItem value="3">3 نجوم</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2 w-full sm:w-auto">
          <FilterIcon className="h-4 w-4" />
          تصفية
        </Button>
        <Button variant="outline" className="gap-2 w-full sm:w-auto">
          <ArrowUpIcon className="h-4 w-4" />
          ترتيب
        </Button>
      </div>

      <div className="space-y-4">
        {paginatedReviews.map((review) => (
          <Card key={review.id} className="border">
            <CardContent className="px-6 py-0">
              <div className="flex gap-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start flex-col sm:flex-row justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="font-semibold">{review.customerName}</h3>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "text-amber-500 fill-amber-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        اسم المنتج : <strong>{review.name}</strong>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        التعليق : <b>{review.comment}</b>
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(review.date).toLocaleDateString("ar-SA")}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
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
                    onClick={() => setCurrentPage(Number(pageNumber))}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
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
    </div>
  );
}

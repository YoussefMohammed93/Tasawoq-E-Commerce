"use client";

import {
  PackageIcon,
  ClockIcon,
  XCircleIcon,
  CheckCircleIcon,
  SearchIcon,
  FilterIcon,
  ArrowUpIcon,
  EyeIcon,
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
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const generateOrders = (count: number) => {
  const statuses = ["completed", "processing", "cancelled", "pending"];
  const customers = [
    "أحمد محمد",
    "سارة أحمد",
    "خالد عبدالله",
    "فاطمة علي",
    "عمر حسن",
    "ليلى محمود",
    "يوسف كمال",
    "نور الدين",
    "ريم سعيد",
    "زياد عمر",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `ORD-${String(i + 1).padStart(3, "0")}`,
    customer: customers[Math.floor(Math.random() * customers.length)],
    date: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0],
    total: `${Math.floor(Math.random() * 5000 + 500)} ر.س`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    items: Math.floor(Math.random() * 5 + 1),
  }));
};

const orders = generateOrders(50);

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-500 bg-green-50";
    case "processing":
      return "text-blue-500 bg-blue-50";
    case "cancelled":
      return "text-red-500 bg-red-50";
    case "pending":
      return "text-yellow-500 bg-yellow-50";
    default:
      return "text-gray-500 bg-gray-50";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "مكتمل";
    case "processing":
      return "قيد المعالجة";
    case "cancelled":
      return "ملغي";
    case "pending":
      return "معلق";
    default:
      return status;
  }
};

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const ITEMS_PER_PAGE = 10;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = Math.max(0, (currentPage - 1) * ITEMS_PER_PAGE);
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length);
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-14 mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-5">
          <Heading
            title="الطلبات"
            description="إدارة وعرض جميع الطلبات الواردة في متجرك."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border py-4">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <PackageIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border py-4">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-green-500/10 p-3 rounded-full">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  الطلبات المكتملة
                </p>
                <p className="text-2xl font-bold">124</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border py-4">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500/10 p-3 rounded-full">
                <ClockIcon className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">قيد المعالجة</p>
                <p className="text-2xl font-bold">22</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border py-4">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-red-500/10 p-3 rounded-full">
                <XCircleIcon className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الطلبات الملغاة</p>
                <p className="text-2xl font-bold">10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="relative md:col-span-6">
          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث عن طلب..."
            className="pr-9 w-full"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="md:col-span-4 flex gap-2">
          <Button variant="outline" className="gap-2 flex-1">
            <FilterIcon className="h-4 w-4" />
            تصفية
          </Button>
          <Button variant="outline" className="gap-2 flex-1">
            <ArrowUpIcon className="h-4 w-4" />
            ترتيب
          </Button>
        </div>
        <div className="md:col-span-2">
          <Select
            dir="rtl"
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full text-right">
              <SelectValue placeholder="كل الحالات" />
            </SelectTrigger>
            <SelectContent className="text-right">
              <SelectItem value="all">كل الحالات</SelectItem>
              <SelectItem value="completed">مكتمل</SelectItem>
              <SelectItem value="processing">قيد المعالجة</SelectItem>
              <SelectItem value="pending">معلق</SelectItem>
              <SelectItem value="cancelled">ملغي</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="mb-4 py-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-right py-4 px-6 font-medium">رقم الطلب</th>
                <th className="text-right py-4 px-6 font-medium">العميل</th>
                <th className="text-right py-4 px-6 font-medium">التاريخ</th>
                <th className="text-right py-4 px-6 font-medium">المنتجات</th>
                <th className="text-right py-4 px-6 font-medium">المبلغ</th>
                <th className="text-right py-4 px-6 font-medium">الحالة</th>
                <th className="text-right py-4 px-6 font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-b-0">
                  <td className="py-4 px-6">{order.id}</td>
                  <td className="py-4 px-6">{order.customer}</td>
                  <td className="py-4 px-6">{order.date}</td>
                  <td className="py-4 px-6">{order.items} منتجات</td>
                  <td className="py-4 px-6">{order.total}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => console.log("View order:", order.id)}
                    >
                      <EyeIcon className="h-4 w-4" />
                      عرض
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div className="text-sm text-muted-foreground">
          {filteredOrders.length > 0 ? (
            <>
              عرض {startIndex + 1} إلى {endIndex} من {filteredOrders.length} طلب
            </>
          ) : (
            "لا توجد طلبات"
          )}
        </div>
        <Pagination className="w-fit mx-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                  }
                }}
                aria-disabled={currentPage <= 1}
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
                onClick={() => {
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
                aria-disabled={currentPage >= totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

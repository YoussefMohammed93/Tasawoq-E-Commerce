/* eslint-disable @next/next/no-img-element */
"use client";

import {
  PackageIcon,
  TagIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  Eye,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const products = [
  {
    id: 1,
    title: "حقيبة يد جلدية فاخرة",
    image: "https://picsum.photos/200/200?random=1",
    quantity: 45,
    createdAt: "2024-02-15",
    description: "حقيبة يد نسائية مصنوعة من الجلد الطبيعي الفاخر",
    category: { name: "حقائب نسائية" },
    price: 799.99,
    discountPercentage: 15,
    status: "in-stock",
    sales: 124,
  },
  {
    id: 2,
    title: "ساعة ذكية رياضية",
    image: "https://picsum.photos/200/200?random=2",
    quantity: 30,
    createdAt: "2024-02-10",
    description: "ساعة ذكية متعددة الوظائف لتتبع النشاط الرياضي",
    category: { name: "الساعات الذكية" },
    price: 499.99,
    discountPercentage: 10,
  },
  {
    id: 3,
    title: "نظارة شمسية كلاسيكية",
    image: "https://picsum.photos/200/200?random=3",
    quantity: 60,
    createdAt: "2024-02-05",
    description: "نظارة شمسية بتصميم كلاسيكي أنيق",
    category: { name: "نظارات" },
    price: 299.99,
    discountPercentage: 0,
  },
  {
    id: 4,
    title: "عطر فاخر للرجال",
    image: "https://picsum.photos/200/200?random=4",
    quantity: 25,
    createdAt: "2024-02-01",
    description: "عطر رجالي فاخر برائحة منعشة",
    category: { name: "عطور" },
    price: 450.99,
    discountPercentage: 5,
  },
  {
    id: 5,
    title: "سماعات لاسلكية",
    image: "https://picsum.photos/200/200?random=5",
    quantity: 40,
    createdAt: "2024-01-28",
    description: "سماعات بلوتوث عالية الجودة",
    category: { name: "إلكترونيات" },
    price: 349.99,
    discountPercentage: 20,
  },
  {
    id: 6,
    title: "حذاء رياضي",
    image: "https://picsum.photos/200/200?random=6",
    quantity: 35,
    createdAt: "2024-01-25",
    description: "حذاء رياضي مريح للجري",
    category: { name: "أحذية رياضية" },
    price: 259.99,
    discountPercentage: 0,
  },
];

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-14 mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-5">
          <Heading
            title="المنتجات"
            description="إدارة وعرض جميع المنتجات المتاحة في متجرك"
          />
          <Button variant="outline" className="gap-2">
            <PlusIcon className="h-4 w-4" />
            إضافة منتج جديد
          </Button>
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
                <p className="text-sm text-muted-foreground">إجمالي المنتجات</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border py-4">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-green-500/10 p-3 rounded-full">
                <ArrowUpIcon className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  المنتجات المتوفرة
                </p>
                <p className="text-2xl font-bold">
                  {products.filter((p) => p.quantity > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border py-4">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-red-500/10 p-3 rounded-full">
                <ArrowDownIcon className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">منتجات نفذت</p>
                <p className="text-2xl font-bold">
                  {products.filter((p) => p.quantity === 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border py-4">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 p-3 rounded-full">
                <TagIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">منتجات بخصم</p>
                <p className="text-2xl font-bold">
                  {products.filter((p) => p.discountPercentage > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="relative md:col-span-6">
          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="البحث عن منتج..." className="pr-9 w-full" />
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
          <Select dir="rtl">
            <SelectTrigger className="w-full text-right">
              <SelectValue placeholder="كل الفئات" />
            </SelectTrigger>
            <SelectContent className="text-right">
              <SelectItem value="all" className="pr-2">
                كل الفئات
              </SelectItem>
              <SelectItem value="bags" className="pr-2">
                حقائب نسائية
              </SelectItem>
              <SelectItem value="electronics" className="pr-2">
                إلكترونيات
              </SelectItem>
              <SelectItem value="shoes" className="pr-2">
                أحذية رياضية
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {products.map((product) => (
          <Card key={product.id} className="border p-0 pt-3 pr-3">
            <CardContent className="p-0">
              <div className="flex gap-4">
                <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="object-cover w-full h-full"
                  />
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white px-1 py-0.5 text-xs">
                      {product.discountPercentage}%
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm mb-1 truncate">
                    {product.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-1 pl-2">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {product.price} ر.س
                    </span>
                    {product.discountPercentage > 0 && (
                      <span className="text-xs text-muted-foreground line-through">
                        {(
                          product.price *
                          (1 + product.discountPercentage / 100)
                        ).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 pr-0 pl-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    product.quantity > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.quantity > 0 ? "متوفر" : "نفذ المخزون"}
                </span>
                <span className="text-xs text-muted-foreground">
                  المخزون: {product.quantity}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => console.log("View product:", product.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => console.log("Edit product:", product.id)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-500"
                  onClick={() => console.log("Delete product:", product.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

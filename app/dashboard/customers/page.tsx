"use client";

import {
  UsersIcon,
  SearchIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent } from "@/components/ui/card";

const customers = [
  {
    id: 1,
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+966 50 123 4567",
    location: "الرياض",
    orders: 12,
    totalSpent: "2,450 ر.س",
    status: "نشط",
    lastOrder: "2024-02-15",
  },
  {
    id: 2,
    name: "سارة عبدالله",
    email: "sara@example.com",
    phone: "+966 55 987 6543",
    location: "جدة",
    orders: 8,
    totalSpent: "1,850 ر.س",
    status: "نشط",
    lastOrder: "2024-02-10",
  },
  {
    id: 3,
    name: "محمد خالد",
    email: "mohammed@example.com",
    phone: "+966 54 456 7890",
    location: "الدمام",
    orders: 5,
    totalSpent: "950 ر.س",
    status: "غير نشط",
    lastOrder: "2024-01-20",
  },
  {
    id: 4,
    name: "محمد عبدالله",
    email: "mohammed@example.com",
    phone: "+966 24 456 4390",
    location: "الدمام",
    orders: 2,
    totalSpent: "540 ر.س",
    status: "نشط",
    lastOrder: "2024-04-26",
  },
];

export default function CustomersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-14 mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-5">
          <Heading
            title="العملاء"
            description="إدارة وعرض جميع العملاء في متجرك."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border py-4">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <UsersIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-md text-muted-foreground">إجمالي العملاء</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border py-4">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-green-500/10 p-3 rounded-full">
                <UsersIcon className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">العملاء النشطون</p>
                <p className="text-2xl font-bold">892</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border py-4">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 p-3 rounded-full">
                <UsersIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">عملاء جدد</p>
                <p className="text-2xl font-bold">48</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="البحث عن عميل..." className="pr-9 w-full" />
          </div>
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="inactive">غير نشط</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="المدينة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            <SelectItem value="riyadh">الرياض</SelectItem>
            <SelectItem value="jeddah">جدة</SelectItem>
            <SelectItem value="dammam">الدمام</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <Card key={customer.id} className="border">
            <CardContent className="px-6 py-0">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <UserIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {customer.status === "نشط" ? (
                      <span className="text-green-500">●</span>
                    ) : (
                      <span className="text-gray-400">●</span>
                    )}{" "}
                    {customer.status}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MailIcon className="h-4 w-4" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <PhoneIcon className="h-4 w-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{customer.location}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">عدد الطلبات</span>
                  <span className="font-medium">{customer.orders}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-muted-foreground">
                    إجمالي المشتريات
                  </span>
                  <span className="font-medium">{customer.totalSpent}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-muted-foreground">آخر طلب</span>
                  <span className="font-medium">{customer.lastOrder}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

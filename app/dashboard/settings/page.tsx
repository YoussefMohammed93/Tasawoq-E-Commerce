"use client";

import {
  StoreIcon,
  BellIcon,
  PaletteIcon,
  CreditCardIcon,
  SaveIcon,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-14 mb-8">
        <Heading title="الإعدادات" description="إدارة إعدادات متجرك." />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <StoreIcon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">إعدادات المتجر</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              قم بتحديث المعلومات الأساسية لمتجرك
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">اسم المتجر</label>
                <Input placeholder="أدخل اسم المتجر" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">رقم الهاتف</label>
                <Input placeholder="أدخل رقم الهاتف" type="tel" dir="rtl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">البريد الإلكتروني</label>
                <Input placeholder="أدخل البريد الإلكتروني" type="email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">العنوان</label>
                <Input placeholder="أدخل عنوان المتجر" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <PaletteIcon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">المظهر</h2>
            </div>
            <p className="text-sm text-muted-foreground">تخصيص مظهر متجرك</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">النمط</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر النمط" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">فاتح</SelectItem>
                    <SelectItem value="dark">داكن</SelectItem>
                    <SelectItem value="system">حسب النظام</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">اللغة</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر اللغة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <CreditCardIcon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">إعدادات الدفع</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              إدارة طرق الدفع وإعدادات المعاملات المالية
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">العملة الافتراضية</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العملة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sar">ريال سعودي (SAR)</SelectItem>
                    <SelectItem value="usd">دولار أمريكي (USD)</SelectItem>
                    <SelectItem value="eur">يورو (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">طريقة الدفع</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر طريقة الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="cod">الدفع عند الاستلام</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <BellIcon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">الإشعارات</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              تخصيص إعدادات الإشعارات
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">إشعارات الطلبات الجديدة</p>
                  <p className="text-sm text-muted-foreground">
                    تلقي إشعار عند وصول طلب جديد
                  </p>
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="اختر نوع الإشعار" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">البريد والجوال</SelectItem>
                    <SelectItem value="email">البريد فقط</SelectItem>
                    <SelectItem value="sms">الجوال فقط</SelectItem>
                    <SelectItem value="none">إيقاف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={loading} className="gap-2">
            {loading ? (
              <span className="flex items-center gap-2">
                <span>جاري الحفظ...</span>
                <Loader2 className="animate-spin size-5" />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>حفظ التغييرات</span>
                <SaveIcon className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

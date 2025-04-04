"use client";

import {
  StoreIcon,
  BellIcon,
  PaletteIcon,
  CreditCardIcon,
  SaveIcon,
  Loader2,
  TicketIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  RefreshCwIcon,
  TruckIcon,
  Save,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

type Coupon = {
  _id: Id<"coupons">;
  name: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
  usageLimit?: number;
  usageCount?: number;
  createdAt: string;
  updatedAt: string;
};

export default function SettingsPage() {
  const settings = useQuery(api.settings.get);
  const saveSettings = useMutation(api.settings.save);

  const [shippingCost, setShippingCost] = useState("");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Load initial settings
  useEffect(() => {
    if (settings) {
      setShippingCost(settings.shippingCost?.toString() || "15");
      setFreeShippingThreshold(
        settings.freeShippingThreshold?.toString() || ""
      );
    }
  }, [settings]);

  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [isEditCouponOpen, setIsEditCouponOpen] = useState(false);
  const [isDeleteCouponOpen, setIsDeleteCouponOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // New coupon form state
  const [couponName, setCouponName] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState("");
  const [couponUsageLimit, setCouponUsageLimit] = useState("");

  // Fetch coupons
  const coupons = useQuery(api.coupons.getCoupons) || [];

  // Mutations
  const createCouponMutation = useMutation(api.coupons.createCoupon);
  const updateCouponMutation = useMutation(api.coupons.updateCoupon);
  const deleteCouponMutation = useMutation(api.coupons.deleteCoupon);
  const generateCouponCodeMutation = useMutation(
    api.coupons.generateCouponCode
  );

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveSettings({
        shippingCost: Number(shippingCost) || 15,
        freeShippingThreshold: freeShippingThreshold
          ? Number(freeShippingThreshold)
          : null,
        // Add other settings here
      });
      toast.success("تم حفظ الإعدادات بنجاح");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
    }
    setLoading(false);
  };

  // Generate random coupon code
  const handleGenerateCouponCode = async () => {
    try {
      const code = await generateCouponCodeMutation();
      setCouponCode(code);
    } catch (error) {
      console.error("Failed to generate coupon code:", error);
      toast.error("فشل في إنشاء كود الكوبون");
    }
  };

  // Add new coupon
  const handleAddCoupon = async () => {
    if (!couponName.trim() || !couponCode.trim() || !couponDiscount.trim()) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    const discountValue = parseFloat(couponDiscount);
    if (isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
      toast.error("يرجى إدخال نسبة خصم صحيحة بين 1 و 100");
      return;
    }

    // Parse usage limit if provided
    let usageLimitValue: number | undefined = undefined;
    if (couponUsageLimit.trim()) {
      usageLimitValue = parseInt(couponUsageLimit);
      if (isNaN(usageLimitValue) || usageLimitValue <= 0) {
        toast.error("يرجى إدخال عدد مرات استخدام صحيح");
        return;
      }
    }

    setIsAddLoading(true);
    try {
      await createCouponMutation({
        name: couponName,
        code: couponCode.trim().toUpperCase(),
        discountPercentage: discountValue,
        usageLimit: usageLimitValue,
      });

      toast.success("تم إضافة الكوبون بنجاح");
      resetCouponForm();
      setIsAddCouponOpen(false);
    } catch (error) {
      console.error("Failed to add coupon:", error);
      toast.error("فشل في إضافة الكوبون");
    } finally {
      setIsAddLoading(false);
    }
  };

  // Edit coupon
  const handleEditCoupon = async () => {
    if (!selectedCoupon) return;

    if (!couponName.trim() || !couponCode.trim() || !couponDiscount.trim()) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    const discountValue = parseFloat(couponDiscount);
    if (isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
      toast.error("يرجى إدخال نسبة خصم صحيحة بين 1 و 100");
      return;
    }

    // Parse usage limit if provided
    let usageLimitValue: number | undefined = undefined;
    if (couponUsageLimit.trim()) {
      usageLimitValue = parseInt(couponUsageLimit);
      if (isNaN(usageLimitValue) || usageLimitValue <= 0) {
        toast.error("يرجى إدخال عدد مرات استخدام صحيح");
        return;
      }
    }

    setIsEditLoading(true);
    try {
      await updateCouponMutation({
        id: selectedCoupon._id,
        name: couponName,
        code: couponCode.trim().toUpperCase(),
        discountPercentage: discountValue,
        usageLimit: usageLimitValue,
      });

      toast.success("تم تحديث الكوبون بنجاح");
      resetCouponForm();
      setIsEditCouponOpen(false);
    } catch (error) {
      console.error("Failed to update coupon:", error);
      toast.error("فشل في تحديث الكوبون");
    } finally {
      setIsEditLoading(false);
    }
  };

  // Delete coupon
  const handleDeleteCoupon = async () => {
    if (!selectedCoupon) return;

    setIsDeleteLoading(true);
    try {
      await deleteCouponMutation({ id: selectedCoupon._id });
      toast.success("تم حذف الكوبون بنجاح");
      setIsDeleteCouponOpen(false);
    } catch (error) {
      console.error("Failed to delete coupon:", error);
      toast.error("فشل في حذف الكوبون");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  // Reset coupon form
  const resetCouponForm = () => {
    setCouponName("");
    setCouponCode("");
    setCouponDiscount("");
    setCouponUsageLimit("");
    setSelectedCoupon(null);
  };

  // Open edit dialog with coupon data
  const openEditDialog = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setCouponName(coupon.name);
    setCouponCode(coupon.code);
    setCouponDiscount(coupon.discountPercentage.toString());
    setCouponUsageLimit(coupon.usageLimit?.toString() || "");
    setIsEditCouponOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteCouponOpen(true);
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
              <TicketIcon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">كوبونات الخصم</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              إدارة كوبونات الخصم لمتجرك
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">الكوبونات النشطة</h3>
                <Dialog
                  open={isAddCouponOpen}
                  onOpenChange={setIsAddCouponOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1">
                      <PlusIcon className="h-4 w-4" />
                      إضافة كوبون
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>إضافة كوبون جديد</DialogTitle>
                      <DialogDescription>
                        أضف كوبون خصم جديد لعملائك
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          اسم الكوبون
                        </label>
                        <Input
                          placeholder="مثال: خصم العيد"
                          value={couponName}
                          onChange={(e) => setCouponName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          كود الكوبون
                        </label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="مثال: SALE50"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            onClick={handleGenerateCouponCode}
                            type="button"
                          >
                            <RefreshCwIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          نسبة الخصم (%)
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          placeholder="مثال: 10"
                          value={couponDiscount}
                          onChange={(e) => setCouponDiscount(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          عدد مرات الاستخدام
                        </label>
                        <Input
                          type="number"
                          min="1"
                          placeholder="اتركه فارغًا للاستخدام غير المحدود"
                          value={couponUsageLimit}
                          onChange={(e) => setCouponUsageLimit(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          اتركه فارغًا للاستخدام غير المحدود
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddCouponOpen(false)}
                      >
                        إلغاء
                      </Button>
                      <Button
                        onClick={handleAddCoupon}
                        disabled={isAddLoading}
                        className="gap-2"
                      >
                        {isAddLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            جاري الإضافة...
                          </>
                        ) : (
                          <>
                            <PlusIcon className="h-4 w-4" />
                            إضافة الكوبون
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Coupons List */}
              <div className="space-y-3">
                {coupons.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    لا توجد كوبونات حالياً
                  </div>
                ) : (
                  coupons.map((coupon) => (
                    <div
                      key={coupon._id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <TicketIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{coupon.name}</div>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-1 py-0.5 rounded">
                              {coupon.code}
                            </code>
                            <Badge variant="outline" className="text-xs">
                              {coupon.discountPercentage}%
                            </Badge>
                            {coupon.usageLimit && (
                              <Badge variant="secondary" className="text-xs">
                                {coupon.usageCount || 0}/{coupon.usageLimit}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(coupon)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => openDeleteDialog(coupon)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Coupon Dialog */}
        <Dialog open={isEditCouponOpen} onOpenChange={setIsEditCouponOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تعديل الكوبون</DialogTitle>
              <DialogDescription>قم بتعديل بيانات الكوبون</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">اسم الكوبون</label>
                <Input
                  placeholder="مثال: خصم العيد"
                  value={couponName}
                  onChange={(e) => setCouponName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">كود الكوبون</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="مثال: SALE50"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleGenerateCouponCode}
                    type="button"
                  >
                    <RefreshCwIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">نسبة الخصم (%)</label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="مثال: 10"
                  value={couponDiscount}
                  onChange={(e) => setCouponDiscount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  عدد مرات الاستخدام
                </label>
                <Input
                  type="number"
                  min="1"
                  placeholder="اتركه فارغًا للاستخدام غير المحدود"
                  value={couponUsageLimit}
                  onChange={(e) => setCouponUsageLimit(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  اتركه فارغًا للاستخدام غير المحدود
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditCouponOpen(false);
                  resetCouponForm();
                }}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleEditCoupon}
                disabled={isEditLoading}
                className="gap-2"
              >
                {isEditLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Coupon Dialog */}
        <AlertDialog
          open={isDeleteCouponOpen}
          onOpenChange={setIsDeleteCouponOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
              <AlertDialogDescription>
                سيتم حذف الكوبون &quot;{selectedCoupon?.name}&quot; نهائ. هذا
                الإجراء لا يمكن التراجع عنه.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setIsDeleteCouponOpen(false);
                  setSelectedCoupon(null);
                }}
              >
                إلغاء
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCoupon}
                className="bg-destructive hover:bg-destructive/90"
                disabled={isDeleteLoading}
              >
                {isDeleteLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري الحذف...
                  </>
                ) : (
                  "حذف"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <TruckIcon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">إعدادات الشحن</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              تحديد تكلفة الشحن للطلبات
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  تكلفة الشحن الثابتة
                </label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    min="0"
                    placeholder="مثال: 15"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(e.target.value)}
                    className="w-[180px]"
                  />
                  <span className="text-sm text-muted-foreground">ر.س</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  الشحن المجاني للطلبات فوق
                </label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    min="0"
                    placeholder="مثال: 200"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(e.target.value)}
                    className="w-[180px]"
                  />
                  <span className="text-sm text-muted-foreground">ر.س</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  اتركها فارغة لتعطيل الشحن المجاني
                </p>
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
                <Loader2 className="animate-spin size-5" />
                <span>جاري الحفظ...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <SaveIcon className="h-4 w-4" />
                <span>حفظ التغييرات</span>
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

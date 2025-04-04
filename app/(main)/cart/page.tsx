"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/cart-context";
import { Id } from "@/convex/_generated/dataModel";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Plus,
  Minus,
  ShoppingBag,
  Ticket,
  X,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-muted p-6 rounded-full mb-6">
        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">سلة التسوق فارغة</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        لم تقم بإضافة أي منتجات إلى سلة التسوق بعد. استعرض منتجاتنا وأضف ما
        يعجبك.
      </p>
      <Button asChild>
        <Link href="/products" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          تصفح المنتجات
        </Link>
      </Button>
    </div>
  );
}

function CartItemSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg animate-pulse">
      <Skeleton className="h-24 w-24 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}

function CartSummarySkeleton() {
  return (
    <div className="space-y-4 p-4 border rounded-lg animate-pulse">
      <Skeleton className="h-6 w-1/2" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      <Separator />
      <div className="flex justify-between">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export default function CartPage() {
  const {
    cartItems,
    isLoading,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    cartTotal,
    applyCoupon,
    removeCoupon,
    coupon,
    isApplyingCoupon,
    discountAmount,
  } = useCart();
  const validateCouponDirectly = useMutation(api.coupons.validateCoupon);
  const [clearCartDialogOpen, setClearCartDialogOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [status, setStatus] = useState<"idle" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const shippingSettings = useQuery(api.settings.getShippingSettings);

  // Handle quantity change
  const handleQuantityChange = (
    cartItemId: string,
    currentQuantity: number,
    change: number
  ) => {
    const newQuantity = Math.max(1, currentQuantity + change);
    if (newQuantity !== currentQuantity) {
      updateCartItemQuantity(cartItemId as unknown as Id<"cart">, newQuantity);
    }
  };

  // Calculate subtotal, shipping, and total
  const subtotal = cartTotal;
  const calculateShipping = (subtotal: number) => {
    if (!shippingSettings) return 15; // Default fallback

    const { shippingCost, freeShippingThreshold } = shippingSettings;

    if (freeShippingThreshold && subtotal >= freeShippingThreshold) {
      return 0;
    }
    return shippingCost;
  };

  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const success = await applyCoupon(couponCode.trim().toUpperCase());
      if (!success) {
        setStatus("error");
        // Check if the coupon exists but has reached its usage limit
        const coupon = await validateCouponDirectly({
          code: couponCode.trim().toUpperCase(),
        });
        if (
          coupon?.valid === false &&
          coupon?.message === "Coupon usage limit reached"
        ) {
          setErrorMessage("تم الوصول إلى الحد الأقصى لاستخدام هذا الكوبون");
        } else {
          setErrorMessage("الكوبون غير صالح");
        }
        const couponInput = document.getElementById("coupon-input");
        if (couponInput) {
          (couponInput as HTMLInputElement).focus();
        }
      } else {
        setStatus("idle");
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setStatus("error");
      setErrorMessage("حدث خطأ أثناء تطبيق الكوبون");
    }
  };

  // Handle coupon removal
  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode("");
    setStatus("idle");
    setErrorMessage("");
  };

  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold">سلة التسوق</h1>
              {cartItems.length > 0 && (
                <AlertDialog
                  open={clearCartDialogOpen}
                  onOpenChange={setClearCartDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      إفراغ السلة
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                      <AlertDialogDescription>
                        سيتم حذف جميع المنتجات من سلة التسوق. هذا الإجراء لا
                        يمكن التراجع عنه.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          clearCart();
                          setClearCartDialogOpen(false);
                        }}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        إفراغ السلة
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <CartItemSkeleton key={i} />
                  ))}
                </div>
                <div>
                  <CartSummarySkeleton />
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => {
                    const discountedPrice =
                      item.product.price *
                      (1 - item.product.discountPercentage / 100);
                    const itemTotal = discountedPrice * item.quantity;

                    return (
                      <Card key={item._id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            <div className="relative h-40 sm:h-auto sm:w-40 bg-muted/30">
                              <Image
                                src={item.product.mainImageUrl || "/hoodie.png"}
                                alt={item.product.name}
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                            <div className="flex-1 p-4 flex flex-col">
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <Link
                                    href={`/products/${item.product._id}`}
                                    className="text-lg font-semibold hover:text-primary transition-colors"
                                  >
                                    {item.product.name}
                                  </Link>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive"
                                    onClick={() => removeFromCart(item._id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">حذف</span>
                                  </Button>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                  {item.product.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-2">
                                  {item.selectedSize && (
                                    <div className="text-sm bg-muted px-2 py-1 rounded">
                                      المقاس: {item.selectedSize}
                                    </div>
                                  )}
                                  {item.selectedColor && (
                                    <div className="text-sm bg-muted px-2 py-1 rounded flex items-center gap-2">
                                      اللون: {item.selectedColor}
                                      <span
                                        className="inline-block h-3 w-3 rounded-full"
                                        style={{
                                          backgroundColor:
                                            item.product.colors.find(
                                              (c) =>
                                                c.name === item.selectedColor
                                            )?.value || "#000",
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 mt-auto">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      handleQuantityChange(
                                        item._id,
                                        item.quantity,
                                        -1
                                      )
                                    }
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="h-3 w-3" />
                                    <span className="sr-only">تقليل</span>
                                  </Button>
                                  <span className="w-8 text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      handleQuantityChange(
                                        item._id,
                                        item.quantity,
                                        1
                                      )
                                    }
                                  >
                                    <Plus className="h-3 w-3" />
                                    <span className="sr-only">زيادة</span>
                                  </Button>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-primary">
                                    {itemTotal.toFixed(2)} ر.س
                                  </span>
                                  {item.product.discountPercentage > 0 && (
                                    <span className="text-sm text-muted-foreground line-through">
                                      {(
                                        item.product.price * item.quantity
                                      ).toFixed(2)}{" "}
                                      ر.س
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">ملخص الطلب</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            المجموع الفرعي
                          </span>
                          <span>{subtotal.toFixed(2)} ر.س</span>
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">الشحن</span>
                            <div>
                              <span className="w-full flex justify-end">
                                {shipping === 0 ? "مجاني" : `${shipping} ر.س`}
                              </span>
                            </div>
                          </div>
                          <span>
                            {shippingSettings?.freeShippingThreshold &&
                              subtotal <
                                shippingSettings.freeShippingThreshold && (
                                <div className="text-sm text-muted-foreground">
                                  أضف{" "}
                                  {(
                                    shippingSettings.freeShippingThreshold -
                                    subtotal
                                  ).toFixed(2)}{" "}
                                  ر.س للحصول على شحن مجاني
                                </div>
                              )}
                          </span>
                        </div>
                        {coupon && (
                          <div className="flex justify-between text-green-600">
                            <span className="flex items-center gap-1">
                              <Ticket className="h-4 w-4" />
                              خصم ({coupon.discountPercentage}%)
                            </span>
                            <span>- {discountAmount.toFixed(2)} ر.س</span>
                          </div>
                        )}
                      </div>

                      {/* Coupon Input */}
                      <div className="mt-4 mb-4">
                        {coupon ? (
                          <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-900">
                            <div className="flex items-center gap-2">
                              <Ticket className="h-4 w-4 text-green-600" />
                              <span className="text-sm">
                                تم تطبيق كوبون{" "}
                                <span className="font-bold">{coupon.code}</span>{" "}
                                ({coupon.discountPercentage}%)
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 bg-green-50 hover:bg-green-50"
                              onClick={handleRemoveCoupon}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Input
                                  id="coupon-input"
                                  placeholder="أدخل كود الكوبون"
                                  value={couponCode}
                                  onChange={(e) =>
                                    setCouponCode(e.target.value)
                                  }
                                  className="text-right"
                                />
                              </div>
                              <Button
                                onClick={handleApplyCoupon}
                                disabled={
                                  isApplyingCoupon || !couponCode.trim()
                                }
                              >
                                {isApplyingCoupon ? (
                                  <span className="flex items-center gap-2">
                                    جاري التطبيق...
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  </span>
                                ) : (
                                  "تطبيق"
                                )}
                              </Button>
                            </div>
                            {/* Error Message */}
                            {status === "error" && (
                              <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-950/30 p-2 rounded-md border border-red-200 dark:border-red-900">
                                <X
                                  className="h-4 w-4 cursor-pointer"
                                  onClick={handleRemoveCoupon}
                                />
                                <span className="text-sm">
                                  {errorMessage || "الكوبون غير صالح"}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <Separator className="my-4" />
                      <div className="flex justify-between font-bold mb-4">
                        <span>الإجمالي</span>
                        <span className="text-primary">
                          {total.toFixed(2)} ر.س
                        </span>
                      </div>
                      <Button className="w-full gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        إتمام الطلب
                      </Button>
                      <div className="mt-4 text-center">
                        <Link
                          href="/products"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                          <ArrowLeft className="h-3 w-3" />
                          متابعة التسوق
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

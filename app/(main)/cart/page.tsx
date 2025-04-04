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
} from "lucide-react";

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
  } = useCart();
  const [clearCartDialogOpen, setClearCartDialogOpen] = useState(false);

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
  const shipping = subtotal > 0 ? 15 : 0; // Example shipping cost
  const total = subtotal + shipping;

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
                                    <div className="text-sm bg-muted px-2 py-1 rounded flex items-center gap-1">
                                      اللون: {item.selectedColor}
                                      <span
                                        className="inline-block h-3 w-3 rounded-full border"
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
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">الشحن</span>
                          <span>{shipping.toFixed(2)} ر.س</span>
                        </div>
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

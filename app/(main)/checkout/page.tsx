"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  MapPin,
  CheckCircle,
  ShoppingBag,
  Truck,
  Phone,
  User,
  Mail,
  Home,
  MapPinned,
  Building,
  Loader2,
  Ticket,
  Download,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Skeleton loaders
function CheckoutSummarySkeleton() {
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
    </div>
  );
}

function CheckoutFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

// Main checkout component
export default function CheckoutPage() {
  const router = useRouter();
  const {
    cartItems,
    isLoading: cartLoading,
    cartTotal,
    coupon,
    discountAmount,
    removeCoupon,
  } = useCart();
  const shippingSettings = useQuery(api.settings.getShippingSettings);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    district: "",
    street: "",
    postalCode: "",
    notes: "",
  });

  // UI state
  const [activeStep, setActiveStep] = useState("shipping");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculate order totals
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
  const total = subtotal + shipping - discountAmount;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.country ||
      !formData.city ||
      !formData.district ||
      !formData.street
    ) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    // Validate phone number (simple validation)
    const phoneRegex = /^\d{9,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/[+\s-]/g, ""))) {
      toast.error("يرجى إدخال رقم هاتف صحيح");
      return;
    }

    // Move to payment step
    setActiveStep("payment");
  };

  // Create order mutation
  const createOrderMutation = useMutation(api.orders.createOrder);
  const [orderDetails, setOrderDetails] = useState<{
    orderId: string;
    orderNumber: string;
    orderSubtotal?: number;
    orderShipping?: number;
    orderDiscount?: number;
    orderTotal?: number;
  } | null>(null);

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Create the order
      const result = await createOrderMutation({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        district: formData.district,
        street: formData.street,
        postalCode: formData.postalCode || undefined,
        notes: formData.notes || undefined,
        paymentMethod: "cash_on_delivery", // Currently only supporting cash on delivery
        couponCode: coupon?.code,
        couponDiscount: discountAmount,
      });

      // Store order details for confirmation page including current totals
      setOrderDetails({
        ...result,
        orderSubtotal: subtotal,
        orderShipping: shipping,
        orderDiscount: discountAmount,
        orderTotal: total,
      });

      // Clear the coupon from the cart context
      // This ensures that when the user adds new items to the cart,
      // the previously used coupon won't be applied automatically
      if (coupon) {
        removeCoupon();
      }

      // Move to confirmation step
      setActiveStep("confirmation");

      // Show success message
      toast.success("تم تأكيد طلبك بنجاح!");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if cart is empty and redirect if needed
  useEffect(() => {
    // Only redirect if cart is empty AND we're not on the confirmation step
    // This prevents redirect after successful order completion
    if (
      !cartLoading &&
      cartItems.length === 0 &&
      activeStep !== "confirmation"
    ) {
      toast.error("سلة التسوق فارغة");
      router.push("/cart");
    }
  }, [cartItems, cartLoading, router, activeStep]);

  // Handle loading state
  useEffect(() => {
    if (cartItems.length > 0 && shippingSettings !== undefined) {
      setLocalLoading(false);
    } else {
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [cartItems, shippingSettings]);

  // Handle order card download
  const handleDownloadOrderCard = async () => {
    setIsDownloading(true);
    try {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not supported");

      // Set smaller canvas size (receipt style)
      canvas.width = 400; // Reduced from 800
      canvas.height = 600; // Reduced from 1132

      // Helper function to draw rounded rectangle
      const roundRect = (
        x: number,
        y: number,
        w: number,
        h: number,
        radius: number
      ) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      };

      // Background
      ctx.fillStyle = "#f8f9fa";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header background
      ctx.fillStyle = "#ffffff";
      roundRect(20, 20, canvas.width - 40, 80, 8);
      ctx.fill();
      ctx.strokeStyle = "#e9ecef";
      ctx.stroke();

      // Store name and logo
      ctx.fillStyle = "#1a1a1a";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "right";
      ctx.direction = "rtl";
      ctx.fillText("تسوق", canvas.width - 30, 50);

      // Order number and date
      ctx.font = "14px Arial";
      ctx.fillStyle = "#6c757d";
      ctx.fillText(
        `رقم الطلب: ${orderDetails?.orderNumber || ""}`,
        canvas.width - 30,
        80
      );
      ctx.textAlign = "left";
      ctx.fillText(`${new Date().toLocaleDateString("ar-SA")}`, 30, 80);

      // Main content background
      ctx.fillStyle = "#ffffff";
      roundRect(20, 120, canvas.width - 40, 440, 8);
      ctx.fill();
      ctx.strokeStyle = "#e9ecef";
      ctx.stroke();

      // Customer details section
      let y = 150;
      ctx.textAlign = "right";

      // Section title
      ctx.fillStyle = "#1a1a1a";
      ctx.font = "bold 18px Arial";
      ctx.fillText("معلومات العميل", canvas.width - 30, y);

      // Accent line
      ctx.beginPath();
      ctx.moveTo(canvas.width - 30, y + 5);
      ctx.lineTo(canvas.width - 150, y + 5);
      ctx.strokeStyle = "#007bff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.lineWidth = 1;

      // Customer details
      y += 35;
      ctx.font = "14px Arial";
      ctx.fillStyle = "#495057";

      const details = [
        { label: "الاسم", value: formData.fullName },
        { label: "البريد الإلكتروني", value: formData.email },
        { label: "رقم الجوال", value: formData.phone },
        { label: "البلد", value: formData.country },
        { label: "المدينة", value: formData.city },
        { label: "الحي / المنطقة", value: formData.district },
        { label: "الشارع", value: formData.street },
        { label: "الرمز البريدي", value: formData.postalCode || "" },
      ];

      details.forEach((detail) => {
        ctx.fillStyle = "#6c757d";
        ctx.font = "14px Arial";
        ctx.fillText(`${detail.label}:`, canvas.width - 30, y);
        ctx.fillStyle = "#212529";
        ctx.font = "bold 14px Arial";
        ctx.fillText(detail.value, canvas.width - 120, y);
        y += 25;
      });

      // Order summary section
      y += 20;
      ctx.fillStyle = "#1a1a1a";
      ctx.font = "bold 18px Arial";
      ctx.fillText("ملخص الطلب", canvas.width - 30, y);

      // Accent line
      ctx.beginPath();
      ctx.moveTo(canvas.width - 30, y + 5);
      ctx.lineTo(canvas.width - 130, y + 5);
      ctx.strokeStyle = "#007bff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.lineWidth = 1;

      // Summary box
      y += 30;
      ctx.fillStyle = "#f8f9fa";
      roundRect(30, y, canvas.width - 60, 140, 8);
      ctx.fill();

      // Order summary details
      y += 30;
      ctx.fillStyle = "#495057";
      ctx.font = "14px Arial";

      // Subtotal
      ctx.textAlign = "right";
      ctx.fillText(`المجموع الفرعي:`, canvas.width - 40, y);
      ctx.textAlign = "left";
      ctx.fillText(`${orderDetails?.orderSubtotal?.toFixed(2)} ر.س`, 40, y);

      // Shipping
      y += 25;
      ctx.textAlign = "right";
      ctx.fillText(`رسوم الشحن:`, canvas.width - 40, y);
      ctx.textAlign = "left";
      ctx.fillText(`${orderDetails?.orderShipping?.toFixed(2)} ر.س`, 40, y);

      // Discount if applicable
      if (orderDetails?.orderDiscount && orderDetails.orderDiscount > 0) {
        y += 25;
        ctx.textAlign = "right";
        ctx.fillStyle = "#dc3545";
        ctx.fillText(`الخصم:`, canvas.width - 40, y);
        ctx.textAlign = "left";
        ctx.fillText(`- ${orderDetails.orderDiscount.toFixed(2)} ر.س`, 40, y);
      }

      // Total
      y += 35;
      ctx.fillStyle = "#007bff";
      roundRect(30, y - 20, canvas.width - 60, 40, 8);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "right";
      ctx.fillText(`الإجمالي:`, canvas.width - 40, y);
      ctx.textAlign = "left";
      ctx.fillText(`${orderDetails?.orderTotal?.toFixed(2)} ر.س`, 40, y);

      // Footer
      ctx.fillStyle = "#6c757d";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("شكراً لتسوقكم معنا", canvas.width / 2, canvas.height - 30);

      // Convert canvas to PNG and download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `order-${orderDetails?.orderNumber || "receipt"}.png`;
      link.href = dataUrl;
      link.click();

      toast.success("تم تحميل إيصال الطلب بنجاح");
    } catch (error) {
      console.error("Error generating order card image:", error);
      toast.error("حدث خطأ أثناء تحميل إيصال الطلب");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold">إتمام الطلب</h1>
              <Button variant="outline" size="sm" asChild>
                <Link href="/cart" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  العودة للسلة
                </Link>
              </Button>
            </div>

            {cartLoading || localLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardContent className="p-6">
                      <CheckoutFormSkeleton />
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <CheckoutSummarySkeleton />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardContent className="p-6">
                      <Tabs value={activeStep} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-8">
                          <TabsTrigger
                            value="shipping"
                            disabled={activeStep !== "shipping"}
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span className="hidden sm:inline">
                                معلومات الشحن
                              </span>
                              <span className="sm:hidden">الشحن</span>
                            </div>
                          </TabsTrigger>
                          <TabsTrigger
                            value="payment"
                            disabled={activeStep !== "payment"}
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              <span className="hidden sm:inline">الدفع</span>
                              <span className="sm:hidden">الدفع</span>
                            </div>
                          </TabsTrigger>
                          <TabsTrigger
                            value="confirmation"
                            disabled={activeStep !== "confirmation"}
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              <span className="hidden sm:inline">
                                تأكيد الطلب
                              </span>
                              <span className="sm:hidden">التأكيد</span>
                            </div>
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="shipping" className="mt-0">
                          <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                              <div>
                                <Label
                                  htmlFor="fullName"
                                  className="text-right block mb-2"
                                >
                                  <User className="inline-block mr-2 h-4 w-4" />
                                  الاسم الكامل{" "}
                                  <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                  id="fullName"
                                  name="fullName"
                                  value={formData.fullName}
                                  onChange={handleInputChange}
                                  placeholder="أدخل الاسم الكامل"
                                  required
                                  className="text-right"
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label
                                    htmlFor="email"
                                    className="text-right block mb-2"
                                  >
                                    <Mail className="inline-block mr-2 h-4 w-4" />
                                    البريد الإلكتروني{" "}
                                    <span className="text-destructive">*</span>
                                  </Label>
                                  <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="example@example.com"
                                    required
                                    className="text-right"
                                  />
                                </div>

                                <div>
                                  <Label
                                    htmlFor="phone"
                                    className="text-right block mb-2"
                                  >
                                    <Phone className="inline-block mr-2 h-4 w-4" />
                                    رقم الجوال{" "}
                                    <span className="text-destructive">*</span>
                                  </Label>
                                  <Input
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="05xxxxxxxx"
                                    required
                                    className="text-right"
                                  />
                                </div>
                              </div>

                              <div>
                                <Label
                                  htmlFor="country"
                                  className="text-right block mb-2"
                                >
                                  <MapPin className="inline-block mr-2 h-4 w-4" />
                                  البلد{" "}
                                  <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                  id="country"
                                  name="country"
                                  value={formData.country}
                                  onChange={handleInputChange}
                                  placeholder="أدخل اسم البلد"
                                  required
                                  className="text-right"
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label
                                    htmlFor="city"
                                    className="text-right block mb-2"
                                  >
                                    <Building className="inline-block mr-2 h-4 w-4" />
                                    المدينة{" "}
                                    <span className="text-destructive">*</span>
                                  </Label>
                                  <Input
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="أدخل اسم المدينة"
                                    required
                                    className="text-right"
                                  />
                                </div>

                                <div>
                                  <Label
                                    htmlFor="district"
                                    className="text-right block mb-2"
                                  >
                                    <MapPinned className="inline-block mr-2 h-4 w-4" />
                                    الحي / المنطقة{" "}
                                    <span className="text-destructive">*</span>
                                  </Label>
                                  <Input
                                    id="district"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleInputChange}
                                    placeholder="أدخل اسم الحي أو المنطقة"
                                    required
                                    className="text-right"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label
                                    htmlFor="street"
                                    className="text-right block mb-2"
                                  >
                                    <Home className="inline-block mr-2 h-4 w-4" />
                                    اسم الشارع{" "}
                                    <span className="text-destructive">*</span>
                                  </Label>
                                  <Input
                                    id="street"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    placeholder="أدخل اسم الشارع"
                                    required
                                    className="text-right"
                                  />
                                </div>

                                <div>
                                  <Label
                                    htmlFor="postalCode"
                                    className="text-right block mb-2"
                                  >
                                    <MapPinned className="inline-block mr-2 h-4 w-4" />
                                    الرمز البريدي
                                  </Label>
                                  <Input
                                    id="postalCode"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    placeholder="أدخل الرمز البريدي (اختياري)"
                                    className="text-right"
                                  />
                                </div>
                              </div>

                              <div>
                                <Label
                                  htmlFor="notes"
                                  className="text-right block mb-2"
                                >
                                  ملاحظات إضافية (اختياري)
                                </Label>
                                <Textarea
                                  id="notes"
                                  name="notes"
                                  value={formData.notes}
                                  onChange={handleInputChange}
                                  placeholder="أي ملاحظات إضافية حول طلبك"
                                  className="text-right min-h-[100px]"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <Button type="submit" className="gap-2">
                                متابعة للدفع
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </form>
                        </TabsContent>

                        <TabsContent value="payment" className="mt-0" dir="rtl">
                          <div className="space-y-6">
                            <div className="bg-muted/50 p-4 rounded-lg border">
                              <h3 className="font-medium mb-2 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                معلومات الشحن
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">
                                    الاسم:
                                  </p>
                                  <p className="font-medium">
                                    {formData.fullName}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    رقم الجوال:
                                  </p>
                                  <p className="font-medium">
                                    {formData.phone}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    البريد الإلكتروني:
                                  </p>
                                  <p className="font-medium">
                                    {formData.email}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    البلد:
                                  </p>
                                  <p className="font-medium">
                                    {formData.country}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    المدينة:
                                  </p>
                                  <p className="font-medium">{formData.city}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    الحي / المنطقة:
                                  </p>
                                  <p className="font-medium">
                                    {formData.district}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    الشارع:
                                  </p>
                                  <p className="font-medium">
                                    {formData.street}
                                  </p>
                                </div>
                                {formData.postalCode && (
                                  <div>
                                    <p className="text-muted-foreground">
                                      الرمز البريدي:
                                    </p>
                                    <p className="font-medium">
                                      {formData.postalCode}
                                    </p>
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="link"
                                className="px-0 h-auto text-blue-500 underline"
                                onClick={() => setActiveStep("shipping")}
                              >
                                تعديل
                              </Button>
                            </div>

                            <div className="space-y-4">
                              <h3 className="font-medium">اختر طريقة الدفع</h3>

                              <div className="border rounded-lg p-4 bg-primary/5 flex items-center gap-3">
                                <div className="size-5 rounded-full border-2 border-primary flex items-center justify-center">
                                  <div className="size-2 bg-primary rounded-full"></div>
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">
                                    الدفع عند الاستلام
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    ادفع نقدً عند استلام طلبك
                                  </p>
                                </div>
                              </div>

                              {/* Placeholder for future payment methods */}
                              <div className="border rounded-lg p-4 bg-muted/30 flex items-center gap-3 opacity-60">
                                <div className="size-5 rounded-full border-2 border-muted-foreground flex items-center justify-center"></div>
                                <div className="flex-1">
                                  <p className="font-medium">بطاقة ائتمان</p>
                                  <p className="text-sm text-muted-foreground">
                                    قريباً - ادفع باستخدام بطاقة الائتمان
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-row-reverse justify-between">
                              <Button
                                variant="outline"
                                onClick={() => setActiveStep("shipping")}
                                className="gap-2"
                              >
                                العودة
                                <ArrowLeft className="h-4 w-4" />
                              </Button>

                              <Button
                                onClick={handlePaymentSubmit}
                                disabled={isSubmitting}
                                className="gap-2"
                              >
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    جاري المعالجة...
                                  </>
                                ) : (
                                  <>
                                    <ArrowRight className="h-4 w-4" />
                                    تأكيد الطلب
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="confirmation" className="mt-0">
                          <div className="text-center py-8 space-y-6">
                            <div className="mx-auto bg-primary/10 rounded-full p-6 w-24 h-24 flex items-center justify-center">
                              <CheckCircle className="h-12 w-12 text-primary" />
                            </div>

                            <div>
                              <h2 className="text-2xl font-bold mb-2">
                                تم تأكيد طلبك بنجاح!
                              </h2>
                              <p className="text-muted-foreground max-w-md mx-auto">
                                شكراً لك على طلبك. سيتم التواصل معك قريباً
                                لتأكيد التفاصيل وإتمام عملية الشحن.
                              </p>
                            </div>

                            <div
                              className="p-4 rounded-lg border max-w-md mx-auto text-right relative overflow-hidden"
                              style={{ backgroundColor: "#f8f8f8" }}
                            >
                              <div
                                className="absolute top-0 left-0 w-24 h-24 rounded-br-full -translate-x-8 -translate-y-8"
                                style={{
                                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                                }}
                              ></div>
                              <div
                                className="absolute bottom-0 right-0 w-32 h-32 rounded-tl-full translate-x-12 translate-y-12"
                                style={{
                                  backgroundColor: "rgba(0, 0, 0, 0.03)",
                                }}
                              ></div>
                              <div className="relative z-10">
                                <h3
                                  className="font-medium mb-2 flex items-center justify-between"
                                  style={{ color: "#000000" }}
                                >
                                  <span>تفاصيل الطلب</span>
                                  <div
                                    className="flex items-center gap-1 text-xs"
                                    style={{ color: "#666666" }}
                                  >
                                    <span>
                                      {new Date().toLocaleDateString("ar-SA")}
                                    </span>
                                  </div>
                                </h3>
                                <div
                                  className="space-y-2 text-sm"
                                  style={{ color: "#333333" }}
                                >
                                  <div className="flex justify-between">
                                    <span style={{ color: "#666666" }}>
                                      رقم الطلب:
                                    </span>
                                    <span className="font-medium">
                                      {orderDetails?.orderNumber ||
                                        "#ORD-000000"}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span style={{ color: "#666666" }}>
                                      تاريخ الطلب:
                                    </span>
                                    <span className="font-medium">
                                      {new Date().toLocaleDateString("ar-SA")}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span style={{ color: "#666666" }}>
                                      طريقة الدفع:
                                    </span>
                                    <span className="font-medium">
                                      الدفع عند الاستلام
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span style={{ color: "#666666" }}>
                                      المجموع الفرعي:
                                    </span>
                                    <span className="font-medium">
                                      {orderDetails?.orderSubtotal?.toFixed(
                                        2
                                      ) || "0.00"}{" "}
                                      ر.س
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span style={{ color: "#666666" }}>
                                      الشحن:
                                    </span>
                                    <span className="font-medium">
                                      {orderDetails?.orderShipping === 0
                                        ? "مجاني"
                                        : `${orderDetails?.orderShipping?.toFixed(2) || "0.00"} ر.س`}
                                    </span>
                                  </div>
                                  {orderDetails?.orderDiscount &&
                                    orderDetails.orderDiscount > 0 && (
                                      <div
                                        className="flex justify-between"
                                        style={{ color: "#22c55e" }}
                                      >
                                        <span className="flex items-center gap-1">
                                          <Ticket
                                            className="h-4 w-4"
                                            style={{ color: "#22c55e" }}
                                          />
                                          خصم
                                        </span>
                                        <span>
                                          -{" "}
                                          {orderDetails.orderDiscount.toFixed(
                                            2
                                          )}{" "}
                                          ر.س
                                        </span>
                                      </div>
                                    )}
                                  <div className="flex justify-between font-bold">
                                    <span style={{ color: "#666666" }}>
                                      الإجمالي:
                                    </span>
                                    <span
                                      className="font-medium"
                                      style={{ color: "#000000" }}
                                    >
                                      {orderDetails?.orderTotal?.toFixed(2) ||
                                        "0.00"}{" "}
                                      ر.س
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="pt-4 flex flex-wrap gap-3 justify-center">
                                <Button asChild>
                                  <Link href="/products" className="gap-2">
                                    <ShoppingBag className="h-4 w-4" />
                                    متابعة التسوق
                                  </Link>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="gap-2"
                                  onClick={handleDownloadOrderCard}
                                  disabled={isDownloading}
                                >
                                  {isDownloading ? (
                                    <>
                                      جاري التحميل...
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    </>
                                  ) : (
                                    <>
                                      تحميل الإيصال
                                      <Download className="h-4 w-4" />
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">ملخص الطلب</h3>

                      <div className="space-y-4 mb-4">
                        {cartItems.map((item) => {
                          const discountedPrice =
                            item.product.price *
                            (1 - item.product.discountPercentage / 100);
                          const itemTotal = discountedPrice * item.quantity;

                          return (
                            <div
                              key={item._id}
                              className="flex gap-3 py-2 border-b last:border-0"
                            >
                              <div className="relative h-16 w-16 bg-muted/30 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                  src={
                                    item.product.mainImageUrl || "/hoodie.png"
                                  }
                                  alt={item.product.name}
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">
                                  {item.product.name}
                                </h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  <div className="text-xs bg-muted px-2 py-1 rounded">
                                    الكمية: {item.quantity}
                                  </div>
                                  {item.selectedSize && (
                                    <div className="text-xs bg-muted px-2 py-1 rounded">
                                      المقاس: {item.selectedSize}
                                    </div>
                                  )}
                                  {item.selectedColor && (
                                    <div className="text-xs bg-muted px-2 py-1 rounded flex items-center gap-1">
                                      <span
                                        className="inline-block h-2 w-2 rounded-full"
                                        style={{
                                          backgroundColor:
                                            item.product.colors.find(
                                              (c) =>
                                                c.name === item.selectedColor
                                            )?.value || "#000",
                                        }}
                                      />
                                      {item.selectedColor}
                                    </div>
                                  )}
                                </div>
                                <div className="mt-1 text-sm font-medium text-primary">
                                  {itemTotal.toFixed(2)} ر.س
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            المجموع الفرعي
                          </span>
                          <span>
                            {activeStep === "confirmation"
                              ? orderDetails?.orderSubtotal?.toFixed(2) ||
                                "0.00"
                              : subtotal.toFixed(2)}{" "}
                            ر.س
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">الشحن</span>
                          <span>
                            {activeStep === "confirmation"
                              ? orderDetails?.orderShipping === 0
                                ? "مجاني"
                                : `${orderDetails?.orderShipping?.toFixed(2) || "0.00"} ر.س`
                              : shipping === 0
                                ? "مجاني"
                                : `${shipping} ر.س`}
                          </span>
                        </div>
                        {(activeStep === "confirmation"
                          ? orderDetails?.orderDiscount &&
                            orderDetails.orderDiscount > 0
                          : coupon && coupon.discountPercentage > 0) && (
                          <div className="flex justify-between text-green-600">
                            <span className="flex items-center gap-1">
                              <Ticket className="h-4 w-4" />
                              خصم{" "}
                              {activeStep !== "confirmation" &&
                                coupon &&
                                `(${coupon.discountPercentage}%)`}
                            </span>
                            <span>
                              -
                              {activeStep === "confirmation"
                                ? orderDetails?.orderDiscount?.toFixed(2) ||
                                  "0.00"
                                : discountAmount.toFixed(2)}{" "}
                              ر.س
                            </span>
                          </div>
                        )}
                      </div>

                      <Separator className="my-4" />
                      <div className="flex justify-between font-bold mb-4">
                        <span>الإجمالي</span>
                        <span className="text-primary">
                          {activeStep === "confirmation"
                            ? orderDetails?.orderTotal?.toFixed(2) || "0.00"
                            : total.toFixed(2)}{" "}
                          ر.س
                        </span>
                      </div>

                      <div className="bg-muted/50 p-3 rounded-lg text-sm flex items-start gap-3 mt-4">
                        <Truck className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">معلومات الشحن</p>
                          <p className="text-muted-foreground">
                            {shippingSettings?.freeShippingThreshold
                              ? `الشحن مجاني للطلبات التي تزيد عن ${shippingSettings.freeShippingThreshold} ر.س`
                              : "سيتم إضافة تكلفة الشحن حسب منطقتك"}
                          </p>
                        </div>
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

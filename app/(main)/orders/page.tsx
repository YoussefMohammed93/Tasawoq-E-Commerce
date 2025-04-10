"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingBag,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Truck,
} from "lucide-react";
import { OrderDetailsSheet } from "./_components/order-details-sheet";
import { OrdersEmptyState } from "./_components/orders-empty-state";
import { Heading } from "@/components/ui/heading";

export default function OrdersPage() {
  const orders = useQuery(api.orders.getUserOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Handle order selection for details view
  const handleViewOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDetailsOpen(true);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get status text in Arabic
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار";
      case "processing":
        return "قيد المعالجة";
      case "shipped":
        return "تم الشحن";
      case "delivered":
        return "تم التوصيل";
      case "cancelled":
        return "ملغي";
      default:
        return status;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-5 py-8">
          <div className="flex flex-col gap-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Heading
                  title="طلباتي"
                  description="عرض وتتبع جميع طلباتك السابقة"
                />
              </div>
              {orders && orders.length > 0 && (
                <Button asChild>
                  <Link href="/products" className="gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    تسوق المزيد
                  </Link>
                </Button>
              )}
            </div>

            {/* Orders List */}
            {orders === undefined ? (
              // Loading state
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden border border-muted animate-pulse"
                  >
                    <CardContent className="p-0">
                      <div className="p-6 flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-64 h-24 bg-muted rounded-md"></div>
                        <div className="flex-1 space-y-4">
                          <div className="h-4 bg-muted rounded w-1/3"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                          <div className="h-3 bg-muted rounded w-1/4"></div>
                        </div>
                        <div className="w-32 h-8 bg-muted rounded-md"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : orders.length === 0 ? (
              // Empty state
              <OrdersEmptyState />
            ) : (
              // Orders list
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order._id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="px-6 flex flex-col md:flex-row gap-6">
                        {/* Order Status */}
                        <div className="md:w-64 flex flex-col justify-center gap-2 md:border-l md:pl-6">
                          <div
                            className={`w-fit flex items-center gap-2 px-5 py-1.5 rounded-full text-sm ${getStatusColor(order.status)}`}
                          >
                            {getStatusIcon(order.status)}
                            <span>{getStatusText(order.status)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(order.createdAt).toLocaleDateString(
                                "ar-SA"
                              )}
                            </span>
                          </div>
                          <div className="text-sm font-medium">
                            رقم الطلب: {order.orderNumber}
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="space-y-1 mb-3">
                            <h3 className="font-medium">معلومات الطلب</h3>
                            <div className="text-sm text-muted-foreground">
                              {order.fullName} • {order.phone}
                            </div>
                            <div className="text-sm text-muted-foreground truncate max-w-md">
                              {order.street}, {order.district}, {order.city},{" "}
                              {order.country}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                المجموع:{" "}
                              </span>
                              <span className="font-medium">
                                {order.total.toFixed(2)} ر.س
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                طريقة الدفع:{" "}
                              </span>
                              <span className="font-medium">
                                {order.paymentMethod === "cash_on_delivery"
                                  ? "الدفع عند الاستلام"
                                  : order.paymentMethod === "stripe"
                                    ? "بطاقة ائتمان"
                                    : order.paymentMethod}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                الشحن:{" "}
                              </span>
                              <span className="font-medium">
                                {order.shipping > 0
                                  ? `${order.shipping} ر.س`
                                  : "شحن مجاني"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center justify-center md:justify-end">
                          <Button
                            onClick={() => handleViewOrderDetails(order._id)}
                            className="gap-2 w-full sm:w-auto"
                          >
                            <Eye className="h-4 w-4" />
                            عرض التفاصيل
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Order Details Sheet */}
      {selectedOrderId && (
        <OrderDetailsSheet
          orderId={selectedOrderId as Id<"orders">}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </>
  );
}

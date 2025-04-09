import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export function OrdersEmptyState() {
  return (
    <div className="text-center py-16 px-4">
      <div className="bg-primary/10 inline-flex p-4 rounded-full mb-4">
        <ShoppingBag className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">لا توجد طلبات بعد</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        لم تقم بإجراء أي طلبات حتى الآن. استكشف منتجاتنا وابدأ التسوق الآن!
      </p>
      <Button asChild>
        <Link href="/products" className="gap-2">
          <ShoppingBag className="h-4 w-4" />
          تصفح المنتجات
        </Link>
      </Button>
    </div>
  );
}

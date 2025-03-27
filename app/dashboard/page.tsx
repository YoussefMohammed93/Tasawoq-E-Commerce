import {
  TrendingUpIcon,
  BoxIcon,
  ShoppingCartIcon,
  UsersIcon,
  TrendingDownIcon,
  PackageIcon,
  EyeIcon,
  StarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ShoppingBagIcon,
  WatchIcon,
  SunIcon,
  Sprout,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/heading";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-14 mb-8">
        <Heading
          title="لوحة التحكم"
          description="نظرة عامة على أداء متجرك وإحصائيات المبيعات والعملاء لتحسين استراتيجيتك التجارية."
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">إجمالي المبيعات</h3>
            <TrendingUpIcon className="text-green-500" />
          </div>
          <p className="text-3xl font-bold">45,670 ر.س</p>
          <p className="text-sm text-muted-foreground mt-2">
            +12% من الشهر الماضي
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">الطلبات الجديدة</h3>
            <ShoppingCartIcon className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold">25</p>
          <p className="text-sm text-muted-foreground mt-2">اليوم</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">العملاء النشطين</h3>
            <UsersIcon className="text-purple-500" />
          </div>
          <p className="text-3xl font-bold">1,234</p>
          <p className="text-sm text-muted-foreground mt-2">+5% هذا الأسبوع</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">المنتجات المتاحة</h3>
            <BoxIcon className="text-orange-500" />
          </div>
          <p className="text-3xl font-bold">120</p>
          <p className="text-sm text-muted-foreground mt-2">في المخزون</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">المرتجعات</h3>
            <TrendingDownIcon className="text-red-500" />
          </div>
          <p className="text-3xl font-bold">3</p>
          <p className="text-sm text-muted-foreground mt-2">
            -2% من الشهر الماضي
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">الشحنات المعلقة</h3>
            <PackageIcon className="text-yellow-500" />
          </div>
          <p className="text-3xl font-bold">8</p>
          <p className="text-sm text-muted-foreground mt-2">قيد المعالجة</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">زيارات المتجر</h3>
            <EyeIcon className="text-cyan-500" />
          </div>
          <p className="text-3xl font-bold">5,678</p>
          <p className="text-sm text-muted-foreground mt-2">خلال 30 يوم</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">تقييم المتجر</h3>
            <StarIcon className="text-amber-500" />
          </div>
          <p className="text-3xl font-bold">4.8</p>
          <p className="text-sm text-muted-foreground mt-2">من 5.0</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 mt-6">
        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <h3 className="text-lg font-medium mb-4">المنتجات الأكثر مبيعاً</h3>
          <div className="space-y-3 sm:space-y-4">
            {[
              {
                name: "حقيبة يد جلدية",
                sales: 156,
                revenue: "15,600 ر.س",
                icon: ShoppingBagIcon,
                color: "text-pink-500",
              },
              {
                name: "ساعة ذكية",
                sales: 129,
                revenue: "38,700 ر.س",
                icon: WatchIcon,
                color: "text-blue-500",
              },
              {
                name: "نظارة شمسية",
                sales: 104,
                revenue: "10,400 ر.س",
                icon: SunIcon,
                color: "text-amber-500",
              },
              {
                name: "حذاء رياضي",
                sales: 98,
                revenue: "19,600 ر.س",
                icon: Sprout,
                color: "text-green-500",
              },
            ].map((product) => (
              <div
                key={product.name}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 pb-2 border-b last:border-b-0 sm:border-0 group transition-colors p-2"
              >
                <div className="flex items-center gap-2">
                  <product.icon className={cn("size-5", product.color)} />
                  <span className="font-medium text-sm sm:text-base">
                    {product.name}
                  </span>
                </div>
                <div className="flex justify-between sm:justify-end items-center text-muted-foreground text-sm">
                  <span className="sm:ml-4">{product.sales} مبيعات</span>
                  <span className="mr-2">{product.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 sm:p-6">
          <h3 className="text-lg font-medium mb-4">آخر المعاملات</h3>
          <div className="space-y-3 sm:space-y-4">
            {[
              {
                id: "#4832",
                status: "مكتمل",
                amount: "1,200 ر.س",
                date: "منذ 2 ساعة",
                statusColor: "text-green-500",
                icon: CheckCircleIcon,
              },
              {
                id: "#4831",
                status: "معلق",
                amount: "850 ر.س",
                date: "منذ 3 ساعات",
                statusColor: "text-amber-500",
                icon: ClockIcon,
              },
              {
                id: "#4830",
                status: "مكتمل",
                amount: "2,400 ر.س",
                date: "منذ 5 ساعات",
                statusColor: "text-green-500",
                icon: CheckCircleIcon,
              },
              {
                id: "#4829",
                status: "ملغي",
                amount: "670 ر.س",
                date: "منذ 6 ساعات",
                statusColor: "text-red-500",
                icon: XCircleIcon,
              },
            ].map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 pb-2 border-b last:border-b-0 sm:border-0 group transition-colors p-2"
              >
                <div className="flex items-center gap-2">
                  <transaction.icon
                    className={cn("size-5", transaction.statusColor)}
                  />
                  <span className="font-medium text-sm sm:text-base">
                    {transaction.id}
                  </span>
                  <span className={cn("text-sm", transaction.statusColor)}>
                    ({transaction.status})
                  </span>
                </div>
                <div className="flex justify-between sm:justify-end items-center text-muted-foreground text-sm">
                  <span className="sm:ml-4">{transaction.amount}</span>
                  <span>{transaction.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

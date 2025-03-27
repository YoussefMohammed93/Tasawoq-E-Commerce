"use client";

import {
  HomeIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon as CustomersIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function DashboardSidebar() {
  const pathname = usePathname();

  const routes = [
    {
      icon: HomeIcon,
      label: "الرئيسية",
      tooltip: "الرئيسية",
      href: "/dashboard",
    },
    {
      icon: PackageIcon,
      label: "المنتجات",
      tooltip: "المنتجات",
      href: "/dashboard/products",
    },
    {
      icon: ShoppingCartIcon,
      label: "الطلبات",
      tooltip: "الطلبات",
      href: "/dashboard/orders",
    },
    {
      icon: CustomersIcon,
      label: "العملاء",
      tooltip: "العملاء",
      href: "/dashboard/customers",
    },
    {
      icon: SettingsIcon,
      label: "الإعدادات",
      tooltip: "الإعدادات",
      href: "/dashboard/settings",
    },
  ];

  return (
    <Sidebar side="right" className="border-r bg-background">
      <SidebarHeader className="px-4 h-14">
        <h2 className="text-lg font-bold">لوحة التحكم</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {routes.map((route) => (
            <SidebarMenuItem key={route.href}>
              <Link href={route.href} className="w-full">
                <SidebarMenuButton
                  tooltip={route.tooltip}
                  className="cursor-pointer"
                  isActive={pathname === route.href}
                >
                  <route.icon className="ml-1 h-5 w-5" />
                  <span>{route.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

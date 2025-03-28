"use client";

import {
  HomeIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon as CustomersIcon,
  StarIcon,
  ChevronDownIcon,
  LayoutDashboardIcon,
  LayoutIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const mainSections = [
    {
      label: "الهيدر",
      href: "/dashboard/sections/header",
    },
    {
      label: "الرئيسي",
      href: "/dashboard/sections/hero",
    },
    {
      label: "الفئات",
      href: "/dashboard/sections/categories",
    },
    {
      label: "تخفيضات حصرية",
      href: "/dashboard/sections/sales",
    },
    {
      label: "وصل حديثا",
      href: "/dashboard/sections/new-arrivals",
    },
    {
      label: "منتجات مميزة",
      href: "/dashboard/sections/featured-products",
    },
    {
      label: "تواصل معنا",
      href: "/dashboard/sections/contact",
    },
    {
      label: "آراء العملاء",
      href: "/dashboard/sections/reviews",
    },
    {
      label: "شركاؤنا المعتمدون",
      href: "/dashboard/sections/partners",
    },
    {
      label: "نشرتنا البريدية",
      href: "/dashboard/sections/newsletter",
    },
    {
      label: "مميزات المتجر",
      href: "/dashboard/sections/store-features",
    },
    {
      label: "الفوتر",
      href: "/dashboard/sections/footer",
    },
  ];

  const routes = [
    {
      icon: HomeIcon,
      label: "الرئيسية",
      tooltip: "الرئيسية",
      href: "/dashboard",
    },
    {
      icon: LayoutIcon,
      label: "الأقسام",
      tooltip: "الأقسام",
      sections: mainSections,
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
      icon: StarIcon,
      label: "التقييمات",
      tooltip: "التقييمات",
      href: "/dashboard/reviews",
    },
    {
      icon: SettingsIcon,
      label: "الإعدادات",
      tooltip: "الإعدادات",
      href: "/dashboard/settings",
    },
  ];

  return (
    <Sidebar side="right" className="border-r bg-background md:pt-14">
      <SidebarHeader className="px-4 h-14">
        <h2 className="text-lg font-bold">لوحة التحكم</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {routes.map((route, index) => (
            <SidebarMenuItem key={route.href || index}>
              {route.sections ? (
                <>
                  <SidebarMenuButton
                    tooltip={route.tooltip}
                    className="cursor-pointer"
                    isActive={route.sections.some(
                      (section) => pathname === section.href
                    )}
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <route.icon className="ml-1 h-5 w-5" />
                    <span>{route.label}</span>
                    <ChevronDownIcon
                      className={`h-4 w-4 mr-auto transition-transform ${
                        isOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </SidebarMenuButton>
                  {isOpen && (
                    <SidebarMenuSub>
                      {route.sections.map((section) => (
                        <SidebarMenuSubItem key={section.href}>
                          <SidebarMenuSubButton
                            asChild={true}
                            isActive={pathname === section.href}
                          >
                            <Link
                              href={section.href}
                              className="flex w-full items-center gap-2"
                            >
                              <LayoutDashboardIcon className="h-4 w-4 ml-1" />
                              <span>{section.label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </>
              ) : (
                <SidebarMenuButton
                  asChild={true}
                  tooltip={route.tooltip}
                  className="cursor-pointer"
                  isActive={pathname === route.href}
                >
                  <Link href={route.href} className="flex w-full items-center">
                    <route.icon className="ml-1 h-5 w-5" />
                    <span>{route.label}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Search, Menu } from "lucide-react";

const navigation = [
  { name: "الرئيسية", href: "/" },
  { name: "المنتجات", href: "/products" },
  { name: "الفئات", href: "/categories" },
  { name: "العروض", href: "/offers" },
  { name: "تواصل معنا", href: "/contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <nav className="max-w-7xl mx-auto px-5">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 relative">
              <span className="text-2xl font-bold text-primary">تسوق</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative py-1.5 text-sm font-medium transition-colors",
                  "hover:text-primary",
                  "after:absolute after:left-0 after:right-0 after:-bottom-[1.5px] after:h-0.5 after:rounded-full after:bg-primary after:transition-transform",
                  isActive(item.href)
                    ? "text-primary after:scale-x-100"
                    : "text-foreground/70 after:scale-x-0 hover:after:scale-x-100"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hidden md:flex transition-colors",
                pathname === "/search" && "text-primary bg-primary/10"
              )}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">بحث</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hidden md:flex transition-colors",
                pathname === "/wishlist" && "text-primary bg-primary/10"
              )}
              asChild
            >
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                <span className="sr-only">المفضلة</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "transition-colors",
                pathname === "/cart" && "text-primary bg-primary/10"
              )}
              asChild
            >
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  2
                </span>
                <span className="sr-only">السلة</span>
              </Link>
            </Button>

            <UserButton afterSignOutUrl="/" />

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">القائمة</span>
            </Button>
          </div>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="right" className="w-full max-w-xs p-0">
            <SheetHeader className="p-4 text-right border-b">
              <SheetTitle>القائمة</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col">
              <div className="flex-1 p-4">
                <div className="space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                        isActive(item.href)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground/70 hover:bg-primary/5 hover:text-foreground"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="border-t p-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full gap-2",
                      pathname === "/wishlist" &&
                        "bg-primary/10 text-primary border-primary"
                    )}
                    asChild
                  >
                    <Link href="/wishlist" onClick={() => setIsOpen(false)}>
                      <Heart className="h-4 w-4" />
                      المفضلة
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full gap-2",
                      pathname === "/search" &&
                        "bg-primary/10 text-primary border-primary"
                    )}
                    asChild
                  >
                    <Link href="/search" onClick={() => setIsOpen(false)}>
                      <Search className="h-4 w-4" />
                      بحث
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

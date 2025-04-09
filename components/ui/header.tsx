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
import { useQuery } from "convex/react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Heart, Search, Menu, Package } from "lucide-react";
import { SearchDialog } from "@/components/search-dialog";
import { useCart } from "@/contexts/cart-context";

const HeaderLinkSkeleton = ({ isMobile = false }: { isMobile?: boolean }) => {
  return isMobile ? (
    <Skeleton className="h-9 w-full rounded-md" />
  ) : (
    <Skeleton className="h-6 w-20" />
  );
};

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const pathname = usePathname();
  const headerLinks = useQuery(api.header.getHeaderLinks);
  const { cartCount } = useCart();

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
            {!headerLinks ? (
              <>
                <HeaderLinkSkeleton />
                <HeaderLinkSkeleton />
                <HeaderLinkSkeleton />
                <HeaderLinkSkeleton />
              </>
            ) : (
              headerLinks.map((item) => (
                <Link
                  key={item._id}
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
              ))
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hidden md:flex transition-colors hover:bg-primary/10",
                pathname === "/search" &&
                  "text-primary bg-primary/10 hover:bg-primary/10"
              )}
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">بحث</span>
            </Button>
            <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hidden md:flex transition-colors hover:bg-primary/10",
                pathname === "/wishlist" &&
                  "text-primary bg-primary/10 hover:bg-primary/10"
              )}
              asChild
            >
              <Link href="/wishlist" className="relative">
                <Heart className="h-5 w-5" />
                <span className="sr-only">المفضلة</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hidden md:flex transition-colors hover:bg-primary/10",
                pathname === "/orders" &&
                  "text-primary bg-primary/10 hover:bg-primary/10"
              )}
              asChild
            >
              <Link href="/orders" className="relative">
                <Package className="h-5 w-5" />
                <span className="sr-only">طلباتي</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "transition-colors hover:bg-primary/10",
                pathname === "/cart" &&
                  "text-primary bg-primary/10 hover:bg-primary/10"
              )}
              asChild
            >
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5.5 w-5.5 rounded-full bg-primary text-sm pt-0.5 font-medium text-primary-foreground flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">السلة</span>
              </Link>
            </Button>

            <UserButton />

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
                  {!headerLinks ? (
                    <div className="space-y-2">
                      <HeaderLinkSkeleton isMobile />
                      <HeaderLinkSkeleton isMobile />
                      <HeaderLinkSkeleton isMobile />
                      <HeaderLinkSkeleton isMobile />
                    </div>
                  ) : (
                    headerLinks.map((item) => (
                      <Link
                        key={item._id}
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
                    ))
                  )}
                </div>
              </div>
              <div className="border-t p-4">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full gap-2",
                      pathname === "/orders" &&
                        "bg-primary/10 text-primary border-primary"
                    )}
                    asChild
                  >
                    <Link href="/orders" onClick={() => setIsOpen(false)}>
                      <Package className="h-4 w-4" />
                      طلباتي
                    </Link>
                  </Button>
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
                    onClick={() => {
                      setIsOpen(false);
                      setSearchOpen(true);
                    }}
                  >
                    <Search className="h-4 w-4" />
                    بحث
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

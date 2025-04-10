import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { El_Messiri } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "./convex-client-provider";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { CartProvider } from "@/contexts/cart-context";
import { StripeProvider } from "./providers/stripe-provider";
import { ViewTracker } from "./components/analytics/view-tracker";

const elMessiri = El_Messiri({
  variable: "--font-el-messiri",
  subsets: ["latin", "arabic"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${elMessiri.variable} antialiased`}>
          <ConvexClientProvider>
            <WishlistProvider>
              <CartProvider>
                <StripeProvider>
                  <ViewTracker />
                  {children}
                  <Toaster
                    richColors
                    closeButton
                    position="bottom-right"
                    dir="rtl"
                  />
                </StripeProvider>
              </CartProvider>
            </WishlistProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

type CartItem = {
  _id: Id<"cart">;
  productId: Id<"products">;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  addedAt: string;
  updatedAt: string;
  product: {
    _id: Id<"products">;
    name: string;
    description: string;
    price: number;
    discountPercentage: number;
    quantity: number;
    mainImage: Id<"_storage">;
    gallery: Id<"_storage">[];
    mainImageUrl: string | null;
    galleryUrls: (string | null)[];
    categoryId: Id<"categories">;
    sizes: Array<{ name: string; price: number }>;
    colors: Array<{ name: string; value: string }>;
    _creationTime: number;
    createdAt: string;
    updatedAt: string;
  };
};

type CouponType = {
  _id: Id<"coupons">;
  name: string;
  code: string;
  discountPercentage: number;
  usageLimit?: number;
  usageCount?: number;
};

type CartContextType = {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (
    productId: Id<"products">,
    quantity?: number,
    selectedSize?: string,
    selectedColor?: string
  ) => Promise<void>;
  removeFromCart: (cartItemId: Id<"cart">) => Promise<void>;
  removeProductFromCart: (productId: Id<"products">) => Promise<void>;
  updateCartItemQuantity: (
    cartItemId: Id<"cart">,
    quantity: number
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  isProductInCart: (productId: Id<"products">) => boolean;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  coupon: CouponType | null;
  isApplyingCoupon: boolean;
  discountAmount: number;
  finalTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [coupon, setCoupon] = useState<CouponType | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const pathname = usePathname();

  // Fetch cart data
  const cartQuery = useQuery(api.cart.getUserCart);
  const cartItems = React.useMemo(() => cartQuery || [], [cartQuery]);
  const cartCount = useQuery(api.cart.getCartCount) || 0;

  // Handle loading state
  useEffect(() => {
    // If cartItems is already defined, set loading to false
    if (cartItems !== undefined) {
      // Use a short timeout to ensure the UI has time to update
      const timer = setTimeout(() => {
        setIsLoading(false);
        console.log("Cart context: Setting isLoading to false", {
          cartItemsLength: cartItems.length,
        });
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [cartItems]);

  // When pathname changes, don't automatically set loading to true
  // This prevents the loading state from being reset when navigating to the cart page

  // Calculate cart total
  const cartTotal = React.useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = item?.product?.price
        ? item.product.price *
          (1 - (item.product.discountPercentage || 0) / 100)
        : 0;
      return total + price * (item?.quantity || 0);
    }, 0);
  }, [cartItems]);

  // Calculate discount amount
  const discountAmount = React.useMemo(() => {
    if (!coupon) return 0;
    return (cartTotal * coupon.discountPercentage) / 100;
  }, [cartTotal, coupon]);

  // Calculate final total after discount
  const finalTotal = React.useMemo(() => {
    return Math.max(0, cartTotal - discountAmount);
  }, [cartTotal, discountAmount]);

  // Mutations
  const addToCartMutation = useMutation(api.cart.addToCart);
  const removeFromCartMutation = useMutation(api.cart.removeFromCart);
  const removeProductFromCartMutation = useMutation(
    api.cart.removeProductFromCart
  );
  const updateCartItemQuantityMutation = useMutation(
    api.cart.updateCartItemQuantity
  );
  const clearCartMutation = useMutation(api.cart.clearCart);
  // We'll use a different approach for validating coupons

  // This effect is no longer needed as we handle loading state in the pathname effect above

  // Check if a product is in the cart
  const isProductInCart = (productId: Id<"products">) => {
    return cartItems.some((item) => item?.productId === productId);
  };

  // Add a product to the cart
  const addToCart = async (
    productId: Id<"products">,
    quantity = 1,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    if (!isSignedIn) {
      toast.error("يرجى تسجيل الدخول لإضافة المنتج إلى السلة");
      return;
    }

    try {
      console.log("Adding to cart with params:", { productId, quantity }); // Debug log

      // Check if we're on the product detail page
      const isProductDetailPage =
        pathname?.includes("/products/") &&
        !pathname?.includes("/products/page") &&
        pathname?.split("/").length > 2;

      // If we're not on the product detail page and no size/color is provided,
      // we'll let the backend handle the default values
      // The backend will automatically select the smallest size and first color

      console.log("Is product detail page:", isProductDetailPage);
      console.log("Current pathname:", pathname);

      await addToCartMutation({
        productId,
        quantity,
        selectedSize,
        selectedColor,
      });

      console.log("Mutation completed successfully"); // Debug log
      toast.success("تمت إضافة المنتج إلى السلة");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("فشل في إضافة المنتج إلى السلة");
    }
  };

  // Remove an item from the cart
  const removeFromCart = async (cartItemId: Id<"cart">) => {
    if (!isSignedIn) {
      return;
    }

    try {
      await removeFromCartMutation({ cartItemId });
      toast.success("تمت إزالة المنتج من السلة");
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      toast.error("فشل في إزالة المنتج من السلة");
    }
  };

  // Remove a product from the cart by product ID
  const removeProductFromCart = async (productId: Id<"products">) => {
    if (!isSignedIn) {
      return;
    }

    try {
      await removeProductFromCartMutation({ productId });
      toast.success("تمت إزالة المنتج من السلة");
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      toast.error("فشل في إزالة المنتج من السلة");
    }
  };

  // Update cart item quantity
  const updateCartItemQuantity = async (
    cartItemId: Id<"cart">,
    quantity: number
  ) => {
    if (!isSignedIn) {
      return;
    }

    try {
      await updateCartItemQuantityMutation({ cartItemId, quantity });
    } catch (error) {
      console.error("Failed to update cart item quantity:", error);
      toast.error("فشل في تحديث كمية المنتج");
    }
  };

  // Clear the entire cart
  const clearCart = async () => {
    if (!isSignedIn) {
      return;
    }

    try {
      await clearCartMutation();
      toast.success("تم مسح السلة");
    } catch (error) {
      console.error("Failed to clear cart:", error);
      toast.error("فشل في مسح السلة");
    }
  };

  // For direct API calls
  const validateCouponDirectly = useMutation(api.coupons.validateCoupon);
  const incrementCouponUsage = useMutation(api.coupons.incrementCouponUsage);

  // Apply coupon
  const applyCoupon = async (code: string): Promise<boolean> => {
    if (!isSignedIn) {
      return false;
    }

    setIsApplyingCoupon(true);
    try {
      const result = await validateCouponDirectly({ code });

      if (result?.valid && result?.coupon) {
        // Just validate the coupon without incrementing usage count
        // The usage count will be incremented only when the order is completed
        setCoupon(result.coupon);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Failed to apply coupon:", error);
      return false;
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Remove coupon
  const removeCoupon = () => {
    setCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: (cartQuery || []).filter(
          (item): item is NonNullable<typeof item> => item !== null
        ),
        isLoading,
        addToCart,
        removeFromCart,
        removeProductFromCart,
        updateCartItemQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isProductInCart,
        applyCoupon,
        removeCoupon,
        coupon,
        isApplyingCoupon,
        discountAmount,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

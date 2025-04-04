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

type WishlistItem = {
  _id: Id<"wishlist">;
  productId: Id<"products">;
  addedAt: string;
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
    _creationTime: number;
    createdAt: string;
    updatedAt: string;
  };
};

type WishlistContextType = {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  isInWishlist: (productId: Id<"products">) => boolean;
  addToWishlist: (productId: Id<"products">) => Promise<void>;
  removeFromWishlist: (productId: Id<"products">) => Promise<void>;
  clearWishlist: () => Promise<void>;
  wishlistCount: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch wishlist data
  const wishlistQuery = useQuery(api.wishlist.getUserWishlist);
  const wishlistItems = React.useMemo(
    () => wishlistQuery || [],
    [wishlistQuery]
  );
  const wishlistCount = useQuery(api.wishlist.getWishlistCount) || 0;

  // Mutations
  const addToWishlistMutation = useMutation(api.wishlist.addToWishlist);
  const removeFromWishlistMutation = useMutation(
    api.wishlist.removeFromWishlist
  );
  const clearWishlistMutation = useMutation(api.wishlist.clearWishlist);

  useEffect(() => {
    if (wishlistItems !== undefined) {
      setIsLoading(false);
    }
  }, [wishlistItems]);

  // Check if a product is in the wishlist
  const isInWishlist = (productId: Id<"products">) => {
    return wishlistItems.some((item) => item?.productId === productId);
  };

  // Add a product to the wishlist
  const addToWishlist = async (productId: Id<"products">) => {
    if (!isSignedIn) {
      toast.error("يرجى تسجيل الدخول لإضافة المنتج إلى المفضلة");
      return;
    }

    try {
      await addToWishlistMutation({ productId });
      toast.success("تمت إضافة المنتج إلى المفضلة");
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      toast.error("فشل في إضافة المنتج إلى المفضلة");
    }
  };

  // Remove a product from the wishlist
  const removeFromWishlist = async (productId: Id<"products">) => {
    if (!isSignedIn) {
      return;
    }

    try {
      await removeFromWishlistMutation({ productId });
      toast.success("تمت إزالة المنتج من المفضلة");
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      toast.error("فشل في إزالة المنتج من المفضلة");
    }
  };

  // Clear the entire wishlist
  const clearWishlist = async () => {
    if (!isSignedIn) {
      return;
    }

    try {
      await clearWishlistMutation();
      toast.success("تم مسح المفضلة");
    } catch (error) {
      console.error("Failed to clear wishlist:", error);
      toast.error("فشل في مسح المفضلة");
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems: (wishlistQuery || []).filter(
          (item): item is NonNullable<typeof item> => item !== null
        ),
        isLoading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

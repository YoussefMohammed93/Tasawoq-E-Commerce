"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "convex/react";
import { StarIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Id } from "@/convex/_generated/dataModel";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Loader2, Minus, Plus, Heart, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  userImage?: string;
}

const ReviewCard = ({ review }: { review: ProductReview }) => {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={review.userImage} alt={review.userName} />
          <AvatarFallback>{review.userName.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1">{review.userName}</h3>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating
                    ? "text-amber-500 fill-amber-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-muted-foreground">{review.comment}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {new Date(review.createdAt).toLocaleDateString("ar-SA")}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default function ProductPage() {
  const params = useParams();
  const productId = params.productId as string;
  const product = useQuery(api.products.getProduct, {
    productId: productId as Id<"products">,
  });
  const category = useQuery(api.categories.getCategory, {
    categoryId: product?.categoryId as Id<"categories">,
  });

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product._id) {
    notFound();
  }

  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);
  const mainImageToShow =
    selectedImage || product.mainImageUrl || "/placeholder-product.jpg";

  const reviews: ProductReview[] = [
    {
      id: "1",
      userId: "user1",
      userName: "أحمد محمد",
      rating: 5,
      comment: "منتج رائع! الجودة ممتازة والتوصيل كان سريع. أنصح به بشدة.",
      createdAt: "2024-02-20",
      userImage: "/avatar.png",
    },
    {
      id: "2",
      userId: "user2",
      userName: "سارة أحمد",
      rating: 4,
      comment: "جودة المنتج تستحق السعر. راضٍ عن الشراء.",
      createdAt: "2024-02-19",
      userImage: "/avatar.png",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-5 mt-20">
          <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-12">
            <div className="space-y-4 w-full lg:w-[400px]">
              <AspectRatio ratio={1}>
                <div className="relative h-full border w-full rounded-lg overflow-hidden">
                  <Image
                    src={mainImageToShow}
                    alt={product.name}
                    fill
                    className="object-contain p-2 sm:p-4"
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {product.discountPercentage > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute top-2 sm:top-4 right-2 sm:right-4"
                    >
                      خصم {product.discountPercentage}%
                    </Badge>
                  )}
                </div>
              </AspectRatio>
              {product.galleryUrls && product.galleryUrls.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-w-[400px]">
                  <div className="aspect-square relative">
                    <Image
                      src={product.mainImageUrl ?? "/placeholder-product.jpg"}
                      alt={product.name}
                      fill
                      className={`object-cover p-1.5 rounded-md cursor-pointer hover:opacity-80 transition ${
                        !selectedImage
                          ? "border-2 border-primary"
                          : "border-2 border-transparent"
                      }`}
                      onClick={() => setSelectedImage(null)}
                    />
                  </div>
                  {product.galleryUrls.map((url, index) => (
                    <div key={index} className="aspect-square relative">
                      <Image
                        src={url || "/placeholder-product.jpg"}
                        alt={`${product.name} - ${index + 1}`}
                        fill
                        className={`object-cover p-1.5 rounded-md cursor-pointer hover:opacity-80 transition ${
                          selectedImage === url
                            ? "border-2 border-primary"
                            : "border-2 border-transparent"
                        }`}
                        onClick={() => setSelectedImage(url)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-6 flex-1">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {product.name}
                </h1>
                <p className="text-justify text-sm sm:text-base text-muted-foreground mt-2">
                  {product.description}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="text-xl sm:text-2xl font-bold text-primary">
                    {discountedPrice.toFixed(2)} ر.س
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-base sm:text-lg text-muted-foreground line-through">
                      {product.price.toFixed(2)} ر.س
                    </span>
                  )}
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs sm:text-sm px-4",
                    product.quantity > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  )}
                >
                  {product.quantity > 0 ? "متوفر" : "غير متوفر"}
                </Badge>
              </div>
              <Separator className="my-4 sm:my-6" />
              {product.sizes.length > 0 && (
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-sm font-medium">اختر المقاس</label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="w-full sm:w-[200px] mt-2">
                      <SelectValue placeholder="اختر المقاس" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes.map((size) => (
                        <SelectItem key={size.name} value={size.name}>
                          {size.name} -{" "}
                          {(
                            size.price *
                            (1 - product.discountPercentage / 100)
                          ).toFixed(2)}{" "}
                          ر.س
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {selectedSize && (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">
                    {(
                      (product.sizes.find((s) => s.name === selectedSize)
                        ?.price ?? product.price) *
                      (1 - product.discountPercentage / 100)
                    ).toFixed(2)}{" "}
                    ر.س
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.sizes.find((s) => s.name === selectedSize)
                        ?.price ?? product.price}{" "}
                      ر.س
                    </span>
                  )}
                </div>
              )}
              {product.colors.length > 0 && (
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-sm font-medium">اختر اللون</label>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={cn(
                          "group relative size-8 sm:size-10 rounded-full cursor-pointer transition-all",
                          "ring-offset-2 ring-offset-background",
                          selectedColor === color.name
                            ? "ring-2 ring-primary scale-105"
                            : "hover:ring-2 hover:ring-primary/50",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        )}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        <span className="sr-only">
                          {selectedColor === color.name
                            ? `اللون ${color.name} محدد`
                            : `اختر اللون ${color.name}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-sm font-medium">الكمية</label>
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <span className="w-8 sm:w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (quantity >= product.quantity) {
                        toast.warning(
                          `عذراً، المتوفر في المخزون ${product.quantity} قطعة فقط`
                        );
                        return;
                      }
                      setQuantity(quantity + 1);
                    }}
                    className="h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6">
                <Button className="w-full sm:flex-1 gap-2 py-5 sm:py-6">
                  <ShoppingCart className="h-4 w-4" />
                  إضافة للسلة
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:flex-1 gap-2 py-5 sm:py-6"
                >
                  <Heart className="h-4 w-4" />
                  إضافة للمفضلة
                </Button>
              </div>

              {/* Product Details */}
              <div className="space-y-3 sm:space-y-4 mt-6">
                <h2 className="text-lg sm:text-xl font-semibold">
                  تفاصيل المنتج
                </h2>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {category && (
                      <Badge variant="outline" className="text-xs sm:text-sm">
                        {category.name}
                      </Badge>
                    )}
                    {product.badges.length > 0 &&
                      product.badges.map((badge) => (
                        <Badge
                          key={badge}
                          variant="outline"
                          className="text-xs sm:text-sm"
                        >
                          {badge}
                        </Badge>
                      ))}
                  </div>
                  <div className="relative">
                    <p
                      className={cn(
                        "text-justify text-xs sm:text-sm text-muted-foreground",
                        !isExpanded && "line-clamp-2",
                        product.quantity === 0 && "text-red-500"
                      )}
                    >
                      {product.description}
                    </p>
                    {product.description.length > 150 && (
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={cn(
                          "cursor-pointer text-xs sm:text-sm hover:underline mt-1",
                          product.quantity === 0
                            ? "text-red-500"
                            : "text-primary"
                        )}
                      >
                        {isExpanded ? "عرض أقل" : "عرض المزيد"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t pt-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold">التقييمات والمراجعات</h2>
                <p className="text-muted-foreground mt-1">
                  {reviews.length} تقييمات من عملائنا
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <StarIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      متوسط التقييم
                    </p>
                    <p className="text-2xl font-bold">
                      {(
                        reviews.reduce(
                          (acc, review) => acc + review.rating,
                          0
                        ) / reviews.length
                      ).toFixed(1)}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      عدد التقييمات
                    </p>
                    <p className="text-2xl font-bold">{reviews.length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <ThumbsUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">نسبة الرضا</p>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        (reviews.filter((r) => r.rating >= 4).length /
                          reviews.length) *
                          100
                      )}
                      %
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>أضف تقييمك</CardTitle>
                <CardDescription>شاركنا رأيك في المنتج</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    التقييم
                  </label>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, index) => {
                      const starValue = index + 1;
                      return (
                        <button
                          key={index}
                          type="button"
                          className="hover:scale-110 transition"
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHoveredRating(starValue)}
                          onMouseLeave={() => setHoveredRating(0)}
                        >
                          <StarIcon
                            className={`h-6 w-6 transition-colors ${
                              (
                                hoveredRating
                                  ? hoveredRating >= starValue
                                  : rating >= starValue
                              )
                                ? "text-amber-500 fill-amber-500"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      );
                    })}
                    {rating > 0 && (
                      <span className="text-sm text-muted-foreground mr-2 mt-1">
                        ({rating} من 5)
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    التعليق
                  </label>
                  <Textarea
                    placeholder="اكتب تعليقك هنا..."
                    className="min-h-[100px]"
                  />
                </div>
                <Button className="w-full sm:w-auto">إرسال التقييم</Button>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { Footer } from "@/components/ui/footer";
import { HeroSection } from "./_components/hero";
import { BannerSection } from "./_components/banner";
import { ProductsSection } from "./_components/products";
import { FeaturesSection } from "./_components/features";
import { PartnersSection } from "./_components/partners";
import { CategoriesSection } from "./_components/categories";
import { ReviewsSection } from "./_components/reviews";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturesSection />
      <ProductsSection />
      <PartnersSection />
      <BannerSection />
      <ReviewsSection />
      <Footer />
    </>
  );
}



import { Footer } from "@/components/ui/footer";
import { HeroSection } from "./_components/hero";
import { BannerSection } from "./_components/banner";
import { ProductsSection } from "./_components/products";
import { FeaturesSection } from "./_components/features";
import { PartnersSection } from "./_components/partners";
import { CategoriesSection } from "./_components/categories";
import { ReviewsSection } from "./_components/reviews";
import { NewArrivalsSection } from "./_components/new-arrivals";
import { SalesSection } from "./_components/sales";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <SalesSection />
      <NewArrivalsSection />
      <ProductsSection />
      <BannerSection />
      <ReviewsSection />
      <PartnersSection />
      <FeaturesSection />
      <Footer />
    </>
  );
}

import { Footer } from "@/components/ui/footer";
import { HeroSection } from "./_components/hero";
import { SalesSection } from "./_components/sales";
import { BannerSection } from "./_components/banner";
import { ReviewsSection } from "./_components/reviews";
import { ProductsSection } from "./_components/products";
import { FeaturesSection } from "./_components/features";
import { PartnersSection } from "./_components/partners";
import { CategoriesSection } from "./_components/categories";
import { NewsletterSection } from "./_components/newsletter";
import { NewArrivalsSection } from "./_components/new-arrivals";

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
      <NewsletterSection />
      <FeaturesSection />
      <Footer />
    </>
  );
}

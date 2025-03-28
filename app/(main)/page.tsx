import { Footer } from "@/components/ui/footer";
import { HeroSection } from "./_components/hero";
import { BannerSection } from "./_components/banner";
import { ProductsSection } from "./_components/products";
import { FeaturesSection } from "./_components/features";
import { PartnersSection } from "./_components/partners";

export default function Main() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
      <PartnersSection />
      <BannerSection />
      <Footer />
    </main>
  );
}

import { BannerSection } from "./_components/banner";
import { HeroSection } from "./_components/hero";
import { ProductsSection } from "./_components/products";
import { FeaturesSection } from "./_components/features";

export default function Main() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
      <BannerSection />
    </main>
  );
}


import { BannerSection } from "./_components/banner";
import { HeroSection } from "./_components/hero";
import { ProductsSection } from "./_components/products";

export default function Main() {
  return (
    <main>
      <HeroSection />
      <ProductsSection />
      <BannerSection />
    </main>
  );
}

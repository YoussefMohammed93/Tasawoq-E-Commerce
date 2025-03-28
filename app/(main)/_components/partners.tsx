/* eslint-disable @next/next/no-img-element */
import { SectionHeading } from "@/components/ui/section-heading";

const partners = [
  {
    name: "شركة سامسونج",
    image: "https://picsum.photos/120/60?random=1",
  },
  {
    name: "شركة آبل",
    image: "https://picsum.photos/120/60?random=2",
  },
  {
    name: "شركة سوني",
    image: "https://picsum.photos/120/60?random=3",
  },
  {
    name: "شركة إل جي",
    image: "https://picsum.photos/120/60?random=4",
  },
  {
    name: "شركة هواوي",
    image: "https://picsum.photos/120/60?random=5",
  },
  {
    name: "شركة شاومي",
    image: "https://picsum.photos/120/60?random=6",
  },
];

export const PartnersSection = () => {
  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-12">
          <SectionHeading
            title="شركاؤنا المعتمدون"
            description="نفخر بشراكتنا مع أكبر العلامات التجارية العالمية"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center group"
            >
              <div className="relative w-full aspect-[1/1] mb-4">
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm sm:text-lg text-muted-foreground group-hover:text-primary transition-colors duration-300">
                {partner.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

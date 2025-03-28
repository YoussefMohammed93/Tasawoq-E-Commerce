import { SectionHeading } from "@/components/ui/section-heading";
import { ShieldCheck, Truck, CreditCard, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "ضمان الجودة",
    description: "نضمن جودة جميع منتجاتنا مع إمكانية الاسترجاع",
  },
  {
    icon: Truck,
    title: "شحن سريع",
    description: "توصيل سريع لجميع المدن الرئيسية",
  },
  {
    icon: CreditCard,
    title: "دفع آمن",
    description: "طرق دفع متعددة وآمنة لراحتك",
  },
  {
    icon: HeadphonesIcon,
    title: "دعم متواصل",
    description: "فريق دعم متاح على مدار الساعة",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-12">
          <SectionHeading
            title="مميزات المتجر"
            description="نقدم لكم أفضل الخدمات لتجربة تسوق مميزة"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-lg border bg-card overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0" />
              <div className="relative z-10 flex flex-col items-center text-center transition-colors duration-300">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-white/10">
                  <feature.icon className="h-6 w-6 text-primary transition-colors duration-300 group-hover:text-white" />
                </div>
                <h3 className="font-semibold mb-2 transition-colors duration-300 group-hover:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-white/80">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

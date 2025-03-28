import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const footerLinks = [
  {
    title: "تسوق",
    links: [
      { label: "المنتجات", href: "/products" },
      { label: "العروض", href: "/offers" },
      { label: "الفئات", href: "/categories" },
      { label: "المفضلة", href: "/wishlist" },
    ],
  },
  {
    title: "الشركة",
    links: [
      { label: "من نحن", href: "/about" },
      { label: "اتصل بنا", href: "/contact" },
      { label: "الوظائف", href: "/careers" },
      { label: "الشروط والأحكام", href: "/terms" },
    ],
  },
  {
    title: "خدمة العملاء",
    links: [
      { label: "الشحن والتوصيل", href: "/shipping" },
      { label: "سياسة الإرجاع", href: "/returns" },
      { label: "الأسئلة الشائعة", href: "/faq" },
      { label: "الدعم الفني", href: "/support" },
    ],
  },
];

const socialLinks = [
  {
    icon: Facebook,
    href: "https://facebook.com",
    label: "فيسبوك",
  },
  {
    icon: Instagram,
    href: "https://instagram.com",
    label: "انستغرام",
  },
  {
    icon: Twitter,
    href: "https://twitter.com",
    label: "تويتر",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com",
    label: "لينكد ان",
  },
];

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-5 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 relative">
              <span className="text-2xl font-bold text-primary">تسوق</span>
            </Link>
            <p className="mt-4 text-muted-foreground text-sm md:max-w-xs">
              نقدم لكم أفضل المنتجات بأعلى جودة وأفضل الأسعار. تسوق معنا واستمتع
              بتجربة تسوق فريدة مع خدمة عملاء متميزة وشحن سريع لجميع أنحاء
              المملكة.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>جميع الحقوق محفوظة © {new Date().getFullYear()} تسوق</p>
        </div>
      </div>
    </footer>
  );
}

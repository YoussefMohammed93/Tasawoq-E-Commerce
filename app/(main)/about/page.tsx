"use client";

import Image from "next/image";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  Building2,
  Users,
  Target,
  Phone,
  Mail,
  MapPin,
  Loader2,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Define interfaces for type safety
interface TeamMember {
  name: string;
  position: string;
  bio: string;
  image?: Id<"_storage">;
  imageUrl?: string;
  order: number;
}

export default function AboutPage() {
  // Fetch about page data from Convex
  const aboutPageData = useQuery(api.about.getAboutPage) || null;

  // If page is not visible, show a message
  if (aboutPageData && aboutPageData.isVisible === false) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              هذه الصفحة غير متاحة حالياً
            </h1>
            <p className="text-muted-foreground">يرجى العودة لاحقاً</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Loading state
  if (aboutPageData === undefined) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-3 -space-x-52 opacity-10 dark:opacity-5">
            <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-800 dark:from-blue-700" />
            <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-600 to-sky-500 dark:to-indigo-600" />
            <div className="blur-[106px] h-32 bg-gradient-to-br from-primary to-purple-800 dark:from-blue-700" />
          </div>
          <div className="max-w-7xl mx-auto px-5 relative">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {aboutPageData?.title || "من نحن"}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                {aboutPageData?.description ||
                  "نحن شركة رائدة في مجال التجارة الإلكترونية، نسعى لتقديم أفضل المنتجات بأعلى جودة وأسعار منافسة، مع التركيز على تجربة عملاء استثنائية."}
              </p>
            </div>
          </div>
        </section>

        {/* Company Overview */}
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-8">
                  <SectionHeading
                    title="قصتنا"
                    description="رحلة نجاح بدأت منذ سنوات"
                  />
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p className="whitespace-pre-line">
                    {aboutPageData?.companyHistory ||
                      "تأسست شركتنا في عام 2015 بهدف تقديم تجربة تسوق فريدة للعملاء في المملكة العربية السعودية والشرق الأوسط. بدأنا كمتجر صغير ونمونا بسرعة لنصبح واحدة من أكبر منصات التجارة الإلكترونية في المنطقة."}
                  </p>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
                <Image
                  src={
                    aboutPageData?.companyHistoryImageUrl ||
                    aboutPageData?.mainImageUrl ||
                    "/hero.png"
                  }
                  alt="قصة الشركة"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission and Values */}
        <section className="py-12 bg-muted/50">
          <div className="max-w-7xl mx-auto px-5">
            <div className="text-center mb-12">
              <SectionHeading
                title="مهمتنا وقيمنا"
                description="نسعى دائماً لتحقيق التميز في كل ما نقدمه"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">رؤيتنا</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {aboutPageData?.vision ||
                      "أن نكون الوجهة الأولى للتسوق الإلكتروني في الشرق الأوسط، ونقدم تجربة تسوق لا مثيل لها من حيث الجودة والخدمة."}
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">مهمتنا</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {aboutPageData?.mission ||
                      "تمكين العملاء من الوصول إلى منتجات عالية الجودة بأسعار منافسة، مع توفير تجربة تسوق سلسة وممتعة."}
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">قيمنا</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {aboutPageData?.values ||
                      "الجودة، الشفافية، الابتكار، التركيز على العميل، والمسؤولية الاجتماعية هي القيم الأساسية التي توجه عملنا."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section (Placeholder) */}
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-5">
            <div className="text-center mb-12">
              <SectionHeading
                title={aboutPageData?.teamTitle || "فريق القيادة"}
                description={
                  aboutPageData?.teamDescription ||
                  "خبراء متخصصون يقودون مسيرة نجاحنا"
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {aboutPageData?.teamMembers &&
              aboutPageData.teamMembers.length > 0
                ? aboutPageData.teamMembers
                    .sort((a, b) => a.order - b.order)
                    .map((member) => (
                      <div key={member.name} className="text-center">
                        <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden">
                          <Image
                            src={
                              (member as TeamMember).imageUrl || "/avatar.png"
                            }
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">
                          {member.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {member.position}
                        </p>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {member.bio}
                        </p>
                      </div>
                    ))
                : // Fallback if no team members are defined
                  [1, 2, 3, 4].map((item) => (
                    <div key={item} className="text-center">
                      <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden">
                        <Image
                          src="/avatar.png"
                          alt={`عضو الفريق ${item}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">اسم الشخص</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        المنصب الوظيفي
                      </p>
                      <p className="text-sm text-muted-foreground">
                        نبذة قصيرة عن خبرات ومؤهلات الشخص وإنجازاته في مجال
                        عمله.
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-12 bg-muted/50">
          <div className="max-w-7xl mx-auto px-5">
            <div className="text-center mb-12">
              <SectionHeading
                title="تواصل معنا"
                description="نحن هنا للإجابة على استفساراتك"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Phone className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">اتصل بنا</h3>
                  <p className="text-muted-foreground">
                    {aboutPageData?.contactPhone || "+966 12 345 6789"}
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">
                    البريد الإلكتروني
                  </h3>
                  <p className="text-muted-foreground">
                    {aboutPageData?.contactEmail || "info@example.com"}
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">العنوان</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {aboutPageData?.contactAddress ||
                      "الرياض، المملكة العربية السعودية\nشارع الملك فهد، برج المملكة، الطابق 20"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

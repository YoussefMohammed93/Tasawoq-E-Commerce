"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  ShieldCheck,
  CreditCard,
  Truck,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import TermsLoading from "./loading";

export default function TermsPage() {
  const termsData = useQuery(api.terms.get);

  const defaultData = {
    title: "الشروط والأحكام",
    description:
      "يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام موقعنا أو إجراء أي عملية شراء",
    introduction:
      "مرحباً بكم في متجرنا الإلكتروني. تحدد هذه الوثيقة الشروط والأحكام التي تحكم استخدامكم لموقعنا وخدماتنا. باستخدامكم لموقعنا أو إجراء أي عملية شراء، فإنكم توافقون على الالتزام بهذه الشروط والأحكام.\n\nنحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت، وسيتم نشر التحديثات على هذه الصفحة. من مسؤوليتكم مراجعة هذه الشروط بشكل دوري.",
    accountTerms:
      "يجب أن يكون عمر المستخدم 18 عام أو أكثر لإنشاء حساب.\n\nأنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور.\n\nيحق لنا إنهاء أو تعليق حسابك في حالة انتهاك هذه الشروط والأحكام.",
    paymentTerms:
      "نقبل الدفع عبر البطاقات الائتمانية (فيزا، ماستركارد) وخدمات الدفع الإلكتروني المعتمدة.\n\nجميع الأسعار بالريال السعودي وتشمل ضريبة القيمة المضافة.\n\nيتم تأكيد الطلب فقط بعد نجاح عملية الدفع.",
    shippingPolicy:
      "نوفر خدمة التوصيل لجميع مناطق المملكة العربية السعودية.\n\nمدة التوصيل المتوقعة من 3-7 أيام عمل داخل المدن الرئيسية.\n\nيمكن تتبع شحنتك من خلال رقم التتبع الذي سيتم إرساله إلى بريدك الإلكتروني.",
    returnPolicy:
      "يمكن إرجاع المنتجات خلال 14 يوم من تاريخ الاستلام.\n\nيجب أن تكون المنتجات في حالتها الأصلية مع جميع الملصقات والتغليف.\n\nسيتم رد المبلغ خلال 7-14 يوم عمل من استلام المنتج المرتجع.",
    contactInfo: {
      email: "support@storename.sa",
      phone: "+966 920 000 123",
      address:
        "طريق الملك فهد، حي العليا، الرياض 12343، المملكة العربية السعودية",
    },
  };

  const data = {
    ...defaultData,
    ...termsData,
    title: termsData?.title || defaultData.title,
    description: termsData?.description || defaultData.description,
    introduction: termsData?.introduction || defaultData.introduction,
    accountTerms: termsData?.accountTerms || defaultData.accountTerms,
    paymentTerms: termsData?.paymentTerms || defaultData.paymentTerms,
    shippingPolicy: termsData?.shippingPolicy || defaultData.shippingPolicy,
    returnPolicy: termsData?.returnPolicy || defaultData.returnPolicy,
    contactInfo: {
      email: termsData?.contactInfo?.email || defaultData.contactInfo.email,
      phone: termsData?.contactInfo?.phone || defaultData.contactInfo.phone,
      address:
        termsData?.contactInfo?.address || defaultData.contactInfo.address,
    },
    introductionVisible: termsData?.introductionVisible ?? true,
    accountTermsVisible: termsData?.accountTermsVisible ?? true,
    paymentTermsVisible: termsData?.paymentTermsVisible ?? true,
    shippingPolicyVisible: termsData?.shippingPolicyVisible ?? true,
    returnPolicyVisible: termsData?.returnPolicyVisible ?? true,
    contactInfoVisible: termsData?.contactInfoVisible ?? true,
    isVisible: termsData?.isVisible ?? true,
    lastUpdated: termsData?.lastUpdated || "2024-02-20T12:00:00.000Z",
  };

  // Format paragraphs by splitting on newlines
  const formatContent = (content: string) => {
    return content
      .split("\n\n")
      .map((paragraph, index) => <p key={index}>{paragraph}</p>);
  };

  // Format the last updated date
  const lastUpdatedDate = data.lastUpdated
    ? new Date(data.lastUpdated).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  if (!data.isVisible) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="bg-muted mx-auto w-16 h-16 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold">هذه الصفحة غير متاحة حالياً</h1>
            <p className="text-muted-foreground">يرجى العودة لاحقاً.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Show loading skeleton while data is being fetched
  if (termsData === undefined) {
    return <TermsLoading />;
  }

  return (
    <>
      <Header />
      <main className="pt-16 pb-8">
        {/* Hero Section */}
        <section className="bg-muted py-12 mb-12">
          <div className="max-w-7xl mx-auto px-5">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-6">{data.title}</h1>
              <p className="text-muted-foreground text-lg">
                {data.description}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-5">
          {/* Last Updated */}
          <div className="mb-12 text-center">
            <p className="text-sm text-muted-foreground">
              آخر تحديث: {lastUpdatedDate}
            </p>
          </div>

          {/* Introduction */}
          {data.introductionVisible && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">مقدمة</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  {formatContent(data.introduction)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Terms */}
          {data.accountTermsVisible && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">شروط الحساب</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  {formatContent(data.accountTerms)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Terms */}
          {data.paymentTermsVisible && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">شروط الدفع</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  {formatContent(data.paymentTerms)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shipping Policy */}
          {data.shippingPolicyVisible && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">سياسة الشحن</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  {formatContent(data.shippingPolicy)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Return Policy */}
          {data.returnPolicyVisible && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <RefreshCw className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">سياسة الإرجاع</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  {formatContent(data.returnPolicy)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          {data.contactInfoVisible && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <HelpCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">معلومات الاتصال</h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    إذا كان لديك أي أسئلة أو استفسارات حول هذه الشروط والأحكام،
                    يرجى التواصل معنا من خلال:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>البريد الإلكتروني: {data.contactInfo.email}</li>
                    <li>رقم الهاتف: {data.contactInfo.phone}</li>
                    <li>العنوان: {data.contactInfo.address}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

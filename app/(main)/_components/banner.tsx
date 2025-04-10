"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { SendIcon, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContactItem {
  title: string;
  description: string;
  image: Id<"_storage">;
  order: number;
}

interface ContactBannerData {
  title: string;
  description: string;
  isVisible: boolean;
  contactItems: ContactItem[];
}

// Loading skeleton for the banner section
const BannerSectionSkeleton = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-3 -space-x-52 opacity-10 dark:opacity-5">
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-800 dark:from-blue-700" />
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-600 to-sky-500 dark:to-indigo-600" />
        <div className="blur-[106px] h-32 bg-gradient-to-br from-primary to-purple-800 dark:from-blue-700" />
      </div>
      <div className="max-w-7xl mx-auto px-5 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="h-10 w-3/4 bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-5/6 bg-muted animate-pulse rounded-md" />
            </div>
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-background/80 backdrop-blur-sm"
                >
                  <div className="shrink-0 p-3 rounded-full bg-muted animate-pulse">
                    <div className="h-6 w-6" />
                  </div>
                  <div className="w-full">
                    <div className="h-5 w-1/3 bg-muted animate-pulse rounded-md mb-2" />
                    <div className="h-4 w-2/3 bg-muted animate-pulse rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Card className="p-6 backdrop-blur-sm bg-background/80">
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="h-5 w-1/4 bg-muted animate-pulse rounded-md mb-2" />
                  <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="h-5 w-1/4 bg-muted animate-pulse rounded-md mb-2" />
                    <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-5 w-1/4 bg-muted animate-pulse rounded-md mb-2" />
                    <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="h-5 w-1/4 bg-muted animate-pulse rounded-md mb-2" />
                  <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
                </div>
                <div className="space-y-1">
                  <div className="h-5 w-1/4 bg-muted animate-pulse rounded-md mb-2" />
                  <div className="h-24 w-full bg-muted animate-pulse rounded-md" />
                </div>
                <div className="h-10 w-full bg-muted animate-pulse rounded-md mt-4" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export const BannerSection = () => {
  // Default values if no data is available
  const defaultTitle = "تواصل معنا";
  const defaultDescription =
    "نحن هنا لمساعدتك! راسلنا للحصول على المزيد من المعلومات حول منتجاتنا وخدماتنا.";

  // State for form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    message: false,
    subject: false,
  });

  // Fetch data - all hooks must be called before any conditional returns
  const contactBannerData = useQuery(
    api.contact.getContactBanner
  ) as ContactBannerData | null;
  const submitContactForm = useMutation(api.contact.submitContactForm);

  // Prepare contact items data
  const sortedContactItems = contactBannerData?.contactItems
    ? [...contactBannerData.contactItems].sort((a, b) => a.order - b.order)
    : [];

  // Get image URLs for contact items
  const contactItemImageUrls = useQuery(api.files.getMultipleImageUrls, {
    storageIds:
      sortedContactItems.length > 0
        ? sortedContactItems.map((item) => item.image)
        : [],
  });

  // Form handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }));
    setFormErrors((prev) => ({ ...prev, subject: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const errors = {
      name: formData.name.trim() === "",
      email: formData.email.trim() === "" || !formData.email.includes("@"),
      message: formData.message.trim() === "",
      subject: !formData.subject,
    };

    setFormErrors(errors);

    if (!Object.values(errors).some((error) => error)) {
      setIsSubmitting(true);

      try {
        // Submit to backend
        await submitContactForm(formData);

        toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("لم نتمكن من إرسال رسالتك. يرجى المحاولة مرة أخرى.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Loading states
  if (contactBannerData === undefined) {
    return <BannerSectionSkeleton />;
  }

  if (sortedContactItems.length > 0 && contactItemImageUrls === undefined) {
    return <BannerSectionSkeleton />;
  }

  // If the section is set to not visible, don't render it
  if (contactBannerData && !contactBannerData.isVisible) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-3 -space-x-52 opacity-10 dark:opacity-5">
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-800 dark:from-blue-700" />
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-600 to-sky-500 dark:to-indigo-600" />
        <div className="blur-[106px] h-32 bg-gradient-to-br from-primary to-purple-800 dark:from-blue-700" />
      </div>
      <div className="max-w-7xl mx-auto px-5 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">
                {contactBannerData?.title || defaultTitle}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {contactBannerData?.description || defaultDescription}
              </p>
            </div>
            <div className="grid gap-6">
              {sortedContactItems.length > 0 ? (
                sortedContactItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-background/80 backdrop-blur-sm transition-colors hover:bg-card"
                  >
                    <div className="shrink-0 p-3 rounded-full bg-primary/10 flex items-center justify-center">
                      <Image
                        src={
                          contactItemImageUrls &&
                          contactItemImageUrls[index] &&
                          typeof contactItemImageUrls[index] === "string" &&
                          contactItemImageUrls[index].startsWith("http")
                            ? contactItemImageUrls[index]
                            : "/placeholder-image.png"
                        }
                        alt={item.title}
                        width={24}
                        height={24}
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback if no contact items are defined
                <div className="text-muted-foreground">
                  لا توجد معلومات اتصال متاحة حاليًا
                </div>
              )}
            </div>
          </div>
          <div>
            <Card className="p-6 backdrop-blur-sm bg-background/80">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-sm font-medium">
                    الاسم الكامل <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="أدخل اسمك الكامل"
                    value={formData.name}
                    onChange={handleChange}
                    className={formErrors.name ? "border-destructive" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-destructive text-xs">يرجى إدخال الاسم</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium">
                      البريد الإلكتروني{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      value={formData.email}
                      onChange={handleChange}
                      className={formErrors.email ? "border-destructive" : ""}
                    />
                    {formErrors.email && (
                      <p className="text-destructive text-xs">
                        يرجى إدخال بريد إلكتروني صحيح
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-sm font-medium">
                      رقم الهاتف
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="أدخل رقم هاتفك"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="subject" className="text-sm font-medium">
                    الموضوع <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={formData.subject}
                    onValueChange={handleSubjectChange}
                    required
                  >
                    <SelectTrigger
                      className={formErrors.subject ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="اختر موضوع الرسالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">استفسار عام</SelectItem>
                      <SelectItem value="support">الدعم الفني</SelectItem>
                      <SelectItem value="sales">المبيعات</SelectItem>
                      <SelectItem value="feedback">
                        اقتراحات وملاحظات
                      </SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.subject && (
                    <p className="text-destructive text-xs">
                      يرجى اختيار موضوع الرسالة
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="message" className="text-sm font-medium">
                    الرسالة <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="اكتب رسالتك هنا..."
                    value={formData.message}
                    onChange={handleChange}
                    className={`min-h-[100px] resize-none ${formErrors.message ? "border-destructive" : ""}`}
                  />
                  {formErrors.message && (
                    <p className="text-destructive text-xs">
                      يرجى إدخال رسالتك
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      إرسال الرسالة
                      <SendIcon className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

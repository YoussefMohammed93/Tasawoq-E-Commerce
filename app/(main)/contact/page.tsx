"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Send, Clock, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeafletMap } from "@/components/ui/leaflet-map";
import ContactLoading from "./loading";
import { cn } from "@/lib/utils";

interface ContactPageData {
  title: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  mapLocation: {
    lat: number;
    lng: number;
  };
  workingHours: string;
  formTitle: string;
  formDescription: string;
  mapTitle: string;
  mapDescription: string;
}

export default function ContactPage() {
  const contactPageData = useQuery(
    api.contact.getContactPage
  ) as ContactPageData | null;
  const submitContactForm = useMutation(api.contact.submitContactForm);

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

  // The backend now handles empty values, so we define defaults only in the frontend
  const defaultPageData = {
    title: "تواصل معنا",
    description:
      "نحن هنا لمساعدتك والإجابة على جميع استفساراتك. يمكنك التواصل معنا من خلال النموذج أدناه أو باستخدام معلومات الاتصال المتوفرة.",
    phone: "+966 12 345 6789",
    email: "info@example.com",
    address: "شارع الملك فهد، حي العليا، الرياض، المملكة العربية السعودية",
    mapLocation: {
      lat: 24.7136,
      lng: 46.6753,
    },
    workingHours: "الأحد - الخميس: 9:00 صباحًا - 5:00",
    formTitle: "أرسل لنا رسالة",
    formDescription: "املأ النموذج أدناه وسنقوم بالرد عليك في أقرب وقت ممكن",
    mapTitle: "موقعنا",
    mapDescription: "يمكنك زيارتنا في موقعنا خلال ساعات العمل",
  };

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

  if (contactPageData === undefined) {
    return <ContactLoading />;
  }

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-muted py-12 mb-12">
          <div className="max-w-7xl mx-auto px-5">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold mb-6">
                {contactPageData?.title || defaultPageData.title}
              </h1>
              <p className="text-muted-foreground text-lg">
                {contactPageData?.description || defaultPageData.description}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 pt-0">
          <div className="max-w-7xl mx-auto px-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Phone className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">اتصل بنا</h3>
                  <p className="text-muted-foreground">
                    {contactPageData?.phone || defaultPageData.phone}
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
                    {contactPageData?.email || defaultPageData.email}
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">العنوان</h3>
                  <p className="text-muted-foreground">
                    {contactPageData?.address || defaultPageData.address}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form and Map Section */}
        <section className="py-12 bg-muted">
          <div className="max-w-7xl mx-auto px-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <div className="mb-8">
                  <SectionHeading
                    title={
                      contactPageData?.formTitle || defaultPageData.formTitle
                    }
                    description={
                      contactPageData?.formDescription ||
                      defaultPageData.formDescription
                    }
                  />
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          الاسم الكامل{" "}
                          <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="أدخل اسمك الكامل"
                          value={formData.name}
                          onChange={handleChange}
                          className={
                            formErrors.name ? "border-destructive" : ""
                          }
                        />
                        {formErrors.name && (
                          <p className="text-destructive text-xs">
                            يرجى إدخال الاسم
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="text-sm font-medium"
                          >
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
                            className={
                              formErrors.email ? "border-destructive" : ""
                            }
                          />
                          {formErrors.email && (
                            <p className="text-destructive text-xs">
                              يرجى إدخال بريد إلكتروني صحيح
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="phone"
                            className="text-sm font-medium"
                          >
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
                      <div className="space-y-2">
                        <label
                          htmlFor="subject"
                          className="text-sm font-medium"
                        >
                          الموضوع <span className="text-destructive">*</span>
                        </label>
                        <Select
                          value={formData.subject}
                          onValueChange={handleSubjectChange}
                          required
                        >
                          <SelectTrigger
                            className={
                              formErrors.subject ? "border-destructive" : ""
                            }
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
                      <div className="space-y-2">
                        <label
                          htmlFor="message"
                          className="text-sm font-medium"
                        >
                          الرسالة <span className="text-destructive">*</span>
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="اكتب رسالتك هنا..."
                          value={formData.message}
                          onChange={handleChange}
                          className={cn("resize-none", "h-[108px]", "w-full", [
                            formErrors.message ? "border-destructive" : "",
                          ])}
                        />
                        {formErrors.message && (
                          <p className="text-destructive text-xs">
                            يرجى إدخال رسالتك
                          </p>
                        )}
                      </div>
                      <Button
                        type="submit"
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
                            <Send className="h-4 w-4" />
                            إرسال الرسالة
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Map Section */}
              <div>
                <div className="mb-8">
                  <SectionHeading
                    title={
                      contactPageData?.mapTitle || defaultPageData.mapTitle
                    }
                    description={
                      contactPageData?.mapDescription ||
                      defaultPageData.mapDescription
                    }
                  />
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <div className="aspect-video relative rounded-md overflow-hidden mb-6 z-[49]">
                      <LeafletMap
                        center={{
                          lat:
                            contactPageData?.mapLocation?.lat ||
                            defaultPageData.mapLocation.lat,
                          lng:
                            contactPageData?.mapLocation?.lng ||
                            defaultPageData.mapLocation.lng,
                        }}
                        markerPosition={{
                          lat:
                            contactPageData?.mapLocation?.lat ||
                            defaultPageData.mapLocation.lat,
                          lng:
                            contactPageData?.mapLocation?.lng ||
                            defaultPageData.mapLocation.lng,
                        }}
                        zoom={15}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium">العنوان</h4>
                          <p className="text-muted-foreground">
                            {contactPageData?.address ||
                              defaultPageData.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium">ساعات العمل</h4>
                          <p className="text-muted-foreground whitespace-pre-line">
                            {contactPageData?.workingHours ||
                              defaultPageData.workingHours}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

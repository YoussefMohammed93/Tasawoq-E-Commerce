"use client";

import {
  SendIcon,
  Loader2,
  MailIcon,
  BellIcon,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("success");
      setEmail("");
    } catch (error) {
      console.log(error);
      setStatus("error");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const features = [
    {
      icon: BellIcon,
      text: "تنبيهات فورية عن العروض الحصرية",
    },
    {
      icon: MailIcon,
      text: "آخر المنتجات والتحديثات كل أسبوع",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-3 -space-x-52 opacity-10 dark:opacity-5">
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-800 dark:from-blue-700" />
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-600 to-sky-500 dark:to-indigo-600" />
        <div className="blur-[106px] h-32 bg-gradient-to-br from-primary to-purple-800 dark:from-blue-700" />
      </div>
      <div className="max-w-7xl mx-auto px-5 relative">
        <div className="text-center mb-12">
          <SectionHeading
            title="انضم إلى نشرتنا البريدية"
            description="كن أول من يعلم عن أحدث المنتجات والعروض الحصرية"
          />
        </div>
        <Card className="max-w-3xl mx-auto p-8 backdrop-blur-sm bg-background/80">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <feature.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pr-4 pl-12"
                    required
                  />
                  <SendIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                <Button disabled={loading} className="w-full h-10 text-base">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      جاري الاشتراك...
                    </span>
                  ) : (
                    "اشترك الآن"
                  )}
                </Button>
              </form>
              {status === "success" && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="text-sm">تم الاشتراك بنجاح! شكراً لك</p>
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
                  <XCircle className="h-5 w-5" />
                  <p className="text-sm">حدث خطأ، يرجى المحاولة مرة أخرى</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

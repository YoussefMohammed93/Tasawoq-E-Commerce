"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircleIcon, SendIcon, PhoneIcon, MailIcon } from "lucide-react";

export const BannerSection = () => {
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
                تواصل معنا
                <span className="text-primary">.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                نحن هنا لمساعدتك! راسلنا للحصول على المزيد من المعلومات حول
                منتجاتنا وخدماتنا.
              </p>
            </div>
            <div className="grid gap-6">
              <div className="flex items-center gap-4 p-4 rounded-lg border bg-background/80 backdrop-blur-sm transition-colors hover:bg-card">
                <div className="shrink-0 p-3 rounded-full bg-primary/10">
                  <MessageCircleIcon className="text-primary h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">دعم متواصل</p>
                  <p className="text-muted-foreground text-sm">
                    نستجيب لرسائلك خلال 24 ساعة
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg border bg-background/80 backdrop-blur-sm transition-colors hover:bg-card">
                <div className="shrink-0 p-3 rounded-full bg-primary/10">
                  <PhoneIcon className="text-primary h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">اتصل بنا</p>
                  <p className="text-muted-foreground text-sm">
                    +966 123 456 789
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg border bg-background/80 backdrop-blur-sm transition-colors hover:bg-card">
                <div className="shrink-0 p-3 rounded-full bg-primary/10">
                  <MailIcon className="text-primary h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">البريد الإلكتروني</p>
                  <p className="text-muted-foreground text-sm">
                    support@example.com
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Card className="p-8 backdrop-blur-sm bg-background/80">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">الاسم</label>
                  <Input placeholder="أدخل اسمك" className="h-10" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    البريد الإلكتروني
                  </label>
                  <Input
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">الرسالة</label>
                  <Textarea
                    className="min-h-[120px] resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>
                <Button size="lg" className="w-full gap-2">
                  إرسال الرسالة
                  <SendIcon className="h-4 w-4" />
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

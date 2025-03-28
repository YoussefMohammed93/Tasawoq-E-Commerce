"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircleIcon, SendIcon } from "lucide-react";

export const BannerSection = () => {
  return (
    <section className="py-12 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5" />
      <div className="max-w-7xl mx-auto px-5 relative">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">تواصل معنا</h2>
            <p className="text-muted-foreground text-lg">
              نحن هنا لمساعدتك! راسلنا للحصول على المزيد من المعلومات حول
              منتجاتنا وخدماتنا.
            </p>
            <div className="flex items-center gap-4">
              <MessageCircleIcon className="text-primary h-12 w-12" />
              <div>
                <p className="font-medium">دعم متواصل</p>
                <p className="text-muted-foreground">
                  نستجيب لرسائلك خلال 24 ساعة
                </p>
              </div>
            </div>
          </div>
          <Card className="p-6">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">الاسم</label>
                <Input placeholder="أدخل اسمك" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">البريد الإلكتروني</label>
                <Input type="email" placeholder="أدخل بريدك الإلكتروني" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">الرسالة</label>
                <Textarea
                  className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="اكتب رسالتك هنا..."
                />
              </div>
              <Button className="w-full gap-2">
                إرسال الرسالة
                <SendIcon className="h-4 w-4" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

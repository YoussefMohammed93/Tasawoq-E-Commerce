import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FolderX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderX className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">الفئة غير موجودة</h2>
          <p className="text-muted-foreground mb-6">
            عذراً، الفئة التي تبحث عنها غير موجودة أو تم حذفها
          </p>
          <Button asChild>
            <Link href="/categories">العودة إلى الفئات</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

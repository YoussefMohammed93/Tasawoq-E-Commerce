import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

export default function TermsLoading() {
  return (
    <>
      <Header />
      <main className="pt-16 pb-8">
        {/* Hero Section */}
        <section className="bg-muted py-12 mb-12">
          <div className="max-w-7xl mx-auto px-5">
            <div className="text-center max-w-3xl mx-auto">
              <Skeleton className="h-10 w-96 mx-auto mb-6" />
              <Skeleton className="h-6 w-[500px] mx-auto" />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-5">
          {/* Last Updated */}
          <div className="mb-12 text-center">
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>

          {/* Content Cards */}
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Skeleton className="h-6 w-6" />
                  </div>
                  <Skeleton className="h-8 w-48" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[95%]" />
                  {index === 5 && (
                    <div className="mt-6 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-4 w-72" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

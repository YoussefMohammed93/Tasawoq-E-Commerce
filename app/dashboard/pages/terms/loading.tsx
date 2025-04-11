"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";

export default function TermsLoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header section with title and save button */}
      <div className="pt-14 mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-5">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-full sm:w-96" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-24 sm:w-32" />
            </div>
            <Skeleton className="h-10 w-32 sm:w-40" />
          </div>
        </div>
      </div>

      {/* Tabs and form content */}
      <Tabs defaultValue="general" className="w-full" dir="rtl">
        <TabsList className="mb-4 flex-wrap gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full sm:w-32" />
          ))}
        </TabsList>

        {/* General Tab Content */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-5 sm:items-center justify-between">
                <div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-24 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-36 w-full" />
                <Skeleton className="h-3 w-64" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs would have similar structure */}
        {Array.from({ length: 5 }).map((_, i) => (
          <TabsContent key={i} value={`tab-${i}`} className="hidden">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-5 sm:items-center justify-between">
                  <div>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-60 w-full" />
                  <Skeleton className="h-3 w-64" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        {/* Contact Info Tab - Special structure */}
        <TabsContent value="contact" className="hidden">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-5 sm:items-center justify-between">
                <div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

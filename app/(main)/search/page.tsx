import { Suspense } from "react";
import SearchContent, { SearchSkeleton } from "./search-content";

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-4 sm:py-8">
        <Suspense fallback={<SearchSkeleton />}>
          <SearchContent />
        </Suspense>
      </main>
    </div>
  );
}

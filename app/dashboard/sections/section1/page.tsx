import { Heading } from "@/components/ui/heading";

export default function Section1Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-14 mb-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-5">
          <Heading title="القسم الأول" description="هذا هو القسم الأول." />
        </div>
      </div>
    </div>
  );
}

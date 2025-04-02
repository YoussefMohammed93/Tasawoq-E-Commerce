"use client";

import { Heading } from "@/components/ui/heading";

interface DashboardHeaderProps {
  heading: string;
  description?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  description,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <Heading title={heading} description={description || ""} />
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

import { CTAButton } from "@/components/ui/cta-button";
import { VSpace } from "@/components/ui/vspace";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default function SubmitLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <main className="container mx-auto min-h-screen flex flex-col items-center justify-center max-h-screen">
          {children}
          <VSpace className="w-full flex flex-col items-center justify-start" size={60} />
        </main>
      </body>
    </html>
  )
}
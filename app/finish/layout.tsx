import { VSpace } from "@/components/ui/vspace";
import React from "react";

export default function SubmitLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <main className="container mx-auto min-h-screen flex flex-col items-center justify-center max-h-screen">
        {children}
    </main>
  )
}
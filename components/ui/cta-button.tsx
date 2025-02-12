import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./button";
import React from "react";

export interface CTAButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const CTAButton = React.forwardRef<HTMLButtonElement, CTAButtonProps>(({ children, className, ...props }, ref) => {
  return (
    <Button variant="default" size="lg" className={cn("w-full mx-auto bg-[#0B1A3E] hover:bg-[#0B1A3E]/90 text-white h-12 rounded-[14px]", className)} {...props} ref={ref}>
      {children}
    </Button>
  )
})
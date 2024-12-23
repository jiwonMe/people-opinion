import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./button";

export interface CTAButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export function CTAButton({ children, ...props }: CTAButtonProps) {
  return (
    <Button variant="default" size="lg" className={cn("w-full bg-[#0B1A3E] hover:bg-[#0B1A3E]/90 text-white h-12 rounded-[14px]", props.className)} {...props}>
      {children}
    </Button>
  )
}
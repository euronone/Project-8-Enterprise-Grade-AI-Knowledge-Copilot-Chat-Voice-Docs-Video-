import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[12px] text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A] disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-[#6366F1] text-white hover:bg-[#4F46E5] hover:shadow-lg hover:-translate-y-0.5 active:bg-[#4338CA] active:shadow-sm active:translate-y-0 shadow-sm",
        secondary: "bg-[#1F2937] text-[#F9FAFB] border border-[#374151] hover:bg-[#252e3f] hover:border-[#4B5563] hover:shadow-md hover:-translate-y-0.5 active:bg-[#111827] active:shadow-sm active:translate-y-0 shadow-sm",
        outline: "border border-[#4B5563] text-[#E5E7EB] bg-transparent hover:bg-[#1F2937] hover:border-[#6366F1] hover:shadow-md hover:-translate-y-0.5 active:bg-[#111827] active:shadow-sm active:translate-y-0",
        ghost: "text-[#E5E7EB] hover:bg-[#1F2937] hover:text-[#818CF8] hover:shadow-sm",
        destructive: "bg-[#EF4444] text-white hover:bg-[#DC2626] hover:shadow-lg hover:-translate-y-0.5 active:bg-[#991B1B] active:shadow-sm active:translate-y-0 shadow-sm",
      },
      size: {
        default: "px-4 py-3 h-auto",
        sm: "px-3 py-2 h-auto text-xs",
        lg: "px-6 py-3 h-auto text-base",
        icon: "h-10 w-10 p-0",
        xs: "px-2 py-1 h-auto text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

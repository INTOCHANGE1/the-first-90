import * as React from "react";
import { cn } from "@/lib/utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  bloodAccent?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, bloodAccent, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full bg-bone-warm border border-line px-4 py-3 text-base text-ink rounded transition-shadow",
          "focus:outline-none focus:ring-2 focus:ring-blood focus:ring-offset-2 focus:ring-offset-bone",
          "placeholder:text-ash",
          bloodAccent && "border-l-4 border-l-blood",
          className,
        )}
        {...props}
      />
    );
  },
);

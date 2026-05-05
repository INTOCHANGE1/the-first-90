"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  bloodAccent?: boolean;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { className, bloodAccent, onChange, value, defaultValue, ...props },
    ref,
  ) {
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

    React.useImperativeHandle(
      ref,
      () => innerRef.current as HTMLTextAreaElement,
    );

    const resize = React.useCallback(() => {
      const el = innerRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, []);

    React.useEffect(() => {
      resize();
    }, [resize, value, defaultValue]);

    return (
      <textarea
        ref={innerRef}
        rows={3}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => {
          resize();
          onChange?.(e);
        }}
        className={cn(
          "w-full min-h-[120px] bg-bone-warm border border-line px-4 py-3 text-base text-ink leading-7 rounded resize-none transition-shadow",
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

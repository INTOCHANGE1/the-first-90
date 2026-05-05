import * as React from "react";
import { cn } from "@/lib/utils/cn";

type PullQuoteProps = React.HTMLAttributes<HTMLElement> & {
  attribution?: string;
};

export function PullQuote({
  children,
  attribution,
  className,
  ...props
}: PullQuoteProps) {
  return (
    <figure
      className={cn(
        "border-l-4 border-blood pl-6 py-2 my-8",
        className,
      )}
      {...props}
    >
      <blockquote className="font-serif italic text-xl md:text-2xl text-ink leading-snug">
        {children}
      </blockquote>
      {attribution && (
        <figcaption className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-ash">
          {attribution}
        </figcaption>
      )}
    </figure>
  );
}

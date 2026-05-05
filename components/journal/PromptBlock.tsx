"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { MicroLabel } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils/cn";

type CommonProps = {
  label: string;
  intro?: string;
  bloodAccent?: boolean;
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (next: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
};

type PromptBlockProps = CommonProps & {
  /** "textarea" by default; "input" for single-line prompts (mantra etc). */
  variant?: "textarea" | "input";
};

export function PromptBlock({
  label,
  intro,
  bloodAccent,
  placeholder = "Write what's true.",
  className,
  value,
  onChange,
  onBlur,
  disabled,
  variant = "textarea",
}: PromptBlockProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <MicroLabel>{label}</MicroLabel>
      {intro && <p className="text-sm text-steel">{intro}</p>}
      {variant === "input" ? (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          bloodAccent={bloodAccent}
          disabled={disabled}
        />
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          bloodAccent={bloodAccent}
          disabled={disabled}
        />
      )}
    </div>
  );
}

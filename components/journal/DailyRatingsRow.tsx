"use client";

import { RatingPills } from "@/components/ui/RatingPills";
import { cn } from "@/lib/utils/cn";

export type DailyRatingsValues = {
  mindset: number | null;
  sleep: number | null;
  energy: number | null;
  mood: number | null;
};

type DailyRatingsRowProps = {
  values: DailyRatingsValues;
  onChange: (next: DailyRatingsValues) => void;
  scale?: 5 | 10;
  className?: string;
  /** Use evening labels (productivity/focus/energy/food) instead of morning. */
  variant?: "morning" | "evening";
};

const MORNING_LABELS = {
  mindset: "Mindset",
  sleep: "Sleep",
  energy: "Energy",
  mood: "Mood",
} as const;

const EVENING_LABELS = {
  mindset: "Productivity",
  sleep: "Focus",
  energy: "Energy",
  mood: "Food",
} as const;

export function DailyRatingsRow({
  values,
  onChange,
  scale = 5,
  className,
  variant = "morning",
}: DailyRatingsRowProps) {
  const labels = variant === "morning" ? MORNING_LABELS : EVENING_LABELS;
  const keys: Array<keyof DailyRatingsValues> = [
    "mindset",
    "sleep",
    "energy",
    "mood",
  ];

  return (
    <div className={cn("grid grid-cols-2 gap-x-4 gap-y-6", className)}>
      {keys.map((key) => (
        <RatingPills
          key={key}
          label={labels[key]}
          value={values[key]}
          onChange={(n) => onChange({ ...values, [key]: n })}
          scale={scale}
        />
      ))}
    </div>
  );
}

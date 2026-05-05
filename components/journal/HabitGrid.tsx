"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type HabitTicks = Record<string, boolean[]>;

type HabitGridProps = {
  /** Up to 5 habit names defined by the user at start of phase. */
  habits: string[];
  /** Map of habit-index ("0".."4") → 28-element boolean array. */
  ticks: HabitTicks;
  /** 0-based index of "today" within the phase (0..27). Future days are locked. */
  todayIndex: number;
  onToggle: (habitIndex: number, dayIndex: number, next: boolean) => void;
  className?: string;
};

const PHASE_LENGTH = 28;

function streakAt(habitTicks: boolean[] | undefined, todayIndex: number) {
  if (!habitTicks) return 0;
  let count = 0;
  for (let i = todayIndex; i >= 0; i--) {
    if (habitTicks[i]) count++;
    else break;
  }
  return count;
}

export function HabitGrid({
  habits,
  ticks,
  todayIndex,
  onToggle,
  className,
}: HabitGridProps) {
  const days = Array.from({ length: PHASE_LENGTH }, (_, i) => i);

  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div
          className="inline-grid"
          style={{
            gridTemplateColumns: `minmax(140px, 9rem) repeat(${PHASE_LENGTH}, 28px) minmax(96px, auto)`,
          }}
        >
          {/* Header row */}
          <div className="sticky left-0 bg-bone z-10 px-4 md:px-0 pb-2" />
          {days.map((d) => (
            <div
              key={`h-${d}`}
              className={cn(
                "text-center text-[10px] font-medium tracking-[0.08em] text-ash pb-2",
                d === todayIndex && "text-blood",
              )}
            >
              {d + 1}
            </div>
          ))}
          <div className="text-right text-[10px] font-medium uppercase tracking-[0.12em] text-ash pb-2 pr-4 md:pr-0">
            Streak
          </div>

          {/* Habit rows */}
          {habits.map((habit, hi) => {
            const row = ticks[String(hi)] ?? [];
            const streak = streakAt(row, todayIndex);
            return (
              <RowCells
                key={hi}
                hi={hi}
                habit={habit}
                row={row}
                days={days}
                todayIndex={todayIndex}
                streak={streak}
                onToggle={onToggle}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RowCells({
  hi,
  habit,
  row,
  days,
  todayIndex,
  streak,
  onToggle,
}: {
  hi: number;
  habit: string;
  row: boolean[];
  days: number[];
  todayIndex: number;
  streak: number;
  onToggle: HabitGridProps["onToggle"];
}) {
  return (
    <>
      <div className="sticky left-0 bg-bone z-10 px-4 md:px-0 py-2 text-sm text-ink truncate">
        {habit || (
          <span className="text-ash italic">Habit {hi + 1}</span>
        )}
      </div>
      {days.map((d) => {
        const checked = !!row[d];
        const future = d > todayIndex;
        const isToday = d === todayIndex;
        return (
          <div
            key={`${hi}-${d}`}
            className={cn(
              "h-7 flex items-center justify-center",
              isToday && "border-b-2 border-blood",
            )}
          >
            <button
              type="button"
              role="checkbox"
              aria-checked={checked}
              aria-label={`${habit || `Habit ${hi + 1}`} on day ${d + 1}`}
              disabled={future}
              onClick={() => onToggle(hi, d, !checked)}
              className={cn(
                "w-5 h-5 rounded-sm border-2 inline-flex items-center justify-center transition-colors",
                checked
                  ? "bg-blood border-blood"
                  : "bg-transparent border-line hover:border-ink",
                future && "opacity-20 cursor-not-allowed hover:border-line",
              )}
            >
              {checked && <Check className="w-3 h-3 text-bone" />}
            </button>
          </div>
        );
      })}
      <div className="flex items-center justify-end pr-4 md:pr-0">
        {streak > 0 ? (
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-blood">
            {streak} day streak
          </span>
        ) : (
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash">
            —
          </span>
        )}
      </div>
    </>
  );
}

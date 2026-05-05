"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const WHEEL_SEGMENTS = [
  { key: "career", label: "Career" },
  { key: "finance", label: "Finance" },
  { key: "health", label: "Health" },
  { key: "social", label: "Social" },
  { key: "family", label: "Family" },
  { key: "love", label: "Love" },
  { key: "recreation", label: "Recreation" },
  { key: "contribution", label: "Contribution" },
  { key: "spirituality", label: "Spirituality" },
  { key: "self_image", label: "Self-Image" },
] as const;

export type WheelKey = (typeof WHEEL_SEGMENTS)[number]["key"];
export type WheelRatings = Partial<Record<WheelKey, number>>;

type WheelOfLifeProps = {
  ratings: WheelRatings;
  onChange?: (next: WheelRatings) => void;
  /** Renders read-only without interaction (for printed-state comparison views). */
  readOnly?: boolean;
  /** Visual size in CSS pixels (the SVG scales to fit). */
  size?: number;
  className?: string;
};

const SEGMENT_COUNT = 10;
const RING_COUNT = 10;
const SEGMENT_DEG = 360 / SEGMENT_COUNT;
const PADDING = 60; // room for outer labels

// SVG path coordinate system: 0,0 at center; we'll wrap in viewBox.
const VIEW = 400;
const CX = VIEW / 2;
const CY = VIEW / 2;
const R_OUTER = (VIEW - PADDING) / 2;

function polar(angleDeg: number, r: number) {
  // Rotate so segment 0 sits at the top (-90° in standard SVG)
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function ringPath(
  segmentIndex: number,
  ringIndex: number,
): string {
  const a1 = segmentIndex * SEGMENT_DEG;
  const a2 = a1 + SEGMENT_DEG;
  const r1 = (ringIndex / RING_COUNT) * R_OUTER;
  const r2 = ((ringIndex + 1) / RING_COUNT) * R_OUTER;

  const p1 = polar(a1, r2);
  const p2 = polar(a2, r2);
  const p3 = polar(a2, r1);
  const p4 = polar(a1, r1);

  if (ringIndex === 0) {
    // Innermost ring: a triangle from center, no inner arc
    return [
      `M ${p1.x} ${p1.y}`,
      `A ${r2} ${r2} 0 0 1 ${p2.x} ${p2.y}`,
      `L ${CX} ${CY}`,
      `Z`,
    ].join(" ");
  }

  return [
    `M ${p1.x} ${p1.y}`,
    `A ${r2} ${r2} 0 0 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${r1} ${r1} 0 0 0 ${p4.x} ${p4.y}`,
    `Z`,
  ].join(" ");
}

function labelPosition(segmentIndex: number) {
  const angle = segmentIndex * SEGMENT_DEG + SEGMENT_DEG / 2;
  const labelRadius = R_OUTER + 22;
  const { x, y } = polar(angle, labelRadius);
  return { x, y, angle };
}

export function WheelOfLife({
  ratings,
  onChange,
  readOnly,
  size = 360,
  className,
}: WheelOfLifeProps) {
  const interactive = !readOnly && !!onChange;

  const setRating = React.useCallback(
    (key: WheelKey, value: number) => {
      if (!interactive) return;
      onChange?.({ ...ratings, [key]: value });
    },
    [interactive, onChange, ratings],
  );

  const ratedCount = WHEEL_SEGMENTS.filter(
    (s) => typeof ratings[s.key] === "number",
  ).length;

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        width={size}
        height={size}
        role="img"
        aria-label="Wheel of Life rating"
        className="overflow-visible"
      >
        {WHEEL_SEGMENTS.map((segment, si) => {
          const rating = ratings[segment.key];
          return (
            <g key={segment.key}>
              {Array.from({ length: RING_COUNT }, (_, ri) => {
                const filled =
                  typeof rating === "number" && ri < rating;
                return (
                  <path
                    key={ri}
                    d={ringPath(si, ri)}
                    fill={filled ? "var(--color-blood)" : "var(--color-bone-warm)"}
                    stroke="var(--color-bone)"
                    strokeWidth={1}
                    className={cn(
                      "transition-[fill] duration-300 ease-out",
                      interactive && "cursor-pointer hover:opacity-90",
                    )}
                    onClick={
                      interactive
                        ? () => setRating(segment.key, ri + 1)
                        : undefined
                    }
                    role={interactive ? "button" : undefined}
                    aria-label={
                      interactive
                        ? `${segment.label} rating ${ri + 1} of 10`
                        : undefined
                    }
                  />
                );
              })}
              <SegmentLabel index={si} label={segment.label} />
            </g>
          );
        })}
        {/* Outer ring */}
        <circle
          cx={CX}
          cy={CY}
          r={R_OUTER}
          fill="none"
          stroke="var(--color-line-strong)"
          strokeWidth={1}
        />
      </svg>
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ash">
        {ratedCount} of {WHEEL_SEGMENTS.length} areas rated
      </p>
    </div>
  );
}

function SegmentLabel({ index, label }: { index: number; label: string }) {
  const { x, y, angle } = labelPosition(index);
  // Anchor the label so it never collides with the wheel
  const isLeft = angle > 180;
  return (
    <text
      x={x}
      y={y}
      textAnchor={isLeft ? "end" : angle === 0 || angle === 180 ? "middle" : "start"}
      dominantBaseline="middle"
      className="fill-ash text-[10px] font-medium uppercase tracking-[0.12em]"
    >
      {label}
    </text>
  );
}

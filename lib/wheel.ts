/**
 * Wheel of Life shared constants/types.
 *
 * Lives outside WheelOfLife.tsx (which is "use client") so that server
 * components — e.g. the Phase 1 hub computing completion — can import
 * the constants as plain JS values rather than opaque client references.
 */

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

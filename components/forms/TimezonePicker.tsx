"use client";

import { COMMON_TIMEZONES, getAllTimezones } from "@/lib/utils/timezone";

type Props = {
  value: string;
  onChange: (next: string) => void;
  id?: string;
  className?: string;
};

/**
 * Shared timezone <select>. Used in onboarding step 3 and on /settings.
 *
 * Renders up to three optgroups:
 *   1. The current value if it isn't an IANA-recognised zone, so a broken
 *      legacy value stays visible while the user picks its replacement.
 *   2. "Common" - curated short list (see COMMON_TIMEZONES).
 *   3. "All timezones" - full Intl.supportedValuesOf result, alphabetical.
 */
export function TimezonePicker({ value, onChange, id, className }: Props) {
  const allZones = getAllTimezones();
  const valueIsKnown = allZones.includes(value);

  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={
        className ??
        "w-full bg-bone-warm border border-line px-4 py-3 text-base text-ink rounded transition-shadow focus:outline-none focus:ring-2 focus:ring-blood focus:ring-offset-2 focus:ring-offset-bone"
      }
    >
      {!valueIsKnown && value && (
        <option value={value}>{value} (unknown)</option>
      )}
      <optgroup label="Common">
        {COMMON_TIMEZONES.map((z) => (
          <option key={z} value={z}>
            {z}
          </option>
        ))}
      </optgroup>
      <optgroup label="All timezones">
        {allZones.map((z) => (
          <option key={z} value={z}>
            {z}
          </option>
        ))}
      </optgroup>
    </select>
  );
}

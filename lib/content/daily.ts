/**
 * Daily morning + evening prompt structure.
 * Source: _handover/THE_FIRST_90_New_Age_Man_Journal.docx
 *
 * The same prompts repeat every day for 84 days; the prose lives here once.
 */

export const MORNING = {
  preTitle: "MORNING",
  ratings: [
    { key: "mindset" as const, label: "Mindset" },
    { key: "sleep" as const, label: "Sleep" },
    { key: "energy" as const, label: "Energy" },
    { key: "mood" as const, label: "Mood" },
  ],
  mantraLabel: "My mantra to get me through today",
  gratitudeLabel: "Three things I am grateful for today",
  nonNegotiablesLabel: "Three non-negotiables for today",
  prompts: [
    {
      key: "important_task" as const,
      label: "One important task I will get done today",
    },
    {
      key: "kindness" as const,
      label: "One person I will reach out to and let them know they matter",
    },
    {
      key: "challenge" as const,
      label:
        "One thing I will do to challenge myself and step outside my comfort zone",
    },
    {
      key: "stress_situation" as const,
      label:
        "One situation that could cause me stress today and how I will lead through it",
    },
  ],
} as const;

export const EVENING = {
  preTitle: "EVENING",
  ratings: [
    { key: "productivity" as const, label: "Productivity" },
    { key: "focus" as const, label: "Focus" },
    { key: "energy" as const, label: "Energy" },
    { key: "food" as const, label: "Food" },
  ],
  waterLabel: "Water intake",
  waterOptions: ["< 1L", "1L", "2L", "3L", "4L", "> 4L"] as const,
  keptWordLabel:
    "Did I keep my word to myself today? If no, where did I break it?",
  highlightsLabel: "Three highlights from my day",
  prompts: [
    {
      key: "biggest_win" as const,
      label: "Biggest win or victory of the day",
    },
    {
      key: "biggest_lesson" as const,
      label: "Biggest lesson from today",
    },
    {
      key: "showed_up_for_family" as const,
      label: "How did I show up for my partner / children / family today?",
    },
    {
      key: "tomorrow_focus" as const,
      label: "One thing I will focus on for tomorrow",
    },
  ],
} as const;

export type MorningRatingKey = (typeof MORNING.ratings)[number]["key"];
export type EveningRatingKey = (typeof EVENING.ratings)[number]["key"];

export type MorningContent = {
  mindset?: number;
  sleep?: number;
  energy?: number;
  mood?: number;
  mantra?: string;
  gratitude?: string[]; // 3
  non_negotiables?: string[]; // 3
  important_task?: string;
  kindness?: string;
  challenge?: string;
  stress_situation?: string;
};

export type EveningContent = {
  productivity?: number;
  focus?: number;
  energy?: number;
  food?: number;
  water?: string;
  kept_word?: boolean;
  broke_word_where?: string;
  highlights?: string[]; // 3
  biggest_win?: string;
  biggest_lesson?: string;
  showed_up_for_family?: string;
  tomorrow_focus?: string;
};

/**
 * Weekly focus (Monday) and Sunday review prompts.
 * Source: _handover/THE_FIRST_90_New_Age_Man_Journal.docx
 */

import { WHEEL_SEGMENTS, type WheelKey } from "@/lib/wheel";

export const WEEKLY_FOCUS = {
  preTitle: "MONDAY · FOCUS",
  intro:
    "This is your week-level direction. The work is in the daily reps; this page sets the line they have to clear.",
  primaryFocusLabel: "My primary focus for this week",
  nonNegotiablesLabel: "Three non-negotiables I will not break this week",
  lookingForwardLabel: "One event this week I am looking forward to",
  balanceSituationLabel:
    "One situation this week that could throw me off balance, and how I will lead through it",
  bestSelfLabel: "How will I show up as my best self this week?",
  weeklyTasksLabel: "Important tasks to get done this week",
  weekDays: [
    { key: "mon" as const, label: "Mon" },
    { key: "tue" as const, label: "Tue" },
    { key: "wed" as const, label: "Wed" },
    { key: "thu" as const, label: "Thu" },
    { key: "fri" as const, label: "Fri" },
    { key: "sat" as const, label: "Sat" },
    { key: "sun" as const, label: "Sun" },
  ],
} as const;

export const SUNDAY_REVIEW = {
  preTitle: "SUNDAY · REVIEW",
  intro:
    "This is where the week becomes wisdom. Skip this and you keep repeating the same week.",
  threeBestLabel: "Three best things that happened this week",
  gratefulLabel: "One thing I am most grateful for this week",
  biggestWinLabel: "My biggest win this week",
  biggestLessonLabel: "My biggest lesson this week",
  brokeWordLabel:
    "Where did I break my word to myself or to others this week?",
  leadBetterLabel:
    "What am I going to do next week to lead through that better?",
  ratingsLabel: "Rate yourself this week",
  ratingsHint: "1 = need real work · 10 = leading",
  doDifferentlyLabel: "What is one thing I will do differently next week?",
  ratingKeys: WHEEL_SEGMENTS.map((s) => s.key) as readonly WheelKey[],
} as const;

export type WeeklyFocusContent = {
  primary_focus?: string;
  three_non_negotiables?: string[];
  looking_forward?: string;
  balance_situation?: string;
  best_self?: string;
  weekly_tasks?: Partial<
    Record<(typeof WEEKLY_FOCUS.weekDays)[number]["key"], string>
  >;
};

export type SundayReviewContent = {
  three_best?: string[];
  grateful_for?: string;
  biggest_win?: string;
  biggest_lesson?: string;
  broke_word?: string;
  lead_better?: string;
  ratings?: Partial<Record<WheelKey, number>>;
  do_differently?: string;
};

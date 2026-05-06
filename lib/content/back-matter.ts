/**
 * Back matter (post-90) content.
 * Source: _handover/THE_FIRST_90_New_Age_Man_Journal.docx
 */

export const FINAL_REVIEW = {
  preTitle: "BACK MATTER",
  title: "The 90-day review",
  intro: [
    "This is your closing assessment. Take your time with it. The review is where the lessons get locked in.",
  ],
  prompts: [
    {
      key: "most_important_lesson" as const,
      label: "What is the single most important lesson from these 90 days?",
    },
    {
      key: "habit_for_life" as const,
      label:
        "What habit, standard, or shift will I take with me for life?",
    },
    {
      key: "relationships_changed" as const,
      label: "Which relationships changed in these 90 days, and how?",
    },
    {
      key: "who_am_i_when_alone" as const,
      label:
        "What did I learn about who I am when nobody is watching?",
    },
    {
      key: "truth_now_known" as const,
      label:
        "What is the truth about myself I now know that I did not 90 days ago?",
    },
    { key: "still_needs_work" as const, label: "What still needs work?" },
    {
      key: "committing_to" as const,
      label: "What am I committing to from here?",
    },
  ],
} as const;

export const POST_90_WHEEL = {
  preTitle: "BACK MATTER",
  title: "The wheel — 90 days later",
  intro: [
    "You started this journal with the wheel. Time to run it again.",
    "Be honest. Where has the wheel filled in. Where is it still light.",
    "This is your visible proof of progress. Compare it to Phase 1.",
  ],
  hint: "Tap any ring to set that segment's rating. Centre = 1 (failing here). Outer edge = 10 (leading here).",
} as const;

export const POST_90_WHEEL_DEBRIEF = {
  preTitle: "BACK MATTER",
  title: "Wheel debrief — 90 days later",
  intro: [
    "Look at where you started. Look at where you are. Now write what changed.",
  ],
  prompts: {
    grown: "Three areas where I have grown the most",
    still_work: "Three areas that still need work",
    biggest_shift:
      "What is the biggest shift in my wheel from day one to today?",
    next_focus: "What am I going to focus on for the next 90 days?",
  },
} as const;

export const WHEEL_COMPARISON = {
  preTitle: "BACK MATTER",
  title: "Before. After.",
  intro: [
    "The wheel you rolled in on day one. The wheel you roll out on.",
    "Some segments filled. Some still light. The shape of the man changed in ninety days.",
  ],
} as const;

export const REFERRAL = {
  preTitle: "BACK MATTER",
  title: "Do you know someone who could benefit from this program?",
  intro: [
    "You did the first 90 days. You know what changes when a man does the work.",
    "If you know another man who needs this — a brother, a friend, a colleague, your partner — pass it on. Drop his details below and we will reach out.",
    "No pressure. No selling. Just an invitation to start.",
  ],
  closer:
    "We will get in touch with him directly. Your details stay between us.",
} as const;

export const FINAL_WORD = {
  preTitle: "BACK MATTER",
  title: "Final word",
  paragraphs: [
    "Ninety days ago you opened this journal as a man who had something he needed to face.",
    "You faced it.",
    "You wrote your line in the sand. You did the wheel. You did the four pillars. You wrote down where you had broken your word and you sat with it. You picked up the pen on the days you did not feel like it. You held the line on your non-negotiables. You came back when you fell off.",
    "You did the work.",
    "Most men never do. You did. That counts for something.",
    "I want you to know something. The man who started this journal is not the same man finishing it. Maybe you cannot feel that yet. But the people around you can. The mirror can. The way you walk into a room can.",
    "This is who you are now. The man who does the work.",
    "Keep doing it.",
  ],
  signoff: "Ben Lowe",
  role: "Founder, The New Age Man",
  closingQuote:
    "Alone you cannot change the world. But by changing the life of one man, the ripple effect will reach thousands.",
} as const;

export const FREEFORM = {
  preTitle: "BACK MATTER",
  title: "Reflection pages",
  intro:
    "Use these pages for whatever you need. Thoughts. Letters you will not send. Pages you needed to write to yourself. Anger. Grief. Vision. Plans. This is your space.",
} as const;

export type FinalReviewContent = Partial<
  Record<(typeof FINAL_REVIEW.prompts)[number]["key"], string>
>;

export type Post90DebriefShape = {
  grown?: string[];
  still_work?: string[];
  biggest_shift?: string;
  next_focus?: string;
};

export const BACK_MATTER_ORDER = [
  {
    slug: "final-review",
    title: "The 90-day review",
    kind: "form" as const,
  },
  {
    slug: "wheel",
    title: "The wheel — 90 days later",
    kind: "wheel" as const,
  },
  {
    slug: "wheel-debrief",
    title: "Wheel debrief",
    kind: "form" as const,
  },
  {
    slug: "wheel-comparison",
    title: "Before. After.",
    kind: "comparison" as const,
  },
  {
    slug: "freeform",
    title: "Reflection pages",
    kind: "freeform" as const,
  },
  {
    slug: "referral",
    title: "Refer a man you know",
    kind: "form" as const,
  },
  {
    slug: "final-word",
    title: "Final word",
    kind: "static" as const,
  },
] as const;

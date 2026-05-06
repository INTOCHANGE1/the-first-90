/**
 * Phase 2 (Rebuild, Weeks 5-8) setup content.
 * Source: _handover/THE_FIRST_90_New_Age_Man_Journal.docx
 */

export const PHASE_2_INTRO = {
  preTitle: "PHASE TWO",
  subtitle: "Rebuild · Weeks 5 to 8",
  pullQuote:
    "Discipline is choosing the man you want to become over the man you feel like being.",
  attribution: "Ben Lowe",
  body: [
    "Awareness was Phase 1. Action is Phase 2.",
    "You have spent four weeks looking honestly at the man you have been. Now you start building the man you are becoming. This is where most men quit. The novelty wears off. The reality of daily discipline shows up. The work gets quiet.",
    "Quiet work is the only work that actually changes a man.",
  ],
} as const;

export const STANDARDS = {
  preTitle: "PHASE 2 · DEEP WORK",
  title: "My standards as a man",
  intro: [
    "Goals are temporary. Standards are who you are.",
    "A standard is the bar you refuse to drop below, regardless of mood, energy, or circumstance. Men with low standards make excuses. Men with high standards make decisions.",
    "Write your standards. Live them. Read them on the days you want to fold.",
  ],
  prompts: [
    { key: "speak_to_partner" as const, label: "HOW I SPEAK TO MY PARTNER" },
    {
      key: "show_up_for_children" as const,
      label: "HOW I SHOW UP FOR MY CHILDREN",
    },
    { key: "handle_emotions" as const, label: "HOW I HANDLE MY EMOTIONS" },
    { key: "treat_body" as const, label: "HOW I TREAT MY BODY" },
    { key: "lead_work" as const, label: "HOW I LEAD MY WORK" },
    {
      key: "respond_when_hard" as const,
      label: "HOW I RESPOND WHEN LIFE GETS HARD",
    },
  ],
  closer: "These are not goals. These are non-negotiables. This is who I am.",
} as const;

export const BROTHERHOOD = {
  preTitle: "PHASE 2 · DEEP WORK",
  title: "The Brotherhood page",
  intro: [
    "No man changes alone.",
    "Every man who has ever rebuilt himself had other men around him. Not yes-men. Not drinking buddies. Real men, willing to call him out, hold him to his word, and pick him up when he fell.",
    "If you do not have those men, you have a project, not a brotherhood. Phase 2 is where you go and find them. Or where you ask the men already around you to hold a higher standard for you.",
  ],
  preList:
    "Three men who are holding me accountable through these 90 days:",
  brotherCount: 3,
  closer:
    "Send all three of them a message today. Tell them what you are doing. Ask them to hold the line.",
} as const;

export const PHASE_2_HABIT_GRID_SETUP = {
  preTitle: "PHASE 2 · DEEP WORK",
  title: "Phase 2 habit grid",
  intro: [
    "Five non-negotiables. Twenty-eight days. Every day you do it, you tick the box. Every day you do not, you leave it blank.",
    "Your non-negotiables can stay the same as Phase 1. Or they can level up. Discipline grows.",
  ],
  hint: "Name your five non-negotiables for Phase 2. You will tick them daily on the dashboard.",
} as const;

export type StandardsContent = Partial<
  Record<(typeof STANDARDS.prompts)[number]["key"], string>
> & {
  signed_name?: string;
  signed_date?: string;
};

export type BrotherhoodContent = {
  brothers?: Array<{
    name?: string;
    contact?: string;
    permission?: string;
  }>;
};

export const PHASE_2_ORDER = [
  { slug: "standards", title: "My standards as a man", kind: "sign" as const },
  { slug: "brotherhood", title: "The Brotherhood page", kind: "sign" as const },
  {
    slug: "habit-grid",
    title: "Phase 2 habit grid",
    kind: "habit-grid" as const,
  },
] as const;

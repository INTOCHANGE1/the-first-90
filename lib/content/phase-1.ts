/**
 * Phase 1 (Self-Discovery, Weeks 1-4) deep-work content.
 * Source: _handover/THE_FIRST_90_New_Age_Man_Journal.docx
 * Voice belongs to Ben. Do not paraphrase.
 */

export const PHASE_1_INTRO = {
  preTitle: "PHASE ONE",
  subtitle: "Self-Discovery · Weeks 1 to 4",
  pullQuote: "You cannot change what you will not look at.",
  attribution: "Ben Lowe",
} as const;

export const WHEEL = {
  preTitle: "PHASE 1 · SELF-ASSESSMENT 1",
  title: "The Wheel",
  intro: [
    "Imagine your life as a wheel. Each segment of that wheel is one area of who you are and how you live. If one segment is empty and another is full, the wheel does not roll smoothly. You drag yourself through your days instead of moving through them with momentum.",
    "Most men have one or two segments running hot and the rest running on fumes. They tell themselves they will get to those other areas later. Later never comes. Then the wheel collapses and they wonder why.",
    "This is your honest baseline. Rate each segment from one to ten. One means you are failing here. Ten means you are leading here. No spin. No rounding up to feel better.",
  ],
  hint: "Tap any ring to set that segment's rating. Centre = 1 (failing here). Outer edge = 10 (leading here).",
} as const;

export const WHEEL_DEBRIEF = {
  preTitle: "PHASE 1 · SELF-ASSESSMENT 1",
  title: "Wheel debrief",
  intro: [
    "Look at the shape of your wheel. Look at where it pulls. Now write what you see.",
  ],
  prompts: {
    excelling: "Three areas where you are excelling",
    why_strong: "Why do you think these are strong?",
    struggling: "Three areas where you are struggling",
    why_weak: "Why do you think these are weak?",
    tradeoffs: "Is your focus in one area costing you in another? Where?",
  },
} as const;

export const GAP_INTRO = {
  preTitle: "PHASE 1 · SELF-ASSESSMENT 2",
  title: "The Gap",
  intro: [
    "Most men have it backwards their entire life.",
    "They grind for years trying to HAVE more before they ever stop and ask who they have to become to live that life. They chase the body, the marriage, the bank account, the respect, by trying to DO more. More work. More discipline. More effort. More striving.",
    "Then they burn out without ever becoming.",
    "The order has to flip. This exercise is called BE, DO, HAVE. Most men learn it in the wrong sequence. We are going to run it in the order that actually creates change. Have. Be. Do.",
  ],
  steps: [
    {
      key: "have",
      heading: "HAVE first",
      body: "The man you want to become and the life that man lives. Get specific. If you cannot see the destination, you cannot move toward it.",
    },
    {
      key: "be",
      heading: "BE second",
      body: "The man you are being right now. Honestly. The habits, the patterns, the avoidance, the self-talk, the way you handle stress, the way you treat your partner, the way you show up for your kids when you are tired. This is not the man you want to be. This is the man you currently are.",
    },
    {
      key: "do",
      heading: "DO third",
      body: "The space between who you want to become and who you are being right now. That space is the gap. The doing is the bridge across it.",
    },
  ],
  closer:
    "Most men try to skip the BE. They want to fast-forward to the doing because the doing feels productive. But you cannot out-do an identity you have not faced. The work is in seeing yourself clearly, then choosing differently.",
  pullQuote:
    "The gap between who you are and who you want to become is the most honest mirror a man will ever look into.",
} as const;

export const GAP_HAVE = {
  preTitle: "PHASE 1 · THE GAP",
  title: "Have — the man I want to become",
  intro: [
    "Before anything changes, you have to see what you are moving toward. Most men cannot answer this question with any real clarity. They know what they do not want. They cannot describe what they do.",
    "Get specific. Vague vision produces vague effort.",
  ],
  prompts: [
    {
      key: "vision" as const,
      label:
        "Who is the man I want to become? What does his life look like three years from now?",
    },
    {
      key: "marriage" as const,
      label:
        "What does his marriage or partnership look like? How does his partner feel around him?",
    },
    {
      key: "father_leader" as const,
      label: "What kind of father, leader, friend, brother is he?",
    },
    {
      key: "body_work" as const,
      label:
        "What do his body, his work, his standards, his daily life look like?",
    },
    {
      key: "stress" as const,
      label:
        "How does he handle stress, hard conversations, and adversity?",
    },
  ],
} as const;

export const GAP_BE = {
  preTitle: "PHASE 1 · THE GAP",
  title: "Be — who I am being right now",
  intro: [
    "This is the honest mirror. No performance. No spin.",
    "This is the page most men skip or soften. Do not. The clearer you can see the man you currently are, the cleaner the work becomes. The gap only shows up when you stop lying about where you are standing.",
  ],
  prompts: [
    {
      key: "patterns" as const,
      label:
        "What are the habits, behaviours, and patterns I am running right now that are stopping me from becoming that man?",
    },
    {
      key: "leaks" as const,
      label: "Where am I leaking energy, time, integrity, or attention?",
    },
    {
      key: "hard_times" as const,
      label:
        "What does the current me do when life gets hard, stressful, or boring?",
    },
    {
      key: "showing_up" as const,
      label:
        "How does the current me show up for my partner, my children, my work?",
    },
    {
      key: "cost" as const,
      label: "What is the cost of staying this man for the next three years?",
    },
  ],
} as const;

export const GAP_DO = {
  preTitle: "PHASE 1 · THE GAP",
  title: "Do — the bridge across the gap",
  intro: [
    "Now you have seen both ends. The man you are becoming. The man you are being. The space in between is the gap. The doing is what closes it.",
    "Not big action. Not heroic action. Daily, boring, repeatable action. The kind no one claps for. The kind that builds a man.",
  ],
  prompts: [
    {
      key: "stop" as const,
      label: "What does the current me need to STOP doing, immediately?",
    },
    {
      key: "start" as const,
      label: "What does the future me need to START doing, daily?",
    },
    {
      key: "one_thing" as const,
      label:
        "What is the ONE thing I can do today that begins to close the gap?",
    },
  ],
  goalsLabel:
    "Three goals for the next 90 days that align with the man I am becoming",
  sacrificesLabel:
    "What sacrifices, changes, or things must I let go of to make this real?",
} as const;

export const FOUR_PILLARS_AUDIT = {
  preTitle: "PHASE 1 · DEEP WORK",
  title: "The Four Pillars Audit",
  intro: [
    "Most men have four pillars holding up their life. Self. Partner. Children. Work.",
    "If one pillar is leaning, the whole structure pulls. If two are leaning, the whole thing is on borrowed time. Most men focus all their energy on the work pillar and wonder why the rest of the house is falling down.",
    "Look at each pillar honestly. Where are you leading. Where are you leaking.",
  ],
  pillars: [
    {
      key: "self" as const,
      heading: "PILLAR 1 — SELF",
      label:
        "How am I leading my own body, mind, energy, integrity, and standards?",
    },
    {
      key: "partner" as const,
      heading: "PILLAR 2 — PARTNER",
      label:
        "How am I showing up for the woman who shares my life? Am I her safe place or her stress source?",
    },
    {
      key: "children" as const,
      heading: "PILLAR 3 — CHILDREN",
      label:
        "How am I showing up for my children? Are they getting the man, or the leftovers of the man?",
    },
    {
      key: "work" as const,
      heading: "PILLAR 4 — WORK",
      label:
        "How am I leading my work, my career, my purpose, my contribution?",
    },
  ],
  reflectionLabel: "Which pillar is leaning the most? Why?",
} as const;

export const INTEGRITY_INVENTORY = {
  preTitle: "PHASE 1 · DEEP WORK",
  title: "Where I have broken my word",
  intro: [
    "A man is only as strong as his word.",
    "Every time you say you will do something and you do not do it, you are training yourself to be a man who breaks his word. Eventually you stop trusting yourself. Eventually the people around you stop trusting you too. Then one day you look up and you cannot remember the last time you kept a real promise.",
    "This page is brutal. Do it anyway. You cannot rebuild trust without first seeing what is broken.",
  ],
  prompts: [
    {
      key: "broken_to_self" as const,
      label: "Where have I broken my word to MYSELF?",
    },
    {
      key: "broken_to_partner" as const,
      label: "Where have I broken my word to my PARTNER?",
    },
    {
      key: "broken_to_children" as const,
      label: "Where have I broken my word to my CHILDREN?",
    },
    {
      key: "broken_to_work" as const,
      label: "Where have I broken my word in my WORK?",
    },
  ],
  reflectionLabel: "What does this list tell me about the man I have been?",
} as const;

export const MAN_COMPARISON = {
  preTitle: "PHASE 1 · DEEP WORK",
  title: "The man I have been vs. the man I am becoming",
  intro: [
    "Two columns. No performance. Truth on the left. Direction on the right.",
  ],
  beenLabel: "THE MAN I HAVE BEEN",
  becomingLabel: "THE MAN I AM BECOMING",
  hint: "Up to ten lines per column.",
} as const;

export const PERFECT_MORNING = {
  preTitle: "PHASE 1 · DEEP WORK",
  title: "Plan your perfect morning",
  intro: [
    "Win the morning, win the day.",
    "The man you are at 6am is the man you will be at 6pm. If your morning is reactive, scrolling, snoozing, scrambling, your day will be the same. If your morning is intentional, your day follows.",
    "Design the morning of the man you are becoming. Then live it.",
  ],
  descriptionLabel:
    "What does your perfect morning look like, from the moment you wake?",
  descriptionHint:
    "Examples: get up on first alarm, no phone for the first hour, water, movement or training, cold shower, breathwork, journal, gratitude, prep for the day.",
  nonNegotiablesLabel: "Non-negotiables for every morning",
  reflectionLabel:
    "How far is your current morning from this? What needs to change?",
  benefitsLabel: "What will starting your day this way make possible for you?",
} as const;

export const PERFECT_NIGHT = {
  preTitle: "PHASE 1 · DEEP WORK",
  title: "Plan your perfect night",
  intro: [
    "You do not win the morning at 6am. You win it the night before.",
    "The way you finish your day determines the way you start the next one. A reactive, late, exhausted, screen-numbed evening produces a reactive, late, exhausted, screen-numbed morning.",
    "Design the evening of the man you are becoming. Then live it.",
  ],
  descriptionLabel:
    "What does your perfect night look like, from the moment your work day ends?",
  descriptionHint:
    "Examples: cook dinner with the family, walk the dog, no phone after 9pm, read, journal, plan the next day, in bed by a set time.",
  nonNegotiablesLabel: "Non-negotiables for every night",
  reflectionLabel:
    "How far is your current night from this? What needs to change?",
} as const;

export const PHASE_1_HABIT_GRID_SETUP = {
  preTitle: "PHASE 1 · DEEP WORK",
  title: "Phase 1 habit grid",
  intro: [
    "Five non-negotiables. Twenty-eight days. Every day you do it, you tick the box. Every day you do not, you leave it blank. Do not lie. Do not skip days. The grid is the truth of your discipline.",
    "This is not a goal tracker. This is a man tracker. Who are you on day 28?",
  ],
  hint: "Name your five non-negotiables. You will tick them daily on the dashboard.",
} as const;

/** Linear order of Phase 1 deep-work pages, used by the hub and "next" buttons. */
export const PHASE_1_ORDER = [
  { slug: "wheel", title: "The Wheel", kind: "wheel" as const },
  {
    slug: "wheel-debrief",
    title: "Wheel debrief",
    kind: "wheel-debrief" as const,
  },
  { slug: "the-gap", title: "The Gap (intro)", kind: "intro" as const },
  {
    slug: "the-gap/have",
    title: "Have — the man I want to become",
    kind: "gap-have" as const,
  },
  {
    slug: "the-gap/be",
    title: "Be — who I am being right now",
    kind: "gap-be" as const,
  },
  {
    slug: "the-gap/do",
    title: "Do — the bridge across the gap",
    kind: "gap-do" as const,
  },
  {
    slug: "four-pillars",
    title: "Four Pillars Audit",
    kind: "four-pillars" as const,
  },
  {
    slug: "integrity-inventory",
    title: "Where I have broken my word",
    kind: "integrity" as const,
  },
  {
    slug: "man-comparison",
    title: "The man I have been vs. becoming",
    kind: "comparison" as const,
  },
  {
    slug: "perfect-morning",
    title: "Plan your perfect morning",
    kind: "morning" as const,
  },
  {
    slug: "perfect-night",
    title: "Plan your perfect night",
    kind: "night" as const,
  },
  {
    slug: "habit-grid",
    title: "Phase 1 habit grid",
    kind: "habit-grid" as const,
  },
] as const;

export type Phase1Slug = (typeof PHASE_1_ORDER)[number]["slug"];

/** Helpers for shaping the 'content'/'ratings'/jsonb fields stored in DB. */
export type WheelDebriefShape = {
  excelling?: string[];
  struggling?: string[];
  why_strong?: string;
  why_weak?: string;
  tradeoffs?: string;
};
export type GapHaveShape = Partial<
  Record<(typeof GAP_HAVE.prompts)[number]["key"], string>
>;
export type GapBeShape = Partial<
  Record<(typeof GAP_BE.prompts)[number]["key"], string>
>;
export type GapDoShape = Partial<
  Record<(typeof GAP_DO.prompts)[number]["key"], string>
> & {
  goals?: string[];
  sacrifices?: string;
};

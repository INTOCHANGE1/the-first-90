/**
 * Phase 3 (Self-Leadership, Weeks 9-12) setup content.
 * Source: _handover/THE_FIRST_90_New_Age_Man_Journal.docx
 */

export const PHASE_3_INTRO = {
  preTitle: "PHASE THREE",
  subtitle: "Self-Leadership · Weeks 9 to 12",
  pullQuote:
    "A man who can lead himself can lead anyone. A man who cannot, leads nothing.",
  attribution: "Ben Lowe",
  body: [
    "You are the man who shows up now.",
    "This phase is about leading. Yourself first. Then everything that depends on you. Your relationships. Your children. Your work. Your standards.",
    "Leadership is not a title. It is a daily decision to be the kind of man others can rely on, because you can rely on yourself.",
  ],
} as const;

export const FOUR_PILLARS_LEADERSHIP = {
  preTitle: "PHASE 3 · DEEP WORK",
  title: "The four pillars of leadership",
  intro: [
    "You started this journal with the four pillars audit. Now you return to it as the man you are becoming.",
    "Self. Partner. Children. Work.",
    "Look at each pillar. Where are you leading. Where do you still leak. Where is the next level of leadership for you in this last phase.",
  ],
  pillars: [
    {
      key: "self" as const,
      heading: "PILLAR 1 — LEADING MYSELF",
      currentLabel:
        "How am I leading my body, mind, energy, integrity, and standards now?",
      nextLevelLabel: "What is the next level of leading myself?",
    },
    {
      key: "partner" as const,
      heading: "PILLAR 2 — LEADING MY PARTNER",
      currentLabel:
        "How am I showing up for my partner now? What is different from day one?",
      nextLevelLabel: "What is the next level of leadership in this relationship?",
    },
    {
      key: "children" as const,
      heading: "PILLAR 3 — LEADING MY CHILDREN",
      currentLabel:
        "How am I showing up as a father now? What do they get from me that they did not 90 days ago?",
      nextLevelLabel: "What is the next level of fatherhood for me?",
    },
    {
      key: "work" as const,
      heading: "PILLAR 4 — LEADING MY WORK",
      currentLabel:
        "How am I leading my work, my career, my contribution now?",
      nextLevelLabel: "What is the next level of work and purpose for me?",
    },
  ],
} as const;

export const LEGACY = {
  preTitle: "PHASE 3 · DEEP WORK",
  title: "The Legacy page",
  intro: [
    "One day, you will not be here.",
    "Your children will be older. Your partner will tell stories about who you were. The men in your life will speak about what you stood for. The work you did will outlast you, or it will not.",
    "Most men avoid this question their entire life. Then they run out of time.",
    "You are not running out of time today. Use the time.",
  ],
  prompts: [
    {
      key: "children_remember" as const,
      label: "What do I want my children to remember about the man I was?",
    },
    {
      key: "partner_say" as const,
      label: "What do I want my partner to say about the man I became?",
    },
    {
      key: "brotherhood_say" as const,
      label:
        "What do I want the men in my life to say about my standards?",
    },
    {
      key: "bigger_work" as const,
      label: "What is the work I am here to do that is bigger than me?",
    },
    {
      key: "ten_year_legacy" as const,
      label:
        "If I lived the next 10 years from this place, what would I leave behind?",
    },
  ],
} as const;

export const PHASE_3_HABIT_GRID_SETUP = {
  preTitle: "PHASE 3 · DEEP WORK",
  title: "Phase 3 habit grid",
  intro: [
    "Five non-negotiables. Twenty-eight days. The last grid of the first 90.",
    "These are the standards of the man you are becoming. Not a temporary push. The new floor.",
  ],
  hint: "Name your five non-negotiables for Phase 3.",
} as const;

export const PHASE_3_ORDER = [
  {
    slug: "four-pillars-leadership",
    title: "Four pillars of leadership",
    kind: "audit" as const,
  },
  { slug: "legacy", title: "The Legacy page", kind: "sign" as const },
  {
    slug: "habit-grid",
    title: "Phase 3 habit grid",
    kind: "habit-grid" as const,
  },
  {
    slug: "reflection",
    title: "End of Phase 3 reflection",
    kind: "reset" as const,
  },
] as const;

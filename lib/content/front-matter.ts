/**
 * Canonical front-matter content from THE FIRST 90 master journal.
 * Source of truth: _handover/THE_FIRST_90_New_Age_Man_Journal.docx
 *
 * Voice belongs to Ben. Do not paraphrase. Edits here ship — there is no
 * separate CMS.
 */

export const LETTER = {
  preTitle: "A LETTER TO THE MAN HOLDING THIS",
  paragraphs: [
    "If you are reading this, something has happened.",
    "Maybe a small thing. Maybe everything.",
    "Maybe your wife stopped fighting and that scared you more than the fights ever did. Maybe your son flinched when you raised your voice and you saw your father in your own reflection. Maybe you woke up at 3am with a bottle in your hand, or a screen in your face, or a stranger in your bed, and finally felt the weight of who you have become.",
    "Maybe nothing dramatic happened at all. Maybe you just stopped recognising the man in the mirror.",
    "Whatever brought you here, this is not a self-help journal. It is not designed to make you feel good. It is designed to make you honest. There is a difference.",
    "I am not going to tell you that you are enough. You already know whether you are or you are not. What I am going to do is hand you a tool, ask you to pick up the pen, and trust you to do the work.",
    "I have been where you are. I spent fifteen years addicted, eight of them on ice, four of them in prison. I lost the people I loved. I lost the man I was supposed to be. I rebuilt all of it from zero, slowly, quietly, the same way every man rebuilds. One day at a time. One promise kept at a time.",
    "That rebuild started with one decision. Then one habit. Then one honest page in a book like this.",
    "This journal is not magic. It will not change your life. You will. The journal is just the page that holds the work while you do it.",
    "Twelve weeks. Three phases. One man at the end of it who looks at himself in the mirror and is not ashamed of what he sees.",
    "Pick up the pen.",
  ],
  signoff: "Ben Lowe",
  role: "Founder, The New Age Man",
} as const;

export const WHO_THIS_IS_FOR = {
  intro:
    "This journal is for the man who is ready to stop performing and start changing.",
  forYou: {
    heading: "THIS IS FOR YOU IF:",
    bullets: [
      "You are tired of being the man who says one thing and does another.",
      "You are ready to look at yourself honestly, even when it stings.",
      "You want to be a better father, a better partner, a better leader, a better man.",
      "You have tried the gym, the books, the podcasts, the apps, and you are still standing in the same place.",
      "You are willing to do the small unglamorous work every day for ninety days.",
    ],
  },
  notForYou: {
    heading: "THIS IS NOT FOR YOU IF:",
    bullets: [
      "You want a quick fix or a hack.",
      "You are looking for someone else to blame.",
      "You want to feel good more than you want to be good.",
      "You are not willing to be honest on the page.",
    ],
  },
  closer: "If you are still reading, you are in the right place. Turn the page.",
} as const;

export const HOW_TO_USE = {
  intro:
    "This journal runs for twelve weeks. Three phases of four weeks each.",
  phases: [
    {
      heading: "PHASE 1 — SELF-DISCOVERY (WEEKS 1 TO 4)",
      body: "Strip back the noise. See what is actually there. Honest assessment of where your life, your leadership, your relationships, and your self-respect actually sit. No spin. Truth on the page.",
    },
    {
      heading: "PHASE 2 — REBUILD (WEEKS 5 TO 8)",
      body: "Daily discipline. Standards. Non-negotiables. Repairing the foundation. Showing up when you do not feel like it. Building the man underneath the habits.",
    },
    {
      heading: "PHASE 3 — SELF-LEADERSHIP (WEEKS 9 TO 12)",
      body: "Leading yourself. Leading your relationships. Leading your work. Leading your family. Becoming the man others can rely on because you can rely on yourself.",
    },
  ],
  structure: {
    heading: "THE STRUCTURE",
    bullets: [
      "Every day has a morning page and an evening page.",
      "Every week starts with a focus page and ends with a Sunday review.",
      "Every phase opens with deeper work and closes with a reset.",
      "There is a habit grid for tracking your daily non-negotiables across every four-week phase.",
    ],
  },
  rules: {
    heading: "THE RULES",
    bullets: [
      "Write every day. Even on the days you do not want to. Especially on the days you do not want to.",
      "Tell the truth. This journal is for you. Lying on the page is just lying to yourself in a more permanent format.",
      "If you miss a day, do not start over. Pick it up from today. Read the reset page when you need it.",
      "If you finish a phase, do not skip the reset. The work between the phases is where the change happens.",
    ],
  },
  closer: "This is the work. Start now.",
} as const;

export const LINE_IN_THE_SAND = {
  preTitle: "PHASE 1 · DEEP WORK",
  title: "The Line in the Sand",
  intro: [
    "Every man who has ever changed his life had a moment where he drew a line.",
    "Before the line and after the line. The man you were, and the man you decided to become.",
    "This is that line.",
    "Write it. Sign it. Date it. Read it on the days you want to quit.",
  ],
  prompts: [
    {
      key: "no_longer" as const,
      label: "FROM THIS DAY FORWARD, I WILL NO LONGER…",
    },
    {
      key: "i_will" as const,
      label: "FROM THIS DAY FORWARD, I WILL…",
    },
    {
      key: "leaving_behind" as const,
      label: "THE MAN I AM LEAVING BEHIND",
    },
    {
      key: "becoming" as const,
      label: "THE MAN I AM BECOMING",
    },
  ],
} as const;

export const WHO_IM_BECOMING = {
  preTitle: "PHASE 1 · DEEP WORK",
  title: "Who I Am Becoming",
  intro: [
    "Identity comes before behaviour.",
    "Most men try to change what they do without ever changing who they believe they are. That is why the changes never stick. You will always behave like the man you believe you are.",
    "This page is where you write the man you are becoming, in present tense, as if it is already true. Not who you wish you were. Not who you should be. Who you are choosing to become, starting now.",
    "Read this page every morning of the next ninety days.",
  ],
  prompts: [
    {
      key: "i_am_a_man_who" as const,
      label: "I AM A MAN WHO…",
      placeholder: "Write the man you are becoming, in present tense.",
    },
    {
      key: "word_means" as const,
      label: "MY WORD MEANS",
      placeholder: "When I say I will do something…",
    },
    {
      key: "presence_feels_like" as const,
      label: "MY PRESENCE FEELS LIKE",
      placeholder: "When I walk into a room…",
    },
    {
      key: "family_knows_me_as" as const,
      label: "MY FAMILY KNOWS ME AS",
      placeholder: "The man at the head of my own table is…",
    },
  ],
} as const;

/** Page keys persisted in front_matter_entries.page_key */
export const PAGE_KEYS = {
  LINE_IN_SAND: "line_in_sand",
  WHO_BECOMING: "who_im_becoming",
  STANDARDS: "standards",
  BROTHERHOOD: "brotherhood",
  LEGACY: "legacy",
} as const;

export type LineInSandContent = {
  no_longer?: string;
  i_will?: string;
  leaving_behind?: string;
  becoming?: string;
  signed_name?: string;
  signed_date?: string;
};

export type WhoBecomingContent = {
  i_am_a_man_who?: string;
  word_means?: string;
  presence_feels_like?: string;
  family_knows_me_as?: string;
};

/** Linear ordering of front-matter pages for "next" navigation. */
export const FRONT_MATTER_ORDER = [
  { slug: "letter", title: "Letter to the man holding this", kind: "read" as const },
  { slug: "who-this-is-for", title: "Who this is for", kind: "read" as const },
  { slug: "how-to-use", title: "How to use this journal", kind: "read" as const },
  { slug: "line-in-sand", title: "The Line in the Sand", kind: "sign" as const },
  { slug: "who-becoming", title: "Who I am becoming", kind: "sign" as const },
] as const;

export type FrontMatterSlug =
  (typeof FRONT_MATTER_ORDER)[number]["slug"];

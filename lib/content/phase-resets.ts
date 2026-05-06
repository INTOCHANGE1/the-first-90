/**
 * End-of-phase reset / reflection prompts.
 * Source: _handover/THE_FIRST_90_New_Age_Man_Journal.docx
 *
 * One row per (user, phase) in `phase_resets`. Phase 3's reset is also
 * surfaced via /journal/phase/3/reflection per the SPEC route table.
 */

export const PHASE_1_RESET = {
  preTitle: "END OF PHASE 1",
  title: "Self-Discovery reset",
  intro: [
    "Twenty-eight days ago you opened this journal. You said you were ready.",
    "This page is where you find out if that was true.",
    "Do not skip it. The reset is where the change actually happens.",
  ],
  prompts: [
    {
      key: "learned_about_self" as const,
      label:
        "What did I learn about myself in the last 28 days that I did not know before?",
    },
    { key: "led_well" as const, label: "Where did I lead well?" },
    {
      key: "leaked" as const,
      label: "Where did I leak, avoid, or break my word?",
    },
    {
      key: "patterns" as const,
      label: "What patterns am I starting to see?",
    },
    {
      key: "kept_non_negotiables" as const,
      label:
        "Did I keep my five non-negotiables? Honestly. Look at the grid.",
    },
    {
      key: "truth_avoided" as const,
      label:
        "What is the truth I have been avoiding that this phase forced me to face?",
    },
  ],
  closer:
    "Awareness without action is just educated suffering. Phase 2 is where you build.",
} as const;

export const PHASE_2_RESET = {
  preTitle: "END OF PHASE 2",
  title: "Rebuild reset",
  intro: [
    "Eight weeks. Two-thirds of the way.",
    "This is the part of the journey where most men start to feel different. Cleaner. Stronger. More like themselves. It is also the part where most men get cocky and slip. Read this honestly.",
  ],
  prompts: [
    {
      key: "different_now" as const,
      label: "What is different in me now compared to day one?",
    },
    {
      key: "people_say" as const,
      label: "What do the people closest to me say about me right now?",
    },
    {
      key: "still_hiding" as const,
      label: "Where am I still hiding?",
    },
    {
      key: "most_proud" as const,
      label: "What am I most proud of from these eight weeks?",
    },
    {
      key: "kept_standards" as const,
      label: "Did I keep my standards? Look at the standards page.",
    },
    {
      key: "phase_3_finish" as const,
      label:
        "What does Phase 3 — Self-Leadership need to look like to finish this strong?",
    },
  ],
  closer: "Phase 1 was honesty. Phase 2 was discipline. Phase 3 is leadership.",
} as const;

export const PHASE_3_RESET = {
  preTitle: "END OF PHASE 3",
  title: "Self-Leadership reflection",
  intro: [
    "Twelve weeks. Ninety days. The first 90.",
    "Look at where you are. Look at where you started.",
  ],
  prompts: [
    {
      key: "biggest_difference" as const,
      label:
        "What is the biggest difference between the man who picked up this journal and the man holding it now?",
    },
    {
      key: "led_strongest" as const,
      label: "Where did I lead myself the strongest?",
    },
    {
      key: "still_building" as const,
      label: "Where am I still building?",
    },
    {
      key: "most_proud" as const,
      label: "What am I most proud of?",
    },
    {
      key: "what_comes_next" as const,
      label: "What is the work that comes next?",
    },
  ],
  closer: "The journal closes. The work doesn't.",
} as const;

export type PhaseResetReflections = Partial<Record<string, string>>;

export const PHASE_RESETS = {
  1: PHASE_1_RESET,
  2: PHASE_2_RESET,
  3: PHASE_3_RESET,
} as const;

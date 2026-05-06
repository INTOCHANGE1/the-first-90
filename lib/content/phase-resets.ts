/**
 * End-of-phase reset prompts.
 * Source: _handover/THE_FIRST_90_New_Age_Man_Journal.docx
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
    "Awareness was Phase 1. Action is Phase 2 — and now Phase 2 is over.",
    "Quiet work is the only work that actually changes a man.",
  ],
  prompts: [
    {
      key: "what_stays" as const,
      label: "What stays from Phase 2? What worked?",
    },
    {
      key: "what_goes" as const,
      label: "What goes? What was performance, not progress?",
    },
    {
      key: "phase_3_focus" as const,
      label: "What is new for Phase 3? What am I leading into next?",
    },
    {
      key: "becoming" as const,
      label: "What is the man I am becoming building this final phase?",
    },
  ],
  closer: "Phase 3 is where you stop training and start leading.",
} as const;

export const PHASE_3_RESET = {
  preTitle: "END OF PHASE 3",
  title: "Self-Leadership reflection",
  intro: [
    "Twelve weeks. Three phases. The man at the end of this is not the man who opened the book.",
    "Reflect honestly before you turn to the final review.",
  ],
  prompts: [
    {
      key: "phase_3_lessons" as const,
      label: "What did Phase 3 teach me about leading myself?",
    },
    {
      key: "showed_up" as const,
      label: "Where did I show up as the man I said I was becoming?",
    },
    {
      key: "still_leaking" as const,
      label: "Where am I still leaking, and what will I do about it?",
    },
    {
      key: "next_chapter" as const,
      label: "What is the next chapter for this man?",
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

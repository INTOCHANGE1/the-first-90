/**
 * The reset page — what a man reads when he fell off.
 * Source: _handover/THE_FIRST_90_New_Age_Man_Journal.docx
 *
 * Tone: handup, not guilt-trip. Never blames. Never asks for explanations.
 */

export const RESET = {
  preTitle: "RESET",
  title: "If you are reading this, you fell off.",
  subtitle: "Good.",
  body: [
    "You are still here. You came back. That matters more than anything you missed.",
    "Every man who has ever changed his life fell off at some point. The men who became something fell off and came back. The men who did not just stayed off.",
    "You are not starting over. You are picking up. There is a difference.",
    "Use these prompts to reset. Then turn back to the page you stopped on, and keep going.",
  ],
  prompts: [
    {
      key: "what_happened" as const,
      label: "What did I miss, and how long was I off?",
    },
    {
      key: "drop_or_simplify" as const,
      label:
        "What was actually going on that pulled me away? What do I need to drop or simplify so I can keep going?",
    },
    {
      key: "one_thing_today" as const,
      label:
        "What is the one thing I will do today, before I go to bed, to pick this back up?",
    },
  ],
  pullQuote: "Falling off does not end the work. Staying off does.",
} as const;

export type ResetReflections = Partial<
  Record<(typeof RESET.prompts)[number]["key"], string>
>;

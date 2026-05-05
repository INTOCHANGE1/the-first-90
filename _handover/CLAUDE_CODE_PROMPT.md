# OPENING PROMPT FOR CLAUDE CODE

This is the message you paste into Claude Code in your project folder on day one.

Before you paste it, copy these files into your project folder so Claude Code can read them:

1. `01_SPEC.md` (rename to `SPEC.md`)
2. `02_BUILD_ORDER.md` (rename to `BUILD_ORDER.md`)
3. `03_SCHEMA.sql` (keep filename)
4. `04_DESIGN_SYSTEM.md` (rename to `DESIGN_SYSTEM.md`)
5. `THE_FIRST_90_New_Age_Man_Journal.docx` (the master Word doc — Claude Code will read content from this)

Place them in a folder called `_handover/` at the project root so they don't conflict with the codebase.

---

## THE PROMPT

Copy everything below this line and paste it as your first message to Claude Code:

---

I'm building THE FIRST 90, a 12-week men's transformation journal app for THE NEW AGE MAN brand. I'm Ben Lowe, the founder, and you're going to help me build this from scratch.

## What you have to work with

In the `_handover/` folder you'll find:
- **SPEC.md** — the full product specification. This is the source of truth for every decision.
- **BUILD_ORDER.md** — the sequenced phases of the build. Follow them in order.
- **03_SCHEMA.sql** — the complete database schema, ready to run in Supabase.
- **DESIGN_SYSTEM.md** — the Blood palette design system (colours, typography, components).
- **THE_FIRST_90_New_Age_Man_Journal.docx** — the master content document. Use this as the canonical source for every piece of journal text. Do not paraphrase. The voice matters.

## Read these first

Before writing any code, read SPEC.md and BUILD_ORDER.md in full. Then skim DESIGN_SYSTEM.md so you have the visual language in mind. Then check the Word doc structure so you know what content needs to flow into the app.

## How we'll work together

We'll build in the phases laid out in BUILD_ORDER.md. Don't jump ahead. At the end of each phase, we'll test what you built before moving on.

For each phase:
1. Tell me what you're about to build and what files you'll create or edit
2. Build it
3. Tell me what to test and how to verify it works
4. Wait for me to confirm before moving on

## Tone and code style

- TypeScript strict mode. No `any` unless absolutely necessary.
- Tailwind for styling. No CSS modules.
- Server components by default. Client components only when needed (forms, autosave, interactive elements).
- No premature abstraction. One file per concept until duplication shows up.
- Comments are for the *why*, not the *what*. The code should be self-explanatory.
- Match the design system exactly. The Blood palette is non-negotiable.

## What we're starting with

Phase 0 of BUILD_ORDER.md — project setup. Walk me through:
1. Initialising the Next.js project
2. Installing dependencies
3. Setting up the Supabase client
4. Configuring Tailwind with the Blood palette
5. Creating a clean `app/page.tsx` that just renders "The First 90" in the right typography to prove the setup works

Once that's running locally and looking right, we'll move to Phase 1 (database).

## A few important constraints

- **The founder cannot see client writing.** This is a brand promise. Build the app so this is enforced at the database level (RLS) and so I'd have to deliberately break it to read someone's journal.
- **Mobile is primary.** Build mobile-first. Test mobile every phase.
- **Never patronise the user.** The microcopy has voice. Read DESIGN_SYSTEM.md section 4 ("Tone in microcopy") before writing any user-facing string.
- **No emoji anywhere in the UI.** Ever.
- **No em dashes in code or content.**

When you're ready to start, tell me what you've read and what you're about to do for Phase 0.

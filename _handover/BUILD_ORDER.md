# THE FIRST 90 — BUILD ORDER

This document tells Claude Code the exact order to build the app. Do not skip ahead. Each phase ends with a working, testable state before moving on.

---

## PHASE 0 — PROJECT SETUP

**Goal:** A fresh Next.js 14 project on the local machine, ready to write features.

1. Initialise a Next.js 14 TypeScript project with App Router and Tailwind:
   ```
   npx create-next-app@latest first90 --typescript --tailwind --app --eslint
   ```
2. Install core dependencies:
   ```
   @supabase/supabase-js @supabase/ssr lucide-react react-hook-form zod @hookform/resolvers zustand
   ```
3. Add Inter and Fraunces fonts via `next/font/google` in `app/layout.tsx`.
4. Configure Tailwind theme with the Blood palette tokens (see `02_DESIGN_SYSTEM.md`).
5. Create a Supabase project at supabase.com.
6. Add Google as an auth provider in Supabase (instructions in `04_LAUNCH_CHECKLIST.md`).
7. Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
8. Set up the Supabase client in `lib/supabase/`.
9. Verify: `npm run dev` shows the default Next.js page on `http://localhost:3000`.

**Acceptance:** Project runs locally, Tailwind works, Supabase env vars load.

---

## PHASE 1 — DATABASE FOUNDATION

**Goal:** All tables exist in Supabase with Row Level Security enforced.

1. Open Supabase SQL editor.
2. Run the schema migration in `03_SCHEMA.sql` (one shot, all tables).
3. Verify RLS is enabled on every table.
4. Insert 5 test invite codes manually:
   ```sql
   insert into invite_codes (code, program_source, is_active)
   values
     ('NAM-TEST01', 'entry_point', true),
     ('NAM-TEST02', 'entry_point', true),
     ('NAM-TEST03', 'brotherhood', true),
     ('NAM-TEST04', 'retreat', true),
     ('NAM-TEST05', 'entry_point', true);
   ```
5. Generate TypeScript types from the schema:
   ```
   npx supabase gen types typescript --project-id [your-id] > lib/supabase/types.ts
   ```

**Acceptance:** All tables visible in Supabase dashboard with RLS enabled. Test codes exist.

---

## PHASE 2 — AUTH FLOW

**Goal:** A user can enter an invite code, sign in with Google, and land on a placeholder dashboard.

1. Build `/login` page with Google sign-in button.
2. Build `/signup` page that:
   - Captures invite code first
   - Validates code against DB (server action)
   - On valid code, shows Google sign-in
   - On successful Google auth, creates `profiles` row, marks code as used
3. Build the auth middleware (`middleware.ts`) that:
   - Redirects unauthenticated users from `/journal/*` to `/login`
   - Redirects authenticated users from `/login` and `/signup` to `/journal`
4. Build `/journal` placeholder page that just shows "Welcome, [name]" — proves the auth pipe works.
5. Build `/settings` with sign-out button.

**Acceptance:** New user can use a test invite code, sign in with Google, see their name on the dashboard, sign out.

---

## PHASE 3 — DESIGN SYSTEM & SHARED COMPONENTS

**Goal:** A library of reusable, on-brand components ready to drop into pages.

Build these in `components/ui/`:
- `Button` (primary, secondary variants)
- `Input`
- `Textarea` (auto-resize)
- `RatingPills` (1-5 and 1-10 variants)
- `Checkbox`
- `Card` (default and active variants)
- `PageShell` (wraps every journal page — header, footer, max-width container)
- `SectionHeading` (h1, h2, h3 components matching design system)
- `PullQuote` (the editorial quote style)
- `SaveIndicator` (the "Saved · 9:14 AM" badge)
- `ProgressBar` (for phase progress)

Build these in `components/journal/`:
- `WheelOfLife` (interactive SVG component)
- `HabitGrid`
- `PromptBlock` (a labelled writing area with autosave)
- `DailyRatingsRow` (the 4-up rating tiles)

Set up the `useAutosave` hook in `lib/hooks/`.

Build a `/dev/components` page (gated to admins only, or just rendered behind a feature flag) that shows every component. This is the visual regression check.

**Acceptance:** Every component renders cleanly, autosave works on a test prompt block.

---

## PHASE 4 — ONBOARDING + FRONT MATTER

**Goal:** A new user can complete onboarding and the front matter pages.

1. Build the 4-step onboarding flow at `/onboarding`.
2. Build the "Letter to the man holding this" page at `/journal/front-matter/letter` — read-only, scroll to bottom to enable continue.
3. Build "Who this is for" — read-only.
4. Build "How to use this journal" — read-only.
5. Build "Line in the Sand" — form view + completed printed view + signature capture.
6. Build "Who I'm Becoming" — form view + printed view.
7. Build a front-matter index page at `/journal/front-matter` showing progress.
8. Wire up the dashboard to show "Continue front matter" if any front matter pages are incomplete.

**Acceptance:** A new user can go from sign-up through to the start of phase 1, with all front matter saved.

---

## PHASE 5 — PHASE 1 ASSESSMENT PAGES

**Goal:** All Phase 1 deep-work pages are functional.

Build in this order:
1. Wheel of Life (interactive SVG, ratings, autosave)
2. Wheel of Life debrief (form)
3. The Gap intro (read-only)
4. The Gap — Have page
5. The Gap — Be page
6. The Gap — Do page
7. Four Pillars Audit
8. Integrity Inventory (Where I have broken my word)
9. Man Comparison (two-column form)
10. Perfect Morning
11. Perfect Night
12. Phase 1 Habit Grid setup (just the habit names, ticking happens daily)

Build the phase 1 hub page at `/journal/phase/1` that lists all of these with completion status.

**Acceptance:** A user can complete every phase 1 deep-work page, and progress is visible from the hub.

---

## PHASE 6 — DAILY + WEEKLY ENGINE

**Goal:** The 84-day daily flow is working end-to-end.

This is the heart of the app. Take the time to get it right.

1. Build day-numbering utility (`lib/utils/dayNumber.ts`) — given a user's `started_at` and timezone, return today's day number 1-84.
2. Build `/journal/day/[n]` route with morning + evening sections on the same page.
3. Build `/journal/week/[n]` route with weekly focus + Sunday review.
4. Build the dashboard's "today's CTA" logic that picks the right next action based on completion state.
5. Wire up the habit grid quick-tick on the dashboard so today's column is editable from there.
6. Add the auto-route logic: if it's Sunday and the Sunday review isn't done, after evening completion route to it.
7. Build the phase reset page at `/journal/phase/[n]/reset`.
8. Build the routing guard: if user reaches the end of phase 1 (day 28) without completing the Phase 1 reset, gate phase 2 entry on it.

**Acceptance:** A user can be on day 1 or day 50 or day 84, the dashboard shows the right next action, autosave works on every input, and phase transitions are correctly gated.

---

## PHASE 7 — PHASE 2 + PHASE 3 SETUP PAGES

**Goal:** The standards, brotherhood, leadership review, and legacy pages all work.

1. Phase 2 reset page (intro to phase 2)
2. Standards page (form + printed view + signature)
3. Brotherhood page (form + printed view, three brother slots)
4. Phase 2 habit grid setup
5. Phase 3 reset page (intro to phase 3)
6. Four Pillars Leadership Review
7. Legacy page (form + printed view)
8. Phase 3 habit grid setup
9. End of Phase 3 reflection

**Acceptance:** Phase 2 and 3 transitions work cleanly, all pages save, all flows complete.

---

## PHASE 8 — BACK MATTER

**Goal:** The closing pages work, including the post-90 wheel comparison.

1. 90-day Final Review
2. Post-90 Wheel of Life
3. Post-90 Wheel debrief
4. Side-by-side wheel comparison view (Phase 1 wheel + Post-90 wheel)
5. Free-form reflection pages (list + create + edit)
6. "The Next Step" page (static content with links to NAM ecosystem)
7. Final word from Ben (read-only)

**Acceptance:** A user on day 90 can complete the journal, see their before/after wheel, and read the final word.

---

## PHASE 9 — RESET FLOW + EDGE CASES

**Goal:** The fall-off-and-return experience is polished.

1. Build `/reset` page with the three reset prompts.
2. Wire up the dashboard logic to surface the reset page when 3+ days are missed.
3. Add "Fell off? Read this." link in the dashboard footer always.
4. Test: simulate missing 5 days and verify the dashboard surfaces the reset.
5. Handle the case where a user signs in for the first time but their code was already used (rare edge).
6. Handle the 404 page in brand voice.
7. Handle the "session expired" state.

**Acceptance:** Falling off and coming back is smooth, never blocks progress, never shames.

---

## PHASE 10 — POLISH + LAUNCH

**Goal:** Production-ready, deployed, real clients can use it.

1. Add loading states everywhere (skeletons, never spinners with no context).
2. Add error boundaries.
3. Run the launch checklist (`04_LAUNCH_CHECKLIST.md`).
4. Deploy to Vercel.
5. Set up the production Supabase project (separate from dev).
6. Generate first batch of real invite codes for soft launch.
7. Soft launch to 3-5 trusted clients.
8. Iterate based on feedback.

**Acceptance:** First real client completes day 1 in production.

---

## NOTES ON WORKING WITH CLAUDE CODE

- **Build incrementally.** Don't try to build phase 5 before phase 4 is solid. Each phase ends with something testable.
- **Test on mobile from day one.** Most clients will use this on a phone. Open the dev URL on your phone via your local network and walk through the flow regularly.
- **Use real journal content from the Word doc.** Do not paraphrase. The voice matters. Copy the exact language from `THE_FIRST_90_New_Age_Man_Journal.docx` into the content files.
- **Commit often.** Use git from day one. Each phase = at least one commit, ideally several.
- **Don't optimise prematurely.** Get it working first. Polish in phase 10.

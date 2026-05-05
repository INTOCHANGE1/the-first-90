# THE FIRST 90 — CLAUDE CODE HANDOVER PACKAGE

You're holding everything Claude Code needs to build the digital version of THE FIRST 90.

---

## WHAT YOU HAVE

| File | What it is | When to use it |
|------|-----------|----------------|
| `00_README.md` | This file | Start here |
| `01_SPEC.md` | Full product specification | Reference throughout build |
| `02_BUILD_ORDER.md` | Sequenced build phases | Follow in order |
| `03_SCHEMA.sql` | Database schema | Run in Supabase |
| `04_DESIGN_SYSTEM.md` | Blood palette and components | Visual law |
| `05_LAUNCH_CHECKLIST.md` | Setup outside Claude Code | Work through before / during build |
| `06_CLAUDE_CODE_PROMPT.md` | Opening prompt for Claude Code | Paste day one |

Plus the Word doc: `THE_FIRST_90_New_Age_Man_Journal.docx` (your master content).

---

## DO THIS IN ORDER

### Step 1 — Read this folder
Skim every file. You don't need to absorb every detail. You need to know what's in the package.

Time: 30 minutes.

### Step 2 — Work through the launch checklist (file 05)
Set up your accounts, get your domain ready, configure Google OAuth. Most of this is one-time setup that happens outside Claude Code.

Time: 2-3 hours over a couple of evenings, depending on how DNS and OAuth go.

### Step 3 — Open Claude Code
On your computer, install Claude Code if you haven't already. Make a new folder for the project (e.g. `~/Projects/the-first-90`). Copy this entire handover folder into a `_handover/` subfolder inside the project folder. Copy the Word doc in there too.

Open Claude Code in your project folder.

### Step 4 — Paste the opening prompt (file 06)
Copy everything below the "THE PROMPT" line in file 06 and paste it as your first message to Claude Code. It will read the spec, the build order, the design system, and start with Phase 0.

### Step 5 — Build phase by phase
Work through the phases in 02_BUILD_ORDER.md. Don't jump ahead. After each phase, test what was built before moving on.

Realistic timeline:
- If you're focused full-time: 1-2 weeks to a working v1
- If you're building in evenings around your business: 4-6 weeks
- If you're slow and want it polished: 8-10 weeks

### Step 6 — Soft launch
File 05 has a soft launch plan. 3-5 trusted clients. Real feedback. Iterate.

### Step 7 — Open the gates
Once it's stable, generate codes and start handing them to NAM clients as the entry asset.

---

## IF YOU GET STUCK

The most common stuck points:
- **Google OAuth fiddling.** It's the most fiddly part. Section 4 of file 05 walks through it step by step.
- **DNS propagation feels broken.** Wait 15 minutes. It usually isn't broken.
- **Supabase RLS errors.** Check `auth.uid()` is what you expect. If you're testing with the service role key, RLS is bypassed and you'll see different behaviour than a real user.
- **You want to change something architecturally mid-build.** Don't, unless you've shipped v1 first. Document the change idea in a `IDEAS.md` file and come back to it.

You can also come back to me (Claude in chat) anytime during the build to:
- Pressure-test architecture decisions
- Refine copy
- Add new pages or sections
- Generate new content for the journal
- Plan v2 features

The Word doc and this handover package together represent maybe 50 hours of strategy and writing work, condensed. Use them.

---

## ONE FINAL NOTE

This app is the entry point to the rest of the NAM ecosystem. The man who finishes 90 days here is the man who's ready for Brotherhood, retreat, or whatever comes next. Build it like that's the truth.

The bar isn't "a journal app." The bar is the first asset he holds that signals to him: this is different. This is real. The man behind this knows what he's doing.

That's what we're building.

— Ben

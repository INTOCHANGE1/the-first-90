# THE FIRST 90 — DESIGN SYSTEM

The Blood palette. Black, bone, deep red. This document is the visual law of the app.

---

## 1. COLOUR TOKENS

Add these to `tailwind.config.ts` under `theme.extend.colors`:

```typescript
colors: {
  bone: {
    DEFAULT: '#F5F1E8',
    warm: '#EDE6D6',
    faint: '#FAF7EE',
  },
  ink: {
    DEFAULT: '#0E0E0E',
    soft: '#1A1A1A',
    deep: '#000000',
  },
  blood: {
    DEFAULT: '#8B1A1A',
    deep: '#6B1212',
    faint: '#F4E4E4',
  },
  steel: '#4A4A4A',
  ash: '#8B8680',
  line: 'rgba(14, 14, 14, 0.12)',
  'line-strong': 'rgba(14, 14, 14, 0.25)',
}
```

### Usage rules
- **Bone** is the primary background of the app. Almost every page sits on bone.
- **Bone-warm** is the card or input surface — slightly darker than bone, just enough to define a surface.
- **Ink** is the primary text colour and the dark surface for active/hero states (today's CTA card, signed signature blocks).
- **Blood** is reserved for ONE thing per screen: the primary action, the active state, the streak count. Never decorative. Never used twice on the same screen except where state requires it (e.g. all checked checkboxes in a habit grid).
- **Blood-faint** is for tinted backgrounds when something needs to feel weighted. Use sparingly. Maybe one card per page.
- **Steel** is secondary text on bone (helper text, labels).
- **Ash** is tertiary text (timestamps, save indicators, micro labels).

---

## 2. TYPOGRAPHY

### Fonts
Load via `next/font/google`:
```typescript
import { Inter, Fraunces } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
});
```

### Scale
| Token | Mobile | Desktop | Weight | Use |
|-------|--------|---------|--------|-----|
| h1 | 28px | 32px | 500 | Page titles |
| h2 | 22px | 24px | 500 | Section titles |
| h3 | 14px | 14px | 500 | ALL CAPS, letter-spacing 0.08em — labels and category headers |
| body | 16px | 16px | 400 | Default body, line-height 1.7 |
| body-lg | 18px | 18px | 400 | Hero copy on phase openers |
| small | 13px | 13px | 400 | Helper text |
| micro | 11px | 11px | 500 | ALL CAPS, letter-spacing 0.12em — tiny labels and breadcrumbs |

### Editorial moments
Use Fraunces italic for:
- Pull quotes
- Ben's letter
- Phase opener tag-lines
- The Final Word page

Everywhere else: Inter.

### Rules
- Two weights only: 400 and 500. Never 600 or 700.
- Never use Title Case in paragraph copy.
- ALL CAPS only with letter-spacing applied — never uppercase normal-letterspacing.
- No bold mid-paragraph. Use a different element (label, callout, pull quote).

---

## 3. SPACING

Use a 4px base. Tailwind's default spacing scale is fine.

### Vertical rhythm
- Between major sections on a page: 32px (Tailwind: my-8)
- Between a heading and its content: 12px (my-3)
- Between paragraphs: 16px (my-4)
- Between a prompt and its writing area: 8px (my-2)
- Between writing areas in a list: 16px (gap-4)

### Card padding
- Default: 24px (p-6)
- Compact (rating tiles, habit grid cells): 12px (p-3)

### Page padding
- Mobile: 16px horizontal (px-4)
- Desktop: 24px horizontal (px-6)
- Always max-width 720px centred

---

## 4. COMPONENTS

### Button — Primary
```tsx
<button className="
  bg-blood text-bone
  px-6 py-3
  text-xs font-medium uppercase tracking-[0.12em]
  rounded
  transition-colors
  hover:bg-blood-deep
  active:scale-[0.98]
  disabled:opacity-40 disabled:cursor-not-allowed
">
  Save & continue
</button>
```

### Button — Secondary
```tsx
<button className="
  bg-transparent text-ink border border-ink
  px-6 py-3
  text-xs font-medium uppercase tracking-[0.12em]
  rounded
  transition-colors
  hover:bg-ink hover:text-bone
">
  Edit
</button>
```

### Input
```tsx
<input className="
  w-full
  bg-bone-warm
  border border-line
  px-4 py-3
  text-base text-ink
  rounded
  focus:outline-none focus:ring-2 focus:ring-blood focus:ring-offset-2 focus:ring-offset-bone
  transition-shadow
" />
```

### Textarea (auto-resize)
Same styling as input, with `min-height: 120px` and a JS auto-resize hook on input.

### Rating Pills
```tsx
<div className="flex gap-2">
  {[1, 2, 3, 4, 5].map(n => (
    <button
      key={n}
      onClick={() => setRating(n)}
      className={cn(
        "flex-1 py-3 text-sm font-medium rounded transition-colors",
        rating === n
          ? "bg-ink text-bone"
          : "bg-bone-warm text-ash hover:bg-line"
      )}
    >
      {n}
    </button>
  ))}
</div>
```

### Card — Default
```tsx
<div className="
  bg-bone-warm
  border border-line
  rounded-lg
  p-6
">
  {/* content */}
</div>
```

### Card — Active (today's CTA)
```tsx
<div className="
  bg-ink text-bone
  border-l-4 border-blood
  rounded-lg
  p-6
  relative
">
  {/* content */}
</div>
```

### Checkbox
```tsx
<button
  onClick={toggle}
  className={cn(
    "w-6 h-6 rounded-sm border-2 flex items-center justify-center transition-colors",
    checked
      ? "bg-blood border-blood"
      : "bg-transparent border-ash hover:border-ink"
  )}
>
  {checked && <Check className="w-4 h-4 text-bone" />}
</button>
```

### Save Indicator
```tsx
<span className="text-xs text-ash uppercase tracking-[0.12em]">
  Saved · 9:14 AM
</span>
```

### Page Shell
```tsx
<div className="min-h-screen bg-bone">
  <Header />
  <main className="max-w-[720px] mx-auto px-4 md:px-6 py-8 md:py-12">
    {children}
  </main>
  <Footer />
</div>
```

### Page Header (sticky on mobile)
```tsx
<header className="
  sticky top-0 z-10
  bg-bone/95 backdrop-blur
  border-b border-line
  px-4 md:px-6 py-3
">
  <div className="max-w-[720px] mx-auto flex justify-between items-center">
    <div className="flex items-baseline gap-3">
      <span className="text-sm font-medium tracking-wide">THE FIRST 90</span>
      <span className="text-xs text-ash uppercase tracking-[0.12em]">DAY {n} / 90</span>
    </div>
    <span className="text-xs text-blood font-medium uppercase tracking-[0.12em]">PHASE {p}</span>
  </div>
</header>
```

---

## 5. LAYOUT PATTERNS

### A daily morning page
- Page header with day count and phase
- h1: "Monday morning" (or whatever day)
- 4-up rating row (Mindset, Sleep, Energy, Mood)
- Mantra prompt (single line input with blood left-border accent on the input)
- "Three things I'm grateful for today" — 3 numbered inputs
- "Three non-negotiables for today" — 3 checkboxes with text inputs
- "One important task I will get done" — single textarea
- "One person I will reach out to" — single textarea
- "One thing I will do to challenge myself" — single textarea
- "One situation that could cause stress and how I'll lead through it" — single textarea
- Sticky bottom bar with "Save & continue" button
- Save indicator top-right of the page below the header

### A reflection page (eg integrity inventory)
- Page header
- h1
- Body intro paragraph
- Repeating section: h2 prompt + textarea
- Reflection prompt at the end
- Save & continue

### A signed page (eg line in the sand)
**Form view:**
- Two main textareas side by side on desktop, stacked mobile: "I will no longer..." / "I will..."
- Two-column signature section: signed name input + date input
- Big "Sign and lock" button that:
  - Validates all fields are filled
  - Sets `signed_at` to now
  - Switches to printed view

**Printed view:**
- Same content, rendered as if printed on bone paper
- "Edit" button in top right
- Reads as a permanent declaration

---

## 6. ICONOGRAPHY

Use Lucide React. Icons should be 16px or 20px, never larger except for hero moments (24px max in normal pages).

Icons used in the app:
- `Check` — completed states, ticked habits
- `ChevronRight` — navigation arrows
- `Circle` — empty / unfilled states
- `Pen` — edit affordance
- `Lock` — signed pages
- `Flame` — streak indicator (use sparingly; consider just text "12 day streak")
- `LogOut` — sign out
- `Settings` — settings link

Never use emoji in the UI. Ever.

---

## 7. ANIMATION

Subtle, never decorative.

- Button hover: 150ms colour transition
- Checkbox toggle: 100ms scale + colour
- Wheel segment fill: 300ms ease-out from centre to chosen ring
- Page transitions: none. Snap to new page. The journal isn't a movie.
- Save indicator pulse: 200ms opacity fade when status changes from 'saving' to 'saved'

---

## 8. RESPONSIVENESS

Mobile is the primary form factor. Build mobile-first. Then enhance for desktop at 768px breakpoint.

### Mobile-specific
- Sticky header with day count
- Sticky bottom action bar on writing pages
- Habit grid scrolls horizontally with sticky habit-name column
- Wheel of life is full-width minus padding
- Back button visible at top-left on every non-dashboard page

### Desktop
- Max content width 720px, centred
- Header expands to show profile menu
- Wheel comparison side-by-side instead of stacked

---

## 9. EXAMPLE: DAILY MORNING PAGE LAYOUT

```tsx
<PageShell>
  <PageHeader day={23} phase={1} />

  <main>
    <div className="mb-8">
      <p className="text-xs text-ash uppercase tracking-[0.12em] mb-2">MONDAY MORNING</p>
      <h1 className="text-2xl md:text-3xl font-medium">How are you starting today?</h1>
    </div>

    <DailyRatingsRow values={ratings} onChange={setRatings} />

    <PromptBlock
      label="My mantra to get me through today"
      value={mantra}
      onChange={setMantra}
      bloodAccent
    />

    <NumberedPrompts
      label="Three things I'm grateful for today"
      values={gratitude}
      onChange={setGratitude}
      count={3}
    />

    <NonNegotiablesList
      values={nonNegotiables}
      onChange={setNonNegotiables}
    />

    <PromptBlock
      label="One important task I will get done today"
      value={task}
      onChange={setTask}
    />

    {/* ... rest of prompts ... */}
  </main>

  <StickyActionBar>
    <SaveIndicator status={saveStatus} />
    <Button onClick={complete}>Finish morning →</Button>
  </StickyActionBar>
</PageShell>
```

# Design Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Transform Kx8ble from a chess.com-skinned shadcn template into a
distinctive, professional tournament management tool with its own visual
identity.

**Architecture:** Five sequential design tasks, each building on the previous.
Task 1 (color) establishes the foundation all others depend on. Task 2
(typography) and Task 3 (layout) can be done in either order after color. Task 4
(onboarding) and Task 5 (result entry) are independent UI improvements that use
the new design system.

**Tech Stack:** Tailwind CSS v4, OKLCH color functions, Google Fonts (loaded via
`<link>`), CSS custom properties.

**Design Context:** See `.impeccable.md` for full context. Key points:
professional scoring aesthetic, clean/efficient/dependable personality,
system-aware theming (light + dark), target audience is tournament arbiters at
chess events.

---

## Task 1: Color System — Replace Chess.com Clone with Own Identity

**Skill:** colorize

The current `index.css` is literally labeled "Chess.com Dark Palette." We need a
completely new color system that:

- Uses OKLCH for perceptually uniform colors
- Has warm-tinted neutrals (not pure gray, not chess.com brown)
- Supports both light and dark themes via `prefers-color-scheme`
- Uses a distinctive accent color (not chess.com green)

**Files:**

- Modify: `src/index.css` (complete rewrite of `@theme` block and base styles)
- Modify: `src/components/ui/button.tsx` (remove hardcoded `dark:` prefixes)
- Modify: Every component file that uses color classes (listed per-step below)

### Color Palette Design

The new palette uses a **deep teal/blue-green** accent — authoritative, distinct
from chess.com green, works well for both light and dark modes. Neutrals are
warm-tinted for a natural feel.

```
Accent:        oklch(55% 0.15 195)    — deep teal
Accent hover:  oklch(62% 0.15 195)    — lighter teal
Accent muted:  oklch(45% 0.12 195)    — darker teal
Success:       oklch(62% 0.17 145)    — green (distinct from accent)
Danger:        oklch(55% 0.2 25)      — warm red
Warning:       oklch(70% 0.15 75)     — amber
Draw:          oklch(65% 0.02 250)    — neutral blue-gray
White piece:   oklch(88% 0.04 85)     — warm cream
Black piece:   oklch(50% 0.08 55)     — dark wood
```

**Step 1: Rewrite the `@theme` block in `src/index.css`**

Replace the entire `@theme { ... }` block (lines 3-71) with a new OKLCH-based
system that includes both light and dark tokens. Use CSS `light-dark()` function
with `color-scheme` for automatic theme switching.

```css
@theme {
  /* ── Kx8ble Color System (OKLCH) ── */

  /* Accent (deep teal) */
  --color-accent: oklch(55% 0.15 195);
  --color-accent-hover: oklch(62% 0.15 195);
  --color-accent-muted: oklch(45% 0.12 195);
  --color-accent-foreground: oklch(98% 0.005 195);

  /* Semantic */
  --color-success: oklch(62% 0.17 145);
  --color-danger: oklch(55% 0.2 25);
  --color-warning: oklch(70% 0.15 75);
  --color-draw: oklch(65% 0.02 250);

  /* Chess piece accents */
  --color-white-piece: oklch(88% 0.04 85);
  --color-black-piece: oklch(50% 0.08 55);

  /* ── Light theme surfaces ── */
  --color-bg-primary: oklch(97% 0.005 250);
  --color-bg-secondary: oklch(99% 0.002 250);
  --color-bg-tertiary: oklch(94.5% 0.008 250);
  --color-bg-elevated: oklch(100% 0 0);

  /* Light theme text */
  --color-text-primary: oklch(18% 0.01 250);
  --color-text-secondary: oklch(45% 0.015 250);
  --color-text-muted: oklch(62% 0.01 250);

  /* Light theme borders */
  --color-border: oklch(90% 0.008 250);

  /* ── shadcn/ui semantic tokens (light) ── */
  --color-background: oklch(97% 0.005 250);
  --color-foreground: oklch(18% 0.01 250);
  --color-card: oklch(99% 0.002 250);
  --color-card-foreground: oklch(18% 0.01 250);
  --color-popover: oklch(99% 0.002 250);
  --color-popover-foreground: oklch(18% 0.01 250);
  --color-primary: oklch(55% 0.15 195);
  --color-primary-foreground: oklch(98% 0.005 195);
  --color-secondary: oklch(94.5% 0.008 250);
  --color-secondary-foreground: oklch(18% 0.01 250);
  --color-muted: oklch(94.5% 0.008 250);
  --color-muted-foreground: oklch(45% 0.015 250);
  --color-destructive: oklch(55% 0.2 25);
  --color-destructive-foreground: oklch(98% 0.005 25);
  --color-input: oklch(90% 0.008 250);
  --color-ring: oklch(55% 0.15 195);

  /* Typography */
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'DM Mono', ui-monospace, 'SF Mono', monospace;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
}
```

**Step 2: Add dark theme overrides**

After the `@theme` block, add a `@media (prefers-color-scheme: dark)` block that
redefines the surface, text, and border tokens:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: oklch(20% 0.01 250);
    --color-bg-secondary: oklch(17% 0.01 250);
    --color-bg-tertiary: oklch(14% 0.01 250);
    --color-bg-elevated: oklch(24% 0.01 250);

    --color-text-primary: oklch(93% 0.005 250);
    --color-text-secondary: oklch(65% 0.01 250);
    --color-text-muted: oklch(48% 0.01 250);

    --color-border: oklch(26% 0.01 250);

    --color-background: oklch(14% 0.01 250);
    --color-foreground: oklch(93% 0.005 250);
    --color-card: oklch(17% 0.01 250);
    --color-card-foreground: oklch(93% 0.005 250);
    --color-popover: oklch(17% 0.01 250);
    --color-popover-foreground: oklch(93% 0.005 250);
    --color-primary-foreground: oklch(98% 0.005 195);
    --color-secondary: oklch(24% 0.01 250);
    --color-secondary-foreground: oklch(93% 0.005 250);
    --color-muted: oklch(20% 0.01 250);
    --color-muted-foreground: oklch(65% 0.01 250);
    --color-destructive-foreground: oklch(98% 0.005 25);
    --color-input: oklch(26% 0.01 250);
    --color-ring: oklch(55% 0.15 195);
  }
}
```

**Step 3: Update body base styles**

Update the `body` rule (lines 82-90) to use the new tokens and bump base font
size from 13px to 14px:

```css
body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  font-size: 0.875rem;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color-scheme: light dark;
}
```

**Step 4: Add font imports to `index.html`**

Add Google Fonts `<link>` tags in the `<head>` of `index.html` for DM Sans (400,
500, 600, 700) and DM Mono (400, 500):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
  rel="stylesheet"
/>
```

**Step 5: Remove `dark:` prefixes from `button.tsx`**

In `src/components/ui/button.tsx`, the button variants use `dark:` prefixes
(lines 14, 16, 17, 20). Remove these since we now use semantic tokens that
auto-switch:

- `dark:bg-destructive/60 dark:focus-visible:ring-destructive/40` — remove
- `dark:border-input dark:bg-input/30 dark:hover:bg-input/50` — remove
- `dark:hover:bg-accent/50` — remove

The semantic tokens (--color-primary, etc.) already handle dark mode.

**Step 6: Verify build**

Run: `pnpm lint && pnpm build` Expected: No errors. The app should render with
the new color system.

**Step 7: Commit**

```bash
git add src/index.css index.html src/components/ui/button.tsx
git commit -m "feat: replace chess.com palette with OKLCH color system and light/dark theming"
```

---

## Task 2: Typography — Establish Real Type Hierarchy

**Skill:** typeset

Currently: system font at 13px, headings barely distinguishable from body, no
type scale. We need a clear hierarchy that communicates importance at a glance —
critical for arbiters scanning data between rounds.

**Files:**

- Modify: `src/index.css` (already updated font-family in Task 1; add type
  utilities)
- Modify: `src/components/home/home-page.tsx` (heading sizes)
- Modify: `src/components/setup/setup-page.tsx` (heading sizes, labels)
- Modify: `src/components/tournament/round-view.tsx` (header typography)
- Modify: `src/components/tournament/standings-table.tsx` (header, data cells)
- Modify: `src/components/tournament/pairings-table.tsx` (table headers, data)
- Modify: `src/components/layout/tab-bar.tsx` (tab text size)

### Type Scale (fixed rem, no fluid)

```
xs:    0.75rem  (12px) — captions, metadata, table column headers
sm:    0.8125rem (13px) — secondary UI, tab labels
base:  0.875rem (14px) — body text, table data
md:    1rem     (16px) — subheadings, player names in tables
lg:    1.25rem  (20px) — page section titles
xl:    1.5rem   (24px) — page titles (tournament name in headers)
```

**Step 1: Add tabular-nums and type utilities to `src/index.css`**

Add after the scrollbar styles:

```css
/* Tabular numbers for aligned data columns */
.tabular-nums {
  font-variant-numeric: tabular-nums;
}

/* Type scale utilities */
.text-page-title {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.text-section-title {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.3;
}
```

**Step 2: Update home page typography**

In `src/components/home/home-page.tsx`:

- Change `<h1 className="text-2xl font-semibold">` to
  `<h1 className="text-page-title">`
- Change `<p className="text-sm text-text-secondary">` to
  `<p className="text-base text-text-secondary">`

**Step 3: Update tournament header typography across components**

In `src/components/tournament/round-view.tsx`:

- Change `<h1 className="text-base font-semibold">` to
  `<h1 className="text-section-title">`

In `src/components/tournament/standings-table.tsx`:

- Change `<h1 className="text-base font-semibold">` to
  `<h1 className="text-section-title">`

In `src/components/setup/setup-page.tsx` (players step):

- Change `<h1 className="text-base font-semibold">` to
  `<h1 className="text-section-title">`

**Step 4: Add `tabular-nums` to numeric data columns**

In `src/components/tournament/standings-table.tsx`:

- On score `<TableCell>` (line 82): add `tabular-nums` to className
- On Buchholz `<TableCell>` (line 85): add `tabular-nums` to className
- On rating `<TableCell>` (line 79): already has `font-mono`, replace with
  `tabular-nums`

In `src/components/tournament/pairings-table.tsx`:

- On board number `<TableCell>` (line 88): replace `font-mono` with
  `tabular-nums`

In `src/components/setup/players-table.tsx`:

- On index `<TableCell>` (line 117): replace `font-mono text-text-secondary`
  with `tabular-nums text-text-secondary`
- On rating `<TableCell>` (line 121): replace `font-mono` with `tabular-nums`

**Step 5: Verify and commit**

Run: `pnpm lint && pnpm build`

```bash
git add -A
git commit -m "feat: establish type hierarchy with DM Sans and modular scale"
```

---

## Task 3: Layout — Use Space Intentionally

**Skill:** arrange

Currently: every screen floats small content in vast empty space. The pairings
table (the most important screen) uses maybe 30% of viewport. We need data-dense
layouts where the content fills the available space appropriately.

**Files:**

- Modify: `src/components/home/home-page.tsx` (rethink home layout)
- Modify: `src/components/tournament/pairings-table.tsx` (full-width table)
- Modify: `src/components/tournament/standings-table.tsx` (full-width table)
- Modify: `src/components/setup/setup-page.tsx` (config card width, players
  layout)
- Modify: `src/components/setup/players-table.tsx` (table width)
- Modify: `src/components/layout/sidebar.tsx` (sidebar spacing)

**Step 1: Make pairings table fill available width**

In `src/components/tournament/pairings-table.tsx`:

- Remove the wrapping `<div className="rounded-lg border border-border">`
  (line 61)
- Let the `<Table>` component fill the parent container naturally
- The outer `<div className="flex-1 overflow-auto p-6">` in `round-view.tsx`
  (line 105) already provides padding

The table itself should use the full width. Change the wrapper to:

```tsx
<div className="overflow-hidden rounded-lg border border-border">
```

No max-width constraint — let it fill the content area.

**Step 2: Make standings table fill available width**

Same approach in `src/components/tournament/standings-table.tsx`:

- The table wrapper at line 40 is already
  `<div className="rounded-lg border border-border">` — this is fine, it will
  naturally fill the parent.
- Ensure no max-width is being applied.

**Step 3: Improve the home page layout**

The current home page is: centered icon + title + two buttons. For a desktop
app, this should feel like a proper starting point.

Replace the home page content in `src/components/home/home-page.tsx`:

- Keep the centered layout but add more substance
- Add a subtitle that communicates what the app does
- Add keyboard shortcut hints on the buttons
- Reduce the icon size from `size-16` to `size-10` — the current icon is too
  large and triggers the "large icon above heading" anti-pattern

```tsx
<div className="flex h-full flex-col items-center justify-center gap-6">
  <div className="flex flex-col items-center gap-2">
    <Trophy className="size-10 text-accent" />
    <h1 className="text-page-title">Kx8ble</h1>
    <p className="text-sm text-text-secondary">
      Swiss-system tournament management
    </p>
  </div>

  <div className="flex flex-col gap-2">
    <Button
      className="w-56 gap-2"
      onClick={() => {
        navigate('setup');
      }}
      size="lg"
    >
      <Plus className="size-4" />
      New Tournament
    </Button>
    <Button
      className="w-56 gap-2"
      onClick={() => {
        void handleOpen();
      }}
      size="lg"
      variant="secondary"
    >
      <FolderOpen className="size-4" />
      Open Tournament
    </Button>
  </div>

  <p className="text-xs text-text-muted">
    {'\u2318'}N new &middot; {'\u2318'}O open &middot; {'\u2318'}S save
  </p>
</div>
```

**Step 4: Tighten setup card**

In `src/components/setup/setup-page.tsx`:

- The centered card (`w-full max-w-md`) is fine for a form, but bump it to
  `max-w-lg` for a bit more breathing room
- Remove `border-border bg-bg-secondary` from the Card — let the card use its
  semantic token colors naturally: `<Card className="w-full max-w-lg">`

**Step 5: Verify and commit**

Run: `pnpm lint && pnpm build`

```bash
git add -A
git commit -m "feat: improve spatial layout with data-dense tables and refined home page"
```

---

## Task 4: Onboarding — Empty States that Teach

**Skill:** onboard

Currently: empty states are passive text ("No pairings for this round", "No
players yet"). They need to guide the user toward the next action.

**Files:**

- Modify: `src/components/tournament/pairings-table.tsx` (empty state)
- Modify: `src/components/tournament/round-view.tsx` (no-tournament state,
  complete state)
- Modify: `src/components/setup/players-table.tsx` (empty player list)
- Modify: `src/components/tournament/standings-table.tsx` (empty standings)

**Step 1: Improve the "no tournament" state in round-view.tsx**

In `src/components/tournament/round-view.tsx` (lines 50-64), the "No tournament
in progress" state should guide the user:

```tsx
<div className="flex h-full flex-col items-center justify-center gap-4">
  <p className="text-sm text-text-secondary">
    No active tournament. Create one to get started.
  </p>
  <div className="flex gap-2">
    <Button
      onClick={() => {
        navigate('setup');
      }}
      size="sm"
    >
      <Plus className="size-4" />
      New Tournament
    </Button>
    <Button
      onClick={() => {
        void loadFromFile();
      }}
      size="sm"
      variant="secondary"
    >
      <FolderOpen className="size-4" />
      Open File
    </Button>
  </div>
</div>
```

Add `Plus` and `FolderOpen` to the lucide-react import at top of file, and
`loadFromFile` to the useTabs() destructure.

**Step 2: Improve the "no pairings" empty state**

In `src/components/tournament/pairings-table.tsx` (lines 52-58), change:

```tsx
<div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border">
  <p className="text-sm text-text-muted">
    Round not yet paired. Click{' '}
    <strong className="text-text-secondary">Pair Round</strong> in the header to
    generate pairings.
  </p>
</div>
```

**Step 3: Improve the empty players list**

In `src/components/setup/players-table.tsx` (lines 141-146), change:

```tsx
<div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border">
  <p className="text-sm text-text-muted">No players registered yet.</p>
  <p className="text-xs text-text-muted">
    Enter a name above and press Enter or click Add. You need at least 2
    players.
  </p>
</div>
```

**Step 4: Improve the empty standings state**

In `src/components/tournament/standings-table.tsx` (lines 33-37), change:

```tsx
<div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border">
  <p className="text-sm text-text-muted">
    Standings appear here after the first round is complete.
  </p>
  <p className="text-xs text-text-muted">
    Go to Rounds to pair and record results.
  </p>
</div>
```

**Step 5: Verify and commit**

Run: `pnpm lint && pnpm build`

```bash
git add -A
git commit -m "feat: replace passive empty states with instructional guidance"
```

---

## Task 5: Result Entry — Inline Buttons Instead of Dropdown

**Skill:** distill

Currently: entering a result requires click-to-open-dropdown, then
click-to-select. For a 40-board tournament, that's 80+ clicks. Replace with
inline segmented buttons for one-click result entry.

**Files:**

- Modify: `src/components/tournament/result-cell.tsx` (complete rewrite of the
  pending state)
- Potentially remove: dropdown-menu dependency from this component

**Step 1: Rewrite `result-cell.tsx` with inline buttons**

Replace the `DropdownMenu` pattern (lines 66-90) with three inline buttons:

```tsx
import { Badge } from '@/components/ui/badge.js';
import { cn } from '@/lib/utilities.js';

import type { Result } from '@echecs/tournament';
import type { JSX } from 'react';

interface ResultCellProperties {
  disabled?: boolean;
  onSelect: (result: Result) => void;
  value: Result | undefined;
}

const RESULT_OPTIONS: { label: string; value: Result }[] = [
  { label: '1-0', value: 1 },
  { label: '\u00BD-\u00BD', value: 0.5 },
  { label: '0-1', value: 0 },
];

function resultLabel(value: Result): string {
  if (value === 1) return '1-0';
  if (value === 0.5) return '\u00BD-\u00BD';
  return '0-1';
}

function resultColor(value: Result): string {
  if (value === 1) return 'bg-success text-white';
  if (value === 0) return 'bg-danger text-white';
  return 'bg-draw text-bg-tertiary';
}

function ResultCell({
  disabled = false,
  onSelect,
  value,
}: ResultCellProperties): JSX.Element {
  if (value !== undefined) {
    return (
      <Badge className={cn('cursor-default text-xs', resultColor(value))}>
        {resultLabel(value)}
      </Badge>
    );
  }

  if (disabled) {
    return <span className="text-text-muted">&mdash;</span>;
  }

  return (
    <div className="inline-flex rounded-md border border-border">
      {RESULT_OPTIONS.map((option, index) => (
        <button
          className={cn(
            'px-2.5 py-0.5 text-xs font-medium text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary',
            index === 0 && 'rounded-l-md',
            index === RESULT_OPTIONS.length - 1 && 'rounded-r-md',
            index > 0 && 'border-l border-border',
          )}
          key={option.value}
          onClick={() => {
            onSelect(option.value);
          }}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export { ResultCell };
```

This removes the dropdown-menu import entirely. Result entry is now one click
instead of two.

**Step 2: Verify and commit**

Run: `pnpm lint && pnpm build`

```bash
git add -A
git commit -m "feat: replace result dropdown with inline one-click buttons"
```

---

## Execution Notes

- **Task order matters for 1-3:** Color (Task 1) must go first since every
  component references color tokens. Typography (Task 2) and Layout (Task 3)
  depend on the font-family established in Task 1.
- **Tasks 4-5 are independent:** They can be done in any order after the first
  three.
- **Testing strategy:** After each task, run `pnpm lint && pnpm build`. Visual
  verification should be done by running `pnpm dev` and checking all screens
  (home, setup config, setup players, round view with pairings, standings).
- **Dark mode verification:** After Task 1, test both light and dark by toggling
  OS appearance settings. All screens must be readable in both modes.

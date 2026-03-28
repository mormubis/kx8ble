# UI Rebuild Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Rebuild the Kx8ble UI from Figma Make reference designs, replacing the
current minimal MVP with a full-featured tournament management interface.

**Architecture:** Replace the current sidebar + screen-based navigation with a
horizontal nav bar pattern. Rewrite all view components (Setup, Players, Rounds,
Standings) with richer data-dense tables and forms matching the Make output.
Keep the existing `@echecs/*` library integration, Tauri plugins,
`tabs-context.tsx` state management, and `file.ts` I/O layer — only the React
view layer changes.

**Tech Stack:** React 19, TypeScript 6, Tailwind CSS v4, shadcn/ui, TanStack
Table (new — for sortable/filterable data tables), `@echecs/tournament` 2.0,
`@echecs/swiss` 3.0, `@echecs/buchholz` 3.0, Tauri v2.

**Reference:** Figma Make output at `/tmp/kx8ble-make/src/app/components/` — use
as UI reference only, not as code to copy. The Make code uses react-router and
its own state management which we do not use.

---

## What We Keep (do NOT rewrite)

- `src/context/tabs-context.tsx` — tournament state management (multi-tab,
  @echecs/\* integration)
- `src/lib/file.ts` — TRF import/export, file I/O
- `src/lib/utilities.ts` — cn() helper
- `src/hooks/use-tabs.ts` — context hook
- `src/hooks/use-keyboard-shortcuts.ts` — keyboard shortcut handler
- `src/components/error-boundary.tsx` — error boundary
- `src/components/ui/` — shadcn/ui primitives (may add new ones)
- `src/index.css` — design tokens, theme
- `src/main.tsx` — React entry point
- `index.html` — HTML entry with font links
- All Tauri/Rust code (`src-tauri/`)

## What We Replace

- `src/app.tsx` — new layout with horizontal nav bar
- `src/types/index.ts` — expanded Screen type and new types
- `src/components/home/` — replaced by empty state in Root
- `src/components/layout/sidebar.tsx` — removed (replaced by horizontal nav)
- `src/components/layout/tab-bar.tsx` — merged into new Root layout
- `src/components/setup/setup-page.tsx` — replaced by TournamentSetup
- `src/components/setup/players-table.tsx` — replaced by PlayerManagement
- `src/components/tournament/round-view.tsx` — replaced by Rounds
- `src/components/tournament/pairings-table.tsx` — merged into Rounds
- `src/components/tournament/standings-table.tsx` — replaced by Standings
- `src/components/tournament/round-selector.tsx` — merged into Rounds
- `src/components/tournament/result-cell.tsx` — merged into Rounds

---

## Task 1: Expand Type System

**Files:**

- Modify: `src/types/index.ts`

Expand the Screen type and add shared UI types that multiple components will
reference.

```typescript
/** Application screen identifiers */
export type Screen = 'home' | 'setup' | 'players' | 'round' | 'standings';

/** Tournament type selection */
export type TournamentType =
  | 'individual-swiss'
  | 'individual-rr'
  | 'team-swiss'
  | 'team-rr';

/** FIDE title abbreviations */
export type Title =
  | ''
  | 'GM'
  | 'IM'
  | 'FM'
  | 'WGM'
  | 'WIM'
  | 'WFM'
  | 'CM'
  | 'WCM';

/** Time control category */
export type TimeControlType = 'standard' | 'rapid' | 'blitz';

/** Pairing system identifier */
export type PairingSystemId =
  | 'dutch'
  | 'dubov'
  | 'burstein'
  | 'lim'
  | 'double-swiss'
  | 'swiss-team';
```

**Verify:** `pnpm lint && pnpm build` **Commit:**
`feat: expand type system with tournament, title, and pairing types`

---

## Task 2: Add New shadcn/ui Components

Several components used in the Make output are not yet in our UI library.
Install them.

**Step 1:** Add missing components:

```bash
pnpm dlx shadcn@latest add dialog select tabs label separator tooltip
```

**Step 2:** Verify existing components still work:

```bash
pnpm lint && pnpm build
```

**Commit:**
`feat: add dialog, select, tabs, label, separator, tooltip components`

---

## Task 3: New Root Layout — Replace Sidebar with Horizontal Nav

**Files:**

- Create: `src/components/layout/root-layout.tsx`
- Modify: `src/app.tsx` — use new RootLayout
- Delete: `src/components/layout/sidebar.tsx`
- Delete: `src/components/home/home-page.tsx`

The new layout has:

1. **Header bar** (top): "Kx8ble" brand + "New Tournament" button + dark mode
   toggle
2. **Tournament tabs row** (below header, when tournaments exist): clickable
   tabs with close buttons
3. **Navigation bar** (below tabs, when a tournament is active): Setup, Players,
   Rounds, Standings — horizontal buttons with icons
4. **Content area** (fills remaining space): renders the active screen
5. **Empty state** (when no tournaments): centered "No tournaments open" with
   "New Tournament" button

Reference: `/tmp/kx8ble-make/src/app/components/Root.tsx` for layout structure,
but implement using our `useTabs()` context hook and `navigate()` function — NOT
react-router.

**Key differences from Make:**

- Use `useTabs()` hook, not react-router
- Tournament creation opens the setup screen (like current flow), not a dialog —
  the dialog approach from Make is an option but our current flow works and is
  already wired
- Dark mode should remain system-aware via `prefers-color-scheme` (already
  implemented), but add a manual override toggle in the header

**Verify:** `pnpm lint && pnpm build` **Commit:**
`feat: replace sidebar with horizontal navigation bar layout`

---

## Task 4: Tournament Setup Screen

**Files:**

- Create: `src/components/tournament/tournament-setup.tsx`
- Delete: `src/components/setup/setup-page.tsx`

Full tournament configuration in editable card sections (not a wizard).
Sections:

1. **Basic Information** — name, organizer, location, federation, start/end
   dates
2. **Tournament Format** — type (4 options), number of rounds, time control,
   time type, pairing system
3. **Officials & Rating** — tournament director, chief arbiter, FIDE rated,
   nationally rated
4. **Summary** — player count, round count, current round (read-only)

All fields update the tournament state immediately via `useTabs()` context. This
replaces the current two-step wizard (config → players).

Note: This screen is only for editing tournament metadata. The "Start
Tournament" action moves to the Players screen where the user adds players and
then starts.

Reference: `/tmp/kx8ble-make/src/app/components/TournamentSetup.tsx`

**Important:** The context `tabs-context.tsx` currently has
`startTournament(metadata, rounds)`. The setup screen needs the context to also
support updating metadata fields individually on an existing tournament. Add an
`updateMetadata` function to the context if not already present.

**Verify:** `pnpm lint && pnpm build` **Commit:**
`feat: add tournament setup screen with full metadata editing`

---

## Task 5: Player Management Screen

**Files:**

- Create: `src/components/tournament/player-management.tsx`
- Delete: `src/components/setup/players-table.tsx`

Full-width data table with all player fields. Features:

- **Table columns:** Rank, Name (surname, first), Title, Federation, Int.
  Rating, Nat. Rating, FIDE ID, Club, Status, Actions
- **Add player:** Dialog with full player form (surname, first name, FIDE ID,
  national ID, title, federation, int. rating, nat. rating, date of birth, sex,
  club)
- **Edit player:** Same dialog pre-filled with player data
- **Remove player:** Confirmation before removal (only if not yet paired)
- **Player status:** Show Active/Withdrawn badge
- **Start Tournament button** in header (disabled until 2+ players)
- **Empty state:** "No players added yet. Click 'Add Player' to get started."

The table should use tabular-nums for numeric columns. Sort by starting rank by
default.

Reference: `/tmp/kx8ble-make/src/app/components/PlayerManagement.tsx`

**Verify:** `pnpm lint && pnpm build` **Commit:**
`feat: add player management screen with full player data model`

---

## Task 6: Rounds & Pairings Screen

**Files:**

- Create: `src/components/tournament/rounds-view.tsx`
- Delete: `src/components/tournament/round-view.tsx`
- Delete: `src/components/tournament/pairings-table.tsx`
- Delete: `src/components/tournament/round-selector.tsx`
- Delete: `src/components/tournament/result-cell.tsx`

This is the most important screen. Layout:

- **Header:** Round navigation (prev/next arrows + "Round N of M"), "Pair Round
  N" button
- **Pairings table:** Board, White (name), Rating, Points, Result, Points,
  Rating, Black (name)
- **Result entry:** All 7 result options (1-0, 1/2-1/2, 0-1, 1F-0F, 0F-1F,
  0F-0F, clear) — Make uses a dropdown Select, which is a reasonable choice
  since we now have 7 options instead of 3
- **Bye rows:** Styled differently, show bye type
- **Footer cards:** Keyboard shortcuts reference + Round status (total boards,
  results entered, pending)
- **Empty states:** "Round not paired" with pair button, "Add 2+ players"
  warning

The result entry needs to support both mouse (dropdown/click) and keyboard (1-6
keys).

White/black piece color dots before player names (cream for white, dark wood for
black).

Reference: `/tmp/kx8ble-make/src/app/components/Rounds.tsx`

**Verify:** `pnpm lint && pnpm build` **Commit:**
`feat: add rounds view with data-dense pairings table and full result types`

---

## Task 7: Standings Screen

**Files:**

- Create: `src/components/tournament/standings-view.tsx`
- Delete: `src/components/tournament/standings-table.tsx`

Rich standings display:

- **Table columns:** Rank, Seed, Name, Title, Federation, Rating, Points, R1,
  R2, R3... (per-round result columns)
- **Per-round results:** Show 1/½/0/B/\*/- with semantic colors (green win, red
  loss, gray draw, muted bye)
- **Leader highlight:** Trophy icon + subtle background for rank 1
- **Stats cards below table:** Total players, Average rating, Titled players,
  Federations count
- **Result legend card:** Explains what each symbol means

Reference: `/tmp/kx8ble-make/src/app/components/Standings.tsx`

**Verify:** `pnpm lint && pnpm build` **Commit:**
`feat: add standings view with cross-table results and tournament statistics`

---

## Task 8: Wire Up App.tsx and Clean Up

**Files:**

- Modify: `src/app.tsx` — new screen routing using RootLayout
- Delete: `src/components/home/` directory
- Delete: `src/components/layout/tab-bar.tsx`
- Delete: `src/components/setup/` directory (if any files remain)

Update `app.tsx` to:

1. Use the new `RootLayout` as the top-level component
2. Route screens: setup → TournamentSetup, players → PlayerManagement, round →
   RoundsView, standings → StandingsView
3. Remove the old `showSidebar` logic
4. Remove old SCREENS record

Clean up any orphaned imports or dead files.

**Verify:** `pnpm lint && pnpm build` **Verify visually:** `pnpm dev` — check
all screens render correctly in both light and dark mode **Commit:**
`feat: complete UI rebuild with horizontal nav and data-dense views`

---

## Task 9: Context Updates for New Features

**Files:**

- Modify: `src/context/tabs-context.tsx`

The new screens need context operations that may not exist yet:

- `updateMetadata(fields)` — update tournament metadata fields individually
- `withdrawPlayer(playerId)` — set player status to withdrawn
- `reactivatePlayer(playerId)` — set player status back to active
- Ensure `PlayerEntry` type includes all new fields (title, FIDE ID, national
  ID, date of birth, sex, club, k-factor, group)

Check what's already there and add what's missing. Do NOT rewrite the whole
context — add incrementally.

**Verify:** `pnpm lint && pnpm build` **Commit:**
`feat: extend tournament context with metadata updates and player status management`

---

## Task 10: Final Verification and Polish

- Run `pnpm lint && pnpm build` — must pass clean
- Run `pnpm tauri dev` — verify native app works
- Test full flow: create tournament → add players → start → pair → enter results
  (all 7 types) → next round → standings
- Test TRF load: open a .trf file → verify pairings and results display
  correctly
- Test light and dark mode
- Test multi-tab (two tournaments open)
- Fix any visual issues found during testing

**Commit:** `fix: address visual polish issues from UI rebuild verification`

---

## Execution Notes

- **Task order matters:** Tasks 1-2 are prerequisites. Task 3 (Root layout) must
  come before Tasks 4-7 (screens). Task 8 wires everything together. Task 9 can
  be done anytime after Task 3. Task 10 is last.
- **Tasks 4-7 are independent** of each other and can be done in parallel after
  Task 3.
- **Keep context changes minimal:** The existing `tabs-context.tsx` already
  handles tournament state, pairing, and results via `@echecs/tournament`. The
  new screens are primarily view-layer changes.
- **Use Make output as REFERENCE only:** Read the Make components for
  layout/structure ideas, but write clean code that uses our existing hooks
  (`useTabs()`), our design tokens (`text-section-title`, `bg-bg-secondary`,
  etc.), and our established patterns.
- **Testing:** After each task, `pnpm lint && pnpm build`. After Task 8,
  `pnpm tauri dev` for visual verification.

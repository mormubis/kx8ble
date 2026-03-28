# Kx8ble — UI Design Prompt for Figma Make

## What is Kx8ble?

Kx8ble (pronounced "crosstable") is a **desktop application for managing chess tournaments**. It's used by tournament arbiters and club directors at chess events — from casual weekly club nights to FIDE-rated championships. The app runs on macOS, Windows, and Linux via Tauri (think Electron, but lighter).

The primary competitor is Swiss-Manager — a Windows-only application from 2002 with a dated Win32 UI. Kx8ble aims to replace it with a modern, cross-platform experience.

---

## Users

**Primary:** Tournament arbiters (often FIDE-certified) who run rated chess events. They work on a laptop at the tournament venue, under time pressure between rounds. They need instant comprehension of pairings, results, and standings. Many are 40-60 years old and not highly technical.

**Secondary:** Club directors running casual weekly events. Less experienced, need simpler onboarding.

**Context of use:** A laptop at a tournament hall, sometimes viewed from 2-3 feet away. Often used in a rush between rounds while players queue with questions.

---

## Brand & Aesthetic

**Personality:** Clean, efficient, dependable. Like a professional tool that knows what it's doing.

**Visual tone:** Professional sports scoring systems — think broadcast scoreboards, ESPN match centers, FIFA scoring interfaces. Authoritative but readable. Data-dense when needed, clean when not.

**Typography:** DM Sans (body) + DM Mono (numeric data). Clear type hierarchy — arbiters need to scan data at a glance.

**Color system:**
- **Accent:** Deep teal (not chess.com green)
- **Semantic:** Green = white wins, Red = black wins, Neutral gray = draw
- **Chess pieces:** Warm cream dot = white, Dark wood dot = black
- **Neutrals:** Cool-tinted (hint of blue), not pure gray
- **Theme:** Both light and dark mode (system-aware)

**Anti-references:** Must NOT look like chess.com, Lichess, or a generic shadcn/Tailwind template. No glassmorphism, no gradient text, no dark-mode-with-glowing-accents aesthetic.

**References:** Native macOS productivity apps (Xcode, Finder), ESPN scoreboard interfaces, professional broadcast scoring systems.

---

## Application Structure

The app uses a **tab bar + sidebar + content area** layout:

```
+--[Tab Bar]-------------------------------------------+
| Tournament A  |  Tournament B  |  +                   |
+--+-------+-------------------------------------------+
|  |       |                                            |
|  | Side  |   Content Area                             |
|  | bar   |                                            |
|  |       |                                            |
|  |       |                                            |
+--+-------+--------------------------------------------+
```

- **Tab bar** (top): Multiple tournaments open simultaneously, like browser tabs. Each tab shows tournament name. Close button on hover. "+" to open new tab.
- **Sidebar** (left, narrow ~56px, icon-only): Navigation within a tournament — Rounds, Standings. Only visible when a tournament is active. Trophy icon at top (branding).
- **Content area** (main): Changes based on current screen.

---

## Screens to Design

### 1. Home Screen (no tournament open)
- Centered layout, minimal
- App name "Kx8ble" with trophy icon (small, not oversized)
- Subtitle: "Chess Tournament Manager"
- Two buttons: "New Tournament" (primary) and "Open Tournament" (secondary)
- Keyboard shortcut hints below: Cmd+N new / Cmd+O open / Cmd+S save
- No sidebar visible

### 2. Tournament Setup — Configuration Step
- Centered card/form layout (no sidebar)
- Tab in tab bar shows "New Tournament"
- Form fields:
  - Tournament Name (text)
  - Number of Rounds (number stepper, 1-15)
  - Pairing System (dropdown: Dutch, Dubov, Burstein, Lim, Double-Swiss)
  - Time Control (text, e.g. "90min + 30sec/move")
  - Time Control Type (radio: Standard / Rapid / Blitz)
  - FIDE Rated (toggle: Yes/No)
  - Federation (dropdown with country codes)
  - Start Date / End Date (date pickers)
  - Organizer, Chief Arbiter, Location (text fields)
- Footer: Cancel (ghost) | Next: Players (primary with arrow)

### 3. Tournament Setup — Players Step
- Full-width layout with header showing tournament name + config summary
- Header: Back button | "Tournament Name" | subtitle "5 rounds, Dutch system" | Start Tournament (primary, disabled until 2+ players)
- Player entry row: Name input (wide) | Rating input (narrow) | Add button
- Player table below:
  - Columns: #, Name, Rating, Federation, FIDE ID, Remove (X button)
  - Tabular numbers for numeric columns
  - Dashed-border empty state when no players: "No players registered yet. Enter a name above and press Enter or click Add."
- Footer: "N players registered"

### 4. Round View — Pairings (the most important screen)
- Sidebar visible (Rounds highlighted)
- Header: Tournament name | Round selector chips (R1, R2, R3... active round highlighted in accent) | "of N" | Save button (ghost) | Primary action button (context-dependent)
- Primary action button states:
  - "Pair Round N" — when round needs pairing
  - "Next Round" — when all results recorded (auto-pairs and advances)
  - "Final Standings" — when tournament complete
- Pairings table (full width, the hero of the screen):
  - Columns: Board, White, Result, Black
  - White player has cream dot before name, black player has dark dot
  - Result column: inline segmented button group [1-0 | 1/2-1/2 | 0-1] when no result yet
  - When result selected: the chosen segment stays highlighted (green for 1-0, gray for draw, red for 0-1), other two remain clickable for correction
  - Additional result options needed: forfeit buttons (1F-0F, 0F-1F, 0F-0F) — could be in a "..." overflow or secondary row
  - Bye rows: styled differently (muted, shows "BYE" in result column)
- Empty state when not yet paired: dashed border box, "Round not yet paired. Click **Pair Round** in the header to generate pairings."

### 5. Standings View
- Sidebar visible (Standings highlighted)
- Header: Tournament name | "After round N of M"
- Standings table (full width):
  - Columns: Rank, Player, Rating, Score, Tiebreak 1, Tiebreak 2, ... (configurable)
  - Top players (rank 1) have subtle accent border on left
  - Tabular numbers for all numeric columns
  - Score column should be bold/emphasized
- Empty state: "Standings appear here after the first round is complete."

### 6. Tournament Settings (accessible from menu or header)
- Tabbed dialog or full page with sections:
  - **General** tab: All tournament metadata fields (see Setup screen)
  - **Tiebreaks** tab: Two-panel layout — available tiebreaks on top, selected tiebreaks (ordered) on bottom. Click to add, drag to reorder, click to remove. Buchholz has expandable parameter settings.
  - **Categories** tab: Age groups input, rating bands, cutoff date

### 7. Player Management (during tournament)
- Accessible from a menu or button
- Table showing all players with all data columns
- Sortable by any column
- Editable cells (click to edit)
- Status indicators: Active, Withdrawn, Excluded for round N
- Actions: Withdraw player, Reactivate, Exclude from round, Edit data

### 8. Result Entry Detail (for complex results)
- When an arbiter needs to enter forfeits or byes, a small popover or modal from the result cell showing all six result types:
  - 1-0, 1/2-1/2, 0-1 (regular)
  - 1F-0F, 0F-1F, 0F-0F (forfeits)
  - Clear result
- Keep the inline segmented buttons for the three common results; the expanded view for edge cases

---

## Key Interaction Patterns

### Result Entry (critical — happens 50+ times per round)
- Default: three inline buttons in the table row [1-0 | 1/2 | 0-1]
- One click = result recorded, button highlights with semantic color
- Click a different button = result changed instantly
- For forfeits: secondary access (right-click, or small expand arrow)
- Must work fast with keyboard too (1, 2, 3 keys)

### Round Navigation
- Chip/pill selector showing R1, R2, R3... 
- Current round highlighted in accent color
- Clicking past rounds shows read-only pairings with recorded results
- Future rounds not clickable

### Player Withdrawal
- From player management view, right-click or action menu
- Choose: Withdraw from specific round(s) or all remaining rounds
- Withdrawn players get zero-point bye (or half-point bye if tournament allows)

---

## Typography Scale

```
xs:    12px — captions, metadata, table column headers  
sm:    13px — secondary UI, tab labels  
base:  14px — body text, table data  
md:    16px — subheadings, player names in tables  
lg:    20px — page section titles  
xl:    24px — page titles  
```

Tabular (monospaced) numbers for all numeric data columns (ratings, scores, tiebreaks, board numbers).

---

## Design Tokens (for Figma)

### Colors (OKLCH — convert to hex for Figma)

**Accent:**
- Primary: `#1a8a8a` (deep teal)
- Hover: `#2ba3a3`
- Muted: `#0d6b6b`

**Semantic:**
- Success/White wins: `#3d9e5c`
- Danger/Black wins: `#c04030`
- Draw: `#8e95a0`
- Warning: `#c09030`

**Chess pieces:**
- White piece dot: `#d4c9a8` (warm cream)
- Black piece dot: `#7a6a50` (dark wood)

**Light theme surfaces:**
- Background: `#f2f3f6`
- Card/Secondary: `#f9f9fb`
- Tertiary: `#eaecf0`
- Elevated: `#ffffff`

**Light theme text:**
- Primary: `#1e2028`
- Secondary: `#5c6070`
- Muted: `#8a8e9a`

**Light theme border:** `#dfe1e6`

**Dark theme surfaces:**
- Background: `#1a1c24`
- Card/Secondary: `#22242e`
- Tertiary: `#16181f`
- Elevated: `#2c2e38`

**Dark theme text:**
- Primary: `#e4e5ea`
- Secondary: `#8e919c`
- Muted: `#5a5d68`

**Dark theme border:** `#333640`

### Radius
- sm: 4px
- md: 6px  
- lg: 8px
- xl: 12px

### Fonts
- Sans: DM Sans (400, 500, 600, 700)
- Mono: DM Mono (400, 500) — for numeric data

---

## What to Prioritize

1. **Round View with pairings table** — this is where arbiters spend 80% of their time. It must be scannable, fast to interact with, and information-dense without feeling cramped.
2. **Standings table** — second most viewed screen. Clean data presentation.
3. **Home screen** — first impression, should feel professional and purposeful.
4. **Setup flow** — used once per tournament, should be straightforward.

---

## Constraints

- Desktop only (minimum 1024x768, optimized for 1440x900+)
- Must work well at various window sizes — arbiters may not be fullscreen
- Tables are the primary UI element — they must handle 6-200 rows gracefully
- The app may be viewed on a projector for spectators (standings screen especially) — ensure readability at distance

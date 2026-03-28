# Kx8ble — UI Design Brief

## Product

Kx8ble (pronounced "crosstable") is a **desktop application for managing chess
tournaments**. It runs on macOS, Windows, and Linux. It replaces Swiss-Manager,
a Windows-only application from 2002 with a dated Win32 interface.

---

## Users & Context

**Primary users:** Tournament arbiters (often FIDE-certified) running rated
chess events. They work on a laptop at the tournament venue, under time pressure
between rounds. Many are 40-60 years old with varying technical skill.

**Secondary users:** Club directors running casual weekly events. Less
experienced, need a lower barrier to entry.

**Environment:** A laptop at a tournament hall, sometimes viewed from 2-3 feet
away. The standings screen may be projected for spectators. The app is used in a
rush between rounds while players queue with questions.

---

## Brand

**Personality:** Clean, efficient, dependable. A professional tool that earns
trust through predictability and quiet confidence.

**References:** Professional sports scoring systems, broadcast scoreboards,
native macOS productivity apps. Authoritative but readable. Data-dense when
needed, clean when not.

**Anti-references:** Must NOT look like chess.com, Lichess, or a generic UI
template. No glassmorphism, no gradient text, no dark-mode-with-glowing-accents
aesthetic.

---

## Design Tokens

### Colors

**Accent:** Deep teal

- Primary: `#1a8a8a`
- Hover: `#2ba3a3`
- Muted: `#0d6b6b`

**Semantic:**

- Success / White wins: `#3d9e5c`
- Danger / Black wins: `#c04030`
- Draw: `#8e95a0`
- Warning: `#c09030`

**Chess piece indicators:**

- White piece: `#d4c9a8` (warm cream)
- Black piece: `#7a6a50` (dark wood)

**Light theme:**

- Background: `#f2f3f6`
- Surface: `#f9f9fb`
- Tertiary: `#eaecf0`
- Elevated: `#ffffff`
- Text primary: `#1e2028`
- Text secondary: `#5c6070`
- Text muted: `#8a8e9a`
- Border: `#dfe1e6`

**Dark theme:**

- Background: `#1a1c24`
- Surface: `#22242e`
- Tertiary: `#16181f`
- Elevated: `#2c2e38`
- Text primary: `#e4e5ea`
- Text secondary: `#8e919c`
- Text muted: `#5a5d68`
- Border: `#333640`

### Typography

- Sans: DM Sans (400, 500, 600, 700)
- Mono: DM Mono (400, 500) — for numeric data in tables
- All numeric columns (ratings, scores, tiebreaks, board numbers) should use
  tabular/monospaced figures

### Radius

- sm: 4px, md: 6px, lg: 8px, xl: 12px

### Theming

- Both light and dark mode required (system-aware)

---

## Constraints

- Desktop only — minimum 1024x768, optimized for 1440x900+
- Must work at various window sizes (arbiters may not be fullscreen)
- Tables are the dominant UI element — must handle 6 to 200+ rows
- Standings screen may be projected onto a wall — readability at distance
  matters

---

## Tournament Types Supported

The application must support four tournament types. They share most UI but
differ in setup options and how results are entered:

1. **Individual Swiss** — players paired each round by score/rating. The primary
   and most common format.
2. **Individual Round-Robin** — every player plays every other. All pairings
   generated at once. Single, double, and triple round-robin.
3. **Team Swiss** — teams (with configurable board count) paired each round.
   Match results (team total) and individual board results tracked separately.
4. **Team Round-Robin** — teams play each other in round-robin format. Includes
   Scheveningen variant.

---

## Functional Areas

### 1. Tournament Setup

Create and configure a tournament. All settings editable at any point during the
tournament.

**Data captured:**

- Tournament name, remarks, organizer, website, email
- Time control (free text, e.g. "90min + 30sec/move") and type (Standard / Rapid
  / Blitz)
- Tournament director, chief arbiter + FIDE ID, deputy chief arbiter + FIDE ID,
  additional arbiters
- Federation (country code), location
- Number of rounds (auto-calculated for round-robin based on player count)
- Start and end dates
- FIDE rated: yes/no. Nationally rated: yes/no
- Number of boards (team events only)
- Scoring system: Game points (1, 0.5, 0) / Game points (3, 1, 0) / Match points
  (2, 1, 0)
- Pairing system: Dutch, Dubov, Burstein, Lim, Double-Swiss, Swiss-Team
- First-round color for top seed: Random / White / Black
- Baku acceleration: on/off
- Starting rank sort order: national rating / international rating / max of both
  / national then international / international only
- Points for pairing-allocated bye (default 1)
- Half-point byes allowed: yes/no
- Club/group pairing protection: on/off

**Round schedule:**

- Date and time per round
- Bulk fill option (set one and copy to all)

### 2. Player Management

**Player data fields:**

- Surname, first name (separate)
- FIDE ID, national ID
- Title (GM, IM, FM, WGM, WIM, WFM, CM, WCM)
- National rating, international rating
- Federation (3-letter code)
- Date of birth, sex
- Club
- K-factor
- Group (free text — for custom categories)

**Player entry methods:**

- Manual field-by-field entry
- Search from imported FIDE rating lists (standard/rapid/blitz) or national
  rating lists by name or ID
- Import from Excel (.xlsx), CSV, or TRF files
- Duplicate detection with warning

**Player lifecycle:**

- All fields editable at any time during the tournament
- A player who has been paired cannot be deleted — must be withdrawn instead
- Starting rank auto-sorted by configured criteria; must be re-sorted when
  adding late entries
- Manual starting rank override possible

**Late entry:**

- Players can join after the tournament has started
- They receive zero-point or half-point byes for missed rounds

**Player status:**

- Active
- Withdrawn from specific round(s)
- Withdrawn from all remaining rounds
- Can be reactivated after withdrawal

**Team events additionally need:**

- Team management: create teams, assign players to teams
- Board order within team (configurable)
- Reserve players
- Team composition per round (which players play which boards)

### 3. Pairing

**Automatic pairing:**

- Generate pairings using the selected pairing system
- For round-robin: generate all rounds at once

**Manual overrides:**

- Set specific pairs manually before running automatic pairing
- Modify pairings after generation: swap players, change colors, remove pairs,
  add new pairs
- Reorder board numbers
- Manually altered pairings should be visually distinguishable

**Player exclusion:**

- Exclude from specific rounds (receives zero-point or half-point bye)
- Exclude from all remaining rounds
- Reactivate excluded players

**Other pairing features:**

- Fixed board assignment (force player to specific board)
- Club/group protection (prevent same-club pairings, configurable per round)

**Pairings checklist (for arbiter verification):** Per player: seed number,
current points, color history, due color, float status, list of previous
opponents

### 4. Result Entry

**Result types (all six must be supported):**

| Result  | Meaning                    | Rated? |
| ------- | -------------------------- | ------ |
| 1-0     | White wins                 | Yes    |
| 1/2-1/2 | Draw                       | Yes    |
| 0-1     | Black wins                 | Yes    |
| 1F-0F   | White wins by forfeit      | No     |
| 0F-1F   | Black wins by forfeit      | No     |
| 0F-0F   | Double forfeit (both lose) | No     |

**Bye types:**

| Type           | Points           | Description                    |
| -------------- | ---------------- | ------------------------------ |
| Pairing bye    | 1 (configurable) | Odd player, no opponent        |
| Half-point bye | 0.5              | Requested absence              |
| Zero-point bye | 0                | Unexcused absence / withdrawal |
| Full-point bye | 1                | Special regulations            |

**Result editing:**

- Results changeable at any time
- Results clearable (set back to unrecorded)
- Navigate between rounds while entering results
- Filter to show only boards with missing results
- Keyboard shortcuts for fast entry: 1 = 1-0, 2 = 1/2, 3 = 0-1, 4 = 1F-0F, 5 =
  0F-1F, 6 = 0F-0F, 0 = clear

**Team results:**

- Enter match result (team total) separately from individual board results
- Board results must validate against match total
- Forfeit at board level can optionally reduce team score by 0.5

### 5. Standings & Tiebreaks

**Tiebreak configuration:** The arbiter selects which tiebreaks to use and in
what priority order. The following must be available:

- Points (game points), Match points (team)
- Buchholz (standard, cut-1, cut-2, median, average) with configurable
  parameters
- Buchholz sum
- Sonneborn-Berger
- Direct encounter
- Progressive score
- FIDE tiebreak (progressive)
- Rating average of opponents
- Rating performance
- Average recursive performance of opponents
- Greater number of victories
- Most games as black
- Arranz system
- Koya system (round-robin)
- Manual input (for drawing of lots, playoff results)
- Playoff points

**Buchholz parameters (configurable):**

- Number of best/worst results to exclude (0-3 each)
- Treatment of unplayed games (forfeit, bye): 1/2 point / real points / draw
  against self / virtual opponent
- Weighting for unplayed games
- Include/exclude own points
- Handling of dropped players

**Standings display:**

- Rank, name, rating, score, and selected tiebreak values
- Visual distinction for top rank
- Interim standings available at any point
- Final standings after last round

**Category prizes:**

- Age groups: configurable (U8, U10, U12, ..., S50, S65) with cutoff date
- Rating bands: configurable ranges (e.g. 0-1400, 1401-1800)
- Custom categories via the player "Group" field
- Display winners per category with configurable number of places

### 6. Rating & Norms

**FIDE rating calculations:**

- Expected score per game
- Rating change per player
- New rating estimate
- Standard / Rapid / Blitz rule differences
- Unrated player handling (initial rating)
- K-factor per player

**Title norm checking:**

- Detect GM, IM, WGM, WIM norms achieved
- Show norm requirements vs. actual performance
- "What result do I need?" preview before last round
- Generate title norm list

**Rating statistics:**

- Tournament average rating
- Number of titled players
- Number of foreign federations
- Performance rating per player

### 7. Reports & Output

**Printable/exportable lists:**

- Starting rank list
- Alphabetical player list
- Pairings per round
- Results per round
- Interim and final standings
- Cross-table (player vs. player results matrix)
- Category prize winners
- Pairings checklist (arbiter verification)
- Player info card (individual certificate with per-round results)
- Rating statistics

**Print customization:**

- Show/hide columns
- Font size and page layout
- Portrait/landscape
- Filter by board range (e.g. boards 1-20)
- Saveable custom list templates

**FIDE reports:**

- TRF16 export (FIDE Tournament Report File)
- IT3 report (FIDE Tournament Report form)
- FA1, IA1 norm report forms

### 8. File I/O

**Native format:**

- Save/load to .echecs JSON files
- Auto-save on pairing and result entry
- Automatic backups (configurable count), restorable from within the app

**Import:**

- TRF16 files (full tournament with players, results, pairings, metadata)
- Excel (.xlsx) and CSV player lists
- FIDE rating lists (standard, rapid, blitz) for player lookup
- National federation rating lists

**Export:**

- TRF16 for FIDE rating submission
- Excel (.xlsx) and CSV for any list/table

---

## Navigation & Structure

- **Multi-tournament tabs:** Multiple tournaments open simultaneously
- **Navigation within a tournament:** Rounds and Standings as primary views.
  Player management, tournament settings, reports accessible as secondary areas.
- **Round navigation:** Navigate between rounds within the Rounds view
- **Keyboard shortcuts:** Cmd/Ctrl + N (new), O (open), S (save), T (new tab), W
  (close tab)

---

## Key States & Flows

### Tournament lifecycle

1. Create tournament (select type, configure metadata, scoring, pairing system)
2. Add players (manual, import, or from rating list). For teams: create teams,
   assign players.
3. Start tournament
4. Per round: pair round → enter results → (repeat)
5. After final round: view final standings, generate reports, export TRF

### Result entry (most frequent interaction — happens 50+ times per round)

- The three common results (1-0, draw, 0-1) must be enterable in a single action
- Forfeit and bye results are less common but must be accessible
- Results must be changeable and clearable after entry
- Keyboard entry must be supported for speed

### Player withdrawal

- Select player → choose rounds to exclude or withdraw entirely
- Player receives appropriate bye type
- Player can be reactivated later

---

## Data Integrity

- Cannot start with fewer than 2 players
- Cannot delete a paired player (withdraw instead)
- Warning when pairing with missing results from previous round (overridable)
- Board results must match team total (team events)
- Sorting criteria locked after first round is paired
- Undo last pairing (regenerate previous state)
- Correct results from any past round

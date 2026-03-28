# Kx8ble — Product Requirements

## 1. Product Overview

Kx8ble (pronounced "crosstable") is a cross-platform desktop application for managing chess tournaments. It targets tournament arbiters and club directors running events from casual club nights to FIDE-rated championships.

**Platform:** Tauri v2 (macOS, Windows, Linux)
**Architecture:** Offline-first with optional export capabilities
**Core engine:** `@echecs/*` library ecosystem for pairing, tiebreaks, and tournament orchestration

---

## 2. Tournament Types

### 2.1 Individual Swiss
The primary tournament format. Players are paired each round based on score, rating, and color history following FIDE Swiss rules.

### 2.2 Individual Round-Robin
All participants play each other. Supports single, double, and triple round-robin. Pairings for all rounds are generated at once based on the Berger tables.

### 2.3 Team Swiss
Teams (with configurable board count) are paired each round. Individual board pairings are determined by team composition. Match results (team score) and board results (individual scores) are tracked separately.

### 2.4 Team Round-Robin
Teams play each other in round-robin format. Includes Scheveningen variant support.

---

## 3. Tournament Setup

### 3.1 Tournament Metadata
The following fields must be configurable at creation and editable at any point during the tournament:

| Field | Required | Notes |
|-------|----------|-------|
| Tournament name | Yes | Appears in exports and reports |
| Remarks | No | Free text, can include announcements |
| Organizer | No | Organization or individual |
| Website | No | URL |
| Email | No | Contact email |
| Time control | Yes | Free text (e.g., "90min + 30sec/move") |
| Time control type | Yes | Standard / Rapid / Blitz — affects rating rules |
| Tournament director | No | Name |
| Chief arbiter | No | Name + FIDE ID |
| Deputy chief arbiter | No | Name + FIDE ID |
| Additional arbiters | No | Names + FIDE IDs |
| Federation | Yes | Country code (ISO 3166-1 alpha-3) |
| Location | No | City, venue |
| Number of rounds | Yes | Editable until tournament starts (Swiss); auto-calculated (Round-Robin) |
| Start date | Yes | YYYY-MM-DD |
| End date | Yes | YYYY-MM-DD |
| Rated FIDE | Yes | Yes / No |
| Rated national | Yes | Yes / No |
| Number of boards | Yes (team) | For team events only |

### 3.2 Scoring System
Configurable point values for results:
- **Game points:** 1 / 0.5 / 0 (default)
- **Game points (football):** 3 / 1 / 0
- **Match points (team):** 2 / 1 / 0 or 3 / 1 / 0

### 3.3 Pairing Configuration
- **Pairing system selection:** Dutch (FIDE C.04.3), Dubov (C.04.4.1), Burstein (C.04.4.2), Lim (C.04.4.3), Double-Swiss (C.04.5), Swiss-Team (C.04.6)
- **First-round color:** Random (default), White, or Black for the top-seeded player
- **Acceleration:** Optional Baku acceleration for large Swiss events
- **Sort order for starting rank:** By national rating, international rating, maximum of both, national then international, or international only

### 3.4 Round Schedule
- Date and time per round
- Bulk fill (set one date/time and copy to all rounds)
- Editable at any point

### 3.5 Bye Points
- Configurable points for pairing-allocated bye (default: 1)

---

## 4. Player Management

### 4.1 Player Data Fields

| Field | Required | Notes |
|-------|----------|-------|
| Name (surname, first name) | Yes | Stored as separate fields |
| FIDE ID | No | Numeric, unique |
| National ID | No | Alphanumeric |
| Title | No | GM, IM, FM, WGM, WIM, WFM, CM, WCM |
| National rating | No | Numeric |
| International rating | No | Numeric (FIDE Elo) |
| Federation | No | 3-letter country code |
| Date of birth | No | YYYY-MM-DD |
| Sex | No | M / F |
| Club | No | Free text |
| K-factor | No | Numeric (for rating calculations) |
| Group | No | Free text — for custom categories |

### 4.2 Player Entry
- **Manual entry:** Enter player data field by field
- **Import from rating list:** Search FIDE standard/rapid/blitz lists or national rating lists by name or ID
- **Import from file:** Import player lists from Excel (.xlsx), CSV, or TRF files
- **Duplicate detection:** Warn when entering a player already in the tournament

### 4.3 Player Editing
- All player data fields editable at any time, including during the tournament
- Cannot delete a player who has been paired at least once — must withdraw instead

### 4.4 Starting Rank
- Automatically sorted based on the selected sorting criteria (see 3.3)
- Must be re-sorted when new players are added mid-tournament
- Manual override of starting rank order

### 4.5 Late Entry
- Players can be added after the tournament has started
- They receive zero-point byes for missed rounds (or half-point byes per tournament regulations)
- Starting rank must be re-sorted after adding late entries

---

## 5. Pairing

### 5.1 Automatic Pairing
- Generate pairings for the next round using the selected pairing system
- Display pairings with board number, white player, black player
- For round-robin: generate all rounds at once

### 5.2 Manual Pairing Overrides
- **Before pairing:** Set specific pairs manually, then pair the rest automatically
- **After pairing:** Modify existing pairings — swap players, change colors, remove pairings, add new pairs
- **Board order:** Reorder board numbers manually
- Manually altered pairings should be visually marked

### 5.3 Player Exclusion
- **Withdraw from specific rounds:** Player is not paired for selected rounds, receives zero-point bye (or half-point bye if tournament allows)
- **Withdraw from all remaining rounds:** Player is excluded from all future rounds
- **Reactivate:** Restore a withdrawn player for future rounds
- Half-point byes must be configurable per tournament (allowed or not)

### 5.4 Fixed Board Assignment
- Force a specific player to a specific board number

### 5.5 Club/Group Protection
- Prevent players from the same club or group from being paired against each other (configurable, can be lifted per round)

### 5.6 Pairings Checklist
For arbiter verification, display per player:
- Seed number
- Current points
- Color history (e.g., w-b-w-w-b)
- Due color
- Float status (upfloater/downfloater)
- Previous opponents (by rank number)

---

## 6. Result Entry

### 6.1 Result Types
All FIDE-recognized result types:

| Code | Description | White pts | Black pts | Rated |
|------|-------------|-----------|-----------|-------|
| 1-0 | White wins | 1 | 0 | Yes |
| 1/2-1/2 | Draw | 0.5 | 0.5 | Yes |
| 0-1 | Black wins | 0 | 1 | Yes |
| 1F-0F | White wins by forfeit | 1 | 0 | No |
| 0F-1F | Black wins by forfeit | 0 | 1 | No |
| 0F-0F | Double forfeit | 0 | 0 | No |

### 6.2 Bye Results
| Code | Description | Points | Rated |
|------|-------------|--------|-------|
| Pairing bye | Odd player, no opponent | 1 (configurable) | No |
| Half-point bye | Requested absence | 0.5 | No |
| Zero-point bye | Unexcused absence or withdrawal | 0 | No |
| Full-point bye | Full bye (special regulations) | 1 | No |

### 6.3 Result Editing
- Results can be changed at any time during the tournament
- Results can be cleared (set back to empty/unrecorded)
- Navigate between rounds while entering results
- Filter to show only boards with missing results

### 6.4 Team Results (Team Tournaments)
- Enter match result (team total) separately from individual board results
- Individual board results must sum to match result (validation)
- Forfeit at board level can optionally reduce team score by 0.5 (configurable)

---

## 7. Standings & Tiebreaks

### 7.1 Configurable Tiebreak Order
The arbiter selects which tiebreaks to use and in what priority order. The following tiebreak systems must be supported:

**Score-based:**
- Points (game points)
- Match points (team)

**Opponent-based:**
- Buchholz (with configurable variants: standard, cut-1, cut-2, median, average)
- Buchholz sum
- Sonneborn-Berger
- Direct encounter

**Performance-based:**
- Progressive score
- FIDE tiebreak (progressive)
- Rating average of opponents
- Rating performance
- Average recursive performance of opponents

**Other:**
- Greater number of victories
- Most games as black
- Arranz system (1 / 0.6 black draw / 0.4 white draw / 0)
- Koya system (round-robin)
- Manual input (for drawing of lots, playoff results)
- Playoff points

### 7.2 Buchholz Parameters
Configurable options for Buchholz calculation:
- Number of best/worst results to exclude (0-3 each)
- Treatment of unplayed games (forfeit, bye): calculate with 1/2 point / real points / draw against self / virtual opponent
- Weighting for unplayed games: real points / 1/2
- Include/exclude own points
- Handling of dropped players

### 7.3 Standings Display
- Rank, player name, rating, score, and all selected tiebreak values
- Visual distinction for 1st place
- Interim standings available at any point during the tournament
- Final standings after last round

### 7.4 Category Prizes
- **Age groups:** Configurable (e.g., U8, U10, U12, U14, U16, U18, U20, S50, S65) with cutoff date
- **Rating categories:** Configurable rating bands (e.g., 0-1400, 1401-1800, 1801-2000)
- **Custom categories:** Arbitrary grouping via the "Group" player field
- Display category prize winners with configurable number of places per category

---

## 8. Rating Calculations

### 8.1 FIDE Rating Calculations
- Calculate expected score per game
- Calculate rating change per player
- Display new rating estimate
- Distinguish Standard / Rapid / Blitz rating rules
- Handle unrated players (initial rating calculation)
- Respect K-factor per player

### 8.2 Title Norm Checking
- Check if any player achieved a GM, IM, WGM, or WIM norm
- Display norm requirements vs. actual performance
- "What result do I need?" preview before last round
- Generate FIDE Title Norm list

### 8.3 Rating Statistics
- Average rating of tournament
- Number of titled players
- Number of foreign federations
- Rating performance per player

---

## 9. Reports & Output

### 9.1 Printable Lists
All lists must be printable and exportable to Excel/CSV:

- Starting rank list (by seed number)
- Alphabetical player list
- Pairings list per round (with board numbers)
- Results list per round
- Interim/final standings
- Cross-table (player vs. player results matrix)
- Category prize winners
- Pairings checklist (for arbiter verification)
- Player info card (individual certificate with per-round results)
- Rating statistics

### 9.2 Print Customization
- Configurable columns (show/hide fields)
- Configurable font size and page layout
- Portrait/landscape orientation
- Filter by board range (e.g., boards 1-20 for one arbiter)
- Save custom list templates for reuse

### 9.3 FIDE Reports
- **TRF16 export:** Standard FIDE Tournament Report File for rating submission
- **IT3 report:** FIDE Tournament Report form
- **Title norm reports:** FA1, IA1 norm report forms

---

## 10. File I/O

### 10.1 Native Format
- Save/load tournament state to `.echecs` JSON files via Tauri FS plugin
- Auto-save on pairing and result entry
- Backup files created automatically on save (configurable count)

### 10.2 TRF Import/Export
- **Import:** Load tournament from TRF16 file — players, results, pairings, metadata
- **Export:** Generate TRF16 file for FIDE rating submission
- Preserve TRF source data for round-trip fidelity

### 10.3 Data Import
- **Excel import:** Import player lists from .xlsx files
- **CSV import:** Import player lists from .csv files
- **Rating list import:** Import FIDE rating lists (standard, rapid, blitz) for player lookup
- **National rating list import:** Import federation-specific rating lists

### 10.4 Data Export
- **Excel export:** Export any list/table to .xlsx
- **CSV export:** Export any list/table to .csv

---

## 11. User Interface

### 11.1 Navigation
- Tab-based multi-tournament support (multiple tournaments open simultaneously)
- Sidebar navigation: Rounds, Standings (visible when tournament is active)
- Round selector for navigating between rounds

### 11.2 Keyboard Shortcuts
- `Cmd/Ctrl + N` — New tournament
- `Cmd/Ctrl + O` — Open tournament file
- `Cmd/Ctrl + S` — Save tournament
- `Cmd/Ctrl + T` — New tab
- `Cmd/Ctrl + W` — Close tab
- Result entry shortcuts: `1` = 1-0, `2` = 1/2-1/2, `3` = 0-1, `4` = 1F-0F, `5` = 0F-1F, `6` = 0F-0F, `0` = clear

### 11.3 Theming
- System-aware light/dark mode (follows OS preference)

### 11.4 Desktop Integration
- Native file dialogs for open/save
- Native window management
- Drag-and-drop file opening

### 11.5 Error Handling
- Confirmation dialogs for destructive actions (close unsaved tournament, delete player, undo pairings)
- Error boundary with recovery UI
- Validation messages for invalid operations (e.g., pairing with fewer than 2 players)

---

## 12. Data Integrity

### 12.1 Validation Rules
- Cannot start tournament with fewer than 2 players
- Cannot delete a player who has been paired
- Cannot pair a round if previous round has missing results (warning, overridable)
- Board results must match team total (team events)
- Cannot change sorting criteria after first round is paired

### 12.2 Undo / Correction
- Undo last pairing (regenerate previous round's state)
- Correct results from any past round
- Clear all results from a round

### 12.3 Backup
- Automatic backup on save and on pairing
- Configurable number of backup files kept
- Backup files restorable from within the app

---

## 13. Localization

### 13.1 Language Support
- English (primary)
- Architecture must support localization (i18n-ready string externalization)
- RTL layout support not required initially

### 13.2 Character Support
- Unicode support for player names (Cyrillic, Arabic, CJK, etc.)
- Latin-alphabet transliteration for FIDE reports

---

## 14. Performance

### 14.1 Scale Targets
- Smooth operation with up to 1,000 players in a single tournament
- Pairing generation under 2 seconds for 500 players
- Standings calculation under 1 second for 500 players with 5 tiebreaks
- File save/load under 1 second for typical tournament sizes

---

## 15. Non-Functional Requirements

### 15.1 Platform
- macOS (Apple Silicon + Intel)
- Windows 10/11
- Linux (AppImage or .deb)

### 15.2 Offline Operation
- Full functionality without internet connection
- Optional internet for rating list downloads and file export to external services

### 15.3 Data Privacy
- All tournament data stored locally
- No telemetry or analytics
- No cloud storage or sync

### 15.4 Accessibility
- Keyboard-navigable interface
- Screen reader compatibility for core workflows
- Minimum WCAG AA contrast ratios

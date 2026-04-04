# Backlog

Last updated: 2026-03-29

## High

- [ ] Context updates — tournament metadata fields (organizer, location, dates,
      time control) use local `useState`. Need `updateMetadata` in
      `tabs-context.tsx` to persist across screens. Player
      withdrawal/reactivation not wired.
- [ ] Remove `.echecs` format — replace with TRF26 as native save format.
      Currently `src/lib/file.ts` uses a custom JSON format. Requires
      `@echecs/trf` to support all needed fields (tiebreak tags 202/212, etc.)
      before switching.
- [ ] TUNX file import — reverse engineer Swiss-Manager `.TUNX` binary format
      into `@echecs/swiss-manager` package, then wire into `src/lib/file.ts`.
      Three sample files available in `~/Downloads/`.

## Medium

- [ ] Result editing — `@echecs/tournament` appends games instead of replacing.
      Current workaround: reconstruct via `Tournament.fromJSON()`. Library needs
      `updateResult` API.
- [ ] Forfeit/bye distinction — UI shows forfeit options but they map to same
      numeric values. Library needs `GameKind` support in result recording.
- [ ] Clear result — cannot undo a recorded result (no `clearResult` API in
      library). "Not played" option hidden after result is set.
- [ ] Tiebreak persistence — tiebreak config stored in tab state, lost on
      save/load. Blocked on `@echecs/tournament` adding tiebreak IDs to
      `TournamentSnapshot` and `@echecs/trf` parsing tags 202/212. TODOs filed
      in both packages.

## Low

- [ ] Team tournaments (Swiss and round-robin).
- [ ] Individual round-robin support.
- [ ] Rating calculations and title norm checking.
- [ ] Reports/printing, Excel/CSV import/export.
- [ ] Category prizes (age groups, rating bands).
- [ ] Player exclusion from specific rounds (half-point byes).
- [ ] Manual pairing overrides.
- [ ] Pairings checklist (color history, floats, opponents).

## Done (this session)

- [x] Tiebreak configuration UI — 8 tiebreak systems, add/remove/reorder,
      FIDE-aligned defaults, dynamic standings columns.
- [x] Responsive 2-column layout for Tournament Setup on wide screens.

## Tech Debt

- [ ] `react-hooks/exhaustive-deps` warning in `tabs-context.tsx:180`
      (unnecessary `getReferences` dependency).
- [ ] `Tournament.fromJSON(snapshot, dutch)` hardcodes Dutch pairing system —
      should use the tournament's configured system.
- [ ] Stale LSP errors referencing deleted files (editor-only, build is clean).
      Delete orphan files: `sidebar.tsx`, `tab-bar.tsx`, `home-page.tsx`,
      `setup-page.tsx`, `round-view.tsx`.

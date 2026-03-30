# Backlog

Last updated: 2026-03-29

## High

- [ ] Tiebreak configuration UI — currently hardcoded to Buchholz only
      (`tabs-context.tsx:88`). Needs split-panel selection/ordering UI.
- [ ] Context updates — tournament metadata fields (organizer, location, dates,
      time control) use local `useState`. Need `updateMetadata` in
      `tabs-context.tsx` to persist across screens. Player
      withdrawal/reactivation not wired.
- [ ] TUNX file import — wire `@echecs/tunx` into `src/lib/file.ts`, add
      `.TUNX` to file picker.

## Medium

- [ ] Result editing — `@echecs/tournament` appends games instead of replacing.
      Current workaround: reconstruct via `Tournament.fromJSON()`. Library needs
      `updateResult` API.
- [ ] Forfeit/bye distinction — UI shows forfeit options but they map to same
      numeric values. Library needs `GameKind` support.
- [ ] Clear result — cannot undo a recorded result (no `clearResult` API in
      library).

## Low

- [ ] Team tournaments, round-robin format support.
- [ ] Rating calculations, title norm checking.
- [ ] Reports/printing, Excel/CSV import/export.

## Tech Debt

- [ ] `react-hooks/exhaustive-deps` warning in `tabs-context.tsx:177`
      (unnecessary `getReferences` dependency).
- [ ] `Tournament.fromJSON(snapshot, dutch)` hardcodes Dutch pairing system.
- [ ] Stale LSP errors referencing deleted files (editor-only, build is clean).

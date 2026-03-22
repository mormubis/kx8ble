# AGENTS.md

Agent guidance for **Kx8ble** — a desktop chess tournament management
application built with Tauri v2 + React + TypeScript.

See the root `AGENTS.md` for workspace-wide conventions (TypeScript settings,
formatting, naming, ESLint rules).

---

## Project Overview

Kx8ble (pronounced "crosstable") is a desktop application for running chess
tournaments. It uses Tauri v2 for the desktop runtime, React 19 for the UI,
Tailwind CSS + shadcn/ui for styling, and TanStack Table for data grids.

The app consumes `@echecs/tournament` for tournament orchestration and
`@echecs/swiss` for pairing systems, standings, and tiebreaks. File I/O uses
Tauri's file system and dialog plugins.

---

## Commands

### Development

```bash
pnpm tauri dev          # start Tauri app in dev mode (hot reload)
pnpm dev                # start Vite dev server only (no Tauri window)
```

### Build

```bash
pnpm tauri build        # build the desktop application binary
pnpm build              # build frontend only (tsc + vite build)
```

### Lint & Format

```bash
pnpm lint               # ESLint + tsc --noEmit (auto-fixes)
pnpm lint:ci            # strict — zero warnings, no auto-fix
pnpm format             # Prettier --write
pnpm format:ci          # Prettier check only
```

---

## Tech Stack

| Layer    | Technology                           |
| -------- | ------------------------------------ |
| Runtime  | Tauri v2 (Rust backend)              |
| Frontend | React 19 + TypeScript                |
| Styling  | Tailwind CSS v4 + shadcn/ui          |
| Tables   | TanStack Table                       |
| Bundler  | Vite                                 |
| State    | React Context + @echecs/tournament   |
| File I/O | tauri-plugin-fs, tauri-plugin-dialog |

---

## Architecture Notes

- **Frontend-heavy**: all tournament logic runs in the browser via
  `@echecs/tournament` and `@echecs/swiss` npm packages. The Rust backend is
  minimal — it only provides the Tauri runtime and file system access.
- **No database**: tournament state is held in memory (Tournament class) and
  persisted to `.echecs` JSON files via Tauri FS plugin.
- **shadcn/ui components** live in `src/components/ui/`. Add new components with
  `pnpm dlx shadcn@latest add <component>`.
- **Path aliases**: `@/` maps to `src/` in both TypeScript and Vite.
- **ESM-only**: `"type": "module"` in package.json.

---

## File Structure

```
kx8ble/
  src-tauri/
    src/
      main.rs            # Tauri entry point (generated, do not edit)
      lib.rs             # Plugin registration
    Cargo.toml           # Rust dependencies
    tauri.conf.json      # Tauri configuration
    capabilities/        # Permission capabilities
  src/
    main.tsx             # React entry point
    app.tsx              # Root component
    index.css            # Tailwind CSS entry
    components/
      ui/                # shadcn/ui components
    context/             # React context providers
    lib/                 # Utility functions
    types/               # App-specific types
  index.html
  vite.config.ts
  tsconfig.json
  package.json
```

---

## FIDE Packages Used

| Package              | Purpose                             |
| -------------------- | ----------------------------------- |
| `@echecs/tournament` | Tournament lifecycle orchestration  |
| `@echecs/swiss`      | Dutch pairing, standings, tiebreaks |

---

## Naming Conventions

Same as the root `AGENTS.md` plus:

| Construct        | Convention       | Examples                   |
| ---------------- | ---------------- | -------------------------- |
| React components | `PascalCase.tsx` | `RoundView.tsx`, `App.tsx` |
| Hooks            | `camelCase.ts`   | `useTournament.ts`         |
| Context files    | `PascalCase.tsx` | `TournamentContext.tsx`    |
| Utility files    | `camelCase.ts`   | `utilities.ts`, `file.ts`  |

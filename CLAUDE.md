# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server at http://localhost:3000
npm run build      # Type-check + production build
npm run type-check # TypeScript check only
npm run preview    # Preview production build
```

## Architecture

**Entry flow**: `index.html` → `src/main.ts` → `src/App.vue`

- `src/plugins/` — Plugin registration. Add new Vue plugins here and register them in `index.ts`.
- `src/styles/settings.scss` — Vuetify SCSS variable overrides (theme tokens, breakpoints).
- `src/components/` — Feature components. Currently only `BusanSafeMap.vue`.

**Kakao Maps SDK** is loaded via CDN script tag in `index.html` (global `kakao` object). The `kakao` namespace is not typed — use `// @ts-ignore` or extend the global type if needed.

**Vuetify** is configured with `autoImport: true` in `vite.config.mts`, so Vuetify components do not need to be manually imported in `.vue` files.

**Path alias**: `@` resolves to `src/`.

## Key Constraints

- Kakao Maps API key is hardcoded in `index.html`. Keep it there for now; do not move it to `.env` without also updating the script src loading strategy.
- `BusanSafeMap.vue` uses `<script setup>` without `lang="ts"`. When adding TypeScript, add `lang="ts"` to the script block.
- Vuetify theme defaults to `system` (respects OS dark/light mode).

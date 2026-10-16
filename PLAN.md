# News Aggregator — Implementation Plan

Innoscripta SE Frontend Developer case study.

## Requirements checklist

| #   | Requirement                                               | Phase |
| --- | --------------------------------------------------------- | ----- |
| F1  | Search articles by keyword                                | 3     |
| F2  | Filter results by date, category, source                  | 3     |
| F3  | Personalized feed: preferred sources, categories, authors | 4, 5  |
| F4  | Mobile-responsive design                                  | 2, 6  |
| F5  | Clean, easy-to-read article display                       | 2, 6  |
| D1  | At least 3 data sources                                   | 1     |
| T1  | React + TypeScript                                        | 0     |
| T2  | Containerized with Docker                                 | 7     |
| T3  | Clear docs for running in Docker                          | 8     |
| T4  | DRY, KISS, SOLID                                          | all   |

## Decisions

- **Providers:** The Guardian, New York Times, NewsAPI.org.
- **Provider → outlet model:** users see outlets (The Guardian, NYT, BBC, Reuters, …). NewsAPI outlets come from `/sources`; ~10 curated defaults, full list selectable via multi-select in preferences (max 20 per request).
- **NewsAPI caveats:** `sources` can't be combined with `category` → map categories to outlets via each outlet's category. Free plan `/everything` is delayed ~24h and covers the last month → date picker constrained, documented.
- **Author filtering:** client-side on merged results (no provider supports it well).
- **Keys & CORS:** nginx reverse proxy in the container injects API keys at runtime; keys never ship in the JS bundle. Vite dev server uses the same proxy paths.
- **Stack:** Vite, React, TypeScript (strict), React Router, `@tanstack/react-query` v5, Zustand (persisted prefs), HeroUI + Tailwind, Framer Motion, Vitest + Testing Library, ESLint + Prettier.

## Architecture

```
src/
  domain/        Article, ArticleQuery, Outlet, Category types
  providers/     NewsProvider interface + guardian/, nyt/, newsapi/ adapters, registry
  services/      aggregator (fan-out, merge, sort, dedupe, partial-failure)
  features/      search/, feed/, preferences/, onboarding/
  components/    shared UI (ArticleCard, FilterChips, …)
  lib/           http client, date utils
```

- `NewsProvider` interface: `search(query): Promise<ProviderResult>` + `capabilities` (which filters it supports).
- Adding a provider = new adapter + registry entry (open/closed).
- UI depends on hooks → aggregator → interface, never on a concrete API (dependency inversion).
- Aggregator tolerates individual provider failures and reports them to the UI.

## UX direction

Approved mockups: "newsstand" direction. Each card has an outlet-coloured spine; Newsreader + Schibsted Grotesk; cool grey paper, navy ink, cobalt accent. Name: **Briefly**. Feeds stay strictly newest-first.

### UX checklist

| Agreed point                                                    | Status                                 |
| --------------------------------------------------------------- | -------------------------------------- |
| Serif headlines, large lead story                               | Done (Phase 2)                         |
| Mixed-size card grid                                            | Done (polish)                          |
| Outlet favicon + colour spine                                   | Done (polish)                          |
| Card-shaped skeletons, empty/error states, dark mode            | Done (Phase 2)                         |
| Reading time (Guardian and NYT only; NewsAPI has no word count) | Done (polish)                          |
| 44px tap targets                                                | Done (polish), keep checking per phase |
| Page transitions (View Transitions, no extra dependency)        | Done (polish)                          |
| ⌘K opens search                                                 | Phase 3                                |
| Removable filter chips, shareable URL                           | Phase 3                                |
| Mobile filter sheet                                             | Phase 3                                |
| Infinite scroll                                                 | Phase 3                                |
| Follow an author from a card                                    | Phase 4                                |
| First-visit picker: topics, outlets, authors                    | Phase 5                                |
| Pull to refresh                                                 | Phase 6                                |

Animation note: HeroUI v3 doesn't ship Framer Motion. Use CSS/View Transitions and HeroUI's built-in overlay animations; add `motion` only if a specific interaction needs it.

## Phases (one PR each)

0. **Scaffold** — Vite + TS, Tailwind + HeroUI, lint/format/test, folder structure, `.env.example`, CI (lint, typecheck, test, build).
1. **Data layer** — domain types, 3 adapters, outlet catalog, aggregator, unit tests for mappings.
2. **Design system** — tokens, typography, layout shell, ArticleCard, skeletons, dark mode.
3. **Search** — keyword, date range, category, source filters; URL state; ⌘K; filter chips; mobile filter sheet; infinite scroll; empty/error/partial states.
4. **Preferences** — sources (multi-select), categories, authors; persisted; follow author from a card.
5. **Feed + onboarding** — personalized home built from preferences; first-run picker (topics, outlets, suggested authors).
6. **Mobile & polish** — pull to refresh, a11y pass, Lighthouse.
7. **Docker** — multi-stage build → nginx with API proxy, runtime env keys, docker-compose.
8. **Docs** — README: setup, Docker, architecture, decisions, limitations.

## Workflow

Feature branch per phase → PR → review (`/code-review`) → squash merge into `main`.

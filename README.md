# Briefly — news aggregator

Briefly brings the latest stories from **The Guardian**, **The New York Times** and **80 outlets via NewsAPI.org** (BBC News, Associated Press, Al Jazeera, Bloomberg, The Verge, Wired…) into one clean, mobile-first reader. Search and filter everything, or open a personal briefing built from the outlets, topics and writers you follow.

Built for the Innoscripta SE frontend case study with **React 19 + TypeScript**, **HeroUI v3 + Tailwind CSS v4** and **TanStack Query**, and shipped as a **Docker** image.

---

## Contents

- [Quick start (Docker)](#quick-start-docker)
- [Local development](#local-development)
- [Requirements coverage](#requirements-coverage)
- [Features](#features)
- [Architecture](#architecture)
- [Design decisions](#design-decisions)
- [DRY, KISS and SOLID in the code](#dry-kiss-and-solid-in-the-code)
- [Quality](#quality)
- [Known limitations](#known-limitations)
- [Tech stack](#tech-stack)

---

## Quick start (Docker)

You need Docker (with Compose) and three free API keys.

**1. Get the API keys** (each takes a couple of minutes):

| Provider       | Where                                                                                                                                  | Free tier          |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| The Guardian   | [open-platform.theguardian.com/access](https://open-platform.theguardian.com/access/) → _Register for a developer key_ (sent by email) | 500 requests/day   |
| New York Times | [developer.nytimes.com](https://developer.nytimes.com/) → sign up → _Apps_ → _New App_ → enable **Article Search API** → copy the key  | 10 requests/minute |
| NewsAPI.org    | [newsapi.org/register](https://newsapi.org/register) (key shown on the dashboard)                                                      | 100 requests/day   |

**2. Add them to `.env`:**

```bash
cp .env.example .env
# then fill in GUARDIAN_API_KEY, NYT_API_KEY and NEWSAPI_API_KEY
```

**3. Build and run:**

```bash
docker compose up -d --build
```

Open **http://localhost:8080**. The container reports `healthy` once nginx is serving (`docker compose ps`), and `http://localhost:8080/healthz` returns `ok`.

Stop it with `docker compose down`.

<details>
<summary>Without Compose</summary>

```bash
docker build -t briefly-news .
docker run --rm -p 8080:8080 --env-file .env briefly-news
```

Keys can also be passed individually with `-e GUARDIAN_API_KEY=… -e NYT_API_KEY=… -e NEWSAPI_API_KEY=…`.

</details>

### What the container does

```
Browser ──▶ nginx (port 8080, non-root)
             ├─ /                 → static app (SPA fallback to index.html)
             ├─ /api/guardian/*   → content.guardianapis.com   (+ api-key)
             ├─ /api/nyt/*        → api.nytimes.com/svc/search/v2 (+ api-key)
             ├─ /api/newsapi/*    → newsapi.org/v2              (+ X-Api-Key header)
             └─ /healthz          → 200 ok
```

- **Keys are injected at container start**, not at build time: the nginx image renders `docker/nginx.conf.template` with `envsubst`, limited to the three `*_API_KEY` variables. They never end up in the image or in the JavaScript bundle.
- Each proxy route has a fixed upstream host, so it can't be used to reach arbitrary URLs.
- The image is multi-stage (`node:22-alpine` builds, `nginx-unprivileged` serves), so the runtime contains only nginx and the static files.
- Hashed assets are cached for a year (`immutable`), `index.html` is always revalidated, responses are gzipped, and basic security headers are set.

---

## Local development

Requires **Node 22**.

```bash
npm ci
cp .env.example .env   # same keys as above
npm run dev            # http://localhost:5173
```

The Vite dev server runs **the same proxy** as nginx (`vite.config.ts`), so the browser never sees the keys in development either.

| Script                            | What it does                                              |
| --------------------------------- | --------------------------------------------------------- |
| `npm run dev`                     | Dev server with hot reload and API proxy                  |
| `npm run build`                   | Typecheck and production build to `dist/`                 |
| `npm run preview`                 | Serve the production build locally (with the proxy)       |
| `npm test`                        | Unit and component tests (Vitest + Testing Library)       |
| `npm run lint`                    | oxlint, warnings fail the run                             |
| `npm run format` / `format:check` | oxfmt (Oxc formatter; sorts imports and Tailwind classes) |
| `npm run typecheck`               | `tsc` in strict mode                                      |

---

## Requirements coverage

| Requirement                                     | Where                                                                                                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Search articles by keyword                      | Explore page: keyword search with highlighted matches (`src/features/explore`)                                                                                      |
| Filter by date, category and source             | Date presets + custom range, category checkboxes, searchable list of 80 outlets; all kept in the URL                                                                |
| Personalized feed: sources, categories, authors | First-visit picker, _You_ page, follow buttons on every article; **For you** feed + "From writers you follow" row (`src/features/feed`, `src/features/preferences`) |
| Mobile-responsive design                        | Mobile-first layout, bottom tab bar, filter bottom sheet, pull to refresh, 44px tap targets                                                                         |
| At least 3 data sources                         | The Guardian, New York Times, NewsAPI.org (`src/providers`)                                                                                                         |
| React + TypeScript                              | React 19, TypeScript in `strict` mode                                                                                                                               |
| Docker + documentation                          | `Dockerfile`, `docker-compose.yml`, `docker/nginx.conf.template`, this README                                                                                       |
| DRY, KISS, SOLID                                | See [below](#dry-kiss-and-solid-in-the-code)                                                                                                                        |

---

## Features

**For you** (home)

- Built from your followed outlets and topics (falls back to curated picks), newest first
- Topic chips narrow the feed without changing your preferences
- **From writers you follow**: latest stories by followed authors, interleaved so one prolific writer can't fill the row
- Lead story plus a mixed-size grid; every card shows its outlet as a coloured spine with favicon, category, byline, relative time and reading time (where the API reports a word count)

**Explore** (search)

- Keyword search (commits as you pause typing) with highlighted matches
- Filters: date (Any time / Past 24 hours / Past week / Past month / custom range), category, source
- Active filters as removable chips, with _Clear all_
- Shareable URLs, e.g. `/explore?q=climate&from=2026-10-09&to=2026-10-16&cat=science&src=the-guardian`
- **⌘K / Ctrl+K** jumps to search from anywhere

**Personalization**

- First-visit picker: topics → outlets → suggested writers (all optional)
- _You_ page to edit outlets, topics and authors; reset asks for confirmation (bottom sheet on phones, modal on larger screens)
- **Follow** button on every article
- Saved in `localStorage` (no account needed)

**Everywhere**

- Infinite scroll with a _Load more_ fallback
- If one source fails (e.g. rate limited), the others still show, with a notice saying what's missing
- Card-shaped loading skeletons, helpful empty and error states
- Light and dark themes (follows the system, remembers your choice, no flash on load)
- Page transitions via the View Transitions API, disabled for reduced-motion users

---

## Architecture

```
src/
├── domain/        Provider-agnostic types: Article, ArticleQuery, Outlet, categories
├── providers/     One adapter per API + the NewsProvider contract and registry
│   ├── guardian/
│   ├── nyt/
│   └── newsapi/
├── services/      Aggregator: fan-out, merge, de-duplicate, author filter, sort
├── hooks/         TanStack Query hooks (infinite articles, outlets, author stories, …)
├── features/      Pages and their parts: feed, explore, preferences, onboarding, profile
├── components/    Shared UI: article cards, pickers, layout shell, dialogs, chips
├── lib/           Small pure helpers: http, dates, text, highlight, colours
└── app/           Router and query client
```

### Data flow

```
UI (feature hooks)
   │  ArticleQuery { keyword, from, to, categories, outletIds, authors, page }
   ▼
Aggregator ── Promise.allSettled ──▶ NewsProvider × 3
   │                                   ├─ guardianProvider  → /api/guardian
   │                                   ├─ nytProvider       → /api/nyt
   │                                   └─ newsApiProvider   → /api/newsapi
   ▼
{ articles: Article[] (merged, de-duplicated, newest first), failures: ProviderFailure[] }
```

Every adapter implements one small interface:

```ts
interface NewsProvider {
  readonly id: ProviderId
  readonly name: string
  listOutlets(signal?: AbortSignal): Promise<Outlet[]>
  search(query: ArticleQuery, signal?: AbortSignal): Promise<Article[]>
}
```

Each adapter translates the shared `ArticleQuery` into its API's parameters and converts the response into the shared `Article` shape. The UI never imports an adapter directly.

**Adding a fourth source** means writing one adapter file and adding one line to `src/providers/index.ts`. Nothing else changes.

---

## Design decisions

| Decision                                                   | Why                                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **API keys behind a proxy** (nginx in Docker, Vite in dev) | Keeps keys out of the bundle, and works around NewsAPI's free plan, which rejects browser requests from any origin other than localhost.                                                                                                                                        |
| **Providers vs outlets**                                   | Users think in publications, not APIs. The Guardian and NYT are one outlet each; NewsAPI contributes 80, loaded from its `/sources` endpoint. Twelve well-known outlets are used until the user picks their own.                                                                |
| **Categories mapped per provider**                         | One set of app categories (World, Business, Technology, Science, Health, Sports, Culture) is mapped to Guardian sections, NYT section names and NewsAPI source categories. NewsAPI can't combine `sources` with `category`, so categories narrow the requested outlets instead. |
| **Author following**                                       | No API filters by author. The Guardian supports byline search (`query-fields=byline`), NYT's keyword search covers bylines, and NewsAPI falls back to a phrase match. Results are always checked against the byline before they're shown.                                       |
| **Partial failure is normal**                              | Free tiers are rate limited, so the aggregator uses `Promise.allSettled`. One failing source never blanks the page, and the UI says which one is missing.                                                                                                                       |
| **Search state in the URL**                                | Results are shareable, survive reloads and work with back/forward.                                                                                                                                                                                                              |
| **Preferences in `localStorage`** (Zustand `persist`)      | The brief has no backend; this keeps personalization instant and private.                                                                                                                                                                                                       |
| **Strictly newest-first**                                  | Predictable ordering, as agreed for this project.                                                                                                                                                                                                                               |
| **TanStack Query**                                         | Caching (5 minutes fresh), request cancellation and infinite pagination, tuned to avoid wasting rate-limited requests (no refetch on window focus).                                                                                                                             |
| **Code splitting**                                         | The feed ships in the main bundle; Explore, You and onboarding load on demand (main bundle about 110 KB gzip).                                                                                                                                                                  |

---

## DRY, KISS and SOLID in the code

- **Single responsibility**: adapters only translate requests and responses; the aggregator only merges; hooks only fetch and cache; components only render.
- **Open/closed**: new sources plug into the `NewsProvider` registry without touching the aggregator or the UI.
- **Liskov substitution**: every provider is interchangeable behind `NewsProvider`; the aggregator tests use fake providers.
- **Interface segregation**: the provider contract is two methods; components take only the props they use (e.g. `ArticleMeta`, `OutletFavicon`).
- **Dependency inversion**: the UI depends on the aggregator and the `NewsProvider` abstraction (`createAggregator(providers)`), never on fetch details or a specific API.
- **DRY**: one `FilterPanel` serves the desktop sidebar and the mobile sheet; one outlet picker and one category picker serve search, preferences and onboarding; shared `ToggleChip`, `ConfirmDialog`, `getJson` and category maps.
- **KISS**: no backend, no global store beyond preferences, plain functions for mapping, and small hooks instead of abstractions that aren't needed yet.

---

## Quality

- **Tests**: 65 unit and component tests covering each adapter's mapping, aggregator merge/failure/de-duplication, URL state, date presets, byline parsing, the preferences store, follow and pull-to-refresh behaviour, and routing.
- **CI** (GitHub Actions): lint, format check, typecheck, tests and build on every PR, plus a job that builds the Docker image and smoke-tests it.
- **Lighthouse (mobile, production build)**: Accessibility 100, Best Practices 100, SEO 100 on the feed and preferences pages.
- **Performance** (4× CPU throttling, Fast 4G): LCP about 1.5 s, CLS 0.05.
- **Accessibility**: every outlet colour meets WCAG AA contrast in both themes, the whole card is clickable with a single link per article, labels match visible text, there's a skip link, focus rings are visible, and reduced motion is respected.

---

## Known limitations

These come from the free API tiers, not the app:

- **NewsAPI.org**: articles are delayed by about a day and searchable for roughly the last month (older date ranges skip NewsAPI); 100 requests/day; at most 100 results per query and 20 outlets per request.
- **New York Times**: 10 requests/minute. Heavy use triggers `429 Too Many Requests`; the app shows the other sources plus a notice until the limit resets.
- **Result counts** are shown as a lower bound ("50+"), because each API counts differently.
- **Bylines** vary: NewsAPI often omits them or sends a URL, so following works best for Guardian, NYT and tech-press writers.
- **Reading time** is only available for The Guardian and NYT (NewsAPI doesn't report word counts).

---

## Tech stack

React 19 · TypeScript 6 (strict) · Vite 8 · HeroUI v3 · Tailwind CSS v4 · TanStack Query v5 · React Router 7 · Zustand · lucide-react · Vitest + Testing Library · oxlint + oxfmt · Docker (nginx-unprivileged)

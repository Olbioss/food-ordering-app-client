# MernEats Complete Visual Redesign — Design Spec

**Date:** 2026-07-04
**Status:** Approved direction: Bold & energetic → "Super-App Rounded" language
**Scope:** Client only (`client/`), presentation layer only — zero behavioral changes

## Goal

Replace the current generic orange-on-white template look with a distinctive, cohesive
"Super-App Rounded" identity (Getir/Glovo energy): big rounded cards, pill buttons,
saturated tangerine fills, floating organic shapes, friendly rounded typography.
Applied uniformly across all pages — customer pages get the full treatment, forms and
the restaurant dashboard get a calmer version of the same language.

Decisions made during brainstorming:

- **Aesthetic:** Bold & energetic (rejected: editorial, dark premium, minimal)
- **Language:** Super-App Rounded (rejected: Sticker-Pop, Kinetic Condensed) —
  chosen from visual mockups: https://claude.ai/code/artifact/7850c6b5-a8d7-4bbe-bcc2-6b9930a9c35b
- **Palette:** Evolved orange (keep orange identity, hotter and more confident)
- **Theme:** Light only; remove dark-mode scaffolding
- **Language/copy:** All Turkish copy stays exactly as-is

## Design system foundation

### Color tokens

Replace the shadcn slate palette in `src/index.css` (HSL values wired through the
existing CSS-variable system so all shadcn/Radix components pick them up):

| Token | Value | Role |
|---|---|---|
| `--primary` | `#FF5A1F` vivid tangerine | CTAs, hero, active states |
| `--primary-deep` (new) | `#E64A10` | Hover/pressed |
| `--accent-warm` (new) | `#FFB84D` amber | Blobs, highlights, secondary badges |
| `--background` | `#FFFAF3` warm cream | Page ground (not pure white) |
| `--card` | `#FFFFFF` | Cards float on cream via shadow |
| `--foreground` | `#33251A` warm ink | Text (brown-black, not blue-black) |
| `--muted-foreground` | `#8A715C` | Secondary text |
| `--destructive` | kept, warm-adjusted red | Semantic only — never brand accent |

Delete the `.dark { … }` variable block. Remove `next-themes` dependency and the
`sonner` theme wiring that depends on it.

### Typography

Via Fontsource (matches current loading pattern):

- **Display/headings:** Baloo 2 (weights 600–800) — `font-heading`
- **Body/UI:** Nunito Sans — `font-sans`
- Add `@fontsource/baloo-2`, `@fontsource/nunito-sans`;
  remove `@fontsource/fraunces`, `@fontsource/plus-jakarta-sans`; update `main.tsx` imports.

### Shape & elevation

- Cards: `rounded-3xl` (24px); hero container 28px; buttons + single-line inputs full pills.
- Cards are borderless; elevation from soft warm shadows `rgba(80,30,0,…)`.
- Extend Tailwind config: font families, radius scale, warm shadow presets.

### Motion (CSS-only, no new dependencies)

- Staggered fade-up on card grids at page load (`animation-delay`).
- Card hover: gentle scale + shadow lift. Buttons: `active:scale-95` press.
- Slow ambient drift on hero blobs.
- Everything behind `prefers-reduced-motion: reduce`.
- Custom keyframes in `tailwind.config.js` alongside `tailwindcss-animate`.

## Page-by-page treatment

### Layout / Header / Footer

- Header: cream bg, no orange border-bottom. `● MernEats` wordmark (tangerine, Baloo 2),
  muted warm-brown nav links, auth button as filled tangerine pill with soft glow.
  Mobile sheet nav kept, restyled.
- Footer: warm ink block, cream text, tangerine wordmark.
- Remove `Hero.tsx` full-width banner; hero moves into HomePage. `showHero` prop goes away.

### HomePage

- Rounded tangerine hero card: "Bugün ne yiyoruz?" in big Baloo 2, drifting amber
  blobs (CSS), white pill search bar with ink "Ara" button.
- Cuisine chip row below hero — pill chips linking to search filtered by cuisine
  (reuse `restaurant.options.config.ts` cuisine list).
- App-download section restyled as soft amber-tinted rounded panel.
- Replace `hero.png`, `landing.png`, `appDownload.png` usage with CSS treatment; delete assets.

### SearchPage

- `CuisineFilter`: horizontal pill chips (active = ink fill) replacing checkbox list.
- `SortOptionDropdown`: pill trigger.
- `SearchResultCard`: rounded-3xl white card — image with `~N dk` time pill overlaid
  bottom-left, name in Baloo 2, cuisines muted, rating + delivery price as amber pills.
- `PaginationSelector`: round pill buttons.

### DetailPage

- Restaurant image in rounded-3xl frame.
- `MenuItem`: card with pill add-to-cart affordance.
- `OrderSummary`: sticky white rounded card, tangerine item-count badge, pill checkout button.
- `StarRating` / `ReviewList` / `ReviewForm`: amber stars, rounded review cards.

### OrderStatusPage

- Progress bar is the hero: fat rounded track, tangerine fill, big Baloo 2 status heading,
  per-step badge from existing `order.status.config.ts`.
- `OrderStatusDetail` in soft rounded cards.

### Forms & dashboard (UserProfilePage, ManageRestaurantPage)

Calmer variant of the same language: white rounded-2xl section cards on cream,
pill inputs (rounded-full single-line, rounded-2xl textareas), tangerine pill submits,
`Tabs` as pill segmented control. No blobs, no oversized display type.

### Loading / AuthCallback

Branded tangerine dot-pulse spinner replacing plain text loading states.

## Implementation architecture (build order)

1. **Foundation:** `index.css` tokens, `tailwind.config.js`, font packages, `main.tsx`,
   remove `next-themes`.
2. **shadcn primitives** (`components/ui/`): `button`, `input`, `card`, `tabs`, `badge`,
   `select`, `dialog`, `sheet`, `progress`, `pagination`. Variant APIs unchanged —
   no call-site type changes.
3. **App components & pages:** Header/Footer/Layout → HomePage → SearchPage cluster →
   DetailPage cluster → OrderStatusPage → form pages. Each an independently verifiable chunk.
4. **Cleanup:** delete `Hero.tsx`, `hero.png`, `landing.png`, `appDownload.png`, dead classes.

### Out of scope / unchanged

Routes, API hooks, react-query logic, react-hook-form + Zod validation, Auth0 flow,
Turkish copy, component file structure, server.

## Verification

After each chunk: `pnpm build` + `pnpm lint` pass, then visual check of affected pages
in the dev server at 375px and desktop widths (mobile responsiveness from commit
`f1a5583` must not regress).

# MernEats "Super-App Rounded" Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reskin the entire MernEats client with the approved "Super-App Rounded" design system (spec: `docs/superpowers/specs/2026-07-04-merneats-redesign-design.md`) — tangerine/cream palette, Baloo 2 + Nunito Sans, pill buttons, rounded-3xl cards, CSS-only motion — with zero behavioral changes.

**Architecture:** Token-first: rewrite CSS variables and Tailwind config, then restyle the shadcn primitives once (every page inherits), then restyle app components page-cluster by page-cluster. Each task leaves the app building, linting, and visually correct.

**Tech Stack:** React 18 + TypeScript + Vite, Tailwind CSS 3 + shadcn/ui (Radix), Fontsource fonts, pnpm.

## Global Constraints

- **Zero behavioral changes**: routes, API hooks, react-query logic, react-hook-form + Zod validation, Auth0 flow, and component props/exports stay identical unless a task says otherwise.
- **All Turkish copy stays exactly as-is** (one exception: `LoadingButton`'s English "Please wait" becomes "Lütfen bekleyin").
- **Light theme only** — no `.dark` variables, no `darkMode` config, no `next-themes`.
- **No new runtime dependencies** except Fontsource font packages.
- **Verification for every task** (this project has no test runner; this is the test cycle):
  1. `pnpm build` → exits 0
  2. `pnpm lint` → exits 0
  3. Visual check in `pnpm dev` (http://localhost:5173) at 375px and desktop width — mobile responsiveness (commit `f1a5583`) must not regress.
- **Commit after every task.**
- All animations must be gated with Tailwind's `motion-safe:` variant.
- Brand colors only via tokens (`bg-primary`, `text-muted-foreground`, …) — never `orange-500`, `gray-50`, `blue-500` etc. literal Tailwind palette classes.
- Working directory: repo root `/Users/olbios/repos/deploys/food-ordering-app/client`.

---

### Task 1: Design-token foundation (CSS variables, Tailwind config, fonts)

**Files:**

- Modify: `package.json` (via pnpm commands), `src/main.tsx`, `src/index.css`, `tailwind.config.js`
- Delete: `src/components/ui/sonner.tsx` (unused — `main.tsx` imports `Toaster` from `"sonner"` directly; this wrapper is the only `next-themes` consumer)

**Interfaces:**

- Produces (used by ALL later tasks): Tailwind classes `bg-primary`, `bg-primary-deep`, `bg-accent`, `bg-secondary`, `bg-card`, `bg-background`, `text-foreground`, `text-muted-foreground`, `border-input`, `shadow-warm`, `shadow-warm-lg`, `shadow-glow`, `animate-fade-up`, `animate-drift`, `animate-drift-slow`, `font-heading` (Baloo 2), `font-sans` (Nunito Sans).

- [ ] **Step 1: Swap dependencies**

```bash
pnpm add @fontsource/baloo-2 @fontsource/nunito-sans
pnpm remove @fontsource/fraunces @fontsource/plus-jakarta-sans next-themes
```

- [ ] **Step 2: Delete the unused sonner wrapper**

```bash
rm src/components/ui/sonner.tsx
grep -rn "ui/sonner" src/   # must return nothing
```

- [ ] **Step 3: Replace font imports in `src/main.tsx`**

Replace lines 5–21 (the two Fontsource comment blocks and all `@fontsource/plus-jakarta-sans/*` and `@fontsource/fraunces/*` imports) with:

```tsx
// Fonts self-hosted via Fontsource (latin + latin-ext for Turkish glyphs).
// Body: Nunito Sans
import "@fontsource/nunito-sans/latin-400.css";
import "@fontsource/nunito-sans/latin-600.css";
import "@fontsource/nunito-sans/latin-700.css";
import "@fontsource/nunito-sans/latin-800.css";
import "@fontsource/nunito-sans/latin-ext-400.css";
import "@fontsource/nunito-sans/latin-ext-600.css";
import "@fontsource/nunito-sans/latin-ext-700.css";
import "@fontsource/nunito-sans/latin-ext-800.css";
// Headings: Baloo 2 (rounded display)
import "@fontsource/baloo-2/latin-600.css";
import "@fontsource/baloo-2/latin-700.css";
import "@fontsource/baloo-2/latin-800.css";
import "@fontsource/baloo-2/latin-ext-600.css";
import "@fontsource/baloo-2/latin-ext-700.css";
import "@fontsource/baloo-2/latin-ext-800.css";
```

Everything else in `main.tsx` stays unchanged (the `Toaster` import from `"sonner"` is correct and stays).

- [ ] **Step 4: Replace `src/index.css` entirely**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 35 100% 98%;
    --foreground: 26 32% 15%;
    --card: 0 0% 100%;
    --card-foreground: 26 32% 15%;
    --popover: 0 0% 100%;
    --popover-foreground: 26 32% 15%;
    --primary: 16 100% 56%;
    --primary-foreground: 0 0% 100%;
    --primary-deep: 16 87% 48%;
    --secondary: 32 68% 94%;
    --secondary-foreground: 26 32% 15%;
    --muted: 32 50% 93%;
    --muted-foreground: 27 20% 45%;
    --accent: 36 100% 65%;
    --accent-foreground: 26 32% 15%;
    --destructive: 4 74% 49%;
    --destructive-foreground: 0 0% 100%;
    --border: 30 35% 88%;
    --input: 30 35% 85%;
    --ring: 16 100% 56%;
    --radius: 1rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  html {
    @apply scroll-smooth;
  }
  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
  h1,
  h2,
  h3,
  h4 {
    @apply font-heading;
  }
}
```

(Token values are the spec's hex palette converted to HSL: `#FF5A1F` → `16 100% 56%`, `#E64A10` → `16 87% 48%`, `#FFB84D` → `36 100% 65%`, `#FFFAF3` → `35 100% 98%`, `#33251A` → `26 32% 15%`, `#8A715C` → `27 20% 45%`. The `.dark` block and `--chart-*` variables are gone.)

- [ ] **Step 5: Replace `tailwind.config.js` entirely**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Nunito Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        heading: [
          '"Baloo 2"',
          "ui-rounded",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      boxShadow: {
        warm: "0 4px 16px rgba(80, 30, 0, 0.08)",
        "warm-lg": "0 10px 28px rgba(80, 30, 0, 0.12)",
        glow: "0 6px 18px rgba(255, 90, 31, 0.35)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          deep: "hsl(var(--primary-deep))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(12px, -10px) scale(1.06)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        drift: "drift 9s ease-in-out infinite",
        "drift-slow": "drift 13s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

(`darkMode: ["class"]` and the `chart` colors are gone; `primary.deep`, shadows, and keyframes are new.)

- [ ] **Step 6: Verify**

```bash
pnpm build && pnpm lint
```

Expected: both exit 0. Then `pnpm dev`: app renders on cream background, headings in Baloo 2, body in Nunito Sans. Colors elsewhere still transitional (hardcoded orange classes remain until later tasks) — that's expected.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(redesign): new design tokens, fonts, and Tailwind foundation"
```

---

### Task 2: Restyle shadcn primitives + new Spinner

**Files:**

- Modify: `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, `src/components/ui/card.tsx`, `src/components/ui/tabs.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/progress.tsx`, `src/components/ui/pagination.tsx`, `src/components/ui/select.tsx`, `src/components/ui/dialog.tsx`, `src/components/ui/LoadingButton.tsx`
- Create: `src/components/ui/Spinner.tsx`

**Interfaces:**

- Consumes: Task 1 tokens.
- Produces: same exported component APIs as today (no prop/type changes). New: `Spinner` — `const Spinner: ({ label }: { label?: string }) => JSX.Element`, default export, default label `"Yükleniyor..."`. Later tasks import it as `import Spinner from "@/components/ui/Spinner"`.

- [ ] **Step 1: `button.tsx` — replace the `buttonVariants` cva call** (rest of file unchanged)

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 motion-safe:active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-glow hover:bg-primary-deep",
        destructive:
          "bg-destructive text-destructive-foreground shadow-warm hover:bg-destructive/90",
        outline:
          "border-2 border-input bg-card shadow-warm hover:border-primary hover:text-primary",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        ghost: "hover:bg-secondary hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
```

- [ ] **Step 2: `input.tsx` — replace the input `className` string**

```tsx
"flex h-11 w-full rounded-full border border-input bg-background px-4 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
```

- [ ] **Step 3: `card.tsx` — replace the `Card` className string**

```tsx
"rounded-3xl border-none bg-card text-card-foreground shadow-warm";
```

- [ ] **Step 4: `tabs.tsx` — pill segmented control.** Replace `TabsList` className:

```tsx
"inline-flex h-12 items-center justify-center rounded-full bg-secondary p-1.5 text-muted-foreground";
```

Replace `TabsTrigger` className:

```tsx
"inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 py-1.5 text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow";
```

- [ ] **Step 5: `badge.tsx` — replace the `badgeVariants` base string** (variants map unchanged except `outline`):

Base:

```tsx
"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
```

And change the `outline` variant to:

```tsx
outline: "border-input text-foreground",
```

- [ ] **Step 6: `progress.tsx` — fat rounded track.** Replace `ProgressPrimitive.Root` className:

```tsx
"relative h-4 w-full overflow-hidden rounded-full bg-primary/15";
```

Replace `ProgressPrimitive.Indicator` className:

```tsx
"h-full w-full flex-1 rounded-full bg-primary transition-all";
```

- [ ] **Step 7: `pagination.tsx` — active page = filled tangerine pill.** In `PaginationLink`, change the `buttonVariants` call to:

```tsx
buttonVariants({
  variant: isActive ? "default" : "ghost",
  size,
});
```

(Buttons are already pills after Step 1, so no other change needed.)

- [ ] **Step 8: `select.tsx` — pill trigger.** In the `SelectTrigger` className string, change the leading `"flex h-9 ... rounded-md border border-input ... px-3 ..."` portion so the trigger reads `h-11`, `rounded-full`, `px-4` instead of `h-9`, `rounded-md`, `px-3` (leave every other utility in that string untouched).

- [ ] **Step 9: `dialog.tsx` — rounded content.** In the `DialogContent` className string, replace `sm:rounded-lg` with `rounded-3xl` (and remove any plain `rounded-lg`/`border` tokens in that same string if present, keeping the rest).

- [ ] **Step 10: `LoadingButton.tsx` — replace entirely**

```tsx
import { Loader2 } from "lucide-react";
import { Button } from "./button";

const LoadingButton = () => {
  return (
    <Button disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Lütfen bekleyin
    </Button>
  );
};
export default LoadingButton;
```

- [ ] **Step 11: Create `src/components/ui/Spinner.tsx`**

```tsx
type Props = {
  label?: string;
};

const Spinner = ({ label = "Yükleniyor..." }: Props) => {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 py-16"
    >
      <span className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-3 w-3 rounded-full bg-primary motion-safe:animate-bounce"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </span>
      <span className="text-sm font-semibold text-muted-foreground">
        {label}
      </span>
    </div>
  );
};

export default Spinner;
```

- [ ] **Step 12: Verify**

```bash
pnpm build && pnpm lint
```

Expected: both exit 0. In `pnpm dev`: all buttons are pills (tangerine default with glow), inputs are cream pills, cards are borderless rounded-3xl with warm shadows.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat(redesign): restyle shadcn primitives as Super-App Rounded, add Spinner"
```

---

### Task 3: Header, navigation, Footer, Layout (remove Hero banner)

**Files:**

- Modify: `src/components/Header.tsx`, `src/components/MainNav.tsx`, `src/components/UserMenu.tsx`, `src/components/MobileNav.tsx`, `src/components/MobileNavLinks.tsx`, `src/components/Footer.tsx`, `src/layouts/Layout.tsx`, `src/routes.tsx`
- Delete: `src/components/Hero.tsx`, `src/assets/hero.png`

**Interfaces:**

- Consumes: Task 1 tokens, Task 2 Button.
- Produces: `Layout` no longer accepts `showHero` (prop removed from type AND all call sites in `routes.tsx` in this same task, so nothing breaks).

- [ ] **Step 1: Replace `src/components/Header.tsx`**

```tsx
import { Link } from "react-router-dom";
import MobileNav from "./MobileNav";
import MainNav from "./MainNav";

const Header = () => {
  return (
    <header className="py-4 md:py-5">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="flex items-baseline gap-1.5 text-2xl md:text-3xl font-bold tracking-tight text-primary font-heading"
        >
          <span aria-hidden className="text-base md:text-lg">
            ●
          </span>
          MernEats
        </Link>
        <div className="md:hidden">
          <MobileNav />
        </div>
        <div className="hidden md:block">
          <MainNav />
        </div>
      </div>
    </header>
  );
};
export default Header;
```

- [ ] **Step 2: Replace `src/components/MainNav.tsx`**

```tsx
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";
import UserMenu from "./UserMenu";
import { Link } from "react-router-dom";

const MainNav = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    <span className="flex space-x-4 items-center">
      {isAuthenticated ? (
        <>
          <Link
            to="/order-status"
            className="font-bold text-muted-foreground transition-colors hover:text-primary"
          >
            Sipariş Durumu
          </Link>
          <UserMenu />
        </>
      ) : (
        <Button onClick={() => loginWithRedirect()}>Giriş Yap</Button>
      )}
    </span>
  );
};
export default MainNav;
```

- [ ] **Step 3: `src/components/UserMenu.tsx` — class-only edits**
  - Trigger className → `"flex items-center px-3 font-bold transition-colors hover:text-primary gap-2"`
  - `<CircleUserRound className="text-orange-500" />` → `<CircleUserRound className="text-primary" />`
  - Both `Link` classNames → `"font-bold hover:text-primary"`
  - Logout `Button` className → `"flex flex-1 font-bold"` (drop `bg-orange-500`; default variant supplies the tangerine pill)

- [ ] **Step 4: `src/components/MobileNav.tsx` — class-only edits**
  - `<Menu className="text-orange-500" />` → `<Menu className="text-primary" />`
  - `<CircleUserRound className="text-orange-500" />` → `<CircleUserRound className="text-primary" />`
  - `<SheetContent className="space-y-3">` → `<SheetContent className="space-y-3 rounded-l-3xl">`
  - Login `Button` className → `"flex-1 font-bold"` (drop `bg-orange-500`)

- [ ] **Step 5: Replace `src/components/MobileNavLinks.tsx`**

```tsx
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";

const MobileNavLinks = () => {
  const { logout } = useAuth0();

  return (
    <>
      <Link
        to="/order-status"
        className="flex items-center font-bold text-foreground hover:text-primary"
      >
        Sipariş Durumu
      </Link>
      <Link
        to="/manage-restaurant"
        className="flex items-center font-bold text-foreground hover:text-primary"
      >
        Restoranım
      </Link>
      <Link
        to="/user-profile"
        className="flex items-center font-bold text-foreground hover:text-primary"
      >
        Kullanıcı Profili
      </Link>
      <Button
        onClick={() => logout()}
        className="flex items-center px-3 font-bold"
      >
        Çıkış Yap
      </Button>
    </>
  );
};
export default MobileNavLinks;
```

- [ ] **Step 6: Replace `src/components/Footer.tsx`**

```tsx
const Footer = () => {
  return (
    <footer className="bg-foreground py-10">
      <div className="container mx-auto flex flex-col gap-4 md:flex-row md:gap-0 justify-between items-center text-center">
        <span className="flex items-baseline gap-1.5 text-2xl md:text-3xl text-primary font-bold tracking-tight font-heading">
          <span aria-hidden className="text-base md:text-lg">
            ●
          </span>
          MernEats
        </span>
        <span className="text-background/80 font-semibold flex gap-6 text-sm">
          <span>Gizlilik Politikası</span>
          <span>Kullanım Şartları</span>
        </span>
      </div>
    </footer>
  );
};
export default Footer;
```

- [ ] **Step 7: Replace `src/layouts/Layout.tsx`** (drop Hero + `showHero`)

```tsx
import Footer from "@/components/Footer";
import Header from "@/components/Header";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto flex-1 py-6 md:py-10">{children}</div>
      <Footer />
    </div>
  );
};
export default Layout;
```

- [ ] **Step 8: `src/routes.tsx` — remove `showHero` props.** `<Layout showHero>` → `<Layout>` (home route) and both `<Layout showHero={false}>` → `<Layout>` (search + detail routes). No other changes.

- [ ] **Step 9: Delete dead files**

```bash
rm src/components/Hero.tsx src/assets/hero.png
grep -rn "Hero\b\|hero.png" src/   # must return nothing
```

- [ ] **Step 10: Verify**

```bash
pnpm build && pnpm lint
```

Expected: both exit 0. Visual: header is cream with tangerine `● MernEats`, footer is dark warm-ink; home page no longer shows the old full-width photo banner. Check the mobile sheet nav at 375px.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat(redesign): restyle header, nav, footer; remove Hero banner"
```

---

### Task 4: HomePage — tangerine hero, cuisine chips, download panel

**Files:**

- Modify: `src/pages/HomePage.tsx`, `src/components/SearchBar.tsx`
- Delete: `src/assets/landing.png`, `src/assets/appDownload.png`

**Interfaces:**

- Consumes: `SearchBar` (same props), `cuisineList` from `@/config/restaurant.options.config`, Task 1 animation classes.
- Produces: nothing new for later tasks. `SearchBar` props unchanged (also used by SearchPage).

- [ ] **Step 1: Restyle `src/components/SearchBar.tsx`** — replace the `<form>` className template with:

```tsx
className={`flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 rounded-3xl sm:rounded-full bg-card p-2 sm:p-3 transition-shadow ${
  onHome ? "shadow-warm-lg" : "shadow-warm"
} ${form.formState.errors.searchQuery && "ring-2 ring-destructive"}`}
```

And inside it:

- `Search` icon className → `"ml-2 shrink-0 text-primary"`
- `Input` className → `"border-none bg-transparent shadow-none text-lg sm:text-xl focus-visible:ring-0"`
- Reset button: `variant="outline"` → `variant="ghost"`, className → `"flex-1 sm:flex-none"`
- Submit button className → `"flex-1 sm:flex-none"` (drop `rounded-full bg-orange-500 hover:bg-orange-600`; the default variant covers it)

- [ ] **Step 2: Replace `src/pages/HomePage.tsx`**

```tsx
import SearchBar, { SearchForm } from "@/components/SearchBar";
import { cuisineList } from "@/config/restaurant.options.config";
import { Smartphone, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (searchFormValues: SearchForm) => {
    navigate({
      pathname: `/search/${searchFormValues.searchQuery}`,
    });
  };

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      <section className="relative overflow-hidden rounded-[28px] bg-primary px-5 py-12 text-center text-primary-foreground shadow-warm-lg sm:px-10 md:px-24 md:py-16 -mt-2 md:-mt-4">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-[46%_54%_60%_40%/50%_45%_55%_50%] bg-primary-deep opacity-70 motion-safe:animate-drift"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 right-14 h-44 w-44 rounded-[55%_45%_40%_60%/45%_55%_50%_50%] bg-accent opacity-80 motion-safe:animate-drift-slow"
        />
        <div className="relative flex flex-col gap-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Bugün paket servisin tadını çıkarın
          </h1>
          <span className="text-lg md:text-xl opacity-90">
            Yemek bir tık uzağınızda!
          </span>
          <SearchBar
            placeholder="Şehir veya ilçeye göre arayın"
            onSubmit={handleSearch}
            onHome
          />
        </div>
      </section>

      <section className="flex flex-col items-center gap-4">
        <span className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Popüler mutfaklar
        </span>
        <div className="flex flex-wrap justify-center gap-2.5">
          {cuisineList.slice(0, 10).map((cuisine, index) => (
            <span
              key={cuisine}
              className="rounded-full bg-card px-4 py-2 text-sm font-bold shadow-warm motion-safe:animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {cuisine}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] bg-secondary px-5 py-10 text-center sm:px-10 md:py-14">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
          <span className="font-bold text-2xl md:text-3xl tracking-tight font-heading">
            Paket siparişi daha da hızlı verin!
          </span>
          <span className="text-base md:text-lg text-muted-foreground">
            Daha hızlı sipariş ve kişiye özel öneriler için MearnEats
            uygulamasını indirin
          </span>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background">
              <Smartphone size={16} /> App Store
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background">
              <Zap size={16} /> Google Play
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;
```

(The cuisine chips are presentational labels, not links — the search route needs a city, so making them navigate would be a behavioral change. The store badges replace the old `appDownload.png` image and are equally non-interactive.)

- [ ] **Step 3: Delete dead assets**

```bash
rm src/assets/landing.png src/assets/appDownload.png
grep -rn "landing.png\|appDownload" src/   # must return nothing
```

- [ ] **Step 4: Verify**

```bash
pnpm build && pnpm lint
```

Expected: exit 0. Visual: tangerine hero card with two slowly drifting blobs, white pill search bar, staggered chip fade-in, amber-tinted download panel. Check hero text legibility and search stacking at 375px.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(redesign): new HomePage hero, cuisine chips, download panel"
```

---

### Task 5: SearchPage cluster

**Files:**

- Modify: `src/pages/SearchPage.tsx`, `src/components/CuisineFilter.tsx`, `src/components/SearchResultCard.tsx`, `src/components/SearchResultsInfo.tsx`, `src/components/SortOptionDropdown.tsx`

**Interfaces:**

- Consumes: Task 2 `Spinner` (`import Spinner from "@/components/ui/Spinner"`), Task 1 tokens/animations. All component props stay identical (`CuisineFilter` keeps `onChange/selectedCuisines/isExpanded/onExpandedClick`).

- [ ] **Step 1: Replace `src/components/CuisineFilter.tsx`** (checkbox list → pill chip buttons; identical props)

```tsx
import { Button } from "@/components/ui/button";
import { cuisineList } from "@/config/restaurant.options.config";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  onChange: (cuisines: string[]) => void;
  selectedCuisines: string[];
  isExpanded: boolean;
  onExpandedClick: () => void;
};

const CuisineFilter = ({
  onChange,
  selectedCuisines,
  isExpanded,
  onExpandedClick,
}: Props) => {
  const handleCuisineToggle = (cuisine: string) => {
    const isSelected = selectedCuisines.includes(cuisine);
    onChange(
      isSelected
        ? selectedCuisines.filter((c) => c !== cuisine)
        : [...selectedCuisines, cuisine],
    );
  };

  const handleCuisinesReset = () => onChange([]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="text-md font-bold font-heading">
          Mutfağa Göre Filtrele
        </div>
        <button
          onClick={handleCuisinesReset}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Filtreleri Sıfırla
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {cuisineList
          .slice(0, isExpanded ? cuisineList.length : 7)
          .map((cuisine) => {
            const isSelected = selectedCuisines.includes(cuisine);
            return (
              <button
                key={cuisine}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleCuisineToggle(cuisine)}
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  isSelected
                    ? "bg-foreground text-background"
                    : "bg-card shadow-warm hover:text-primary"
                }`}
              >
                {isSelected && <Check size={16} strokeWidth={3} />}
                {cuisine}
              </button>
            );
          })}
      </div>
      <Button onClick={onExpandedClick} variant="link" className="mt-2 flex-1">
        {isExpanded ? (
          <span className="flex flex-row items-center">
            Daha Az Göster <ChevronUp />
          </span>
        ) : (
          <span className="flex flex-row items-center">
            Daha Fazla Göster
            <ChevronDown />
          </span>
        )}
      </Button>
    </div>
  );
};

export default CuisineFilter;
```

(The hidden-checkbox + `Label` mechanism becomes real `<button aria-pressed>` elements — same callback contract, better semantics. The `Label` import is dropped.)

- [ ] **Step 2: Replace `src/components/SearchResultCard.tsx`**

```tsx
import { Restaurant } from "@/types";
import { Link } from "react-router-dom";
import { AspectRatio } from "./ui/aspect-ratio";
import StarRating from "./StarRating";
import { formatCurrency } from "@/lib/utils";
import { Banknote, Clock, Dot } from "lucide-react";

type Props = {
  restaurant: Restaurant;
};

const SearchResultCard = ({ restaurant }: Props) => {
  return (
    <Link
      to={`/detail/${restaurant._id}`}
      className="grid lg:grid-cols-[2fr_3fr] gap-4 sm:gap-5 group rounded-3xl bg-card p-3 sm:p-4 shadow-warm transition-all hover:shadow-warm-lg motion-safe:hover:-translate-y-0.5"
    >
      <div className="relative">
        <AspectRatio ratio={16 / 6}>
          <img
            src={restaurant.imageUrl}
            className="rounded-2xl w-full h-full object-cover"
          />
        </AspectRatio>
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-card/95 px-3 py-1 text-xs font-bold">
          <Clock size={14} className="text-primary" />~
          {restaurant.estimatedDeliveryTime} dk
        </span>
      </div>
      <div>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 font-heading group-hover:text-primary transition-colors">
          {restaurant.restaurantName}
        </h3>
        {!!restaurant.reviewCount && (
          <div className="flex items-center gap-2 mb-2">
            <StarRating
              rating={Math.round(restaurant.avgRating ?? 0)}
              size={16}
            />
            <span className="text-sm text-muted-foreground">
              {(restaurant.avgRating ?? 0).toFixed(1)} ({restaurant.reviewCount}
              )
            </span>
          </div>
        )}
        <div id="card-content" className="grid md:grid-cols-2 gap-2">
          <div className="flex flex-row flex-wrap text-muted-foreground">
            {restaurant.cuisines.map((item, index) => (
              <span className="flex">
                <span>{item}</span>
                {index < restaurant.cuisines.length - 1 && <Dot />}
              </span>
            ))}
          </div>
          <div className="flex gap-2 flex-col items-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/25 px-3 py-1 text-xs font-bold">
              <Banknote size={14} />
              Teslimat {formatCurrency(restaurant.deliveryPrice)}'den itibaren
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default SearchResultCard;
```

(The `Clock`-row moved onto the image as the time pill; delivery price became an amber pill.)

- [ ] **Step 3: `src/components/SearchResultsInfo.tsx`** — change the `Link` className to:

```tsx
"ml-1 text-sm font-semibold underline cursor-pointer text-primary";
```

- [ ] **Step 4: `src/components/SortOptionDropdown.tsx`** — change the trigger `Button` line to `variant="outline"` with className `"w-full sm:w-auto"` (outline is now a pill per Task 2; no other change).

- [ ] **Step 5: `src/pages/SearchPage.tsx` edits**
  - Add import: `import Spinner from "@/components/ui/Spinner";`
  - Loading state: `if (isLoading) return <span>Yükleniyor...</span>;` → `if (isLoading) return <Spinner />;`
  - Results list: wrap map callback to stagger:

```tsx
{
  results.data.map((restaurant, index) => (
    <div
      key={restaurant._id}
      className="motion-safe:animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <SearchResultCard restaurant={restaurant} />
    </div>
  ));
}
```

- [ ] **Step 6: Verify**

```bash
pnpm build && pnpm lint
```

Expected: exit 0. Visual (`/search/<a seeded city>`): pill cuisine chips toggle correctly (ink fill when active, reset works), result cards fade up staggered, hover lifts card. At 375px the filter chips wrap above results.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(redesign): restyle search page, cuisine pills, result cards"
```

---

### Task 6: DetailPage cluster (menu, cart, reviews)

**Files:**

- Modify: `src/pages/DetailPage.tsx`, `src/components/RestaurantInfo.tsx`, `src/components/MenuItem.tsx`, `src/components/OrderSummary.tsx`, `src/components/CheckoutButton.tsx`, `src/components/StarRating.tsx`, `src/components/ReviewForm.tsx`, `src/components/ReviewList.tsx`

**Interfaces:**

- Consumes: Task 2 primitives + `Spinner`. All props/exports unchanged.

- [ ] **Step 1: `src/components/StarRating.tsx`** — amber stars. Replace the ternary classes:

```tsx
star <= active
  ? "fill-accent text-accent"
  : "fill-transparent text-border",
```

- [ ] **Step 2: `src/components/RestaurantInfo.tsx`** — two class edits:
  - `CardContent` className → `"flex flex-wrap text-muted-foreground"`
  - `CardTitle` className stays (already `font-heading` via class; confirm it includes `font-heading` — it does).

- [ ] **Step 3: Replace `src/components/MenuItem.tsx`**

```tsx
import { MenuItem } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
  menuItem: MenuItem;
  addToCart: () => void;
};

const MenuItemComponent = ({ menuItem, addToCart }: Props) => {
  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-warm-lg motion-safe:active:scale-[0.98]"
      onClick={addToCart}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="font-heading">{menuItem.name}</CardTitle>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Plus size={18} strokeWidth={3} />
        </span>
      </CardHeader>
      <CardContent className="font-bold text-primary">
        {formatCurrency(menuItem.price)}
      </CardContent>
    </Card>
  );
};

export default MenuItemComponent;
```

- [ ] **Step 4: `src/components/OrderSummary.tsx` edits**
  - Quantity badge: `<Badge variant={"outline"} className="mr-2">` → `<Badge variant="secondary" className="mr-2">`
  - Trash icon: replace `color="red"` with className token — `<Trash className="cursor-pointer text-destructive" size={20} onClick={...} />`

- [ ] **Step 5: `src/components/CheckoutButton.tsx` edits**
  - Login button: `<Button className="border-orange-500 flex-1" ...>` → `<Button className="flex-1" ...>`
  - Checkout trigger: `<Button disabled={disabled} className="bg-orange-500 flex-1">` → `<Button disabled={disabled} className="flex-1">`
  - Dialog: `className="max-w-[425px] md:min-w-[700px] bg-gray-50"` → `className="max-w-[425px] md:min-w-[700px] bg-background"`

- [ ] **Step 6: `src/components/ReviewForm.tsx` edits**
  - Form className → `"flex flex-col gap-3 rounded-3xl bg-secondary p-5"`
  - Textarea className → `"w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"`

- [ ] **Step 7: `src/components/ReviewList.tsx` class edits** (structure unchanged)
  - Date span: `text-gray-500` → `text-muted-foreground`
  - Comment `<p>`: `text-gray-700` → `text-foreground/80`
  - Owner reply wrapper: `border-orange-200` → `border-accent`; reply label `text-orange-600` → `text-primary`; reply text `text-gray-700` → `text-foreground/80`
  - Reply textarea className → `"w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"`
  - Empty state `<p>`: `text-gray-500` → `text-muted-foreground`

- [ ] **Step 8: `src/pages/DetailPage.tsx` edits**
  - Add import: `import Spinner from "@/components/ui/Spinner";`
  - Loading: `return "Yükleniyor...";` → `return <Spinner />;`
  - Hero image className → `"rounded-[28px] shadow-warm object-cover w-full h-48 sm:h-64 md:h-80"`
  - "Bu restoranı değerlendirdiniz" `<p>`: `text-gray-500` → `text-muted-foreground`
  - Reviews rating span: `text-gray-600` → `text-muted-foreground`

- [ ] **Step 9: Verify**

```bash
pnpm build && pnpm lint
```

Expected: exit 0. Visual on a restaurant detail page: menu cards show the `+` pill and turn it tangerine on hover, add-to-cart still works, cart card is sticky with pill checkout, checkout dialog opens with rounded corners, stars are amber, owner reply block uses amber border. Test at 375px (cart stacks below menu).

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat(redesign): restyle detail page, menu, cart, reviews"
```

---

### Task 7: OrderStatusPage cluster

**Files:**

- Modify: `src/pages/OrderStatusPage.tsx`, `src/components/OrderStatusHeader.tsx`, `src/components/OrderStatusDetail.tsx`

**Interfaces:**

- Consumes: Task 2 `Progress` (fat track), `Badge`, `Spinner`. Props unchanged.

- [ ] **Step 1: Replace `src/components/OrderStatusHeader.tsx`**

```tsx
import { Order } from "@/types";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ORDER_STATUS } from "@/config/order.status.config";

type Props = {
  order: Order;
};

const OrderStatusHeader = ({ order }: Props) => {
  const getExpectedDelivery = () => {
    const created = new Date(order.createdAt);

    created.setMinutes(
      created.getMinutes() + order.restaurant.estimatedDeliveryTime,
    );

    const hours = created.getHours();
    const minutes = created.getMinutes();

    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${paddedMinutes}`;
  };

  const getOrderStatusInfo = () => {
    return (
      ORDER_STATUS.find((o) => o.value === order.status) || ORDER_STATUS[0]
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-heading">
          Sipariş Durumu:{" "}
          <span className="text-primary">{getOrderStatusInfo().label}</span>
        </h1>
        <Badge
          variant="secondary"
          className="self-start px-4 py-2 text-sm md:self-auto"
        >
          Tahmini teslimat: {getExpectedDelivery()}
        </Badge>
      </div>
      <Progress
        className="motion-safe:animate-pulse"
        value={getOrderStatusInfo().progressValue}
      />
    </>
  );
};

export default OrderStatusHeader;
```

- [ ] **Step 2: `src/components/OrderStatusDetail.tsx`** — no structural change; the two `font-bold` labels get `font-heading` added: `className="font-bold"` → `className="font-bold font-heading"` (3 occurrences: "Teslim edilecek:", "Siparişiniz", "Toplam").

- [ ] **Step 3: `src/pages/OrderStatusPage.tsx` edits**
  - Add import: `import Spinner from "@/components/ui/Spinner";`
  - Loading: `return "Yükleniyor...";` → `return <Spinner />;`
  - Order wrapper: `className="space-y-10 bg-gray-50 p-10 rounded-lg"` → `className="space-y-8 rounded-3xl bg-card p-6 shadow-warm md:p-10"`
  - Image: `className="rounded-md object-cover h-full w-full"` → `className="rounded-2xl object-cover h-full w-full"`

- [ ] **Step 4: Verify**

```bash
pnpm build && pnpm lint
```

Expected: exit 0. Visual on `/order-status` (needs an order; if none exists, verify styles by temporarily checking the empty state renders): white rounded card per order, big Baloo 2 status heading with tangerine status word, fat tangerine progress bar, pill delivery-time badge. Check heading wrap at 375px.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(redesign): restyle order status page"
```

---

### Task 8: Forms & restaurant dashboard (calm variant)

**Files:**

- Modify: `src/forms/user-profile-form/UserProfileForm.tsx`, `src/forms/manage-restaurant-form/ManageRestaurantForm.tsx`, `src/pages/ManageRestaurantPage.tsx`, `src/pages/UserProfilePage.tsx`, `src/components/OrderItemCard.tsx`

**Interfaces:**

- Consumes: Task 2 primitives (pill inputs/selects/tabs come free) + `Spinner`. Props unchanged.

- [ ] **Step 1: `src/forms/user-profile-form/UserProfileForm.tsx` edits**
  - Form className → `"p-5 space-y-4 rounded-3xl bg-card shadow-warm md:p-10"`
  - Title `<h2 className="text-2xl font-bold">` → `<h2 className="text-2xl font-bold font-heading">`
  - Remove `className="bg-white"` from all four `Input`s (inputs are cream pills on the white card now)
  - Submit button: `<Button type="submit" className="bg-orange-500">` → `<Button type="submit">`

- [ ] **Step 2: `src/forms/manage-restaurant-form/ManageRestaurantForm.tsx`** — form className → `"space-y-8 rounded-3xl bg-card p-5 shadow-warm md:p-10"` (no other change; the section components use `FormField`/`Input`/`Button` and inherit).

- [ ] **Step 3: `src/pages/ManageRestaurantPage.tsx` edits**
  - Orders `TabsContent` className → `"space-y-5 rounded-3xl bg-card p-5 shadow-warm md:p-10 mt-4"`
  - `<h2 className="text-2xl font-bold">` → `<h2 className="text-2xl font-bold font-heading">`
  - Manage tab: `<TabsContent value="manage-retaurant">` → `<TabsContent value="manage-retaurant" className="mt-4">` (keep the existing `value` spelling — it must match the `TabsTrigger`)

- [ ] **Step 4: `src/pages/UserProfilePage.tsx`**
  - Add import: `import Spinner from "@/components/ui/Spinner";`
  - `if (isGetLoading) return <span>Yükleniyor...</span>;` → `if (isGetLoading) return <Spinner />;`

- [ ] **Step 5: `src/components/OrderItemCard.tsx`** — one edit: quantity badge `<Badge variant="outline" className="mr-2">` → `<Badge variant="secondary" className="mr-2">`. (Card, Select, Separator inherit Task 2 styling.)

- [ ] **Step 6: Verify**

```bash
pnpm build && pnpm lint
```

Expected: exit 0. Visual: `/user-profile` shows a white rounded card with cream pill inputs and a tangerine pill submit; `/manage-restaurant` shows the pill segmented tabs (active = tangerine), order cards with pill status select. Fill and submit the profile form once to confirm behavior is intact. Check both at 375px.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(redesign): restyle profile form and restaurant dashboard"
```

---

### Task 9: AuthCallback spinner + final sweep

**Files:**

- Modify: `src/pages/AuthCallbackPage.tsx`
- Possibly modify: any file the sweep greps flag

**Interfaces:**

- Consumes: Task 2 `Spinner`.

- [ ] **Step 1: Replace `src/pages/AuthCallbackPage.tsx` render** — change the last line of the component from `return <>Yükleniyor...</>;` to:

```tsx
return (
  <div className="grid min-h-screen place-items-center">
    <Spinner />
  </div>
);
```

and add `import Spinner from "@/components/ui/Spinner";` to the imports.

- [ ] **Step 2: Remnant sweep** — every hit below must be justified or fixed (semantic classes from Task edits are the only acceptable output; there should be zero hits):

```bash
grep -rn "orange-500\|orange-600\|orange-200\|blue-500\|bg-gray-50\|text-gray-\|bg-white\|font-heading.*Fraunces" src/
grep -rn "next-themes\|fraunces\|plus-jakarta" src/ package.json
grep -rn "showHero\|Hero\b" src/
```

Fix any stragglers with the same token substitutions used throughout (`orange-*` → `primary`/`accent`, `gray-*` → `muted-foreground`/`secondary`, `bg-white` → `bg-card`).

- [ ] **Step 3: Full verification pass**

```bash
pnpm build && pnpm lint
```

Expected: exit 0. Then walk every route in `pnpm dev` at 375px and desktop: `/`, `/search/:city`, `/detail/:id`, `/order-status`, `/user-profile`, `/manage-restaurant`, plus login → `/auth-callback` spinner. Confirm search, add-to-cart, checkout dialog open, review form, and tab switching all still function.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(redesign): branded loading states and final cleanup"
```

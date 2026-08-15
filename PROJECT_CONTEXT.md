# Portfolio V2 — Codebase Context

Reference doc for future refactor/redesign work. Written from a full read-through
of every source file. Purely descriptive — no changes made yet.

## Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v4 (via `@tailwindcss/postcss`, no `tailwind.config` — v4 is CSS-first)
- Framer Motion (animation), GSAP (installed, dependency present, **not actually used anywhere**)
- Three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing (hero background)
- react-icons, react-simple-typewriter, react-intersection-observer (installed, **not used** — `page.tsx` hand-rolls its own `IntersectionObserver` instead)
- `clsx` + `tailwind-merge` via `lib/utils.ts` (`cn()` helper) — defined but **not imported anywhere**

## Page structure

Single-page site. `src/app/page.tsx` renders one `<main>` with 5 `<section>` anchors
(`#home #about #tech-stack #project #contact`), each holding one section component.
`About`, `Tech`, `Project`, `Contact` are `next/dynamic` imports with `ssr:false` and a
spinner fallback (also wrapped individually in `<Suspense>`, which is redundant since
`ssr:false` dynamic imports already show `loading` client-side — two loading mechanisms
stacked for the same effect).

A `PrismScene` (the 3D canvas) is absolutely positioned behind everything (`z-0`,
`inset-0`) and stays mounted/rendered for the entire scroll length of the page, not
just behind the hero section.

### Scroll-spy / active-section tracking

`page.tsx` owns one `active` state string, updated via a manually built
`IntersectionObserver` (rootMargin `-20% 0px -70% 0px`), rAF-throttled. `active` is
passed down to `Navbar`, `About`, `Tech`, `Project` (not `Contact`, which takes no props).

**This same `active` value is overloaded for a second, unrelated purpose**: each section
component uses it to gate a one-time reveal (`show` state that flips true and never
resets):

- `About`: shows when `active === "Home"`
- `Tech`: shows when `active === "About"`
- `Project`: shows when `active === "Project"` (itself, unlike the other two)
- `Contact`: no gating, always rendered

Since every section *also* independently animates in via Framer Motion's
`whileInView`, this `show` gate is largely redundant with viewport-triggered animation,
inconsistent in what it keys off (previous section vs. self), and easy to break if
sections are reordered.

## Components (`src/app/components/`)

| File | Role | Notes |
|---|---|---|
| `navbar.tsx` | Fixed pill nav, desktop + mobile variants | 3 near-duplicate `motion.div` blocks (scrolled / mobile-open / collapsed) with repeated spring configs — candidate for consolidation |
| `Hero_Page.tsx` | Hero section | **Dead component** — returns an empty `<main className="bg-black">`. Imported in `page.tsx` but never rendered. The actual hero content is the `PrismScene` + `Text3D` caption inside the 3D canvas. |
| `about.tsx` | Bio, typewriter name, bullet list of interests | Content is hardcoded JSX (name, degree, bullets) — no data/content separation |
| `tech-stack.tsx` | 3 icon-grid sections (Languages / Frameworks / Tools) + click-to-open modal | Data arrays defined in-component (fine). The 3 grid sections are near-identical JSX repeated 3× (~130 lines) — strong duplication candidate. Each item has an unused `imgType` field meant to pick `next/image` vs `<img>`, but only the *Languages* section actually branches on it; Frameworks/Tools always use `next/image` regardless |
| `project.tsx` | 7 hardcoded project cards + "coming soon" | Component fn is named `projects` (lowercase). All images are hot-linked raw GitHub URLs (`raw.githubusercontent.com`-style paths); only one card has an `onError` fallback, the other 6 don't. Content is hardcoded, no data array (unlike tech-stack) |
| `contact.tsx` | Form → POST to Formspree | Formspree endpoint hardcoded (`xeokobav`). Accepts a `nav` prop type but component takes no props (dead type) |
| `electric-cursor.tsx` | Custom cursor dot | Tracks mouse via `useState` on every `mousemove` (no throttling/rAF) — causes a React re-render per pixel of mouse movement |
| `spotlight-card.tsx` | Reusable "glow border follows cursor" card (`GlowCard`) | Self-contained, injects a `<style>` tag at runtime. **Imported in `tech-stack.tsx` but never actually used** (dynamic import present, component never rendered) |

## Three.js scene (`src/app/components/three/`)

This is a customized version of the well-known pmndrs "prism" demo (refracting light
beam off a 3D prism, reflecting off floating boxes, rendering a rainbow via a custom
GLSL shader). All `.js`, not `.ts` — the only untyped part of the codebase.

- `PrismScene.js` — sets up `<Canvas>`, bloom + LUT color-grading postprocessing, mobile/low-power detection (checks `navigator.connection.saveData`, `prefers-reduced-motion`, `hardwareConcurrency`, `devicePixelRatio`) to scale quality down
- `Prism.js` — loads `prism.glb`, invisible low-poly hit target + visible `MeshTransmissionMaterial` glass prism
- `Beam.js` — instanced-mesh renderer for the light beam streaks/glow trail. Has a leftover `console.log(streaks.current)` in a `useEffect`
- `Reflect.js` — the raycasting/bounce engine; custom `onRayOver/onRayOut/onRayMove` event system implemented via property checks on Three.js objects (not real DOM-style events)
- `Rainbow.js` — custom shader material (spectral color + iridescence GLSL, credited in comments to Alan Zucconi / Julia Poo / shuding)
- `Box.js`, `Flare.js`, `util.js` — floating reflector boxes, lens-flare sprite instancing, math lerp helpers

This subsystem is dense but internally consistent and self-contained — it doesn't leak
into the rest of the app beyond the single `<PrismScene />` mount in `page.tsx`.

## Styling

- `globals.css`: imports Google Fonts (Inter, Lexend Tera) **by `@import url()` at runtime**, while `layout.tsx` *also* loads the same two fonts via `next/font/google` (`Inter`, `Lexend_Tera`) as CSS variables — fonts are being loaded twice, two different ways
- `* { cursor: none }` globally on desktop (to make room for the custom cursor), reverted to `cursor: auto` under `768px`
- Custom keyframe/utility classes: `.animate-rotate-border` (conic-gradient border spin, used everywhere for card borders), `.gpu-boost` (forces GPU compositing), reduced-motion media query support
- No Tailwind config file — v4's CSS-first config means theme customization (if any) would live in `globals.css` via `@theme`, but none is currently defined; it's all default Tailwind tokens

## Config

- `next.config.ts`: **`eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true`** — production builds currently won't fail on lint or type errors. `images.unoptimized: true` (likely because project thumbnails are hot-linked from GitHub, which Next/Image can't optimize without allow-listing the remote host)
- `tsconfig.json`: defines path alias `@/*` → `src/*`, but **no file in the codebase uses it** — all imports are relative (`./components/...`)
- README describes a `src/types/` folder that **does not exist**

## Naming / convention inconsistencies

- File casing mixed: `Hero_Page.tsx` (Pascal_Snake) vs `navbar.tsx`, `about.tsx`, `contact.tsx` (lowercase) vs `spotlight-card.tsx`, `tech-stack.tsx`, `electric-cursor.tsx` (kebab-case)
- Prop type names inconsistent across near-identical usages: `NavbarProps`, `navprop` (x2, different casing/style), `nav` (x2)
- `projects` component (project.tsx) is lowercase; everything else default-exports PascalCase

## Known dead code / unused dependencies

- `Hero_Page.tsx` — empty, imported, never rendered
- `spotlight-card.tsx` (`GlowCard`) — built, imported in `tech-stack.tsx`, never rendered
- `lib/utils.ts` (`cn()`) — never imported
- `gsap` — dependency installed, no usage found
- `react-intersection-observer` — dependency installed, `page.tsx` reimplements the same thing manually instead
- `@/*` tsconfig path alias — never used
- `Contact`'s `nav` prop type — component takes no props

## What's *not* a problem (working well as-is)

- The 3D prism hero is the strongest visual asset on the site and is reasonably
  performance-conscious already (mobile/low-power branches, DPR clamping, bloom level
  scaling)
- Framer Motion `whileInView` usage for scroll-reveal is consistent and idiomatic
  throughout the section components
- Mobile responsiveness (separate mobile nav, `md:`/`lg:` breakpoints throughout) is
  handled carefully, not an afterthought
- Reduced-motion support exists in `globals.css`

## Open questions for the next phase

Not answered here — waiting on direction before touching code:

1. Keep the dark/prism/glassmorphism visual identity, evolve it, or replace it?
2. Is content (bio text, project list) staying the same, or changing too?
3. Fix the dead code / duplication / config issues above as part of the same pass, or
   scope this to visual changes only?
4. Any sections to add/remove/reorder?

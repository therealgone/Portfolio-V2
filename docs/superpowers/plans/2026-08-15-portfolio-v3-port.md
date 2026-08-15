# Portfolio V3 Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the entire current Next.js portfolio (3D prism hero + old component tree) with a pixel-and-behavior-exact port of `Portfolio V3.dc.html`, per `HANDOFF.md`.

**Architecture:** Ten `'use client'` section components composed in a fixed order by `page.tsx`, driven by one shared `requestAnimationFrame` scroll engine and a handful of small, single-purpose interaction hooks (scramble, reveal-on-scroll, bar-wipe, hover-scramble). No React state for anything that changes every frame — those write straight to `element.style` via refs. React state is reserved for discrete things: nav open/closed, active section label, rabbit-hole open branches, form fields, mobile/desktop project-index mode.

**Tech stack:** Next.js 15 (App Router) / React 19 / TypeScript, unchanged. Adds `hls.js` for the hero video. Removes the entire three.js/postprocessing/GSAP stack.

**Spec:**
- `Portfolio UI redesign with animations/Portfolio V3.dc.html` — **source of truth**. Every markup, style, copy, and behavior detail not reproduced in this plan must be read directly from this file. Line numbers cited below are stable (the file is not being edited).
- `Portfolio UI redesign with animations/HANDOFF.md` — architecture and file-map guidance. **Where HANDOFF.md and the `.dc.html` file disagree, the file wins** — this happened once already (HANDOFF claims 5 résumé links incl. one in the Academics section; the file has exactly 4: lines 94, 120, 523, 558 — nav overlay footer, hero CTA row, contact link list, page footer. Use 4.)

## Global Constraints

- **Port, don't improve.** No hex/rgba/blur/shadow value changes, no easing changes, no reworded copy, no added libraries beyond `hls.js`, no reintroducing three.js/GSAP/Framer-Motion-for-scroll/Lenis/ScrollTrigger.
- **One easing curve for every meaningful transition:** `cubic-bezier(0.52, 0.01, 0, 1)`. Default duration `0.5s`, up to `0.7s` for large reveals. Two exceptions already in the source use `cubic-bezier(.2,.9,.2,1)`: the nav island scale-in and the nav overlay row bars — keep those as-is, don't normalize them.
- **Colors:** background `#000` everywhere, primary text `#fff`, taxonomy/label `#6f879c`, card surface `rgba(255,255,255,0.035)` with inset highlight `inset 0 1px 1px rgba(255,255,255,0.12)`, hairlines `rgba(255,255,255,0.07)`–`rgba(255,255,255,0.12)`, body copy `rgba(255,255,255,0.5)`–`rgba(255,255,255,0.82)`. No accent color anywhere.
- **Fonts:** Instrument Serif (italic, the only weight used) for all headings/display; Barlow 300/400/500/600 for body/UI; `ui-monospace, SFMono-Regular, Menlo, 'Cascadia Mono', monospace` (system stack, no webfont) for the Rabbit Hole terminal only.
- **Liquid glass recipe** (nav island, nav overlay panel, secondary CTA buttons, contact form) — exact CSS, goes in `globals.css` as reusable classes since it needs a `::before` pseudo-element:
  ```css
  .glass {
    background: rgba(255,255,255,0.01);
    backdrop-filter: blur(50px);
    -webkit-backdrop-filter: blur(50px);
    box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15);
    position: relative;
    overflow: hidden;
  }
  .glass::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1.4px;
    background: linear-gradient(180deg,
      rgba(255,255,255,0.5) 0%,  rgba(255,255,255,0.2) 20%,
      rgba(255,255,255,0)  40%,  rgba(255,255,255,0)  60%,
      rgba(255,255,255,0.2) 80%, rgba(255,255,255,0.5) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude;
    pointer-events: none;
  }
  ```
  The nav *overlay panel* (line 54) and the *hero CTA "See the work" button* (line 118) and the *footer "Start a conversation" button* (line 549) use a slightly different `::before` gradient stop set than the nav island — check the exact `style-before` string at each source line before assuming they're identical. Where they differ, add a second class (e.g. `.glass-panel::before`) rather than forcing one class to fit both.
- **Style conversion rules** (apply uniformly across every component task below):
  1. `style="..."` → a React inline `style={{...}}` object, camelCased, values copied exactly.
  2. `style-hover="..."` → **do not** use React state for this. Attach `onMouseEnter`/`onMouseLeave` handlers that write the changed properties directly to the element via a `ref` (`el.style.background = '...'`, etc.) and revert them on leave to the base value. This matches the source's own direct-DOM-write philosophy and avoids re-renders on lists (project rows, tech tiles, cert cards).
  3. `style-before="..."` → a real CSS class + `::before` in `globals.css` (see `.glass` above for the pattern), applied via `className`. This is the only place inline styles become classes.
  4. `style-focus="..."` → same treatment as `style-hover`, or a static CSS class with a real `:focus` selector if the value never varies (it doesn't, for the two form inputs/textarea) — prefer the CSS class here since it's simpler and the value is static.
  5. `sc-if value="{{ x }}"` → `{x && (...)}`.
  6. `sc-for list="{{ arr }}" as="t"` → `{arr.map((t, i) => (...))}` with a real `key` (use a stable field like `t.name` or `p.num`, never the index, except where the source has no stable id).
  7. `onClick="{{ fn }}"` → a real handler wired to component state.
  8. Most `data-*` attributes in the source are behavior hooks for the vanilla querySelectorAll-based script and become refs in React — drop them. **Exception:** the mobile media query in `globals.css` (§8 below) selects by attribute (`[data-track-wrap]`, `[data-chapter]`, `[data-index-wrap]`, `[data-index-sticky]`, `[data-index-grid]`, `[data-index-preview]`, `[data-grid3]`, `[data-bubble]`) — these eight attributes must stay as literal DOM attributes on the corresponding elements (e.g. `<div data-track-wrap>`) even though everything else about them becomes a ref-driven component.
- **No `window`/`document` at module scope** — only inside `useEffect`/handlers. `hls.js` is dynamically imported inside `useEffect`.
- **Verification model:** this is a visual/behavioral port with no meaningful unit-test surface (no business logic, just markup + animation). Each task's verification step is `npm run build` (must stay clean throughout — old and new code coexist until the final cutover task) plus, where noted, a manual check in `npm run dev` against the specific line(s) of the Definition of Done checklist (HANDOFF.md §11) that task makes checkable. There is no Jest/RTL suite to write against this content.

---

### Task 1: Global styles and fonts

**Files:**
- Modify: `src/app/globals.css` (full rewrite)
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: CSS custom classes `.glass`, `.glass::before` (and any panel-specific variant found per the note above) that every later component task applies via `className="glass"`.
- Produces: `--font-serif` and `--font-body` CSS variables (from `next/font/google`) that every later component references as `var(--font-serif)` / `var(--font-body)` in inline styles, or via the `font-family` values `'Instrument Serif', serif` / `'Barlow', sans-serif` directly (the source's own CSS uses the literal family names, e.g. line 63: `font-family: 'Instrument Serif', serif`) — **use the literal family name strings exactly as the source does**, not the CSS variable, so ported inline `style` objects match the source line-for-line. The `next/font/google` variables only need to reach `body` so the two fonts actually load; components don't need to reference the variables directly.

- [ ] **Step 1: Rewrite `globals.css`**

Replace the entire file with:

```css
@import "tailwindcss";

html { background: #000; }
body { margin: 0; background: #000; color: #fff; font-family: 'Barlow', sans-serif; -webkit-font-smoothing: antialiased; }
a { color: #fff; text-decoration: none; }
a:hover { color: rgba(255,255,255,0.6); }
::selection { background: #fbe1d1; color: #17191c; }
input, textarea, button { font-family: 'Barlow', sans-serif; }

html {
  scroll-behavior: smooth;
  scrollbar-width: none;
}
body::-webkit-scrollbar { display: none; }

@media (min-width: 900px) { * { cursor: none !important; } }

@media (max-width: 780px) {
  [data-track-wrap]  { height: 300vh !important; }
  [data-chapter]     { width: 86vw !important; padding: 30px 24px !important; }
  [data-index-wrap]  { height: auto !important; margin-top: 20px !important; }
  [data-index-sticky]{ position: static !important; height: auto !important;
                       overflow: visible !important; display: block !important; }
  [data-index-grid]  { display: flex !important; flex-direction: column-reverse !important; gap: 24px !important; }
  [data-index-preview]{ position: sticky !important; top: 64px; z-index: 3; background: #000; padding-bottom: 8px; }
  [data-grid3]       { grid-template-columns: 1fr !important; gap: 12px !important; }
  [data-bubble]      { width: 96px !important; height: 96px !important; }
}

@keyframes om-cue { 0%,100% { transform: translateY(0); opacity: .35 } 50% { transform: translateY(6px); opacity: .9 } }

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

.glass {
  background: rgba(255,255,255,0.01);
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
  box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15);
  position: relative;
  overflow: hidden;
}
.glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.5) 0%,  rgba(255,255,255,0.2) 20%,
    rgba(255,255,255,0)  40%,  rgba(255,255,255,0)  60%,
    rgba(255,255,255,0.2) 80%, rgba(255,255,255,0.5) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  pointer-events: none;
}
```

Then read source lines 45 (nav island), 54 (nav overlay panel), 118 (hero CTA), 549 (footer CTA) and diff their `style-before` gradient-stop strings against `.glass::before` above. If any differ, add `.glass-panel::before { ... }` (or an appropriately named variant) with the differing stops, and note in a one-line CSS comment which element(s) use it. Do not silently normalize a difference away.

- [ ] **Step 2: Rewrite `layout.tsx`**

```tsx
import './globals.css'
import type { Metadata } from "next";
import { Instrument_Serif, Barlow } from 'next/font/google'

const serif = Instrument_Serif({
  subsets: ['latin'], weight: '400', style: ['normal', 'italic'],
  variable: '--font-serif', display: 'swap',
})
const barlow = Barlow({
  subsets: ['latin'], weight: ['300', '400', '500', '600'],
  variable: '--font-body', display: 'swap',
})

export const metadata: Metadata = {
  title: 'Jeevan Baabu Murugan — Portfolio',
  description: "Computer Science Engineering — AI & Machine Learning. I build full-stack products, AI tooling and edge–cloud systems, end to end.",
  openGraph: {
    title: 'Jeevan Baabu Murugan — Portfolio',
    description: "Computer Science Engineering — AI & Machine Learning. I build full-stack products, AI tooling and edge–cloud systems, end to end.",
    url: 'https://jeevanbaabu.vercel.app/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jeevan Baabu Murugan — Portfolio',
    description: "Computer Science Engineering — AI & Machine Learning. I build full-stack products, AI tooling and edge–cloud systems, end to end.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/J.png" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${serif.variable} ${barlow.variable}`}>
        {children}
      </body>
    </html>
  );
}
```

Title/description/copy above are copied verbatim from source lines 12 and 115. Keep `og:url` as the existing deployment URL already in the repo (`https://jeevanbaabu.vercel.app/`) — HANDOFF says update it to "your real deployment URL", which is unchanged.

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: builds clean (old `page.tsx` and old components still compile against the new CSS/layout — the old components don't reference the removed `Inter`/`Lexend_Tera` variables or `font-inter`/`font-lexend` classes, confirm this with a quick grep before running the build: `grep -rn "font-inter\|font-lexend\|font-lexend-tera" src/app/components` — if any hits exist, leave them; the whole tree is deleted in Task 14 anyway).

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "Rewrite global styles and fonts for V3 port"
```

---

### Task 2: Shared interaction hooks

**Files:**
- Create: `src/app/hooks/useScrollEngine.ts`
- Create: `src/app/hooks/useScramble.ts`
- Create: `src/app/hooks/useRevealOnScroll.ts`
- Create: `src/app/hooks/useScrambleOnView.ts`
- Create: `src/app/hooks/useScrambleOnHover.ts`
- Create: `src/app/hooks/useBarWipe.ts`

**Interfaces:**
- Produces `useScrollEngine(): { subscribe(fn: () => void): () => void }` — every later component with per-frame scroll math (Hero, About, Projects, NavIsland's active-section tracker) calls `subscribe` once in a `useEffect` and does its own `getBoundingClientRect()`/`window.innerHeight` reads inside `fn`.
- Produces `useScramble(): (el: HTMLElement, finalText: string, duration?: number) => void` — the core scramble primitive every other scramble hook and every component with a one-off scramble (e.g. RabbitHole's payoff line, TechField's readout) calls directly.
- Produces `useRevealOnScroll<T extends HTMLElement>(ref: React.RefObject<T | null>): void` — mount-and-forget; every element that had `data-reveal` in the source calls this with its own ref.
- Produces `useScrambleOnView<T extends HTMLElement>(ref: React.RefObject<T | null>, text: string): void` — every element that had `data-scramble` in the source.
- Produces `useScrambleOnHover<H extends HTMLElement, T extends HTMLElement>(hostRef: React.RefObject<H | null>, targetRef: React.RefObject<T | null>, text: string, duration?: number): void` — every element that had `data-scramble-hover` inside a `data-row` host.
- Produces `useBarWipe<H extends HTMLElement, B extends HTMLElement>(hostRef: React.RefObject<H | null>, barRef: React.RefObject<B | null>): void` — every `data-row` that contains a `data-bar` span.

- [ ] **Step 1: `useScrollEngine.ts`**

```ts
'use client'
import { useEffect } from 'react'

type Listener = () => void

const listeners = new Set<Listener>()
let raf: number | null = null
let initialized = false

function tick() {
  raf = null
  listeners.forEach(fn => fn())
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(tick)
}

function ensureInit() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
}

export function useScrollEngine() {
  useEffect(() => {
    ensureInit()
  }, [])

  return {
    subscribe(fn: Listener) {
      listeners.add(fn)
      schedule()
      return () => {
        listeners.delete(fn)
      }
    },
  }
}
```

This is the React-hook translation of the source's single `initScroll()` (dc.html lines 1046–1139): one `rAF`-throttled listener, subscribers run in registration order via the `Set`'s insertion order, each subscriber reads its own layout. Matches HANDOFF.md §3's "one rAF loop" requirement.

- [ ] **Step 2: `useScramble.ts`**

Ported exactly from dc.html lines 733–753 (`Component.scramble`):

```ts
'use client'
import { useCallback, useRef } from 'react'

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/*"

export function useScramble() {
  const framesRef = useRef<Map<HTMLElement, number>>(new Map())

  return useCallback((el: HTMLElement, finalText: string, duration?: number) => {
    const existing = framesRef.current.get(el)
    if (existing) cancelAnimationFrame(existing)

    const text = finalText
    const dur = duration || 520 + text.length * 22
    const t0 = performance.now()

    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur)
      let out = ''
      for (let i = 0; i < text.length; i++) {
        const c = text[i]
        if (c === ' ') { out += ' '; continue }
        const settle = ((i + 1) / text.length) * 0.85
        out += p >= settle ? c : CHARS[(Math.random() * CHARS.length) | 0]
      }
      el.textContent = out
      if (p < 1) {
        framesRef.current.set(el, requestAnimationFrame(step))
      } else {
        el.textContent = text
        framesRef.current.delete(el)
      }
    }
    framesRef.current.set(el, requestAnimationFrame(step))
  }, [])
}
```

- [ ] **Step 3: `useRevealOnScroll.ts`**

Ported from dc.html lines 845–864 (`initReveal`), applied per-element instead of via global `querySelectorAll("[data-reveal]")`:

```ts
'use client'
import { useLayoutEffect, type RefObject } from 'react'

export function useRevealOnScroll<T extends HTMLElement>(ref: RefObject<T | null>) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(38px)'
    el.style.transition = 'opacity .9s cubic-bezier(.52,.01,0,1), transform .9s cubic-bezier(.52,.01,0,1)'

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'none'
          io.unobserve(el)
        }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' })

    io.observe(el)
    return () => io.disconnect()
  }, [ref])
}
```

`useLayoutEffect`, not `useEffect` — the initial opacity/transform must land before paint, per HANDOFF §7 ("otherwise revealed content flashes at full opacity first").

- [ ] **Step 4: `useScrambleOnView.ts`**

Ported from dc.html lines 755–766, first half (`data-scramble` branch):

```ts
'use client'
import { useEffect, type RefObject } from 'react'
import { useScramble } from './useScramble'

export function useScrambleOnView<T extends HTMLElement>(ref: RefObject<T | null>, text: string) {
  const scramble = useScramble()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          scramble(el, text)
          io.unobserve(el)
        }
      })
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, text, scramble])
}
```

- [ ] **Step 5: `useScrambleOnHover.ts`**

Ported from dc.html lines 767–773 (`data-scramble-hover` branch):

```ts
'use client'
import { useEffect, type RefObject } from 'react'
import { useScramble } from './useScramble'

export function useScrambleOnHover<H extends HTMLElement, T extends HTMLElement>(
  hostRef: RefObject<H | null>,
  targetRef: RefObject<T | null>,
  text: string,
  duration = 420
) {
  const scramble = useScramble()

  useEffect(() => {
    const host = hostRef.current
    const target = targetRef.current
    if (!host || !target) return
    const handler = () => scramble(target, text, duration)
    host.addEventListener('mouseenter', handler)
    return () => host.removeEventListener('mouseenter', handler)
  }, [hostRef, targetRef, text, duration, scramble])
}
```

- [ ] **Step 6: `useBarWipe.ts`**

Ported from dc.html lines 828–843 (`initHover`):

```ts
'use client'
import { useEffect, type RefObject } from 'react'

export function useBarWipe<H extends HTMLElement, B extends HTMLElement>(
  hostRef: RefObject<H | null>,
  barRef: RefObject<B | null>
) {
  useEffect(() => {
    const host = hostRef.current
    const bar = barRef.current
    if (!host || !bar) return
    const enter = () => {
      bar.style.transition = 'width .5s cubic-bezier(.52,.01,0,1)'
      bar.style.width = '100%'
    }
    const leave = () => {
      bar.style.transition = 'width .3s cubic-bezier(.52,.01,0,1)'
      bar.style.width = '0%'
    }
    host.addEventListener('mouseenter', enter)
    host.addEventListener('mouseleave', leave)
    return () => {
      host.removeEventListener('mouseenter', enter)
      host.removeEventListener('mouseleave', leave)
    }
  }, [hostRef, barRef])
}
```

Two nav-related bars (nav overlay rows, line 61) use `.28s`/`{'.2,.9,.2,1'}` timing instead — when Task 5 (NavIsland) wires its own rows, it should inline its own mouseenter/leave handlers with that exact timing rather than reuse this hook, per the Global Constraints easing exception.

- [ ] **Step 7: Verify**

Run: `npm run build`
Expected: builds clean — these files aren't imported anywhere yet, so this just confirms they type-check.

- [ ] **Step 8: Commit**

```bash
git add src/app/hooks
git commit -m "Add shared scroll/scramble/reveal interaction hooks"
```

---

### Task 3: Data files

**Files:**
- Create: `src/app/lib/projects.ts`
- Create: `src/app/lib/stack.ts`

**Interfaces:**
- Produces `PROJECTS: Project[]` (10 items) — consumed by `Projects.tsx` (Task 10).
- Produces `STACK: StackItem[]` (55 items) — consumed by `TechField.tsx` (Task 9).
- Produces the `Project` and `StackItem` TypeScript types other tasks import.

- [ ] **Step 1: `projects.ts`**

Copied verbatim from dc.html lines 568–579 (the `PROJECTS` const), field order preserved:

```ts
export type Project = {
  num: string
  tag: string
  title: string
  desc: string
  stack: string
  href: string
  img: string
}

export const PROJECTS: Project[] = [
  { num: "01", tag: "IoT · Edge–Cloud · Research", title: "EdgeSign", desc: "V2 of my sign-language work, rebuilt as an IoT edge–cloud hybrid. A camera on a Raspberry Pi captures hand gestures, MediaPipe extracts 21 landmarks per frame, and a trained model classifies them into predefined signs — with an AI layer composing full sentences and on-device text-to-speech speaking them.", stack: "Python · Raspberry Pi · MediaPipe · OpenCV · TensorFlow · Flask", href: "https://github.com/therealgone/EdgeSign-An-IoT-Enabled-Edge-Cloud-Hybrid-System-for-Real-Time", img: "https://opengraph.githubassets.com/2/therealgone/EdgeSign-An-IoT-Enabled-Edge-Cloud-Hybrid-System-for-Real-Time" },
  { num: "02", tag: "AI · Docker · Sandboxing", title: "CodeDock", desc: "Generate code with an LLM or paste your own, pick a language, run it in an isolated container. Docker sandboxes with strict resource limits and zero network access; failed runs loop back to the model with the error output until they pass or hit the retry cap.", stack: "Next.js · Express/FastAPI · Docker · OpenAI API · TypeScript", href: "https://github.com/therealgone/CodeDock", img: "https://opengraph.githubassets.com/2/therealgone/CodeDock" },
  { num: "03", tag: "Next.js · Product", title: "Acadia OS", desc: "A fast, mobile-first interface for SRM's academic system — timetable, attendance, marks, courses, calendar and profile in one dashboard. Predictive attendance projects your future margin; TanStack Query caching keeps it usable offline.", stack: "Next.js · TanStack Query · Vercel Edge Middleware · Tailwind CSS", href: "https://github.com/therealgone/Acadia-OS", img: "https://opengraph.githubassets.com/2/therealgone/Acadia-OS" },
  { num: "04", tag: "Mobile · Offline-first", title: "Nook", desc: "A streamlined, minimalist money tracker built to make managing daily expenses quick and friction-free. Offline-first by design — it cuts the clutter of overwhelming budgets and complex features in favour of simple cash-flow tracking and custom spending buckets. Play Store release pending.", stack: "React Native · Offline-first · Local storage", href: "https://github.com/therealgone/-Nook-", img: "https://opengraph.githubassets.com/2/therealgone/-Nook-" },
  { num: "05", tag: "LSTM · MediaPipe · Accessibility", title: "Sign Language Detection", desc: "The original gesture-recognition system — a 39-gesture prototype using computer vision and machine learning to translate sign language into speech and text. The groundwork that EdgeSign was rebuilt from.", stack: "Python · MediaPipe · LSTM · TensorFlow", href: "https://github.com/therealgone/Hand-Gesture-Based-Communication-System-for-Disabled-Individual", img: "https://github.com/therealgone/Hand-Gesture-Based-Communication-System-for-Disabled-Individual/raw/main/UI.jpg" },
  { num: "06", tag: "OCR · Gemini · Streamlit", title: "Medical Insurance Report Analysis", desc: "OCR plus AI-driven text analysis that summarizes medical reports into plain language for claim processing, flags key conditions and risk factors, and emits structured insurance-ready PDFs.", stack: "Python · Streamlit · Google Gemini · OCR", href: "https://github.com/therealgone/Medical-Insurance-Report-", img: "https://github.com/therealgone/Medical-Insurance-Report-/raw/main/UI1.png" },
  { num: "07", tag: "AI · FastAPI · Gemini", title: "Fake News Detection", desc: "A web application that verifies news articles against AI analysis, pairing a FastAPI backend and CUDA-accelerated model inference with Google's Gemini for reasoning over claims.", stack: "FastAPI · React · CUDA · Gemini", href: "https://github.com/therealgone/FAKE-NEWS-DETECTION", img: "https://github.com/therealgone/FAKE-NEWS-DETECTION/raw/main/Fake%20News%20Detector%20UI.png" },
  { num: "08", tag: "Next.js · Realtime", title: "NexText", desc: "A real-time chat application built on Next.js with a secure authentication flow and a heavily animated interface — my first serious pass at realtime state.", stack: "Next.js · WebSockets · Auth", href: "https://github.com/therealgone/NexText", img: "https://github.com/therealgone/NexText/raw/main/UI/Home.png" },
  { num: "09", tag: "Unity · C# · First game", title: "Spacy Bird", desc: "My first game, made in Unity to learn game development and C#. Not polished, not pretty — but I had a lot of fun making it and learned a lot along the way. A very basic game, and I am not going to pretend otherwise.", stack: "Unity · C# · 2D physics", href: "https://github.com/therealgone/Spacy---Bird", img: "https://opengraph.githubassets.com/2/therealgone/Spacy---Bird" },
  { num: "10", tag: "Web · Documentation", title: "Dev-Book", desc: "A living record of everything I learn and build in React and web development. As I learn, I build; as I build, I forget — Dev-Book is how I never lose track.", stack: "React · Vercel", href: "https://my-book-indol.vercel.app/", img: "https://github.com/therealgone/Dev-Book/blob/main/public/UI.png?raw=true" },
]
```

- [ ] **Step 2: `stack.ts`**

Copied verbatim from dc.html line 631 (the inline stack array assigned to `this._d.stack`), 55 items across 9 disciplines. **Every `img` path in the source is `icons/Name.svg` (or `""` for no-icon items) — rewrite each non-empty one to the Next.js `public/` path using this exact mapping** (confirmed against the actual files in `public/`, which differ from the source's `icons/` folder in three names):

| Source path | Next.js path |
|---|---|
| `icons/Python.svg` | `/Python.svg` |
| `icons/HTML.svg` | `/HTML.svg` |
| `icons/CSS.svg` | `/CSS.svg` |
| `icons/JS.svg` | `/JS.svg` |
| `icons/ts.svg` | `/ts.svg` |
| `icons/react.svg` | `/react.svg` |
| `icons/nextjs.svg` | `/nextjs.svg` |
| `icons/tailwind.svg` | `/tailwind.svg` |
| `icons/vite.svg` | `/vite.svg` |
| `icons/vercel.svg` | `/vercel.svg` |
| `icons/unity.svg` | `/unity.svg` |
| `icons/csh.svg` | `/csh.svg` |
| `icons/git.svg` | `/git.svg` |
| `icons/github.svg` | `/github.svg` |

(`icons/motion.svg` and `icons/sql.svg` don't appear in the 55-item stack array — only in the unused `data().frameworks`/`languages` blocks, which are not being ported; see the note at the end of this step.)

```ts
export type StackItem = {
  name: string
  desc: string
  cat: string
  img: string
}

export const STACK: StackItem[] = [
  { name: "Python", desc: "The language behind every model I train and every pipeline I ship.", cat: "AI / Machine Learning", img: "/Python.svg" },
  { name: "TensorFlow", desc: "Training and deploying the gesture classifier behind EdgeSign.", cat: "AI / Machine Learning", img: "" },
  { name: "Scikit-learn", desc: "Classical ML — baselines, preprocessing and evaluation.", cat: "AI / Machine Learning", img: "" },
  { name: "MediaPipe", desc: "21 hand landmarks per frame — the input layer of EdgeSign.", cat: "AI / Machine Learning", img: "" },
  { name: "LSTM", desc: "Sequence models for temporal gesture recognition.", cat: "AI / Machine Learning", img: "" },
  { name: "XGBoost", desc: "Gradient-boosted trees for structured, tabular problems.", cat: "AI / Machine Learning", img: "" },
  { name: "Random Forest", desc: "Ensemble baselines that are hard to beat on tabular data.", cat: "AI / Machine Learning", img: "" },
  { name: "Gradient Boosting", desc: "Additive models for high-accuracy structured prediction.", cat: "AI / Machine Learning", img: "" },
  { name: "Ensemble Learning", desc: "Combining weak learners into something reliable.", cat: "AI / Machine Learning", img: "" },
  { name: "LIME / SHAP", desc: "Explainability — showing why a model decided what it decided.", cat: "AI / Machine Learning", img: "" },
  { name: "Computer Vision", desc: "Real-time frame analysis, detection and tracking.", cat: "AI / Machine Learning", img: "" },
  { name: "OCR", desc: "Extracting text from scans and reports for downstream analysis.", cat: "AI / Machine Learning", img: "" },
  { name: "BiomedCLIP", desc: "Vision-language model for medical image and report alignment.", cat: "AI / Machine Learning", img: "" },
  { name: "HTML", desc: "The markup layer under everything I build for the web.", cat: "Frontend", img: "/HTML.svg" },
  { name: "CSS", desc: "Layout, motion and the parts of a build people actually feel.", cat: "Frontend", img: "/CSS.svg" },
  { name: "JavaScript", desc: "The dynamic language powering interactive interfaces.", cat: "Frontend", img: "/JS.svg" },
  { name: "TypeScript", desc: "Static typing — the reason my larger builds stay maintainable.", cat: "Frontend", img: "/ts.svg" },
  { name: "React", desc: "Component-driven UI for everything from dashboards to chat.", cat: "Frontend", img: "/react.svg" },
  { name: "Next.js", desc: "Server rendering, routing and edge middleware in one framework.", cat: "Frontend", img: "/nextjs.svg" },
  { name: "Tailwind CSS", desc: "Utility-first styling for fast, consistent interfaces.", cat: "Frontend", img: "/tailwind.svg" },
  { name: "Vite", desc: "Fast build tooling for modern frontend projects.", cat: "Frontend", img: "/vite.svg" },
  { name: "Flask", desc: "Lightweight Python server — the inference layer in EdgeSign.", cat: "Backend", img: "" },
  { name: "Node.js", desc: "JavaScript runtime powering the API layers behind my builds.", cat: "Backend", img: "" },
  { name: "REST APIs", desc: "The contract layer between my frontends and everything behind them.", cat: "Backend", img: "" },
  { name: "WebSockets", desc: "Persistent connections for realtime chat and edge streaming.", cat: "Backend", img: "" },
  { name: "Cloudflare", desc: "Edge network, DNS and protection in front of my deployments.", cat: "Cloud / DevOps", img: "" },
  { name: "Cloudflare Tunnel", desc: "Exposing local and edge devices securely without open ports.", cat: "Cloud / DevOps", img: "" },
  { name: "Vercel", desc: "Deployment platform for my Next.js and frontend work.", cat: "Cloud / DevOps", img: "/vercel.svg" },
  { name: "Docker", desc: "Container isolation with hard resource limits — CodeDock's sandbox engine.", cat: "Cloud / DevOps", img: "" },
  { name: "Wrangler", desc: "Cloudflare's CLI for deploying and managing Workers.", cat: "Cloud / DevOps", img: "" },
  { name: "Linux", desc: "Daily driver and deployment target — comfortable in the shell.", cat: "Cloud / DevOps", img: "" },
  { name: "React Native", desc: "Cross-platform mobile apps from a React codebase.", cat: "App Development", img: "/react.svg" },
  { name: "Android", desc: "Native mobile development through the Google Developer program.", cat: "App Development", img: "" },
  { name: "Electron", desc: "Desktop applications built on web technology.", cat: "App Development", img: "" },
  { name: "Tauri", desc: "Lightweight Rust-backed desktop shells for web frontends.", cat: "App Development", img: "" },
  { name: "Unity", desc: "Game engine for 2D and 3D — physics, input and scene systems.", cat: "Game Development", img: "/unity.svg" },
  { name: "C#", desc: "Object-oriented language driving Unity gameplay logic.", cat: "Game Development", img: "/csh.svg" },
  { name: "2D Games", desc: "Sprite-based mechanics, level design and game feel.", cat: "Game Development", img: "" },
  { name: "Unity Physics", desc: "Collision, rigidbodies and the feel of a game world.", cat: "Game Development", img: "" },
  { name: "Input System", desc: "Unity's modern input pipeline across devices.", cat: "Game Development", img: "" },
  { name: "Raspberry Pi", desc: "The edge device running EdgeSign — inference and TTS on-device.", cat: "IoT / Edge", img: "" },
  { name: "Edge Computing", desc: "Running inference at the source to cut latency.", cat: "IoT / Edge", img: "" },
  { name: "Bluetooth", desc: "Wireless links between devices and peripherals.", cat: "IoT / Edge", img: "" },
  { name: "OLED / Hardware", desc: "Displays and sensor interfacing on real hardware.", cat: "IoT / Edge", img: "" },
  { name: "Git", desc: "Version control across every project I touch.", cat: "Tools", img: "/git.svg" },
  { name: "GitHub", desc: "Where all of this lives and gets reviewed.", cat: "Tools", img: "/github.svg" },
  { name: "VS Code", desc: "My editor, heavily configured.", cat: "Tools", img: "" },
  { name: "Arch Linux", desc: "Rolling-release Linux — built the way I want it.", cat: "Tools", img: "" },
  { name: "Hyprland", desc: "Wayland compositor and tiling window manager.", cat: "Tools", img: "" },
  { name: "Puppeteer", desc: "Headless browser automation and scraping.", cat: "Tools", img: "" },
  { name: "Generative AI", desc: "Using models as a creative material, not just a tool.", cat: "Creative Tech", img: "" },
  { name: "AI Image", desc: "Image generation pipelines for concept and asset work.", cat: "Creative Tech", img: "" },
  { name: "AI Video", desc: "Motion and video generation experiments.", cat: "Creative Tech", img: "" },
  { name: "Prompt Engineering", desc: "Getting reliable, structured output out of language models.", cat: "Creative Tech", img: "" },
  { name: "UI/UX", desc: "Interface experimentation — motion, density, feel.", cat: "Creative Tech", img: "" },
]
```

Note: the source's `data()` method (dc.html lines 602–629) also defines `languages`/`frameworks`/`tools` arrays (the old three-grid tech layout). They are computed but **never referenced** in `renderVals()` (only `stack` and `projects` are exposed to the template) — dead in the source itself. Do not port them; the unified 55-tile `STACK` field fully replaces that layout per HANDOFF §3's file map (`TechField.tsx`, no separate language/framework/tool components).

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` (or `npm run build`)
Expected: clean — both files are self-contained, not yet imported.

- [ ] **Step 4: Commit**

```bash
git add src/app/lib
git commit -m "Add PROJECTS and STACK data files"
```

---

### Task 4: Cursor

**Files:**
- Create: `src/app/components/Cursor.tsx`

**Interfaces:**
- Produces: default export `Cursor` (no props), mounted once by `page.tsx` (Task 15).
- Consumes: nothing from other tasks.

Port dc.html lines 41–42 (markup) and lines 710–731 (`initCursor`) exactly. `'use client'`. Desktop-only: bail out (render the two fixed dots but skip the mousemove listener — matching the source's `if (!dot || !ring || matchMedia(max-width:899px)) return`) so nothing runs on mobile; `globals.css`'s `@media (min-width: 900px) { * { cursor:none } }` (Task 1) already restores the native cursor under 900px.

- [ ] **Step 1: Write `Cursor.tsx`**

```tsx
'use client'
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring || window.matchMedia('(max-width: 899px)').matches) return

    let tx = -100, ty = -100, rx = -100, ry = -100, running = false
    let rafId: number

    const loop = () => {
      rx += (tx - rx) * 0.16
      ry += (ty - ry) * 0.16
      dot.style.transform = `translate3d(${tx - 3}px,${ty - 3}px,0)`
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`
      if (Math.abs(tx - rx) > 0.4 || Math.abs(ty - ry) > 0.4) {
        rafId = requestAnimationFrame(loop)
      } else {
        running = false
      }
    }

    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
      const t = e.target as HTMLElement | null
      const interactive = t?.closest?.('a,button,input,textarea,[data-island],[data-row]')
      ring.style.width = interactive ? '56px' : '34px'
      ring.style.height = interactive ? '56px' : '34px'
      ring.style.margin = interactive ? '-28px 0 0 -28px' : '-17px 0 0 -17px'
      if (!running) {
        running = true
        rafId = requestAnimationFrame(loop)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0, width: 6, height: 6, borderRadius: 999,
          background: '#fff', zIndex: 100000, pointerEvents: 'none',
          transform: 'translate3d(-100px,-100px,0)', mixBlendMode: 'difference',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0, width: 34, height: 34, margin: '-17px 0 0 -17px',
          borderRadius: 999, border: '1px solid rgba(255,255,255,0.35)', zIndex: 99999,
          pointerEvents: 'none', transform: 'translate3d(-100px,-100px,0)',
          transition: 'width .25s ease, height .25s ease, opacity .25s ease',
        }}
      />
    </>
  )
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: clean (unused component, not yet imported).

- [ ] **Step 3: Commit**

```bash
git add src/app/components/Cursor.tsx
git commit -m "Add Cursor component"
```

---

### Task 5: Nav island

**Files:**
- Create: `src/app/components/NavIsland.tsx`

**Interfaces:**
- Produces: default export `NavIsland` (no props). Owns its own `navOpen` state and its own scroll-engine subscription for active-section tracking — it does not receive `active` from a parent (the source computes it inside the same `tick()` that also drives Hero/About/Projects, but per-component subscriptions to the shared engine reproduce the same behavior without prop drilling).
- Consumes: `useScrollEngine` and `useScramble` (Task 2).

Port markup from dc.html lines 44–99 (island pill + overlay) and behavior from lines 662–663 (Escape key), 587–589 (`islandGlyph`/`toggleNav`/`closeNav`), and the active-section block at lines 1120–1132 (`ids`/`labels`, scramble on change).

- [ ] **Step 1: Write `NavIsland.tsx`**

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useScrollEngine } from '../hooks/useScrollEngine'
import { useScramble } from '../hooks/useScramble'

const SECTION_IDS = ['home', 'about', 'tech-stack', 'project', 'credentials', 'contact'] as const
const SECTION_LABELS: Record<(typeof SECTION_IDS)[number], string> = {
  home: 'Home', about: 'About', 'tech-stack': 'Tech Stack',
  project: 'Projects', credentials: 'Academics', contact: 'Contact',
}

const NAV_ROWS = [
  { num: '01', href: '#home', label: 'Home' },
  { num: '02', href: '#about', label: 'About' },
  { num: '03', href: '#tech-stack', label: 'Tech Stack' },
  { num: '04', href: '#project', label: 'Projects' },
  { num: '05', href: '#credentials', label: 'Academics' },
  { num: '06', href: '#contact', label: 'Contact' },
]

export default function NavIsland() {
  const [navOpen, setNavOpen] = useState(false)
  const [activeLabel, setActiveLabel] = useState('Home')
  const { subscribe } = useScrollEngine()
  const scramble = useScramble()
  const islandRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const activeRef = useRef('Home')

  useEffect(() => {
    return subscribe(() => {
      const vh = window.innerHeight
      let best: (typeof SECTION_IDS)[number] = 'home'
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= vh * 0.35) best = id
      })
      const label = SECTION_LABELS[best]
      if (label !== activeRef.current) {
        activeRef.current = label
        setActiveLabel(label)
        if (labelRef.current) scramble(labelRef.current, label, 420)
      }
    })
  }, [subscribe, scramble])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setNavOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <div style={{ position: 'fixed', top: 22, left: 0, right: 0, zIndex: 9000, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
        <div
          ref={islandRef}
          data-island=""
          className="glass"
          onClick={() => setNavOpen((v) => !v)}
          onMouseEnter={() => { if (islandRef.current) islandRef.current.style.transform = 'scale(1.04)' }}
          onMouseLeave={() => { if (islandRef.current) islandRef.current.style.transform = '' }}
          style={{
            pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 12, height: 44,
            padding: '0 8px 0 16px', borderRadius: 999, transition: 'transform .5s cubic-bezier(.2,.9,.2,1)',
            cursor: 'pointer',
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: 999, background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,0.9)', flex: 'none' }} />
          <span ref={labelRef} style={{ fontSize: 13, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.92)', minWidth: 82, textAlign: 'center', fontWeight: 400 }}>
            {activeLabel}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 999, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)', fontSize: 11, letterSpacing: '.1em' }}>
            {navOpen ? '×' : '⌘'}
          </span>
        </div>
      </div>

      {navOpen && (
        <div
          onClick={() => setNavOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 9500, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '88px 20px 20px' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass"
            style={{ width: '100%', maxWidth: 520, borderRadius: 24, padding: 10, background: 'rgba(255,255,255,0.02)', boxShadow: '4px 4px 24px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.15)' }}
          >
            <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: '#6f879c' }}>Navigate</span>
              <span style={{ fontSize: 11, letterSpacing: '.14em', color: 'rgba(255,255,255,0.35)' }}>ESC</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {NAV_ROWS.map((row) => (
                <NavRow key={row.num} {...row} onNavigate={() => setNavOpen(false)} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 20, padding: '18px 16px 14px', marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <a href="https://github.com/therealgone" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, letterSpacing: '.04em', color: 'rgba(255,255,255,0.55)' }}>GitHub ↗</a>
              <a href="https://www.linkedin.com/in/jeevan-baabu-murugan-ba3667426/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, letterSpacing: '.04em', color: 'rgba(255,255,255,0.55)' }}>LinkedIn ↗</a>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, letterSpacing: '.04em', color: 'rgba(255,255,255,0.55)' }}>Résumé ↗</a>
              <a href="mailto:jeevanbaabu03@gmail.com" style={{ fontSize: 13, letterSpacing: '.04em', color: 'rgba(255,255,255,0.55)' }}>Email ↗</a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function NavRow({ num, href, label, onNavigate }: { num: string; href: string; label: string; onNavigate: () => void }) {
  const rowRef = useRef<HTMLAnchorElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const scramble = useScramble()

  return (
    <a
      ref={rowRef}
      href={href}
      onClick={onNavigate}
      onMouseEnter={() => {
        if (rowRef.current) { rowRef.current.style.color = '#fff'; rowRef.current.style.background = 'rgba(255,255,255,0.04)' }
        if (barRef.current) { barRef.current.style.transition = 'width .28s cubic-bezier(.2,.9,.2,1)'; barRef.current.style.width = '100%' }
        if (textRef.current) scramble(textRef.current, label, 420)
      }}
      onMouseLeave={() => {
        if (rowRef.current) { rowRef.current.style.color = 'rgba(255,255,255,0.62)'; rowRef.current.style.background = '' }
        if (barRef.current) { barRef.current.style.transition = 'width .28s cubic-bezier(.2,.9,.2,1)'; barRef.current.style.width = '0%' }
      }}
      style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 16, padding: 16, borderRadius: 14, overflow: 'hidden', color: 'rgba(255,255,255,0.62)' }}
    >
      <span ref={barRef} style={{ position: 'absolute', left: 0, top: 0, height: 1, width: '0%', background: '#fff' }} />
      <span style={{ fontSize: 11, color: '#6f879c', letterSpacing: '.1em', width: 24 }}>{num}</span>
      <span ref={textRef} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 30, lineHeight: 1 }}>{label}</span>
    </a>
  )
}
```

Résumé link uses `/resume.pdf` (Task 14 copies the PDF there), not the source's `uploads/...` path — see Global Constraints and Task 14.

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/NavIsland.tsx
git commit -m "Add NavIsland component"
```

---

### Task 6: Hero

**Files:**
- Create: `src/app/components/Hero.tsx`

**Interfaces:**
- Produces: default export `Hero` (no props), renders `<section id="home">`.
- Consumes: `useScrollEngine` (Task 2).

Port markup from dc.html lines 101–129, video setup from lines 680–697 (`initVideo`), scroll response from lines 1052–1064.

- [ ] **Step 1: Write `Hero.tsx`**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { useScrollEngine } from '../hooks/useScrollEngine'

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

export default function Hero() {
  const { subscribe } = useScrollEngine()
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.playsInline = true
    video.loop = true
    const src = 'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8'
    let hls: import('hls.js').default | undefined

    const start = async () => {
      const HlsMod = (await import('hls.js')).default
      if (HlsMod.isSupported()) {
        hls = new HlsMod({ enableWorker: true })
        hls.loadSource(src)
        hls.attachMedia(video)
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src
      }
      video.play().catch(() => {})
    }
    start()

    return () => { hls?.destroy() }
  }, [])

  useEffect(() => {
    return subscribe(() => {
      const wrap = wrapRef.current
      const content = contentRef.current
      if (!wrap || !content) return
      const vh = window.innerHeight
      const total = wrap.offsetHeight - vh
      const p = clamp(-wrap.getBoundingClientRect().top / total, 0, 1)
      content.style.transform = `translateY(${-p * 90}px) scale(${1 - p * 0.08})`
      content.style.opacity = String(clamp(1 - p * 1.5, 0, 1))
      content.style.filter = `blur(${p * 5}px)`
      if (videoRef.current) videoRef.current.style.transform = `scale(${1.04 + p * 0.14})`
      if (cueRef.current) cueRef.current.style.opacity = String(clamp(1 - p * 4, 0, 1))
    })
  }, [subscribe])

  return (
    <section id="home" style={{ position: 'relative', height: '240vh' }}>
      <div ref={wrapRef} style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: 0.85, transform: 'scale(1.04)' }}
        />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'radial-gradient(120% 80% at 50% 45%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 70%, #000 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 220, zIndex: 2, background: 'linear-gradient(to bottom, #000, transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 260, zIndex: 2, background: 'linear-gradient(to top, #000, transparent)', pointerEvents: 'none' }} />

        <div ref={contentRef} style={{ position: 'relative', zIndex: 3, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '72px 24px 78px' }}>
          <div style={{ fontSize: 11, letterSpacing: '.3em', textTransform: 'uppercase', color: '#6f879c', marginBottom: 'min(26px, 2.4vh)' }}>Portfolio — V3</div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(34px, min(9.5vw, 10.5vh), 132px)', lineHeight: 1.32, letterSpacing: '-0.03em', margin: 0, maxWidth: '15ch', textWrap: 'balance' }}>
            <span style={{ display: 'block' }}>Jeevan Baabu</span>
            <span style={{ display: 'block', color: 'rgba(255,255,255,0.55)' }}>Murugan</span>
          </h1>
          <p style={{ margin: 'min(28px, 2.6vh) 0 0', fontWeight: 300, fontSize: 'clamp(13px, 1.4vw, 18px)', color: 'rgba(255,255,255,0.6)', maxWidth: '46ch', lineHeight: 1.5 }}>
            Computer Science Engineering — AI &amp; Machine Learning. I build full-stack products, AI tooling and edge–cloud systems, end to end.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 'min(36px, 3.4vh)', flexWrap: 'wrap' }}>
            <a href="#project" className="glass" style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: '13px 22px', fontSize: 14, fontWeight: 500, color: '#fff' }}>
              See the work <span style={{ fontSize: 15 }}>↗</span>
            </a>
            <a href="#contact" style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: '13px 22px', fontSize: 14, fontWeight: 500, background: '#fff', color: '#000' }}>
              Get in touch <span style={{ fontSize: 13 }}>↗</span>
            </a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 4px', fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.55)', borderBottom: '1px solid rgba(255,255,255,0.2)', transition: 'color .5s cubic-bezier(.52,.01,0,1), border-color .5s cubic-bezier(.52,.01,0,1)' }}>
              Résumé (PDF)
            </a>
          </div>
        </div>

        <div ref={cueRef} style={{ position: 'absolute', bottom: 34, left: 0, right: 0, zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.45)', fontSize: 10, letterSpacing: '.24em', textTransform: 'uppercase' }}>
          <span>Scroll</span>
          <span style={{ animation: 'om-cue 2s ease-in-out infinite', fontSize: 13 }}>↓</span>
        </div>
      </div>
    </section>
  )
}
```

The two glass CTA buttons (`See the work`, and the footer's `Start a conversation` in Task 13) need their `:hover` background bump (`rgba(255,255,255,0.1)` per line 118's `style-hover`) — add `onMouseEnter`/`onMouseLeave` handlers via a ref exactly like `NavIsland`'s island pill, following the Global Constraints hover rule. Same for the "Get in touch" button's hover (`rgba(255,255,255,0.88)`) and the Résumé link's hover (`color:#fff; border-color:#fff`).

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/Hero.tsx
git commit -m "Add Hero component"
```

---

### Task 7: About (chapter track)

**Files:**
- Create: `src/app/components/About.tsx`

**Interfaces:**
- Produces: default export `About` (no props), renders `<section id="about">` and mounts `<RabbitHole />` (Task 8) as its last child.
- Consumes: `useScrollEngine`, `useScramble`, `useRevealOnScroll`, `useScrambleOnView` (Task 2), `RabbitHole` (Task 8).

Port markup from dc.html lines 131–183 (everything except the `#rabbit-hole` div, which is `RabbitHole.tsx`'s markup). Behavior: track scroll-math from lines 1068–1103, tick click-to-scroll from lines 1013–1026.

- [ ] **Step 1: Write `About.tsx`**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { useScrollEngine } from '../hooks/useScrollEngine'
import { useScramble } from '../hooks/useScramble'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import { useScrambleOnView } from '../hooks/useScrambleOnView'
import RabbitHole from './RabbitHole'

const CHAPTERS = [
  { title: 'I build things', body: <>Successfully completed my <span style={{ color: '#fff' }}>B.Tech in Computer Science Engineering (Artificial Intelligence &amp; Machine Learning)</span> from SRM Institute of Science and Technology with <span style={{ color: '#fff' }}>First Class with Distinction</span>. My work sits across machine learning, web development and software engineering. I enjoy turning ideas into real, working products — and learning whatever is needed to make them happen.</> },
  { title: 'Exploring beyond my field', body: <>I don&apos;t like limiting myself to what I already know. I&apos;ll get my hands dirty with <span style={{ color: '#fff' }}>app development, game development, cloud technologies, creative tools</span> and other areas outside my core expertise — even when I&apos;m still a beginner. For me the goal isn&apos;t to know everything; it&apos;s to keep learning by actually building.</> },
  { title: 'I learn by doing', body: <>Rather than waiting until I&apos;m &quot;good enough&quot; to start something, I prefer jumping in, experimenting, breaking things and figuring them out along the way. Every project gives me a new skill, a new perspective, or sometimes just a <span style={{ color: '#fff' }}>really interesting problem to solve</span>.</> },
  { title: 'Always building', body: <>I&apos;m interested in the intersection of <span style={{ color: '#fff' }}>AI, software, creativity and product development</span>. Whether it&apos;s a web app, an AI system, a mobile app or a game — if an idea excites me, I want to build it.</> },
]
const TICK_LABELS = ['I build things', 'Beyond my field', 'I learn by doing', 'Always building']

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

export default function About() {
  const { subscribe } = useScrollEngine()
  const scramble = useScramble()
  const headingRef = useRef<HTMLSpanElement>(null)
  useScrambleOnView(headingRef, 'build')

  const trackWrapRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])
  const countRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const tickRefs = useRef<(HTMLButtonElement | null)[]>([])
  const tickLineRefs = useRef<(HTMLSpanElement | null)[]>([])
  const chapterIndexRef = useRef(-1)

  const h2Ref = useRef<HTMLHeadingElement>(null)
  useRevealOnScroll(h2Ref)

  useEffect(() => {
    return subscribe(() => {
      const track = trackWrapRef.current
      const rail = railRef.current
      if (!track || !rail) return
      const vh = window.innerHeight
      const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[]
      const total = track.offsetHeight - vh
      const p = clamp(-track.getBoundingClientRect().top / total, 0, 1)
      const n = panels.length
      const step = n > 1 ? panels[1].offsetLeft - panels[0].offsetLeft : 0
      const dist = step * (n - 1)
      rail.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`

      const pos = p * (n - 1)
      let nearest = 0, nd = Infinity
      panels.forEach((el, i) => {
        const off = Math.abs(pos - i)
        const f = clamp(1 - off, 0, 1)
        const e = f * f
        el.style.opacity = (0.2 + 0.8 * e).toFixed(3)
        el.style.transform = `scale(${(0.93 + 0.07 * e).toFixed(3)})`
        el.style.filter = f > 0.985 ? 'none' : `blur(${((1 - e) * 3.5).toFixed(1)}px)`
        if (off < nd) { nd = off; nearest = i }
      })

      if (nearest !== chapterIndexRef.current) {
        chapterIndexRef.current = nearest
        if (countRef.current) scramble(countRef.current, ('0' + (nearest + 1)).slice(-2), 340)
        if (labelRef.current) scramble(labelRef.current, TICK_LABELS[nearest], 420)
        tickRefs.current.forEach((btn, i) => {
          if (!btn) return
          const on = i === nearest
          btn.style.color = on ? '#fff' : 'rgba(255,255,255,0.32)'
          const line = tickLineRefs.current[i]
          if (line) { line.style.width = on ? '56px' : '26px'; line.style.background = on ? '#fff' : 'rgba(255,255,255,0.25)' }
        })
      }
    })
  }, [subscribe, scramble])

  const jumpTo = (i: number) => {
    const track = trackWrapRef.current
    if (!track) return
    const n = CHAPTERS.length
    const total = track.offsetHeight - window.innerHeight
    const top = track.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + total * (i / (n - 1)), behavior: 'smooth' })
  }

  return (
    <section id="about" style={{ position: 'relative', zIndex: 5, background: '#000', padding: '120px 24px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 56 }}>
          <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: '#6f879c' }}>01 / About</span>
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
        </div>
        <h2 ref={h2Ref} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(38px, 6vw, 84px)', lineHeight: 0.92, letterSpacing: '-0.025em', margin: '0 0 24px', maxWidth: '20ch' }}>
          I <span ref={headingRef}>build</span> things.
        </h2>
        <p style={{ margin: 0, fontWeight: 300, fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: '40ch' }}>Four chapters, read sideways. Scroll — or jump to one below.</p>
      </div>

      <div ref={trackWrapRef} data-track-wrap="" style={{ position: 'relative', height: '420vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, padding: '0 max(24px, calc((100vw - 1200px) / 2)) 34px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <span ref={countRef} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(30px, 4vw, 52px)', lineHeight: 1 }}>01</span>
              <span ref={labelRef} style={{ fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', color: '#6f879c' }}>I build things</span>
            </div>
          </div>

          <div ref={railRef} style={{ display: 'flex', gap: 28, paddingLeft: 'calc(50vw - min(300px, 40vw))', paddingRight: 'calc(50vw - min(300px, 40vw))', willChange: 'transform' }}>
            {CHAPTERS.map((ch, i) => (
              <div
                key={ch.title}
                ref={(el) => { panelRefs.current[i] = el }}
                data-chapter=""
                style={{ flex: 'none', boxSizing: 'border-box', width: 'min(600px, 80vw)', borderRadius: 24, padding: '44px 40px', background: 'rgba(255,255,255,0.035)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', gap: 22, willChange: 'transform, opacity', transition: 'background .5s cubic-bezier(.52,.01,0,1)' }}
              >
                <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 68, lineHeight: 0.8, color: 'rgba(255,255,255,0.16)' }}>{('0' + (i + 1)).slice(-2)}</span>
                <span style={{ fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', color: '#6f879c' }}>{ch.title}</span>
                <p style={{ margin: 0, fontWeight: 300, fontSize: 'clamp(17px, 1.8vw, 21px)', lineHeight: 1.5, color: 'rgba(255,255,255,0.8)' }}>{ch.body}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap', padding: '40px max(24px, calc((100vw - 1200px) / 2)) 0' }}>
            {TICK_LABELS.map((label, i) => (
              <button
                key={label}
                ref={(el) => { tickRefs.current[i] = el }}
                type="button"
                onClick={() => jumpTo(i)}
                style={{ border: 'none', background: 'transparent', padding: '12px 0', display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.32)', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', transition: 'color .5s cubic-bezier(.52,.01,0,1)', cursor: 'pointer' }}
              >
                <span ref={(el) => { tickLineRefs.current[i] = el }} style={{ display: 'block', width: 26, height: 1, background: 'rgba(255,255,255,0.25)', transition: 'width .5s cubic-bezier(.52,.01,0,1), background .5s cubic-bezier(.52,.01,0,1)' }} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <RabbitHole />
    </section>
  )
}
```

The chapter body copy above is transcribed from dc.html lines 156, 161, 166, 171 — before committing, diff each paragraph against those exact lines character-for-character (apostrophes, em-dashes, and the `<span style="color:#fff">...</span>` boundaries all matter).

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: fails only on the missing `./RabbitHole` import until Task 8 exists — if doing these tasks in strict order, stub `RabbitHole.tsx` with a temporary empty default export first, or do Task 8 immediately after this one before verifying. Note this dependency explicitly if dispatching Tasks 7 and 8 to different subagents.

- [ ] **Step 3: Commit** (after Task 8 exists so the build is actually green)

```bash
git add src/app/components/About.tsx
git commit -m "Add About component"
```

---

### Task 8: Rabbit Hole

**Files:**
- Create: `src/app/components/RabbitHole.tsx`

**Interfaces:**
- Produces: default export `RabbitHole` (no props). Imported and rendered by `About.tsx` (Task 7).
- Consumes: `useScramble`, `useRevealOnScroll` (Task 2).

Port markup from dc.html lines 185–304, behavior from `initHole` (lines 867–927), including the exact re-measure guard at lines 886–890.

- [ ] **Step 1: Write `RabbitHole.tsx`**

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useScramble } from '../hooks/useScramble'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'

type BranchId = 'b1' | 'b2' | 'b3' | 'b4'

const BRANCHES: { id: BranchId; q: string; kids: string[] }[] = [
  { id: 'b1', q: 'make it faster?', kids: ['squeeze more FPS out of a game', 'optimize the whole system', 'troubleshoot a stubborn Windows install'] },
  { id: 'b2', q: "what's actually inside?", kids: ['open up the hardware', 'replace the thermal paste', 'find what is really going wrong'] },
  { id: 'b3', q: 'can i get around it?', kids: ['work around software limitations', 'modify games', 'touch things I was not supposed to touch'] },
]
const B4 = { id: 'b4' as const, q: 'find out properly', kids: ["Windows, Linux and macOS — all three, on purpose", 'break it, research it, fix it, repeat', "then stop patching other people's software and write my own"] }

export default function RabbitHole() {
  const [opened, setOpened] = useState<Set<BranchId>>(new Set())
  const [unlocked, setUnlocked] = useState(false)
  const scramble = useScramble()

  const kidsRefs = useRef<Partial<Record<BranchId, HTMLDivElement | null>>>({})
  const signRefs = useRef<Partial<Record<BranchId, HTMLSpanElement | null>>>({})
  const convergeRef = useRef<HTMLDivElement>(null)
  const finalRef = useRef<HTMLDivElement>(null)
  const finalLineRef = useRef<HTMLSpanElement>(null)
  const caretRef = useRef<HTMLSpanElement>(null)

  const h3Ref = useRef<HTMLHeadingElement>(null)
  const p1Ref = useRef<HTMLParagraphElement>(null)
  const p2Ref = useRef<HTMLParagraphElement>(null)
  useRevealOnScroll(h3Ref)
  useRevealOnScroll(p1Ref)
  useRevealOnScroll(p2Ref)

  useEffect(() => {
    const caret = caretRef.current
    if (!caret) return
    const id = setInterval(() => {
      caret.style.opacity = caret.style.opacity === '0' ? '1' : '0'
    }, 560)
    return () => clearInterval(id)
  }, [])

  const setOpen = (id: BranchId, on: boolean) => {
    const kids = kidsRefs.current[id]
    const sign = signRefs.current[id]
    if (kids) {
      kids.style.maxHeight = on ? kids.scrollHeight + 'px' : '0px'
      kids.style.opacity = on ? '1' : '0'
    }
    if (sign) {
      sign.textContent = on ? '−' : '+'
      sign.style.background = on ? '#fff' : 'rgba(255,255,255,0.06)'
      sign.style.color = on ? '#000' : 'rgba(255,255,255,0.7)'
    }

    setOpened((prev) => {
      const next = new Set(prev)
      if (on) next.add(id); else next.delete(id)

      if (['b1', 'b2', 'b3'].every((k) => next.has(k as BranchId))) {
        unlock()
      }
      // Re-measure the converge block if it's already expanded but not yet
      // set to 'none' — otherwise opening b4 after unlock re-clamps it to a
      // stale pixel height and hides the payoff (source lines 886-890).
      const converge = convergeRef.current
      if (converge && !unlockedRef.current && converge.style.maxHeight && converge.style.maxHeight !== '0px' && converge.style.maxHeight !== 'none') {
        converge.style.maxHeight = converge.scrollHeight + 'px'
      }
      return next
    })
  }

  const unlockedRef = useRef(false)
  const unlock = () => {
    if (unlockedRef.current) return
    unlockedRef.current = true
    setUnlocked(true)
    const converge = convergeRef.current
    if (!converge) return
    converge.style.maxHeight = converge.scrollHeight + 'px'
    converge.style.opacity = '1'
    setTimeout(() => {
      if (finalRef.current) {
        finalRef.current.style.opacity = '1'
        finalRef.current.style.transform = 'none'
      }
      if (finalLineRef.current) scramble(finalLineRef.current, "I just know I'll figure it out.", 700)
      if (convergeRef.current) convergeRef.current.style.maxHeight = 'none'
    }, 700)
  }

  const allOpen = ['b1', 'b2', 'b3', 'b4'].every((id) => opened.has(id as BranchId))
  const toggleAll = () => {
    const every: BranchId[] = ['b1', 'b2', 'b3', 'b4']
    const shut = every.some((id) => !opened.has(id))
    every.forEach((id, i) => setTimeout(() => setOpen(id, shut), i * 110))
  }

  return (
    <div id="rabbit-hole" style={{ maxWidth: 1200, margin: '0 auto', padding: '130px 0 40px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 40 }}>
        <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: '#6f879c' }}>01.5 / The rabbit hole</span>
        <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 56, alignItems: 'start' }}>
        <div>
          <h3 ref={h3Ref} style={{ margin: '0 0 20px', fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(30px, 3.6vw, 52px)', lineHeight: 1.05, letterSpacing: '-0.02em', maxWidth: '18ch' }}>
            I&apos;ve always been curious about <span>how things work</span>.
          </h3>
          <p ref={p1Ref} style={{ margin: '0 0 16px', fontWeight: 300, fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.5)', maxWidth: '46ch' }}>
            Long before I studied Computer Science I was experimenting with technology on my own — Windows, Linux and macOS, software and hardware alike, learning most of it by trying, breaking, researching and fixing.
          </p>
          <p ref={p2Ref} style={{ margin: 0, fontWeight: 300, fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.5)', maxWidth: '46ch' }}>
            That curiosity is what made me. It always started the same way &mdash; <span style={{ color: 'rgba(255,255,255,0.85)' }}>open it up.</span>
          </p>
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, paddingBottom: 14, marginBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
            <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, 'Cascadia Mono', monospace", fontSize: 'clamp(13px, 1.4vw, 17px)', color: '#fff' }}>
              &gt; i wonder if i can
              <span ref={caretRef} style={{ display: 'inline-block', width: 8, height: 15, marginLeft: 4, background: '#fff', verticalAlign: -2 }} />
            </span>
            <button type="button" onClick={toggleAll} style={{ flex: 'none', border: 'none', background: 'transparent', fontFamily: "ui-monospace, SFMono-Regular, Menlo, 'Cascadia Mono', monospace", fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }}>
              {allOpen ? 'close all' : 'open all'}
            </button>
          </div>

          {BRANCHES.map((b) => (
            <Branch key={b.id} id={b.id} q={b.q} kids={b.kids} open={opened.has(b.id)} onToggle={() => setOpen(b.id, !opened.has(b.id))} kidsRef={(el) => { kidsRefs.current[b.id] = el }} signRef={(el) => { signRefs.current[b.id] = el }} />
          ))}

          <div ref={convergeRef} style={{ overflow: 'hidden', maxHeight: 0, opacity: 0, transition: 'max-height .7s cubic-bezier(.52,.01,0,1), opacity .6s cubic-bezier(.52,.01,0,1)' }}>
            <div style={{ paddingTop: 26 }}>
              <span style={{ display: 'block', fontFamily: "ui-monospace, SFMono-Regular, Menlo, 'Cascadia Mono', monospace", fontSize: 'clamp(13px, 1.4vw, 17px)', color: '#fff', marginBottom: 4 }}>
                &gt; so how does this actually work?
              </span>
              <Branch id={B4.id} q={B4.q} kids={B4.kids} open={opened.has('b4')} onToggle={() => setOpen('b4', !opened.has('b4'))} kidsRef={(el) => { kidsRefs.current.b4 = el }} signRef={(el) => { signRefs.current.b4 = el }} />
              <div ref={finalRef} style={{ marginTop: 26, padding: '22px 24px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12)', opacity: 0, transform: 'translateY(14px)', transition: 'opacity .7s cubic-bezier(.52,.01,0,1), transform .7s cubic-bezier(.52,.01,0,1)' }}>
                <span style={{ display: 'block', fontFamily: "ui-monospace, SFMono-Regular, Menlo, 'Cascadia Mono', monospace", fontSize: 12, color: 'rgba(111,135,156,0.85)', marginBottom: 10 }}>
                  // i don&apos;t always know the answer when i start
                </span>
                <span ref={finalLineRef} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(24px, 3vw, 38px)', lineHeight: 1.1, color: '#fff' }}>
                  {unlocked ? "I just know I'll figure it out." : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Branch({ id, q, kids, open, onToggle, kidsRef, signRef }: {
  id: BranchId; q: string; kids: string[]; open: boolean; onToggle: () => void
  kidsRef: (el: HTMLDivElement | null) => void; signRef: (el: HTMLSpanElement | null) => void
}) {
  const textRef = useRef<HTMLSpanElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const scramble = useScramble()

  return (
    <div data-branch={id} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <button
        ref={btnRef}
        type="button"
        onClick={onToggle}
        onMouseEnter={() => { if (btnRef.current) btnRef.current.style.color = '#fff'; if (textRef.current) scramble(textRef.current, q) }}
        onMouseLeave={() => { if (btnRef.current) btnRef.current.style.color = 'rgba(255,255,255,0.85)' }}
        style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, padding: '20px 2px', color: 'rgba(255,255,255,0.85)', transition: 'color .5s cubic-bezier(.52,.01,0,1)', cursor: 'pointer' }}
      >
        <span ref={signRef} style={{ flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 6, background: open ? '#fff' : 'rgba(255,255,255,0.06)', fontFamily: "ui-monospace, SFMono-Regular, Menlo, 'Cascadia Mono', monospace", fontSize: 13, lineHeight: 1, color: open ? '#000' : 'rgba(255,255,255,0.7)', transition: 'background .5s cubic-bezier(.52,.01,0,1), color .5s cubic-bezier(.52,.01,0,1)' }}>
          {open ? '−' : '+'}
        </span>
        <span ref={textRef} style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, 'Cascadia Mono', monospace", fontSize: 'clamp(13px, 1.3vw, 16px)', letterSpacing: '.02em' }}>{q}</span>
      </button>
      <div ref={kidsRef} style={{ overflow: 'hidden', maxHeight: 0, opacity: 0, transition: 'max-height .6s cubic-bezier(.52,.01,0,1), opacity .5s cubic-bezier(.52,.01,0,1)' }}>
        <div style={{ padding: '2px 0 20px 36px', borderLeft: '1px solid rgba(255,255,255,0.09)', marginLeft: 10 }}>
          {kids.map((k) => (
            <div key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '9px 0' }}>
              <span style={{ flex: 'none', fontFamily: "ui-monospace, SFMono-Regular, Menlo, 'Cascadia Mono', monospace", fontSize: 12, color: 'rgba(111,135,156,0.7)', paddingTop: 2 }}>└─</span>
              <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, 'Cascadia Mono', monospace", fontSize: 'clamp(12px, 1.15vw, 14px)', lineHeight: 1.55, color: 'rgba(255,255,255,0.62)' }}>{k}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

Note the `h3`'s inner scramble span (source line 193, `data-scramble` on "how things work") uses `useScrambleOnView` in the source but was left as a static `<span>` above for brevity — fix this before commit: add a ref + `useScrambleOnView(spanRef, 'how things work')` exactly like `About.tsx`'s heading, so it scrambles in on first view rather than rendering static.

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: clean once `About.tsx` (Task 7) imports this. Manually verify in `npm run dev` against Definition of Done items: "Opening all three Rabbit Hole branches unlocks the converge block, and the payoff line scrambles in" and "Opening the fourth branch afterwards does not clip the payoff card."

- [ ] **Step 3: Commit**

```bash
git add src/app/components/RabbitHole.tsx
git commit -m "Add RabbitHole component"
```

---

### Task 9: Tech field

**Files:**
- Create: `src/app/components/TechField.tsx`

**Interfaces:**
- Produces: default export `TechField` (no props).
- Consumes: `STACK` (Task 3), `useScramble`, `useRevealOnScroll` (Task 2).

Port markup from dc.html lines 307–339, push-field algorithm from `initBubbles` (lines 776–826).

- [ ] **Step 1: Write `TechField.tsx`**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { STACK } from '../lib/stack'
import { useScramble } from '../hooks/useScramble'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'

const R = 260
const MAX = 105

export default function TechField() {
  const scramble = useScramble()
  const nameRef = useRef<HTMLSpanElement>(null)
  const descRef = useRef<HTMLSpanElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<(HTMLDivElement | null)[]>([])
  const headingRef = useRef<HTMLSpanElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(revealRef)

  useEffect(() => {
    useScrambleOnViewNow(headingRef, 'tools', scramble)
  }, [scramble])

  useEffect(() => {
    const tiles = tileRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!tiles.length) return
    const state = tiles.map((el) => ({ el, x: 0, y: 0, tx: 0, ty: 0, s: 1, ts: 1 }))
    let mx = -9999, my = -9999, running = false, last = 0, rafId = 0

    const loop = () => {
      let moving = false
      state.forEach((o) => {
        const r = o.el.getBoundingClientRect()
        const cx = r.left + r.width / 2 - o.x
        const cy = r.top + r.height / 2 - o.y
        const dx = cx - mx, dy = cy - my
        const dist = Math.hypot(dx, dy)
        if (dist < R && dist > 0.001) {
          const f = 1 - dist / R
          const push = MAX * f * f
          o.tx = (dx / dist) * push
          o.ty = (dy / dist) * push
          o.ts = 1 - 0.12 * f
        } else {
          o.tx = 0; o.ty = 0; o.ts = 1
        }
        o.x += (o.tx - o.x) * 0.2
        o.y += (o.ty - o.y) * 0.2
        o.s += (o.ts - o.s) * 0.2
        o.el.style.transform = `translate3d(${o.x.toFixed(2)}px,${o.y.toFixed(2)}px,0) scale(${o.s.toFixed(3)})`
        if (Math.abs(o.tx - o.x) > 0.15 || Math.abs(o.ty - o.y) > 0.15) moving = true
      })
      if (moving || performance.now() - last < 400) rafId = requestAnimationFrame(loop)
      else running = false
    }

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY; last = performance.now()
      if (!running) { running = true; rafId = requestAnimationFrame(loop) }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  const show = (item: (typeof STACK)[number]) => {
    if (nameRef.current) scramble(nameRef.current, item.name, 380)
    if (descRef.current) descRef.current.textContent = item.desc
  }

  return (
    <section id="tech-stack" style={{ position: 'relative', zIndex: 5, background: '#000', padding: '120px 24px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 56 }}>
          <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: '#6f879c' }}>02 / Stack</span>
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
        </div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(38px, 6vw, 84px)', lineHeight: 0.92, letterSpacing: '-0.025em', margin: '0 0 24px', maxWidth: '22ch' }}>
          The <span ref={headingRef}>tools</span> I reach for.
        </h2>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, minHeight: 58, marginBottom: 48, paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span ref={nameRef} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(22px, 2.6vw, 32px)', lineHeight: 1, flex: 'none', color: '#fff' }}>Hover the field</span>
          <span ref={descRef} style={{ fontWeight: 300, fontSize: 15, lineHeight: 1.45, color: 'rgba(255,255,255,0.4)', maxWidth: '56ch' }}>Everything I work with, loose in one field. Move the cursor through it — or tap any tile.</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 22, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: 20, color: '#6f879c', fontWeight: 400 }}>Everything in one field</span>
          <span style={{ fontSize: 11, letterSpacing: '.18em', color: 'rgba(255,255,255,0.3)' }}>55 TOOLS · 9 DISCIPLINES</span>
        </div>

        <div ref={revealRef} style={{ display: 'flex', flexWrap: 'wrap', gap: 14, padding: '34px 0 10px' }}>
          <div ref={gridRef} style={{ display: 'contents' }}>
            {STACK.map((t, i) => {
              const mark = t.name.replace(/[^A-Za-z0-9+#]/g, '').slice(0, 2)
              return (
                <div
                  key={t.name}
                  ref={(el) => { tileRefs.current[i] = el }}
                  data-bubble=""
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.09)'; show(t) }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.035)' }}
                  onClick={() => show(t)}
                  style={{ position: 'relative', width: 122, height: 122, flex: 'none', borderRadius: 16, background: 'rgba(255,255,255,0.035)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, overflow: 'hidden', willChange: 'transform', transition: 'background .5s cubic-bezier(.52,.01,0,1)', cursor: 'pointer' }}
                >
                  <span style={{ position: 'absolute', top: 10, left: 12, fontSize: 8, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(111,135,156,0.7)', pointerEvents: 'none' }}>{t.cat}</span>
                  {t.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.img} alt={t.name} style={{ width: 36, height: 36, objectFit: 'contain', opacity: 0.9, pointerEvents: 'none' }} />
                  ) : (
                    <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 30, lineHeight: 1, color: 'rgba(255,255,255,0.55)', pointerEvents: 'none' }}>{mark}</span>
                  )}
                  <span style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6f879c', textAlign: 'center', maxWidth: 100, lineHeight: 1.2, pointerEvents: 'none' }}>{t.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
```

Fix the placeholder `useScrambleOnViewNow` call before commit — it isn't a real function. Replace those two lines with the real hook used the same way `About.tsx` and `RabbitHole.tsx` do:

```tsx
import { useScrambleOnView } from '../hooks/useScrambleOnView'
// ...
useScrambleOnView(headingRef, 'tools')
```

(called directly in the component body, not inside a `useEffect` — `useScrambleOnView` is itself a hook and manages its own effect).

Tap support (source line: "The tap handler is what makes this work on touch — keep it") is already covered by the `onClick={() => show(t)}` above, which fires on both tap and click.

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: clean. Manually verify in `npm run dev`: moving the cursor through the field pushes tiles aside (Definition of Done item), hovering/tapping updates the readout.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/TechField.tsx
git commit -m "Add TechField component"
```

---

### Task 10: Projects

**Files:**
- Create: `src/app/components/Projects.tsx`

**Interfaces:**
- Produces: default export `Projects` (no props).
- Consumes: `PROJECTS` (Task 3), `useScrollEngine`, `useScramble`, `useBarWipe` (Task 2).

Port markup from dc.html lines 341–393. Behavior from `setShot` (931–969), `initIndex`/`syncMode` (971–1011), and the desktop scroll block (1105–1118).

- [ ] **Step 1: Write `Projects.tsx`**

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { PROJECTS } from '../lib/projects'
import { useScrollEngine } from '../hooks/useScrollEngine'
import { useScramble } from '../hooks/useScramble'

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const FALLBACK_IMG = 'https://placehold.co/920x600/111214/6f879c?text=Project'

export default function Projects() {
  const { subscribe } = useScrollEngine()
  const scramble = useScramble()
  const wrapRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const barRefs = useRef<(HTMLSpanElement | null)[]>([])
  const arrowRefs = useRef<(HTMLSpanElement | null)[]>([])
  const shotRefs = useRef<(HTMLDivElement | null)[]>([])
  const numRef = useRef<HTMLSpanElement>(null)
  const tagRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const stackRef = useRef<HTMLParagraphElement>(null)

  const scrollIndexRef = useRef(0)
  const hoverIndexRef = useRef<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const setShot = (i: number) => {
    shotRefs.current.forEach((el, k) => {
      if (!el) return
      const on = k === i
      el.style.opacity = on ? '1' : '0'
      el.style.clipPath = on ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)'
      el.style.zIndex = on ? '2' : '1'
    })
    rowRefs.current.forEach((el, k) => {
      if (!el) return
      const on = k === i
      el.style.color = on ? '#fff' : 'rgba(255,255,255,0.3)'
      const arrow = arrowRefs.current[k]
      if (arrow) arrow.style.opacity = on ? '1' : '0'
      const bar = barRefs.current[k]
      if (bar) bar.style.width = on ? '100%' : '0%'
    })
    const p = PROJECTS[i]
    if (stackRef.current) stackRef.current.textContent = p ? p.stack : 'New builds land here as they ship'
    if (p) {
      if (numRef.current) numRef.current.textContent = p.num
      if (tagRef.current) scramble(tagRef.current, p.tag, 360)
      if (titleRef.current) scramble(titleRef.current, p.title, 460)
      if (descRef.current) descRef.current.textContent = p.desc
    } else {
      if (numRef.current) numRef.current.textContent = '11'
      if (tagRef.current) scramble(tagRef.current, 'Next up', 360)
      if (titleRef.current) scramble(titleRef.current, 'More coming soon', 440)
      if (descRef.current) descRef.current.textContent = 'New builds land here as they ship — web, ML and the occasional game experiment.'
    }
  }

  useEffect(() => { setShot(0) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // desktop: scroll-progress drives the active index
  useEffect(() => {
    return subscribe(() => {
      if (isMobile) return
      const wrap = wrapRef.current
      if (!wrap) return
      const vh = window.innerHeight
      const n = PROJECTS.length + 1
      const total = wrap.offsetHeight - vh
      if (total <= 0) return // guard: layout not settled yet (source lines 421 comment)
      const p = clamp(-wrap.getBoundingClientRect().top / total, 0, 1)
      const act = clamp(Math.floor(p * n), 0, n - 1)
      if (act !== scrollIndexRef.current) {
        scrollIndexRef.current = act
        if (hoverIndexRef.current == null) setShot(act)
      }
    })
  }, [subscribe, isMobile]) // eslint-disable-line react-hooks/exhaustive-deps

  // mobile: nearest-row-to-viewport-middle drives the active index; desktop and
  // mobile drivers are mutually exclusive (source's syncMode/§8 "two drivers, never both")
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 780px)').matches)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!isMobile) return
    const rows = rowRefs.current.filter(Boolean) as HTMLAnchorElement[]
    const io = new IntersectionObserver((entries) => {
      let best: IntersectionObserverEntry | null = null
      entries.forEach((en) => {
        if (!en.isIntersecting) return
        if (!best || en.intersectionRatio > best.intersectionRatio) best = en
      })
      if (best) {
        const i = rows.indexOf(best.target as HTMLAnchorElement)
        if (i > -1 && i !== scrollIndexRef.current) {
          scrollIndexRef.current = i
          setShot(i)
        }
      }
    }, { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.5, 1] })
    rows.forEach((r) => io.observe(r))
    return () => io.disconnect()
  }, [isMobile]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.querySelectorAll<HTMLImageElement>('[data-proj-img]').forEach((img) => {
      const fail = () => { if (img.src !== FALLBACK_IMG) img.src = FALLBACK_IMG }
      img.addEventListener('error', fail)
      if (img.complete && img.naturalWidth === 0) fail()
    })
  }, [])

  return (
    <section id="project" style={{ position: 'relative', zIndex: 5, background: '#000', padding: '120px 24px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 56 }}>
          <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: '#6f879c' }}>03 / Work</span>
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
        </div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(38px, 6vw, 84px)', lineHeight: 0.92, letterSpacing: '-0.025em', margin: '0 0 24px', maxWidth: '20ch' }}>Ten builds, one at a time.</h2>
        <p style={{ margin: '0 0 8px', fontWeight: 300, fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: '44ch' }}>Ten builds. Scroll the index — the preview follows. Hover to peek, click to open the repo.</p>
      </div>

      <div ref={wrapRef} data-index-wrap="" style={{ position: 'relative', height: '900vh', marginTop: 48 }}>
        <div data-index-sticky="" style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <div data-index-grid="" style={{ width: '100%', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 0.86fr) minmax(0, 1.14fr)', gap: 48, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {PROJECTS.map((p, i) => (
                <ProjectRow
                  key={p.num}
                  p={p}
                  onEnter={() => { hoverIndexRef.current = i; setShot(i) }}
                  onLeave={() => { hoverIndexRef.current = null; setShot(scrollIndexRef.current) }}
                  rowRef={(el) => { rowRefs.current[i] = el }}
                  barRef={(el) => { barRefs.current[i] = el }}
                  arrowRef={(el) => { arrowRefs.current[i] = el }}
                />
              ))}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: 'min(16px, 1.5vh) 4px', color: 'rgba(255,255,255,0.3)' }}>
                <span style={{ fontSize: 11, letterSpacing: '.16em', color: '#6f879c', flex: 'none' }}>11</span>
                <span style={{ fontSize: 'clamp(14px, min(1.5vw, 2vh), 19px)' }}>More coming soon</span>
              </div>
            </div>

            <div data-index-preview="" style={{ position: 'relative', width: '100%' }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10.5', maxHeight: '72vh', borderRadius: 20, overflow: 'hidden', background: '#0a0a0b', boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 20px 25px -5px rgba(0,0,0,0.6)' }}>
                {PROJECTS.map((p, i) => (
                  <div key={p.num} ref={(el) => { shotRefs.current[i] = el }} style={{ position: 'absolute', inset: 0, opacity: 0, clipPath: 'inset(0 0 100% 0)', transition: 'opacity .6s cubic-bezier(.52,.01,0,1), clip-path .7s cubic-bezier(.52,.01,0,1)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img data-proj-img="" src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                ))}
                <div ref={(el) => { shotRefs.current[PROJECTS.length] = el }} style={{ position: 'absolute', inset: 0, opacity: 0, clipPath: 'inset(0 0 100% 0)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 20, transition: 'opacity .6s cubic-bezier(.52,.01,0,1), clip-path .7s cubic-bezier(.52,.01,0,1)' }}>
                  <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 'clamp(24px, 3vw, 40px)', color: 'rgba(255,255,255,0.6)' }}>In the workshop</span>
                </div>
              </div>
              <div style={{ paddingTop: 22, minHeight: 116 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 8 }}>
                  <span ref={numRef} style={{ fontSize: 11, letterSpacing: '.18em', color: '#6f879c' }}>01</span>
                  <span ref={tagRef} style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: '#6f879c' }}>IoT · Edge–Cloud · Research</span>
                </div>
                <h3 ref={titleRef} style={{ margin: '0 0 8px', fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(22px, 2.6vw, 34px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>EdgeSign</h3>
                <p ref={descRef} style={{ margin: '0 0 12px', fontWeight: 300, fontSize: 15, lineHeight: 1.5, color: 'rgba(255,255,255,0.55)', maxWidth: '60ch' }}>Real-time sign language translation on a Raspberry Pi 4 — 21 MediaPipe landmarks per frame, AI sentence generation instead of isolated words, and on-device text-to-speech.</p>
                <p ref={stackRef} style={{ margin: 0, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(111,135,156,0.85)' }}>Python · Raspberry Pi · MediaPipe · OpenCV · TensorFlow · Flask</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectRow({ p, onEnter, onLeave, rowRef, barRef, arrowRef }: {
  p: (typeof PROJECTS)[number]
  onEnter: () => void
  onLeave: () => void
  rowRef: (el: HTMLAnchorElement | null) => void
  barRef: (el: HTMLSpanElement | null) => void
  arrowRef: (el: HTMLSpanElement | null) => void
}) {
  const titleRef = useRef<HTMLSpanElement>(null)
  const scramble = useScramble()
  return (
    <a
      ref={rowRef}
      href={p.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => { onEnter(); if (titleRef.current) scramble(titleRef.current, p.title, 420) }}
      onMouseLeave={onLeave}
      style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'baseline', gap: 16, padding: 'min(16px, 1.5vh) 4px', borderBottom: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)', transition: 'color .5s cubic-bezier(.52,.01,0,1)' }}
    >
      <span ref={barRef} style={{ position: 'absolute', left: 0, top: 0, height: 1, width: '0%', background: '#fff', transition: 'width .5s cubic-bezier(.52,.01,0,1)' }} />
      <span style={{ fontSize: 11, letterSpacing: '.16em', color: '#6f879c', flex: 'none' }}>{p.num}</span>
      <span ref={titleRef} style={{ fontSize: 'clamp(14px, min(1.5vw, 2vh), 19px)', lineHeight: 1.25 }}>{p.title}</span>
      <span ref={arrowRef} style={{ marginLeft: 'auto', fontSize: 13, opacity: 0, transition: 'opacity .5s cubic-bezier(.52,.01,0,1)' }}>↗</span>
    </a>
  )
}
```

The row hover bar in the source (line 356's `data-row` + line 357's `data-bar`) uses the default `.5s`/`.3s` timing (not the nav's `.28s`/`.2,.9,.2,1`) — `ProjectRow`'s inline bar handling above matches that. The `data-index-row`/`data-bar`/`data-index-arrow` state writes on hover are handled by `onEnter`/`setShot` already (setShot sets bar width/color/arrow for every row based on active index), so `ProjectRow` doesn't need its own separate bar-hover effect beyond what `setShot` already drives — this differs slightly from a literal 1:1 `useBarWipe` because the source's `initHover` bar-wipe and `setShot`'s bar-set both target the same `[data-bar]` (source line 949: `if (bar && !el.__hovering) bar.style.width = ...`, i.e. `setShot` skips rows currently being hovered so `initHover`'s wipe wins during a live hover). Reproduce that guard: track a `hoveringRef` per row (or reuse `hoverIndexRef` — since only one row can be hovered at a time, `setShot`'s row loop should skip writing `bar.style.width` when `k === hoverIndexRef.current`, matching source line 949 exactly). Add that guard to the `setShot` row loop before commit:

```ts
if (bar && k !== hoverIndexRef.current) bar.style.width = on ? '100%' : '0%'
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: clean. Manually verify in `npm run dev`: scrolling walks all 11 rows with the preview wiping in and titles scrambling; hovering a row previews it and leaving restores the scrolled one; at 375px wide the section unpins and the preview sticks to the top (Definition of Done items).

- [ ] **Step 3: Commit**

```bash
git add src/app/components/Projects.tsx
git commit -m "Add Projects component"
```

---

### Task 11: Academics

**Files:**
- Create: `src/app/components/Academics.tsx`

**Interfaces:**
- Produces: default export `Academics` (no props).
- Consumes: `useRevealOnScroll`, `useScrambleOnHover`, `useBarWipe` (Task 2).

Static section, no scroll math. Port markup verbatim from dc.html lines 395–498 (degree card, Experience row, two elective rows, six certification cards). Every row/card with `data-row` + `data-bar` needs `useBarWipe`; every `data-scramble-hover` span needs `useScrambleOnHover` against its `data-row` host; every `data-reveal` needs `useRevealOnScroll`.

- [ ] **Step 1: Write `Academics.tsx`**

Build this component by reading dc.html lines 395–498 directly and applying the Global Constraints conversion rules element-by-element (this section has no scroll-driven math, so it is the most mechanical of the ten — the risk here is transcription drift, not logic bugs). Concretely:

- The degree summary bar (line 404) is `data-reveal` only, no row/bar/hover.
- The Experience row (line 415) is an `<a>` with `data-row data-reveal data-grid3` (note the source has `data-grid3=""` duplicated twice on that element — that's harmless HTML, just don't duplicate the prop in JSX) → needs `useBarWipe` and `useScrambleOnHover` (target: the `Intern, ADNOC Group` span, line 419) and `useRevealOnScroll`, plus the `[data-grid3]` attribute kept literally for the mobile CSS rule.
- The two elective rows (lines 434, 443) are `<div data-row data-reveal data-grid3>` → same three hooks each, targeting their course-name spans (lines 438, 447).
- The six certification cards (lines 460–495) are `<div data-row data-reveal>` (no `data-grid3` — they're already `repeat(auto-fit, minmax(260px,1fr))`, line 459) → `useBarWipe` + `useRevealOnScroll` + `useScrambleOnHover` targeting each card's title span (e.g. line 463).
- The h2 (line 402) has one `data-scramble` word (`Electives`) → `useScrambleOnView`.
- The "Verify on LinkedIn ↗" link (line 457) has `style-hover` only (no row/bar) → direct ref + onMouseEnter/onMouseLeave per the Global Constraints hover rule.

Write each of the ~11 interactive elements as small local components (mirroring `ProjectRow` in Task 10 and `Branch` in Task 8) so each can call `useRef`/the hooks independently — a single `Academics` function component cannot call a variable number of hooks in a loop.

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: clean. Manually diff the rendered section in `npm run dev` against the source markup (copy text, GPA figure "8.29 / 10", dates, credit counts) line by line — this section is pure content, so a typo here is a silent content bug, not a build error.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/Academics.tsx
git commit -m "Add Academics component"
```

---

### Task 12: Contact

**Files:**
- Create: `src/app/components/Contact.tsx`

**Interfaces:**
- Produces: default export `Contact` (no props).
- Consumes: `useRevealOnScroll`, `useScrambleOnHover`, `useBarWipe`, `useScrambleOnView` (Task 2).

Port markup from dc.html lines 500–542, submit handler from lines 635–647 (`send`).

- [ ] **Step 1: Write `Contact.tsx`**

```tsx
'use client'
import { useRef, useState } from 'react'
import { useScrambleOnView } from '../hooks/useScrambleOnView'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import { useScrambleOnHover } from '../hooks/useScrambleOnHover'
import { useBarWipe } from '../hooks/useBarWipe'

const LINKS = [
  { href: 'https://github.com/therealgone', label: 'GitHub', meta: 'therealgone ↗', external: true },
  { href: 'https://www.linkedin.com/in/jeevan-baabu-murugan-ba3667426/', label: 'LinkedIn', meta: 'jeevan-baabu ↗', external: true },
  { href: 'mailto:jeevanbaabu03@gmail.com', label: 'Email', meta: 'jeevanbaabu03@gmail.com ↗', external: false },
  { href: '/resume.pdf', label: 'Résumé', meta: 'PDF ↓', external: true },
]

export default function Contact() {
  const h2Ref = useRef<HTMLHeadingElement>(null)
  const scrambleTargetRef = useRef<HTMLSpanElement>(null)
  useRevealOnScroll(h2Ref)
  useScrambleOnView(scrambleTargetRef, 'Say hello')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('https://formspree.io/f/xeokobav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (res.ok) {
        setSent(true)
        setName(''); setEmail(''); setMessage('')
        setTimeout(() => setSent(false), 5000)
      }
    } catch {
      // offline preview — swallow, matches source's empty catch
    }
  }

  return (
    <section id="contact" style={{ position: 'relative', zIndex: 5, background: '#000', padding: '20px 24px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 56 }}>
          <span style={{ fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', color: '#6f879c' }}>05 / Contact</span>
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.12)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'start' }}>
          <div>
            <h2 ref={h2Ref} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(38px, 6vw, 84px)', lineHeight: 0.9, letterSpacing: '-0.025em', margin: '0 0 20px', maxWidth: '16ch' }}>
              <span ref={scrambleTargetRef}>Say hello</span>, or send me something hard.
            </h2>
            <p style={{ margin: '0 0 28px', fontWeight: 300, fontSize: 17, lineHeight: 1.55, color: 'rgba(255,255,255,0.55)', maxWidth: '40ch' }}>
              B.Tech complete — open to full-stack, AI/ML and cloud engineering roles. Reachable in Chennai and Abu Dhabi — I read everything that lands here.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 420 }}>
              {LINKS.map((l) => <ContactLink key={l.label} {...l} />)}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '18px 4px', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                <span>Chennai, India</span><span>Abu Dhabi, UAE</span>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="glass" style={{ borderRadius: 24, padding: 28, background: 'rgba(255,255,255,0.02)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.12)', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span style={{ fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: '#6f879c' }}>Send a message</span>
            <input
              type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              style={{ width: '100%', boxSizing: 'border-box', padding: '15px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 15, outline: 'none' }}
            />
            <input
              type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" required
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              style={{ width: '100%', boxSizing: 'border-box', padding: '15px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 15, outline: 'none' }}
            />
            <textarea
              name="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message" required
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              style={{ width: '100%', boxSizing: 'border-box', height: 150, resize: 'none', padding: '15px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 15, lineHeight: 1.5, outline: 'none' }}
            />
            <button
              type="submit"
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.88)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff' }}
              style={{ marginTop: 4, width: '100%', border: 'none', borderRadius: 999, padding: '15px 20px', background: '#fff', color: '#000', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
            >
              {sent ? 'Message sent — thank you' : 'Send message'} <span style={{ fontSize: 13 }}>↗</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

function ContactLink({ href, label, meta, external }: { href: string; label: string; meta: string; external: boolean }) {
  const rowRef = useRef<HTMLAnchorElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  useBarWipe(rowRef, barRef)
  useScrambleOnHover(rowRef, textRef, label)

  return (
    <a
      ref={rowRef}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onMouseEnter={(e) => { e.currentTarget.style.color = '#fff' }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.62)' }}
      style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 4px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.62)' }}
    >
      <span ref={barRef} style={{ position: 'absolute', left: 0, top: 0, height: 1, width: '0%', background: '#fff' }} />
      <span ref={textRef} style={{ fontSize: 20 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#6f879c' }}>{meta}</span>
    </a>
  )
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: clean. Manually submit the form in `npm run dev` (or with network throttled offline) to confirm: button label swaps to "Message sent — thank you" on success and reverts after 5s; an offline failure doesn't throw (Definition of Done items).

- [ ] **Step 3: Commit**

```bash
git add src/app/components/Contact.tsx
git commit -m "Add Contact component"
```

---

### Task 13: Footer

**Files:**
- Create: `src/app/components/Footer.tsx`

**Interfaces:**
- Produces: default export `Footer` (no props).
- Consumes: `useRevealOnScroll`, `useScrambleOnView` (Task 2).

Port markup verbatim from dc.html lines 544–562.

- [ ] **Step 1: Write `Footer.tsx`**

```tsx
'use client'
import { useRef } from 'react'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import { useScrambleOnView } from '../hooks/useScrambleOnView'

export default function Footer() {
  const h2Ref = useRef<HTMLHeadingElement>(null)
  const scrambleRef = useRef<HTMLSpanElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  useRevealOnScroll(h2Ref)
  useScrambleOnView(scrambleRef, 'next one')

  return (
    <footer style={{ position: 'relative', zIndex: 5, background: '#000', padding: '140px 24px 40px', textAlign: 'center' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 ref={h2Ref} style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(42px, 7vw, 96px)', lineHeight: 0.86, letterSpacing: '-0.03em', margin: '0 auto 18px', maxWidth: '22ch' }}>
          Let&apos;s build the <span ref={scrambleRef}>next one</span> together.
        </h2>
        <p style={{ margin: '0 auto 34px', fontWeight: 300, fontSize: 15, color: 'rgba(255,255,255,0.5)', maxWidth: '42ch', lineHeight: 1.55 }}>
          No commitment, no pressure. Just possibilities — and probably too many browser tabs.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <a
            ref={ctaRef}
            href="#contact"
            className="glass"
            onMouseEnter={() => { if (ctaRef.current) ctaRef.current.style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={() => { if (ctaRef.current) ctaRef.current.style.background = '' }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: '13px 22px', fontSize: 14, fontWeight: 500, color: '#fff' }}
          >
            Start a conversation <span style={{ fontSize: 15 }}>↗</span>
          </a>
          <a href="https://github.com/therealgone" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: '13px 22px', fontSize: 14, fontWeight: 500, background: '#fff', color: '#000' }}>
            View GitHub <span style={{ fontSize: 13 }}>↗</span>
          </a>
        </div>
        <div style={{ marginTop: 120, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
          <p style={{ margin: 0, fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>© 2026 Jeevan Baabu Murugan. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a href="#home" style={{ fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Top</a>
            <a href="https://github.com/therealgone" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>GitHub</a>
            <a href="https://www.linkedin.com/in/jeevan-baabu-murugan-ba3667426/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>LinkedIn</a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Résumé</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

The four small legal-row links (`Top`/`GitHub`/`LinkedIn`/`Résumé`) have a `style-hover` (`color: rgba(255,255,255,0.7)`) — add the same ref+onMouseEnter/Leave pattern used elsewhere in this task before commit if pixel-hover-fidelity matters here (low-risk, low-visibility row; still required by Global Constraints).

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/Footer.tsx
git commit -m "Add Footer component"
```

---

### Task 14: Cutover — delete old tree, wire up page.tsx, clean dependencies

**Files:**
- Modify: `src/app/page.tsx` (full replace)
- Modify: `package.json`
- Delete: `src/app/components/about.tsx`, `contact.tsx`, `electric-cursor.tsx`, `Hero_Page.tsx`, `navbar.tsx`, `project.tsx`, `spotlight-card.tsx`, `tech-stack.tsx`, and the whole `src/app/components/three/` directory
- Delete: `public/textures/lensflare/` (whole dir), `public/fonts/Inter_Bold.json`, `public/gltf/prism.glb`, `public/lut/F-6800-STD.cube` (and the now-empty `public/fonts/`, `public/gltf/`, `public/lut/` directories)
- Rename: `public/motion react.svg` → `public/motion-react.svg`
- Delete + regenerate: `package-lock.json`
- Copy: `Portfolio UI redesign with animations/uploads/Jeevan_Baabu_Murugan_Resume.pdf` → `public/resume.pdf`

**Interfaces:**
- Consumes: every component from Tasks 4–13 (`Cursor`, `NavIsland`, `Hero`, `About`, `TechField`, `Projects`, `Academics`, `Contact`, `Footer` — `RabbitHole` is consumed by `About`, not `page.tsx`, directly).

This is the one destructive task — everything before it was purely additive, so the build stayed green throughout. **Confirm every Task 4–13 commit exists before starting this task.**

- [ ] **Step 1: Copy the résumé**

```bash
cp "Portfolio UI redesign with animations/uploads/Jeevan_Baabu_Murugan_Resume.pdf" public/resume.pdf
```

- [ ] **Step 2: Rename the space-containing icon**

```bash
mv "public/motion react.svg" public/motion-react.svg
```

(Nothing currently references this file — `stack.ts`, Task 3, doesn't use Framer Motion's icon — confirm with `grep -rn "motion react\|motion-react" src` before/after; if truly unused, this rename is just cleanup and the file could also be deleted, but HANDOFF §1 says keep it, so rename rather than delete.)

- [ ] **Step 3: Delete the old component tree**

```bash
rm src/app/components/about.tsx src/app/components/contact.tsx src/app/components/electric-cursor.tsx src/app/components/Hero_Page.tsx src/app/components/navbar.tsx src/app/components/project.tsx src/app/components/spotlight-card.tsx src/app/components/tech-stack.tsx
rm -rf src/app/components/three
```

- [ ] **Step 4: Delete 3D-only public assets**

```bash
rm -rf public/textures
rm -f public/fonts/Inter_Bold.json
rmdir public/fonts 2>/dev/null || true
rm -f public/gltf/prism.glb
rmdir public/gltf 2>/dev/null || true
rm -f public/lut/F-6800-STD.cube
rmdir public/lut 2>/dev/null || true
```

- [ ] **Step 5: Update `package.json`**

Remove these from `dependencies`: `@react-three/drei`, `@react-three/fiber`, `@react-three/postprocessing`, `three`, `three-stdlib`, `postprocessing`, `stats.js`, `gsap`, `react-simple-typewriter`, `@fontsource/inter`.
Remove from `devDependencies`: `@types/gsap`.
Add to `dependencies`: `"hls.js": "^1.5.13"`.
Keep `framer-motion` only if `grep -rn "framer-motion" src/app` (after Step 3's deletions) still returns hits — it shouldn't, since none of Tasks 4–13 import it; if the grep is empty, remove `framer-motion` too.

- [ ] **Step 6: Regenerate the lockfile**

```bash
rm package-lock.json
npm install
```

Expected: installs clean, no three.js/GSAP entries in the new lockfile (`grep -c "three\|gsap" package-lock.json` should be 0 or near-0 — a false-positive substring match in an unrelated package name is fine, an actual `"three"`/`"gsap"` package entry is not).

- [ ] **Step 7: Rewrite `page.tsx`**

```tsx
import Cursor from './components/Cursor'
import NavIsland from './components/NavIsland'
import Hero from './components/Hero'
import About from './components/About'
import TechField from './components/TechField'
import Projects from './components/Projects'
import Academics from './components/Academics'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main>
      <Cursor />
      <NavIsland />
      <Hero />
      <About />
      <TechField />
      <Projects />
      <Academics />
      <Contact />
      <Footer />
    </main>
  )
}
```

Order is fixed per HANDOFF §3 and must not change: Cursor, NavIsland, Hero(`#home`), About(`#about`, contains RabbitHole as `#rabbit-hole`), TechField(`#tech-stack`), Projects(`#project`), Academics(`#credentials`), Contact(`#contact`), Footer.

- [ ] **Step 8: Verify**

Run: `npm run build`
Expected: clean build, zero references to `three`, `@react-three`, `gsap`, `stats.js`, `postprocessing`. Then run `npm run dev` and manually walk the **entire** HANDOFF §11 Definition of Done checklist top to bottom:

- Hero video plays; scrolling scales it while content lifts/blurs/fades
- Nav island label scrambles between sections; overlay opens/closes on Escape and backdrop click; every overlay link works (GitHub, LinkedIn, `/resume.pdf`, Email)
- About track moves sideways on scroll; centered panel reaches full sharpness/opacity 1; ticks jump to the right chapter
- Opening all three Rabbit Hole branches unlocks the converge block; payoff line scrambles in; opening the fourth branch afterward does not clip the payoff card
- Moving the cursor through the tech field pushes tiles aside; hover/tap updates the readout
- Scrolling Projects walks all 11 rows, preview wipes in, titles scramble; hovering a row previews it, leaving restores the scrolled one
- At 375px wide, Projects unpins and the preview sticks to the top
- At 540px tall (short viewport), the hero doesn't overlap the scroll cue and the project index isn't clipped
- The résumé link works in all four locations (nav overlay footer, hero CTA, contact link list, page footer)
- No console errors on load or during a full scroll

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Cut over to Portfolio V3: delete old component tree and 3D stack, wire up new page"
```

---

## Self-Review Notes

- **Spec coverage:** All 10 HANDOFF file-map components (Cursor, NavIsland, Hero, About, RabbitHole, TechField, Projects, Academics, Contact, Footer) have a task. The scroll engine, scramble algorithm, reveal-on-scroll, bar-wipe, and both hover-scramble/on-view-scramble behaviors each have a dedicated hook (Task 2) reused across every consuming task. Data (Task 3) matches the source's `PROJECTS` and stack arrays exactly, with the icon-path remap table resolving the one real discrepancy between the source's `icons/` folder and this repo's actual `public/` filenames. Dependency/asset cleanup and the final cutover are Task 14. Mobile breakpoint rules (HANDOFF §8) live in Task 1's `globals.css` and are consumed by name (`data-track-wrap` etc.) in Tasks 7 and 10. Cleanup contract (HANDOFF §9 — teardown of listeners/observers/intervals/hls/rAF) is satisfied per-hook and per-component via `useEffect` return functions throughout.
- **Known deviation from HANDOFF.md:** résumé link count is 4, not 5 (see Spec section at the top) — the file is authoritative.
- **Verification model deviation:** no TDD red/green cycle — this content has no unit-testable logic surface beyond the push-field/scroll math, which is copied algorithm-for-algorithm from a working reference implementation rather than designed fresh, so a from-scratch test suite would mostly be re-asserting arithmetic already proven correct in the source. Each task instead gates on a clean `npm run build` plus, for behaviorally-rich tasks (RabbitHole, TechField, Projects, Contact, and the final cutover), specific manual checks tied to HANDOFF §11's Definition of Done.
- **Task 9 fix required before commit:** the draft body includes a placeholder call to a non-existent `useScrambleOnViewNow` helper — Step 1 explicitly calls this out and gives the real fix (call `useScrambleOnView` directly in the component body). Flagging here again so it isn't missed during execution.

# HANDOFF — Portfolio V3 → Next.js (Vercel)

**You are porting a finished design into an existing Next.js repo. The design is done. Do not redesign it.**

- **Source of truth:** `Portfolio V3.dc.html` (ships next to this file). It is a single self-contained page — every value, every animation, every word of copy is in there. When this document and that file disagree, **the file wins**.
- **Target repo:** `therealgone/Portfolio-V2`, branch `main`.
- **Deploy target:** Vercel (see §10).

Read `Portfolio V3.dc.html` end to end before writing a single component. The template is the markup; the `<script type="text/x-dc">` block at the bottom is the logic class. Everything you need to replicate is in those two pieces.

---

## 0. The one rule

**Port, don't improve.** Do not "clean up" the copy, retune easing, round off pixel values, swap fonts, add icons, add a hero gradient, or introduce a component library. Every number in the source was tuned against a real viewport. If something looks wrong, you have ported it wrong — go back and read the source again.

Specifically, do NOT:
- change any hex value, `rgba()`, blur radius, or shadow
- change the easing curve (§2)
- reword any heading, paragraph, project description, or label
- replace inline styles with Tailwind classes *where the value is computed at runtime* (see §3)
- reintroduce the 3D prism, or any `three`/`@react-three` code
- add libraries: no GSAP, no Lenis, no Locomotive, no ScrollTrigger, no Framer Motion for the scroll work

---

## 1. Repo state and cleanup

Current repo (verified at `6c02020`):

```
src/app/layout.tsx        ← keep, edit fonts + metadata
src/app/globals.css       ← keep, rewrite (§2)
src/app/page.tsx          ← replace entirely
src/app/components/       ← delete all of it, including components/three/
public/                   ← keep the SVG icons, delete 3D assets
lib/utils.ts              ← keep
next.config.ts            ← keep as-is (already correct for Vercel)
tsconfig.json             ← keep as-is (`@/*` → `./src/*`)
```

### Delete

- `src/app/components/**` — the entire old component tree, including `components/three/`.
- `public/textures/lensflare/**` (9 files) — lens flare textures, 3D only.
- `public/fonts/Inter_Bold.json` — a three.js font atlas, not a real font.

### Remove from `package.json` dependencies

```
@react-three/drei
@react-three/fiber
@react-three/postprocessing
three
three-stdlib
postprocessing
stats.js
gsap
@types/gsap            (devDependencies)
react-simple-typewriter
@fontsource/inter
```

Then delete `package-lock.json` and run `npm install` so the lockfile is regenerated clean. This matters — Vercel installs from the lockfile, and stale three.js entries will bloat the build.

### Add

```
hls.js                 ^1.5.13
```

That is the only new runtime dependency. Keep `framer-motion` **only** if something else in the repo still uses it; the new design does not.

### Keep in `public/`

These are referenced by the tech grid: `HTML.svg`, `CSS.svg`, `JS.svg`, `Python.svg`, `sql-svgrepo-com.svg`, `csh.svg`, `react.svg`, `nextjs.svg`, `tailwind.svg`, `motion react.svg`, `vite.svg`, `unity.svg`, `android.svg`, `git.svg`, `github.svg`, `ts.svg`, `vercel.svg`, `nodejs.svg`, plus `J.png` and `favicon.ico`.

> **Path note.** In the source HTML the icons are `icons/HTML.svg`. In Next.js they must become `/HTML.svg` (repo `public/` root, leading slash). `motion react.svg` has a space in the filename — reference it as `/motion%20react.svg` or rename the file to `motion-react.svg` and update the reference. Renaming is cleaner.

### Résumé PDF

The design links `uploads/Jeevan_Baabu_Murugan_Resume.pdf` in five places. Copy that PDF to `public/resume.pdf` and make every link `/resume.pdf`. The five places: nav overlay footer, hero CTA row, Academics section button, contact link list, page footer.

---

## 2. Design system

Everything below is already correct in the source file. This section exists so you can spot when you have drifted.

### Type

| Role | Font | Notes |
|---|---|---|
| Display / headings | **Instrument Serif**, `font-style: italic` | the entire personality of the site |
| Body / UI | **Barlow**, weights 300 / 400 / 500 / 600 | 300 is the default body weight |
| Terminal (Rabbit Hole only) | `ui-monospace, SFMono-Regular, Menlo, 'Cascadia Mono', monospace` | system stack, no webfont |

Load via `next/font/google` in `layout.tsx` — replace the existing `Inter` and `Lexend_Tera` imports:

```ts
import { Instrument_Serif, Barlow } from 'next/font/google'

const serif = Instrument_Serif({
  subsets: ['latin'], weight: '400', style: ['normal', 'italic'],
  variable: '--font-serif', display: 'swap',
})
const barlow = Barlow({
  subsets: ['latin'], weight: ['300', '400', '500', '600'],
  variable: '--font-body', display: 'swap',
})
```

**Critical:** Instrument Serif italic has an ink box of roughly 1.30em. Any `line-height` below `1.30` makes lines overlap. The hero `<h1>` uses `line-height: 1.32` for exactly this reason. Do not reduce it.

### Colour

| Token | Value | Use |
|---|---|---|
| Background | `#000` | every section, no exceptions |
| Primary text | `#fff` | |
| Taxonomy / label | `#6f879c` | section numbers, category labels, meta — the de-emphasised voice |
| Card surface | `rgba(255,255,255,0.035)` | about chapters, tech tiles, cert cards |
| Card inner light | `inset 0 1px 1px rgba(255,255,255,0.12)` | pairs with the surface above |
| Hairline | `rgba(255,255,255,0.07)` – `rgba(255,255,255,0.12)` | row and section dividers |
| Body copy | `rgba(255,255,255,0.5)` – `rgba(255,255,255,0.82)` | opacity carries hierarchy, not colour |
| Inverted | `#fff` bg / `#000` text | primary CTA, the Rabbit Hole payoff |

There is no accent colour. Do not add one.

### Motion

**One curve for everything meaningful:**

```
cubic-bezier(0.52, 0.01, 0, 1)
```

Slow start, decisive stop — like a lens pulling focus. Default duration `0.5s`; up to `0.7s` for larger reveals. Transform and opacity carry ~90% of all transitions; `color` and `border-color` the rest.

**No springs. No bounces. No scale-pop.** The confidence of this design reads through stillness.

### Liquid glass

Used on: the nav island, the command overlay panel, the secondary CTA buttons. Exactly this recipe:

```css
background: rgba(255,255,255,0.01);
backdrop-filter: blur(50px);
-webkit-backdrop-filter: blur(50px);
box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15);
```

Plus a `::before` gradient border, masked so only the ring paints:

```css
content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1.4px;
background: linear-gradient(180deg,
  rgba(255,255,255,0.5) 0%,  rgba(255,255,255,0.2) 20%,
  rgba(255,255,255,0)  40%,  rgba(255,255,255,0)  60%,
  rgba(255,255,255,0.2) 80%, rgba(255,255,255,0.5) 100%);
-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
-webkit-mask-composite: xor; mask-composite: exclude;
pointer-events: none;
```

In React this must be a real CSS class (pseudo-elements can't be inline styles). Put it in `globals.css` as `.glass` / `.glass::before` and apply `className="glass"`. This is the *only* place you should convert inline styles to a class.

---

## 3. Architecture

### Rendering model

Every section is a client component: `'use client'` at the top of each. The whole page is scroll-driven and interactive; there is nothing meaningful to server-render.

### The scroll engine — build this first

The single most important thing to get right. **One** `requestAnimationFrame`-throttled scroll listener drives every scroll effect on the page. Do not give each section its own listener, and do not use `framer-motion`'s `useScroll`.

Create `src/app/hooks/useScrollEngine.ts`:

```ts
// one rAF-throttled scroll/resize listener; subscribers run in registration order
// subscribe(fn) → unsubscribe
// fn receives nothing; each subscriber reads its own getBoundingClientRect()
```

Pattern, matching the source's `initScroll()`:

```ts
const raf = useRef<number | null>(null)
const tick = () => {
  raf.current = null
  const vh = window.innerHeight
  // ...every subscriber runs here
}
const onScroll = () => { if (!raf.current) raf.current = requestAnimationFrame(tick) }
window.addEventListener('scroll', onScroll, { passive: true })
window.addEventListener('resize', onResize, { passive: true })
tick() // run once on mount
```

**Why it matters:** the pinned sections read `getBoundingClientRect()` every frame. Multiple uncoordinated listeners cause layout thrash and the pinning stutters.

### Direct DOM writes, not React state

Scroll-driven transforms are written **straight to `element.style`** via refs. They must never go through `useState` — 60fps state updates will destroy performance and cause visible jitter.

```tsx
const cardRefs = useRef<(HTMLElement | null)[]>([])
// inside tick():
cardRefs.current[i]!.style.transform = `translate3d(0,${y}px,0) scale(${s})`
```

React state is only for genuinely discrete things: nav open/closed, active section label, form fields, which Rabbit Hole branches are open.

### Styling

Inline `style={{}}` for static values is fine and matches the source — port them literally. Tailwind is available; use it if you prefer, but **only for static values**. Anything computed per-frame stays a direct `.style` write.

### File map

```
src/app/
  page.tsx                    composes the sections in order
  layout.tsx                  fonts, metadata, favicon
  globals.css                 resets, @keyframes, .glass, mobile media query
  hooks/
    useScrollEngine.ts        the single rAF loop
    useScramble.ts            the text scramble (§4)
  lib/
    projects.ts               PROJECTS array — copy verbatim from source
    stack.ts                  the 55 tech items — copy verbatim from source
  components/
    Cursor.tsx                custom cursor (desktop only)
    NavIsland.tsx             island + command overlay
    Hero.tsx                  pinned video hero
    About.tsx                 horizontal chapter track
    RabbitHole.tsx            nested terminal tree
    TechField.tsx             bubble-push tile field
    Projects.tsx              pinned index + preview
    Academics.tsx             experience, electives, certifications
    Contact.tsx               form + links
    Footer.tsx                CTA + legal row
```

`page.tsx` order — this is fixed:

```
<Cursor /> <NavIsland />
<Hero />           id="home"
<About />          id="about"      (contains <RabbitHole /> as id="rabbit-hole")
<TechField />      id="tech-stack"
<Projects />       id="project"
<Academics />      id="credentials"
<Contact />        id="contact"
<Footer />
```

Those `id`s are load-bearing — the nav overlay and the section tracker both depend on them. Keep them exactly.

---

## 4. Text scramble

The signature effect. `SCHOOL → X7KQ2 → L8C4H → SCHOOL`.

```ts
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/*"
```

Algorithm — port it exactly, it is tuned:

- duration = `520 + text.length * 22` ms, unless a duration is passed
- each frame, progress `p = (now - t0) / dur`, clamped to 1
- for character index `i`: `settle = (i + 1) / text.length * 0.85`
- if `p >= settle` → emit the real character; else emit a random `CHARS` character
- spaces are **never** scrambled — emit `' '` and move on
- on completion, hard-assign the final text and clear the rAF handle
- cancel any in-flight rAF on the same element before starting a new one

So the string resolves left to right, finishing all its characters by 85% of the duration.

**Where it fires:**

| Trigger | Elements | Duration |
|---|---|---|
| On scroll into view, once (IntersectionObserver, `threshold: 0.4`) | section headings, hero name, hero eyebrow | default |
| On hover of the parent row | project titles, tech tile names, nav rows, credential titles | `420ms` |
| On value change | nav island label, About chapter counter + label, project preview tag + title | `340–460ms` |
| On unlock | the Rabbit Hole payoff line | `700ms` |

Implement as `useScramble()` returning a `scramble(el, text, dur?)` function. Because it writes `textContent` directly, the target element must **not** have React-managed children — render the initial text server-side, then let the hook overwrite it.

---

## 5. Section-by-section spec

Read the source for exact copy and markup. This section covers the *behaviour* you cannot infer from a static read.

### 5.1 Cursor — `Cursor.tsx`

Two fixed elements: a 6px dot with `mix-blend-mode: difference`, and a 34px ring with a 1px `rgba(255,255,255,0.35)` border.

- dot follows the pointer exactly; ring lerps toward it at `0.16` per frame
- over any `a, button, input, textarea, [data-island], [data-row]` the ring grows to 56px (adjust the negative margin to match, so it stays centred)
- the rAF loop **stops** when the ring is within 0.4px of the target and restarts on the next move — do not leave it spinning
- desktop only: `@media (min-width: 900px) { * { cursor: none !important; } }`, and skip the whole effect when `(max-width: 899px)` matches

### 5.2 Nav island — `NavIsland.tsx`

A fixed pill, 44px tall, centred, 22px from the top, `z-index: 9000`, in a `pointer-events: none` wrapper with `pointer-events: auto` on the pill itself.

Contents: a 7px glowing white dot, the current section label, and a 28px circular glyph button (`⌘` closed / `×` open).

- the label tracks the current section and **scrambles** on every change (420ms)
- current section = the last section whose `getBoundingClientRect().top <= vh * 0.35`, checked in the shared scroll tick
- section order: `home, about, tech-stack, project, credentials, contact` → labels `Home, About, Tech Stack, Projects, Credentials, Contact`
- hover scales the pill to `1.04`

Click opens a full-screen overlay (`z-index: 9500`, `rgba(0,0,0,0.72)` + `blur(18px)`): a glass panel of six numbered rows in Instrument Serif italic at 30px. Each row scrambles on hover and has a bar wipe. Footer row: GitHub, LinkedIn, Résumé, Email. Escape closes it; clicking the backdrop closes it; clicking the panel does not (stop propagation).

### 5.3 Hero — `Hero.tsx`

Outer wrapper `height: 240vh`; inner `position: sticky; top: 0; height: 100vh; overflow: hidden`.

**Video.** HLS stream via `hls.js`:

```
https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8
```

Load `hls.js` dynamically inside `useEffect` (`const Hls = (await import('hls.js')).default`) — never at module scope, it will break SSR. Set `muted`, `playsInline`, `loop` imperatively on the element before calling `play()`, and swallow the promise rejection. Safari path: if `Hls.isSupported()` is false but `canPlayType('application/vnd.apple.mpegurl')` is truthy, assign the URL to `video.src` directly. Always destroy the Hls instance on unmount.

Video sits at `opacity: .85`, `transform: scale(1.04)`, `object-fit: cover`.

**Overlays**, in order above the video: a radial vignette; a 220px black fade at the top; a 260px black fade at the bottom.

**Content**, `box-sizing: border-box`, `padding: 72px 24px 78px` — the padding reserves the scroll cue's band so the two can never collide. Eyebrow → `<h1>` (two lines: "Jeevan Baabu" white, "Murugan" at 55% white) → paragraph → CTA row (See the work / Get in touch / Résumé).

Every vertical gap is `min(px, vh)` and the `<h1>` is `clamp(34px, min(9.5vw, 10.5vh), 132px)`. **This is deliberate** — the hero must fit a 540px-tall viewport without overflowing. Do not replace these with fixed values.

**Scroll response**, where `p` = progress through the 240vh wrapper, `0…1`:

```
content:  translateY(-p * 90px)  scale(1 - p * 0.08)
          opacity  clamp(1 - p * 1.5, 0, 1)
          filter   blur(p * 5px)
video:    scale(1.04 + p * 0.14)
cue:      opacity  clamp(1 - p * 4, 0, 1)
```

### 5.4 About — `About.tsx`

A **horizontal chapter track**: the section pins and four chapter panels move sideways as the user scrolls down.

- wrapper `height: 420vh` (`300vh` on mobile), inner sticky 100vh
- the rail is a flex row, `gap: 28px`, with `padding-left` **and** `padding-right` of `calc(50vw - min(300px, 40vw))` so the first and last panels can reach centre
- panels are `box-sizing: border-box; width: min(600px, 80vw)` — **border-box is required**, otherwise padding breaks the centring maths
- travel distance = `step * (n - 1)` where `step = panels[1].offsetLeft - panels[0].offsetLeft`. Derive it from real offsets; do not compute it from `scrollWidth`.
- rail transform: `translate3d(-p * dist, 0, 0)`

**Focus is derived from scroll progress, not geometry** — this is important, an earlier geometry-based version drifted by the scrollbar width and never reached full opacity:

```
pos = p * (n - 1)
f   = clamp(1 - |pos - i|, 0, 1)
e   = f * f
opacity   = 0.2 + 0.8 * e
scale     = 0.93 + 0.07 * e
filter    = f > 0.985 ? 'none' : blur((1 - e) * 3.5px)
```

Above the rail: a large serif counter (`01`) and the chapter label, both scrambling on change. Below: four tick buttons — `I build things · Beyond my field · I learn by doing · Always building` — where the active tick's line grows from 26px to 56px and turns white. Clicking a tick smooth-scrolls to `trackTop + total * (i / (n - 1))`.

### 5.5 Rabbit Hole — `RabbitHole.tsx`

Lives inside the About section, below the track, as `id="rabbit-hole"`.

Two columns. Left: the heading and two paragraphs (prose, static). Right: an interactive monospace tree.

- header line `> i wonder if i can` with a caret that blinks on a 560ms interval — **clear the interval on unmount**
- three collapsed branches: `make it faster?`, `what's actually inside?`, `can i get around it?`
- clicking a branch expands it: `maxHeight` goes from `0` to `scrollHeight + 'px'`, opacity 0 → 1, and the `+` glyph becomes `−` with the chip inverting to white-on-black
- **when all three are open**, the converge block unlocks: `> so how does this actually work?` plus a fourth branch, then after 700ms the payoff card fades up and its line scrambles in over 700ms
- once unlocked, set the converge block's `maxHeight` to `'none'` so later expansions aren't clipped — **and guard the re-measure code against `'none'`**, or opening the fourth branch will re-clamp it to a stale pixel height and hide the payoff
- an `open all` / `close all` button toggles all four with a 110ms stagger

Track open branches in a `Set` in state. Everything else is direct style writes.

### 5.6 Tech field — `TechField.tsx`

55 square tiles (122px, `border-radius: 16px`) in a wrapping flex row, `gap: 14px`. Data in `lib/stack.ts` — nine disciplines, each item `{ name, desc, cat, img }`.

- tiles with an `img` show the SVG at 36px; the rest show a serif italic monogram: `name.replace(/[^A-Za-z0-9+#]/g, '').slice(0, 2)`
- each tile also shows its `cat` in the top-left at 8px

**The push interaction.** As the pointer moves through the field, tiles are shoved aside like grass:

```
R = 260          // influence radius, px
MAX = 105        // maximum displacement, px
f = 1 - dist / R
push = MAX * f * f            // quadratic falloff
target = (delta / dist) * push
scale  = 1 - 0.12 * f
lerp   = 0.2 per frame
```

Measure each tile's **rest** centre by subtracting its current offset from its rect — otherwise the displacement compounds and tiles fly off. The rAF loop runs while the pointer is moving and for 400ms after it stops, then idles. This has its own `mousemove` listener, separate from the scroll engine.

Above the field is a readout: a serif name and a description line. Hovering **or tapping** a tile writes that tile's name (scrambling, 380ms) and description into it. The tap handler is what makes this work on touch — keep it.

### 5.7 Projects — `Projects.tsx`

Pinned two-column: a numbered index on the left, a live preview on the right.

- wrapper `height: 900vh`, inner sticky 100vh, grid `0.86fr / 1.14fr`, `gap: 48px`
- 11 rows: 10 projects from `lib/projects.ts` plus a "More coming soon" placeholder
- active index = `floor(p * 11)`, clamped
- **guard against `offsetHeight - vh <= 0`** on the first tick, before layout settles — otherwise progress clamps to 1 and the preview latches on the placeholder forever
- the preview reveals with a bottom-up wipe: `clip-path` from `inset(0 0 100% 0)` to `inset(0 0 0 0)` over 0.7s, opacity over 0.6s
- on change, the tag and title **scramble**; the description and stack line are set directly
- the active row goes to `#fff` with its arrow at opacity 1 and its bar wipe filled
- hovering a row previews it immediately and overrides the scroll position; leaving restores the scrolled index

Row padding is `min(16px, 1.5vh)` and titles are `clamp(14px, min(1.5vw, 2vh), 19px)` so all 11 rows fit a short viewport. Keep those.

Project images are hot-linked (GitHub raw + social cards). Attach a real `error` listener to each `<img>` that swaps in `https://placehold.co/920x600/111214/6f879c?text=Project`, and also check `img.complete && img.naturalWidth === 0` for images that failed before the listener attached.

### 5.8 Academics — `Academics.tsx`

Static, no scroll animation. In order: the degree card (B.Tech, First Class with Distinction, GPA 8.29/10) → **Experience** (the ADNOC internship row, linking to the LinkedIn certificate post) → **Special electives** (two course rows) → **Licenses & certifications** (six cards in an auto-fit grid, with a "Verify on LinkedIn ↗" link).

The three-column rows use `data-grid3` so the mobile query can collapse them to one column.

### 5.9 Contact — `Contact.tsx`

Two columns: heading, paragraph and a link list (GitHub / LinkedIn / Email / Résumé / the two locations) on the left; the form on the right in a glass card.

The form posts JSON to `https://formspree.io/f/xeokobav`. On success, swap the button label to "Message sent — thank you" and clear the fields; revert after 5s. Wrap the fetch in try/catch — an offline failure must not throw.

### 5.10 Footer — `Footer.tsx`

Big serif CTA, two buttons, then a legal row: copyright left, `Top / GitHub / LinkedIn / Résumé` right.

---

## 6. The bar wipe

Every row-like element carries `data-row` and contains an absolutely positioned 1px `<span data-bar>` at `top: 0`, starting at `width: 0%`.

- `mouseenter` → `width: 100%`, `transition: width .5s cubic-bezier(.52,.01,0,1)`
- `mouseleave` → `width: 0%`, `transition: width .3s cubic-bezier(.52,.01,0,1)`

Attach these once per element and mark it (`el.__barInit`) so re-renders don't stack duplicate listeners. Same for the hover-scramble bindings.

---

## 7. Reveal on scroll

Elements with `data-reveal` start at `opacity: 0; transform: translateY(38px)` and transition to `opacity: 1; transform: none` over 0.9s on the shared curve, fired by an IntersectionObserver at `threshold: 0.15, rootMargin: '0px 0px -8% 0px'`, unobserved after firing.

In React, apply the initial style in a `useLayoutEffect` before paint, not in render — otherwise revealed content flashes at full opacity first.

---

## 8. Mobile — breakpoint 780px

The desktop pinning does not survive a phone. Rules that must be carried over:

```css
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
```

So on mobile the Projects section **unpins**: the preview becomes a sticky card at the top and the index scrolls beneath it.

**Two drivers, never both.** On mobile an IntersectionObserver (`rootMargin: '-45% 0px -45% 0px'`) sets the active project from whichever row is nearest the viewport middle. On desktop the scroll-progress calculation does it. Gate the desktop path on `!isMobile` and only attach the observer when the breakpoint matches — if both run they fight and the preview flickers.

Re-evaluate on resize and orientation change: tear down one driver, attach the other. Keep this in a single `syncMode()` function that early-returns when the breakpoint hasn't actually changed.

Hover-only flourishes (bar wipes, hover scrambles) simply don't fire on touch. That is expected — no content depends on them.

---

## 9. Cleanup contract

Every effect must tear down. Specifically:

- all `scroll`, `resize`, `mousemove`, `keydown` listeners
- both IntersectionObservers (reveal, mobile project tracker)
- the caret `setInterval` in the Rabbit Hole
- the `hls.js` instance (`hls.destroy()`)
- any in-flight `requestAnimationFrame`

Missing teardown will not fail the build — it will leak across Next.js client-side navigations and slowly degrade the page.

---

## 10. Vercel

`next.config.ts` is already correct: `images.unoptimized: true`, ESLint and TS errors ignored at build. Leave it alone.

Checklist:

1. **No `window` / `document` at module scope.** Every access must be inside `useEffect` or an event handler. This is the single most common cause of a build that works locally and fails on Vercel.
2. **`hls.js` must be dynamically imported** inside `useEffect`. A top-level import will break the server bundle.
3. `'use client'` on every component that uses hooks, refs or event handlers — which is all of them.
4. External images are hot-linked and `images.unoptimized` is on, so `next/image` remote patterns are not needed. Use plain `<img>` and keep the error fallback.
5. Run `npm run build` locally and make sure it completes before pushing. A clean local build is the contract.
6. Update `layout.tsx` metadata: title, description, and the `og:url` to your real deployment URL.
7. Keep `X-Frame-Options: SAMEORIGIN` — already in `next.config.ts`.
8. `globals.css` must keep `background-color: black` on `:root` and the scrollbar hiding, or you get a white flash on load.

Deploy is a normal push to `main`. No environment variables are required — the Mux stream and Formspree endpoint are both public.

---

## 11. Definition of done

Check each of these against the running build:

- [ ] Hero video plays, and scrolling scales it while the content lifts, blurs and fades
- [ ] The nav island label scrambles as you move between sections; the overlay opens, closes on Escape, and every link works
- [ ] The About track moves sideways as you scroll; the centred panel is fully sharp at opacity 1; the ticks jump to the right chapter
- [ ] Opening all three Rabbit Hole branches unlocks the converge block, and the payoff line scrambles in
- [ ] Opening the fourth branch afterwards does **not** clip the payoff card
- [ ] Moving the cursor through the tech field pushes tiles aside; hovering or tapping a tile updates the readout
- [ ] Scrolling the Projects section walks all 11 rows, with the preview wiping in and titles scrambling
- [ ] Hovering a project row previews it; leaving restores the scrolled one
- [ ] At 375px wide the Projects section unpins and the preview sticks to the top
- [ ] At 540px tall the hero does not overlap the scroll cue and the project index is not clipped
- [ ] The résumé link works in all five locations
- [ ] `npm run build` completes clean
- [ ] No console errors on load or during a full scroll

---

## 12. If you must ask

Ask before you deviate. The things most likely to tempt you, and the answer:

- *"Should I use Framer Motion / GSAP for the scroll?"* — No. One rAF loop, direct style writes.
- *"Should these inline styles be Tailwind?"* — Static ones, if you like. Computed ones, never.
- *"Can I simplify the About centring maths?"* — No. It was wrong twice before it was right.
- *"The hero type sizes look odd."* — They are viewport-height-aware on purpose. Test at 540px tall.
- *"Should I add a loading state / page transitions / a theme toggle?"* — No. Nothing that isn't in the source.

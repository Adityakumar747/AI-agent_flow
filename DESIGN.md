# DESIGN.md — AI Voice Calling Agent: Full Website Redesign

> Instruction file for the coding agent. Read the whole file before touching code.
> Live site: https://ai-agent-flow-lake.vercel.app/
> Reference for *principles only*: https://spacefs.com (do not copy text, layout 1:1, icons, or assets).

---

## 0. PRIME DIRECTIVE — DO NOT BREAK ANYTHING

This is a **visual / UX redesign only**. The app must work exactly as before.

**Never change:**
- API routes, server actions, route handlers, middleware, database schema/queries
- Auth logic, sessions, tokens, env variable names
- Business logic, hooks that fetch/mutate data, WebSocket / audio / call-handling / telephony code
- Form `name`/`id` attributes, `data-testid`, query-param names, URL paths and route structure
- Exported component names and prop contracts that logic depends on (restyle *inside* them; if a prop must change, update every call site in the same commit)
- Package versions of existing dependencies (add new ones only if listed here)

**Always:**
1. Create a branch first: `git checkout -b redesign/v2`. Commit after every phase.
2. Before any change, record a **baseline**: run install, build, lint, typecheck. Save the results in `REDESIGN_LOG.md`. If baseline already fails, note it so you don't get blamed (or blame) later.
3. If a change needs logic edits to work, **stop and ask the user** instead of improvising.
4. Prefer wrapping/restyling presentational components over rewriting files that mix UI and logic. When UI and logic live in one file, change only JSX/classNames/styles and leave handlers untouched.
5. If something is unclear (what a page does, whether a feature is real), mark it `TODO(user)` in `REDESIGN_LOG.md`. Never invent features, metrics, customers, or testimonials.
6. Rollback plan: every phase is one commit, so any phase can be reverted with `git revert`.

---

## 1. What we learned from Space (principles, not pixels)

Space's landing page works because of these ideas. Apply the *ideas*, in our own visual identity:

| Space principle | How we apply it to the Voice Agent |
|---|---|
| **The product is the hero.** Real-looking app mockups (a file manager, terminal, timeline editor) instead of stock art | Hero shows a live **call console**: animated waveform, streaming transcript, call status, outcome summary — built in HTML/CSS/SVG |
| **One bold claim, one sentence, one CTA** ("Terabytes of files. Zero bytes on disk.") | Short, concrete headline + one supporting sentence + one primary button |
| **Numbered feature list (01–05)** with a mockup beside it | Same pattern: numbered features, sticky mockup that changes with the active item |
| **Use-case blocks**, each with its own mockup and a one-line heading | One block per real use case (only ones the product actually supports) |
| **Flow:** Hero → benefit → features → search/AI → use cases → enterprise/trust → pricing → FAQ → final CTA → footer | Same skeleton, adapted (see §6) |
| **Calm, confident, low-word copy**, concrete numbers | Same tone. Plain words, no hype, no buzzword soup |
| **Pricing:** 3 tiers, monthly/annual toggle | Only if the product has pricing. Otherwise skip and log a TODO |
| **FAQ accordion**, closing CTA ("Ready to journey into Space?") | Same, with our own question set |
| **Dark + light theme** | Both themes, with colors measured from the reference (no invented accent) |
| **Technical details shown inside realistic UI mockups** (file names, sizes, timestamps) | Same: call IDs, durations, timestamps and transcripts appear inside our real-looking app mockups, styled like the reference |

**Do NOT:** copy Space's copy or section text, reuse its icons/images/videos, clone the Finder-window look, or reuse its product vocabulary (drive, files, bytes, Finder).

---

## 2. Design direction — MATCH THE REFERENCE, DON'T INVENT A LOOK

The goal is that our site feels like it belongs to the same family as https://spacefs.com: same restraint, same rhythm, same way of showing the product. **Every color, font, size, radius, shadow and animation must come from measuring the reference (§3.1). If a value is not in the reference, we do not use it.** No accent color, gradient, or typeface may be added "because it looks nice".

Observed about the reference's structure (from its page content — verify visually in Phase 0):
- Dark **and** light versions exist (the logo ships as dark and light variants), so the site is theme-aware.
- The product is the visual content. Sections are built around large, realistic app mockups (windows with sidebars, lists, context menus, info panels, a terminal, a timeline editor) with cursor graphics and app icons — not illustrations.
- Page rhythm: nav (logo + one CTA) → hero (small "Backed by" line, big two-part headline, one sentence, one download CTA, platform line) → "Terabytes of files. Zero bytes on disk." showcase with a big mockup → "Never wait…" section with five numbered points (01–05) beside changing mockups → two small callout links (SDK / Enterprise) → "Find anything. Ask anything." search section with a product screenshot → "Built for every kind of work" with four use-case blocks (each: small category label, one-line heading, "Learn more", own mockup) → "Governed, on your own storage." enterprise block with a short checklist → "Simple pricing" with a monthly/annual toggle and three cards → "Common questions" accordion → big closing headline + CTA → four-column footer.
- Copy is short and concrete; headings are two short sentences ("X. Y.").
- The closing headline appears to be split per word/letter for an animation.
- Built with Gatsby (so animations are likely CSS/JS-driven, check which library in Phase 0).

We map this to our product: instead of a file manager, our mockups show **our app's real screens** (live call console, transcript, call logs, agent settings).

---

## 3. Design tokens — extracted from the reference, never invented

### 3.1 Phase A: extract the reference (REQUIRED before any design work)

The agent must open the live reference in a real browser and measure it. Screenshots + computed styles, in both dark and light, desktop and mobile.

Create `scripts/extract-reference.mjs` and run it:

```bash
npm i -D playwright && npx playwright install chromium
node scripts/extract-reference.mjs
```

```js
import { chromium } from 'playwright';
import fs from 'node:fs';

const URL = process.argv[2] || 'https://spacefs.com/';
const tag = process.argv[3] || 'reference';
fs.mkdirSync(tag, { recursive: true });
const browser = await chromium.launch();
const report = {};

for (const scheme of ['dark', 'light']) {
  for (const [vpName, viewport] of Object.entries({
    desktop: { width: 1440, height: 900 },
    mobile: { width: 390, height: 844 },
  })) {
    const ctx = await browser.newContext({ colorScheme: scheme, viewport });
    const page = await ctx.newPage();
    const scripts = new Set(), fontFiles = new Set();
    page.on('request', (r) => {
      const u = r.url();
      if (/\.js(\?|$)/.test(u)) scripts.add(u.split('/').pop());
      if (/\.(woff2?|ttf|otf)(\?|$)/.test(u)) fontFiles.add(u.split('/').pop());
    });
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {            // trigger lazy content / reveal animations
      for (let y = 0; y < document.body.scrollHeight; y += 350) {
        window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 160));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${tag}/${scheme}-${vpName}-full.png`, fullPage: true });
    // also one screenshot per viewport-height slice, so details are readable
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let i = 0, y = 0; y < h; i++, y += viewport.height) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${tag}/${scheme}-${vpName}-slice-${String(i).padStart(2, '0')}.png` });
    }

    if (vpName === 'desktop') {
      await page.evaluate(() => window.scrollTo(0, 0));
      report[scheme] = await page.evaluate(() => {
        const bump = (m, k) => { m[k] = (m[k] || 0) + 1; };
        const colors = {}, bgs = {}, borders = {}, radii = {}, shadows = {}, fonts = {}, type = {}, motion = {};
        for (const el of document.querySelectorAll('body *')) {
          const cs = getComputedStyle(el);
          const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
          if (hasText) {
            bump(colors, cs.color); bump(fonts, cs.fontFamily);
            bump(type, `${cs.fontSize} / ${cs.lineHeight} / w${cs.fontWeight} / ls ${cs.letterSpacing} / ${cs.textTransform}`);
          }
          if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') bump(bgs, cs.backgroundColor);
          if (cs.backgroundImage !== 'none') bump(bgs, cs.backgroundImage.slice(0, 160));
          if (parseFloat(cs.borderTopWidth) > 0) bump(borders, `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`);
          if (cs.borderRadius !== '0px') bump(radii, cs.borderRadius);
          if (cs.boxShadow !== 'none') bump(shadows, cs.boxShadow);
          if (cs.transitionDuration !== '0s') bump(motion, `${cs.transitionProperty} ${cs.transitionDuration} ${cs.transitionTimingFunction}`);
          if (cs.animationName !== 'none') bump(motion, `anim ${cs.animationName} ${cs.animationDuration} ${cs.animationTimingFunction}`);
        }
        const pick = (sel) => {
          const el = document.querySelector(sel); if (!el) return null;
          const cs = getComputedStyle(el), r = el.getBoundingClientRect();
          return { color: cs.color, bg: cs.backgroundColor, font: cs.fontFamily, size: cs.fontSize,
            lh: cs.lineHeight, weight: cs.fontWeight, ls: cs.letterSpacing, transform: cs.textTransform,
            padding: cs.padding, margin: cs.margin, radius: cs.borderRadius, border: cs.border,
            shadow: cs.boxShadow, width: Math.round(r.width), height: Math.round(r.height) };
        };
        const vars = {};
        for (const sheet of document.styleSheets) {
          try { for (const rule of sheet.cssRules) {
            if (rule.style && /:root|^html|^body|data-theme|\.dark|\.light/.test(rule.selectorText || ''))
              for (const p of rule.style) if (p.startsWith('--')) vars[`${rule.selectorText} | ${p}`] = rule.style.getPropertyValue(p).trim();
          } } catch {}
        }
        return {
          htmlBg: getComputedStyle(document.documentElement).backgroundColor,
          bodyBg: getComputedStyle(document.body).backgroundColor,
          samples: Object.fromEntries(['header','nav','nav a','h1','h2','h3','p','a[href*="download"]','button',
            'section','main > *:nth-child(2)','details','summary','footer','footer a','img','video'].map((s) => [s, pick(s)])),
          colors, bgs, borders, radii, shadows, fonts, type, motion, cssVariables: vars,
        };
      });
      report[scheme].scripts = [...scripts];
      report[scheme].fontFiles = [...fontFiles];
    }
    await ctx.close();
  }
}
fs.writeFileSync(`${tag}/report.json`, JSON.stringify(report, null, 2));
await browser.close();
console.log(`Done → ${tag}/ (screenshots + report.json)`);
```

Run it for the reference **and** for our current site (`node scripts/extract-reference.mjs https://ai-agent-flow-lake.vercel.app/ ours-before`) so there is a before/after comparison.

Then the agent must **look at every screenshot** and write `REFERENCE_TOKENS.md` containing:
1. **Palette:** every color actually observed, ranked by usage, with role (page bg, surface, border, text, muted text, button bg/text, etc.) for dark and light. State explicitly whether the reference uses any accent / brand color. If it doesn't, we don't either.
2. **Typography:** exact font families (and font files loaded), the full type scale (size / line-height / weight / letter-spacing / case) for display, headings, body, small, buttons, nav, labels.
3. **Layout:** container max-width, side padding, section vertical padding, grid, nav height, gaps between elements.
4. **Shape & depth:** radii, border widths/colors, shadows, any background gradients/textures.
5. **Components:** button styles (every variant seen), nav, cards (pricing), accordion, toggle, numbered list, mockup windows, footer — described from the screenshots.
6. **Motion:** transitions/animations measured above + what is seen in scroll (reveal, split-text, sticky mockups, video/poster behavior), and which libraries are loaded (`scripts` list in report.json).
7. **Section-by-section visual notes** for the full page, in order.
8. **Differences/gaps:** anything we couldn't measure; list as `TODO(user)`.

If the agent has no way to run a browser, it must **stop and ask the user** for: full-page screenshots of the reference in dark and light mode (desktop + mobile) and DevTools computed values for body, h1, h2, p, button. It must not guess.

⛳ **Checkpoint:** show `REFERENCE_TOKENS.md` summary to the user (palette, fonts, scale) and get a OK before building.

### 3.2 Token file (generated from REFERENCE_TOKENS.md)

Create `styles/tokens.css` from the measurements. **Fill every value from the extraction; leave nothing invented.**

```css
/* tokens.css — values come from REFERENCE_TOKENS.md only. */
:root, [data-theme="dark"] {
  color-scheme: dark;
  --bg:            ; /* observed page bg (dark) */
  --surface-1:     ; /* observed card / window surface */
  --surface-2:     ; /* observed raised / hover surface (if any) */
  --border:        ; /* observed border color */
  --text:          ; /* observed primary text */
  --text-muted:    ; /* observed secondary text */
  --btn-primary-bg:   ; --btn-primary-text:   ;
  --btn-secondary-bg: ; --btn-secondary-text: ; --btn-secondary-border: ;
  --focus-ring:    ; /* use --text with opacity unless reference defines one */
}
[data-theme="light"] {
  color-scheme: light;
  /* same variables, light-mode values observed on the reference */
}
```

Rules:
- **Only observed colors.** If the reference has no accent color, there is no accent color anywhere in our site.
- Our product's **name, logo and copy** are ours. Colors, type and layout language come from the reference.
- **Call-status colors in the app screens** (completed / failed / in-progress): the reference has no such concept, so use the smallest possible muted semantic set, keep it **only inside app/dashboard UI** (never on the marketing page), list each color in `REDESIGN_LOG.md`, and **ask the user to approve** them. Prefer text labels + icons over color alone.
- Theme switching: respect `prefers-color-scheme` first, store the choice in `localStorage` (`theme`, wrapped in try/catch), set `data-theme` on `<html>` via an inline `<head>` script to avoid a flash.
- Components use tokens, never raw hex.

### 3.3 Typography
Use exactly the font family and scale measured from the reference (§3.1). If the reference font is proprietary/not licensed for us, choose the closest free font and tell the user which one and why. Keep prose width ≈ 62ch, headings `text-wrap: balance`, paragraphs `text-wrap: pretty`.

### 3.4 Spacing, layout, radii, shadows

> The numbers in 3.4 and 3.5 are only fallback starting points. **Override every one with the measured values from `REFERENCE_TOKENS.md`.**

- **Spacing:** 4px base → `4 8 12 16 24 32 48 64 96 128`.
- **Container:** `max-width: 1200px`, side padding `24px` (mobile `20px`). Narrow prose container `720px`.
- **Section vertical padding:** `128px` desktop / `96px` tablet / `64px` mobile.
- **Grid:** 12 columns desktop, 4 mobile, 24px gutter.
- **Radii:** `--r-sm 6px`, `--r-md 10px`, `--r-lg 14px`, `--r-xl 20px`, `--r-full 999px`. Cards = `lg`, buttons/inputs = `md`, mockup windows = `xl`.
- **Borders:** 1px `--border`. Elevation comes from borders + subtle top highlight, not heavy shadows.
- **Shadows:** `--shadow-sm: 0 1px 2px rgba(0,0,0,.25)`; `--shadow-lg: 0 24px 60px -20px rgba(0,0,0,.5)` (mockups only). Light theme: reduce opacity to ~40%.
- **Background:** flat page background exactly as measured on the reference. Add no texture, grid or glow unless the reference visibly has one.

### 3.5 Motion

```css
:root {
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-fast: 150ms;
  --dur-base: 250ms;
  --dur-slow: 600ms;
  --dur-reveal: 800ms;
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
```

- **Scroll reveal:** fade + 16px translate-up, `--dur-reveal`, `--ease-out`, stagger 60ms, triggered once via IntersectionObserver (threshold 0.15). Content must be visible without JS (progressive enhancement: start visible, only hide once JS has mounted).
- **Hover:** buttons lift 0px (no jump) — change background/border only; cards change border/background only if the reference does so.
- **Live indicator:** small dot pulses (scale 1→1.8, opacity .6→0, 1.6s loop) using the text color, no new hue.
- **Waveform:** 40–60 bars, heights animated with staggered CSS keyframes or a small rAF loop; pause when off-screen (IntersectionObserver) to save CPU.
- No parallax that moves text. No auto-playing sound. No layout shift on animations.

---

## 4. Smooth scrolling with Lenis

**Package:** `npm i lenis` (current package name; the older name was `@studio-freight/lenis`. **Check installed version's docs for option names before coding.**)

### 4.1 Where to use it
- **Enable on marketing/landing pages only.** Do **not** enable inside the logged-in dashboard/app area — tables, transcript panes, modals and live-call UIs have nested scroll containers, and smooth-scroll hijacking there is a classic source of bugs.
- If the app is a single layout, enable conditionally by pathname.

### 4.2 Next.js (App Router) — `components/smooth-scroll.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ReactLenis, useLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';

const ENABLED_PREFIXES = ['/'];            // TODO: adjust after audit
const DISABLED_PREFIXES = ['/dashboard', '/app', '/login', '/signup']; // TODO: match real routes

function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();
  useEffect(() => { lenis?.scrollTo(0, { immediate: true }); }, [pathname, lenis]);
  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const disabled =
    reduced ||
    DISABLED_PREFIXES.some((p) => pathname.startsWith(p)) ||
    !ENABLED_PREFIXES.some((p) => pathname === p || (p !== '/' && pathname.startsWith(p)));

  if (disabled) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true, anchors: true }}>
      <ScrollReset />
      {children}
    </ReactLenis>
  );
}
```

Mount `<SmoothScroll>` once in `app/layout.tsx` around `{children}`.

### 4.3 Vite / CRA / Pages Router fallback

```ts
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export function initLenis() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true, autoRaf: true });
  return () => lenis.destroy();
}
// call in a top-level useEffect and return the cleanup
```

### 4.4 Lenis rules & gotchas
- Add `data-lenis-prevent` to any inner scrollable element (modals, dropdown lists, transcript/log panes, code blocks, `<textarea>`), so wheel events scroll *them* and not the page.
- Sticky positioning and `scroll-margin-top` for anchor targets must account for the fixed navbar (`scroll-margin-top: 88px`).
- Don't set `scroll-behavior: smooth` on `html` (Lenis's CSS handles it).
- Keyboard scrolling, Page Up/Down, Space, focus-scroll and in-page anchors must still work — test them.
- Never block native scroll on touch devices (leave `syncTouch` off).
- If GSAP/ScrollTrigger gets introduced later, wire them together via `lenis.on('scroll', ScrollTrigger.update)` — but **do not add GSAP unless the user asks**; CSS + IntersectionObserver is enough here.

---

## 5. Component library (build these first, under `components/ui/`)

Keep the project's existing stack (Tailwind / CSS Modules / etc.). Every component supports both themes, keyboard use, and visible focus.

| Component | Spec |
|---|---|
| **Button** | Variants copied from the reference's buttons (`primary`, `secondary`, plus `ghost`/`danger` for app screens only). Sizes: sm 32px, md 40px, lg 48px. Radius `md`. Weight 500. Loading state (spinner, `aria-busy`, disabled). Focus: 2px `--focus-ring` outline, 2px offset. |
| **Input / Textarea / Select** | 40px height, `--surface-2` bg, 1px `--border`, focus → stronger border + `--focus-ring`. Label above, helper/error text below with `aria-describedby`. Phone-number fields use mono. |
| **Badge / StatusPill** | Mono micro text. Variants: `live` (pulsing dot), `success`, `warning`, `danger`, `neutral`. Used for call status (queued, ringing, in-progress, completed, failed — **use the app's real statuses**). |
| **Card** | `--surface-1`, 1px border, radius `lg`, padding 24. Hover (if clickable): follow the reference's hover behavior. |
| **MockupWindow** | Window chrome for product mockups: radius `xl`, border, `--shadow-lg`, top bar with 3 neutral dots + centered mono title + optional tabs. Body clips overflow. Not an OS clone — keep it abstract/brand-neutral. |
| **Waveform** | SVG/CSS bars, props: `active`, `bars`, `intensity`. Pauses off-screen. `aria-hidden` (decorative). |
| **TranscriptStream** | Alternating AGENT / CALLER lines, mono speaker tag, typing-reveal animation for demo (static in reduced-motion). |
| **Table** | Sticky header, hairline row dividers, mono for IDs/durations, row hover `--surface-2`, responsive (collapses to cards <640px). |
| **Tabs / Accordion** | Radix-style accessible patterns (`role`, arrow-key nav, `aria-expanded`). Accordion for FAQ with smooth height animation. |
| **Modal / Drawer** | Focus trap, ESC to close, scroll lock, `data-lenis-prevent` on scroll body. |
| **Toast** | Bottom-right, auto-dismiss 5s, `role="status"`. |
| **Navbar** | Sticky, 64px, transparent → blurred `--bg` at 80% after 8px scroll, bottom hairline. Left: logo. Center: anchor links. Right: theme toggle + secondary + primary CTA. Mobile: hamburger → full-height sheet. |
| **Footer** | 4 columns (brand blurb, Product, Company, Legal) + bottom row (©, socials). Only link to pages that exist. |
| **Section / SectionHeader** | Eyebrow (mono micro) + h2 + lead paragraph, consistent spacing. |
| **ThemeToggle** | Sun/moon icon button, `aria-label`, no flash on load. |
| **Skeleton / EmptyState / ErrorState** | Required for every data view in the app. EmptyState = icon + one line + one action. |

Icons: one consistent set (Lucide or whatever the project already uses), 1.5px stroke, 16/20/24 sizes. No emoji as UI icons.

---

## 6. Landing page spec (`/`)

Section order and content direction. **All copy below is a DRAFT** — verify against what the product really does (read the code), then edit. Anything uncertain → `TODO(user)`.

### 6.1 Navbar
Logo • Features • How it works • Use cases • Pricing* • FAQ • [Theme] [Log in] [Primary CTA: "Get started" or whatever matches the existing sign-up flow].
(*only if pricing section exists.) Links are in-page anchors with Lenis `anchors: true`.

### 6.2 Hero
- Eyebrow badge: `● Live` pill + short tagline (draft: "AI voice agents for real phone calls").
- **Headline (draft options):** "Calls that handle themselves." / "Your phone line, staffed by AI."
- **Lead (1–2 sentences):** what it does, in plain words, concrete.
- CTAs: primary + secondary (styled as in the reference) ("See how it works" → scrolls to section).
- Under CTAs: small mono line of real facts only (e.g. supported languages, latency — **only if true**).
- **Visual:** wide `MockupWindow` titled `call · live` containing: status pill (live, timer in mono), `Waveform` (active), `TranscriptStream` demo loop, and a collapsed "outcome" card that appears at the end of the loop. No decorative glow/grid unless the reference has it. On mobile the mockup sits below CTAs, full width, simplified (no side panels).

### 6.3 Benefit strip
Three short statements with a mono number or short phrase each (never invent stats; if no real numbers, use qualitative statements). Hairline dividers between. Echoes Space's "problem → relief" beat.

### 6.4 How it works (3–4 steps)
Horizontal on desktop, vertical on mobile. Each step: mono number, title, one sentence, small mockup snippet (agent config → call placed → transcript + outcome). Steps must match the **real** user flow found in the audit.

### 6.5 Features — numbered 01–05 (the Space-style centerpiece)
Left: list of 5 features (mono `01`…`05`, h3, one line; active item highlighted). Right: sticky `MockupWindow` that cross-fades to the mockup for the active feature as the user scrolls (IntersectionObserver per item). Mobile: each feature stacks with its mockup inline.
Draft feature ideas — **keep only the ones the code actually supports**: real-time conversation • natural LLM-driven dialogue • every call logged + transcribed • bring-your-own phone number / telephony integration • configure the agent's behavior/prompt without code.

### 6.6 Use cases
Grid of 3–4 blocks, each: category label (mono micro), one-line heading (Space style: "Keep every lead warm."), a small mockup, a "Learn more" link only if a page exists. Draft categories: lead follow-up • appointment reminders • support triage • surveys/outreach. **Delete any the product can't actually do.**

### 6.7 Trust / under-the-hood (optional)
"Built for control" — bullet list of **real** capabilities only (call logs, data handling, API keys, etc.). Skip entirely if nothing verifiable.

### 6.8 Pricing (optional)
Only if the app has plans. 3 cards (middle highlighted by border, not color flood), monthly/annual toggle, feature checklist with check icons, primary CTA per card, footnote line. If no pricing exists → omit section, remove nav link, log it.

### 6.9 FAQ
6–8 questions in an accordion (draft: How does it work? Which phone numbers can I use? Is there a limit on call length? How is call data handled? Can I change the agent's behavior? What languages? Pricing? How do I get support?). **Answers must be factual from the codebase/README or marked TODO(user).**

### 6.10 Final CTA
Big h1 ("Ready to put your phone line on autopilot?" — draft), one sentence, one primary button, on the plain page background (match the reference's closing section).

### 6.11 Footer
As in §5. Include theme toggle in footer too.

---

## 7. Inner pages (redesign every page found in the audit)

Same tokens/components. Don't invent pages. For each existing page, keep the data and actions and improve hierarchy, spacing, and states.

**Auth (login / signup / reset)** — centered 400px card on `--bg` with faint grid, logo above, clear labels, inline validation errors, loading state on submit, link between login/signup. Keep every form field `name`, handler, redirect, and error message source intact.

**App shell (dashboard area)** — left sidebar (240px, collapsible to 64px icon rail, becomes drawer on mobile) + top bar (breadcrumb/page title, theme toggle, user menu). Content max-width 1280, page padding 32 (mobile 16). **No Lenis here.**

**Dashboard / overview** — stat cards row (real metrics only), recent calls table, quick actions. Skeletons while loading.

**Call logs / history** — filterable table (status, date range, search) with `StatusPill`, mono duration/IDs, row click → detail drawer or page (keep existing behavior). Transcript viewer uses `TranscriptStream` styling in static mode, `data-lenis-prevent` unnecessary (no Lenis in app) but keep inner scroll area.

**Agent configuration / settings** — two-column form: left sections (identity, voice, behavior/prompt, phone), right sticky live preview/summary if the app already has one (otherwise don't add). Save bar appears on dirty state. Destructive actions in a separated "Danger zone" card.

**Any live-call / real-time UI** — restyle only. Do not touch audio, socket, or streaming code. Verify with an actual test call (or the app's test mode) before and after.

**404 / error / empty pages** — branded, one line, one action.

For each page deliver: loading, empty, error, success states.

---

## 8. Responsive, a11y, performance, SEO

**Breakpoints:** 360 (min), 640, 768, 1024, 1280, 1440. Test all. No horizontal scroll at any width. Touch targets ≥ 44px on mobile.

**Accessibility (WCAG 2.2 AA):**
- Semantic landmarks (`header nav main section footer`), one `h1` per page, logical heading order.
- Contrast: body ≥ 4.5:1, large text/UI ≥ 3:1 in **both** themes. Check the extracted color pairs; if one fails AA, adjust minimally and report it to the user.
- Visible `:focus-visible` on everything interactive; skip-to-content link.
- Decorative visuals (`Waveform` and other decoration) → `aria-hidden`. Mockups get a short `aria-label` or are marked decorative with text equivalents nearby.
- Respect `prefers-reduced-motion` (animations off, Lenis off).
- Forms: labels, error association, no placeholder-only labels.

**Performance:**
- No heavy images; mockups are HTML/SVG. Any raster → `next/image` or WebP/AVIF with explicit dimensions (no CLS).
- Lazy-mount below-the-fold animated components; pause animations off-screen.
- Fonts self-hosted, subsetted, `display: swap`; ≤ 2 families.
- Target Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. If not reachable, report why.

**SEO/meta:** unique `<title>` + description per page, OG/Twitter tags with a generated OG image, favicon + apple-touch icon, `lang` attribute, canonical, sitemap/robots if the framework supports them cheaply.

---

## 9. Step-by-step execution plan

Do the phases in order. After each: run build + lint + typecheck, fix issues, commit, append a summary to `REDESIGN_LOG.md`, and **stop and report** at the checkpoints marked ⛳.

### Phase 0 — Baseline & audit
1. Create branch `redesign/v2`. Install deps. Run build/lint/typecheck; log results (baseline).
2. Write `DESIGN_AUDIT.md` listing: framework & version, styling system, routing, every page/route, every shared component, every user flow, third-party SDKs, anything with real-time/audio/socket logic (mark **DO-NOT-TOUCH**), and the actual product features found in code.
3. Run the reference extraction from §3.1 on BOTH https://spacefs.com/ and our current live site (`ours-before`). Produce `REFERENCE_TOKENS.md`. This replaces any guessing about colors, fonts or spacing.
4. ⛳ **Checkpoint:** present audit + which sections of §6/§7 will be included/skipped. Wait for the user's OK.

### Phase 1 — Foundations
1. Add tokens generated from `REFERENCE_TOKENS.md` (§3.2), fonts, theme provider + no-flash script, base CSS reset (box-sizing, `text-wrap`, focus styles).
2. Map tokens into Tailwind config / `@theme` if Tailwind exists.
3. Install Lenis (§4) and add `SmoothScroll`, scoped to marketing routes only.
4. Verify: app still builds and every page still renders (even if styling is half-old).

### Phase 2 — Component library
1. Build components in §5, one file each, with a simple internal `/design` (or Storybook if already present) showcase route **that is excluded from production** (guard with `process.env.NODE_ENV !== 'production'`, or delete before finishing).
2. Test both themes + keyboard for each.

### Phase 3 — Landing page
1. Build sections in §6 order. Real copy; TODOs for unknowns.
2. Wire all CTAs to **existing** routes (sign-up/login/dashboard). Don't create new backend behavior.
3. Add scroll-reveal + Lenis anchors. Test anchor links, navbar offset, mobile menu, reduced motion.
4. ⛳ **Checkpoint:** show landing page (screenshots or run instructions) and wait for feedback before continuing.

### Phase 4 — Auth + app shell
1. Restyle auth pages. Test full sign-up / login / logout / password flows manually.
2. Build the new app shell (sidebar/topbar). Confirm every existing nav destination still works and active states are right.

### Phase 5 — Inner pages, one at a time
For each page: restyle → add loading/empty/error states → test its main action (create, edit, delete, call, save) → commit. Never batch multiple pages into one commit.

### Phase 6 — Polish
- Copy pass (consistent tone, remove filler, no placeholder text).
- Motion pass (everything respects reduced-motion; nothing janky on a mid-range phone).
- Responsive pass at every breakpoint.
- A11y pass (axe/Lighthouse + manual keyboard run-through).
- Perf pass (bundle diff vs baseline; remove unused CSS/deps).

### Phase 7 — Final verification (report PASS/FAIL for each)

- [ ] Build, lint, typecheck pass (no new warnings vs baseline)
- [ ] Every route from the audit loads; no 404s from internal links; no dead buttons
- [ ] Auth: sign up, log in, log out, protected-route redirect all behave as before
- [ ] Every form submits the same payload as before (compare network requests for at least the main forms)
- [ ] Core product action works end-to-end (e.g., place/receive a test call, see it in logs, open transcript)
- [ ] No changes in API routes, DB code, env names (check `git diff --stat` on those paths: must be empty)
- [ ] Light + dark correct on every page; no flash on load
- [ ] 360 / 768 / 1024 / 1440 checked on every page; no horizontal scroll
- [ ] Keyboard-only run-through of landing + one app flow; focus always visible
- [ ] Lenis: smooth on landing, **off** in app routes, anchors work, modals/inner scroll panes scroll correctly, reduced-motion disables it, route change resets to top
- [ ] Lighthouse scores recorded
- [ ] No placeholder/lorem/fake metrics left; all `TODO(user)` items listed
- [ ] Production build deploys cleanly on Vercel (preview deployment link works)

### Deliverables
1. Redesigned code on `redesign/v2` (small, reviewable commits).
2. `DESIGN_AUDIT.md`, `REDESIGN_LOG.md`, short `DESIGN_SYSTEM.md` (tokens + component usage).
3. Final report: what changed, what was skipped and why, open `TODO(user)` list, and known risks.

---

## 10. Hard "don'ts" (quick list)

- Don't copy Space's wording, imagery, icons, or Finder-style UI.
- Don't invent colors, fonts, or effects that the reference doesn't have (no accent hues, no gradients, no glows unless measured in the reference).
- Don't use purple/pink AI gradients, glassmorphism overload, neon glows, or stock 3D blobs.
- Don't add libraries beyond `lenis` (and fonts) without asking. If the project already has `framer-motion`/`motion`, you may use it for reveals.
- Don't add a global state/CSS framework migration (e.g., switching Tailwind ↔ CSS-in-JS).
- Don't change URLs, rename routes, or move files that logic imports from, unless every import is updated and the build passes.
- Don't fabricate features, customer logos, testimonials, uptime/latency numbers, or pricing.
- Don't leave debug routes, console logs, or commented-out old UI behind.
- Don't enable Lenis inside the logged-in app.

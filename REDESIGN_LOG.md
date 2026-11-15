# REDESIGN_LOG.md — AI Voice Calling Agent (VoiceForge)

## Git Versioning & Safety Strategy
- **Backup Branch:** `backup-pre-redesign` (commit `6d074f3`) captures the complete workspace state prior to this redesign, ensuring full rollback capability at any time.
- **Active Redesign Branch:** `redesign/v2` (current branch, based cleanly on `main`).
- **Rollback Plan:** Every phase is committed independently on `redesign/v2`. Any phase can be reverted with `git revert <commit-hash>`. To return to `main` at any time, run `git checkout main`.

---

## Phase 0: Baseline & Audit (Date: 2026-11-15)

### 1. Build Baseline
- Command: `cd frontend; npm run build`
- Result: **PASS** (15 static pages generated)
  - `/` (979 B)
  - `/_not-found` (873 B)
  - `/about` (1.08 kB)
  - `/features` (1.14 kB)
  - `/login` (2.07 kB)
  - `/register` (1.73 kB)
  - `/callback` (2.57 kB)
  - `/dashboard` (3.58 kB)
  - `/campaigns` (5.17 kB)
  - `/calls` (2.36 kB)
  - `/customers` (6.29 kB)
  - `/appointments` (3.87 kB)
  - `/analytics` (2.13 kB)
- Shared First Load JS: 87.4 kB

### 2. Typecheck Baseline
- Result: **PASS** (TypeScript 5.4.2 via Next.js compiler)

### 3. Lint Baseline
- Command: `cd frontend; npm run lint`
- Baseline Issues in original codebase:
  - `src/app/(auth)/login/page.tsx:170`: unescaped single quote (`react/no-unescaped-entities`)
  - `src/app/(dashboard)/dashboard/page.tsx:37`: unescaped single quote (`react/no-unescaped-entities`)
- Action: These will be fixed during the Phase 4 & Phase 5 restyling.

---

## Step-by-Step Execution Plan & Checkpoints
- [x] **Phase 0 — Baseline & Audit**: Branch `redesign/v2` created, baseline recorded, `DESIGN_AUDIT.md` created. **[⛳ CHECKPOINT]**
- [ ] **Phase 1 — Foundations**: Design tokens (`tokens.css`), dark/light theme provider with zero-FOUC inline script, Tailwind mapping, Lenis smooth scrolling (strictly for marketing routes `/`, `/about`, `/features`).
- [ ] **Phase 2 — Component Library**: Under `components/ui/`: Button, Input, StatusPill, Card, MockupWindow, Waveform, TranscriptStream, Accordion, EmptyState/Skeleton, ThemeToggle, Navbar, Footer.
- [ ] **Phase 3 — Landing Page (`/`)**: Hero with live call console (animated waveform, streaming transcript, outcome card), Benefit strip, 3-step workflow, Numbered features 01–05 with sticky mockup, Use cases, Trust/architecture, Pricing plans, FAQ accordion, Final CTA, Footer. **[⛳ CHECKPOINT]**
- [ ] **Phase 4 — Auth + App Shell**: Login & Register pages (400px card, tokens, dual theme), Responsive App Shell (Sidebar 240px/64px, Header, breadcrumbs, user menu, NO Lenis in app shell).
- [ ] **Phase 5 — Inner Pages (One commit per page)**:
  - 5.1 `/dashboard`
  - 5.2 `/calls`
  - 5.3 `/campaigns`
  - 5.4 `/customers`
  - 5.5 `/appointments`
  - 5.6 `/analytics`
  - 5.7 `/settings` (Agent configuration & telephony)
  - 5.8 `/about` & `/features` (retained & restyled with design tokens)
  - 5.9 `/_not-found`
- [ ] **Phase 6 — Polish**: Motion & reduced-motion, typography, responsive pass (360px to 1440px), a11y, contrast verification.
- [ ] **Phase 7 — Final Verification**: Complete checklist, zero regression, all forms and WebSockets verified.


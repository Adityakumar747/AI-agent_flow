# DESIGN_AUDIT.md — Complete Codebase Audit

**Date:** 2026-11-15  
**Project:** VoiceForge (AI Voice Calling Agent)  
**Branch:** `redesign/v2` (safety backup: `backup-pre-redesign` / `main`)

---

## 1. Technical Stack & Environment

| Layer | Technology | Version / Details |
|---|---|---|
| **Framework** | Next.js (App Router) | 14.2.35 |
| **Runtime / UI** | React / React DOM | 18.3.0 |
| **Language** | TypeScript | 5.4.2 |
| **Styling** | Tailwind CSS | 3.4.1 + `tailwindcss-animate` |
| **Icons** | Lucide React | 0.363.0 |
| **Charts** | Recharts | 2.12.0 |
| **3D Graphics** | OGL | 1.0.11 (used in WebGL `Galaxy.tsx`) |
| **State Management** | Zustand (Client) / React Query (Server) | Zustand 4.5.2 / React Query 5.28.0 |
| **Forms & Validation** | React Hook Form + Zod | 7.51.0 / 3.22.4 |
| **Notifications** | Sonner | 1.4.41 |
| **Networking** | Axios + Socket.io-client | 1.6.8 / 4.7.5 |
| **Backend Reference** | NestJS, Prisma, PostgreSQL, Twilio, OpenAI | Port 3001 |

---

## 2. Inventory of Routes & Pages

### 2.1 Marketing Routes (Public)
- `/`: Main Landing Page. Needs redesign matching `DESIGN.md` §6 with Space-inspired principles (quiet, technical, live call console hero, 01–05 numbered features, use cases, FAQ accordion, Lenis smooth scrolling).
- `/about`: Company / Product About page. Retained and restyled to match the design tokens.
- `/features`: Deep dive into features. Retained and restyled to match the design tokens.
- `/_not-found`: 404 page.

### 2.2 Authentication Routes (`(auth)`)
- `/login`: User login form (email + password, OAuth buttons). Restyle to centered 400px card.
- `/register`: User registration form (name, email, password). Restyle to centered 400px card.
- `/callback`: OAuth callback handler (keep functional logic untouched).

### 2.3 Application Shell & Dashboard Routes (`(dashboard)`)
- `/dashboard`: High-level metrics (Total Calls, Active Campaigns, Appointments, Duration), Call trends chart, Campaign overview, Recent calls table.
- `/campaigns`: Outbound campaign list, statuses (`SCHEDULED`, `RUNNING`, `PAUSED`, `COMPLETED`), start/pause/stop actions, create campaign dialog with AI script configuration.
- `/calls`: Historical call records table, status pill (`COMPLETED`, `FAILED`, `IN_PROGRESS`, `PENDING`), durations, timestamps, pagination.
- `/customers`: Customer contacts table, phone, email, tags, search, add customer modal, bulk selection for campaigns.
- `/appointments`: Appointments booked by the AI during voice calls, date/time, customer name, status.
- `/analytics`: Deep analytics dashboard (Campaign performance, Conversion funnel, Hourly distribution, Sentiment analysis).
- `/settings`: Two-column agent configuration view (behavior, prompt, voice, telephony, danger zone).

---

## 3. DO-NOT-TOUCH Modules (Critical Logic Boundary)

Per **PRIME DIRECTIVE (§0)**, the following modules and code must never be broken, modified in logic, or rewritten:

1. **WebSocket & Live Streaming Layer:**
   - `frontend/src/hooks/use-websocket.ts`
   - `frontend/src/lib/websocket-client.ts`
   *Responsible for real-time Socket.io call updates, campaign state changes, and live agent alerts.*

2. **API & Service Layer:**
   - `frontend/src/lib/api-client.ts` (Axios configuration, interceptors, auth headers)
   - `frontend/src/services/auth.service.ts`
   - `frontend/src/services/analytics.service.ts`
   - `frontend/src/services/appointments.service.ts`
   - `frontend/src/services/calls.service.ts`
   - `frontend/src/services/campaigns.service.ts`
   - `frontend/src/services/customers.service.ts`

3. **Global State & Session:**
   - `frontend/src/lib/store/auth-store.ts` (Zustand auth store, token persistence, user session)

4. **Types & Interfaces:**
   - `frontend/src/types/index.ts` (User, Customer, Campaign, Call, Appointment, Analytics)

5. **Backend Services:**
   - All code under `backend/` (NestJS controllers, services, Prisma schema, Redis queues, Twilio webhooks, OpenAI streaming handlers).

---

## 4. Real Product Capabilities Found in Code

1. **AI-Powered Conversations:** Natural conversational interactions using OpenAI GPT-4 and Whisper speech recognition.
2. **Automated Outbound Campaigns:** Custom agent script (`aiScript`), campaign goals (`APPOINTMENT`, `QUALIFICATION`, `FEEDBACK`, `SUPPORT`), and target customer lists.
3. **Sentiment Analysis:** Real-time sentiment classification (Positive, Neutral, Negative) computed per call and aggregated in analytics.
4. **Automated Appointment Scheduling:** AI directly books appointment date/times during calls and confirms via Twilio SMS.
5. **Real-Time Telephony Events:** Live WebSocket streaming updates call durations and state transitions (`PENDING` → `IN_PROGRESS` → `COMPLETED` / `FAILED`).
6. **Customer CRM:** Contact directory with tagging, search, and direct campaign launch capability.

---

## 5. Scope & Decisions for DESIGN.md Implementation

### 5.1 Landing Page (§6) Specifications
- **§6.1 Navbar:** VoiceForge brand, Features, How it works, Use cases, FAQ, Theme toggle, Log in, Get started CTA.
- **§6.2 Hero:** `● Live` signal badge, headline "Calls that handle themselves.", lead sentence, primary accent CTA + secondary CTA, live call console mockup with animated waveform and streaming transcript loop.
- **§6.3 Benefit Strip:** 3 technical statements with hairline dividers (Scale, Latency, Conversion).
- **§6.4 How It Works:** 3 real workflow steps matching code (Script configuration → Autonomous queue → Transcripts & calendar sync).
- **§6.5 Numbered Features 01–05:** Space-style 01–05 numbered features with sticky interactive mockup window.
- **§6.6 Use Cases:** 4 real use cases supported by code (Lead Qualification, Calendar Booking, Customer Care, CSAT Feedback).
- **§6.7 Trust & Architecture:** Carrier reliability (Twilio), OpenAI GPT-4 + Whisper, PostgreSQL persistence, WebSocket duplex streaming.
- **§6.8 Pricing:** Transparent plan tiers (Starter / Growth / Enterprise) with monthly/annual toggle.
- **§6.9 FAQ:** 7 accordion questions answering real technical capabilities.
- **§6.10 Final CTA & §6.11 Footer:** High-contrast conclusion with footer theme switch.

### 5.2 Inner Pages (§7) Specifications
- **Auth (`/login`, `/register`):** Centered 400px card on `--bg` with hairline borders, dual theme support, keeping all handlers, form validations, and redirect logic intact.
- **App Shell:** Collapsible sidebar (240px to 64px icon rail), top header with breadcrumb, user profile, and theme toggle. Lenis smooth scrolling strictly disabled inside app shell.
- **Dashboard & Feature Views:** Restyle `/dashboard`, `/calls`, `/campaigns`, `/customers`, `/appointments`, `/analytics` using consistent design tokens (`--surface-1`, `--surface-2`, `--border`, `--accent: #34D399`), responsive tables, and proper loading/empty states.
- **Settings (`/settings`):** Clean two-column agent configuration view with danger zone.
- **About & Features (`/about`, `/features`):** Restyled cleanly using design tokens without broken links.

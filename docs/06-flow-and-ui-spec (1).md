# Brewlytics — Flow & UI Concept Spec (v2, supersedes earlier CSV/upload assumptions)

The app is already built (React + TS, Firebase Hosting). **Do not rewrite it.**
Reuse existing screens, routes, and design tokens (violet palette, Inter). This
doc changes the *flow*, adds *charts*, and adds *agentic AI behaviour*. Keep
every screen simple: one primary action, few widgets, lots of whitespace.
"Sexy" = clean charts, smooth transitions, skeleton loaders, subtle gradients,
consistent spacing. NOT more text, badges, or fake stats.

---

## 1. Modes

### Demo mode (onboarding → "Explore Demo")
- Read-only, pre-seeded account. Same screens as live mode, driven by a
  `readOnly` flag. No separate demo UI.
- **Upload is hidden/disabled** everywhere (sidebar shows it greyed with
  tooltip "Available in Live mode"). Generate insights is disabled too;
  demo shows the pre-seeded 3 only.
- Uses a **fixed clock**: `DEMO_NOW = 2026-09-14 18:30 IST` (config constant).
  The AI and all "today/yesterday" logic use this, so demo never looks stale.
- Seed data: sales + expenses from 1 Jun 2026 to 14 Sep 2026 (realistic
  patterns: weekend peaks, a dead weekday afternoon, one product trending up,
  one dragging margin).
- Seed insights: one current set of exactly 3, written for `DEMO_NOW`.
- Seed chat: 2–3 prior Q&As already in the thread, at least one containing an
  inline chart, plus floating suggested-question chips (see §5).

### Live mode (onboarding → "Use my own data")
- Redirect **directly to `/upload`** (guided backfill, §2). No dashboard until
  at least one Sales slot is filled.

---

## 2. Live mode — guided backfill, then daily

### 2.1 Slot rules (computed from today's date, Asia/Kolkata)
- Previous **3 full months** → one **monthly** slot each.
- Current month's **completed weeks** → **weekly** slots. Weeks are
  month-anchored: 1–7, 8–14, 15–21, 22–28, 29–end.
- Remaining days of the current partial week → handled in daily mode.
- Example, today = 14 Sep: Jun, Jul, Aug, Sep 1–7, Sep 8–14.
- Each slot has **two tiles: Sales CSV and Expenses CSV**.

### 2.2 Upload page UI (keep it simple)
- Vertical timeline/stepper of slots. Each slot = a card with two upload tiles
  (drag-drop or click), status chip (Empty / Processing / Ready / Error),
  "Download template" link, and "No expenses this period" checkbox.
- Top: progress meter "History 6 / 10 complete". "Skip for now" allowed.
  Unlock Dashboard once ≥1 Sales slot is Ready.
- **Validation:** every row's date must fall inside the slot's range. Otherwise
  reject with a clear message ("This file is for Aug; found dates in Jul").
  Re-uploading a slot **replaces** its file (no appending, no row-dedupe).
- After parse, show a small preview (first 5 rows + row count), then "Confirm".

### 2.3 CSV schemas (fixed, strict headers; provide downloadable templates)
- **Sales:** `date, time, product, category, quantity, unit_price, revenue`
- **Expenses:** `date, category, description, amount`
  - `category` ∈ Rent, Salaries, Ingredients, Utilities, Marketing, Other
    (salaries live here — there is no separate salary/attendance CSV).

### 2.4 Daily mode (once backfill done or skipped)
- `/upload` becomes a **calendar**. Click a date → dialog with a Sales/Expenses
  toggle → upload the CSV for that date (Expenses may cover a date range).
- Calendar dots: uploaded (violet), missing (amber outline), today (ring).
- Missing days are treated as gaps — trend math must skip them, never
  treat them as zero-sales days.

---

## 3. Dashboard — charts first, numbers second
Max 7 widgets. Date-range picker top right (7d / 30d / custom). Skeleton
loaders while loading. Recharts for everything.
1. **KPI row (4 cards)** each with a tiny sparkline + delta vs previous
   period: Revenue, Orders, Avg order value, Net profit (revenue − expenses).
2. **Revenue trend** — area chart (gradient fill), with expenses as a second
   line.
3. **Top products** — horizontal bar chart (top 5).
4. **Category split** — donut.
5. **Peak hours** — bar chart or hour×weekday heatmap (pick one, keep it
   readable).
6. **Expenses breakdown** — stacked bar or donut by category.
7. **One AI headline banner** — a single sentence generated from real data,
   with "Ask AI" button that opens Chat with the question prefilled.
No fake numbers. Empty states when no data. Every number/chart reads from
Firestore aggregates.

---

## 4. Insights page — no calendar, one button, always 3
(The calendar is **removed from Insights**. The daily-upload calendar on
`/upload` stays; that is a different screen.)

- Page shows **one current set of exactly 3 insight cards** and a
  **"Generate insights" button**. Nothing else: no date picker, no tabs, no
  filters, no history list.
- Each card: icon, one-line title, 2-sentence explanation, one concrete
  action, "Mark done" button.
- **Generate is available once per calendar day (Asia/Kolkata).**
  - Click → server generates a **fresh 3** from the **latest uploaded data**
    (all slots + daily uploads) and **deletes the previous 3**. Never stacks,
    never more or fewer than 3.
  - After generating, the button turns disabled with
    "Generated at 6:40 PM · next available tomorrow".
  - Enforce this **server-side** in the Cloud Function (compare last
    `generatedAt` date in IST with today). Client-side disabling alone is not
    enough.
- If no data is uploaded at all: empty state, "Upload your sales CSV to get
  insights", Generate disabled.
- If the newest uploaded data is older than yesterday: still allow Generate,
  but show a small note "Latest data is from <date>. Upload newer data for
  sharper insights." (Because the once-a-day limit makes a stale run costly.)
- **Demo mode:** shows a pre-seeded set of 3; Generate is disabled with
  tooltip "Available in Live mode".

### 4.1 Time-awareness (critical)
Every Gemini call must include, computed **server-side in Asia/Kolkata**
(or `DEMO_NOW` in demo mode):
- current date, weekday, and time of day,
- the date of the latest uploaded data,
- tomorrow's date and weekday.
Prompt rules:
- Advice must fit the **current time of day**: before ~4 PM, cover the rest of
  today *and* tomorrow; after that, focus on **tomorrow** (name the weekday).
- Never recommend an action for a time that already passed (no "run a 3 PM
  promo" at 6 PM).
- Weekday patterns (e.g. "Tuesdays 2-5 PM are slow") must come from actual
  data averages for that weekday, never guesses.
- If the latest data is not from today/yesterday, say so inside the insight
  instead of pretending it's current.

---

## 5. AI Chat — agentic, not plain text
Feels like PostHog/Julius-style AI: answers with **charts, KPI cards, and
action plans**, and shows tool steps.

### 5.1 Response format
Gemini (server-side callable function) returns validated JSON:
```
{
  "text": string,
  "chart"?: { "tool": ChartTool, "params": {...}, "title": string },
  "kpis"?: [{ "label": string, "value": string, "delta"?: string }],
  "actionPlan"?: { "title": string, "steps": [{ "task", "priority", "when", "why" }] }
}
```

### 5.2 Charts must be server-computed (no hallucinated numbers)
Gemini only **chooses** a whitelisted tool + params; the function computes the
data from Firestore; the client renders with Recharts. Whitelist:
`revenue_by_day`, `revenue_by_hour`, `revenue_by_weekday`, `top_products`,
`category_split`, `expenses_by_category`, `profit_by_week`, `product_trend`.
Any number quoted in `text` must come from the same computed data.
If data for the ask does not exist (e.g. "compare with last quarter" but only
1 month uploaded), the AI says so plainly. It never invents.

### 5.3 Action plan + PDF
When the user asks for an action plan/strategy/"what should I do", the response
includes `actionPlan`. Render it as a card with priority chips and a
**"Download PDF"** button. Generate the PDF client-side (jsPDF), branded
(logo, violet accent, date, café name, steps table). Keep it 1 page.

### 5.4 Chat UI
- Message bubbles + inline chart cards (rounded, same style as dashboard).
- While thinking, show small "tool step" chips: "Reading revenue by hour…",
  "Building chart…" (real steps, not fake delays).
- **Floating suggested-question chips** above the input; refresh based on the
  last answer. Demo mode ships with 2–3 Q&As pre-loaded.
- Persist thread in Firestore. No mic/attach/export-to-Slack decoration.

---

## 6. Firestore shape (adapt to existing; keep minimal)
- `cafes/{id}`: name, ownerUid, mode.
- `slots/{cafeId}/items/{slotId}`: type (month|week|day), start, end,
  salesStatus, expensesStatus, storagePaths.
- `metrics/{cafeId}`: aggregates across all Ready slots (daily revenue, hourly,
  weekday, products, categories, expenses by category).
- `insights/{cafeId}` (single doc): `items` (exactly 3), `generatedAt`,
  `generatedOnIST` (yyyy-mm-dd, used for the once-per-day check), `dataThrough`.
- `chats/{cafeId}/messages/{id}`: role, text, chart?, kpis?, actionPlan?, ts.
- Demo data lives in its own seeded cafe; demo user gets `readOnly` rules
  (writes to slots/insights/chats-generation blocked; reads allowed).
Gemini key stays in Functions secrets. Never client-side.

---

## 7. Guardrails
- No hardcoded numbers in shipped screens. Demo numbers come from the seeded
  Firestore data through the same code path as live.
- Every button/link must work or be removed. No `href="#"`.
- Currency ₹; timezone Asia/Kolkata everywhere.
- No `any`; validate Gemini JSON against a schema before rendering.
- Small commits: (1) slots+upload flow, (2) metrics aggregation, (3) dashboard
  charts, (4) insights generation (once/day, always 3), (5) chat charts + action-plan
  PDF, (6) demo seeding + read-only mode.

## 8. Acceptance checklist
- [ ] Demo: dashboard charts render, insights shows a seeded set of 3, chat
      opens with 2–3 prior Q&As (one with chart), no upload option anywhere.
- [ ] Live: onboarding → `/upload`, slots computed correctly for today's date.
- [ ] Wrong-range CSV is rejected; re-upload replaces the slot.
- [ ] Dashboard changes visibly after a new upload.
- [ ] Chat: "show revenue by hour" returns a real chart from user data;
      "give me an action plan" returns a card with working PDF download.
- [ ] Insights: no calendar on the page. Generate → exactly 3 cards, previous
      3 deleted. Second click the same day is blocked (server-side too).
      Advice respects current time/weekday.
- [ ] Asking for data that wasn't uploaded gets an honest "not enough data".

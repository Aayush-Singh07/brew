# Brewlytics — Bloat Removal & Simplification

General rule: **one primary action per screen.** Everything else is either
supporting context (fine, keep it minimal) or noise (cut it). If in doubt,
cut it — we can always add back something real later.

Currency fix applies to every screen below: change all `$` pricing to `₹`
and match the actual tiers: **Free / ₹999 Pro / ₹2,499 Business** (not
$0/$49/$129).

Brand voice fix applies everywhere: replace "specialty coffee roaster /
artisan roastery / coffee sommelier" language with plain "café" language.

---

## Landing Page
**Cut:**
- The "450+ independent specialty roasters & coffee shops" social-proof
  badge and the 3 fake avatar initials (AR/SC/BL) — no real users yet.
- "Trained on 2M+ café tickets" and "Avg. +$1,850 monthly margin" stat
  claims — unverifiable, remove.
- The entire simulated AI demo chat window's fabricated specificity
  ("Model 4.2 Roasted", "Processed 1,842 lines", exact $ figures) — replace
  with a lighter, clearly-labeled "example output" static mockup, OR wire it
  to the real Gemini function using the seeded demo dataset (preferred if
  time allows — see Phase 3).
- Bento feature grid: 4 cards is too many for a first pass — keep the 2 that
  map to what's actually built (CSV ingestion, AI analyst); cut "Peak Hour
  Heatmap & Staffing Predictor" and "Menu Profitability Matrix" language
  unless those are actually built features. Don't advertise what doesn't
  exist yet.
- Pricing section: keep 3 tiers but with real ₹ pricing and features that
  match `05-auth-and-payments.md` (no "QuickBooks/Xero export", no "direct
  Toast/Square API sync" — we only support CSV upload).
- Footer: cut "The Roaster's Ledger" newsletter signup, cut the
  Integrations column (Square/Toast/Clover/Lightspeed guides) since we only
  support generic CSV upload, cut "SOC2 & GDPR Compliant" / "Bank-grade
  256-bit AES" badges (unverifiable claims for a prototype).
**Keep:** Hero headline + subheadline + one primary CTA, one simplified
feature strip (Upload → Analyze → Ask), one pricing section, one final CTA
banner, a minimal footer (logo, 3-4 real links, copyright).

## Sign Up / Login
**Cut:**
- "Continue with Google" and "Continue with Apple or POS SSO" buttons
  entirely — see `05-auth-and-payments.md` for the auth decision (email/
  password + demo login only).
- Password strength meter bars (fine to keep a simple helper text, drop the
  3-segment fake strength bar unless you wire it to real logic).
- "256-bit encryption • SOC-2 Compliant" footnote — unverifiable claim, cut.
**Keep:** Tab toggle (Sign Up / Log In), name + café name + email + password
fields, one primary CTA, and add a new secondary "View Demo" button (see
doc 05) in place of the removed social buttons.

## Onboarding Wizard
**Cut:**
- The 3-step "Save & Exit" / progress-bar chrome duplicated in two places
  (top header progress bar AND the stepper breadcrumb card) — keep one.
- "Instant Access" sample dataset card's fabricated specificity ("18,400
  orders", pre-flagged margin leaks, quick-highlight checklist) — simplify
  to one sentence: "Load a sample café dataset to explore the product."
- POS compatibility tags row (Square/Toast/Clover/Lightspeed/Shopify POS) —
  we only accept CSV upload, don't imply direct integrations.
- The "How Brewlytics Pipeline Works" 3-stage explainer strip — this
  duplicates what the Landing page already explains; cut it from onboarding.
**Keep:** Two clear choices (Try Sample Data / Upload My Own CSV), a simple
dropzone, Back/Skip/Continue actions.

## Main Dashboard
This is the most bloated screen — cut aggressively.
**Cut:**
- Multi-location "workspace switcher" (Artisan Roast Co. / Portland
  Flagship) — a single café per account is enough for this prototype. Don't
  imply multi-location support that isn't built.
- Fabricated AI banner copy with hyper-specific invented numbers ($420 oat
  milk waste, 6,754 transactions) — this entire banner must be generated
  from real computed data or removed until it can be.
- Location filter + granularity segmented control (Hourly/Daily/Weekly) on
  the chart — pick one granularity (Daily) for the prototype, cut the
  control.
- The "Record Saturday" floating annotation tooltip on the chart — cosmetic
  noise, cut.
- Peak Hours heatmap: keep it, but cut it down from a 7-day × 7-time-slot
  grid with per-cell tooltips to something simpler — e.g. a single-row "peak
  hours today" strip, or keep the weekly grid but drop the numeric labels
  inside every cell (they add visual noise without adding much value).
- The embedded "AI Shift Optimization Opportunity" callout box inside the
  heatmap card — this belongs on the Insights screen, not duplicated here.
- Top-5-products card's "Re-negotiate Suppliers" CTA — out of scope, cut.
**Keep:** One real auto-insight line, 4 real KPI cards, one real revenue
chart, top products list, one simplified peak-hours view. That's it.

## CSV Upload / Data Studio
**Cut:**
- Fake multi-stage "Auto-Schema Detection" pipeline UI with invented
  confidence scores ("99.8% Deterministic") — simplify to a real 2-state
  flow: Uploading → Parsed (with real row count).
- "Download Sample Template" + fake column-mapping cards (POS Dialect
  Recognition, Column Health Summary, Margin Calculation Engine) — these are
  invented UI for a feature that should just be: here's what we found, here's
  what's missing, continue.
- Full high-density data-preview table with 9 columns including invented
  "Est. Cost/COGS" and "Gross Margin %" per row — the CSV a café owner
  exports won't have cost data; don't fabricate it. Show only the columns
  that actually exist in the uploaded file, plus a "Mapping Status" column.
- Search bar + category filter dropdown on the preview table — nice-to-have,
  cut for v1.
- Sticky bottom action bar duplicate CTA ("Looks Good, Run AI Analytics")
  when the page already has a primary CTA — keep one.
**Keep:** Upload zone, a simple parsed-row-count confirmation, a preview
table of the real columns, one primary "Analyze" CTA.

## AI Analyst (Chat)
**Cut:**
- Right-hand "Active Grounding Data" transparency drawer's invented
  specificity (checksums, "100% Deterministic" badges, simulated impact
  calculator with a fake "+$385/week" recovery number) — either compute this
  for real from the user's data, or cut it for v1. Don't fabricate.
- Fake model name/version pill ("Deep Margin Audit v4") — if you're calling
  Gemini, say so plainly, don't invent a proprietary model name.
- "Export Chat Brief" / "Share with Shift Leads" header buttons — out of
  scope (no team features yet), cut both.
- Horizontally scrolling quick-prompt chips row AND suggested-follow-up pill
  row inside every AI response — pick one prompt-suggestion mechanism, not
  two different UI patterns for the same idea.
**Keep:** The chat thread itself, the input box, one row of 3-4 starter
prompt chips, and — once real — a simple "based on your data" note instead
of the full grounding drawer.

## Insights & Recommendations Hub
**Cut:**
- Top KPI strip's 4th card ("Implementation Velocity: <15 mins") — vague,
  unverifiable, cut.
- Category filter tabs beyond "All" + maybe 2 real categories — the
  Menu/Waste/Staffing/Resolved(8) breakdown is more taxonomy than a v1
  prototype needs.
- "Before vs After" comparison matrix's fabricated churn-risk numbers ("0.4%
  projected customer churn") — cut anything that isn't actually computable
  from the uploaded data.
- "Apply to POS", "Push to 7shifts/Deputy", "Send to Barista Shift Lead"
  action buttons — these all assume integrations we don't have; either link
  them to a real in-app action (e.g. mark as "acted on" in Firestore) or cut
  the button.
- "Secondary Insights & Quick Wins" section's vendor-email-draft CTA — out
  of scope unless you're actually generating a draft, cut.
**Keep:** 2-3 KPI summary cards (only real, computed ones), 2-3 recommendation
cards generated from real computed metrics, a single "mark as done" action
per card.

## Workspace Settings & Integrations
This screen is almost entirely fake integrations — cut most of it.
**Cut:**
- Entire "POS & Webhook Syncing" section (Square live connection, Toast
  "ready to pair", Clover/Lightspeed/Shopify marketplace banner) — we only
  support CSV upload, don't build fake integration cards for POS systems we
  don't connect to.
- Entire "COGS & Recipe Costing" supplier invoice table — out of scope for
  v1 (no COGS data model), cut the whole section.
- "AI Copilot Guardrails & Autonomous Rules" section's sliders/toggles for
  margin thresholds, labor triggers, auto-price-push with a "4-digit PIN" —
  none of this is built, cut entirely for v1.
- "Team Members & Role-Based Access" section — no multi-user model exists
  yet, cut unless it's actually being built this pass.
**Keep:** Profile tab (name, email, café name, password), Plan/Billing tab
(current plan, upgrade button → mock payment flow), Data & Privacy tab
(delete my data / delete account).

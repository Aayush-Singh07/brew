# Brewlytics — Auth Strategy & Mock Payment Flow

## Auth Decision: Email/Password + Demo Login (no Google OAuth)

**Decision: skip Google Sign-In. Use Firebase Auth Email/Password, plus a
one-click "View Demo" button.**

Reasoning:
- Google OAuth requires a configured OAuth consent screen, and until the app
  is verified, Google shows a scary "unverified app" warning to anyone
  outside the project's test-user list — exactly the friction that would hit
  a mentor or grader trying to log in.
- A mentor/tester grading this shouldn't need to create any account at all.
  Email/password lets us pre-seed one demo account with a known password,
  and a "View Demo" button can skip the login form entirely.
- This is a college prototype, not a product acquiring real users — the
  trust/convenience tradeoff that makes Google Sign-In worth the setup cost
  for a real product doesn't apply here.
- Email/password is still "real" Firebase Auth — it's not a fake login, it
  satisfies the "working prototype" requirement fully.

If a real deployment happens later, Google Sign-In can be added as an
additional provider without breaking anything already built — it's additive,
not something to design around now.

### Demo Account
Seed one Firebase Auth user and matching Firestore docs at setup time:
- Email: `demo@brewlytics.app`
- Password: `BrewDemo@2026`
- Pre-populate: one `cafes` doc, one processed `datasets` doc, one populated
  `metrics` doc (so the Dashboard is never empty), 2-3 `insights` docs, and
  a short existing `chats` thread so the AI Analyst screen isn't blank
  either.

"View Demo" button behavior: sign in with the above credentials
programmatically (no form filling required) and navigate straight to
`/dashboard`. This should work identically for a grader or your mentor —
one click, populated product, no setup.

### Regular Sign Up
Keep email/password sign-up as the "real" path so the core auth flow is
genuinely demonstrated (not just the demo shortcut). New accounts start on
the Free plan with empty state screens until they upload data or click
"Try Sample Data" in onboarding.

## Pricing Model Recap (for reference)
- **Free** — ₹0, limited uploads, limited AI questions
- **Pro** — ₹999/month, unlimited uploads, full AI analyst
- **Business** — ₹2,499/month, multi-outlet, team access

(Full details already defined in the Business Model doc — implement the
feature-gating to match those tiers, don't invent new ones.)

## Mock Payment Flow

No real payment processor is being integrated (no Stripe/Razorpay/etc.) —
this is simulated end-to-end, and must be **clearly labeled as simulated**
so nobody mistakes it for a real charge.

### Flow
1. User on Free plan clicks "Upgrade" (from Settings → Billing, or from a
   pricing card, or from a feature that's gated behind Pro/Business).
2. Show a simple mock checkout screen: plan summary, a fake card-number-style
   input (no real validation needed beyond basic formatting), and a clearly
   visible label: **"Simulated payment — no real charge will be made."**
3. On submit, write `payments/{cafeId} = { status: "pending", requestedPlan, requestedAt }`
   via the `resolveMockPayment` Cloud Function (or a client write is fine
   here since no real money is involved, but keep it consistent with the
   rest of the app's Firestore-through-functions pattern if you'd rather).
4. Show a short "Processing payment…" state (1-2 seconds, spinner) to make
   the flow feel real.
5. **Auto-resolve to `"approved"` after that short delay** by default — this
   is a prototype, and self-blocking checkout wastes a grader's time.
   Alongside the auto-resolve, also show a small dev/demo control — e.g. two
   buttons "Force Approve" / "Force Reject" — visible only in this mock
   checkout screen, so a tester can deliberately see the rejected state too
   if they want to.
6. On `"approved"`: update `users/{uid}.plan` to the requested plan, unlock
   the gated features, show a success state, redirect back to Settings →
   Billing showing the new plan.
7. On `"rejected"`: show a simple "Payment not approved" state with a
   "Try Again" button that re-opens the mock checkout screen. Plan stays
   unchanged.

### Why this approach
- It demonstrates the full upgrade UX (checkout → pending → resolved →
  feature unlock) without needing a real payment gateway integration, which
  is out of scope for a prototype and would need real bank/business
  verification to set up properly.
- Auto-approving by default means nobody grading the project gets stuck on
  a fake paywall, while the manual Approve/Reject toggle still proves both
  states are handled if someone wants to check.
- Everything is still driven by real Firestore writes and a real feature-gate
  check (`users/{uid}.plan`), so the "is this actually wired up" bar is met
  — it's the payment processor that's mocked, not the plan-gating logic.

### Feature Gating
Wherever a feature is Pro/Business-only (e.g. unlimited AI questions,
multi-outlet in Business), check `users/{uid}.plan` client-side for UI
gating (disable/hide) AND server-side in the relevant Cloud Function (e.g.
`askAnalyst` should reject or rate-limit Free-plan requests beyond their
quota) — don't rely on client-side gating alone.

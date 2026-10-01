# Brewlytics — Guardrails

These rules override anything ambiguous in the other docs. If a task
description conflicts with a guardrail below, the guardrail wins — stop and
ask rather than guess.

## 1. No invented scope
Build exactly what the docs describe. Do not add "nice to have" features
(multi-location support, team roles, POS marketplace integrations, Slack
bots, QuickBooks sync, etc.) unless a doc explicitly asks for it. This is a
college prototype, not a real SaaS company — every extra feature is extra
surface area for bugs and bloat we already said we don't want.

## 2. Every button/link must be real or removed
No `href="#"`, no `onClick={() => {}}`, no buttons that visually exist but
do nothing. If something in the current build has no real destination and
isn't in `03-navigation-map.md`, delete it rather than leave it dead.

## 3. No fake data in the shipped build
Nothing on screen should be a hardcoded fabricated number, testimonial, or
trust badge ("SOC2 Compliant", "Trained on 2M+ tickets", "450+ roasters
trust us", etc.) unless it is either (a) genuinely true and verifiable, or
(b) clearly inside the seeded **demo account only**, which is allowed to
have realistic-looking seeded numbers since it exists to demo the product.
A brand-new real signup should see honest empty states, not fake stats.

## 4. Currency & copy consistency
- Currency is always ₹ (INR). Never $ (USD). This must match the pricing
  already defined: Free / ₹999 Pro / ₹2,499 Business.
- Brand voice targets a general independent café owner — not a "specialty
  coffee roaster," "artisan roastery," or "coffee sommelier." Keep copy
  aligned with the existing Brand Identity and Business Model docs.

## 5. Secrets never touch the client
The Gemini API key is a secret. It must live in Firebase Functions config /
Secret Manager and be called only from a Cloud Function. Never import it
into any client-side file, never put it in a `.env` that ships to the
browser bundle, never log it.

## 6. Firestore Security Rules are mandatory, not optional
Every collection needs rules before it's usable — a user can only read/write
their own café's data. Ship rules alongside the schema, don't leave the
database open "for now."

## 7. Type safety
No `any`. Define interfaces/types for every Firestore document shape and
every Cloud Function request/response. If TypeScript is fighting you, fix
the types — don't cast around them.

## 8. Small, reviewable changes
Don't rewrite the entire app in one giant commit. Work phase by phase (see
`00-implementation-plan.md`), and within a phase, one screen or one backend
function at a time. Each change should be independently testable.

## 9. Don't silently change design language
Keep the existing violet (#6C4AB6-family) Material-3-style token system and
Inter typography — the visual language is good, the problem is density and
fake content, not the aesthetic. Simplifying a screen means fewer elements
and less copy, not a new color palette or a different UI kit.

## 10. Ask before big architectural swaps
If something in the current build (e.g. the exact Firestore shape, or a
particular library choice) seems wrong once you're in the code, flag it and
propose the change — don't just silently redo the architecture.

## 11. Accessibility & responsiveness are not optional polish
Every interactive element needs a visible focus state and an accessible
label (not icon-only buttons with no aria-label). Dashboard, AI Analyst, and
Landing must work on a phone-width viewport, not just desktop.

## 12. Mock payment must be clearly mock
Nowhere should the app imply real money changes hands. Label the mock
checkout screen clearly (e.g. "Simulated payment — no real charge") so it's
obviously a prototype flow to anyone reviewing it, including a grader.

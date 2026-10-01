# Brewlytics — Navigation Map

Every interactive element below must do exactly what's listed. Anything not
listed here and not explicitly kept in `01-bloat-removal.md` should be
removed rather than left non-functional. Route names are suggestions — keep
them consistent once chosen.

## Global (present on every logged-in screen)
| Element | Action |
|---|---|
| Logo (top-left) | Navigate to `/dashboard` if logged in, `/` if logged out |
| Sidebar → Dashboard | Navigate to `/dashboard` |
| Sidebar → AI Analyst | Navigate to `/analyst` |
| Sidebar → Insights | Navigate to `/insights` |
| Sidebar → CSV Upload | Navigate to `/upload` |
| Sidebar → Settings | Navigate to `/settings` |
| Sidebar → "Upload CSV" quick button | Navigate to `/upload` |
| User profile pill (bottom of sidebar) | Open a small menu: "Settings", "Log out" |
| "Log out" | Sign out of Firebase Auth, redirect to `/` |
| Sidebar → "Reports" | **Remove this link** — no Reports screen is being built; don't link to a page that doesn't exist |

## Landing Page (`/`)
| Element | Action |
|---|---|
| Nav → "Features" | Scroll to feature section on same page |
| Nav → "Pricing" | Scroll to pricing section on same page |
| Nav → "Demo" | Scroll to the demo/preview section on same page |
| "Sign In" (top right) | Navigate to `/login` |
| "Get Started" (top right) | Navigate to `/signup` |
| Hero "Analyze My Café Free" | Navigate to `/signup` |
| Hero "Watch 2-Min Demo" | Either open a real short walkthrough video/gif, or scroll to the interactive preview section — do not leave as a dead link |
| Pricing → "Get Started Free" (Free card) | Navigate to `/signup` |
| Pricing → "Start Free Trial" (Pro card) | Navigate to `/signup?plan=pro` — after signup, land the user straight in the mock upgrade flow for Pro |
| Pricing → "Contact Enterprise Sales" (Business card) | Navigate to `/signup?plan=business`, same pattern as Pro |
| Bottom CTA "Upload My First CSV Free" | Navigate to `/signup` |
| Bottom CTA "See Example Output" | Scroll to demo section, or open the seeded demo account read-only preview if that's built |
| Footer links (Privacy/Terms) | Real static pages, even if minimal one-paragraph placeholders — not `#` |

## Sign Up / Login (`/signup`, `/login`)
| Element | Action |
|---|---|
| "Back to overview" | Navigate to `/` |
| Tab: "Create Account" / "Log In" | Toggle form mode client-side (existing logic is fine, keep it) |
| "View Demo" (new — replaces social buttons) | Signs the browser into the pre-seeded demo Firebase Auth account, navigates straight to `/dashboard` |
| Primary submit (Sign Up) | Creates Firebase Auth user + Firestore `users/{uid}` + `cafes/{cafeId}` doc, then navigates to `/onboarding` |
| Primary submit (Log In) | Signs in via Firebase Auth, navigates to `/dashboard` |
| "Forgot password?" | Trigger Firebase `sendPasswordResetEmail`, show confirmation message |
| Footer → Terms/Privacy | Same static pages as Landing footer |
| Footer → "Need help? Contact support" | `mailto:` link to a real support address, or a simple contact note — not a dead link |

## Onboarding (`/onboarding`)
| Element | Action |
|---|---|
| "Save & Exit" | Navigate to `/dashboard` (in whatever partial state onboarding was in — don't block on completion) |
| "Try Sample Data" card / "Explore Sample" button | Seed the user's account with the shared demo dataset (copy, not a live link to the actual demo account), navigate to `/dashboard` |
| "Upload My Own CSV" card / dropzone | Navigate to `/upload` |
| "Back" | Navigate to previous onboarding step, or `/signup` if on step 1 |
| "Skip for now" | Navigate to `/dashboard` with an empty state |
| "Continue to Dashboard" | Only enabled once a data source (sample or upload) is chosen; navigates to `/dashboard` |

## Dashboard (`/dashboard`)
| Element | Action |
|---|---|
| Date range selector | Filters the revenue chart + KPI cards to the selected range, re-reads from Firestore/re-aggregates client-side |
| "Export Report" | Generates a simple CSV/PDF of the current view and downloads it — must actually produce a file, or be removed |
| "Upload CSV" (header button) | Navigate to `/upload` |
| Auto-insight banner "Ask AI Analyst about X" | Navigate to `/analyst` with that question pre-filled in the input box |
| Auto-insight banner secondary button | Navigate to `/insights` |
| Top-5-products "Full SKU Breakdown" | Navigate to `/insights` filtered to products, or expand the list in place — pick one, make it real |
| Peak hours card info icon | Open a small tooltip/popover explaining how the heatmap is read — static content is fine here |
| Notification bell | Open a real (even if simple) notifications panel reading from Firestore, or remove the bell entirely if no notification data model is built |

## CSV Upload (`/upload`)
| Element | Action |
|---|---|
| "Upload New File" | Opens the file picker / dropzone |
| Dropzone / "click to browse" | Opens native file picker, accepts `.csv` |
| "Re-upload / Change File" | Clears current upload state, reopens dropzone |
| Row search + category filter | If kept: filters the preview table client-side. If cut per doc 01: remove entirely |
| Pagination controls | Page through the real preview rows |
| "Looks Good, Run AI Analytics" (primary CTA) | Triggers the Cloud Function to compute metrics from the uploaded file, then navigates to `/dashboard` once processing completes |
| "Export Cleaned CSV" | Downloads the parsed/cleaned file — must produce a real file or be removed |

## AI Analyst (`/analyst`)
| Element | Action |
|---|---|
| Starter prompt chips | Clicking one inserts that text into the input box and sends it |
| Text input + send button | Sends the message to the Gemini-backed Cloud Function, appends both user message and AI response to the Firestore-backed chat thread |
| Attach file icon | Either wire to real CSV upload (shortcut to `/upload`) or remove — don't leave as decoration |
| Mic icon | Remove unless voice input is actually being built |
| History icon | Opens a simple list of past chat sessions from Firestore, lets the user switch threads |
| "Clear Session" | Clears the current thread from view (and optionally from Firestore) |
| Any "Apply Insights to Weekly Roster & POS" style button | Remove — no roster/POS integration exists |
| Follow-up suggestion pills inside a response | Same behavior as starter prompt chips — send that text as the next message |

## Insights (`/insights`)
| Element | Action |
|---|---|
| "Filter by Impact" | Client-side sort/filter of the insight cards by computed impact value |
| "Export Action Brief" | Generates a real downloadable file, or remove |
| "Apply All to Shift Notes" | Remove unless a real "shift notes" data model is built |
| Category filter tabs | Client-side filter of the cards shown |
| Sort dropdown | Client-side sort of the cards shown |
| Card primary action (e.g. "Update POS Recipe Price") | Since no real POS write-back exists, change this button's label/behavior to something real: mark the insight as "Actioned" in Firestore, which moves it out of the active list |
| Card secondary actions (Simulate/Dismiss/View Tickets) | Keep only "Dismiss" (removes the card / marks it dismissed in Firestore); cut the rest unless genuinely built |

## Settings (`/settings`)
| Element | Action |
|---|---|
| Sub-tab: Profile | Shows/edits name, email, café name; "Save Changes" writes to `users/{uid}` |
| Sub-tab: Billing/Plan | Shows current plan; "Upgrade" button opens the mock payment flow (see doc 05) |
| Sub-tab: Data & Privacy | "Delete my uploaded data" clears the user's datasets from Storage + Firestore; "Delete account" deletes the Firebase Auth user + all their Firestore/Storage data, signs out, redirects to `/` |
| "Documentation & API Keys" | Remove — no public API/dev docs exist for this prototype |
| "Save Changes" (top header) | Only relevant to whichever sub-tab is active; writes that tab's form to Firestore |
| POS/COGS/Team/AI-rules sections | Removed entirely per `01-bloat-removal.md` |

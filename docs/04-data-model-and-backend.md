# Brewlytics — Data Model & Backend

Use Firebase end-to-end: Firestore, Firebase Storage, Cloud Functions, and
Firebase Hosting. No Supabase, no third-party auth, no external database. The
only external API call this app makes is to Gemini, and only from a Cloud
Function.

## Firestore Collections

### `users/{uid}`
```
{
  uid: string,
  email: string,
  fullName: string,
  cafeId: string,          // reference to cafes/{cafeId}
  plan: "free" | "pro" | "business",
  createdAt: timestamp
}
```

### `cafes/{cafeId}`
```
{
  ownerUid: string,
  name: string,             // "café or business name" from signup
  createdAt: timestamp
}
```
One café per account for this prototype — do not build multi-location
support (see guardrails doc).

### `datasets/{datasetId}`
One per uploaded CSV.
```
{
  cafeId: string,
  uploadedBy: string,       // uid
  fileName: string,
  storagePath: string,      // path in Firebase Storage
  status: "processing" | "ready" | "error",
  rowCount: number,
  columns: string[],        // actual column headers found in the file
  uploadedAt: timestamp
}
```

### `metrics/{cafeId}`
One aggregated doc per café, recomputed whenever a new dataset finishes
processing. This is what the Dashboard reads.
```
{
  cafeId: string,
  datasetId: string,        // which dataset this was computed from
  totalRevenue: number,
  totalOrders: number,
  averageOrderValue: number,
  revenueByDay: { date: string, revenue: number }[],
  topProducts: { name: string, revenue: number, units: number }[],
  revenueByHour: { hour: number, revenue: number }[],  // for peak-hours view
  updatedAt: timestamp
}
```
Keep this schema flat and simple — only include fields the UI actually
displays. Don't add cost/margin fields unless the uploaded CSV actually
contains cost data (most café POS exports won't).

### `insights/{insightId}`
Generated after metrics are computed — a small number of simple,
rule-based or Gemini-generated recommendation cards.
```
{
  cafeId: string,
  title: string,
  description: string,
  category: "revenue" | "timing" | "product",
  status: "active" | "actioned" | "dismissed",
  createdAt: timestamp
}
```

### `chats/{cafeId}/messages/{messageId}`
```
{
  role: "user" | "assistant",
  text: string,
  createdAt: timestamp
}
```
One subcollection per café is enough for v1 — no need for multiple named
chat sessions unless doc 03's "History" feature is actually being built, in
which case add a `sessionId` field.

### `payments/{cafeId}`
Mock payment/subscription state — see doc 05 for the full flow.
```
{
  cafeId: string,
  status: "none" | "pending" | "approved" | "rejected",
  requestedPlan: "pro" | "business",
  requestedAt: timestamp,
  resolvedAt: timestamp | null
}
```

## Firebase Storage
- Path: `uploads/{uid}/{datasetId}.csv`
- Only the uploading user can read/write their own path (rules below).

## Cloud Functions

### `onDatasetUpload` (Storage-triggered)
Fires when a file lands in `uploads/{uid}/*`. Parses the CSV, computes the
`metrics/{cafeId}` doc, updates `datasets/{datasetId}.status`, and generates
a small batch of `insights` docs from the computed numbers.

### `askAnalyst` (Callable Cloud Function)
Input: `{ cafeId, question }`.
Steps:
1. Read `metrics/{cafeId}` from Firestore.
2. Build a prompt: system context (what Brewlytics is, the shape of the
   data) + the actual computed metrics as structured context + the user's
   question.
3. Call the Gemini API server-side using the API key from Functions
   config/Secret Manager.
4. Return the model's answer to the client, which then writes both the user
   message and the response into `chats/{cafeId}/messages`.
Never let the client call Gemini directly — always through this function, so
the API key stays server-side.

### `resolveMockPayment` (Callable Cloud Function)
See doc 05 — flips `payments/{cafeId}.status` and, if approved, updates
`users/{uid}.plan`.

## Firestore Security Rules (draft — adapt paths as needed)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }
    function ownsCafe(cafeId) {
      return isSignedIn() &&
        get(/databases/$(database)/documents/cafes/$(cafeId)).data.ownerUid == request.auth.uid;
    }

    match /users/{uid} {
      allow read, write: if isSignedIn() && request.auth.uid == uid;
    }

    match /cafes/{cafeId} {
      allow read, write: if ownsCafe(cafeId);
    }

    match /datasets/{datasetId} {
      allow read: if isSignedIn() && ownsCafe(resource.data.cafeId);
      allow create: if isSignedIn();
      allow update, delete: if ownsCafe(resource.data.cafeId);
    }

    match /metrics/{cafeId} {
      allow read: if ownsCafe(cafeId);
      allow write: if false; // only Cloud Functions (admin SDK) write this
    }

    match /insights/{insightId} {
      allow read, update: if isSignedIn() && ownsCafe(resource.data.cafeId);
      allow write: if false; // created by Cloud Function; status updates
                              // (actioned/dismissed) go through a narrower
                              // rule if you split create vs update
    }

    match /chats/{cafeId}/messages/{messageId} {
      allow read, create: if ownsCafe(cafeId);
    }

    match /payments/{cafeId} {
      allow read: if ownsCafe(cafeId);
      allow write: if false; // only via resolveMockPayment function
    }
  }
}
```
Tighten this further once the exact field-level access patterns are locked
in — this draft is the minimum bar, not the final word.

## Storage Security Rules (draft)
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{uid}/{fileName} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## Gemini API Key Handling
- Store it via `firebase functions:secrets:set GEMINI_API_KEY` (or
  equivalent Secret Manager setup) — never in a committed `.env`, never in
  any client bundle.
- Only `askAnalyst` reads it, server-side.

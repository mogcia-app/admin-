# Agency Admin Initial Setup

## Implemented in This Repository

- App is treated as `agency-admin`.
- Login guard expects `users/{uid}` document with:
  - `role === "agency_admin"`
  - non-empty `agencyId`
- Data listing for users is forced through Firestore query:
  - `where("agencyId", "==", currentAgencyId)`
- Audit log helper writes `auditLogs` with:
  - `tenantType: "agency"`
  - `agencyId`, `actor`, `target`, `changes`, `metadata`

## Required Firebase Configuration

1. Use the same Firebase project as hq-admin.
2. Add a dedicated Web App for agency-admin.
3. Add authorized domains for agency-admin and localhost.
4. Deploy latest Firestore Rules and Indexes.

## Required Environment Variables

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional for analytics)

## Release Checklist

- [ ] Firestore Rules deployed
- [ ] Firestore Indexes deployed
- [ ] `agency-admin` domain added to Authorized domains
- [ ] Non-agency-admin users are rejected
- [ ] Cross-agency read is blocked by Rules
- [ ] `auditLogs` events are recorded

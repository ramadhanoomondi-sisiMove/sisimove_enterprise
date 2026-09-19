// -----------------------------------------------------------------------------
// sisiMove — Authenticated Profile Route
// -----------------------------------------------------------------------------
//
// Route:
//     /profile
//
// Responsibility:
// - Provide the authenticated route entry point for the user's profile.
// - Delegate profile data composition to ProfilePageContainer.
//
// Architecture:
//
//     Next.js Route
//          │
//          ▼
//     ProfilePageContainer
//          │
//          ├── Traveller Profile
//          ├── Verification
//          ├── Verification Requirements
//          ├── Avatar presentation data
//          ├── Account data
//          └── Profile actions
//                 │
//                 ▼
//            ProfilePage
//                 │
//                 ├── Header
//                 ├── About
//                 ├── Visibility
//                 ├── Verification
//                 ├── Trust
//                 ├── Activity
//                 ├── Corridors
//                 ├── Preferences
//                 └── Account
//
// Non-responsibilities:
// - Data fetching.
// - API calls.
// - Authentication state management.
// - Verification logic.
// - Profile mutation logic.
// - Trust calculation.
// - Profile data composition.
// - Routing decisions.
//
// The route remains a thin Next.js entry point.
//
// ProfilePageContainer owns screen-level data composition.
//
// ProfilePage remains the presentation composition boundary.
//
// IMPORTANT:
//
// Do not import ProfilePage directly here.
//
// ProfilePage requires composed presentation data and callbacks. The route
// must therefore delegate to ProfilePageContainer, which owns the composition
// of independently owned server-state boundaries.
//
// -----------------------------------------------------------------------------

import { ProfilePageContainer } from '@/components/profile/profile-page-container';


// =============================================================================
// Route
// =============================================================================

export default function ProfileRoute() {
  return <ProfilePageContainer />;
}

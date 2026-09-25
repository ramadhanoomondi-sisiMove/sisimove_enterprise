//features/journey/hooks/index.ts
// -----------------------------------------------------------------------------
// sisiMove — Journey
// Hooks Barrel
// -----------------------------------------------------------------------------
//
// Public barrel export for all Journey React hooks.
//
// The Journey feature separates hooks into:
//
//     queries/
//         Read-only server-state access.
//
//     mutations/
//         Commands that change Journey state or associations.
//
// This barrel provides a single feature-level import surface:
//
//     import {
//       useMyJourneys,
//       useCreateJourney,
//     } from '@/features/journey/hooks';
//
// Keeping the public exports here prevents consumers from depending directly
// on the internal hooks directory structure.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Query hooks
// -----------------------------------------------------------------------------

export * from './queries';

// -----------------------------------------------------------------------------
// Mutation hooks
// -----------------------------------------------------------------------------

export * from './mutations';
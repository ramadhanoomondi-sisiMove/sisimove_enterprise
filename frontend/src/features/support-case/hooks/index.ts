// -----------------------------------------------------------------------------
// sisiMove — Support Hooks Barrel
// -----------------------------------------------------------------------------
//
// Public export boundary for the member-facing Support feature hooks.
//
// Responsibilities:
// - expose Support query hooks;
// - expose Support mutation hooks;
// - keep consumers independent from the internal hook folder structure.
//
// Non-responsibilities:
// - API transport;
// - response mapping;
// - React Query configuration;
// - support-domain business rules;
// - aggregate orchestration.
//
// The Support frontend deliberately exposes only member-facing capabilities.
// Internal notes, participant administration, assignment, and resolution
// mutations are not exported here.
//
// -----------------------------------------------------------------------------

export * from './queries';
export * from './mutations';
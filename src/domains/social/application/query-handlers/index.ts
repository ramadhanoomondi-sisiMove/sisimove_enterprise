// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Query Handlers
// -----------------------------------------------------------------------------
//
// Public application barrel for Traveller Profile query-handler
// implementations.
//
// Consumers should import query handlers through this barrel rather than
// depending directly on individual handler files.
//
// Query handlers are grouped by responsibility:
//
// - General Traveller Profile
// - Public Traveller Profile
// - Traveller Profile Preferences
// - Traveller Profile Corridors
//
// Public Traveller Profile handlers intentionally remain separate from the
// broader Traveller Profile handlers because they construct reduced public
// read representations and enforce the public visibility boundary.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Traveller Profile
// -----------------------------------------------------------------------------

export * from './get-traveller-profile.query-handler';

export * from './get-traveller-profile-by-public-id.query-handler';

export * from './get-traveller-profile-by-member-public-id.query-handler';

export * from './get-traveller-profile-by-handle.query-handler';

// -----------------------------------------------------------------------------
// Public Traveller Profile
// -----------------------------------------------------------------------------

export * from './get-public-traveller-by-member.query-handler';

export * from './get-public-traveller-by-handle.query-handler';

// -----------------------------------------------------------------------------
// Traveller Profile Preferences
// -----------------------------------------------------------------------------

export * from './get-traveller-profile-preferences.query-handler';

// -----------------------------------------------------------------------------
// Traveller Profile Corridors
// -----------------------------------------------------------------------------

export * from './get-traveller-profile-corridor.query-handler';

export * from './get-traveller-profile-corridors.query-handler';

export * from './get-traveller-profile-primary-corridor.query-handler';

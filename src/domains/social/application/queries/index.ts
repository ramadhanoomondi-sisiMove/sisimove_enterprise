// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Application Queries
// -----------------------------------------------------------------------------
//
// Public application barrel for Traveller Profile query objects.
//
// Consumers should import queries through this barrel rather than depending
// directly on individual query implementation files.
//
// Query groups:
//
// - General Traveller Profile
// - Public Traveller Profile
// - Traveller Profile Preferences
// - Traveller Profile Corridors
//
// Public Traveller Profile queries intentionally have their own entries because
// they represent reduced anonymous/public read contracts rather than the
// broader Traveller Profile application model.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Traveller Profile
// -----------------------------------------------------------------------------

export * from './get-traveller-profile.query';

export * from './get-traveller-profile-by-public-id.query';

export * from './get-traveller-profile-by-member-public-id.query';

export * from './get-traveller-profile-by-handle.query';

// -----------------------------------------------------------------------------
// Public Traveller Profile
// -----------------------------------------------------------------------------

export * from './get-public-traveller-by-member.query';

export * from './get-public-traveller-by-handle.query';

// -----------------------------------------------------------------------------
// Traveller Profile Preferences
// -----------------------------------------------------------------------------

export * from './get-traveller-profile-preferences.query';

// -----------------------------------------------------------------------------
// Traveller Profile Corridors
// -----------------------------------------------------------------------------

export * from './get-traveller-profile-corridor.query';

export * from './get-traveller-profile-corridors.query';

export * from './get-traveller-profile-primary-corridor.query';


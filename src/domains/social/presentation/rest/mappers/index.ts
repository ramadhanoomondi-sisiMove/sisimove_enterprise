// src/domains/social/presentation/rest/mappers/index.ts

// -----------------------------------------------------------------------------
// Traveller Profile Response Mappers
// -----------------------------------------------------------------------------

/**
 * Broad Traveller Profile response contracts.
 *
 * Used by existing internal and operational REST endpoints that require the
 * complete Traveller Profile representation.
 */
export * from './traveller-profile-response.mapper';

/**
 * Reduced public Traveller Profile response contracts.
 *
 * Used by unauthenticated marketplace discovery endpoints. This mapper exposes
 * only safe public profile information and accepts an already-resolved public
 * avatar representation from the application layer.
 */
export * from './public-traveller-profile-response.mapper';

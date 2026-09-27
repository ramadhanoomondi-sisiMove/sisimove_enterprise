// -----------------------------------------------------------------------------
// sisiMove — Support Models
// -----------------------------------------------------------------------------
//
// Public export boundary for the Support feature's frontend models.
//
// This barrel exposes API/application models only.
//
// It intentionally does not expose:
// - backend domain entities;
// - aggregate classes;
// - Prisma models;
// - repositories;
// - domain services;
// - internal Support notes.
//
// Consumers should use these models as the frontend representation of the
// Support HTTP API.
//
// -----------------------------------------------------------------------------

export * from './support-case-status';
export * from './support-case-priority';
export * from './support-case-category';
export * from './support-message-type';
export * from './support-case-participant-role';
export * from './support-resolution-type';
export * from './support-case-reference';
export * from './support-case-message';
export * from './support-case-evidence';
export * from './support-case-resolution';
export * from './support-case-participant';
export * from './support-case';
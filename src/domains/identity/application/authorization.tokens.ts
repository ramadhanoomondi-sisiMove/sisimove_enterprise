// src/domains/authorization/authorization.tokens.ts

// -----------------------------------------------------------------------------
// Domain Repositories
// -----------------------------------------------------------------------------

export const AUTHORIZATION_ROLE_REPOSITORY = Symbol(
  'AUTHORIZATION_ROLE_REPOSITORY',
);

export const AUTHORIZATION_PERMISSION_REPOSITORY = Symbol(
  'AUTHORIZATION_PERMISSION_REPOSITORY',
);

export const AUTHORIZATION_ROLE_PERMISSION_REPOSITORY = Symbol(
  'AUTHORIZATION_ROLE_PERMISSION_REPOSITORY',
);

export const AUTHORIZATION_IDENTITY_ROLE_REPOSITORY = Symbol(
  'AUTHORIZATION_IDENTITY_ROLE_REPOSITORY',
);

// -----------------------------------------------------------------------------
// Application Services
// -----------------------------------------------------------------------------

export const AUTHORIZATION_EVENT_PUBLISHER = Symbol(
  'AUTHORIZATION_EVENT_PUBLISHER',
);

// -----------------------------------------------------------------------------
// Command Repositories
// -----------------------------------------------------------------------------

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');
export const PERMISSION_REPOSITORY = Symbol('PERMISSION_REPOSITORY');

// -----------------------------------------------------------------------------
// Query Repositories
// -----------------------------------------------------------------------------

export const ROLE_READ_REPOSITORY = Symbol('ROLE_READ_REPOSITORY');
export const PERMISSION_READ_REPOSITORY = Symbol('PERMISSION_READ_REPOSITORY');

// -----------------------------------------------------------------------------
// Infrastructure
// -----------------------------------------------------------------------------

export const EVENT_PUBLISHER = Symbol('EVENT_PUBLISHER');

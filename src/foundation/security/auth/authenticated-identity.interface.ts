// -----------------------------------------------------------------------------
// Authentication — Authenticated Identity
// -----------------------------------------------------------------------------
//
// Request-scoped representation of the authenticated Identity.
//
// The JWT strategy verifies the access token and attaches the verified
// TokenPayload to the request.
//
// AuthenticatedIdentity intentionally reuses the canonical Foundation
// TokenPayload representation.
//
// This type does NOT:
//
// - verify tokens;
// - generate tokens;
// - evaluate permissions;
// - load Identity aggregates;
// - access Prisma;
// - modify authentication state.
//
// -----------------------------------------------------------------------------

import type { TokenPayload } from '../../../foundation/security/jwt-token-service.interface';

// =============================================================================
// Authenticated Identity
// =============================================================================

export type AuthenticatedIdentity = TokenPayload;

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AuthenticatedIdentity;

// -----------------------------------------------------------------------------
// Authentication — Current Identity Decorator
// -----------------------------------------------------------------------------
//
// Parameter decorator for accessing the authenticated Identity attached to
// the current HTTP request.
//
// The authenticated Identity is populated by the JWT authentication boundary
// after successful token verification.
//
// Example:
//
//     @Get('me')
//     public async getCurrentIdentity(
//       @CurrentIdentity() identity: AuthenticatedIdentity,
//     ) {
//       ...
//     }
//
// This decorator does NOT:
//
// - authenticate the request;
// - verify JWTs;
// - generate tokens;
// - evaluate permissions;
// - query Identity;
// - access Prisma;
// - modify domain state.
//
// Authentication is handled by JwtAuthGuard / the JWT authentication
// strategy.
//
// Authorization is handled by PermissionsGuard.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Authentication
// -----------------------------------------------------------------------------

import type { AuthenticatedIdentity } from './authenticated-identity.interface';

// =============================================================================
// Decorator
// =============================================================================

export const CurrentIdentity = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedIdentity => {
    const request = context.switchToHttp().getRequest<{
      user: AuthenticatedIdentity;
    }>();

    return request.user;
  },
);

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CurrentIdentity;

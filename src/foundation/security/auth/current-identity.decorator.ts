// -----------------------------------------------------------------------------
// Authentication — Current Identity Decorator
// -----------------------------------------------------------------------------
//
// Parameter decorator for accessing the authenticated Identity attached to
// the current HTTP request.
//
// Authentication is performed by JwtAuthGuard.
//
// Authorization is performed by PermissionsGuard.
//
// -----------------------------------------------------------------------------

import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

import type { AuthenticatedIdentity } from './authenticated-identity.interface';

// =============================================================================
// Decorator
// =============================================================================

export const CurrentIdentity = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedIdentity => {
    const request = context
      .switchToHttp()
      .getRequest<{ user: AuthenticatedIdentity }>();

    return request.user;
  },
);

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CurrentIdentity;

// -----------------------------------------------------------------------------
// Identity — Permissions Guard
// -----------------------------------------------------------------------------
//
// NestJS authorization guard for endpoints protected by:
//
//     @RequirePermissions('identity.read')
//
// Responsibilities:
//
// - read required permission metadata;
// - obtain the authenticated identity from request.user;
// - evaluate permissions carried by the authenticated identity;
// - reject requests that do not contain all required permissions.
//
// Authentication is handled separately by JwtAuthGuard.
//
// This guard does NOT:
//
// - authenticate users;
// - validate JWT signatures;
// - access Prisma;
// - access repositories;
// - load Identity aggregates;
// - load Roles;
// - load Permissions;
// - resolve database identifiers;
// - manage sessions;
// - manage devices;
// - manage OTP challenges;
// - manage recovery.
//
// -----------------------------------------------------------------------------
//
// Authentication pipeline:
//
//     JwtAuthGuard
//          │
//          ▼
//     request.user
//          │
//          ▼
//     PermissionsGuard
//          │
//          ▼
//     permission evaluation
//
// -----------------------------------------------------------------------------
//
// Permission semantics:
//
//     @RequirePermissions('identity.read')
//
// Multiple permissions use AND semantics:
//
//     @RequirePermissions(
//       'identity.read',
//       'identity.update',
//     )
//
// The authenticated identity must possess every required permission.
//
// -----------------------------------------------------------------------------
//
// Permission source:
//
//     TokenPayload.permissions
//
// Permissions are resolved when the authenticated token is created and are
// subsequently evaluated from AuthenticatedIdentity.
//
// -----------------------------------------------------------------------------

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { AuthenticatedIdentity } from './authenticated-identity.interface';
import { PERMISSIONS_KEY } from './require-permissions.decorator';

// =============================================================================
// Request
// =============================================================================

interface AuthenticatedRequest {
  readonly user?: AuthenticatedIdentity;
}

// =============================================================================
// Guard
// =============================================================================

@Injectable()
export class PermissionsGuard implements CanActivate {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(private readonly reflector: Reflector) {}

  // ===========================================================================
  // Authorization
  // ===========================================================================

  public canActivate(context: ExecutionContext): boolean {
    // -------------------------------------------------------------------------
    // Resolve required permissions
    // -------------------------------------------------------------------------

    const requiredPermissions = this.reflector.getAllAndOverride<
      readonly string[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    // -------------------------------------------------------------------------
    // No permission requirement
    // -------------------------------------------------------------------------
    //
    // If the endpoint does not declare @RequirePermissions(), this guard has
    // nothing to evaluate.
    //
    // Authentication, when required, remains the responsibility of
    // JwtAuthGuard.
    // -------------------------------------------------------------------------

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // -------------------------------------------------------------------------
    // Resolve authenticated identity
    // -------------------------------------------------------------------------

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const identity = request.user;

    if (!identity) {
      throw new ForbiddenException('Authentication required.');
    }

    // -------------------------------------------------------------------------
    // Resolve granted permissions
    // -------------------------------------------------------------------------

    const grantedPermissions = identity.permissions ?? [];

    // -------------------------------------------------------------------------
    // Evaluate permissions
    // -------------------------------------------------------------------------
    //
    // AND semantics:
    //
    // Every permission declared by @RequirePermissions() must be present in
    // the authenticated identity's permission set.
    // -------------------------------------------------------------------------

    const hasAllPermissions = requiredPermissions.every((permission) =>
      grantedPermissions.includes(permission),
    );

    // -------------------------------------------------------------------------
    // Reject unauthorized request
    // -------------------------------------------------------------------------

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        'You do not have permission to perform this action.',
      );
    }

    // -------------------------------------------------------------------------
    // Authorized
    // -------------------------------------------------------------------------

    return true;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default PermissionsGuard;

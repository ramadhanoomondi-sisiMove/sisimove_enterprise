// -----------------------------------------------------------------------------
// Identity — Require Permissions Decorator
// -----------------------------------------------------------------------------
//
// Marks a controller or route handler with the permissions required to
// execute the operation.
//
// The decorator only stores authorization metadata.
//
// Permission evaluation is performed by PermissionsGuard.
//
// This decorator does NOT:
//
// - authenticate the caller;
// - load the Identity;
// - load roles;
// - load permissions;
// - evaluate permissions;
// - access Prisma;
// - throw authorization exceptions.
//
// -----------------------------------------------------------------------------

import { SetMetadata } from '@nestjs/common';

// =============================================================================
// Metadata
// =============================================================================

export const PERMISSIONS_KEY = 'permissions';

// =============================================================================
// Decorator
// =============================================================================

/**
 * Declares the permissions required by a controller or route handler.
 *
 * Example:
 *
 * @RequirePermissions('session:read')
 * @Get(':sessionPublicId')
 * public async getSession(...) {
 *   // ...
 * }
 *
 * Multiple permissions may be declared.
 *
 * Example:
 *
 * @RequirePermissions('session:read', 'session:revoke')
 *
 * PermissionsGuard is responsible for determining whether the authenticated
 * Identity satisfies all declared permissions.
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RequirePermissions;

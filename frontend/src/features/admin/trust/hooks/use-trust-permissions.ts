/**
 * sisiMove — Trust Permissions Hook
 *
 * Adapts an existing permission checker for Trust UI decisions.
 * This is a presentation aid, not an authorization boundary.
 */

type PermissionChecker = (permission: string) => boolean;

export function useTrustPermissions(
  hasPermission: PermissionChecker,
) {
  const canReadTrust = hasPermission('trust:read');

  return {
    canReadTrust,
  };
}

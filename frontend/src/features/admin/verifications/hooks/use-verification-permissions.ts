
"use client";

/**
 * -----------------------------------------------------------------------------
 * sisiMove — Verification Permissions Hook
 * -----------------------------------------------------------------------------
 *
 * Path:
 * src/features/admin/verifications/hooks/use-verification-permissions.ts
 *
 * Purpose:
 * Exposes frontend capability checks for verification actions.
 *
 * Important:
 * - Granting MEMBER and DRIVER verification uses separate permissions.
 * - Evidence review actions use verification:review.
 * - Other aggregate management actions use verification:manage.
 * - The backend remains the authorization boundary.
 * -----------------------------------------------------------------------------
 */

const VERIFICATION_PERMISSIONS = {
  read: "verification:read",
  submit: "verification:submit",

  // Aggregate-level verification grants
  grantMember: "verification:grant-member",
  grantDriver: "verification:grant-driver",

  // Request-level evidence review
  review: "verification:review",

  // Other aggregate-level actions
  manage: "verification:manage",
} as const;

export const useVerificationPermissions = (
  grantedPermissions: readonly string[],
) => {
  const permissionSet = new Set(grantedPermissions);

  const hasPermission = (permission: string): boolean =>
    permissionSet.has(permission);

  const canReview = hasPermission(VERIFICATION_PERMISSIONS.review);
  const canManage = hasPermission(VERIFICATION_PERMISSIONS.manage);

  return {
    canRead: hasPermission(VERIFICATION_PERMISSIONS.read),
    canSubmit: hasPermission(VERIFICATION_PERMISSIONS.submit),

    canGrantMember: hasPermission(
      VERIFICATION_PERMISSIONS.grantMember,
    ),
    canGrantDriver: hasPermission(
      VERIFICATION_PERMISSIONS.grantDriver,
    ),

    canApproveRequest: canReview,
    canRejectRequest: canReview,
    canCancelRequest: canReview,

    canReject: canManage,
    canReopen: canManage,
    canExpire: canManage,
    canRevoke: canManage,
  };
};

export default useVerificationPermissions;

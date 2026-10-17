
"use client";

/**
 * sisiMove — Verification Permissions Hook
 */

const VERIFICATION_PERMISSIONS = {
  read: "verification:read",
  grantMember: "verification:grant-member",
  grantDriver: "verification:grant-driver",
  reject: "verification:reject",
  reopen: "verification:reopen",
  expire: "verification:expire",
  revoke: "verification:revoke",
  approveRequest: "verification-request:approve",
  rejectRequest: "verification-request:reject",
  submit: "verification:submit",
} as const;

export const useVerificationPermissions = (
  grantedPermissions: readonly string[],
) => {
  const hasPermission = (permission: string): boolean =>
    grantedPermissions.includes(permission);

  return {
    canRead: hasPermission(VERIFICATION_PERMISSIONS.read),
    canGrantMember: hasPermission(VERIFICATION_PERMISSIONS.grantMember),
    canGrantDriver: hasPermission(VERIFICATION_PERMISSIONS.grantDriver),
    canReject: hasPermission(VERIFICATION_PERMISSIONS.reject),
    canReopen: hasPermission(VERIFICATION_PERMISSIONS.reopen),
    canExpire: hasPermission(VERIFICATION_PERMISSIONS.expire),
    canRevoke: hasPermission(VERIFICATION_PERMISSIONS.revoke),
    canApproveRequest: hasPermission(
      VERIFICATION_PERMISSIONS.approveRequest,
    ),
    canRejectRequest: hasPermission(
      VERIFICATION_PERMISSIONS.rejectRequest,
    ),
    canSubmit: hasPermission(VERIFICATION_PERMISSIONS.submit),
  };
};

export default useVerificationPermissions;

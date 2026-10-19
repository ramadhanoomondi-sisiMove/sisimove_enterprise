
import type {
  VerificationAction,
} from "../types/verification-action.types";

/**
 * Canonical verification permissions.
 *
 * Grant permissions are distinct because the backend protects the two
 * aggregate-level grant endpoints independently.
 */
export const VERIFICATION_PERMISSION_CODES = {
  read: "verification:read",
  submit: "verification:submit",
  review: "verification:review",
  manage: "verification:manage",
  grantMember: "verification:grant-member",
  grantDriver: "verification:grant-driver",
} as const;

export type VerificationPermissionCode =
  (typeof VERIFICATION_PERMISSION_CODES)[keyof typeof VERIFICATION_PERMISSION_CODES];

/**
 * UI capability map only.
 * The backend remains the authorization boundary.
 */
export const VERIFICATION_PERMISSION_MAP = {
  view: [VERIFICATION_PERMISSION_CODES.read],
  viewEvidence: [VERIFICATION_PERMISSION_CODES.read],
  submit: [VERIFICATION_PERMISSION_CODES.submit],

  approveRequest: [VERIFICATION_PERMISSION_CODES.review],
  rejectRequest: [VERIFICATION_PERMISSION_CODES.review],
  cancelRequest: [VERIFICATION_PERMISSION_CODES.review],

  grantMember: [VERIFICATION_PERMISSION_CODES.grantMember],
  grantDriver: [VERIFICATION_PERMISSION_CODES.grantDriver],

  rejectVerification: [VERIFICATION_PERMISSION_CODES.manage],
  reopen: [VERIFICATION_PERMISSION_CODES.manage],
  expire: [VERIFICATION_PERMISSION_CODES.manage],
  revoke: [VERIFICATION_PERMISSION_CODES.manage],
} as const satisfies Record<
  string,
  readonly VerificationPermissionCode[]
>;

export type VerificationPermissionKey =
  keyof typeof VERIFICATION_PERMISSION_MAP;

export function getVerificationPermissionCodes(
  key: VerificationPermissionKey,
): readonly VerificationPermissionCode[] {
  return VERIFICATION_PERMISSION_MAP[key];
}

/**
 * Returns the frontend permission associated with an aggregate action.
 */
export function getVerificationActionPermission(
  action: VerificationAction,
): VerificationPermissionCode {
  switch (action) {
    case "grant-member":
      return VERIFICATION_PERMISSION_CODES.grantMember;

    case "grant-driver":
      return VERIFICATION_PERMISSION_CODES.grantDriver;

    case "reject":
    case "reopen":
    case "expire":
    case "revoke":
      return VERIFICATION_PERMISSION_CODES.manage;
  }
}

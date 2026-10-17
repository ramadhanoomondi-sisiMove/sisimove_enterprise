
import type {
  VerificationAction,
} from "../types/verification-action.types";

/**
 * Canonical verification permissions seeded by the backend.
 *
 * Permission code format: resource:action
 */
export const VERIFICATION_PERMISSION_CODES = {
  read: "verification:read",
  submit: "verification:submit",
  review: "verification:review",
  manage: "verification:manage",
} as const;

export type VerificationPermissionCode =
  (typeof VERIFICATION_PERMISSION_CODES)[keyof typeof VERIFICATION_PERMISSION_CODES];

/**
 * Maps UI capabilities to the backend permission codes.
 *
 * This map is a UI capability guide, not an authorization boundary.
 * The backend must enforce permission checks independently.
 */
export const VERIFICATION_PERMISSION_MAP = {
  view: [VERIFICATION_PERMISSION_CODES.read],
  viewEvidence: [VERIFICATION_PERMISSION_CODES.read],
  submit: [VERIFICATION_PERMISSION_CODES.submit],

  approveRequest: [VERIFICATION_PERMISSION_CODES.review],
  rejectRequest: [VERIFICATION_PERMISSION_CODES.review],
  cancelRequest: [VERIFICATION_PERMISSION_CODES.review],

  grantMember: [VERIFICATION_PERMISSION_CODES.manage],
  grantDriver: [VERIFICATION_PERMISSION_CODES.manage],
  rejectVerification: [VERIFICATION_PERMISSION_CODES.manage],
  reopen: [VERIFICATION_PERMISSION_CODES.manage],
  expire: [VERIFICATION_PERMISSION_CODES.manage],
  revoke: [VERIFICATION_PERMISSION_CODES.manage],
} as const satisfies Record<string, readonly VerificationPermissionCode[]>;

export type VerificationPermissionKey =
  keyof typeof VERIFICATION_PERMISSION_MAP;

export function getVerificationPermissionCodes(
  key: VerificationPermissionKey,
): readonly VerificationPermissionCode[] {
  return VERIFICATION_PERMISSION_MAP[key];
}

/**
 * Describes the permission category required for an aggregate action.
 */
export function getVerificationActionPermission(
  action: VerificationAction,
): VerificationPermissionCode {
  switch (action) {
    case "grant-member":
    case "grant-driver":
    case "reject":
    case "reopen":
    case "expire":
    case "revoke":
      return VERIFICATION_PERMISSION_CODES.manage;
  }
}

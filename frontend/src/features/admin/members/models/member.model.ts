
/**
 * sisiMove — Admin Member Model
 *
 * Frontend representation of an Identity response.
 *
 * Based on the confirmed IdentityResponseMapper contract.
 *
 * Domain boundaries:
 * - Identity owns account identity and lifecycle.
 * - Role owns role definitions.
 * - Identity role assignments connect identities to roles.
 * - Verification, Trust, Profile and Authentication remain separate domains.
 *
 * This is a frontend model, not a backend domain entity.
 * Dates are strings because backend Date values are serialized to JSON.
 */

import {
  isMemberStatus,
  type MemberStatus,
} from "./member-status.model";
import type { MemberRoleAssignment } from "./member-roles.model";

/**
 * Core member identity returned by the Identity API.
 */
export interface MemberIdentity {
  publicId: string;

  email: string;
  phoneNumber: string;

  status: MemberStatus;

  roles: MemberRoleAssignment[];

  createdAt: string;
  updatedAt: string;

  activatedAt?: string;
  suspendedAt?: string;
  closedAt?: string;
}

/**
 * Validates a member status received at an API boundary.
 */
export function isMemberIdentityStatus(
  value: unknown,
): value is MemberStatus {
  return isMemberStatus(value);
}

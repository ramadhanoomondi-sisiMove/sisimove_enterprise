
/**
 * sisiMove — Admin Member Detail Model
 *
 * Defines the combined frontend representation used by the administrative
 * member detail screen.
 *
 * Architectural boundaries:
 * - Identity owns the member account and lifecycle.
 * - Profile owns Traveller Profile information.
 * - Verification owns verification records and review state.
 * - Trust owns trust assessments, ratings, reviews, badges and trust events.
 * - Security owns supported account-security information.
 * - Roles owns role definitions and member role assignments.
 * - Journeys owns journey records associated with the member/provider.
 * - Bookings owns booking records associated with the member/passenger.
 * - Activity owns the member activity history projection.
 *
 * This model composes domain-specific frontend models. It is not a backend
 * aggregate and does not imply that one endpoint returns every section.
 *
 * Missing sections represent data that has not been loaded or is unavailable.
 * They must not be interpreted as proof that a member has no related records.
 */

import type { MemberIdentity } from "./member.model";
import type { MemberVerification } from "./member-verification.model";
import type { MemberProfile } from "./member-profile.model";
import type { MemberTrustProfile } from "./member-trust.model";
import type { MemberSecurityOverview } from "./member-security.model";
import type { MemberRolesOverview } from "./member-roles.model";
import type { MemberActivitySummary } from "./member-activity.model";

/**
 * Combined member detail view for administrative screens.
 *
 * Each section remains owned by its corresponding model.
 */
export interface MemberDetail {
  /** Core identity and lifecycle information. */
  member: MemberIdentity;

  /** Traveller Profile information, when loaded and available. */
  profile?: MemberProfile | null;

  /** Verification information, when loaded and available. */
  verification?: MemberVerification | null;

  /** Trust information, when loaded and available. */
  trust?: MemberTrustProfile | null;

  /** Supported account-security information, when loaded. */
  security?: MemberSecurityOverview | null;

  /** Role definitions and assignments, when loaded. */
  roles?: MemberRolesOverview | null;

  /**
   * Journey API records associated with this member/provider.
   * The backend response contract is not yet confirmed.
   */
  journeys?: unknown[] | null;

  /**
   * Booking API records associated with this member/passenger.
   * The booking endpoint returns booking records independently of Identity.
   */
  bookings?: unknown[] | null;

  /** Activity history summary, when loaded and available. */
  activity?: MemberActivitySummary | null;
}

/**
 * Indicates which detail sections have been loaded.
 *
 * This supports independently loading sections without treating an unloaded
 * section as an empty result.
 */
export type MemberDetailSection =
  | "member"
  | "profile"
  | "verification"
  | "trust"
  | "security"
  | "roles"
  | "journeys"
  | "bookings"
  | "activity";

export interface MemberDetailLoadState {
  loadedSections: MemberDetailSection[];
  failedSections: MemberDetailSection[];
}

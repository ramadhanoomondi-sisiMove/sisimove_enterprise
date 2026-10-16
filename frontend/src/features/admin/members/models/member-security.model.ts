
/**
 * sisiMove — Admin Member Security Model
 *
 * Frontend representation of security-related information available to
 * Members Management.
 *
 * This model distinguishes account lifecycle information from authentication
 * security information.
 *
 * Important:
 * - Identity status is not the same as authentication status.
 * - Account suspension does not prove that all sessions have been revoked.
 * - Missing security data must not be interpreted as a secure account.
 * - This model does not grant permissions or establish authorization.
 */

/**
 * Identity lifecycle information relevant to an administrative security view.
 *
 * These fields originate from the Identity response contract.
 */
export interface MemberSecurityIdentityStatus {
  identityPublicId: string;

  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "CLOSED";

  activatedAt?: string;
  suspendedAt?: string;
  closedAt?: string;

  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication security information.
 *
 * Populate only fields backed by confirmed Authentication API responses.
 * The initial contract intentionally contains no invented session, login,
 * lockout, or multifactor-authentication fields.
 */
export interface MemberAuthenticationSecurity {
  identityPublicId: string;

  /**
   * Indicates whether the corresponding security information has been
   * retrieved successfully. It does not indicate that the account is secure.
   */
  dataAvailable: boolean;
}

/**
 * Combined security section for the administrative member detail view.
 */
export interface MemberSecurityOverview {
  identity: MemberSecurityIdentityStatus;
  authentication?: MemberAuthenticationSecurity;
}

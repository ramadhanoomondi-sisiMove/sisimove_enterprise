import { authenticatedApiClient } from "../../../authentication/http/authenticated-api-client";

/**
 * Transport representation of AuthenticationResponse.
 * Date fields are ISO-8601 strings after JSON serialization.
 * Credential material such as passwordHash is never part of this contract.
 */
export interface MemberAuthenticationResponse {
  publicId: string;
  identityPublicId: string;
  status: string;
  passwordVersion: number;
  passwordChangedAt?: string;
  passwordMustChange: boolean;
  failedAuthenticationCount: number;
  lastFailedAuthenticationAt?: string;
  lockReason?: string;
  lockedAt?: string;
  lockedUntil?: string;
  lastAuthenticatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LockMemberAuthenticationRequest {
  /** ISO-8601 timestamp for when the lock takes effect. */
  lockedAt: string;
  /** Optional ISO-8601 timestamp for a temporary lock expiry. */
  lockedUntil?: string;
  /** Optional reason recorded by the backend. */
  reason?: string;
}

export interface DisableMemberAuthenticationRequest {
  reason?: string;
}

/**
 * API adapter for the Authentication aggregate.
 *
 * Uses only routes confirmed in AuthenticationsController. Administrative
 * actions still require the matching backend permissions and server-side
 * authorization. Password changes and manual failure recording are omitted
 * from this first adapter to avoid exposing higher-risk operations by default.
 */
export const memberAuthenticationApi = {
  /** Reads the authentication record associated with a specific identity. */
  async getByIdentityPublicId(
    identityPublicId: string,
  ): Promise<MemberAuthenticationResponse | null> {
    return authenticatedApiClient.get<MemberAuthenticationResponse | null>(
      `/authentications/identity/${encodeURIComponent(identityPublicId)}`,
    );
  },

  /** Reads an authentication record by its own public ID. */
  async getByPublicId(
    authenticationPublicId: string,
  ): Promise<MemberAuthenticationResponse | null> {
    return authenticatedApiClient.get<MemberAuthenticationResponse | null>(
      `/authentications/${encodeURIComponent(authenticationPublicId)}`,
    );
  },

  /** Locks authentication; requires authentication:lock. */
  async lock(
    authenticationPublicId: string,
    request: LockMemberAuthenticationRequest,
  ): Promise<MemberAuthenticationResponse> {
    return authenticatedApiClient.patch<MemberAuthenticationResponse>(
      `/authentications/${encodeURIComponent(authenticationPublicId)}/lock`,
      request,
    );
  },

  /** Unlocks authentication; requires authentication:unlock. */
  async unlock(
    authenticationPublicId: string,
  ): Promise<MemberAuthenticationResponse> {
    return authenticatedApiClient.patch<MemberAuthenticationResponse>(
      `/authentications/${encodeURIComponent(authenticationPublicId)}/unlock`,
    );
  },

  /** Disables authentication; requires authentication:disable. */
  async disable(
    authenticationPublicId: string,
    request: DisableMemberAuthenticationRequest = {},
  ): Promise<MemberAuthenticationResponse> {
    return authenticatedApiClient.patch<MemberAuthenticationResponse>(
      `/authentications/${encodeURIComponent(authenticationPublicId)}/disable`,
      request,
    );
  },
};

export default memberAuthenticationApi;

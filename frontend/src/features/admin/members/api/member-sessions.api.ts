import { authenticatedApiClient } from "../../../authentication/http/authenticated-api-client";

/**
 * Transport representation of SessionResponse.
 *
 * Dates are strings because the API serializes Date values as ISO-8601 JSON.
 * This DTO deliberately excludes refresh-token material.
 */
export interface MemberSessionResponse {
  publicId: string;
  identityPublicId: string;
  devicePublicId?: string;
  status: string;
  tokenFamilyPublicId: string;
  replacedBySessionPublicId?: string;
  ipAddress?: string;
  userAgent?: string;
  countryCode?: string;
  city?: string;
  authenticatedAt: string;
  lastActivityAt: string;
  expiresAt: string;
  revokedAt?: string;
  revokedReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type SessionRevocationReason =
  | "USER_LOGOUT"
  | "PASSWORD_CHANGED"
  | "PASSWORD_RESET"
  | "ACCOUNT_LOCKED"
  | "ACCOUNT_DISABLED"
  | "DEVICE_REVOKED"
  | "TOKEN_REUSE"
  | "SESSION_EXPIRED"
  | "SYSTEM";

export interface RevokeMemberSessionRequest {
  revokedAt: string;
  reason: SessionRevocationReason;
  causationId?: string;
}

export interface ExpireMemberSessionRequest {
  referenceDate: string;
  causationId?: string;
}

/**
 * API adapter for session security information belonging to a member.
 *
 * Backend routes used here are defined by SessionsController.
 * The identity-scoped list uses GET /sessions?identityPublicId=...;
 * GET /sessions/active is intentionally not used because it returns sessions
 * for the currently authenticated identity, not an arbitrary target member.
 */
export const memberSessionsApi = {
  async listForIdentity(
    identityPublicId: string,
  ): Promise<MemberSessionResponse[]> {
    const query = new URLSearchParams({ identityPublicId });
    return authenticatedApiClient.get<MemberSessionResponse[]>(
      `/sessions?${query.toString()}`,
    );
  },

  async getByPublicId(
    sessionPublicId: string,
  ): Promise<MemberSessionResponse | null> {
    return authenticatedApiClient.get<MemberSessionResponse | null>(
      `/sessions/${encodeURIComponent(sessionPublicId)}`,
    );
  },

  async revoke(
    sessionPublicId: string,
    request: RevokeMemberSessionRequest,
  ): Promise<MemberSessionResponse> {
    return authenticatedApiClient.patch<MemberSessionResponse>(
      `/sessions/${encodeURIComponent(sessionPublicId)}/revoke`,
      request,
    );
  },

  async expire(
    sessionPublicId: string,
    request: ExpireMemberSessionRequest,
  ): Promise<MemberSessionResponse> {
    return authenticatedApiClient.patch<MemberSessionResponse>(
      `/sessions/${encodeURIComponent(sessionPublicId)}/expire`,
      request,
    );
  },
};

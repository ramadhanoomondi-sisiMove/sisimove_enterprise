/**
 * sisiMove — Admin Member Identity API
 *
 * Protected API adapter for reading and managing the Identity-owned portion
 * of a member account.
 *
 * Architectural boundary:
 *
 *   Member Identity API
 *          │
 *          ▼
 *   authenticatedApiClient
 *          │
 *          ▼
 *   Identity REST Controller
 *
 * This adapter only calls confirmed Identity endpoints. It does not perform
 * authorization checks, map wire responses, or access session storage.
 */

import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";

import type { IdentityResponseDto } from "@/features/admin/members/types/member-api.types";


const IDENTITIES_ENDPOINT = "/identities";

/**
 * Request body accepted by PATCH /identities/:identityPublicId/email.
 */
export interface ChangeMemberEmailRequestDto {
  email: string;
}

/**
 * Request body accepted by
 * PATCH /identities/:identityPublicId/phone-number.
 */
export interface ChangeMemberPhoneNumberRequestDto {
  phoneNumber: string;
}

/**
 * API adapter for the Identity resource belonging to a member.
 */
export class MemberIdentityApi {
  /**
   * Retrieve an Identity by its public identifier.
   *
   * Requires the backend permission and target-identity scope enforced by
   * the Identity controller.
   */
  public async getByPublicId(
    identityPublicId: string,
  ): Promise<IdentityResponseDto> {
    return authenticatedApiClient.get<IdentityResponseDto>(
      `${IDENTITIES_ENDPOINT}/${encodeURIComponent(identityPublicId)}`,
    );
  }

  /**
   * Activate an Identity.
   *
   * The backend enforces identity:activate and lifecycle rules.
   */
  public async activate(
    identityPublicId: string,
  ): Promise<IdentityResponseDto> {
    return authenticatedApiClient.patch<IdentityResponseDto>(
      `${IDENTITIES_ENDPOINT}/${encodeURIComponent(identityPublicId)}/activate`,
    );
  }

  /**
   * Suspend an Identity.
   *
   * The backend enforces identity:suspend and lifecycle rules.
   */
  public async suspend(
    identityPublicId: string,
  ): Promise<IdentityResponseDto> {
    return authenticatedApiClient.patch<IdentityResponseDto>(
      `${IDENTITIES_ENDPOINT}/${encodeURIComponent(identityPublicId)}/suspend`,
    );
  }

  /**
   * Close an Identity.
   *
   * CLOSED is terminal. The backend enforces identity:close and lifecycle
   * rules.
   */
  public async close(
    identityPublicId: string,
  ): Promise<IdentityResponseDto> {
    return authenticatedApiClient.patch<IdentityResponseDto>(
      `${IDENTITIES_ENDPOINT}/${encodeURIComponent(identityPublicId)}/close`,
    );
  }

  /**
   * Change the email address on an Identity.
   *
   * The backend enforces identity:change-email and its domain invariants.
   */
  public async changeEmail(
    identityPublicId: string,
    body: ChangeMemberEmailRequestDto,
  ): Promise<IdentityResponseDto> {
    return authenticatedApiClient.patch<IdentityResponseDto>(
      `${IDENTITIES_ENDPOINT}/${encodeURIComponent(identityPublicId)}/email`,
      body,
    );
  }

  /**
   * Change the phone number on an Identity.
   *
   * The backend enforces identity:change-phone-number and its domain
   * invariants.
   */
  public async changePhoneNumber(
    identityPublicId: string,
    body: ChangeMemberPhoneNumberRequestDto,
  ): Promise<IdentityResponseDto> {
    return authenticatedApiClient.patch<IdentityResponseDto>(
      `${IDENTITIES_ENDPOINT}/${encodeURIComponent(identityPublicId)}/phone-number`,
      body,
    );
  }
}

/**
 * Shared Member Identity API adapter.
 */
export const memberIdentityApi = new MemberIdentityApi();

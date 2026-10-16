/**
 * sisiMove — Admin Members API
 *
 * Protected API adapter for the administrative Identity directory.
 *
 * Architectural boundary:
 *
 *   Admin Members Feature
 *          │
 *          ▼
 *   MembersApi
 *          │
 *          ▼
 *   authenticatedApiClient
 *          │
 *          ▼
 *   GET /identities
 *
 * This adapter handles HTTP transport only. It does not:
 *
 * - access auth session storage directly;
 * - map wire responses into frontend domain models;
 * - manage query/cache state;
 * - make authorization decisions;
 * - call endpoints owned by Profile, Trust, Verification or other contexts.
 */

import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";

import type {
  IdentityResponseDto,
  MemberDirectoryQueryDto,
  MemberDirectoryResponseDto,
} from "@/features/admin/members/types/member-api.types";

/**
 * API base path for the Identity directory.
 *
 * The Identity controller is mounted at /identities.
 */
const IDENTITIES_ENDPOINT = "/identities";

/**
 * Build a query string from supported directory filters.
 *
 * Undefined, null, and blank string values are omitted so optional filters
 * are not sent as empty query parameters.
 */
function buildDirectoryQueryString(
  query: MemberDirectoryQueryDto = {},
): string {
  const params = new URLSearchParams();

  if (query.page !== undefined) {
    params.set("page", String(query.page));
  }

  if (query.pageSize !== undefined) {
    params.set("pageSize", String(query.pageSize));
  }

  if (query.sortBy !== undefined) {
    params.set("sortBy", query.sortBy);
  }

  if (query.sortDirection !== undefined) {
    params.set("sortDirection", query.sortDirection);
  }

  const optionalParams: Array<[string, string | undefined]> = [
    ["search", query.search],
    ["status", query.status],
    ["rolePublicId", query.rolePublicId],
    ["createdFrom", query.createdFrom],
    ["createdTo", query.createdTo],
  ];

  for (const [key, value] of optionalParams) {
    const normalized = value?.trim();

    if (normalized) {
      params.set(key, normalized);
    }
  }

  const queryString = params.toString();

  return queryString.length > 0 ? `?${queryString}` : "";
}

/**
 * Protected API adapter for listing identities in the admin directory.
 *
 * This assumes the backend directory endpoint and response envelope have
 * been implemented as described by the Identity directory contract.
 */
export class MembersApi {
  /**
   * Retrieve one page of the administrative identity directory.
   */
  public async list(
    query: MemberDirectoryQueryDto = {},
  ): Promise<MemberDirectoryResponseDto> {
    const queryString = buildDirectoryQueryString(query);

    return authenticatedApiClient.get<MemberDirectoryResponseDto>(
      `${IDENTITIES_ENDPOINT}${queryString}`,
    );
  }

  /**
   * Retrieve the total number of identities.
   *
   * The current backend contract returns a numeric count from GET
   * /identities/count.
   */
  public async count(): Promise<number> {
    return authenticatedApiClient.get<number>(
      `${IDENTITIES_ENDPOINT}/count`,
    );
  }
}

/**
 * Shared Members API adapter.
 */
export const membersApi = new MembersApi();

/**
 * Export the wire identity type for consumers that need to refer to the
 * directory row's underlying Identity response.
 */
export type { IdentityResponseDto };

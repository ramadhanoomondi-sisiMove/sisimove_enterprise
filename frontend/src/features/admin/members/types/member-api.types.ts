/**
 * sisiMove — Admin Member API Types
 *
 * Frontend wire types for Identity API requests and responses.
 *
 * Identity response fields are based on IdentityResponseMapper and
 * IdentityRoleResponse. The directory query and paginated response correspond
 * to the GET /identities directory endpoint and GetIdentitiesQueryDto.
 */

/**
 * Wire response for an Identity role assignment.
 *
 * Based on IdentityRoleResponse.
 * Dates are strings after JSON serialization.
 */
export interface IdentityRoleResponseDto {
  publicId: string;
  identityPublicId: string;
  rolePublicId: string;

  assignedByPublicId?: string;
  assignedAt: string;
  expiresAt?: string;

  revokedAt?: string;
  revokedByPublicId?: string;

  createdAt: string;
  updatedAt: string;
}

/**
 * Wire response for an Identity.
 *
 * The backend mapper exposes status as a string. Validate it before mapping
 * into the stricter frontend MemberStatus union.
 */
export interface IdentityResponseDto {
  publicId: string;

  email: string;
  phoneNumber: string;

  status: string;

  activatedAt?: string;
  suspendedAt?: string;
  closedAt?: string;

  roles: IdentityRoleResponseDto[];

  createdAt: string;
  updatedAt: string;
}

/**
 * Request body for creating an identity.
 *
 * Confirm the exact registration DTO before using this type for an
 * administrative create-member workflow.
 */
export interface CreateIdentityRequestDto {
  email: string;
  phoneNumber: string;
}

/**
 * Query parameters accepted by GET /identities.
 *
 * The server DTO defaults page to 1, pageSize to 20, sortBy to createdAt,
 * and sortDirection to desc. Callers may omit those values to use the defaults.
 */
export interface MemberDirectoryQueryDto {
  page?: number;
  pageSize?: number;

  sortBy?: "createdAt" | "updatedAt" | "email" | "status";
  sortDirection?: "asc" | "desc";

  search?: string;
  status?: "PENDING" | "ACTIVE" | "SUSPENDED" | "CLOSED";
  rolePublicId?: string;
  createdFrom?: string;
  createdTo?: string;
}

/**
 * Paginated response from GET /identities.
 */
export interface MemberDirectoryResponseDto {
  items: IdentityResponseDto[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

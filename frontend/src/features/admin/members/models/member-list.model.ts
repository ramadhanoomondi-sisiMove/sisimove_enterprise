
/**
 * sisiMove — Admin Member List Model
 *
 * Defines the frontend contract for the administrative member directory.
 *
 * The current Identity controller does not expose GET /identities.
 * This model describes the intended directory capability; it does not claim
 * that the backend already implements the endpoint or response envelope.
 *
 * Dates are strings because backend Date values are serialized to JSON.
 */

import type { MemberStatus } from "./member-status.model";

/**
 * Compact role information displayed in directory rows.
 *
 * The Identity response contains role assignments, not role names.
 * The directory API may enrich assignments using Role definitions.
 */
export interface MemberListRole {
  publicId: string;
  code: string;
  name: string;
}

/**
 * One row in the administrative member directory.
 */
export interface MemberListItem {
  publicId: string;
  email: string;
  phoneNumber: string;
  status: MemberStatus;

  roles: MemberListRole[];

  createdAt: string;
  updatedAt: string;

  activatedAt?: string;
  suspendedAt?: string;
  closedAt?: string;
}

/**
 * Supported directory sort fields.
 *
 * The backend must validate which fields are actually sortable.
 */
export const MEMBER_LIST_SORT_FIELDS = [
  "createdAt",
  "updatedAt",
  "email",
  "status",
] as const;

export type MemberListSortField =
  (typeof MEMBER_LIST_SORT_FIELDS)[number];

export type MemberListSortDirection = "asc" | "desc";

/**
 * Optional member directory filters.
 */
export interface MemberListFilters {
  /**
   * Intended search across email, phone number and public ID.
   * Actual searchable fields must be implemented by the backend.
   */
  search?: string;

  status?: MemberStatus;

  /** Filter members by an assigned role. */
  rolePublicId?: string;

  /** Inclusive creation-date boundaries, represented as ISO date strings. */
  createdFrom?: string;
  createdTo?: string;
}

/**
 * Directory query state.
 *
 * Page numbering is one-based. The backend should enforce a maximum page size.
 */
export interface MemberListQuery {
  page: number;
  pageSize: number;

  sortBy: MemberListSortField;
  sortDirection: MemberListSortDirection;

  filters: MemberListFilters;
}

/**
 * Initial directory query.
 */
export const DEFAULT_MEMBER_LIST_QUERY: MemberListQuery = {
  page: 1,
  pageSize: 25,
  sortBy: "createdAt",
  sortDirection: "desc",
  filters: {},
};

/**
 * Desired paginated response from the future directory endpoint.
 *
 * This is a proposed frontend contract, not a confirmed backend DTO.
 */
export interface MemberListResponse {
  items: MemberListItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

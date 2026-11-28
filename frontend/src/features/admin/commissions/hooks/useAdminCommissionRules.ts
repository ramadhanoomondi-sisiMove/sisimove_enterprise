
/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Commission Rules Query Hook
 * -----------------------------------------------------------------------------
 *
 * Responsibilities:
 * - Fetch commission rules through the authenticated API.
 * - Filter rules by search, commission type and lifecycle status.
 * - Sort rules using explicit sorting options.
 * - Paginate the filtered results.
 *
 * Architecture:
 * - API access remains in the API layer.
 * - Filtering, sorting and pagination are client-side.
 * - TanStack Query manages server data and caching.
 * - Query keys are shared with useAdminCommissionRule.
 * -----------------------------------------------------------------------------
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { adminCommissionsApi } from '../api';

import type {
  AdminCommissionRuleModel,
  AdminCommissionType,
  AdminCommissionRuleStatus,
} from '../models';

// -----------------------------------------------------------------------------
// Filter Types
// -----------------------------------------------------------------------------

export interface AdminCommissionRuleFilters {
  search?: string;
  type?: AdminCommissionType;
  status?: AdminCommissionRuleStatus;
}

// -----------------------------------------------------------------------------
// Pagination And Sorting Types
// -----------------------------------------------------------------------------

export interface AdminCommissionRulePagination {
  page?: number;
  pageSize?: number;
}

export type AdminCommissionRuleSortBy =
  | 'type'
  | 'percentage'
  | 'status'
  | 'effectiveFrom'
  | 'effectiveTo'
  | 'version'
  | 'createdAt'
  | 'updatedAt';

export type AdminCommissionRuleSortDirection = 'asc' | 'desc';

export interface AdminCommissionRuleSort {
  sortBy?: AdminCommissionRuleSortBy;
  sortDirection?: AdminCommissionRuleSortDirection;
}

// -----------------------------------------------------------------------------
// Query Keys
// -----------------------------------------------------------------------------

export const adminCommissionRuleKeys = {
  all: ['admin', 'commission-rules'] as const,

  lists: () =>
    [...adminCommissionRuleKeys.all, 'list'] as const,

  list: () =>
    [...adminCommissionRuleKeys.lists(), 'all'] as const,

  details: () =>
    [...adminCommissionRuleKeys.all, 'detail'] as const,

  detail: (publicId: string) =>
    [
      ...adminCommissionRuleKeys.details(),
      publicId.trim(),
    ] as const,

  active: (type: AdminCommissionType) =>
    [
      ...adminCommissionRuleKeys.all,
      'active',
      type,
    ] as const,

  byType: (type: AdminCommissionType) =>
    [
      ...adminCommissionRuleKeys.all,
      'type',
      type,
    ] as const,
};

// -----------------------------------------------------------------------------
// Date Helpers
// -----------------------------------------------------------------------------

function toTimestamp(value: unknown): number {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const timestamp = new Date(value).getTime();

    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  return 0;
}

// -----------------------------------------------------------------------------
// Filtering And Sorting
// -----------------------------------------------------------------------------

export function filterAdminCommissionRules(
  rules: AdminCommissionRuleModel[],
  filters: AdminCommissionRuleFilters,
  sort: AdminCommissionRuleSort = {},
): AdminCommissionRuleModel[] {
  const search = filters.search?.trim().toLowerCase() ?? '';

  const filtered = rules.filter((rule) => {
    // -------------------------------------------------------------------------
    // Search
    // -------------------------------------------------------------------------

    if (search) {
      const searchableValues = [
        rule.publicId,
        rule.type,
        rule.status,
        rule.percentage,
        String(rule.version),
      ];

      const matchesSearch = searchableValues.some((value) =>
        value.toLowerCase().includes(search),
      );

      if (!matchesSearch) {
        return false;
      }
    }

    // -------------------------------------------------------------------------
    // Commission Type
    // -------------------------------------------------------------------------

    if (
      filters.type !== undefined &&
      rule.type !== filters.type
    ) {
      return false;
    }

    // -------------------------------------------------------------------------
    // Lifecycle Status
    // -------------------------------------------------------------------------

    if (
      filters.status !== undefined &&
      rule.status !== filters.status
    ) {
      return false;
    }

    return true;
  });

  // ---------------------------------------------------------------------------
  // Sorting
  // ---------------------------------------------------------------------------

  const sortBy = sort.sortBy ?? 'createdAt';
  const direction = sort.sortDirection === 'asc' ? 1 : -1;

  return [...filtered].sort((a, b) => {
    if (
      sortBy === 'effectiveFrom' ||
      sortBy === 'effectiveTo' ||
      sortBy === 'createdAt' ||
      sortBy === 'updatedAt'
    ) {
      return (
        (toTimestamp(a[sortBy]) - toTimestamp(b[sortBy])) *
        direction
      );
    }

    if (sortBy === 'percentage') {
      return (
        (Number(a.percentage) - Number(b.percentage)) *
        direction
      );
    }

    if (sortBy === 'version') {
      return (a.version - b.version) * direction;
    }

    return a[sortBy].localeCompare(b[sortBy]) * direction;
  });
}

// -----------------------------------------------------------------------------
// Query Hook
// -----------------------------------------------------------------------------

export function useAdminCommissionRules(
  filters: AdminCommissionRuleFilters = {},
  pagination: AdminCommissionRulePagination = {},
  sort: AdminCommissionRuleSort = {},
) {
  const query = useQuery({
    queryKey: adminCommissionRuleKeys.list(),
    queryFn: () => adminCommissionsApi.listCommissionRules(),
  });

  const allRules = useMemo<AdminCommissionRuleModel[]>(
    () => query.data ?? [],
    [query.data],
  );

  const filteredRules = useMemo(
    () =>
      filterAdminCommissionRules(
        allRules,
        filters,
        sort,
      ),
    [allRules, filters, sort],
  );

  // ---------------------------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------------------------

  const pageSize = Math.max(
    1,
    Math.floor(pagination.pageSize ?? 20),
  );

  const totalFiltered = filteredRules.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalFiltered / pageSize),
  );

  const currentPage = Math.min(
    Math.max(1, Math.floor(pagination.page ?? 1)),
    totalPages,
  );

  const start = (currentPage - 1) * pageSize;

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    rules: filteredRules.slice(
      start,
      start + pageSize,
    ),

    allRules,
    filteredRules,

    totalFiltered,
    totalPages,
    currentPage,
    pageSize,

    query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

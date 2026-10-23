/**
 * sisiMove — Admin Boarding Filters Hook
 *
 * Path:
 * src/features/admin/boardings/hooks/useAdminBoardingFilters.ts
 *
 * Responsibilities:
 * - Manage boarding list search.
 * - Filter by boarding status.
 * - Filter by provider public ID.
 * - Return filtered boarding records.
 */

import { useMemo, useState } from 'react';

import type { AdminBoarding } from '../models';

import { AdminBoardingStatus } from '../models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface AdminBoardingFilterValues {
  search: string;
  status: AdminBoardingStatus | 'ALL';
  providerPublicId: string;
}

export interface UseAdminBoardingFiltersOptions {
  boardings: AdminBoarding[];
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useAdminBoardingFilters({
  boardings,
}: UseAdminBoardingFiltersOptions) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<
    AdminBoardingStatus | 'ALL'
  >('ALL');
  const [providerPublicId, setProviderPublicId] = useState('');

  const filteredBoardings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const normalizedProviderId = providerPublicId
      .trim()
      .toLowerCase();

    return boardings.filter((boarding) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        boarding.publicId.toLowerCase().includes(normalizedSearch) ||
        boarding.journeyId.toLowerCase().includes(normalizedSearch) ||
        boarding.providerPublicId
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        status === 'ALL' || boarding.status === status;

      const matchesProvider =
        normalizedProviderId.length === 0 ||
        boarding.providerPublicId
          .toLowerCase()
          .includes(normalizedProviderId);

      return matchesSearch && matchesStatus && matchesProvider;
    });
  }, [boardings, search, status, providerPublicId]);

  const resetFilters = () => {
    setSearch('');
    setStatus('ALL');
    setProviderPublicId('');
  };

  return {
    search,
    setSearch,
    status,
    setStatus,
    providerPublicId,
    setProviderPublicId,
    filteredBoardings,
    resetFilters,
    hasActiveFilters:
      search.trim().length > 0 ||
      status !== 'ALL' ||
      providerPublicId.trim().length > 0,
  };
}
 
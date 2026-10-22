'use client';

/**
 * sisiMove — Trust Profiles Directory Page
 *
 * Responsibilities:
 * - Load paginated Trust profile summaries.
 * - Filter the currently loaded page by search, status, and verification.
 * - Display server-provided pagination metadata.
 * - Handle loading, errors, retries, and profile navigation.
 *
 * Important:
 * - Filtering is client-side and applies only to the current page.
 * - Platform-wide filtered totals require API support that this page
 *   does not currently have.
 * - Profile navigation uses the Trust profile public ID.
 */

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  TrustControlCenterHeader,
  TrustPageContainer,
  TrustProfileDirectory,
  type TrustProfileFiltersValue,
} from '@/components/admin/trust';

import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';
import { useTrustProfilesPage } from '@/features/admin/trust/queries/trust.queries';

const DEFAULT_PAGE_SIZE = 20;

const DEFAULT_FILTERS: TrustProfileFiltersValue = {
  search: '',
  status: 'all',
  verification: 'all',
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return 'The trust profile directory could not be loaded. Please try again.';
}

export default function TrustProfilesPage() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [filters, setFilters] =
    useState<TrustProfileFiltersValue>(DEFAULT_FILTERS);

  const profilesQuery = useTrustProfilesPage(page, DEFAULT_PAGE_SIZE);
  const { data: response, refetch } = profilesQuery;

  const profiles = response?.profiles ?? [];

  const filteredProfiles = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return profiles.filter((profile) => {
      const matchesSearch =
        search.length === 0 ||
        profile.publicId.toLowerCase().includes(search) ||
        profile.memberPublicId.toLowerCase().includes(search);

      const status = profile.status.toLowerCase();
      const verification = profile.verificationLevel.toLowerCase();

      const matchesStatus =
        filters.status === 'all' ||
        status === filters.status.toLowerCase();

      const matchesVerification =
        filters.verification === 'all' ||
        verification === filters.verification.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesVerification
      );
    });
  }, [profiles, filters]);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const handleFiltersChange = useCallback(
    (nextFilters: TrustProfileFiltersValue) => {
      setFilters(nextFilters);
      setPage(1);
    },
    [],
  );

  const handleSelectProfile = useCallback(
    (profile: { publicId: string }) => {
      router.push(ADMIN_ROUTES.TRUST_PROFILE(profile.publicId));
    },
    [router],
  );

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const hasActiveFilters =
    filters.search.trim().length > 0 ||
    filters.status !== 'all' ||
    filters.verification !== 'all';

  const errorMessage = profilesQuery.isError
    ? getErrorMessage(profilesQuery.error)
    : undefined;

  return (
    <TrustPageContainer size="2xl" className="space-y-6 py-6">
      <TrustControlCenterHeader
        eyebrow="TRUST MANAGEMENT"
        title="Trust Profiles"
        description="Review trust profiles, verification levels, ratings, and journey performance."
        badgeLabel="Profile directory"
        badgeVariant="default"
      />

      <TrustProfileDirectory
        profiles={filteredProfiles}
        page={response?.page ?? page}
        pageSize={response?.pageSize ?? DEFAULT_PAGE_SIZE}
        total={response?.total ?? 0}
        totalPages={response?.totalPages ?? 0}
        onPageChange={handlePageChange}
        onSelectProfile={handleSelectProfile}
        onFiltersChange={handleFiltersChange}
        initialFilters={DEFAULT_FILTERS}
        isLoading={profilesQuery.isPending}
        isError={profilesQuery.isError}
        errorMessage={errorMessage}
        onRetry={handleRetry}
        disabled={profilesQuery.isFetching}
      />

      {hasActiveFilters && response && (
        <p
          className="text-sm text-[var(--foreground-muted)]"
          role="status"
          aria-live="polite"
        >
          Filters apply only to the profiles loaded on this page.{' '}
          {filteredProfiles.length} matching{' '}
          {filteredProfiles.length === 1 ? 'profile' : 'profiles'} shown.
        </p>
      )}
    </TrustPageContainer>
  );
}

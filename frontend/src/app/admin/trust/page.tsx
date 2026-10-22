/**
 * sisiMove — Trust Control Center Page
 *
 * Displays the Trust overview and a filterable profile snapshot.
 * Filters apply to the currently loaded page of profile summaries.
 *
 * Important:
 * - The current API supports pagination, not server-side filtering.
 * - Overview metrics describe the loaded page where applicable.
 * - Trust event totals are unavailable until an aggregate query exists.
 */

'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  TrustControlCenterHeader,
  TrustPageContainer,
  TrustOverviewDashboard,
  type TrustProfileFiltersValue,
} from '@/components/admin/trust';

import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';
import { useTrustProfilesPage } from '@/features/admin/trust/queries/trust.queries';

const DEFAULT_FILTERS: TrustProfileFiltersValue = {
  search: '',
  status: 'all',
  verification: 'all',
};

export default function TrustControlCenterPage() {
  const router = useRouter();

  const [filters, setFilters] =
    useState<TrustProfileFiltersValue>({ ...DEFAULT_FILTERS });

  const profilesQuery = useTrustProfilesPage(1, 20);
  const { data: pageData, refetch } = profilesQuery;

  const profiles = useMemo(
    () => pageData?.profiles ?? [],
    [pageData?.profiles],
  );

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleSelectProfile = useCallback(
    (publicId: string) => {
      router.push(ADMIN_ROUTES.TRUST_PROFILE(publicId));
    },
    [router],
  );

  const handleFiltersChange = useCallback(
    (nextFilters: TrustProfileFiltersValue) => {
      setFilters(nextFilters);
    },
    [],
  );

  const handleResetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
  }, []);

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
        (filters.status === 'unknown'
          ? !['active', 'inactive', 'pending', 'suspended'].includes(status)
          : status === filters.status);

      const matchesVerification =
        filters.verification === 'all' ||
        (filters.verification === 'unknown'
          ? !['verified', 'unverified', 'pending'].includes(verification)
          : filters.verification === 'unverified'
            ? verification !== 'verified' && verification !== 'pending'
            : verification === filters.verification);

      return matchesSearch && matchesStatus && matchesVerification;
    });
  }, [profiles, filters]);

  const metrics = useMemo(() => {
    if (!pageData) {
      return null;
    }

    return {
      totalProfiles: pageData.total,

      // Counts from the loaded page, not platform-wide aggregates.
      activeProfiles: profiles.filter(
        (profile) => profile.status.toLowerCase() === 'active',
      ).length,

      verifiedProfiles: profiles.filter(
        (profile) =>
          profile.verificationLevel.toLowerCase() === 'verified',
      ).length,

      // Placeholder: no aggregate event query is currently connected.
      totalTrustEvents: 0,
    };
  }, [pageData, profiles]);

  const snapshotProfiles = useMemo(
    () =>
      filteredProfiles.map((profile) => ({
        publicId: profile.publicId,
        memberPublicId: profile.memberPublicId,
        status: profile.status,
        verificationLevel: profile.verificationLevel,
        ratingAverage: profile.ratingAverage,
        ratingCount: profile.ratingCount,
        completedJourneys: profile.completedJourneys,
      })),
    [filteredProfiles],
  );

  const errorMessage = profilesQuery.isError
    ? profilesQuery.error instanceof Error
      ? profilesQuery.error.message
      : 'Unable to load Trust profiles.'
    : null;

  return (
    <TrustPageContainer size="2xl" className="space-y-6 py-6">
      <TrustControlCenterHeader
        eyebrow="ADMINISTRATION"
        title="Trust Control Center"
        description="Manage trust profiles, verification, ratings, reviews, badges, and trust events."
      />

      <TrustOverviewDashboard
        metrics={metrics}
        profiles={snapshotProfiles}
        events={[]}
        isLoading={profilesQuery.isPending}
        error={errorMessage}
        onRetry={handleRetry}
        onSelectProfile={handleSelectProfile}
        profileFilters={filters}
        onProfileFiltersChange={handleFiltersChange}
        onResetProfileFilters={handleResetFilters}
      />

      {pageData && (
        <p
          className="text-xs text-[var(--foreground-muted)]"
          role="status"
          aria-live="polite"
        >
          Showing {filteredProfiles.length} matching{' '}
          {filteredProfiles.length === 1 ? 'profile' : 'profiles'} from the{' '}
          {profiles.length} profiles loaded for this overview. Use the full
          Trust Profiles directory to browse additional pages.
        </p>
      )}
    </TrustPageContainer>
  );
}

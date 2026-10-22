/**
 * sisiMove — Individual Trust Profile Workspace
 *
 * Responsibilities:
 * - Read the Trust profile public ID from the route.
 * - Fetch the full profile and its related ratings, reviews,
 *   badge assignments, and Trust events.
 * - Keep related queries scoped to the selected Trust profile ID.
 * - Render the management workspace with independently loaded data.
 * - Handle profile loading, errors, and not-found states.
 *
 * Non-responsibilities:
 * - Fetching every Trust profile.
 * - Fetching all member journeys.
 * - Executing verification mutations directly.
 * - Bypassing backend authorization.
 */

'use client';

import { useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import {
  TrustPageContainer,
  TrustProfileManagementWorkspace,
} from '@/components/admin/trust';

import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

import {
  useTrustProfile,
  useTrustRatings,
  useTrustReviews,
  useTrustProfileBadges,
  useTrustEvents,
} from '@/features/admin/trust/queries/trust.queries';

import {
  TrustRatingModelMapper,
  TrustReviewModelMapper,
  TrustProfileBadgeModelMapper,
  TrustEventModelMapper,
} from '@/features/admin/trust/models/trust-profile.model';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return 'The Trust profile could not be loaded. Please try again.';
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function TrustProfileDetailPage() {
  const params = useParams<{ publicId: string }>();
  const router = useRouter();

  const publicId =
    typeof params.publicId === 'string' ? params.publicId.trim() : '';

  // Fetch the selected profile using its public route identifier.
  const profileQuery = useTrustProfile(publicId);
  const profile = profileQuery.data;

  // Related queries are enabled by their hooks only when profile.id exists.
  // profile.id is the internal Trust profile ID expected by these endpoints.
  const ratingsQuery = useTrustRatings(profile?.id ?? '');
  const reviewsQuery = useTrustReviews(profile?.id ?? '');
  const badgesQuery = useTrustProfileBadges(profile?.id ?? '');
  const eventsQuery = useTrustEvents(profile?.id ?? '');

  const { refetch: refetchProfile } = profileQuery;

  const handleRetry = useCallback(() => {
    void refetchProfile();
  }, [refetchProfile]);

  const handleBack = useCallback(() => {
    router.push(ADMIN_ROUTES.TRUST_PROFILES);
  }, [router]);

  if (!publicId) {
    return (
      <TrustPageContainer size="2xl" className="py-6">
        <Card variant="default" padding="lg">
          <div className="space-y-3">
            <h1 className="text-xl font-semibold text-[var(--foreground)]">
              Invalid Trust profile reference
            </h1>

            <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
              A valid profile reference is required to open this workspace.
            </p>

            <Button type="button" onClick={handleBack}>
              Back to Trust profiles
            </Button>
          </div>
        </Card>
      </TrustPageContainer>
    );
  }

  if (profileQuery.isPending) {
    return (
      <TrustPageContainer size="2xl" className="space-y-6 py-6">
        <div role="status" aria-live="polite" className="space-y-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            Loading Trust profile…
          </p>

          <Card variant="default" padding="lg">
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-48 rounded bg-[var(--background-muted)]" />
              <div className="h-4 w-72 max-w-full rounded bg-[var(--background-muted)]" />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="h-16 rounded bg-[var(--background-subtle)]" />
                <div className="h-16 rounded bg-[var(--background-subtle)]" />
              </div>
            </div>
          </Card>
        </div>
      </TrustPageContainer>
    );
  }

  if (profileQuery.isError) {
    return (
      <TrustPageContainer size="2xl" className="py-6">
        <Card variant="default" padding="lg">
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-semibold text-[var(--foreground)]">
                Unable to load Trust profile
              </h1>

              <p className="mt-2 break-words text-sm leading-6 text-[var(--foreground-secondary)]">
                {getErrorMessage(profileQuery.error)}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={handleRetry}
                disabled={profileQuery.isFetching}
              >
                {profileQuery.isFetching ? 'Retrying…' : 'Try again'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
              >
                Back to profiles
              </Button>
            </div>
          </div>
        </Card>
      </TrustPageContainer>
    );
  }

  if (!profile) {
    return (
      <TrustPageContainer size="2xl" className="py-6">
        <Card variant="default" padding="lg">
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-semibold text-[var(--foreground)]">
                Trust profile not found
              </h1>

              <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
                No Trust profile was returned for reference{' '}
                <span className="break-all font-mono">{publicId}</span>.
                The profile may not exist, or you may not have access to it.
              </p>
            </div>

            <Button type="button" onClick={handleBack}>
              Back to Trust profiles
            </Button>
          </div>
        </Card>
      </TrustPageContainer>
    );
  }

  // Use related endpoint data when available. Fall back to the collections
  // included in the full profile response while a related query is loading.
  const workspaceProfile = {
    ...profile,

    ratings: ratingsQuery.data
      ? TrustRatingModelMapper.fromApiList(ratingsQuery.data)
      : profile.ratings,

    reviews: reviewsQuery.data
      ? TrustReviewModelMapper.fromApiList(reviewsQuery.data)
      : profile.reviews,

    profileBadges: badgesQuery.data
      ? TrustProfileBadgeModelMapper.fromApiList(badgesQuery.data)
      : profile.profileBadges,

    events: eventsQuery.data
      ? TrustEventModelMapper.fromApiList(eventsQuery.data)
      : profile.events,
  };

  return (
    <TrustProfileManagementWorkspace
      profile={workspaceProfile}
      relatedData={{
        ratings: {
          isLoading: ratingsQuery.isPending,
          error: ratingsQuery.isError
            ? getErrorMessage(ratingsQuery.error)
            : null,
          onRetry: () => void ratingsQuery.refetch(),
        },
        reviews: {
          isLoading: reviewsQuery.isPending,
          error: reviewsQuery.isError
            ? getErrorMessage(reviewsQuery.error)
            : null,
          onRetry: () => void reviewsQuery.refetch(),
        },
        badges: {
          isLoading: badgesQuery.isPending,
          error: badgesQuery.isError
            ? getErrorMessage(badgesQuery.error)
            : null,
          onRetry: () => void badgesQuery.refetch(),
        },
        events: {
          isLoading: eventsQuery.isPending,
          error: eventsQuery.isError
            ? getErrorMessage(eventsQuery.error)
            : null,
          onRetry: () => void eventsQuery.refetch(),
        },
      }}
    />
  );
}

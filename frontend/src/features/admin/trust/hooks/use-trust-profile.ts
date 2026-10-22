/**
 * sisiMove — Trust Profile Hook
 *
 * Composes a Trust profile with its related ratings, reviews,
 * badge assignments, and trust events.
 */

import { useTrustProfile } from '../queries';
import {
  useTrustEvents,
  useTrustProfileBadges,
  useTrustRatings,
  useTrustReviews,
} from '../queries';

export function useTrustProfileDetail(publicId: string) {
  const profileQuery = useTrustProfile(publicId);

  const profileId = profileQuery.data?.id ?? '';

  const ratingsQuery = useTrustRatings(profileId);
  const reviewsQuery = useTrustReviews(profileId);
  const badgesQuery = useTrustProfileBadges(profileId);
  const eventsQuery = useTrustEvents(profileId);

  return {
    profile: profileQuery.data ?? null,

    ratings: ratingsQuery.data ?? [],
    reviews: reviewsQuery.data ?? [],
    badges: badgesQuery.data ?? [],
    events: eventsQuery.data ?? [],

    isLoading:
      profileQuery.isLoading ||
      ratingsQuery.isLoading ||
      reviewsQuery.isLoading ||
      badgesQuery.isLoading ||
      eventsQuery.isLoading,

    isError:
      profileQuery.isError ||
      ratingsQuery.isError ||
      reviewsQuery.isError ||
      badgesQuery.isError ||
      eventsQuery.isError,

    errors: {
      profile: profileQuery.error,
      ratings: ratingsQuery.error,
      reviews: reviewsQuery.error,
      badges: badgesQuery.error,
      events: eventsQuery.error,
    },

    refetch: profileQuery.refetch,
  };
}

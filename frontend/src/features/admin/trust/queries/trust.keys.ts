/**
 * sisiMove — Trust Query Keys
 *
 * Centralized React Query keys for Trust profiles, ratings, reviews,
 * badges, and trust events.
 */

export const trustKeys = {
  all: ['trust'] as const,

  // ---------------------------------------------------------------------------
  // Trust profiles
  // ---------------------------------------------------------------------------

  profiles: () => [...trustKeys.all, 'profiles'] as const,

  profileLists: () => [...trustKeys.profiles(), 'list'] as const,

  profilePage: (page: number, pageSize: number) =>
    [...trustKeys.profileLists(), { page, pageSize }] as const,

  profile: (publicId: string) =>
    [...trustKeys.profiles(), 'detail', publicId] as const,

  profileByMember: (memberPublicId: string) =>
    [...trustKeys.profiles(), 'member', memberPublicId] as const,

  publicProfileByMember: (memberPublicId: string) =>
    [...trustKeys.profiles(), 'public-member', memberPublicId] as const,

  // ---------------------------------------------------------------------------
  // Ratings
  // ---------------------------------------------------------------------------

  ratings: (profileId: string) =>
    [...trustKeys.profiles(), profileId, 'ratings'] as const,

  rating: (profileId: string, ratingId: string) =>
    [...trustKeys.ratings(profileId), ratingId] as const,

  // ---------------------------------------------------------------------------
  // Reviews
  // ---------------------------------------------------------------------------

  reviews: (profileId: string) =>
    [...trustKeys.profiles(), profileId, 'reviews'] as const,

  review: (profileId: string, reviewId: string) =>
    [...trustKeys.reviews(profileId), reviewId] as const,

  // ---------------------------------------------------------------------------
  // Profile badge assignments
  // ---------------------------------------------------------------------------

  profileBadges: (profileId: string) =>
    [...trustKeys.profiles(), profileId, 'badges'] as const,

  profileBadge: (profileId: string, profileBadgeId: string) =>
    [...trustKeys.profileBadges(profileId), profileBadgeId] as const,

  // ---------------------------------------------------------------------------
  // Trust events
  // ---------------------------------------------------------------------------

  events: (profileId: string) =>
    [...trustKeys.profiles(), profileId, 'events'] as const,

  // ---------------------------------------------------------------------------
  // Badge definitions
  // ---------------------------------------------------------------------------

  badges: () => [...trustKeys.all, 'badges'] as const,

  activeBadges: () => [...trustKeys.badges(), 'active'] as const,

  badge: (publicId: string) =>
    [...trustKeys.badges(), 'detail', publicId] as const,

  badgeByName: (name: string) =>
    [...trustKeys.badges(), 'name', name] as const,

  badgesByType: (type: string) =>
    [...trustKeys.badges(), 'type', type] as const,

  badgesByAsset: (assetPublicId: string) =>
    [...trustKeys.badges(), 'asset', assetPublicId] as const,
} as const;
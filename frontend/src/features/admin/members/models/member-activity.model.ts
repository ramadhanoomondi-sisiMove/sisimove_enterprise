
/**
 * sisiMove — Admin Member Activity Model
 *
 * Defines the frontend contract for member activity displayed in the
 * administrative Members Management interface.
 *
 * Trust events are one source of member-related activity. They are not a
 * substitute for a complete audit log.
 *
 * Dates are strings because backend Date values are serialized to JSON.
 */

/**
 * Activity event sourced from the Trust domain.
 *
 * Based on TrustEventResponse in:
 * trust-profile-response.mapper.ts
 */
export interface MemberTrustActivityEvent {
  id: string;
  publicId: string;

  profileId: string;
  type: string;

  journeyPublicId: string | null;
  bookingPublicId: string | null;
  ratingPublicId: string | null;
  badgePublicId: string | null;
  disputePublicId: string | null;
  actorPublicId: string | null;

  reason: string | null;
  metadata: Record<string, unknown> | null;

  createdAt: string;
}

/**
 * Generic member activity event.
 *
 * This is the intended normalized presentation contract for activity from
 * multiple domains. Populate it only when a source API supplies the relevant
 * information.
 *
 * Do not treat this interface as proof that a unified activity API exists.
 */
export interface MemberActivityEvent {
  publicId: string;
  memberPublicId: string;

  source: string;
  type: string;
  description: string;

  actorPublicId: string | null;

  occurredAt: string;

  relatedJourneyPublicId?: string | null;
  relatedBookingPublicId?: string | null;
  relatedDisputePublicId?: string | null;

  metadata?: Record<string, unknown> | null;
}

/**
 * Activity summary for the member detail screen.
 *
 * `events` contains only the events returned by the source used to populate
 * this summary. It must not imply complete historical coverage.
 */
export interface MemberActivitySummary {
  memberPublicId: string;

  events: MemberActivityEvent[];

  hasMore: boolean;
  nextCursor?: string;
}

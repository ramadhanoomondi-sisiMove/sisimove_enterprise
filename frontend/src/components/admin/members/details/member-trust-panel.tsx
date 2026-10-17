
// -----------------------------------------------------------------------------
// sisiMove — Admin Member Trust Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the actual Trust Profile aggregate.
// - Keep trust status separate from verification level.
// - Display backend-supplied rating and journey statistics.
// - Display awarded badges and trust events.
// - Handle loading, error, empty and populated states.
//
// Non-responsibilities:
// - Fetching trust profiles or trust events.
// - Calculating or inferring trust scores.
// - Inferring trust status from Identity or Verification.
// - Treating trust events as a complete audit log.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import type {
  MemberTrustProfile,
  MemberTrustEvent,
} from '@/features/admin/members/models/member-trust.model';

import {
  MemberTrustIndicator,
  type MemberTrustStatus,
} from '@/components/admin/members/primitives/member-trust-indicator';

import { MemberDataSection } from '@/components/admin/members/primitives/member-data-section';
import { Button } from '@/components/ui/button';
import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MemberTrustPanelProps {
  readonly trust: MemberTrustProfile | null;
  readonly isLoading?: boolean;
  readonly error?: string | null;
  readonly onRetry?: () => void;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatLabel(value?: string | null): string {
  if (!value?.trim()) return 'Not recorded';

  return value
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatTimestamp(value?: string | null): string {
  if (!value?.trim()) return 'Not recorded';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Unavailable';

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatNumber(value: number, maximumFractionDigits = 1): string {
  if (!Number.isFinite(value)) return 'Unavailable';

  return new Intl.NumberFormat('en-KE', {
    maximumFractionDigits,
  }).format(value);
}

function formatPercentage(value: number): string {
  if (!Number.isFinite(value)) return 'Unavailable';

  // The model exposes a rate but does not document whether it is represented
  // as a fraction or a percentage. Display the supplied value without scaling.
  return `${formatNumber(value)}${value <= 1 && value >= 0 ? '' : ''}`;
}

// -----------------------------------------------------------------------------
// Field
// -----------------------------------------------------------------------------

function TrustField({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}): ReactNode {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
        {label}
      </dt>

      <dd className="break-words text-sm text-[var(--foreground)]">
        {value}
      </dd>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Statistic
// -----------------------------------------------------------------------------

function TrustStatistic({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}): ReactNode {
  return (
    <div className="min-w-0 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-4">
      <p className="text-xs font-medium text-[var(--foreground-muted)]">
        {label}
      </p>

      <p className="mt-2 break-words text-xl font-semibold tabular-nums text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Loading
// -----------------------------------------------------------------------------

function TrustLoadingState(): ReactNode {
  return (
    <div
      className="space-y-5"
      role="status"
      aria-label="Loading member trust information"
    >
      <div className="animate-pulse rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-4">
        <div className="h-4 w-36 rounded bg-[var(--background-muted)]" />
        <div className="mt-3 h-6 w-28 rounded bg-[var(--background-muted)]" />

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-[var(--radius-md)] bg-[var(--background-muted)]"
            />
          ))}
        </div>
      </div>

      <span className="sr-only">Loading member trust information…</span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Trust Event
// -----------------------------------------------------------------------------

function TrustEventCard({
  event,
}: {
  readonly event: MemberTrustEvent;
}): ReactNode {
  return (
    <article className="min-w-0 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h4 className="break-words text-sm font-semibold text-[var(--foreground)]">
            {formatLabel(event.type)}
          </h4>

          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            {formatTimestamp(event.createdAt)}
          </p>
        </div>

        <span className="break-all font-mono text-xs text-[var(--foreground-muted)]">
          {event.publicId}
        </span>
      </div>

      {event.reason?.trim() ? (
        <p className="mt-3 whitespace-pre-line break-words text-sm text-[var(--foreground-secondary)]">
          {event.reason.trim()}
        </p>
      ) : null}

      <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {event.actorPublicId ? (
          <TrustField label="Actor ID" value={event.actorPublicId} />
        ) : null}

        {event.journeyPublicId ? (
          <TrustField label="Journey ID" value={event.journeyPublicId} />
        ) : null}

        {event.bookingPublicId ? (
          <TrustField label="Booking ID" value={event.bookingPublicId} />
        ) : null}

        {event.ratingPublicId ? (
          <TrustField label="Rating ID" value={event.ratingPublicId} />
        ) : null}

        {event.badgePublicId ? (
          <TrustField label="Badge ID" value={event.badgePublicId} />
        ) : null}

        {event.disputePublicId ? (
          <TrustField label="Dispute ID" value={event.disputePublicId} />
        ) : null}
      </dl>
    </article>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MemberTrustPanel({
  trust,
  isLoading = false,
  error,
  onRetry,
  className,
}: MemberTrustPanelProps): ReactNode {
  return (
    <MemberDataSection
      title="Trust"
      description="Trust profile, ratings, journey statistics, badges, and recorded trust events."
      className={className}
    >
      {isLoading ? (
        <TrustLoadingState />
      ) : error ? (
        <div
          role="alert"
          className="rounded-[var(--radius-lg)] border border-[var(--danger)]/25 bg-[var(--danger-soft)] p-4"
        >
          <p className="text-sm font-medium text-[var(--foreground)]">
            Trust information could not be loaded.
          </p>

          <p className="mt-1 break-words text-sm text-[var(--foreground-secondary)]">
            {error}
          </p>

          {onRetry ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-3"
            >
              Try again
            </Button>
          ) : null}
        </div>
      ) : !trust ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] px-4 py-8 text-center">
          <p className="text-sm font-medium text-[var(--foreground)]">
            No trust profile available
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            The Trust API did not return a profile for this member. No trust
            status or score has been inferred.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Profile overview */}
          <section className="rounded-[var(--radius-lg)] border border-[var(--border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  Trust profile status
                </h3>

                <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                  Independent of account and verification lifecycle status.
                </p>
              </div>

              <MemberTrustIndicator
                status={trust.status as MemberTrustStatus}
                verificationLevel={trust.verificationLevel}
                size="sm"
              />
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-2">
              <TrustField
                label="Trust profile ID"
                value={trust.publicId}
              />

              <TrustField
                label="Member ID"
                value={trust.memberPublicId}
              />

              <TrustField
                label="Verification level"
                value={formatLabel(trust.verificationLevel)}
              />

              <TrustField
                label="Profile created"
                value={formatTimestamp(trust.createdAt)}
              />

              <TrustField
                label="Last updated"
                value={formatTimestamp(trust.updatedAt)}
              />
            </dl>
          </section>

          {/* Ratings */}
          <section>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Ratings and journey performance
            </h3>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <TrustStatistic
                label="Average rating"
                value={formatNumber(trust.ratingAverage, 2)}
              />

              <TrustStatistic
                label="Rating count"
                value={formatNumber(trust.ratingCount, 0)}
              />

              <TrustStatistic
                label="Completed journeys"
                value={formatNumber(trust.completedJourneys, 0)}
              />

              <TrustStatistic
                label="Completion rate"
                value={formatPercentage(trust.completionRate)}
              />
            </div>

            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TrustField
                label="Provider journeys"
                value={formatNumber(trust.providerJourneys, 0)}
              />

              <TrustField
                label="Passenger journeys"
                value={formatNumber(trust.passengerJourneys, 0)}
              />

              <TrustField
                label="Completed provider journeys"
                value={formatNumber(trust.completedProviderJourneys, 0)}
              />

              <TrustField
                label="Completed passenger journeys"
                value={formatNumber(trust.completedPassengerJourneys, 0)}
              />

              <TrustField
                label="Cancelled journeys"
                value={formatNumber(trust.cancelledJourneys, 0)}
              />

              <TrustField
                label="Provider cancellations"
                value={formatNumber(trust.providerCancellations, 0)}
              />

              <TrustField
                label="Passenger cancellations"
                value={formatNumber(trust.passengerCancellations, 0)}
              />

              <TrustField
                label="Cancellation rate"
                value={formatPercentage(trust.cancellationRate)}
              />
            </dl>
          </section>

          {/* Badges */}
          <section>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Badges
              </h3>

              <span className="text-xs text-[var(--foreground-muted)]">
                {trust.badges.length}{' '}
                {trust.badges.length === 1 ? 'badge' : 'badges'}
              </span>
            </div>

            {trust.badges.length === 0 ? (
              <p className="mt-3 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] p-4 text-sm text-[var(--foreground-secondary)]">
                No badges are recorded on this trust profile.
              </p>
            ) : (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {trust.badges.map((badge) => (
                  <article
                    key={badge.publicId}
                    className="min-w-0 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h4 className="break-words text-sm font-semibold text-[var(--foreground)]">
                        {badge.name}
                      </h4>

                      <span
                        className={cn(
                          'rounded-[var(--radius-full)] px-2 py-1 text-xs font-medium',
                          badge.active
                            ? 'bg-[var(--success-soft)] text-[var(--success)]'
                            : 'bg-[var(--background-muted)] text-[var(--foreground-secondary)]',
                        )}
                      >
                        {badge.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                      {formatLabel(badge.type)}
                    </p>

                    {badge.description?.trim() ? (
                      <p className="mt-3 break-words text-sm text-[var(--foreground-secondary)]">
                        {badge.description.trim()}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Reviews */}
          <section>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Reviews
              </h3>

              <span className="text-xs text-[var(--foreground-muted)]">
                {trust.reviews.length}{' '}
                {trust.reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>

            {trust.reviews.length === 0 ? (
              <p className="mt-3 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] p-4 text-sm text-[var(--foreground-secondary)]">
                No reviews are recorded on this trust profile.
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {trust.reviews.map((review) => (
                  <article
                    key={review.publicId}
                    className="min-w-0 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-4"
                  >
                    <p className="whitespace-pre-line break-words text-sm text-[var(--foreground)]">
                      {review.content}
                    </p>

                    <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <TrustField
                        label="Review ID"
                        value={review.publicId}
                      />

                      <TrustField
                        label="Rating ID"
                        value={review.ratingId}
                      />

                      <TrustField
                        label="Created"
                        value={formatTimestamp(review.createdAt)}
                      />
                    </dl>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Trust events */}
          <section>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Trust events
              </h3>

              <span className="text-xs text-[var(--foreground-muted)]">
                {trust.events.length}{' '}
                {trust.events.length === 1 ? 'event' : 'events'}
              </span>
            </div>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              These are events returned by the Trust domain, not necessarily a
              complete administrative audit history.
            </p>

            {trust.events.length === 0 ? (
              <p className="mt-3 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] p-4 text-sm text-[var(--foreground-secondary)]">
                No trust events are recorded on this profile.
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {[...trust.events]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .map((event) => (
                    <TrustEventCard key={event.publicId} event={event} />
                  ))}
              </div>
            )}
          </section>
        </div>
      )}
    </MemberDataSection>
  );
}

export default MemberTrustPanel;

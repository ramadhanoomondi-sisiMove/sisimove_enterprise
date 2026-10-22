
import { Card } from '@/components/ui/card';
import { TrustStatusBadge } from '@/components/admin/trust';
import { TrustLoadingState } from '@/components/admin/trust';
import { TrustEmptyState } from '@/components/admin/trust';

import type { TrustEventApiResponse } from '@/features/admin/trust/types/trust.types';

export interface TrustActivityFeedProps {
  events: TrustEventApiResponse[];
  isLoading?: boolean;
  title?: string;
  description?: string;
  limit?: number;
  onSelectEvent?: (event: TrustEventApiResponse) => void;
  className?: string;
}

function formatEventType(type: string): string {
  return type
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatTimestamp(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function getEventReference(event: TrustEventApiResponse): string | null {
  if (event.journeyPublicId) return `Journey ${event.journeyPublicId}`;
  if (event.bookingPublicId) return `Booking ${event.bookingPublicId}`;
  if (event.ratingPublicId) return `Rating ${event.ratingPublicId}`;
  if (event.badgePublicId) return `Badge ${event.badgePublicId}`;
  if (event.disputePublicId) return `Dispute ${event.disputePublicId}`;

  return null;
}

export function TrustActivityFeed({
  events,
  isLoading = false,
  title = 'Recent trust activity',
  description = 'Review recorded trust events and their available context.',
  limit = 6,
  onSelectEvent,
  className,
}: TrustActivityFeedProps) {
  const visibleEvents = [...events]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, Math.max(0, limit));

  return (
    <section className={className} aria-labelledby="trust-activity-feed-title">
      <div className="mb-4">
        <h2
          id="trust-activity-feed-title"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          {title}
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          {description}
        </p>
      </div>

      {isLoading ? (
        <TrustLoadingState rows={4} />
      ) : visibleEvents.length === 0 ? (
        <TrustEmptyState
          title="No trust activity yet"
          description="Recorded trust events will appear here when available."
          variant="events"
        />
      ) : (
        <Card variant="default" padding="none">
          <ol className="divide-y divide-[var(--border-subtle)]">
            {visibleEvents.map((event) => {
              const reference = getEventReference(event);

              const content = (
                <>
                  <span
                    aria-hidden="true"
                    className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--background-muted)] text-sm font-semibold text-[var(--foreground-secondary)]"
                  >
                    <span>•</span>
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-[var(--foreground)]">
                        {formatEventType(event.type)}
                      </span>
                      <TrustStatusBadge status={event.type} size="sm" />
                    </span>

                    <span className="mt-1 block text-sm text-[var(--foreground-secondary)]">
                      {event.reason || 'No additional reason was recorded.'}
                    </span>

                    <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--foreground-muted)]">
                      <span>{formatTimestamp(event.createdAt)}</span>
                      {reference && <span>{reference}</span>}
                      {event.actorPublicId && (
                        <span>Actor: {event.actorPublicId}</span>
                      )}
                    </span>
                  </span>

                  {onSelectEvent && (
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-sm text-[var(--foreground-muted)]"
                    >
                      →
                    </span>
                  )}
                </>
              );

              return (
                <li key={event.publicId}>
                  {onSelectEvent ? (
                    <button
                      type="button"
                      onClick={() => onSelectEvent(event)}
                      className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-[var(--background-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand)]"
                      aria-label={`View ${formatEventType(event.type)} event`}
                    >
                      {content}
                    </button>
                  ) : (
                    <div className="flex items-start gap-3 p-4">
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </Card>
      )}
    </section>
  );
}

export default TrustActivityFeed;

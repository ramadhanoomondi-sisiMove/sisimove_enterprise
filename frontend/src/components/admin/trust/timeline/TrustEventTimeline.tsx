
/**
 * sisiMove — Trust Event Timeline
 *
 * Chronological presentation of Trust events.
 *
 * Responsibilities:
 * - Render a collection of Trust events as timeline entries.
 * - Support ascending or descending chronological ordering.
 * - Present an empty state when no events are available.
 * - Reuse TrustEventCard and TrustEmptyState.
 *
 * Non-responsibilities:
 * - Fetching Trust events.
 * - Paginating or filtering server data.
 * - Inferring event lifecycle status.
 */

import type { ReactNode } from 'react';

import type { TrustEventApiResponse } from '@/features/admin/trust/types/trust.types';
import { TrustEmptyState } from '../shared/TrustEmptyState';
import { TrustEventCard } from './TrustEventCard';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TrustEventTimelineOrder = 'newest-first' | 'oldest-first';

export interface TrustEventTimelineProps {
  /**
   * Trust events to display.
   */
  events: TrustEventApiResponse[];

  /**
   * Chronological display order.
   * Defaults to newest first.
   */
  order?: TrustEventTimelineOrder;

  /**
   * Whether each event can expand to show details.
   */
  expandable?: boolean;

  /**
   * Optional heading displayed above the timeline.
   */
  title?: string;

  /**
   * Optional description displayed below the heading.
   */
  description?: string;

  /**
   * Optional content shown when there are no events.
   * When omitted, the standard Trust empty state is used.
   */
  emptyState?: ReactNode;

  /**
   * Optional content displayed after the timeline entries.
   * Useful for a caller-owned pagination control.
   */
  footer?: ReactNode;

  /**
   * Additional CSS classes for the root element.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getTimestamp(value: string): number {
  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustEventTimeline({
  events,
  order = 'newest-first',
  expandable = true,
  title = 'Trust activity',
  description,
  emptyState,
  footer,
  className,
}: TrustEventTimelineProps) {
  const sortedEvents = [...events].sort((a, b) => {
    const difference =
      getTimestamp(a.createdAt) - getTimestamp(b.createdAt);

    return order === 'newest-first' ? -difference : difference;
  });

  return (
    <section
      aria-label={title}
      className={['w-full min-w-0', className ?? ''].join(' ')}
    >
      {(title || description) && (
        <header className="mb-5">
          {title && (
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-1 text-sm leading-6 text-[var(--foreground-muted)]">
              {description}
            </p>
          )}
        </header>
      )}

      {sortedEvents.length === 0 ? (
        emptyState ?? (
          <TrustEmptyState
            variant="events"
          />
        )
      ) : (
        <ol className="relative space-y-4">
          {sortedEvents.map((event) => (
            <li
              key={event.publicId}
              className="relative min-w-0"
            >
              <TrustEventCard
                event={event}
                expandable={expandable}
              />
            </li>
          ))}
        </ol>
      )}

      {footer && (
        <div className="mt-5">
          {footer}
        </div>
      )}
    </section>
  );
}

export default TrustEventTimeline;

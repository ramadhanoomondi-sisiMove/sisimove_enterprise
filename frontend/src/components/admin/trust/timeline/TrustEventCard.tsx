
/**
 * sisiMove — Trust Event Card
 *
 * Compact card presentation for a Trust event in an activity timeline.
 *
 * Responsibilities:
 * - Display the event type and recorded timestamp.
 * - Show the event reason when available.
 * - Optionally reveal full event details.
 * - Reuse the shared design-system Card.
 *
 * Non-responsibilities:
 * - Fetching or modifying Trust events.
 * - Inferring event lifecycle status.
 * - Defining Trust event metadata.
 */

'use client';

import { useState } from 'react';

import { Card } from '@/components/ui/card';
import type { TrustEventApiResponse } from '@/features/admin/trust/types/trust.types';
import { TrustEventDetails } from './TrustEventDetails';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TrustEventCardProps {
  /**
   * Event to display.
   */
  event: TrustEventApiResponse;

  /**
   * Whether the full event details can be expanded.
   */
  expandable?: boolean;

  /**
   * Whether the card starts with details expanded.
   */
  defaultExpanded?: boolean;

  /**
   * Optional additional CSS classes.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatEventType(type: string): string {
  return type
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatTimestamp(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustEventCard({
  event,
  expandable = true,
  defaultExpanded = false,
  className,
}: TrustEventCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const eventTitle = formatEventType(event.type);
  const detailsId = `trust-event-details-${event.publicId}`;

  const header = (
    <div className="flex min-w-0 flex-1 items-start gap-3">
      <span
        aria-hidden="true"
        className={[
          'mt-1 flex h-2.5 w-2.5 shrink-0',
          'rounded-full bg-[var(--brand)]',
          'ring-4 ring-[var(--brand-soft)]',
        ].join(' ')}
      />

      <div className="min-w-0 flex-1">
        <h3 className="break-words text-sm font-semibold text-[var(--foreground)]">
          {eventTitle}
        </h3>

        <time
          dateTime={event.createdAt}
          className="mt-1 block text-xs text-[var(--foreground-muted)]"
        >
          {formatTimestamp(event.createdAt)}
        </time>
      </div>
    </div>
  );

  const footer = expandable ? (
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls={detailsId}
      onClick={() => setExpanded((current) => !current)}
      className={[
        'inline-flex min-h-9 items-center gap-2',
        'rounded-[var(--radius-md)] px-2',
        'text-sm font-medium text-[var(--brand)]',
        'transition-colors hover:bg-[var(--brand-soft)]',
        'focus-visible:outline-2',
        'focus-visible:outline-[var(--brand)]',
        'focus-visible:outline-offset-2',
      ].join(' ')}
    >
      <span>{expanded ? 'Hide details' : 'View details'}</span>

      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        className={[
          'h-4 w-4 transition-transform duration-150',
          expanded ? 'rotate-180' : '',
        ].join(' ')}
      >
        <path
          d="m5 7.5 5 5 5-5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  ) : undefined;

  return (
    <Card
      variant="default"
      padding="md"
      header={header}
      footer={footer}
      className={className}
    >
      {event.reason && (
        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[var(--foreground-secondary)]">
          {event.reason}
        </p>
      )}

      {expandable && expanded && (
        <div
          id={detailsId}
          className="mt-4 border-t border-[var(--border-subtle)] pt-4"
        >
          <TrustEventDetails
            event={event}
            showMetadata
          />
        </div>
      )}

      {!expandable && (
        <TrustEventDetails
          event={event}
          showMetadata={false}
        />
      )}
    </Card>
  );
}

export default TrustEventCard;

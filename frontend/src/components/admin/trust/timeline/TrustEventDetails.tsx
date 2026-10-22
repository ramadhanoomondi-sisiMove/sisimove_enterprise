
/**
 * sisiMove — Trust Event Details
 *
 * Displays the detailed information associated with a Trust event.
 *
 * Responsibilities:
 * - Present the event type, timestamp, actor, and available references.
 * - Display an optional reason.
 * - Safely render metadata without assuming its schema.
 * - Reuse the existing Trust API event contract.
 *
 * Non-responsibilities:
 * - Fetching Trust events.
 * - Interpreting event lifecycle rules.
 * - Performing moderation or profile mutations.
 */

import type { ReactNode } from 'react';

import type { TrustEventApiResponse } from '@/features/admin/trust/types/trust.types';
import { TrustStatusBadge } from '../shared/TrustStatusBadge';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TrustEventDetailsProps {
  /**
   * Trust event returned by the Trust API.
   */
  event: TrustEventApiResponse;

  /**
   * Optional additional content, such as contextual links.
   */
  children?: ReactNode;

  /**
   * Whether to show the event metadata.
   */
  showMetadata?: boolean;

  /**
   * Additional classes for the root element.
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

function formatReference(value: string): string {
  return value.length > 16
    ? `${value.slice(0, 8)}…${value.slice(-6)}`
    : value;
}

function formatMetadataValue(value: unknown): string {
  if (value === null) {
    return 'null';
  }

  if (value === undefined) {
    return '—';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value);
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '[Unable to display value]';
  }
}

// -----------------------------------------------------------------------------
// Reference Row
// -----------------------------------------------------------------------------

function ReferenceRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="grid gap-1 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-3">
      <dt className="text-sm text-[var(--foreground-muted)]">
        {label}
      </dt>

      <dd className="min-w-0 break-all text-sm text-[var(--foreground)]">
        <span title={value}>{formatReference(value)}</span>
      </dd>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustEventDetails({
  event,
  children,
  showMetadata = true,
  className,
}: TrustEventDetailsProps) {
  const metadataEntries =
    event.metadata && typeof event.metadata === 'object'
      ? Object.entries(event.metadata)
      : [];

  return (
    <section
      aria-label="Trust event details"
      className={[
        'w-full space-y-5',
        className ?? '',
      ].join(' ')}
    >
      {/* Event heading */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Event type
          </p>

          <h3 className="mt-1 break-words text-base font-semibold text-[var(--foreground)]">
            {formatEventType(event.type)}
          </h3>
        </div>

        <TrustStatusBadge
          status={event.type}
          size="sm"
        />
      </div>

      {/* Core details */}

      <dl className="space-y-3">
        <div className="grid gap-1 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-3">
          <dt className="text-sm text-[var(--foreground-muted)]">
            Recorded
          </dt>

          <dd className="text-sm text-[var(--foreground)]">
            <time dateTime={event.createdAt}>
              {formatTimestamp(event.createdAt)}
            </time>
          </dd>
        </div>

        <ReferenceRow
          label="Event ID"
          value={event.publicId}
        />

        <ReferenceRow
          label="Profile ID"
          value={event.profileId}
        />

        <ReferenceRow
          label="Actor ID"
          value={event.actorPublicId}
        />

        <ReferenceRow
          label="Journey ID"
          value={event.journeyPublicId}
        />

        <ReferenceRow
          label="Booking ID"
          value={event.bookingPublicId}
        />

        <ReferenceRow
          label="Rating ID"
          value={event.ratingPublicId}
        />

        <ReferenceRow
          label="Badge ID"
          value={event.badgePublicId}
        />

        <ReferenceRow
          label="Dispute ID"
          value={event.disputePublicId}
        />
      </dl>

      {/* Reason */}

      {event.reason && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-[var(--foreground)]">
            Reason
          </h4>

          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[var(--foreground-secondary)]">
            {event.reason}
          </p>
        </div>
      )}

      {/* Metadata */}

      {showMetadata && metadataEntries.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-[var(--foreground)]">
            Event metadata
          </h4>

          <dl className="space-y-3">
            {metadataEntries.map(([key, value]) => (
              <div
                key={key}
                className="grid gap-1 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-3"
              >
                <dt className="break-words text-sm text-[var(--foreground-muted)]">
                  {key}
                </dt>

                <dd className="min-w-0">
                  <pre className="whitespace-pre-wrap break-words rounded-[var(--radius-md)] bg-[var(--background-subtle)] p-3 font-mono text-xs leading-5 text-[var(--foreground-secondary)]">
                    {formatMetadataValue(value)}
                  </pre>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {children && (
        <div className="border-t border-[var(--border-subtle)] pt-4">
          {children}
        </div>
      )}
    </section>
  );
}

export default TrustEventDetails;

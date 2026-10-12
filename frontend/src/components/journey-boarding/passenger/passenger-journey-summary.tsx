
'use client';

import { Badge, Card, Divider } from '@/components/ui';

export interface PassengerJourneySummaryProps {
  origin: string;
  destination: string;
  departureAt?: string | Date | null;
  journeyStatus?: string | null;
  providerName?: string | null;
  className?: string;
}

function formatDeparture(value?: string | Date | null): string | null {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('en-KE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatStatus(status?: string | null): string | null {
  if (!status) return null;

  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function PassengerJourneySummary({
  origin,
  destination,
  departureAt,
  journeyStatus,
  providerName,
  className,
}: PassengerJourneySummaryProps) {
  const departureLabel = formatDeparture(departureAt);
  const statusLabel = formatStatus(journeyStatus);

  return (
    <Card padding="md" className={className}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-[var(--foreground-secondary)]">
            Your journey
          </p>

          <h2 className="mt-1 text-lg font-semibold text-[var(--foreground)]">
            Journey details
          </h2>
        </div>

        {statusLabel && (
          <Badge variant="brand" size="sm">
            {statusLabel}
          </Badge>
        )}
      </div>

      <Divider className="my-4" />

      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-4">
        <div className="flex flex-col items-center pt-1">
          <span
            className="h-2.5 w-2.5 rounded-full border-2 border-[var(--brand)]"
            aria-hidden="true"
          />
          <span
            className="my-1 min-h-8 w-px bg-[var(--border)]"
            aria-hidden="true"
          />
          <span
            className="h-2.5 w-2.5 rounded-full bg-[var(--brand)]"
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0 space-y-5">
          <div>
            <p className="text-xs text-[var(--foreground-muted)]">
              FROM
            </p>
            <p className="break-words font-medium text-[var(--foreground)]">
              {origin || 'Origin not available'}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--foreground-muted)]">
              TO
            </p>
            <p className="break-words font-medium text-[var(--foreground)]">
              {destination || 'Destination not available'}
            </p>
          </div>
        </div>
      </div>

      {(departureLabel || providerName) && (
        <>
          <Divider className="my-4" />

          <div className="grid gap-4 sm:grid-cols-2">
            {departureLabel && (
              <div>
                <p className="text-xs text-[var(--foreground-muted)]">
                  DEPARTURE
                </p>
                <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
                  {departureLabel}
                </p>
              </div>
            )}

            {providerName && (
              <div>
                <p className="text-xs text-[var(--foreground-muted)]">
                  PROVIDER
                </p>
                <p className="mt-1 break-words text-sm font-medium text-[var(--foreground)]">
                  {providerName}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
}

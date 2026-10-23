
'use client';

import { Route } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { MappedJourney } from '@/features/admin/journeys/mappers/journey.mapper';
import { JourneyLoadingState } from '@/components/admin/journeys/shared/JourneyLoadingState';
import { JourneyEmptyState } from '@/components/admin/journeys/shared/JourneyEmptyState';

import JourneyTableRow from './JourneyTableRow';

interface JourneyTableProps {
  journeys: MappedJourney[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  className?: string;
}

export default function JourneyTable({
  journeys,
  loading = false,
  error = false,
  onRetry,
  className,
}: JourneyTableProps) {
  if (loading) {
    return (
      <div
        className={cn(
          'overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]',
          className,
        )}
      >
        <JourneyLoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5',
          className,
        )}
      >
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[var(--danger-soft)]">
            <Route
              aria-hidden="true"
              className="size-5 text-[var(--danger)]"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Unable to load journeys
            </h3>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              The journey records could not be displayed. Try again.
            </p>
          </div>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition hover:bg-[var(--background-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (journeys.length === 0) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5',
          className,
        )}
      >
        <JourneyEmptyState />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background-subtle)]">
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)] sm:px-5"
              >
                Route / journey
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)] sm:px-5"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)] sm:px-5"
              >
                Departure
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)] sm:px-5"
              >
                Seats
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)] sm:px-5"
              >
                Price per seat
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)] sm:px-5"
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {journeys.map((journey) => (
              <JourneyTableRow
                key={journey.publicId}
                journey={journey}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[var(--border)] px-4 py-3 sm:px-5">
        <p className="text-xs text-[var(--foreground-muted)]">
          Journey details reflect the records supplied by the directory.
        </p>
      </div>
    </div>
  );
}

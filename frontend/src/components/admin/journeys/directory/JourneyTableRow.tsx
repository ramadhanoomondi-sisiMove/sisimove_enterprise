
'use client';

import Link from 'next/link';
import { ArrowUpRight, CalendarDays, MapPin, Users } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';
import type { MappedJourney } from '@/features/admin/journeys/mappers/journey.mapper';

import { JourneyStatusBadge } from '@/components/admin/journeys/shared/JourneyStatusBadge';
import { JourneyPublicId } from '@/components/admin/journeys/shared/JourneyPublicId';

interface JourneyTableRowProps {
  journey: MappedJourney;
  className?: string;
}

function formatDeparture(value: string | null | undefined): string {
  if (!value) return 'Not scheduled';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Not scheduled';

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatPrice(
  amount: number | undefined,
  currency: string | undefined,
): string {
  if (amount === undefined || !currency) return '—';

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
}

export default function JourneyTableRow({
  journey,
  className,
}: JourneyTableRowProps) {
  const corridor = journey.corridor;
  const schedule = journey.schedule;
  const capacity = journey.capacity;
  const pricing = journey.pricing;

  const departure = formatDeparture(schedule?.departureAt);
  const price = formatPrice(pricing?.amount, pricing?.currency);

  return (
    <tr
      className={cn(
        'group border-b border-[var(--border-subtle)] transition-colors last:border-b-0 hover:bg-[var(--background-subtle)]',
        className,
      )}
    >
      <td className="px-4 py-4 align-middle sm:px-5">
        <div className="min-w-52 space-y-2">
          <div className="flex items-start gap-2">
            <MapPin
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-[var(--foreground-muted)]"
            />

            <div className="min-w-0">
              <p className="font-medium text-[var(--foreground)]">
                {corridor?.originName ?? 'Origin unavailable'}
              </p>

              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                to {corridor?.destinationName ?? 'Destination unavailable'}
              </p>
            </div>
          </div>

          <JourneyPublicId publicId={journey.publicId} />
        </div>
      </td>

      <td className="whitespace-nowrap px-4 py-4 align-middle sm:px-5">
        <JourneyStatusBadge status={journey.status} />
      </td>

      <td className="px-4 py-4 align-middle sm:px-5">
        <div className="flex min-w-40 items-start gap-2">
          <CalendarDays
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-[var(--foreground-muted)]"
          />

          <div>
            <p className="text-sm text-[var(--foreground)]">{departure}</p>

            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              {schedule?.timezone ?? 'Timezone unavailable'}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4 align-middle sm:px-5">
        <div className="flex min-w-32 items-start gap-2">
          <Users
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-[var(--foreground-muted)]"
          />

          <div>
            <p className="text-sm font-medium text-[var(--foreground)] tabular-nums">
              {capacity
                ? `${capacity.bookedSeats} / ${capacity.totalSeats}`
                : '—'}
            </p>

            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              {capacity
                ? `${capacity.availableSeats} seats available`
                : 'Capacity unavailable'}
            </p>
          </div>
        </div>
      </td>

      <td className="whitespace-nowrap px-4 py-4 align-middle sm:px-5">
        <span className="text-sm font-semibold text-[var(--foreground)] tabular-nums">
          {price}
        </span>
      </td>

      <td className="px-4 py-4 text-right align-middle sm:px-5">
        <Link
          href={ADMIN_ROUTES.JOURNEY(journey.publicId)}
          aria-label={`View journey ${journey.publicId}`}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
        >
          View
          <ArrowUpRight
            aria-hidden="true"
            className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      </td>
    </tr>
  );
}

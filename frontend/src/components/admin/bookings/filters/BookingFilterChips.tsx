
'use client';

import type { AdminBookingFilters } from '@/features/admin/bookings';
interface BookingFilterChipsProps {
  filters: AdminBookingFilters;
  onFiltersChange: (filters: AdminBookingFilters) => void;
}

interface ActiveFilterChip {
  key:
    | 'search'
    | 'status'
    | 'paymentStatus'
    | 'journeyPublicId'
    | 'passengerPublicId'
    | 'departureFrom'
    | 'departureTo'
    | 'createdFrom'
    | 'createdTo';
  label: string;
  value: string;
}

export function BookingFilterChips({
  filters,
  onFiltersChange,
}: BookingFilterChipsProps) {
  const chips = getActiveFilterChips(filters);

  if (chips.length === 0) {
    return null;
  }

  function removeFilter(key: ActiveFilterChip['key']) {
    const nextFilters: AdminBookingFilters = {
      ...filters,
      page: 1,
    };

    switch (key) {
      case 'status':
      case 'paymentStatus':
        nextFilters[key] = null;
        break;

      case 'search':
      case 'journeyPublicId':
      case 'passengerPublicId':
      case 'departureFrom':
      case 'departureTo':
      case 'createdFrom':
      case 'createdTo':
        nextFilters[key] = '';
        break;
    }

    onFiltersChange(nextFilters);
  }

  return (
    <div
      aria-label="Active booking filters"
      className="flex flex-wrap items-center gap-2"
    >
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex max-w-full items-center gap-2 rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--background-subtle)] py-1 pl-3 pr-1 text-xs font-medium text-[var(--foreground-secondary)]"
        >
          <span className="truncate">
            {chip.label}: {formatFilterValue(chip.value)}
          </span>

          <button
            type="button"
            aria-label={`Remove ${chip.label} filter`}
            onClick={() => removeFilter(chip.key)}
            className="flex size-6 shrink-0 items-center justify-center rounded-full text-base text-[var(--foreground-muted)] transition hover:bg-[var(--border)] hover:text-[var(--foreground)]"
          >
            <span aria-hidden="true">×</span>
          </button>
        </span>
      ))}
    </div>
  );
}

function getActiveFilterChips(
  filters: AdminBookingFilters,
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  const add = (
    key: ActiveFilterChip['key'],
    label: string,
    value: string | null | undefined,
  ) => {
    if (value?.trim()) {
      chips.push({
        key,
        label,
        value: value.trim(),
      });
    }
  };

  add('search', 'Search', filters.search);
  add('status', 'Booking status', filters.status);
  add('paymentStatus', 'Payment status', filters.paymentStatus);
  add('journeyPublicId', 'Journey', filters.journeyPublicId);
  add('passengerPublicId', 'Passenger', filters.passengerPublicId);
  add('departureFrom', 'Departure from', filters.departureFrom);
  add('departureTo', 'Departure to', filters.departureTo);
  add('createdFrom', 'Created from', filters.createdFrom);
  add('createdTo', 'Created to', filters.createdTo);

  return chips;
}

function formatFilterValue(value: string): string {
  return value
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

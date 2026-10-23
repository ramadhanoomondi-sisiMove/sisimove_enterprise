
'use client';

import type { ChangeEvent } from 'react';

import {
  AdminBookingPaymentStatus,
  AdminBookingSortDirection,
  AdminBookingSortField,
  AdminBookingStatus,
} from '@/features/admin/bookings';
import type { AdminBookingFilters } from '@/features/admin/bookings';
import { DEFAULT_ADMIN_BOOKING_FILTERS } from '@/features/admin/bookings';
interface BookingFilterBarProps {
  filters: AdminBookingFilters;
  onFiltersChange: (filters: AdminBookingFilters) => void;
  onReset?: () => void;
  disabled?: boolean;
}

const BOOKING_STATUSES = Object.values(AdminBookingStatus);
const PAYMENT_STATUSES = Object.values(AdminBookingPaymentStatus);

const SORT_FIELDS: { value: AdminBookingSortField; label: string }[] = [
  { value: 'createdAt', label: 'Date created' },
  { value: 'updatedAt', label: 'Last updated' },
  { value: 'departureAt', label: 'Departure date' },
  { value: 'totalAmount', label: 'Booking amount' },
];

const SORT_DIRECTIONS: {
  value: AdminBookingSortDirection;
  label: string;
}[] = [
  { value: 'desc', label: 'Newest / highest first' },
  { value: 'asc', label: 'Oldest / lowest first' },
];

export function BookingFilterBar({
  filters,
  onFiltersChange,
  onReset,
  disabled = false,
}: BookingFilterBarProps) {
  function updateFilters(updates: Partial<AdminBookingFilters>) {
    onFiltersChange({
      ...filters,
      ...updates,
      page: 1,
    });
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    updateFilters({ search: event.target.value });
  }

  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>) {
    updateFilters({
      status: event.target.value
        ? (event.target.value as AdminBookingStatus)
        : null,
    });
  }

  function handlePaymentStatusChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    updateFilters({
      paymentStatus: event.target.value
        ? (event.target.value as AdminBookingPaymentStatus)
        : null,
    });
  }

  function handleSortFieldChange(event: ChangeEvent<HTMLSelectElement>) {
    updateFilters({
      sortBy: event.target.value as AdminBookingSortField,
    });
  }

  function handleSortDirectionChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    updateFilters({
      sortDirection: event.target.value as AdminBookingSortDirection,
    });
  }

  function resetFilters() {
    if (onReset) {
      onReset();
      return;
    }

    onFiltersChange({ ...DEFAULT_ADMIN_BOOKING_FILTERS });
  }

  const hasActiveFilters = Boolean(
    filters.search?.trim() ||
      filters.status ||
      filters.paymentStatus ||
      filters.journeyPublicId?.trim() ||
      filters.passengerPublicId?.trim() ||
      filters.departureFrom ||
      filters.departureTo ||
      filters.createdFrom ||
      filters.createdTo,
  );

  return (
    <section
      aria-label="Booking filters"
      className="surface space-y-4 p-4 sm:p-5"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="min-w-0">
          <label
            htmlFor="admin-booking-search"
            className="mb-1.5 block text-sm font-medium text-[var(--foreground-secondary)]"
          >
            Search bookings
          </label>

          <input
            id="admin-booking-search"
            type="search"
            value={filters.search ?? ''}
            onChange={handleSearchChange}
            placeholder="Search by booking ID..."
            disabled={disabled}
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label
            htmlFor="admin-booking-status"
            className="mb-1.5 block text-sm font-medium text-[var(--foreground-secondary)]"
          >
            Booking status
          </label>

          <select
            id="admin-booking-status"
            value={filters.status ?? ''}
            onChange={handleStatusChange}
            disabled={disabled}
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)] disabled:opacity-60"
          >
            <option value="">All booking statuses</option>
            {BOOKING_STATUSES.map((status) => (
              <option key={status} value={status}>
                {formatOptionLabel(status)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="admin-booking-payment-status"
            className="mb-1.5 block text-sm font-medium text-[var(--foreground-secondary)]"
          >
            Payment status
          </label>

          <select
            id="admin-booking-payment-status"
            value={filters.paymentStatus ?? ''}
            onChange={handlePaymentStatusChange}
            disabled={disabled}
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)] disabled:opacity-60"
          >
            <option value="">All payment statuses</option>
            {PAYMENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {formatOptionLabel(status)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="admin-booking-sort"
            className="mb-1.5 block text-sm font-medium text-[var(--foreground-secondary)]"
          >
            Sort by
          </label>

          <select
            id="admin-booking-sort"
            value={filters.sortBy}
            onChange={handleSortFieldChange}
            disabled={disabled}
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)] disabled:opacity-60"
          >
            {SORT_FIELDS.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="admin-booking-sort-direction"
            className="mb-1.5 block text-sm font-medium text-[var(--foreground-secondary)]"
          >
            Sort direction
          </label>

          <select
            id="admin-booking-sort-direction"
            value={filters.sortDirection}
            onChange={handleSortDirectionChange}
            disabled={disabled}
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)] disabled:opacity-60"
          >
            {SORT_DIRECTIONS.map((direction) => (
              <option key={direction.value} value={direction.value}>
                {direction.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={resetFilters}
            disabled={disabled || !hasActiveFilters}
            className="min-h-10 w-full rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition hover:bg-[var(--background-subtle)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset filters
          </button>
        </div>
      </div>
    </section>
  );
}

function formatOptionLabel(value: string): string {
  return value
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

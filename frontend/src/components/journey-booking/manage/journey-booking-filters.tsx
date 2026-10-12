
'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Filters
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Provide controlled booking search and filtering inputs.
// - Support booking-reference and passenger-ID searches.
// - Filter by the supported Journey Booking lifecycle status.
// - Support a dedicated transaction-reference lookup mode.
// - Notify the parent when filter values change.
//
// This component does not fetch data or implement filtering itself.
// The parent owns state, filtering, and API queries.
// -----------------------------------------------------------------------------

import { useState } from 'react';

import {
  ArrowRight,
  Hash,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';

import {
  Button,
  Input,
  Select,
} from '@/components/ui';

import type { SelectOption } from '@/components/ui';

import {
  JOURNEY_BOOKING_STATUSES,
} from '@/features/journey-booking';

import type {
  JourneyBookingStatus,
} from '@/features/journey-booking';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type JourneyBookingSearchMode = 'bookings' | 'transaction';

export interface JourneyBookingFiltersValue {
  /**
   * Text used to search booking references or passenger IDs.
   */
  search: string;

  /**
   * Optional lifecycle status filter.
   */
  status: JourneyBookingStatus | '';

  /**
   * Optional passenger ID filter.
   */
  passengerPublicId: string;

  /**
   * Transaction public ID for dedicated lookup.
   */
  transactionPublicId: string;

  /**
   * Current search mode.
   */
  mode: JourneyBookingSearchMode;
}

export interface JourneyBookingFiltersProps {
  /**
   * Current controlled filter values.
   */
  value: JourneyBookingFiltersValue;

  /**
   * Called whenever a filter value changes.
   */
  onChange: (value: JourneyBookingFiltersValue) => void;

  /**
   * Called when the user submits a transaction lookup.
   */
  onTransactionSearch?: (transactionPublicId: string) => void;

  /**
   * Indicates whether a transaction lookup is running.
   */
  transactionSearchLoading?: boolean;

  /**
   * Optional styling supplied by the parent component.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const STATUS_OPTIONS: SelectOption[] = [
  {
    label: 'All statuses',
    value: '',
  },
  ...JOURNEY_BOOKING_STATUSES.map((status) => ({
    label:
      status.charAt(0) +
      status.slice(1).toLowerCase(),
    value: status,
  })),
];

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBookingFilters({
  value,
  onChange,
  onTransactionSearch,
  transactionSearchLoading = false,
  className,
}: JourneyBookingFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const isTransactionMode = value.mode === 'transaction';

  const activeFilterCount = [
    value.status !== '',
    value.passengerPublicId.trim() !== '',
  ].filter(Boolean).length;

  const hasActiveFilters =
    value.search.trim() !== '' ||
    value.status !== '' ||
    value.passengerPublicId.trim() !== '' ||
    value.transactionPublicId.trim() !== '';

  function updateFilters(
    changes: Partial<JourneyBookingFiltersValue>,
  ) {
    onChange({
      ...value,
      ...changes,
    });
  }

  function clearFilters() {
    onChange({
      search: '',
      status: '',
      passengerPublicId: '',
      transactionPublicId: '',
      mode: 'bookings',
    });

    setShowAdvancedFilters(false);
  }

  function switchMode(mode: JourneyBookingSearchMode) {
    if (mode === value.mode) {
      return;
    }

    onChange({
      search: '',
      status: '',
      passengerPublicId: '',
      transactionPublicId: '',
      mode,
    });

    setShowAdvancedFilters(false);
  }

  function submitTransactionSearch(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const transactionPublicId = value.transactionPublicId.trim();

    if (
      !transactionPublicId ||
      !onTransactionSearch ||
      transactionSearchLoading
    ) {
      return;
    }

    onTransactionSearch(transactionPublicId);
  }

  return (
    <section
      aria-label="Filter journey bookings"
      className={[
        'rounded-[var(--radius-xl)]',
        'border border-[var(--border)]',
        'bg-[var(--surface)]',
        'p-4 sm:p-5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className={[
              'flex size-9 items-center justify-center',
              'rounded-[var(--radius-md)]',
              'bg-[var(--brand-soft)]',
              'text-[var(--brand)]',
            ].join(' ')}
          >
            <SlidersHorizontal className="size-4" />
          </span>

          <div>
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Find bookings
            </h2>

            <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
              Search bookings for this journey
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            leadingIcon={<X className="size-3.5" />}
            onClick={clearFilters}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Search mode selector */}
      <div
        aria-label="Booking search mode"
        className="mb-4 flex flex-wrap gap-2"
      >
        <Button
          type="button"
          variant={isTransactionMode ? 'outline' : 'primary'}
          size="sm"
          leadingIcon={<Search className="size-3.5" />}
          aria-pressed={!isTransactionMode}
          onClick={() => switchMode('bookings')}
        >
          Search bookings
        </Button>

        <Button
          type="button"
          variant={isTransactionMode ? 'primary' : 'outline'}
          size="sm"
          leadingIcon={<Hash className="size-3.5" />}
          aria-pressed={isTransactionMode}
          onClick={() => switchMode('transaction')}
        >
          Transaction reference
        </Button>
      </div>

      {isTransactionMode ? (
        /* Transaction lookup */
        <form
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={submitTransactionSearch}
        >
          <div className="min-w-0 flex-1">
            <label
              htmlFor="journey-booking-transaction"
              className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
            >
              Transaction public ID
            </label>

            <Input
              id="journey-booking-transaction"
              value={value.transactionPublicId}
              onChange={(event) =>
                updateFilters({
                  transactionPublicId: event.currentTarget.value,
                })
              }
              placeholder="Enter transaction reference"
              autoComplete="off"
            />
          </div>

          <Button
            type="submit"
            loading={transactionSearchLoading}
            disabled={
              !value.transactionPublicId.trim() ||
              !onTransactionSearch
            }
            leadingIcon={<Search className="size-4" />}
            trailingIcon={<ArrowRight className="size-4" />}
          >
            Find booking
          </Button>

          <span className="sr-only" aria-live="polite">
            {transactionSearchLoading
              ? 'Searching for booking'
              : ''}
          </span>
        </form>
      ) : (
        /* Standard booking search */
        <div className="space-y-4">
          <div className="min-w-0">
            <label
              htmlFor="journey-booking-search"
              className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
            >
              Search bookings
            </label>

            <Input
              id="journey-booking-search"
              value={value.search}
              onChange={(event) =>
                updateFilters({
                  search: event.currentTarget.value,
                })
              }
              placeholder="Booking reference or passenger ID"
              autoComplete="off"
            />
          </div>

          {/* Advanced filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              leadingIcon={<SlidersHorizontal className="size-3.5" />}
              aria-expanded={showAdvancedFilters}
              aria-controls="journey-booking-advanced-filters"
              onClick={() =>
                setShowAdvancedFilters((current) => !current)
              }
            >
              More filters
              {activeFilterCount > 0 && (
                <span className="ml-1 rounded-full bg-[var(--brand-soft)] px-1.5 py-0.5 text-xs text-[var(--brand)]">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {showAdvancedFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedFilters(false)}
              >
                Hide filters
              </Button>
            )}
          </div>

          {showAdvancedFilters && (
            <div
              id="journey-booking-advanced-filters"
              className="grid grid-cols-1 gap-4 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-2"
            >
              <div className="min-w-0">
                <label
                  htmlFor="journey-booking-status"
                  className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
                >
                  Booking status
                </label>

                <Select
                  id="journey-booking-status"
                  options={STATUS_OPTIONS}
                  value={value.status}
                  onChange={(event) => {
                    const selectedStatus = event.currentTarget.value;

                    updateFilters({
                      status:
                        selectedStatus === ''
                          ? ''
                          : (selectedStatus as JourneyBookingStatus),
                    });
                  }}
                />
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="journey-booking-passenger"
                  className="mb-1.5 block text-sm font-medium text-[var(--foreground)]"
                >
                  Passenger public ID
                </label>

                <Input
                  id="journey-booking-passenger"
                  value={value.passengerPublicId}
                  onChange={(event) =>
                    updateFilters({
                      passengerPublicId: event.currentTarget.value,
                    })
                  }
                  placeholder="Enter passenger ID"
                  autoComplete="off"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

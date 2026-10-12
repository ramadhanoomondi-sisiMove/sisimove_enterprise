
'use client';

import { useCallback, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui';
import type { JourneyBooking } from '@/features/journey-booking';
import {
  useJourneyBookingByTransaction,
  useJourneyBookingsByJourney,
  useJourneyBookingsByJourneyAndPassenger,
} from '@/features/journey-booking/hooks/queries';

import {
  JourneyBookingFilters,
  type JourneyBookingFiltersValue,
} from './journey-booking-filters';
import { JourneyBookingLoadingState } from './journey-booking-loading-state';
import { JourneyBookingErrorState } from './journey-booking-error-state';
import { JourneyBookingResults } from './journey-booking-results';
import { JourneyBookingEmptyState } from './journey-booking-empty-state';

export interface JourneyBookingsProps {
  journeyPublicId: string;
  className?: string;
}

const INITIAL_FILTERS: JourneyBookingFiltersValue = {
  search: '',
  status: '',
  passengerPublicId: '',
  transactionPublicId: '',
  mode: 'bookings',
};

export function JourneyBookings({
  journeyPublicId,
  className,
}: JourneyBookingsProps) {
  const [filters, setFilters] =
    useState<JourneyBookingFiltersValue>(INITIAL_FILTERS);
  const [filterJourneyPublicId, setFilterJourneyPublicId] =
    useState(journeyPublicId);
  const [submittedTransactionId, setSubmittedTransactionId] =
    useState<string | undefined>();

  const activeFilters =
    filterJourneyPublicId === journeyPublicId ? filters : INITIAL_FILTERS;

  const passengerId = activeFilters.passengerPublicId.trim();

  const {
    data: bookings = [],
    isLoading,
    isError,
    refetch,
  } = useJourneyBookingsByJourney(journeyPublicId);

  const {
    data: passengerBookings = [],
    isLoading: isPassengerLoading,
    isFetching: isPassengerFetching,
    isError: isPassengerError,
    refetch: refetchPassengerBookings,
  } = useJourneyBookingsByJourneyAndPassenger(
    journeyPublicId,
    passengerId || undefined,
    {
      enabled:
        activeFilters.mode === 'bookings' &&
        passengerId.length > 0,
    },
  );

  const {
    data: transactionBooking,
    isLoading: isTransactionLoading,
    isFetching: isTransactionFetching,
    isError: isTransactionError,
    error: transactionError,
    refetch: refetchTransactionBooking,
  } = useJourneyBookingByTransaction(submittedTransactionId, {
    enabled:
      activeFilters.mode === 'transaction' &&
      Boolean(submittedTransactionId),
  });

  const isTransactionSearching =
    isTransactionLoading || isTransactionFetching;

  const isPassengerSearching =
    isPassengerLoading || isPassengerFetching;

  const handleFiltersChange = useCallback(
    (nextFilters: JourneyBookingFiltersValue) => {
      setFilterJourneyPublicId(journeyPublicId);
      setFilters(nextFilters);

      if (
        nextFilters.mode !== 'transaction' ||
        nextFilters.transactionPublicId.trim() !== submittedTransactionId
      ) {
        setSubmittedTransactionId(undefined);
      }
    },
    [journeyPublicId, submittedTransactionId],
  );

  const handleTransactionSearch = useCallback(
    (transactionPublicId: string) => {
      const normalizedId = transactionPublicId.trim();

      if (!normalizedId) return;

      setFilterJourneyPublicId(journeyPublicId);
      setFilters((current) => ({
        ...current,
        mode: 'transaction',
        transactionPublicId: normalizedId,
      }));

      if (normalizedId === submittedTransactionId) {
        void refetchTransactionBooking();
        return;
      }

      setSubmittedTransactionId(normalizedId);
    },
    [journeyPublicId, submittedTransactionId, refetchTransactionBooking],
  );

  const filteredBookings = useMemo(() => {
    const search = activeFilters.search.trim().toLowerCase();
    const passengerSearch = passengerId.toLowerCase();

    const sourceBookings =
      passengerId.length > 0 ? passengerBookings : bookings;

    return sourceBookings.filter((booking: JourneyBooking) => {
      if (booking.journeyPublicId !== journeyPublicId) return false;

      const matchesSearch =
        !search ||
        booking.publicId.toLowerCase().includes(search) ||
        booking.passengerPublicId.toLowerCase().includes(search);

      const matchesStatus =
        !activeFilters.status || booking.status === activeFilters.status;

      const matchesPassenger =
        !passengerSearch ||
        booking.passengerPublicId.toLowerCase().includes(passengerSearch);

      return matchesSearch && matchesStatus && matchesPassenger;
    });
  }, [
    bookings,
    passengerBookings,
    journeyPublicId,
    passengerId,
    activeFilters.search,
    activeFilters.status,
  ]);

  const validTransactionBooking =
    transactionBooking?.journeyPublicId === journeyPublicId
      ? transactionBooking
      : undefined;

  const isBookingListLoading =
    isLoading || (passengerId.length > 0 && isPassengerSearching);

  const isBookingListError =
    passengerId.length > 0 ? isPassengerError : isError;

  const retryBookingList = useCallback(() => {
    if (passengerId.length > 0) {
      void refetchPassengerBookings();
      return;
    }

    void refetch();
  }, [passengerId, refetchPassengerBookings, refetch]);

  const handleRefresh = useCallback(() => {
    if (activeFilters.mode === 'transaction') {
      if (submittedTransactionId) {
        void refetchTransactionBooking();
      }
      return;
    }

    retryBookingList();
  }, [
    activeFilters.mode,
    submittedTransactionId,
    refetchTransactionBooking,
    retryBookingList,
  ]);

  const isRefreshing =
    activeFilters.mode === 'transaction'
      ? isTransactionSearching
      : isBookingListLoading;

  return (
    <section
      aria-label="Journey bookings"
      className={['min-w-0 space-y-6', className].filter(Boolean).join(' ')}
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
            Journey bookings
          </h1>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Manage and review bookings for this journey.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="md"
          leadingIcon={<RefreshCw className="size-4" aria-hidden="true" />}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          Refresh
        </Button>
      </header>

      <JourneyBookingFilters
        value={activeFilters}
        onChange={handleFiltersChange}
        onTransactionSearch={handleTransactionSearch}
        transactionSearchLoading={isTransactionSearching}
      />

      {activeFilters.mode === 'transaction' ? (
        isTransactionSearching ? (
          <JourneyBookingLoadingState
            count={1}
            message="Searching for the transaction booking..."
          />
        ) : isTransactionError ? (
          <JourneyBookingErrorState
            title="Transaction search failed"
            description={
              transactionError instanceof Error
                ? transactionError.message
                : 'We couldn’t look up that transaction. Please try again.'
            }
            onRetry={() => void refetchTransactionBooking()}
          />
        ) : validTransactionBooking ? (
          <JourneyBookingResults
            bookings={[validTransactionBooking]}
            title="Transaction result"
            description="The booking associated with this transaction belongs to the current journey."
          />
        ) : submittedTransactionId ? (
          <JourneyBookingEmptyState
            title="No matching booking found"
            description="No booking for this transaction was found for the current journey."
          />
        ) : (
          <JourneyBookingEmptyState
            title="Search for a transaction"
            description="Enter a transaction public ID to find its booking."
          />
        )
      ) : isBookingListLoading ? (
        <JourneyBookingLoadingState
          message={
            passengerId
              ? 'Searching bookings for this passenger...'
              : 'Loading journey bookings...'
          }
        />
      ) : isBookingListError ? (
        <JourneyBookingErrorState
          title="Unable to load bookings"
          description="We couldn’t load bookings for this journey or passenger. Please try again."
          onRetry={retryBookingList}
        />
      ) : (
        <JourneyBookingResults
          bookings={filteredBookings}
          title="Bookings"
          description={
            passengerId
              ? 'Bookings for the selected passenger on this journey.'
              : 'Bookings associated with the selected journey.'
          }
          emptyTitle={
            filteredBookings.length === 0 && bookings.length === 0
              ? 'No bookings yet'
              : 'No matching bookings'
          }
          emptyDescription={
            filteredBookings.length === 0 && bookings.length === 0
              ? 'Bookings for this journey will appear here when they are created.'
              : 'Try changing your search or clearing one or more filters.'
          }
        />
      )}
    </section>
  );
}

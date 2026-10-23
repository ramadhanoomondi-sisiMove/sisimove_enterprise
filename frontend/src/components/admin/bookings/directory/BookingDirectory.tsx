
'use client';

import { useMemo, useState } from 'react';

import {
  DEFAULT_ADMIN_BOOKING_FILTERS,
  type AdminBooking,
  type AdminBookingFilters,
} from '@/features/admin/bookings';

import {
  useAdminBookingCount,
  useAdminBookings,
} from '@/features/admin/bookings';

import { BookingDirectoryHeader } from './BookingDirectoryHeader';
import { BookingFilters } from './BookingFilters';
import { BookingTable } from './BookingTable';
import { BookingPagination } from './BookingPagination';

interface BookingDirectoryProps {
  onViewBooking?: (booking: AdminBooking) => void;
  className?: string;
}

export function BookingDirectory({
  onViewBooking,
  className = '',
}: BookingDirectoryProps) {
  const [filters, setFilters] = useState<AdminBookingFilters>({
    ...DEFAULT_ADMIN_BOOKING_FILTERS,
  });

  const bookingsQuery = useAdminBookings();
  const countQuery = useAdminBookingCount();

 const bookings = useMemo(
  () => bookingsQuery.data ?? [],
  [bookingsQuery.data],
);

  const filteredBookings = useMemo(() => {
    const search = filters.search?.trim().toLowerCase();

    const filtered = bookings.filter((booking) => {
      if (
        filters.status &&
        booking.status !== filters.status
      ) {
        return false;
      }

      if (
        filters.paymentStatus &&
        booking.payment?.status !== filters.paymentStatus
      ) {
        return false;
      }

      if (
        filters.journeyPublicId?.trim() &&
        !booking.journeyPublicId
          .toLowerCase()
          .includes(filters.journeyPublicId.trim().toLowerCase())
      ) {
        return false;
      }

      if (
        filters.passengerPublicId?.trim() &&
        !booking.passengerPublicId
          .toLowerCase()
          .includes(filters.passengerPublicId.trim().toLowerCase())
      ) {
        return false;
      }

      if (search) {
        const searchableValues = [
          booking.publicId,
          booking.journeyPublicId,
          booking.passengerPublicId,
          booking.snapshot?.originName,
          booking.snapshot?.destinationName,
          booking.status,
          booking.payment?.status,
        ];

        const matchesSearch = searchableValues.some((value) =>
          value?.toLowerCase().includes(search),
        );

        if (!matchesSearch) {
          return false;
        }
      }

      const departure = booking.snapshot?.departureAt
        ? new Date(booking.snapshot.departureAt).getTime()
        : null;

      if (filters.departureFrom) {
        const from = new Date(filters.departureFrom).getTime();

        if (departure == null || departure < from) {
          return false;
        }
      }

      if (filters.departureTo) {
        const toDate = new Date(filters.departureTo);

        // Include the entire selected end date.
        toDate.setHours(23, 59, 59, 999);

        if (
          departure == null ||
          departure > toDate.getTime()
        ) {
          return false;
        }
      }

      const created = new Date(booking.createdAt).getTime();

      if (filters.createdFrom) {
        const from = new Date(filters.createdFrom).getTime();

        if (created < from) {
          return false;
        }
      }

      if (filters.createdTo) {
        const toDate = new Date(filters.createdTo);
        toDate.setHours(23, 59, 59, 999);

        if (created > toDate.getTime()) {
          return false;
        }
      }

      return true;
    });

    return filtered.sort((a, b) => {
      let first: number;
      let second: number;

      switch (filters.sortBy) {
        case 'updatedAt':
          first = new Date(a.updatedAt).getTime();
          second = new Date(b.updatedAt).getTime();
          break;

        case 'departureAt':
          first = a.snapshot?.departureAt
            ? new Date(a.snapshot.departureAt).getTime()
            : 0;
          second = b.snapshot?.departureAt
            ? new Date(b.snapshot.departureAt).getTime()
            : 0;
          break;

        case 'totalAmount':
          first = a.pricing?.totalAmount ?? 0;
          second = b.pricing?.totalAmount ?? 0;
          break;

        case 'createdAt':
        default:
          first = new Date(a.createdAt).getTime();
          second = new Date(b.createdAt).getTime();
          break;
      }

      return filters.sortDirection === 'asc'
        ? first - second
        : second - first;
    });
  }, [bookings, filters]);

  const totalFilteredBookings = filteredBookings.length;
  const pageSize = Math.max(1, filters.pageSize);
  const totalPages = Math.max(
    1,
    Math.ceil(totalFilteredBookings / pageSize),
  );

  const currentPage = Math.min(
    Math.max(1, filters.page),
    totalPages,
  );

  const visibleBookings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;

    return filteredBookings.slice(start, start + pageSize);
  }, [filteredBookings, currentPage, pageSize]);

  function handleFiltersChange(nextFilters: AdminBookingFilters) {
    setFilters({
      ...nextFilters,
      page: 1,
    });
  }

  function handlePageChange(page: number) {
    setFilters((current) => ({
      ...current,
      page: Math.min(Math.max(1, page), totalPages),
    }));
  }

  function handlePageSizeChange(pageSize: number) {
    setFilters((current) => ({
      ...current,
      pageSize,
      page: 1,
    }));
  }

  function handleResetFilters() {
    setFilters({ ...DEFAULT_ADMIN_BOOKING_FILTERS });
  }

  async function handleRefresh() {
    await Promise.all([
      bookingsQuery.refetch(),
      countQuery.refetch(),
    ]);
  }

  const isInitialLoading =
    bookingsQuery.isPending && bookingsQuery.isFetching;

  const isRefreshing =
    bookingsQuery.isFetching || countQuery.isFetching;

  const hasError = bookingsQuery.isError;

  const totalBookingCount =
    typeof countQuery.data === 'number'
      ? countQuery.data
      : bookings.length;

  return (
    <section className={`space-y-5 ${className}`}>
      <BookingDirectoryHeader
        totalBookings={totalBookingCount}
        isLoading={isInitialLoading}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      <BookingFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
        disabled={isInitialLoading}
      />

      {hasError ? (
        <div
          role="alert"
          className="rounded-[var(--radius-lg)] border border-[var(--border)] p-6"
        >
          <h2 className="font-semibold text-[var(--foreground)]">
            Could not load bookings
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Check your connection and try loading the booking records again.
          </p>
          <button
            type="button"
            onClick={handleRefresh}
            className="mt-4 rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-subtle)]"
          >
            Try again
          </button>
        </div>
      ) : isInitialLoading ? (
        <div
          role="status"
          className="rounded-[var(--radius-lg)] border border-[var(--border)] p-8 text-center text-sm text-[var(--foreground-secondary)]"
        >
          Loading booking records…
        </div>
      ) : visibleBookings.length > 0 ? (
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]">
          <BookingTable
            bookings={visibleBookings}
            onView={onViewBooking}
          />

          <BookingPagination
            page={currentPage}
            pageSize={pageSize}
            totalItems={totalFilteredBookings}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] p-8 text-center">
          <h2 className="font-semibold text-[var(--foreground)]">
            {bookings.length === 0
              ? 'No bookings found'
              : 'No matching bookings'}
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            {bookings.length === 0
              ? 'There are no booking records to display yet.'
              : 'Try changing your search or clearing the active filters.'}
          </p>
          {bookings.length > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-subtle)]"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </section>
  );
}

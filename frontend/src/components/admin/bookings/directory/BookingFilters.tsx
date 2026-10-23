
'use client';

import {
  BookingFilterBar,
  BookingFilterChips,
} from '../filters';

import type { AdminBookingFilters } from '@/features/admin/bookings';

interface BookingFiltersProps {
  filters: AdminBookingFilters;
  onFiltersChange: (filters: AdminBookingFilters) => void;
  onReset?: () => void;
  disabled?: boolean;
  showActiveChips?: boolean;
  className?: string;
}

export function BookingFilters({
  filters,
  onFiltersChange,
  onReset,
  disabled = false,
  showActiveChips = true,
  className = '',
}: BookingFiltersProps) {
  return (
    <section
      aria-label="Manage booking filters"
      className={`space-y-3 ${className}`}
    >
      <BookingFilterBar
        filters={filters}
        onFiltersChange={onFiltersChange}
        onReset={onReset}
        disabled={disabled}
      />

      {showActiveChips && !disabled && (
        <BookingFilterChips
          filters={filters}
          onFiltersChange={onFiltersChange}
        />
      )}
    </section>
  );
}

export type { BookingFiltersProps };

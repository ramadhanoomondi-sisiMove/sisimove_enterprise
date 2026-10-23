
'use client';

import { ClipboardList } from 'lucide-react';

import { EmptyState } from '@/components/ui/empty-state';

interface BookingEmptyStateProps {
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
  className?: string;
}

export function BookingEmptyState({
  hasActiveFilters = false,
  onResetFilters,
  className,
}: BookingEmptyStateProps) {
  const canResetFilters = hasActiveFilters && Boolean(onResetFilters);

  return (
    <EmptyState
      icon={<ClipboardList size={24} strokeWidth={1.75} />}
      title={
        hasActiveFilters
          ? 'No bookings match your filters'
          : 'No bookings found'
      }
      description={
        hasActiveFilters
          ? 'Try adjusting your search or clearing the active filters to see more bookings.'
          : 'There are no bookings to display at the moment.'
      }
      primaryAction={
        canResetFilters
          ? {
              label: 'Clear filters',
              variant: 'outline',
              onClick: onResetFilters,
            }
          : undefined
      }
      className={className}
    />
  );
}

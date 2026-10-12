
'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Empty State
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display an empty state for a journey's booking collection.
// - Support different messages for empty journeys and unmatched filters.
// - Reuse the shared design-system EmptyState component.
//
// This component contains no fetching or filtering logic.
// -----------------------------------------------------------------------------

import { ClipboardList } from 'lucide-react';

import { EmptyState } from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBookingEmptyStateProps {
  /**
   * Heading displayed when no bookings are available.
   */
  title?: string;

  /**
   * Supporting explanation for the empty state.
   */
  description?: string;

  /**
   * Additional styling supplied by the parent component.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBookingEmptyState({
  title = 'No bookings found',
  description = 'There are no bookings to display for this journey and the current filters.',
  className,
}: JourneyBookingEmptyStateProps) {
  return (
    <EmptyState
      icon={<ClipboardList className="size-6" strokeWidth={1.7} />}
      title={title}
      description={description}
      className={className}
    />
  );
}


'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Error State
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display a clear message when journey bookings cannot be loaded.
// - Allow the parent to supply a retry action.
// - Optionally provide a secondary action.
// - Reuse the shared design-system ErrorState component.
//
// This component does not perform API requests or decide retry behavior.
// -----------------------------------------------------------------------------

import { AlertCircle, RefreshCw } from 'lucide-react';

import { ErrorState } from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBookingErrorStateProps {
  /**
   * Heading displayed when a booking operation fails.
   */
  title?: string;

  /**
   * User-friendly explanation of the error.
   */
  description?: string;

  /**
   * Callback invoked when the user selects Retry.
   */
  onRetry?: () => void;

  /**
   * Optional secondary action.
   */
  onSecondaryAction?: () => void;

  /**
   * Label for the optional secondary action.
   */
  secondaryActionLabel?: string;

  /**
   * Additional styling supplied by the parent component.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBookingErrorState({
  title = 'Unable to load bookings',
  description = 'We could not retrieve the bookings for this journey. Please try again.',
  onRetry,
  onSecondaryAction,
  secondaryActionLabel = 'Go back',
  className,
}: JourneyBookingErrorStateProps) {
  return (
    <ErrorState
      icon={<AlertCircle className="size-6" strokeWidth={1.7} />}
      title={title}
      description={description}
      retryAction={
        onRetry
          ? {
              label: 'Try again',
              variant: 'primary',
              leadingContent: (
                <RefreshCw className="size-4" aria-hidden="true" />
              ),
              onClick: onRetry,
            }
          : undefined
      }
      secondaryAction={
        onSecondaryAction
          ? {
              label: secondaryActionLabel,
              variant: 'outline',
              onClick: onSecondaryAction,
            }
          : undefined
      }
      className={className}
    />
  );
}

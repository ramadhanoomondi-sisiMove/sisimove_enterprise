// -----------------------------------------------------------------------------
// sisiMove — Confirm Journey Booking Action
// -----------------------------------------------------------------------------
//
// Single presentation control for requesting confirmation of a Journey
// Booking.
//
// This component does not determine whether the booking can be confirmed.
// The backend JourneyBooking aggregate remains authoritative.
// -----------------------------------------------------------------------------

import type { ButtonHTMLAttributes } from 'react';
import { Button } from '@/components/ui';

export interface ConfirmJourneyBookingActionProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'disabled'> {
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
}

export function ConfirmJourneyBookingAction({
  onConfirm,
  loading = false,
  disabled = false,
  className,
  ...buttonProps
}: ConfirmJourneyBookingActionProps) {
  const isDisabled = disabled || loading;

  return (
    <Button
      {...buttonProps}
      type="button"
      variant="primary"
      disabled={isDisabled}
      onClick={() => {
        void onConfirm();
      }}
      aria-busy={loading}
      className={className}
    >
      {loading ? 'Confirming…' : 'Confirm booking'}
    </Button>
  );
}
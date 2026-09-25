// -----------------------------------------------------------------------------
// sisiMove — Cancel Journey Booking Action
// -----------------------------------------------------------------------------

import { useState } from 'react';
import type { JourneyBookingCancellationReason } from '@/features/journey-booking/models';
import { Button } from '@/components/ui';

export interface CancelJourneyBookingActionProps {
  onCancel: (
    reason: JourneyBookingCancellationReason,
    reasonDescription?: string,
  ) => void | Promise<void>;

  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const CANCELLATION_REASONS: Array<{
  value: JourneyBookingCancellationReason;
  label: string;
}> = [
  { value: 'PASSENGER_REQUEST', label: 'Passenger request' },
  { value: 'PROVIDER_REQUEST', label: 'Provider request' },
  { value: 'JOURNEY_CANCELLED', label: 'Journey cancelled' },
  { value: 'NO_SHOW', label: 'No show' },
  { value: 'SYSTEM', label: 'System' },
  { value: 'OTHER', label: 'Other' },
];

export function CancelJourneyBookingAction({
  onCancel,
  loading = false,
  disabled = false,
  className,
}: CancelJourneyBookingActionProps) {
  const [reason, setReason] =
    useState<JourneyBookingCancellationReason>('PASSENGER_REQUEST');

  const [reasonDescription, setReasonDescription] = useState('');

  const requiresDescription = reason === 'OTHER';

  const canSubmit =
    !disabled &&
    !loading &&
    (!requiresDescription || reasonDescription.trim().length > 0);

  function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    const description = reasonDescription.trim();

    void onCancel(
      reason,
      description.length > 0 ? description : undefined,
    );
  }

  return (
    <div
      className={[
        'flex',
        'w-full',
        'flex-col',
        'gap-3',
        'rounded-[var(--radius-lg)]',
        'border',
        'border-[var(--border)]',
        'bg-[var(--surface)]',
        'p-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div>
        <p className="text-sm font-semibold text-[var(--foreground)]">
          Cancel booking
        </p>

        <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
          Select the reason for cancelling this booking.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="journey-booking-cancellation-reason"
          className="text-xs font-medium text-[var(--foreground-secondary)]"
        >
          Reason
        </label>

        <select
          id="journey-booking-cancellation-reason"
          value={reason}
          disabled={disabled || loading}
          onChange={(event) => {
            setReason(
              event.target.value as JourneyBookingCancellationReason,
            );
          }}
          className={[
            'min-h-10',
            'w-full',
            'rounded-[var(--radius-md)]',
            'border',
            'border-[var(--border)]',
            'bg-[var(--surface)]',
            'px-3',
            'text-sm',
            'text-[var(--foreground)]',
            'outline-none',
            'focus:border-[var(--brand)]',
            'focus:ring-2',
            'focus:ring-[var(--brand-soft)]',
            'disabled:cursor-not-allowed',
            'disabled:opacity-60',
          ].join(' ')}
        >
          {CANCELLATION_REASONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="journey-booking-cancellation-description"
          className="text-xs font-medium text-[var(--foreground-secondary)]"
        >
          {requiresDescription ? 'Explanation' : 'Explanation (optional)'}
        </label>

        <textarea
          id="journey-booking-cancellation-description"
          value={reasonDescription}
          disabled={disabled || loading}
          required={requiresDescription}
          rows={3}
          maxLength={1000}
          onChange={(event) => {
            setReasonDescription(event.target.value);
          }}
          placeholder={
            requiresDescription
              ? 'Please explain why the booking is being cancelled.'
              : 'Add an explanation if helpful.'
          }
          className={[
            'w-full',
            'resize-y',
            'rounded-[var(--radius-md)]',
            'border',
            'border-[var(--border)]',
            'bg-[var(--surface)]',
            'px-3',
            'py-2.5',
            'text-sm',
            'text-[var(--foreground)]',
            'outline-none',
            'placeholder:text-[var(--foreground-subtle)]',
            'focus:border-[var(--brand)]',
            'focus:ring-2',
            'focus:ring-[var(--brand-soft)]',
            'disabled:cursor-not-allowed',
            'disabled:opacity-60',
          ].join(' ')}
        />

        <p className="text-right text-[11px] text-[var(--foreground-subtle)]">
          {reasonDescription.length}/1000
        </p>
      </div>

      <Button
        type="button"
        variant="danger"
        disabled={!canSubmit}
        onClick={handleSubmit}
        aria-busy={loading}
      >
        {loading ? 'Cancelling…' : 'Cancel booking'}
      </Button>
    </div>
  );
}
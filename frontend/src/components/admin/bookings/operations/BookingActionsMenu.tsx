
'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  MoreHorizontal,
  XCircle,
} from 'lucide-react';

import type { AdminBooking } from '@/features/admin/bookings';
import { cn } from '@/foundation/utils/cn';

import type { BookingOperation } from './BookingOperationDialog';

export interface BookingActionsMenuProps {
  booking: AdminBooking;
  onSelectOperation: (operation: BookingOperation) => void;
  disabled?: boolean;
  className?: string;
}

interface OperationOption {
  id: BookingOperation;
  label: string;
  description: string;
  icon: typeof CheckCircle2;
  destructive?: boolean;
}

function normalizeStatus(value: string | null | undefined): string {
  return (value ?? '').trim().toUpperCase();
}

export function BookingActionsMenu({
  booking,
  onSelectOperation,
  disabled = false,
  className,
}: BookingActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const bookingStatus = normalizeStatus(booking.status);
  const paymentStatus = normalizeStatus(booking.payment?.status);

  const isCancelled =
    bookingStatus === 'CANCELLED' ||
    bookingStatus === 'COMPLETED' ||
    bookingStatus === 'EXPIRED';

  const canConfirm = bookingStatus === 'PENDING';
  const canCancel =
    bookingStatus === 'PENDING' || bookingStatus === 'CONFIRMED';
  const canComplete = bookingStatus === 'CONFIRMED';
  const canExpire =
    bookingStatus === 'PENDING' || bookingStatus === 'CONFIRMED';

  const options: OperationOption[] = [];

  if (canConfirm) {
    options.push({
      id: 'confirm',
      label: 'Confirm booking',
      description: 'Confirm the booking with its payment transaction.',
      icon: CheckCircle2,
    });
  }

  if (canComplete) {
    options.push({
      id: 'complete',
      label: 'Complete booking',
      description: 'Mark the confirmed booking as completed.',
      icon: CheckCircle2,
    });
  }

  if (canExpire) {
    options.push({
      id: 'expire',
      label: 'Expire booking',
      description: 'Mark the booking as expired.',
      icon: Clock3,
      destructive: true,
    });
  }

  if (canCancel) {
    options.push({
      id: 'cancel',
      label: 'Cancel booking',
      description: 'Record a cancellation reason.',
      icon: XCircle,
      destructive: true,
    });
  }

  if (booking.payment) {
    if (
      paymentStatus !== 'CAPTURED' &&
      paymentStatus !== 'REFUNDED' &&
      paymentStatus !== 'PARTIALLY_REFUNDED'
    ) {
      options.push({
        id: 'authorize-payment',
        label: 'Authorize payment',
        description: 'Associate a transaction with the payment.',
        icon: CreditCard,
      });
    }

    if (paymentStatus === 'AUTHORIZED') {
      options.push({
        id: 'capture-payment',
        label: 'Capture payment',
        description: 'Request capture of the authorized payment.',
        icon: CreditCard,
      });
    }

    if (
      paymentStatus !== 'CAPTURED' &&
      paymentStatus !== 'REFUNDED' &&
      paymentStatus !== 'PARTIALLY_REFUNDED' &&
      paymentStatus !== 'FAILED'
    ) {
      options.push({
        id: 'fail-payment',
        label: 'Record payment failure',
        description: 'Record why the payment failed.',
        icon: XCircle,
        destructive: true,
      });
    }

    if (paymentStatus === 'CAPTURED') {
      options.push({
        id: 'refund-payment',
        label: 'Refund payment',
        description: 'Request a full payment refund.',
        icon: CreditCard,
        destructive: true,
      });

      options.push({
        id: 'partial-refund-payment',
        label: 'Partially refund payment',
        description: 'Record a partial refund and remaining amount.',
        icon: CreditCard,
        destructive: true,
      });
    }
  }

  const handleSelect = (operation: BookingOperation) => {
    setIsOpen(false);
    onSelectOperation(operation);
  };

  return (
    <div
      className={cn('relative inline-flex', className)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={cn(
          'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--foreground)] transition-colors',
          'hover:bg-[var(--background-subtle)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        <MoreHorizontal className="size-4" aria-hidden="true" />
        <span>Actions</span>
        <ChevronDown
          className={cn(
            'size-4 transition-transform',
            isOpen && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close actions menu"
            className="fixed inset-0 z-30 cursor-default"
            onClick={() => setIsOpen(false)}
          />

          <div
            role="menu"
            aria-label="Booking operations"
            className="absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-xl"
          >
            <div className="border-b border-[var(--border-subtle)] px-3 py-3">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                Booking operations
              </p>
              <p className="mt-1 break-all text-xs text-[var(--foreground-muted)]">
                {booking.publicId}
              </p>
              <p className="mt-2 text-xs text-[var(--foreground-secondary)]">
                Status: {booking.status.replaceAll('_', ' ')}
              </p>
            </div>

            {options.length > 0 ? (
              <div className="max-h-[min(65vh,28rem)] overflow-y-auto py-1">
                {options.map((option) => {
                  const Icon = option.icon;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="menuitem"
                      disabled={disabled}
                      onClick={() => handleSelect(option.id)}
                      className={cn(
                        'flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors',
                        'hover:bg-[var(--background-subtle)]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand)]',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                      )}
                    >
                      <span
                        className={cn(
                          'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl',
                          option.destructive
                            ? 'bg-[var(--danger-soft)] text-[var(--danger)]'
                            : 'bg-[var(--background-subtle)] text-[var(--foreground-secondary)]',
                        )}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            'block text-sm font-semibold',
                            option.destructive
                              ? 'text-[var(--danger)]'
                              : 'text-[var(--foreground)]',
                          )}
                        >
                          {option.label}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-[var(--foreground-secondary)]">
                          {option.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="px-3 py-5">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  No available operations
                </p>
                <p className="mt-1 text-xs leading-5 text-[var(--foreground-secondary)]">
                  There are no standard booking actions available for the
                  current booking state.
                </p>
              </div>
            )}

            {isCancelled && (
              <div className="border-t border-[var(--border-subtle)] px-3 py-3">
                <p className="text-xs leading-5 text-[var(--foreground-muted)]">
                  This booking has reached a terminal lifecycle state.
                  Payment options, when available, are listed separately.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default BookingActionsMenu;

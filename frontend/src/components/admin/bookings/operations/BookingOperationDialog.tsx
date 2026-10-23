
'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  ShieldAlert,
} from 'lucide-react';

import { Dialog } from '@/components/ui/dialog';
import type { AdminBooking } from '@/features/admin/bookings';
import {
  useCancelAdminBooking,
  useCaptureAdminBookingPayment,
  useCompleteAdminBooking,
  useConfirmAdminBooking,
  useExpireAdminBooking,
  useFailAdminBookingPayment,
  useAuthorizeAdminBookingPayment,
  usePartiallyRefundAdminBookingPayment,
  useRefundAdminBookingPayment,
} from '@/features/admin/bookings/hooks/useAdminMutations';
import { cn } from '@/foundation/utils/cn';

export type BookingOperation =
  | 'confirm'
  | 'cancel'
  | 'complete'
  | 'expire'
  | 'authorize-payment'
  | 'capture-payment'
  | 'fail-payment'
  | 'refund-payment'
  | 'partial-refund-payment';

interface BookingOperationDialogProps {
  booking: AdminBooking;
  operation: BookingOperation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

interface OperationConfig {
  title: string;
  description: string;
  submitLabel: string;
  successMessage: string;
  warning?: string;
  destructive?: boolean;
}

const OPERATION_CONFIG: Record<BookingOperation, OperationConfig> = {
  confirm: {
    title: 'Confirm booking',
    description:
      'Confirm this booking using the payment transaction reference.',
    submitLabel: 'Confirm booking',
    successMessage: 'Booking confirmed successfully.',
  },
  cancel: {
    title: 'Cancel booking',
    description:
      'Record why this booking is being cancelled. This action changes its lifecycle state.',
    submitLabel: 'Cancel booking',
    successMessage: 'Booking cancelled successfully.',
    warning: 'Cancellation may not be reversible.',
    destructive: true,
  },
  complete: {
    title: 'Complete booking',
    description: 'Mark this confirmed booking as completed.',
    submitLabel: 'Complete booking',
    successMessage: 'Booking marked as completed.',
  },
  expire: {
    title: 'Expire booking',
    description: 'Mark this booking as expired.',
    submitLabel: 'Expire booking',
    successMessage: 'Booking marked as expired.',
    warning: 'Only proceed if the booking should no longer remain active.',
    destructive: true,
  },
  'authorize-payment': {
    title: 'Authorize payment',
    description:
      'Provide the transaction public ID for the payment authorization.',
    submitLabel: 'Authorize payment',
    successMessage: 'Payment authorization recorded successfully.',
    warning: 'Confirm the transaction reference before proceeding.',
  },
  'capture-payment': {
    title: 'Capture payment',
    description:
      'Request capture of the authorized payment for this booking.',
    submitLabel: 'Capture payment',
    successMessage: 'Payment capture completed successfully.',
    warning:
      'This is a financial operation. Verify the payment before proceeding.',
  },
  'fail-payment': {
    title: 'Record payment failure',
    description: 'Provide the reason the payment failed.',
    submitLabel: 'Record failure',
    successMessage: 'Payment failure recorded.',
    destructive: true,
  },
  'refund-payment': {
    title: 'Refund payment',
    description: 'Request a full refund for the captured payment.',
    submitLabel: 'Refund payment',
    successMessage: 'Full refund request completed successfully.',
    warning:
      'This is a financial operation. Confirm the payment and refund eligibility before proceeding.',
    destructive: true,
  },
  'partial-refund-payment': {
    title: 'Partially refund payment',
    description:
      'Enter the amount being refunded and the remaining payment amount.',
    submitLabel: 'Submit partial refund',
    successMessage: 'Partial refund request completed successfully.',
    warning:
      'Verify both amounts. The backend remains responsible for financial validation.',
    destructive: true,
  },
};

const fieldClassName =
  'mt-1.5 block w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15 disabled:opacity-60';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return 'The operation could not be completed. Please try again.';
}

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString('en-KE')}`;
  }
}

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>

      {children}

      {hint && (
        <p className="mt-1.5 text-xs leading-5 text-[var(--foreground-muted)]">
          {hint}
        </p>
      )}
    </div>
  );
}

/**
 * The wrapper only mounts the form while an operation is selected and open.
 * Closing or switching operations unmounts the form, resetting its local state
 * without synchronously calling setState inside an effect.
 */
export function BookingOperationDialog(
  props: BookingOperationDialogProps,
) {
  const { booking, operation, open } = props;

  if (!open || !operation) {
    return null;
  }

  return (
    <BookingOperationDialogForm
      key={`${booking.publicId}:${operation}`}
      {...props}
      operation={operation}
    />
  );
}

interface BookingOperationDialogFormProps
  extends Omit<BookingOperationDialogProps, 'operation'> {
  operation: BookingOperation;
}

function BookingOperationDialogForm({
  booking,
  operation,
  onOpenChange,
  onSuccess,
  onError,
}: BookingOperationDialogFormProps) {
  // operation is non-null here, so config is always defined.
  const config = OPERATION_CONFIG[operation];

  const confirmMutation = useConfirmAdminBooking();
  const cancelMutation = useCancelAdminBooking();
  const completeMutation = useCompleteAdminBooking();
  const expireMutation = useExpireAdminBooking();
  const authorizePaymentMutation = useAuthorizeAdminBookingPayment();
  const capturePaymentMutation = useCaptureAdminBookingPayment();
  const failPaymentMutation = useFailAdminBookingPayment();
  const refundPaymentMutation = useRefundAdminBookingPayment();
  const partialRefundMutation = usePartiallyRefundAdminBookingPayment();

  const [transactionPublicId, setTransactionPublicId] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancellationDescription, setCancellationDescription] = useState('');
  const [failureReason, setFailureReason] = useState('');
  const [refundedAmount, setRefundedAmount] = useState('');
  const [remainingAmount, setRemainingAmount] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isPending =
    confirmMutation.isPending ||
    cancelMutation.isPending ||
    completeMutation.isPending ||
    expireMutation.isPending ||
    authorizePaymentMutation.isPending ||
    capturePaymentMutation.isPending ||
    failPaymentMutation.isPending ||
    refundPaymentMutation.isPending ||
    partialRefundMutation.isPending;

  const requiresAcknowledgement =
    operation === 'cancel' ||
    operation === 'expire' ||
    operation === 'capture-payment' ||
    operation === 'refund-payment' ||
    operation === 'partial-refund-payment';

  const paymentAmount = booking.payment?.amount ?? 0;
  const paymentCurrency = booking.payment?.currency ?? 'KES';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (isPending) return;

    if (requiresAcknowledgement && !acknowledged) {
      setFormError('Please confirm that you have reviewed this operation.');
      return;
    }

    try {
      switch (operation) {
        case 'confirm': {
          const transactionId = transactionPublicId.trim();

          if (!transactionId) {
            setFormError('Enter the transaction public ID.');
            return;
          }

          await confirmMutation.mutateAsync({
            journeyBookingPublicId: booking.publicId,
            request: { transactionPublicId: transactionId },
          });
          break;
        }

        case 'cancel': {
          const reason = cancellationReason.trim();

          if (!reason) {
            setFormError('Enter a cancellation reason.');
            return;
          }

          await cancelMutation.mutateAsync({
            journeyBookingPublicId: booking.publicId,
            request: {
              reason,
              reasonDescription:
                cancellationDescription.trim() || undefined,
            },
          });
          break;
        }

        case 'complete':
          await completeMutation.mutateAsync({
            journeyBookingPublicId: booking.publicId,
          });
          break;

        case 'expire':
          await expireMutation.mutateAsync({
            journeyBookingPublicId: booking.publicId,
          });
          break;

        case 'authorize-payment': {
          const transactionId = transactionPublicId.trim();

          if (!transactionId) {
            setFormError('Enter the transaction public ID.');
            return;
          }

          await authorizePaymentMutation.mutateAsync({
            journeyBookingPublicId: booking.publicId,
            request: { transactionPublicId: transactionId },
          });
          break;
        }

        case 'capture-payment':
          await capturePaymentMutation.mutateAsync({
            journeyBookingPublicId: booking.publicId,
          });
          break;

        case 'fail-payment': {
          const reason = failureReason.trim();

          if (!reason) {
            setFormError('Enter the payment failure reason.');
            return;
          }

          await failPaymentMutation.mutateAsync({
            journeyBookingPublicId: booking.publicId,
            request: { failureReason: reason },
          });
          break;
        }

        case 'refund-payment':
          await refundPaymentMutation.mutateAsync({
            journeyBookingPublicId: booking.publicId,
          });
          break;

        case 'partial-refund-payment': {
          const refunded = Number(refundedAmount);
          const remaining = Number(remainingAmount);

          if (
            refundedAmount.trim() === '' ||
            !Number.isFinite(refunded) ||
            refunded <= 0
          ) {
            setFormError('Enter a refund amount greater than zero.');
            return;
          }

          if (
            remainingAmount.trim() === '' ||
            !Number.isFinite(remaining) ||
            remaining < 0
          ) {
            setFormError('Enter a valid remaining amount.');
            return;
          }

          if (refunded + remaining > paymentAmount) {
            setFormError(
              'The refund and remaining amounts cannot exceed the recorded payment amount.',
            );
            return;
          }

          await partialRefundMutation.mutateAsync({
            journeyBookingPublicId: booking.publicId,
            request: {
              refundedAmount: refunded,
              remainingAmount: remaining,
            },
          });
          break;
        }
      }

      onOpenChange(false);
      onSuccess?.(config.successMessage);
    } catch (error) {
      const message = getErrorMessage(error);
      setFormError(message);
      onError?.(message);
    }
  }

  const isConfirmationOnly =
    operation === 'complete' ||
    operation === 'expire' ||
    operation === 'capture-payment' ||
    operation === 'refund-payment';

  return (
    <Dialog
      open
      onOpenChange={(nextOpen) => {
        if (!isPending) {
          onOpenChange(nextOpen);
        }
      }}
      title={config.title}
      description={config.description}
      size="md"
      closeOnBackdropClick={!isPending}
      closeOnEscape={!isPending}
      showCloseButton={!isPending}
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--background-subtle)] disabled:opacity-50"
          >
            Keep booking unchanged
          </button>

          <button
            type="submit"
            form="booking-operation-form"
            disabled={isPending}
            className={cn(
              'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60',
              config.destructive
                ? 'bg-[var(--danger)] hover:opacity-90'
                : 'bg-[var(--brand)] hover:opacity-90',
            )}
          >
            {isPending ? (
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <CheckCircle2 className="size-4" aria-hidden="true" />
            )}
            {isPending ? 'Processing…' : config.submitLabel}
          </button>
        </div>
      }
    >
      <form
        id="booking-operation-form"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-4">
          <p className="text-xs font-medium text-[var(--foreground-muted)]">
            Booking reference
          </p>

          <p className="mt-1 break-all text-sm font-semibold text-[var(--foreground)]">
            {booking.publicId}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--foreground-secondary)]">
            <span>Status: {booking.status.replaceAll('_', ' ')}</span>
            <span>Seats: {booking.seats}</span>
          </div>
        </div>

        {config.warning && (
          <div className="flex gap-3 rounded-xl border border-[var(--warning)]/25 bg-[var(--warning-soft)] p-3.5">
            <AlertTriangle
              className="mt-0.5 size-5 shrink-0 text-[var(--warning)]"
              aria-hidden="true"
            />
            <p className="text-sm leading-6 text-[var(--foreground)]">
              {config.warning}
            </p>
          </div>
        )}

        {operation === 'confirm' && (
          <FormField
            label="Transaction public ID"
            hint="Use the transaction reference associated with this booking's payment."
          >
            <input
              autoFocus
              required
              value={transactionPublicId}
              onChange={(event) =>
                setTransactionPublicId(event.target.value)
              }
              placeholder="Enter transaction public ID"
              className={fieldClassName}
              disabled={isPending}
            />
          </FormField>
        )}

        {operation === 'authorize-payment' && (
          <FormField
            label="Transaction public ID"
            hint="Enter the existing transaction reference. Authorization is processed by the backend."
          >
            <input
              autoFocus
              required
              value={transactionPublicId}
              onChange={(event) =>
                setTransactionPublicId(event.target.value)
              }
              placeholder="Enter transaction public ID"
              className={fieldClassName}
              disabled={isPending}
            />
          </FormField>
        )}

        {operation === 'cancel' && (
          <>
            <FormField label="Cancellation reason">
              <input
                autoFocus
                required
                maxLength={160}
                value={cancellationReason}
                onChange={(event) =>
                  setCancellationReason(event.target.value)
                }
                placeholder="Enter the reason for cancellation"
                className={fieldClassName}
                disabled={isPending}
              />
            </FormField>

            <FormField
              label="Additional details"
              hint="Optional context to help with the audit trail."
            >
              <textarea
                rows={3}
                maxLength={1000}
                value={cancellationDescription}
                onChange={(event) =>
                  setCancellationDescription(event.target.value)
                }
                placeholder="Add further details"
                className={cn(fieldClassName, 'resize-y')}
                disabled={isPending}
              />
            </FormField>
          </>
        )}

        {operation === 'fail-payment' && (
          <FormField label="Payment failure reason">
            <textarea
              autoFocus
              required
              rows={3}
              maxLength={1000}
              value={failureReason}
              onChange={(event) => setFailureReason(event.target.value)}
              placeholder="Explain why the payment failed"
              className={cn(fieldClassName, 'resize-y')}
              disabled={isPending}
            />
          </FormField>
        )}

        {operation === 'partial-refund-payment' && (
          <>
            <div className="rounded-xl border border-[var(--border-subtle)] p-4">
              <p className="text-xs text-[var(--foreground-muted)]">
                Recorded payment amount
              </p>
              <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                {formatMoney(paymentAmount, paymentCurrency)}
              </p>
            </div>

            <FormField label={`Refund amount (${paymentCurrency})`}>
              <input
                autoFocus
                required
                type="number"
                min="0.01"
                step="0.01"
                value={refundedAmount}
                onChange={(event) => setRefundedAmount(event.target.value)}
                placeholder="0.00"
                className={fieldClassName}
                disabled={isPending}
              />
            </FormField>

            <FormField
              label={`Remaining amount (${paymentCurrency})`}
              hint="Enter the amount that will remain after the partial refund."
            >
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={remainingAmount}
                onChange={(event) => setRemainingAmount(event.target.value)}
                placeholder="0.00"
                className={fieldClassName}
                disabled={isPending}
              />
            </FormField>
          </>
        )}

        {isConfirmationOnly && (
          <div className="flex items-start gap-3 rounded-xl border border-[var(--border-subtle)] p-4">
            <ShieldAlert
              className="mt-0.5 size-5 shrink-0 text-[var(--foreground-secondary)]"
              aria-hidden="true"
            />
            <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
              Review the booking reference and current state before
              confirming this operation.
            </p>
          </div>
        )}

        {requiresAcknowledgement && (
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--border-subtle)] p-3.5">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(event) => setAcknowledged(event.target.checked)}
              disabled={isPending}
              className="mt-1 size-4 shrink-0 accent-[var(--brand)]"
            />
            <span className="text-sm leading-6 text-[var(--foreground-secondary)]">
              I have reviewed the booking and understand the consequences of
              this operation.
            </span>
          </label>
        )}

        {formError && (
          <div
            role="alert"
            className="rounded-xl border border-[var(--danger)]/25 bg-[var(--danger-soft)] p-3.5 text-sm leading-6 text-[var(--danger)]"
          >
            {formError}
          </div>
        )}

        {isPending && (
          <p
            className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]"
            role="status"
          >
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Processing the request. Please wait…
          </p>
        )}

        {operation === 'refund-payment' && (
          <div className="flex items-start gap-3 rounded-xl border border-[var(--danger)]/20 bg-[var(--danger-soft)] p-3.5">
            <CreditCard
              className="mt-0.5 size-5 shrink-0 text-[var(--danger)]"
              aria-hidden="true"
            />
            <p className="text-sm leading-6 text-[var(--foreground)]">
              Only proceed after verifying that the payment is eligible for a
              full refund. The backend determines whether the refund can be
              processed.
            </p>
          </div>
        )}
      </form>
    </Dialog>
  );
}

export default BookingOperationDialog;

// =============================================================================
// sisiMove — Financial Payments List
// =============================================================================
//
// Displays the authenticated member's Financial Payment history.
//
// Responsibilities:
// - retrieve the member's payments through useListPayments;
// - display payment amounts and lifecycle statuses;
// - distinguish STK Push and C2B payments;
// - display the original C2B payment reference;
// - allow reconciliation retries for pending C2B payments;
// - refresh payment history after reconciliation.
//
// Architectural boundaries:
// - The backend owns payment lifecycle transitions.
// - The backend enforces payment and account ownership.
// - The frontend never marks a payment as successful optimistically.
// - Retrying reconciliation never creates another FinancialPayment.
// - Existing payment records remain visible regardless of lifecycle status.
//
// =============================================================================

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';

import {
  useListPayments,
  useReconcileC2BPayment,
  LIST_PAYMENTS_QUERY_KEY,
} from '@/features/financial-payments/hooks';

import {
  FinancialAmount,
  FinancialStatusBadge,
} from '../shared';

// =============================================================================
// Status Presentation
// =============================================================================

interface PaymentStatusPresentation {
  label: string;
  tone: 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
}

const PAYMENT_STATUS_PRESENTATION: Record<
  string,
  PaymentStatusPresentation
> = {
  PENDING: { label: 'Pending', tone: 'warning' },
  PROCESSING: { label: 'Processing', tone: 'brand' },
  SUCCEEDED: { label: 'Successful', tone: 'success' },
  FAILED: { label: 'Failed', tone: 'danger' },
  CANCELLED: { label: 'Cancelled', tone: 'neutral' },
  EXPIRED: { label: 'Expired', tone: 'neutral' },
};

// =============================================================================
// Date Formatting
// =============================================================================

function formatPaymentDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-KE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// =============================================================================
// Payment Channel Presentation
// =============================================================================

function getPaymentChannelLabel(channel: string): string {
  switch (channel) {
    case 'C2B':
      return 'M-PESA PayBill';
    case 'STK_PUSH':
      return 'M-PESA STK Push';
    default:
      return channel;
  }
}

// =============================================================================
// Financial Payments List
// =============================================================================

export function FinancialPaymentsList() {
  const queryClient = useQueryClient();

  const {
    data: payments,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useListPayments();

  const reconciliation = useReconcileC2BPayment();

  const [reconcilingReference, setReconcilingReference] =
    useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // C2B Reconciliation
  // ---------------------------------------------------------------------------

  function handleReconcile(reference: string) {
    reconciliation.reset();
    setReconcilingReference(reference);

    reconciliation.mutate(
      { reference },
      {
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: LIST_PAYMENTS_QUERY_KEY,
            }),
          ]);
        },
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Loading State
  // ---------------------------------------------------------------------------

  if (isPending) {
    return (
      <section
        className="surface p-6"
        aria-live="polite"
      >
        <p className="text-sm text-[var(--foreground-muted)]">
          Loading your payment history...
        </p>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Error State
  // ---------------------------------------------------------------------------

  if (isError) {
    return (
      <section className="surface p-6" role="alert">
        <h3 className="font-semibold text-[var(--foreground)]">
          Unable to load payments
        </h3>

        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          {error instanceof Error
            ? error.message
            : 'Something went wrong while retrieving your payment history.'}
        </p>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          loading={isFetching}
          onClick={() => void refetch()}
        >
          Try again
        </Button>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Empty State
  // ---------------------------------------------------------------------------

  if (!payments?.length) {
    return (
      <section className="surface p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <h3 className="font-semibold text-[var(--foreground)]">
            No payments yet
          </h3>

          <p className="mt-2 max-w-sm text-sm text-[var(--foreground-muted)]">
            Your payment history will appear here when you make a payment.
          </p>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Payment History
  // ---------------------------------------------------------------------------

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Payment history
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            View and manage your previous payments.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={isFetching}
          onClick={() => void refetch()}
        >
          Refresh
        </Button>
      </div>

      {reconciliation.isSuccess &&
        reconciliation.data &&
        reconcilingReference && (
          <div
            className="surface p-3"
            role="status"
          >
            <p className="text-sm text-[var(--foreground)]">
              {reconciliation.data.message}
            </p>
          </div>
        )}

      {reconciliation.isError && (
        <div
          className="rounded-xl border border-[var(--danger)] bg-[var(--danger-soft)] p-3"
          role="alert"
        >
          <p className="text-sm text-[var(--danger)]">
            {reconciliation.error instanceof Error
              ? reconciliation.error.message
              : 'Unable to check this payment. Please try again.'}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {payments.map((payment) => {
          const status =
            PAYMENT_STATUS_PRESENTATION[payment.status] ?? {
              label: payment.status,
              tone: 'neutral' as const,
            };

          const isPendingC2B =
            payment.channel === 'C2B' &&
            payment.status === 'PENDING' &&
            Boolean(payment.c2bReference);

          const isReconciling =
            reconciliation.isPending &&
            reconcilingReference === payment.c2bReference;

          return (
            <article
              key={payment.publicId}
              className="surface p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-[var(--foreground)]">
                    {getPaymentChannelLabel(payment.channel)}
                  </p>

                  <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                    {formatPaymentDate(payment.initiatedAt)}
                  </p>
                </div>

                <FinancialStatusBadge
                  label={status.label}
                  tone={status.tone}
                  size="sm"
                />
              </div>

              <div className="mt-4">
                <FinancialAmount
                  amount={payment.amount}
                  currency={payment.currency}
                  className="text-xl font-semibold"
                />
              </div>

              {payment.c2bReference && (
                <div className="mt-4 rounded-lg bg-[var(--background-muted)] p-3">
                  <p className="text-xs text-[var(--foreground-muted)]">
                    PayBill account reference
                  </p>

                  <p className="mt-1 break-all font-mono text-sm font-semibold text-[var(--foreground)]">
                    {payment.c2bReference}
                  </p>
                </div>
              )}

              {payment.transactionPublicId && (
                <p className="mt-3 break-all text-xs text-[var(--foreground-muted)]">
                  Transaction ID: {payment.transactionPublicId}
                </p>
              )}

              {isPendingC2B && payment.c2bReference && (
                <div className="mt-4 border-t border-[var(--border)] pt-4">
                  <p className="text-sm text-[var(--foreground-muted)]">
                    Already paid through M-PESA? Confirm below so sisiMove can
                    check whether your payment has been received.
                  </p>

                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    className="mt-3 w-full"
                    loading={isReconciling}
                    disabled={reconciliation.isPending}
                    onClick={() => handleReconcile(payment.c2bReference!)}
                  >
                    I have paid
                  </Button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

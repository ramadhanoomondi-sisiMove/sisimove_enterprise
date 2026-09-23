import type { ReactNode } from 'react';

import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

// -----------------------------------------------------------------------------
// sisiMove — Withdrawal Processing
// -----------------------------------------------------------------------------
//
// Presentation component for an in-progress wallet withdrawal.
//
// Backend lifecycle:
//
// FinancialAccountWithdrawalStatus
//
//     PENDING
//        ↓
//    PROCESSING
//        ↓
//    COMPLETED
//       or
//    FAILED / CANCELLED
//
// This component represents only the waiting state.
//
// It does NOT:
// - poll the backend;
// - mutate the withdrawal;
// - determine status transitions;
// - retry the withdrawal;
// - navigate;
// - calculate amounts;
// - infer completion or failure.
//
// The container/application layer remains responsible for observing the
// authoritative FinancialAccountWithdrawal status and replacing this component
// when the withdrawal reaches a terminal state.
//
// -----------------------------------------------------------------------------

export type WithdrawalProcessingStatus =
  | 'PENDING'
  | 'PROCESSING';

export interface WithdrawalProcessingProps {
  /**
   * Presentation-ready withdrawal amount.
   *
   * Example:
   * "KES 1,000.00"
   */
  readonly amountLabel: string;

  /**
   * Current authoritative withdrawal status.
   *
   * Defaults to PROCESSING because the component represents an in-progress
   * withdrawal and callers may not need to distinguish the two non-terminal
   * states visually.
   */
  readonly status?: WithdrawalProcessingStatus;

  /**
   * Optional presentation-safe destination description.
   *
   * The caller is responsible for masking sensitive destination details.
   */
  readonly destinationLabel?: string;

  /**
   * Optional caller-owned supporting content.
   */
  readonly supportingContent?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalProcessing({
  amountLabel,
  status = 'PROCESSING',
  destinationLabel,
  supportingContent,
}: WithdrawalProcessingProps) {
  const isPending = status === 'PENDING';

  const statusLabel = isPending
    ? 'Withdrawal submitted'
    : 'Withdrawal processing';

  const statusDescription = isPending
    ? 'Your withdrawal request has been received and is being prepared.'
    : 'Your withdrawal is being processed.';

  return (
    <Card
      variant="outlined"
      padding="lg"
      className="w-full"
    >
      <div className="flex flex-col items-center text-center">
        {/* ----------------------------------------------------------------- */}
        {/* Processing indicator                                              */}
        {/* ----------------------------------------------------------------- */}
        <div
          aria-hidden="true"
          className={[
            'flex h-12 w-12 items-center justify-center rounded-full',
            'bg-[var(--background-brand)] text-[var(--brand)]',
          ].join(' ')}
        >
          <Spinner />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Heading                                                           */}
        {/* ----------------------------------------------------------------- */}
        <p className="mt-5 text-xs font-medium uppercase tracking-[0.08em] text-[var(--foreground-muted)]">
          Withdrawal processing
        </p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--foreground)]">
          We&apos;re processing your withdrawal.
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--foreground-muted)]">
          {statusDescription}
        </p>

        {/* ----------------------------------------------------------------- */}
        {/* Amount                                                            */}
        {/* ----------------------------------------------------------------- */}
        <div className="mt-6 w-full rounded-xl border border-[var(--border)] bg-[var(--background-muted)] px-4 py-5">
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-[var(--foreground-muted)]">
            Amount
          </p>

          <p className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            {amountLabel}
          </p>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Status                                                            */}
        {/* ----------------------------------------------------------------- */}
        <div className="mt-4 flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--brand)]"
          />

          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--foreground)]">
              {statusLabel}
            </p>

            <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
              We&apos;ll update the withdrawal status when processing is
              complete.
            </p>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Destination                                                       */}
        {/* ----------------------------------------------------------------- */}
        {destinationLabel ? (
          <div className="mt-4 w-full rounded-xl border border-[var(--border)] px-4 py-3 text-left">
            <p className="text-xs font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">
              Sending to
            </p>

            <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {destinationLabel}
            </p>
          </div>
        ) : null}

        {/* ----------------------------------------------------------------- */}
        {/* Supporting content                                                */}
        {/* ----------------------------------------------------------------- */}
        {supportingContent ? (
          <div className="mt-4 w-full text-left">
            {supportingContent}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

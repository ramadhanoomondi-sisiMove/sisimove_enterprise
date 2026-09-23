import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';

// -----------------------------------------------------------------------------
// sisiMove — Withdrawal History Item
// -----------------------------------------------------------------------------
//
// Presentation component for one wallet withdrawal history entry.
//
// Domain boundary:
//
// FinancialAccountWithdrawal
// ├── amount
// ├── currency
// ├── destinationType
// ├── destinationValue
// ├── status
// ├── requestedAt
// ├── completedAt
// ├── failedAt
// └── cancelledAt
//
// This component intentionally represents the withdrawal operation, NOT the
// resulting FinancialTransaction.
//
// The transaction is the accounting movement created as part of the financial
// lifecycle and belongs to the transaction feature.
//
// Responsibilities:
// - display withdrawal amount;
// - display withdrawal status;
// - display destination in a safe, presentation-ready form;
// - display the request date/time;
// - optionally display additional supporting content.
//
// It does NOT:
// - fetch withdrawal data;
// - calculate financial amounts;
// - infer status;
// - expose raw sensitive destination values;
// - mutate/cancel/retry withdrawals.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Types
// =============================================================================

export type WithdrawalHistoryStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export type WithdrawalHistoryDestinationType =
  | 'MOBILE_MONEY'
  | 'BANK_ACCOUNT'
  | 'OTHER';

export interface WithdrawalHistoryItemProps {
  /**
   * Stable public withdrawal identifier.
   */
  readonly publicId: string;

  /**
   * Formatted withdrawal amount.
   *
   * Example:
   *     "KES 1,000.00"
   */
  readonly amountLabel: string;

  /**
   * Current withdrawal lifecycle status.
   */
  readonly status: WithdrawalHistoryStatus;

  /**
   * Backend destination type.
   */
  readonly destinationType: WithdrawalHistoryDestinationType;

  /**
   * Safe, display-ready destination.
   *
   * The caller must mask sensitive identifiers before passing them here.
   */
  readonly destinationLabel: string;

  /**
   * Formatted request timestamp.
   *
   * Example:
   *     "22 Sep 2026, 7:10 PM"
   */
  readonly requestedAtLabel: string;

  /**
   * Optional completion timestamp.
   *
   * Example:
   *     "22 Sep 2026, 7:14 PM"
   */
  readonly completedAtLabel?: string;

  /**
   * Optional supporting presentation content.
   */
  readonly supportingContent?: ReactNode;

  /**
   * Optional action for opening withdrawal details.
   */
  readonly onClick?: () => void;
}

// =============================================================================
// Status Presentation
// =============================================================================
//
// The mapping translates lifecycle state into presentation semantics.
//
// Important:
// - The component does not infer lifecycle state.
// - `default` is the neutral Badge variant defined by the sisiMove design
//   system.
// - No `secondary` variant is invented here.
// =============================================================================

function getStatusPresentation(
  status: WithdrawalHistoryStatus,
) {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Pending',
        variant: 'warning' as const,
      };

    case 'PROCESSING':
      return {
        label: 'Processing',
        variant: 'default' as const,
      };

    case 'COMPLETED':
      return {
        label: 'Completed',
        variant: 'success' as const,
      };

    case 'FAILED':
      return {
        label: 'Failed',
        variant: 'danger' as const,
      };

    case 'CANCELLED':
      return {
        label: 'Cancelled',
        variant: 'default' as const,
      };
  }
}

// =============================================================================
// Destination Presentation
// =============================================================================

function getDestinationTypeLabel(
  destinationType: WithdrawalHistoryDestinationType,
): string {
  switch (destinationType) {
    case 'MOBILE_MONEY':
      return 'Mobile money';

    case 'BANK_ACCOUNT':
      return 'Bank account';

    case 'OTHER':
      return 'Other destination';
  }
}

// =============================================================================
// Component
// =============================================================================

export function WithdrawalHistoryItem({
  publicId,
  amountLabel,
  status,
  destinationType,
  destinationLabel,
  requestedAtLabel,
  completedAtLabel,
  supportingContent,
  onClick,
}: WithdrawalHistoryItemProps) {
  const statusPresentation =
    getStatusPresentation(status);

  const destinationTypeLabel =
    getDestinationTypeLabel(destinationType);

  const content = (
    <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
      {/* ------------------------------------------------------------------- */}
      {/* Primary information                                                 */}
      {/* ------------------------------------------------------------------- */}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Withdrawal
          </p>

          <Badge variant={statusPresentation.variant}>
            {statusPresentation.label}
          </Badge>
        </div>

        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          {destinationTypeLabel}
        </p>

        <p className="mt-1 truncate text-sm text-[var(--foreground-secondary)]">
          {destinationLabel}
        </p>

        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          {requestedAtLabel}

          {completedAtLabel && status === 'COMPLETED'
            ? ` · Completed ${completedAtLabel}`
            : ''}
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Amount                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div className="shrink-0 text-right">
        <p className="text-base font-semibold tracking-tight text-[var(--foreground)]">
          −{amountLabel}
        </p>

        <p className="mt-1 max-w-40 truncate text-xs text-[var(--foreground-muted)]">
          {publicId}
        </p>
      </div>
    </div>
  );

  return (
    <div
      className={[
        'rounded-[var(--radius-xl)]',
        'border',
        'border-[var(--border)]',
        'bg-[var(--surface)]',
        'p-4',
        'shadow-[var(--shadow-sm)]',
        onClick
          ? [
              'cursor-pointer',
              'transition-colors',
              'hover:border-[var(--border-strong)]',
            ].join(' ')
          : '',
      ].join(' ')}
    >
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className={[
            'flex w-full text-left outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[var(--brand)]',
            'focus-visible:ring-offset-2',
            'rounded-[var(--radius-md)]',
          ].join(' ')}
          aria-label={`View withdrawal ${publicId}`}
        >
          {content}
        </button>
      ) : (
        content
      )}

      {supportingContent ? (
        <div className="mt-3 border-t border-[var(--border-subtle)] pt-3">
          {supportingContent}
        </div>
      ) : null}
    </div>
  );
}

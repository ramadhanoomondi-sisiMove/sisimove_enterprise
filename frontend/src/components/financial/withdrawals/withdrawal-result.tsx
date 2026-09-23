import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// -----------------------------------------------------------------------------
// sisiMove — Withdrawal Result
// -----------------------------------------------------------------------------
//
// Presentation component for the terminal state of a wallet withdrawal.
//
// Backend lifecycle:
//
// FinancialAccountWithdrawalStatus
//
//     PENDING
//        ↓
//    PROCESSING
//        ↓
// ┌───────────────┬──────────────┐
// │               │              │
// COMPLETED     FAILED       CANCELLED
//
// This component does not mutate the withdrawal or determine its status.
// The container supplies the authoritative backend terminal status.
//
// Responsibilities:
// - communicate the final withdrawal outcome;
// - show the amount involved;
// - optionally show the destination;
// - expose navigation/retry actions supplied by the container.
//
// It does NOT:
// - retry withdrawals itself;
// - create a new withdrawal;
// - calculate fees;
// - fetch transaction information;
// - infer success from the absence of an error;
// - decide whether a withdrawal is actually completed or failed.
//
// The component intentionally receives presentation-ready values.
// -----------------------------------------------------------------------------

export type WithdrawalResultStatus =
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface WithdrawalResultProps {
  /**
   * Authoritative terminal withdrawal status.
   */
  readonly status: WithdrawalResultStatus;

  /**
   * Presentation-ready withdrawal amount.
   *
   * Example:
   * "KES 1,000.00"
   */
  readonly amountLabel: string;

  /**
   * Optional presentation-safe destination description.
   *
   * The caller is responsible for masking sensitive destination details.
   */
  readonly destinationLabel?: string;

  /**
   * Optional user-safe message supplied by the application/container.
   *
   * The component does not inspect or transform backend errors.
   */
  readonly message?: string;

  /**
   * Optional primary action.
   *
   * The caller owns the action and its navigation/mutation behavior.
   */
  readonly primaryActionLabel?: string;

  readonly onPrimaryAction?: () => void;

  /**
   * Optional secondary action.
   *
   * The caller owns the action and its navigation behavior.
   */
  readonly secondaryActionLabel?: string;

  readonly onSecondaryAction?: () => void;

  /**
   * Optional caller-owned supporting content.
   */
  readonly supportingContent?: ReactNode;
}

// -----------------------------------------------------------------------------
// Result configuration
// -----------------------------------------------------------------------------

interface WithdrawalResultConfiguration {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly indicatorClassName: string;
  readonly indicatorSymbol: string;
  readonly statusClassName: string;
}

function getResultConfiguration(
  status: WithdrawalResultStatus,
): WithdrawalResultConfiguration {
  switch (status) {
    case 'COMPLETED':
      return {
        eyebrow: 'Withdrawal complete',
        title: 'Money has been sent.',
        description:
          'Your withdrawal has been completed successfully.',
        indicatorClassName:
          'bg-[var(--success-soft)] text-[var(--success)]',
        indicatorSymbol: '✓',
        statusClassName:
          'border-[var(--success-border)] bg-[var(--success-soft)] text-[var(--success)]',
      };

    case 'FAILED':
      return {
        eyebrow: 'Withdrawal failed',
        title: 'We could not complete the withdrawal.',
        description:
          'The withdrawal was not completed. Your wallet balance is governed by the authoritative account status.',
        indicatorClassName:
          'bg-[var(--danger-soft)] text-[var(--danger)]',
        indicatorSymbol: '!',
        statusClassName:
          'border-[var(--danger-border)] bg-[var(--danger-soft)] text-[var(--danger)]',
      };

    case 'CANCELLED':
      return {
        eyebrow: 'Withdrawal cancelled',
        title: 'The withdrawal was cancelled.',
        description:
          'This withdrawal request was cancelled before completion.',
        indicatorClassName:
          'bg-[var(--background-muted)] text-[var(--foreground-muted)]',
        indicatorSymbol: '×',
        statusClassName:
          'border-[var(--border)] bg-[var(--background-muted)] text-[var(--foreground-secondary)]',
      };
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalResult({
  status,
  amountLabel,
  destinationLabel,
  message,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  supportingContent,
}: WithdrawalResultProps) {
  const configuration = getResultConfiguration(status);

  const hasPrimaryAction =
    Boolean(primaryActionLabel) && Boolean(onPrimaryAction);

  const hasSecondaryAction =
    Boolean(secondaryActionLabel) && Boolean(onSecondaryAction);

  const hasActions = hasPrimaryAction || hasSecondaryAction;

  const messageRole =
    status === 'COMPLETED' ? undefined : 'alert';

  return (
    <Card
      variant="outlined"
      padding="lg"
      className="w-full"
    >
      <div className="flex flex-col items-center text-center">
        {/* ----------------------------------------------------------------- */}
        {/* Result indicator                                                  */}
        {/* ----------------------------------------------------------------- */}
        <div
          aria-hidden="true"
          className={[
            'flex h-12 w-12 items-center justify-center rounded-full',
            'text-xl font-semibold',
            configuration.indicatorClassName,
          ].join(' ')}
        >
          {configuration.indicatorSymbol}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Heading                                                           */}
        {/* ----------------------------------------------------------------- */}
        <p className="mt-5 text-xs font-medium uppercase tracking-[0.08em] text-[var(--foreground-muted)]">
          {configuration.eyebrow}
        </p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--foreground)]">
          {configuration.title}
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--foreground-muted)]">
          {configuration.description}
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
        {/* Destination                                                       */}
        {/* ----------------------------------------------------------------- */}
        {destinationLabel ? (
          <div className="mt-4 w-full rounded-xl border border-[var(--border)] px-4 py-3 text-left">
            <p className="text-xs font-medium uppercase tracking-[0.06em] text-[var(--foreground-muted)]">
              Sent to
            </p>

            <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {destinationLabel}
            </p>
          </div>
        ) : null}

        {/* ----------------------------------------------------------------- */}
        {/* Status / message                                                  */}
        {/* ----------------------------------------------------------------- */}
        {message ? (
          <div
            role={messageRole}
            className={[
              'mt-4 w-full rounded-xl border px-4 py-3 text-left text-sm',
              configuration.statusClassName,
            ].join(' ')}
          >
            {message}
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

        {/* ----------------------------------------------------------------- */}
        {/* Actions                                                           */}
        {/* ----------------------------------------------------------------- */}
        {hasActions ? (
          <div className="mt-6 flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-center">
            {hasSecondaryAction ? (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onSecondaryAction}
                className="w-full sm:w-auto"
              >
                {secondaryActionLabel}
              </Button>
            ) : null}

            {hasPrimaryAction ? (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={onPrimaryAction}
                className="w-full sm:w-auto"
              >
                {primaryActionLabel}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

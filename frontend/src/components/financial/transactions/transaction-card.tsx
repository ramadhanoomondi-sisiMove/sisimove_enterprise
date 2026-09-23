// -----------------------------------------------------------------------------
// sisiMove — Financial Transaction Card
// -----------------------------------------------------------------------------
//
// Presentation component for one financial transaction.
//
// Responsibilities:
// - Present transaction type;
// - Present transaction status;
// - Present transaction amount;
// - Present transaction date;
// - Present optional reference information;
// - Present member-facing money-in / money-out direction.
//
// Non-responsibilities:
// - Fetching transactions;
// - Determining account ownership;
// - Performing accounting calculations;
// - Inspecting persistence IDs to determine ownership;
// - Inferring direction from transaction type.
//
// Direction is resolved by the parent/container using the authenticated
// financial account's transaction entries.
//
// -----------------------------------------------------------------------------

"use client";

import type { ReactNode } from "react";

import { FinancialAmount } from "@/components/financial/shared/financial-amount";
import { FinancialStatusBadge } from "@/components/financial/shared/financial-status-badge";
import { Card } from "@/components/ui/card";

import {
  FinancialTransactionStatus,
  FinancialTransactionType,
  type FinancialTransaction,
} from "@/features/financial-transactions";

// -----------------------------------------------------------------------------
// Direction
// -----------------------------------------------------------------------------

export type TransactionDirection =
  | "IN"
  | "OUT";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface TransactionCardProps {
  readonly transaction: FinancialTransaction;
  readonly direction: TransactionDirection;
  readonly title?: string;
  readonly description?: string;
  readonly dateLabel: string;
  readonly referenceLabel?: string;
  readonly supportingContent?: ReactNode;
  readonly onClick?: () => void;
}

// -----------------------------------------------------------------------------
// Presentation labels
// -----------------------------------------------------------------------------

const TRANSACTION_TYPE_LABELS: Record<
  FinancialTransactionType,
  string
> = {
  [FinancialTransactionType.PAYMENT]: "Payment",
  [FinancialTransactionType.TRANSFER]: "Transfer",
  [FinancialTransactionType.HOLD]: "Funds reserved",
  [FinancialTransactionType.RELEASE]: "Funds released",
  [FinancialTransactionType.CAPTURE]: "Funds captured",
  [FinancialTransactionType.SETTLEMENT]: "Settlement",
  [FinancialTransactionType.DISBURSEMENT]: "Disbursement",
  [FinancialTransactionType.REFUND]: "Refund",
  [FinancialTransactionType.REVERSAL]: "Reversal",
  [FinancialTransactionType.ADJUSTMENT]: "Adjustment",
};

const TRANSACTION_STATUS_LABELS: Record<
  FinancialTransactionStatus,
  string
> = {
  [FinancialTransactionStatus.PENDING]: "Pending",
  [FinancialTransactionStatus.COMPLETED]: "Completed",
  [FinancialTransactionStatus.FAILED]: "Failed",
  [FinancialTransactionStatus.REVERSED]: "Reversed",
  [FinancialTransactionStatus.CANCELLED]: "Cancelled",
};

// -----------------------------------------------------------------------------
// Status presentation
// -----------------------------------------------------------------------------

function getStatusTone(
  status: FinancialTransactionStatus,
):
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger" {
  switch (status) {
    case FinancialTransactionStatus.PENDING:
      return "warning";

    case FinancialTransactionStatus.COMPLETED:
      return "success";

    case FinancialTransactionStatus.FAILED:
    case FinancialTransactionStatus.CANCELLED:
      return "danger";

    case FinancialTransactionStatus.REVERSED:
      return "neutral";

    default:
      return "neutral";
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TransactionCard({
  transaction,
  direction,
  title,
  description,
  dateLabel,
  referenceLabel,
  supportingContent,
  onClick,
}: TransactionCardProps): ReactNode {
  const resolvedTitle =
    title ??
    TRANSACTION_TYPE_LABELS[transaction.type];

  const amountTone =
    direction === "IN"
      ? "positive"
      : "negative";

  const amountPrefix =
    direction === "IN"
      ? "+"
      : "−";

  const content = (
    <Card
      className={[
        "overflow-hidden",
        onClick
          ? "cursor-pointer transition hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)]"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                {resolvedTitle}
              </p>

              <FinancialStatusBadge
                label={
                  TRANSACTION_STATUS_LABELS[
                    transaction.status
                  ]
                }
                tone={getStatusTone(
                  transaction.status,
                )}
                size="sm"
              />
            </div>

            {description ? (
              <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
                {description}
              </p>
            ) : null}
          </div>

          <p className="shrink-0 text-base font-semibold tracking-[-0.015em]">
            <span
              className={
                direction === "IN"
                  ? "text-[var(--success)]"
                  : "text-[var(--danger)]"
              }
            >
              {amountPrefix}
            </span>

            <FinancialAmount
              amount={transaction.amount}
              currency={transaction.currency}
              tone={amountTone}
            />
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[var(--border-subtle)] pt-3">
          <p className="text-xs text-[var(--foreground-muted)]">
            {dateLabel}
          </p>

          {referenceLabel ? (
            <p className="truncate text-xs text-[var(--foreground-muted)]">
              {referenceLabel}
            </p>
          ) : null}
        </div>

        {supportingContent ? (
          <div className="mt-3">
            {supportingContent}
          </div>
        ) : null}
      </div>
    </Card>
  );

  if (!onClick) {
    return content;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full text-left"
      aria-label={`View ${resolvedTitle} transaction`}
    >
      {content}
    </button>
  );
}
// -----------------------------------------------------------------------------
// sisiMove — Financial Transaction Details
// -----------------------------------------------------------------------------
//
// Presentation component for the complete member-facing transaction detail.
//
// The transaction is an aggregate containing its FinancialTransactionEntry
// children. Entries are displayed as accounting movement, not as independent
// frontend resources.
//
// No persistence calculation or accounting mutation occurs here.
// -----------------------------------------------------------------------------

"use client";

import type { ReactNode } from "react";

import { FinancialAmount } from "@/components/financial/shared/financial-amount";
import { FinancialStatusBadge } from "@/components/financial/shared/financial-status-badge";
import { Card } from "@/components/ui/card";

import {
  FinancialBalanceType,
  FinancialTransactionEntryType,
  FinancialTransactionStatus,
  FinancialTransactionType,
  type FinancialTransaction,
} from "@/features/financial-transactions";

// -----------------------------------------------------------------------------
// Labels
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

const STATUS_LABELS: Record<
  FinancialTransactionStatus,
  string
> = {
  [FinancialTransactionStatus.PENDING]: "Pending",
  [FinancialTransactionStatus.COMPLETED]: "Completed",
  [FinancialTransactionStatus.FAILED]: "Failed",
  [FinancialTransactionStatus.REVERSED]: "Reversed",
  [FinancialTransactionStatus.CANCELLED]: "Cancelled",
};

const ENTRY_TYPE_LABELS: Record<
  FinancialTransactionEntryType,
  string
> = {
  [FinancialTransactionEntryType.DEBIT]: "Debit",
  [FinancialTransactionEntryType.CREDIT]: "Credit",
};

const BALANCE_TYPE_LABELS: Record<
  FinancialBalanceType,
  string
> = {
  [FinancialBalanceType.AVAILABLE]: "Available",
  [FinancialBalanceType.PENDING]: "Pending",
  [FinancialBalanceType.HELD]: "Held",
};

// -----------------------------------------------------------------------------
// Status tone
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
// Detail row
// -----------------------------------------------------------------------------

interface DetailRowProps {
  readonly label: string;
  readonly children: ReactNode;
}

function DetailRow({
  label,
  children,
}: DetailRowProps): ReactNode {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="text-sm text-[var(--foreground-muted)]">
        {label}
      </dt>

      <dd className="max-w-[65%] text-right text-sm font-medium text-[var(--foreground)]">
        {children}
      </dd>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface TransactionDetailsProps {
  readonly transaction: FinancialTransaction;
  readonly createdAtLabel: string;
  readonly completedAtLabel?: string;
  readonly failedAtLabel?: string;
  readonly reversedAtLabel?: string;
  readonly cancelledAtLabel?: string;
  readonly referenceLabel?: string;
  readonly supportingContent?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TransactionDetails({
  transaction,
  createdAtLabel,
  completedAtLabel,
  failedAtLabel,
  reversedAtLabel,
  cancelledAtLabel,
  referenceLabel,
  supportingContent,
}: TransactionDetailsProps): ReactNode {
  return (
    <div className="space-y-4">
      <Card>
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
                Transaction
              </p>

              <h1 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-2xl">
                {TRANSACTION_TYPE_LABELS[
                  transaction.type
                ]}
              </h1>
            </div>

            <FinancialStatusBadge
              label={
                STATUS_LABELS[
                  transaction.status
                ]
              }
              tone={getStatusTone(
                transaction.status,
              )}
            />
          </div>

          <div className="mt-6">
            <FinancialAmount
              amount={transaction.amount}
              currency={transaction.currency}
              className="text-3xl font-semibold tracking-[-0.03em]"
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="px-5 sm:px-6">
          <dl className="divide-y divide-[var(--border-subtle)]">
            <DetailRow label="Type">
              {
                TRANSACTION_TYPE_LABELS[
                  transaction.type
                ]
              }
            </DetailRow>

            <DetailRow label="Status">
              {
                STATUS_LABELS[
                  transaction.status
                ]
              }
            </DetailRow>

            <DetailRow label="Currency">
              {transaction.currency}
            </DetailRow>

            <DetailRow label="Created">
              {createdAtLabel}
            </DetailRow>

            {completedAtLabel ? (
              <DetailRow label="Completed">
                {completedAtLabel}
              </DetailRow>
            ) : null}

            {failedAtLabel ? (
              <DetailRow label="Failed">
                {failedAtLabel}
              </DetailRow>
            ) : null}

            {reversedAtLabel ? (
              <DetailRow label="Reversed">
                {reversedAtLabel}
              </DetailRow>
            ) : null}

            {cancelledAtLabel ? (
              <DetailRow label="Cancelled">
                {cancelledAtLabel}
              </DetailRow>
            ) : null}

            {referenceLabel ? (
              <DetailRow label="Reference">
                {referenceLabel}
              </DetailRow>
            ) : null}

            <DetailRow label="Transaction">
              <span className="break-all text-xs font-normal text-[var(--foreground-muted)]">
                {transaction.publicId}
              </span>
            </DetailRow>
          </dl>
        </div>
      </Card>

      {transaction.entries.length > 0 ? (
        <Card>
          <div className="p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Accounting movement
            </h2>

            <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
              The ledger entries recorded for this transaction.
            </p>

            <div className="mt-4 divide-y divide-[var(--border-subtle)]">
              {transaction.entries.map(
                (entry) => (
                  <div
                    key={entry.publicId}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {
                          ENTRY_TYPE_LABELS[
                            entry.type
                          ]
                        }
                      </p>

                      <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
                        {
                          BALANCE_TYPE_LABELS[
                            entry.balanceType
                          ]
                        }
                      </p>
                    </div>

                    <FinancialAmount
                      amount={entry.amount}
                      currency={transaction.currency}
                      className="shrink-0 text-sm font-semibold"
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </Card>
      ) : null}

      {supportingContent ? (
        <div>
          {supportingContent}
        </div>
      ) : null}
    </div>
  );
}
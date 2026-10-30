// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Payment Detail Header
// -----------------------------------------------------------------------------
//
// Header for an individual financial payment.
// Uses the public payment identifier and existing shared payment components.
// -----------------------------------------------------------------------------

import Link from 'next/link';
import { ArrowLeft, ReceiptText } from 'lucide-react';
import type { ReactNode } from 'react';

import {
  PaymentAmount,
  PaymentDate,
  PaymentPublicId,
  PaymentStatusBadge,
} from '../shared';

import type { AdminFinancialPayment } from '@/features/admin/finance/payments';

export interface PaymentDetailHeaderProps {
  payment: AdminFinancialPayment;
  backHref?: string;
  actions?: ReactNode;
  className?: string;
}

export function PaymentDetailHeader({
  payment,
  backHref = '/admin/finance/payments',
  actions,
  className,
}: PaymentDetailHeaderProps) {
  return (
    <header
      className={[
        'border-b border-[var(--border)] pb-6',
        className ?? '',
      ].join(' ')}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={backHref}
          className={[
            'inline-flex min-h-9 items-center justify-center gap-2',
            'rounded-[var(--radius-md)] px-2 text-sm font-medium',
            'text-[var(--foreground-secondary)] transition-colors',
            'hover:bg-[var(--background-subtle)] hover:text-[var(--foreground)]',
            'focus-visible:outline-2 focus-visible:outline-[var(--brand)]',
            'focus-visible:outline-offset-2',
          ].join(' ')}
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to payments
        </Link>

        {actions ? (
          <div className="flex flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-soft)] text-[var(--brand)]">
            <ReceiptText aria-hidden="true" className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                Financial payment
              </h1>

              <PaymentStatusBadge status={payment.status} />
            </div>

            <div className="mt-2">
              <PaymentPublicId publicId={payment.publicId} />
            </div>

            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Initiated{' '}
              <PaymentDate
                value={payment.initiatedAt}
                format="datetime"
              />
            </p>
          </div>
        </div>

        <div className="sm:text-right">
          <p className="text-sm text-[var(--foreground-secondary)]">
            Payment amount
          </p>

          <p className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            <PaymentAmount
              amount={payment.amount}
              currency={payment.currency}
            />
          </p>
        </div>
      </div>
    </header>
  );
}

export default PaymentDetailHeader;
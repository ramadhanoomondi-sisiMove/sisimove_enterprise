
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/foundation/utils/cn';

import { TransactionAmount } from '../shared/TransactionAmount';
import { TransactionPublicId } from '../shared/TransactionPublicId';
import { TransactionStatusBadge } from '../shared/TransactionStatusBadge';
import { TransactionTypeBadge } from '../shared/TransactionTypeBadge';

export interface TransactionDetailHeaderProps {
  publicId: string;
  status: string;
  type: string;
  amount: number;
  currency: string;
  backHref?: string;
  backLabel?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function TransactionDetailHeader({
  publicId,
  status,
  type,
  amount,
  currency,
  backHref,
  backLabel = 'All transactions',
  description = 'Review transaction details, lifecycle events, and accounting entries.',
  actions,
  className,
}: TransactionDetailHeaderProps) {
  return (
    <header className={cn('space-y-5', className)}>
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex min-h-9 items-center gap-2 rounded-[var(--radius-md)] text-sm font-medium text-[var(--foreground-secondary)] transition-colors hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-[var(--brand)] focus-visible:outline-offset-4"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {backLabel}
        </Link>
      ) : null}

      <div className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <TransactionTypeBadge type={type} />
            <TransactionStatusBadge status={status} />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
              Transaction details
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <span>Transaction ID</span>
            <TransactionPublicId publicId={publicId} />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background-subtle)] px-4 py-3">
            <p className="text-xs font-medium text-[var(--foreground-muted)]">
              Transaction amount
            </p>
            <div className="mt-1 text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
              <TransactionAmount amount={amount} currency={currency} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void navigator.clipboard?.writeText(publicId);
              }}
              leadingIcon={<Copy className="h-4 w-4" />}
            >
              Copy transaction ID
            </Button>

            {actions}
          </div>
        </div>
      </div>
    </header>
  );
}

export default TransactionDetailHeader;

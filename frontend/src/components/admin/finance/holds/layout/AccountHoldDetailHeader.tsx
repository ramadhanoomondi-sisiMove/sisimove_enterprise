
import type { ReactNode } from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { AdminAccountHold } from '@/features/admin/finance/holds/models';
import { cn } from '@/foundation/utils/cn';

import {
  AccountHoldAmount,
  AccountHoldPublicId,
  AccountHoldStatusBadge,
} from '../shared';

export interface AccountHoldDetailHeaderProps {
  hold: AdminAccountHold;
  onBack?: () => void;
  actions?: ReactNode;
  className?: string;
}

export function AccountHoldDetailHeader({
  hold,
  onBack,
  actions,
  className,
}: AccountHoldDetailHeaderProps) {
  return (
    <header className={cn('space-y-5', className)}>
      {onBack && (
        <Button
          variant="ghost"
          size="sm"
          leadingIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={onBack}
          className="-ml-2"
        >
          Back to account holds
        </Button>
      )}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background-brand)] text-[var(--brand)]">
            <ShieldCheck aria-hidden="true" className="h-6 w-6" />
          </div>

          <div className="min-w-0 space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                Account hold details
              </p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
                Hold record
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <AccountHoldPublicId publicId={hold.publicId} />
              <AccountHoldStatusBadge status={hold.status} />
            </div>

            <AccountHoldAmount
              amount={hold.amount}
              currency={hold.currency}
              className="text-lg"
            />
          </div>
        </div>

        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}

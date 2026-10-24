
 // -----------------------------------------------------------------------------
 // sisiMove Admin — Financial Account Overview
 // -----------------------------------------------------------------------------
 //
 // Overview surface for one account.
 // Receives account data from its caller and optionally accepts a separately
 // loaded balance response. It does not fetch data or claim platform-wide totals.
 // -----------------------------------------------------------------------------

import {
  CalendarClock,
  CircleUserRound,
  WalletCards,
} from 'lucide-react';

import { Card } from '@/components/ui';

import type {
  AdminFinancialAccount,
  AdminFinancialAccountBalanceOnly,
} from '@/features/admin/finance/accounts/models';

import {
  formatFinancialDateTime,
} from '@/features/admin/finance/accounts/utils';

import {
  FinancialAccountPublicId,
  FinancialAccountStatusBadge,
  FinancialAccountTypeBadge,
} from '../shared';

import { FinancialAccountSectionHeader } from '../layout';
import { FinancialAccountMetricCard } from './FinancialAccountMetricCard';
import { FinancialAccountBalanceSummary } from './FinancialAccountBalanceSummary';

export interface FinancialAccountOverviewProps {
  account: AdminFinancialAccount;
  balance?: AdminFinancialAccountBalanceOnly | null;
  formatAmount: (minorUnits: number, currency: string) => string;
  className?: string;
}

export function FinancialAccountOverview({
  account,
  balance,
  formatAmount,
  className,
}: FinancialAccountOverviewProps) {
  // Prefer an explicitly supplied balance, otherwise use the balance included
  // in the account aggregate response.
  const accountBalance = balance ?? account.balance;
  const currency = accountBalance.currency;

  return (
    <section className={className}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <FinancialAccountMetricCard
          label="Account status"
          value={account.status}
          icon={
            <WalletCards
              aria-hidden="true"
              className="h-4 w-4"
            />
          }
          footer={
            <FinancialAccountStatusBadge status={account.status} />
          }
        />

        <FinancialAccountMetricCard
          label="Account type"
          value={account.type}
          icon={
            <CircleUserRound
              aria-hidden="true"
              className="h-4 w-4"
            />
          }
          footer={
            <FinancialAccountTypeBadge type={account.type} />
          }
        />

        <FinancialAccountMetricCard
          label="Last updated"
          value={formatFinancialDateTime(account.updatedAt)}
          icon={
            <CalendarClock
              aria-hidden="true"
              className="h-4 w-4"
            />
          }
          description={`Created ${formatFinancialDateTime(account.createdAt)}`}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,1fr)]">
        <FinancialAccountBalanceSummary
          currency={currency}
          availableAmount={formatAmount(
            accountBalance.availableAmount,
            currency,
          )}
          pendingAmount={formatAmount(
            accountBalance.pendingAmount,
            currency,
          )}
          heldAmount={formatAmount(
            accountBalance.heldAmount,
            currency,
          )}
          totalAmount={formatAmount(
            accountBalance.totalAmount,
            currency,
          )}
          description="Breakdown of this account’s current balance."
        />

        <Card padding="lg">
          <FinancialAccountSectionHeader
            title="Account information"
            description="Identifiers and ownership metadata returned by the API."
          />

          <dl className="mt-5 space-y-4">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Account public ID
              </dt>
              <dd className="mt-2">
                <FinancialAccountPublicId
                  publicId={account.publicId}
                />
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Owner public ID
              </dt>
              <dd className="mt-1 break-all text-sm text-[var(--foreground-secondary)]">
                {account.ownerPublicId || 'Not supplied'}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Currency
              </dt>
              <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
                {account.currency}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </section>
  );
}

export default FinancialAccountOverview;

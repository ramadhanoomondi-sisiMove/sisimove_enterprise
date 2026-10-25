
// src/components/admin/finance/account-holds/directory/AccountHoldTableRow.tsx

import { Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { AdminAccountHold } from '@/features/admin/finance/account-holds/models';
import { cn } from '@/foundation/utils/cn';

import { AccountHoldAmount } from '../shared/AccountHoldAmount';
import { AccountHoldExpiryBadge } from '../shared/AccountHoldExpiryBadge';
import { AccountHoldPublicId } from '../shared/AccountHoldPublicId';
import { AccountHoldStatusBadge } from '../shared/AccountHoldStatusBadge';

export interface AccountHoldTableRowProps {
  hold: AdminAccountHold;
  onView?: (hold: AdminAccountHold) => void;
  className?: string;
}

function formatDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-KE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function AccountHoldTableRow({
  hold,
  onView,
  className,
}: AccountHoldTableRowProps) {
  return (
    <tr
      className={cn(
        'border-b border-[var(--border-subtle)] last:border-b-0',
        'transition-colors hover:bg-[var(--background-subtle)]',
        className,
      )}
    >
      <td className="whitespace-nowrap px-4 py-4">
        <AccountHoldPublicId publicId={hold.publicId} />

        <p className="mt-1 text-xs capitalize text-[var(--foreground-muted)]">
          {hold.referenceType?.replaceAll('_', ' ') ?? 'No reference type'}
        </p>
      </td>

      <td className="whitespace-nowrap px-4 py-4">
        <AccountHoldPublicId
          publicId={hold.accountPublicId}
          visibleCharacters={16}
        />
      </td>

      <td className="whitespace-nowrap px-4 py-4 text-right">
        <AccountHoldAmount
          amount={hold.amount}
          currency={hold.currency}
        />
      </td>

      <td className="whitespace-nowrap px-4 py-4">
        <AccountHoldStatusBadge status={hold.status} />
      </td>

      <td className="whitespace-nowrap px-4 py-4">
        <AccountHoldExpiryBadge
          expiresAt={hold.expiresAt}
          hasExpiry={hold.hasExpiry}
          isExpired={hold.isExpired}
        />
      </td>

      <td className="whitespace-nowrap px-4 py-4 text-sm text-[var(--foreground-secondary)]">
        {formatDate(hold.createdAt)}
      </td>

      <td className="whitespace-nowrap px-4 py-4 text-right">
        {onView && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            leadingIcon={<Eye aria-hidden="true" className="size-4" />}
            onClick={() => onView(hold)}
            aria-label={`View hold ${hold.publicId}`}
          >
            View
          </Button>
        )}
      </td>
    </tr>
  );
}

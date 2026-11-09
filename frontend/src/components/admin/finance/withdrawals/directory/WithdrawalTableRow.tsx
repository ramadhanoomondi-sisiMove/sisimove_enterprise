import type { AdminWithdrawal } from '@/features/admin/finance/withdrawals/models/admin-withdrawal.model';
import WithdrawalAccountLink from '../shared/WithdrawalAccountLink';
import WithdrawalAmount from '../shared/WithdrawalAmount';
import WithdrawalDate from '../shared/WithdrawalDate';
import WithdrawalDestination from '../shared/WithdrawalDestination';
import WithdrawalPublicId from '../shared/WithdrawalPublicId';
import WithdrawalStatusBadge from '../shared/WithdrawalStatusBadge';
import WithdrawalReference from '../shared/WithdrawalReference';

export interface WithdrawalTableRowProps {
  withdrawal: AdminWithdrawal;
  onSelect?: (withdrawal: AdminWithdrawal) => void;
}

export function WithdrawalTableRow({
  withdrawal,
  onSelect,
}: WithdrawalTableRowProps) {
  return (
    <tr
      onClick={() => onSelect?.(withdrawal)}
      onKeyDown={(event) => {
        if (!onSelect) return;

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(withdrawal);
        }
      }}
      tabIndex={onSelect ? 0 : undefined}
      role={onSelect ? 'link' : undefined}
      className={[
        'border-b border-[var(--border)] last:border-0',
        onSelect
          ? 'cursor-pointer transition-colors hover:bg-[var(--surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand)]'
          : '',
      ].join(' ')}
    >
      <td className="px-4 py-4">
        <WithdrawalPublicId publicId={withdrawal.publicId} />

        <div className="mt-1">
          <WithdrawalReference
            referenceType={withdrawal.referenceType}
            referencePublicId={withdrawal.referencePublicId}
          />
        </div>
      </td>

      <td
        className="px-4 py-4"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <WithdrawalAccountLink
          accountPublicId={withdrawal.accountPublicId}
        />
      </td>

      <td className="px-4 py-4">
        <WithdrawalDestination
          destinationType={withdrawal.destinationType}
          destinationValue={withdrawal.destinationValue}
        />
      </td>

      <td className="px-4 py-4 text-right">
        <WithdrawalAmount
          amount={withdrawal.amount}
          currency={withdrawal.currency}
        />
      </td>

      <td className="px-4 py-4">
        <WithdrawalStatusBadge status={withdrawal.status} />
      </td>

      <td className="px-4 py-4">
        <WithdrawalDate value={withdrawal.requestedAt} includeTime />
      </td>
    </tr>
  );
}

export default WithdrawalTableRow;
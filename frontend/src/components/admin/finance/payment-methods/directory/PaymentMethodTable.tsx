/**
 * sisiMove Admin — Payment Method Table
 */
import type { AdminPaymentMethodSummary } from '@/features/admin/finance/payment-methods/models';
import { Card } from '@/components/ui';
import { PaymentMethodEmptyState } from '../shared';
import { PaymentMethodTableRow } from './PaymentMethodTableRow';

export interface PaymentMethodTableProps {
  items: AdminPaymentMethodSummary[];
  isLoading?: boolean;
  hasFilters?: boolean;
  onClearFilters?: () => void;
  onSelect?: (paymentMethod: AdminPaymentMethodSummary) => void;
  className?: string;
}

export function PaymentMethodTable({
  items,
  isLoading = false,
  hasFilters = false,
  onClearFilters,
  onSelect,
  className,
}: PaymentMethodTableProps) {
  if (isLoading) return null;

  if (items.length === 0) {
    return (
      <Card padding="none" className={className}>
        <div className="p-5 sm:p-8">
          <PaymentMethodEmptyState
            title={hasFilters ? 'No matching payment methods' : 'No payment methods yet'}
            description={hasFilters ? 'Try adjusting your search or filters.' : 'Registered payment methods will appear here when available.'}
            onClearFilters={hasFilters ? onClearFilters : undefined}
          />
        </div>
      </Card>
    );
  }

  return (
    <div className={['overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]', className].filter(Boolean).join(' ')}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead className="bg-[var(--background-subtle)]">
            <tr className="border-b border-[var(--border)]">
              <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)]">Payment method</th>
              <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)]">Type / default</th>
              <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)]">Provider / identifier</th>
              <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)]">Status</th>
              <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)]">Last updated</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[var(--foreground-secondary)]"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => <PaymentMethodTableRow key={item.publicId} paymentMethod={item} onSelect={onSelect} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentMethodTable;

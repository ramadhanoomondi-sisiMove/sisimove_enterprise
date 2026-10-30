// ============================================================
// Financial Payments — Table
// ============================================================

import { cn } from '@/foundation/utils/cn';

import type {
  AdminFinancialPayment,
} from '@/features/admin/finance/payments/models';

import { PaymentTableRow } from './PaymentTableRow';

// ============================================================
// Types
// ============================================================

export interface PaymentTableProps {
  payments: AdminFinancialPayment[];
  getPaymentHref?: (publicId: string) => string;
  emptyMessage?: string;
  className?: string;
}

// ============================================================
// Component
// ============================================================

export function PaymentTable({
  payments,
  getPaymentHref = (publicId) =>
    `/admin/finance/payments/${encodeURIComponent(publicId)}`,
  emptyMessage = 'No payments match the current filters.',
  className,
}: PaymentTableProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          {/* Table headings */}
          <thead className="bg-[var(--background-subtle)]">
            <tr>
              {[
                'Payment',
                'Account',
                'Amount',
                'Status',
                'Created',
                'Actions',
              ].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className={cn(
                    'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]',
                    heading === 'Amount' && 'text-right',
                    heading === 'Actions' && 'text-right',
                  )}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table rows */}
          <tbody className="divide-y divide-[var(--border)]">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <PaymentTableRow
                  key={payment.publicId}
                  payment={payment}
                  href={getPaymentHref(payment.publicId)}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-[var(--foreground-muted)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentTable;

/**
 * sisiMove Admin — Payment Method Table Row
 */
import type { AdminPaymentMethodSummary } from '@/features/admin/finance/payment-methods/models';
import {
  PaymentMethodDate,
  PaymentMethodDefaultBadge,
  PaymentMethodDisplayName,
  PaymentMethodLastFour,
  PaymentMethodProviderBadge,
  PaymentMethodPublicId,
  PaymentMethodStatusBadge,
  PaymentMethodTypeBadge,
} from '../shared';

export interface PaymentMethodTableRowProps {
  paymentMethod: AdminPaymentMethodSummary;
  onSelect?: (paymentMethod: AdminPaymentMethodSummary) => void;
}

export function PaymentMethodTableRow({ paymentMethod, onSelect }: PaymentMethodTableRowProps) {
  const name = paymentMethod.displayName?.trim() || 'Unnamed payment method';

  return (
    <tr
      className={['border-b border-[var(--border-subtle)] last:border-0', onSelect ? 'cursor-pointer hover:bg-[var(--background-subtle)] focus-within:bg-[var(--background-subtle)]' : ''].filter(Boolean).join(' ')}
      onClick={onSelect ? () => onSelect(paymentMethod) : undefined}
    >
      <td className="px-4 py-4">
        <div className="min-w-0 space-y-1">
          <PaymentMethodDisplayName displayName={paymentMethod.displayName} />
          <PaymentMethodPublicId publicId={paymentMethod.publicId} />
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <PaymentMethodTypeBadge type={paymentMethod.type} />
          <PaymentMethodDefaultBadge isDefault={paymentMethod.isDefault} />
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="space-y-2">
          <PaymentMethodProviderBadge provider={paymentMethod.provider} />
          {paymentMethod.lastFour && <PaymentMethodLastFour lastFour={paymentMethod.lastFour} />}
        </div>
      </td>
      <td className="px-4 py-4"><PaymentMethodStatusBadge isActive={paymentMethod.isActive} /></td>
      <td className="px-4 py-4"><PaymentMethodDate date={paymentMethod.updatedAt} /></td>
      <td className="px-4 py-4 text-right">
        {onSelect ? (
          <button
            type="button"
            className="rounded-[var(--radius-md)] px-2 py-1 text-sm font-medium text-[var(--brand)] hover:bg-[var(--brand-soft)] focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
            aria-label={`View ${name}`}
            onClick={(event) => { event.stopPropagation(); onSelect(paymentMethod); }}
          >
            View
          </button>
        ) : <span className="text-sm text-[var(--foreground-muted)]">—</span>}
      </td>
    </tr>
  );
}

export default PaymentMethodTableRow;

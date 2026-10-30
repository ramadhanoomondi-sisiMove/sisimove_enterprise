/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Information Panel
 * -----------------------------------------------------------------------------
 */
import { Card } from '@/components/ui';
import type { AdminPaymentMethod } from '@/features/admin/finance/payment-methods/models';
import { PaymentMethodTypeBadge } from '../shared';

export interface PaymentMethodInformationPanelProps {
  paymentMethod: AdminPaymentMethod;
  className?: string;
}

export function PaymentMethodInformationPanel({
  paymentMethod,
  className,
}: PaymentMethodInformationPanelProps) {
  return (
    <Card
      padding="lg"
      className={['min-w-0', className].filter(Boolean).join(' ')}
      header={
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">Payment information</h2>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            The method&apos;s registered type and safe identifier details.
          </p>
        </div>
      }
    >
      <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <div className="min-w-0 space-y-1.5">
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">Type</dt>
          <dd><PaymentMethodTypeBadge type={paymentMethod.type} /></dd>
        </div>
        <div className="min-w-0 space-y-1.5">
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">Masked identifier</dt>
          <dd className="font-mono text-sm text-[var(--foreground-secondary)]">
            {paymentMethod.lastFour?.trim()
              ? <span aria-label={`Payment method ending in ${paymentMethod.lastFour}`}>•••• {paymentMethod.lastFour.trim()}</span>
              : <span className="font-sans text-[var(--foreground-muted)]">Not available</span>}
          </dd>
        </div>
      </dl>
    </Card>
  );
}

export default PaymentMethodInformationPanel;

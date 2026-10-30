/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Lifecycle Panel
 * -----------------------------------------------------------------------------
 */
import { Card } from '@/components/ui';
import type { AdminPaymentMethod } from '@/features/admin/finance/payment-methods/models';
import {
  PaymentMethodDate,
  PaymentMethodDefaultBadge,
  PaymentMethodStatusBadge,
} from '../shared';

export interface PaymentMethodLifecyclePanelProps {
  paymentMethod: AdminPaymentMethod;
  className?: string;
}

export function PaymentMethodLifecyclePanel({
  paymentMethod,
  className,
}: PaymentMethodLifecyclePanelProps) {
  return (
    <Card
      padding="lg"
      className={['min-w-0', className].filter(Boolean).join(' ')}
      header={
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">Lifecycle</h2>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Current usability and account-default state.
          </p>
        </div>
      }
    >
      <dl className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <dt className="text-sm text-[var(--foreground-secondary)]">Status</dt>
          <dd><PaymentMethodStatusBadge isActive={paymentMethod.isActive} /></dd>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <dt className="text-sm text-[var(--foreground-secondary)]">Default for account</dt>
          <dd>
            {paymentMethod.isDefault
              ? <PaymentMethodDefaultBadge isDefault />
              : <span className="text-sm text-[var(--foreground-muted)]">No</span>}
          </dd>
        </div>
      </dl>
    </Card>
  );
}

export default PaymentMethodLifecyclePanel;

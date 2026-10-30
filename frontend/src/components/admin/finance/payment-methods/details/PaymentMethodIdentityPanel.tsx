/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Identity Panel
 * -----------------------------------------------------------------------------
 *
 * Presents the payment method's safe public identity using shared primitives.
 * -----------------------------------------------------------------------------
 */
import { Card } from '@/components/ui';
import type { AdminPaymentMethod } from '@/features/admin/finance/payment-methods/models';
import {
  PaymentMethodDefaultBadge,
  PaymentMethodDisplayName,
  PaymentMethodPublicId,
  PaymentMethodStatusBadge,
} from '../shared';

export interface PaymentMethodIdentityPanelProps {
  paymentMethod: AdminPaymentMethod;
  className?: string;
}

export function PaymentMethodIdentityPanel({
  paymentMethod,
  className,
}: PaymentMethodIdentityPanelProps) {
  return (
    <Card
      padding="lg"
      className={['min-w-0', className].filter(Boolean).join(' ')}
      header={
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">Identity</h2>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Public identity and current account status.
          </p>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Display name
            </p>
            <PaymentMethodDisplayName
              displayName={paymentMethod.displayName}
              className="text-base"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PaymentMethodStatusBadge isActive={paymentMethod.isActive} />
            <PaymentMethodDefaultBadge isDefault={paymentMethod.isDefault} />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Public payment method ID
          </p>
          <PaymentMethodPublicId publicId={paymentMethod.publicId} />
        </div>
      </div>
    </Card>
  );
}

export default PaymentMethodIdentityPanel;

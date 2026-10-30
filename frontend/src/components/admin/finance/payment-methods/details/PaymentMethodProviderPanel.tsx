/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Provider Panel
 * -----------------------------------------------------------------------------
 *
 * Provider values and references are supplied by the API. This component does
 * not infer provider capabilities or expose authentication material.
 * -----------------------------------------------------------------------------
 */
import { Card } from '@/components/ui';
import type { AdminPaymentMethod } from '@/features/admin/finance/payment-methods/models';
import { PaymentMethodProviderBadge } from '../shared';

export interface PaymentMethodProviderPanelProps {
  paymentMethod: AdminPaymentMethod;
  className?: string;
}

function DetailValue({ value }: { value?: string | null }) {
  const normalized = value?.trim();
  return normalized ? (
    <span className="break-all text-sm text-[var(--foreground)]">{normalized}</span>
  ) : (
    <span className="text-sm text-[var(--foreground-muted)]">Not provided</span>
  );
}

export function PaymentMethodProviderPanel({
  paymentMethod,
  className,
}: PaymentMethodProviderPanelProps) {
  return (
    <Card
      padding="lg"
      className={['min-w-0', className].filter(Boolean).join(' ')}
      header={
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">Provider</h2>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Provider name and the reference returned by the provider.
          </p>
        </div>
      }
    >
      <dl className="space-y-5">
        <div className="space-y-1.5">
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">Provider</dt>
          <dd><PaymentMethodProviderBadge provider={paymentMethod.provider} /></dd>
        </div>
        <div className="space-y-1.5">
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">Provider reference</dt>
          <dd><DetailValue value={paymentMethod.providerReference} /></dd>
        </div>
      </dl>
    </Card>
  );
}

export default PaymentMethodProviderPanel;

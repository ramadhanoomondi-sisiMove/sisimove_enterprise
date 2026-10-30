/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Display Metadata Panel
 * -----------------------------------------------------------------------------
 *
 * Shows only safe display metadata present in the public model. Raw credentials
 * and provider authentication material are intentionally never rendered.
 * -----------------------------------------------------------------------------
 */
import { Card } from '@/components/ui';
import type { AdminPaymentMethod } from '@/features/admin/finance/payment-methods/models';

export interface PaymentMethodDisplayMetadataPanelProps {
  paymentMethod: AdminPaymentMethod;
  className?: string;
}

function MetadataRow({ label, value }: { label: string; value?: string | null }) {
  const normalized = value?.trim();
  return (
    <div className="flex flex-col gap-1.5 border-b border-[var(--border-subtle)] py-3 last:border-0 last:pb-0 first:pt-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <dt className="text-sm text-[var(--foreground-secondary)]">{label}</dt>
      <dd className="break-all text-sm font-medium text-[var(--foreground)] sm:max-w-[65%] sm:text-right">
        {normalized || <span className="font-normal text-[var(--foreground-muted)]">Not provided</span>}
      </dd>
    </div>
  );
}

export function PaymentMethodDisplayMetadataPanel({
  paymentMethod,
  className,
}: PaymentMethodDisplayMetadataPanelProps) {
  return (
    <Card
      padding="lg"
      className={['min-w-0', className].filter(Boolean).join(' ')}
      header={
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">Display metadata</h2>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Human-readable and masked details available to the admin interface.
          </p>
        </div>
      }
    >
      <dl>
        <MetadataRow label="Display name" value={paymentMethod.displayName} />
        <MetadataRow label="Masked identifier (last four)" value={paymentMethod.lastFour} />
      </dl>
      <p className="mt-4 rounded-[var(--radius-md)] bg-[var(--background-subtle)] p-3 text-xs leading-5 text-[var(--foreground-muted)]">
        Sensitive payment credentials and provider authentication data are not part of this view.
      </p>
    </Card>
  );
}

export default PaymentMethodDisplayMetadataPanel;

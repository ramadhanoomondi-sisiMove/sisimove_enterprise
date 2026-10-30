/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Account Reference Panel
 * -----------------------------------------------------------------------------
 *
 * Shows the public identifier of the owning Financial Account. It deliberately
 * does not assume that account details are available in the payment-method
 * response.
 * -----------------------------------------------------------------------------
 */
import { Card } from '@/components/ui';
import type { AdminPaymentMethod } from '@/features/admin/finance/payment-methods/models';
import { PaymentMethodPublicId } from '../shared';

export interface PaymentMethodAccountReferencePanelProps {
  paymentMethod: AdminPaymentMethod;
  onViewAccount?: (accountPublicId: string) => void;
  className?: string;
}

export function PaymentMethodAccountReferencePanel({
  paymentMethod,
  onViewAccount,
  className,
}: PaymentMethodAccountReferencePanelProps) {
  const accountPublicId = paymentMethod.accountPublicId?.trim() ?? '';

  return (
    <Card
      padding="lg"
      className={['min-w-0', className].filter(Boolean).join(' ')}
      header={
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">Owning account</h2>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Public reference to the Financial Account associated with this method.
          </p>
        </div>
      }
    >
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
          Account public ID
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PaymentMethodPublicId publicId={accountPublicId} />
          {accountPublicId && onViewAccount && (
            <button
              type="button"
              onClick={() => onViewAccount(accountPublicId)}
              className="rounded-[var(--radius-md)] px-2 py-1 text-sm font-medium text-[var(--brand)] hover:bg-[var(--brand-soft)] focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
            >
              View account
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default PaymentMethodAccountReferencePanel;

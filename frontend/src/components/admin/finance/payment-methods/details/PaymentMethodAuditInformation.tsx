/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Audit Information
 * -----------------------------------------------------------------------------
 *
 * Displays API-provided creation and update timestamps. These are record
 * timestamps, not a full audit-event history.
 * -----------------------------------------------------------------------------
 */
import { Card } from '@/components/ui';
import type { AdminPaymentMethod } from '@/features/admin/finance/payment-methods/models';
import { PaymentMethodDate } from '../shared';

export interface PaymentMethodAuditInformationProps {
  paymentMethod: AdminPaymentMethod;
  className?: string;
}

export function PaymentMethodAuditInformation({
  paymentMethod,
  className,
}: PaymentMethodAuditInformationProps) {
  return (
    <Card
      padding="lg"
      className={['min-w-0', className].filter(Boolean).join(' ')}
      header={
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">Audit information</h2>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Record timestamps supplied by the payment-method API.
          </p>
        </div>
      }
    >
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">Created at</dt>
          <dd><PaymentMethodDate date={paymentMethod.createdAt} includeTime /></dd>
        </div>
        <div className="space-y-1.5">
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">Last updated</dt>
          <dd><PaymentMethodDate date={paymentMethod.updatedAt} includeTime /></dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-5 text-[var(--foreground-muted)]">
        This panel displays the record&apos;s timestamps only. It does not represent a chronological audit log of individual actions.
      </p>
    </Card>
  );
}

export default PaymentMethodAuditInformation;

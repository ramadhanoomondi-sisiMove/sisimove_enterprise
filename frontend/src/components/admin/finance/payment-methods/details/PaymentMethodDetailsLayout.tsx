/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Details Layout
 * -----------------------------------------------------------------------------
 *
 * Composition root for the payment-method detail panels. Data retrieval and
 * route resolution remain the responsibility of the feature page/controller.
 * -----------------------------------------------------------------------------
 */
import type { AdminPaymentMethod } from '@/features/admin/finance/payment-methods/models';
import { Button } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';
import { PaymentMethodIdentityPanel } from './PaymentMethodIdentityPanel';
import { PaymentMethodInformationPanel } from './PaymentMethodInformationPanel';
import { PaymentMethodProviderPanel } from './PaymentMethodProviderPanel';
import { PaymentMethodAccountReferencePanel } from './PaymentMethodAccountReferencePanel';
import { PaymentMethodDisplayMetadataPanel } from './PaymentMethodDisplayMetadataPanel';
import { PaymentMethodLifecyclePanel } from './PaymentMethodLifecyclePanel';
import { PaymentMethodAuditInformation } from './PaymentMethodAuditInformation';

export interface PaymentMethodDetailsLayoutProps {
  paymentMethod: AdminPaymentMethod;
  onBack?: () => void;
  onViewAccount?: (accountPublicId: string) => void;
  className?: string;
}

export function PaymentMethodDetailsLayout({
  paymentMethod,
  onBack,
  onViewAccount,
  className,
}: PaymentMethodDetailsLayoutProps) {
  return (
    <section className={['space-y-6', className].filter(Boolean).join(' ')}>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--brand)]">Finance administration</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
            Payment method details
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--foreground-secondary)]">
            Review the registered identity, provider, owning account, lifecycle, and record timestamps.
          </p>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack} leadingIcon={<ArrowLeft size={16} aria-hidden="true" />}>
            Back to payment methods
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <PaymentMethodIdentityPanel paymentMethod={paymentMethod} />
        <PaymentMethodInformationPanel paymentMethod={paymentMethod} />
        <PaymentMethodProviderPanel paymentMethod={paymentMethod} />
        <PaymentMethodAccountReferencePanel
          paymentMethod={paymentMethod}
          onViewAccount={onViewAccount}
        />
        <PaymentMethodDisplayMetadataPanel paymentMethod={paymentMethod} />
        <PaymentMethodLifecyclePanel paymentMethod={paymentMethod} />
        <PaymentMethodAuditInformation paymentMethod={paymentMethod} />
      </div>
    </section>
  );
}

export default PaymentMethodDetailsLayout;

/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Set Payment Method as Default Dialog
 * -----------------------------------------------------------------------------
 */
'use client';

import { useCallback } from 'react';
import { Button, Dialog } from '@/components/ui';
import type { AdminPaymentMethod } from '@/features/admin/finance/payment-methods/models';
import { PaymentMethodDisplayName } from '../shared';
import { PaymentMethodOperationConfirmation } from './PaymentMethodOperationConfirmation';

export interface PaymentMethodSetDefaultDialogProps {
  open: boolean;
  paymentMethod: AdminPaymentMethod | null;
  isPending?: boolean;
  error?: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (paymentMethod: AdminPaymentMethod) => void | Promise<void>;
}

export function PaymentMethodSetDefaultDialog({
  open,
  paymentMethod,
  isPending = false,
  error,
  onOpenChange,
  onConfirm,
}: PaymentMethodSetDefaultDialogProps) {
  const handleConfirm = useCallback(() => {
    if (!paymentMethod || isPending || paymentMethod.isDefault) return;
    void onConfirm(paymentMethod);
  }, [paymentMethod, isPending, onConfirm]);

  const footer = (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <Button variant="outline" disabled={isPending} onClick={() => onOpenChange(false)}>
        Cancel
      </Button>
      <Button disabled={!paymentMethod || paymentMethod.isDefault} loading={isPending} onClick={handleConfirm}>
        Set as default
      </Button>
    </div>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Set payment method as default?"
      description="Confirm the default payment method for this account."
      size="md"
      footer={footer}
    >
      {paymentMethod ? (
        <div className="space-y-4">
          <PaymentMethodOperationConfirmation
            title="Change the account default"
            description="This payment method will become the default for its owning Financial Account."
            impact="The default selection may affect future account payment flows. Confirm that this is the intended method."
            confirmLabel="Set as default"
            isPending={isPending}
          />
          <div className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">Selected method</p>
            <div className="mt-1"><PaymentMethodDisplayName displayName={paymentMethod.displayName} /></div>
            <p className="mt-1 break-all font-mono text-xs text-[var(--foreground-muted)]">{paymentMethod.publicId}</p>
          </div>
          {paymentMethod.isDefault && (
            <p className="text-sm text-[var(--foreground-muted)]">This method is already the account default.</p>
          )}
          {error && <p className="text-sm text-[var(--danger)]" role="alert">{error}</p>}
        </div>
      ) : (
        <p className="text-sm text-[var(--foreground-secondary)]">Select a payment method before continuing.</p>
      )}
    </Dialog>
  );
}

export default PaymentMethodSetDefaultDialog;

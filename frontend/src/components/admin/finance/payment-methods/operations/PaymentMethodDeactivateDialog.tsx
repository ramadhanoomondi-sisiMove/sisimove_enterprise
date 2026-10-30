/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Deactivate Payment Method Dialog
 * -----------------------------------------------------------------------------
 */
'use client';

import { useCallback } from 'react';
import { Button, Dialog } from '@/components/ui';
import type { AdminPaymentMethod } from '@/features/admin/finance/payment-methods/models';
import { PaymentMethodDisplayName } from '../shared';
import { PaymentMethodOperationConfirmation } from './PaymentMethodOperationConfirmation';

export interface PaymentMethodDeactivateDialogProps {
  open: boolean;
  paymentMethod: AdminPaymentMethod | null;
  isPending?: boolean;
  error?: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (paymentMethod: AdminPaymentMethod) => void | Promise<void>;
}

export function PaymentMethodDeactivateDialog({
  open,
  paymentMethod,
  isPending = false,
  error,
  onOpenChange,
  onConfirm,
}: PaymentMethodDeactivateDialogProps) {
  const handleConfirm = useCallback(() => {
    if (!paymentMethod || isPending || !paymentMethod.isActive) return;
    void onConfirm(paymentMethod);
  }, [paymentMethod, isPending, onConfirm]);

  const footer = (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <Button variant="outline" disabled={isPending} onClick={() => onOpenChange(false)}>
        Cancel
      </Button>
      <Button variant="danger" disabled={!paymentMethod || !paymentMethod.isActive} loading={isPending} onClick={handleConfirm}>
        Deactivate method
      </Button>
    </div>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Deactivate payment method?"
      description="Review the method before confirming this change."
      size="md"
      footer={footer}
    >
      {paymentMethod ? (
        <div className="space-y-4">
          <PaymentMethodOperationConfirmation
            title="This method will no longer be active"
            description="Deactivation marks the registered method as unavailable for use. The operation does not delete the payment-method record."
            impact={paymentMethod.isDefault
              ? 'This method is currently marked as the account default. Confirm the backend policy for deactivating a default method before proceeding.'
              : 'Confirm that this payment method should no longer be available.'}
            tone="danger"
            confirmLabel="Deactivate method"
            isPending={isPending}
          />
          <div className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">Selected method</p>
            <div className="mt-1"><PaymentMethodDisplayName displayName={paymentMethod.displayName} /></div>
            <p className="mt-1 break-all font-mono text-xs text-[var(--foreground-muted)]">{paymentMethod.publicId}</p>
          </div>
          {!paymentMethod.isActive && (
            <p className="text-sm text-[var(--foreground-muted)]">This method is already inactive.</p>
          )}
          {error && <p className="text-sm text-[var(--danger)]" role="alert">{error}</p>}
        </div>
      ) : (
        <p className="text-sm text-[var(--foreground-secondary)]">Select a payment method before continuing.</p>
      )}
    </Dialog>
  );
}

export default PaymentMethodDeactivateDialog;

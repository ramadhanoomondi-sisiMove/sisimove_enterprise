/**
 * -----------------------------------------------------------------------------
 * sisiMove Admin — Payment Method Actions Menu
 * -----------------------------------------------------------------------------
 *
 * Lightweight action disclosure. Operation state and authorization remain
 * owned by the caller; this component only exposes the available callbacks.
 * -----------------------------------------------------------------------------
 */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { CheckCircle2, ChevronDown, MoreHorizontal, ShieldOff } from 'lucide-react';
import type { AdminPaymentMethodSummary } from '@/features/admin/finance/payment-methods/models';

export interface PaymentMethodActionsMenuProps {
  paymentMethod: AdminPaymentMethodSummary;
  canSetDefault?: boolean;
  canDeactivate?: boolean;
  disabled?: boolean;
  onSetDefault?: (paymentMethod: AdminPaymentMethodSummary) => void;
  onDeactivate?: (paymentMethod: AdminPaymentMethodSummary) => void;
  className?: string;
}

export function PaymentMethodActionsMenu({
  paymentMethod,
  canSetDefault = false,
  canDeactivate = false,
  disabled = false,
  onSetDefault,
  onDeactivate,
  className,
}: PaymentMethodActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const hasSetDefault = canSetDefault && !paymentMethod.isDefault && Boolean(onSetDefault);
  const hasDeactivate = canDeactivate && paymentMethod.isActive && Boolean(onDeactivate);

  if (!hasSetDefault && !hasDeactivate) return null;

  return (
    <div className={['relative inline-flex', className].filter(Boolean).join(' ')}>
      <Button
        variant="outline"
        size="sm"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        leadingIcon={<MoreHorizontal size={16} aria-hidden="true" />}
        trailingIcon={<ChevronDown size={14} aria-hidden="true" />}
      >
        Actions
      </Button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close payment method actions"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            aria-label="Payment method actions"
            className="absolute right-0 top-full z-20 mt-2 min-w-52 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-[var(--shadow-lg)]"
          >
            {hasSetDefault && (
              <button
                type="button"
                role="menuitem"
                className="flex min-h-10 w-full items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-left text-sm text-[var(--foreground)] hover:bg-[var(--background-subtle)] focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
                onClick={() => { setOpen(false); onSetDefault?.(paymentMethod); }}
              >
                <CheckCircle2 size={16} aria-hidden="true" className="text-[var(--brand)]" />
                Set as default
              </button>
            )}
            {hasDeactivate && (
              <button
                type="button"
                role="menuitem"
                className="flex min-h-10 w-full items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-left text-sm text-[var(--danger)] hover:bg-[var(--danger-soft)] focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
                onClick={() => { setOpen(false); onDeactivate?.(paymentMethod); }}
              >
                <ShieldOff size={16} aria-hidden="true" />
                Deactivate method
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default PaymentMethodActionsMenu;

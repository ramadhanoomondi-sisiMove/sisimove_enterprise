
// -----------------------------------------------------------------------------
// sisiMove — M-PESA Payment Method Card
// -----------------------------------------------------------------------------
//
// Presentation component for one saved M-PESA payment method.
//
// Responsibilities:
// - Present a saved M-PESA number.
// - Show its identifying information.
// - Indicate whether it is the default number.
// - Indicate inactive state when applicable.
// - Expose parent-provided actions.
//
// The parent/container owns application orchestration.
//
// This component intentionally does NOT:
// - fetch payment methods;
// - set a payment method as default;
// - deactivate a payment method;
// - create a payment method;
// - navigate;
// - call financial APIs.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { Badge, Card } from '@/components/ui';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface PaymentMethodCardProps {
  /**
   * Saved M-PESA phone number, preferably formatted for display.
   */
  phoneNumber: string;

  /**
   * Optional member-facing display name.
   */
  displayName?: string;

  /**
   * Optional supporting description.
   */
  description?: string;

  /**
   * Whether this payment method is currently the default method.
   */
  isDefault?: boolean;

  /**
   * Whether the payment method is currently active.
   */
  isActive?: boolean;

  /**
   * Optional parent-provided actions.
   */
  actions?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMethodCard({
  phoneNumber,
  displayName,
  description,
  isDefault = false,
  isActive = true,
  actions,
}: PaymentMethodCardProps) {
  return (
    <Card variant="default" padding="md">
      {/* ------------------------------------------------------------------- */}
      {/* M-PESA Number Information                                           */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-muted)]">
            M-PESA
          </p>

          {displayName ? (
            <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {displayName}
            </p>
          ) : null}

          <p className="mt-1 break-words text-sm font-semibold text-[var(--foreground)]">
            {phoneNumber}
          </p>

          {description ? (
            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              {description}
            </p>
          ) : null}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Status Badges                                                     */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
          {isDefault ? (
            <Badge variant="brand">Default</Badge>
          ) : null}

          {!isActive ? (
            <Badge variant="outline">Inactive</Badge>
          ) : null}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Parent-Provided Actions                                             */}
      {/* ------------------------------------------------------------------- */}

      {actions ? (
        <div className="mt-4 border-t border-[var(--border-subtle)] pt-3">
          <div className="flex flex-wrap items-center gap-2">
            {actions}
          </div>
        </div>
      ) : null}
    </Card>
  );
}

// -----------------------------------------------------------------------------
// sisiMove — Payment Method Card
// -----------------------------------------------------------------------------
//
// Presentation component for one saved payment method.
//
// Responsibilities:
// - Present a saved payment method.
// - Show its type and identifying information.
// - Indicate whether it is the default method.
// - Indicate inactive state when applicable.
// - Expose parent-provided actions.
//
// Architecture:
//
//     Payment Methods Container
//              │
//              ▼
//     PaymentMethodCard
//              │
//              ├── Card
//              └── Badge
//
// This component intentionally does NOT:
// - fetch payment methods;
// - set a payment method as default;
// - deactivate a payment method;
// - create a payment method;
// - navigate;
// - call financial APIs.
//
// The parent/container owns application orchestration.
// Actions are supplied as React nodes so this component remains independent
// of routing, permissions, and mutation hooks.
//
// The payment method public ID belongs to the feature/application model and
// does not need to be passed into this purely presentational component unless
// the component itself needs to act on that identity.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { Badge, Card } from '@/components/ui';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface PaymentMethodCardProps {
  /**
   * Human-readable payment method type.
   *
   * Examples:
   * - M-PESA
   * - Card
   * - Bank Account
   */
  type: string;

  /**
   * Human-readable masked identifier.
   *
   * Examples:
   * - +254 7•• ••• 123
   * - •••• 4242
   */
  label: string;

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
   *
   * Inactive methods may still be displayed when the parent wants to expose
   * historical or account information.
   */
  isActive?: boolean;

  /**
   * Optional parent-provided actions.
   *
   * Examples:
   * - Set default
   * - Deactivate
   */
  actions?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMethodCard({
  type,
  label,
  description,
  isDefault = false,
  isActive = true,
  actions,
}: PaymentMethodCardProps) {
  return (
    <Card
      variant="default"
      padding="md"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Method information                                                  */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-muted)]">
            {type}
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-[var(--foreground)]">
            {label}
          </p>

          {description ? (
            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              {description}
            </p>
          ) : null}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Status badges                                                     */}
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
      {/* Parent-provided actions                                             */}
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
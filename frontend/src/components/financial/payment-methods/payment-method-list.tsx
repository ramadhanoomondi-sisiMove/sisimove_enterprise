
// -----------------------------------------------------------------------------
// sisiMove — M-PESA Payment Method List
// -----------------------------------------------------------------------------
//
// Presentation component for a collection of saved M-PESA payment methods.
//
// Responsibilities:
// - Render M-PESA payment-method cards in a responsive list.
// - Present an empty state when no numbers exist.
// - Pass presentation data and parent-provided actions to each card.
//
// The parent/container owns data retrieval, mutations, authorization, and
// navigation.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  PaymentMethodCard,
  type PaymentMethodCardProps,
} from './payment-method-card';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

export interface PaymentMethodListItem
  extends Omit<PaymentMethodCardProps, 'actions'> {
  /**
   * Stable key for the rendered payment method.
   *
   * Normally the payment method public ID.
   */
  id: string;

  /**
   * Optional actions belonging to this payment method.
   */
  actions?: ReactNode;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface PaymentMethodListProps {
  /**
   * Saved M-PESA numbers to display.
   */
  paymentMethods: PaymentMethodListItem[];

  /**
   * Optional content displayed when no numbers exist.
   */
  emptyState?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMethodList({
  paymentMethods,
  emptyState,
}: PaymentMethodListProps) {
  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------

  if (paymentMethods.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-[var(--background-subtle)] p-5 text-center">
        <p className="text-sm font-medium text-[var(--foreground)]">
          No M-PESA numbers saved
        </p>

        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Add an M-PESA number to make wallet top-ups easier.
        </p>

        {emptyState ? (
          <div className="mt-4 flex justify-center">
            {emptyState}
          </div>
        ) : null}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Payment method collection
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-3">
      {paymentMethods.map((paymentMethod) => {
        const {
          id,
          actions,
          ...cardProps
        } = paymentMethod;

        return (
          <PaymentMethodCard
            key={id}
            {...cardProps}
            actions={actions}
          />
        );
      })}
    </div>
  );
}

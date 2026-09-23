// -----------------------------------------------------------------------------
// sisiMove — Payment Method List
// -----------------------------------------------------------------------------
//
// Presentation component for a collection of saved payment methods.
//
// Responsibilities:
// - Render payment method cards in a consistent responsive list.
// - Present an empty state when no methods exist.
// - Pass presentation data and parent-provided actions to each card.
//
// Architecture:
//
//     Payment Methods Container
//              │
//              ▼
//     PaymentMethodList
//              │
//              └── PaymentMethodCard[]
//
// This component intentionally does NOT:
// - fetch payment methods;
// - create payment methods;
// - set defaults;
// - deactivate methods;
// - navigate;
// - own mutation state.
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
   * This should normally be the payment method public ID.
   */
  id: string;

  /**
   * Optional actions belonging to this specific payment method.
   *
   * The parent remains responsible for creating these actions.
   */
  actions?: ReactNode;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface PaymentMethodListProps {
  /**
   * Payment methods to display.
   */
  paymentMethods: PaymentMethodListItem[];

  /**
   * Optional content displayed when the list is empty.
   *
   * This allows the container to provide an "Add payment method" action
   * without coupling this component to routing or mutation behavior.
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
  //
  // Keep the empty-state decision at the presentation boundary while allowing
  // the parent to supply the actual contextual action.
  //
  if (paymentMethods.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-[var(--background-subtle)] p-5 text-center">
        <p className="text-sm font-medium text-[var(--foreground)]">
          No payment methods
        </p>

        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Add a payment method to make wallet top-ups easier.
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
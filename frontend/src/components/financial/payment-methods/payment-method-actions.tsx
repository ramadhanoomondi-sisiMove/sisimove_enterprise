// -----------------------------------------------------------------------------
// sisiMove — Payment Method Actions
// -----------------------------------------------------------------------------
//
// Presentation component for actions associated with one saved payment
// method.
//
// Responsibilities:
// - Present available payment-method actions.
// - Render actions using the shared Button primitive.
// - Communicate user intent through callbacks.
// - Present operation progress through the Button loading state.
//
// Architecture:
//
//     Payment Methods Container
//              │
//              ▼
//     PaymentMethodActions
//              │
//              └── Button[]
//
// This component intentionally does NOT:
// - call payment-method APIs;
// - own mutation hooks;
// - navigate;
// - perform authorization checks;
// - determine whether an action is permitted.
//
// The parent/container owns application orchestration and decides which
// actions are available.
//
// -----------------------------------------------------------------------------

'use client';

import { Button } from '@/components/ui';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface PaymentMethodActionsProps {
  /**
   * Whether this payment method is already the default.
   *
   * When true, the "Set as default" action is not rendered.
   */
  isDefault?: boolean;

  /**
   * Whether this payment method is currently active.
   *
   * Inactive methods do not expose active-method actions.
   */
  isActive?: boolean;

  /**
   * Whether an operation associated with this payment method is in progress.
   */
  isLoading?: boolean;

  /**
   * Called when the member wants to make this method the default.
   */
  onSetDefault?: () => void;

  /**
   * Called when the member wants to deactivate this method.
   */
  onDeactivate?: () => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMethodActions({
  isDefault = false,
  isActive = true,
  isLoading = false,
  onSetDefault,
  onDeactivate,
}: PaymentMethodActionsProps) {
  const hasSetDefaultAction =
    isActive && !isDefault && Boolean(onSetDefault);

  const hasDeactivateAction =
    isActive && Boolean(onDeactivate);

  if (!hasSetDefaultAction && !hasDeactivateAction) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* ------------------------------------------------------------------- */}
      {/* Set default                                                        */}
      {/* ------------------------------------------------------------------- */}
      {hasSetDefaultAction ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={isLoading}
          onClick={onSetDefault}
        >
          Set as default
        </Button>
      ) : null}

      {/* ------------------------------------------------------------------- */}
      {/* Deactivate                                                         */}
      {/* ------------------------------------------------------------------- */}
      {hasDeactivateAction ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={onDeactivate}
        >
          Deactivate
        </Button>
      ) : null}
    </div>
  );
}
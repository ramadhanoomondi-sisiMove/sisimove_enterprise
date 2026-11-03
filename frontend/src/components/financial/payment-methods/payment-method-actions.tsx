
// -----------------------------------------------------------------------------
// sisiMove — M-PESA Payment Method Actions
// -----------------------------------------------------------------------------
//
// Presentation component for actions associated with one saved M-PESA number.
//
// The parent/container owns application orchestration, authorization,
// eligibility checks, and API mutations.
//
// -----------------------------------------------------------------------------

'use client';

import { Button } from '@/components/ui';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface PaymentMethodActionsProps {
  /**
   * Whether this M-PESA number is already the default.
   */
  isDefault?: boolean;

  /**
   * Whether this M-PESA number is currently active.
   */
  isActive?: boolean;

  /**
   * Whether an operation associated with this number is in progress.
   */
  isLoading?: boolean;

  /**
   * Called when the member wants to make this number the default.
   */
  onSetDefault?: () => void;

  /**
   * Called when the member wants to deactivate this number.
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
          disabled={isLoading}
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
          Deactivate number
        </Button>
      ) : null}
    </div>
  );
}

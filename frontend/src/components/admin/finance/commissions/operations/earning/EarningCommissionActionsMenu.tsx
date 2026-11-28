
'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Earning Commission Actions Menu
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display available earning commission lifecycle actions.
// - Notify the parent when an action is selected.
// - Respect the disabled state during ongoing operations.
//
// Architecture:
// - The parent determines which actions are available.
// - This component does not infer lifecycle eligibility.
// - Mutation execution remains outside this component.
// -----------------------------------------------------------------------------

import { Button } from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type EarningCommissionAction =
  | 'assess'
  | 'cancel';

export interface EarningCommissionActionsMenuProps {
  readonly availableActions: readonly EarningCommissionAction[];
  readonly onAction: (action: EarningCommissionAction) => void;
  readonly disabled?: boolean;
}

// -----------------------------------------------------------------------------
// Action Labels
// -----------------------------------------------------------------------------

const actionLabels: Record<EarningCommissionAction, string> = {
  assess: 'Assess commission',
  cancel: 'Cancel commission',
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function EarningCommissionActionsMenu({
  availableActions,
  onAction,
  disabled = false,
}: EarningCommissionActionsMenuProps) {
  if (availableActions.length === 0) {
    return null;
  }

  return (
    <div
      className="flex flex-wrap items-center justify-end gap-2"
      aria-label="Earning commission actions"
    >
      {availableActions.map((action) => (
        <Button
          key={action}
          type="button"
          size="sm"
          variant={action === 'cancel' ? 'danger' : 'primary'}
          disabled={disabled}
          onClick={() => onAction(action)}
        >
          {actionLabels[action]}
        </Button>
      ))}
    </div>
  );
}

export default EarningCommissionActionsMenu;

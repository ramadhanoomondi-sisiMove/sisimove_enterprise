
'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Commission Rule Actions Menu
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display the rule actions supplied by the parent.
// - Notify the parent when an action is selected.
// - Respect the disabled state during an operation.
//
// Architecture:
// - The parent owns action availability.
// - Rule lifecycle eligibility remains controlled by the backend.
// - This component performs no mutations.
// -----------------------------------------------------------------------------

import { Button } from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type CommissionRuleAction =
  | 'update'
  | 'activate'
  | 'deactivate';

export interface CommissionRuleActionsMenuProps {
  readonly availableActions: readonly CommissionRuleAction[];
  readonly onAction: (action: CommissionRuleAction) => void;
  readonly disabled?: boolean;
}

// -----------------------------------------------------------------------------
// Labels
// -----------------------------------------------------------------------------

const ACTION_LABELS: Record<CommissionRuleAction, string> = {
  update: 'Update rule',
  activate: 'Activate rule',
  deactivate: 'Deactivate rule',
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CommissionRuleActionsMenu({
  availableActions,
  onAction,
  disabled = false,
}: CommissionRuleActionsMenuProps) {
  if (availableActions.length === 0) {
    return null;
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="group"
      aria-label="Commission rule actions"
    >
      {availableActions.map((action) => (
        <Button
          key={action}
          type="button"
          size="sm"
          variant={action === 'deactivate' ? 'danger' : 'outline'}
          disabled={disabled}
          onClick={() => onAction(action)}
        >
          {ACTION_LABELS[action]}
        </Button>
      ))}
    </div>
  );
}

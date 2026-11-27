import { Button } from '@/components/ui';

export type JourneyCompletionDisputeAction =
  | 'REVIEW_DISPUTE'
  | 'RESOLVE_DISPUTE'
  | 'REJECT_DISPUTE'
  | 'WITHDRAW_DISPUTE';

export interface JourneyCompletionDisputeActionsMenuProps {
  availableActions: JourneyCompletionDisputeAction[];
  onAction: (action: JourneyCompletionDisputeAction) => void;
  disabled?: boolean;
}

const ACTION_LABELS: Record<JourneyCompletionDisputeAction, string> = {
  REVIEW_DISPUTE: 'Review dispute',
  RESOLVE_DISPUTE: 'Resolve dispute',
  REJECT_DISPUTE: 'Reject dispute',
  WITHDRAW_DISPUTE: 'Withdraw dispute',
};

export function JourneyCompletionDisputeActionsMenu({
  availableActions,
  onAction,
  disabled = false,
}: JourneyCompletionDisputeActionsMenuProps) {
  if (availableActions.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {availableActions.map((action) => (
        <Button
          key={action}
          type="button"
          variant={action === 'REJECT_DISPUTE' || action === 'WITHDRAW_DISPUTE' ? 'outline' : 'secondary'}
          size="sm"
          disabled={disabled}
          onClick={() => onAction(action)}
        >
          {ACTION_LABELS[action]}
        </Button>
      ))}
    </div>
  );
}

export default JourneyCompletionDisputeActionsMenu;
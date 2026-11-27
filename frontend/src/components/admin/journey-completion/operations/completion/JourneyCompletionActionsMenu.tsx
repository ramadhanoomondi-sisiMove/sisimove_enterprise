import {
  Button,
} from '@/components/ui';

export type JourneyCompletionAction =
  | 'request'
  | 'confirm'
  | 'withdraw-confirmation'
  | 'cancel';

export interface JourneyCompletionActionsMenuProps {
  readonly availableActions: readonly JourneyCompletionAction[];
  readonly onAction: (action: JourneyCompletionAction) => void;
  readonly disabled?: boolean;
}

const actionLabels: Record<JourneyCompletionAction, string> = {
  request: 'Request completion',
  confirm: 'Confirm completion',
  'withdraw-confirmation': 'Withdraw confirmation',
  cancel: 'Cancel completion',
};

export function JourneyCompletionActionsMenu({
  availableActions,
  onAction,
  disabled = false,
}: JourneyCompletionActionsMenuProps) {
  if (availableActions.length === 0) return null;

  return (
    <div
      role="group"
      aria-label="Journey completion actions"
      className="flex flex-wrap items-center gap-2"
    >
      {availableActions.map((action) => (
        <Button
          key={action}
          type="button"
          variant={action === 'cancel' ? 'danger' : 'outline'}
          size="sm"
          disabled={disabled}
          onClick={() => onAction(action)}
        >
          {actionLabels[action]}
        </Button>
      ))}
    </div>
  );
}
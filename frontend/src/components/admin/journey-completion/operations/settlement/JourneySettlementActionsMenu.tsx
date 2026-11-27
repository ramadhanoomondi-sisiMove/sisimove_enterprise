import { Button } from '@/components/ui';

export type JourneySettlementAction =
  | 'SUBMIT'
  | 'PROCESS'
  | 'COMPLETE'
  | 'FAIL'
  | 'HOLD'
  | 'CANCEL';

export interface JourneySettlementActionsMenuProps {
  availableActions: JourneySettlementAction[];
  onAction: (action: JourneySettlementAction) => void;
  disabled?: boolean;
}

const ACTION_LABELS: Record<JourneySettlementAction, string> = {
  SUBMIT: 'Submit settlement',
  PROCESS: 'Process settlement',
  COMPLETE: 'Complete settlement',
  FAIL: 'Fail settlement',
  HOLD: 'Hold settlement',
  CANCEL: 'Cancel settlement',
};

export function JourneySettlementActionsMenu({
  availableActions,
  onAction,
  disabled = false,
}: JourneySettlementActionsMenuProps) {
  if (availableActions.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {availableActions.map((action) => (
        <Button
          key={action}
          type="button"
          size="sm"
          variant={
            action === 'FAIL' || action === 'CANCEL'
              ? 'outline'
              : 'secondary'
          }
          disabled={disabled}
          onClick={() => onAction(action)}
        >
          {ACTION_LABELS[action]}
        </Button>
      ))}
    </div>
  );
}

export default JourneySettlementActionsMenu;
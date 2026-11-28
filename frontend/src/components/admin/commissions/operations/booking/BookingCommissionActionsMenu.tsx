
import { Button } from '@/components/ui';

export type BookingCommissionAction =
  | 'assess'
  | 'cancel';

export interface BookingCommissionActionsMenuProps {
  readonly availableActions: readonly BookingCommissionAction[];
  readonly onAction: (action: BookingCommissionAction) => void;
  readonly disabled?: boolean;
}

const actionLabels: Record<BookingCommissionAction, string> = {
  assess: 'Assess commission',
  cancel: 'Cancel commission',
};

export function BookingCommissionActionsMenu({
  availableActions,
  onAction,
  disabled = false,
}: BookingCommissionActionsMenuProps) {
  if (availableActions.length === 0) {
    return null;
  }

  return (
    <div
      role="group"
      aria-label="Booking commission actions"
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

export default BookingCommissionActionsMenu;

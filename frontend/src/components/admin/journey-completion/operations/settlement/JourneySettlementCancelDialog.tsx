import { useState } from 'react';
import type {
  AdminJourneySettlementCancelRequest,
} from '@/features/admin/journey-completion/models/admin-journey-settlement-operations.model';
import { JourneySettlementOperationConfirmation } from './JourneySettlementOperationConfirmation';

export interface JourneySettlementCancelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AdminJourneySettlementCancelRequest) => void;
  isPending?: boolean;
}

export function JourneySettlementCancelDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
}: JourneySettlementCancelDialogProps) {
  const [cancelledAt, setCancelledAt] = useState('');

  return (
    <JourneySettlementOperationConfirmation
      open={open}
      onOpenChange={onOpenChange}
      title="Cancel settlement"
      description="Are you sure you want to cancel this settlement?"
      confirmLabel="Cancel settlement"
      tone="danger"
      isPending={isPending}
      onConfirm={() =>
        onSubmit({
          ...(cancelledAt
            ? { cancelledAt: new Date(cancelledAt).toISOString() }
            : {}),
        })
      }
    >
      <div className="space-y-1.5">
        <label htmlFor="settlement-cancelled-at" className="text-sm font-medium text-foreground">
          Cancellation date and time <span className="font-normal text-foreground-muted">(optional)</span>
        </label>
        <input
          id="settlement-cancelled-at"
          type="datetime-local"
          value={cancelledAt}
          onChange={(event) => setCancelledAt(event.target.value)}
          disabled={isPending}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        />
      </div>
    </JourneySettlementOperationConfirmation>
  );
}

export default JourneySettlementCancelDialog;
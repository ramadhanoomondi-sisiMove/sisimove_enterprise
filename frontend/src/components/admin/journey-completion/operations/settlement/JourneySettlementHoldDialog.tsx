import { useState } from 'react';
import type {
  AdminJourneySettlementHoldRequest,
} from '@/features/admin/journey-completion/models/admin-journey-settlement-operations.model';
import { JourneySettlementOperationConfirmation } from './JourneySettlementOperationConfirmation';

export interface JourneySettlementHoldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AdminJourneySettlementHoldRequest) => void;
  isPending?: boolean;
}

export function JourneySettlementHoldDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
}: JourneySettlementHoldDialogProps) {
  const [heldAt, setHeldAt] = useState('');

  return (
    <JourneySettlementOperationConfirmation
      open={open}
      onOpenChange={onOpenChange}
      title="Hold settlement"
      description="Place this settlement on hold."
      confirmLabel="Hold settlement"
      isPending={isPending}
      onConfirm={() =>
        onSubmit({
          ...(heldAt ? { heldAt: new Date(heldAt).toISOString() } : {}),
        })
      }
    >
      <div className="space-y-1.5">
        <label htmlFor="settlement-held-at" className="text-sm font-medium text-foreground">
          Hold date and time <span className="font-normal text-foreground-muted">(optional)</span>
        </label>
        <input
          id="settlement-held-at"
          type="datetime-local"
          value={heldAt}
          onChange={(event) => setHeldAt(event.target.value)}
          disabled={isPending}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        />
      </div>
    </JourneySettlementOperationConfirmation>
  );
}

export default JourneySettlementHoldDialog;
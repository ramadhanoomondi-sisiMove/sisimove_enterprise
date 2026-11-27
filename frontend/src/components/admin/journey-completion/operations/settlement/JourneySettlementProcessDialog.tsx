import { useState } from 'react';
import type {
  AdminJourneySettlementProcessRequest,
} from '@/features/admin/journey-completion/models/admin-journey-settlement-operations.model';
import { JourneySettlementOperationConfirmation } from './JourneySettlementOperationConfirmation';

export interface JourneySettlementProcessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AdminJourneySettlementProcessRequest) => void;
  isPending?: boolean;
}

export function JourneySettlementProcessDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
}: JourneySettlementProcessDialogProps) {
  const [processingAt, setProcessingAt] = useState('');

  return (
    <JourneySettlementOperationConfirmation
      open={open}
      onOpenChange={onOpenChange}
      title="Process settlement"
      description="Move this settlement into processing."
      confirmLabel="Process settlement"
      isPending={isPending}
      onConfirm={() =>
        onSubmit({
          ...(processingAt
            ? { processingAt: new Date(processingAt).toISOString() }
            : {}),
        })
      }
    >
      <div className="space-y-1.5">
        <label htmlFor="settlement-processing-at" className="text-sm font-medium text-foreground">
          Processing date and time <span className="font-normal text-foreground-muted">(optional)</span>
        </label>
        <input
          id="settlement-processing-at"
          type="datetime-local"
          value={processingAt}
          onChange={(event) => setProcessingAt(event.target.value)}
          disabled={isPending}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        />
      </div>
    </JourneySettlementOperationConfirmation>
  );
}

export default JourneySettlementProcessDialog;
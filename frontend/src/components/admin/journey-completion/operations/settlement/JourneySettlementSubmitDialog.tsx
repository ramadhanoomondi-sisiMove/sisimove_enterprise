import { useState } from 'react';
import type {
  AdminJourneySettlementSubmitRequest,
} from '@/features/admin/journey-completion/models';
import { JourneySettlementOperationConfirmation } from './JourneySettlementOperationConfirmation';

export interface JourneySettlementSubmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AdminJourneySettlementSubmitRequest) => void;
  isPending?: boolean;
}

export function JourneySettlementSubmitDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
}: JourneySettlementSubmitDialogProps) {
  const [submittedAt, setSubmittedAt] = useState('');

  return (
    <JourneySettlementOperationConfirmation
      open={open}
      onOpenChange={onOpenChange}
      title="Submit settlement"
      description="Submit this settlement for processing."
      confirmLabel="Submit settlement"
      isPending={isPending}
      onConfirm={() =>
        onSubmit({
          ...(submittedAt
            ? { submittedAt: new Date(submittedAt).toISOString() }
            : {}),
        })
      }
    >
      <div className="space-y-1.5">
        <label htmlFor="settlement-submitted-at" className="text-sm font-medium text-foreground">
          Submission date and time <span className="font-normal text-foreground-muted">(optional)</span>
        </label>
        <input
          id="settlement-submitted-at"
          type="datetime-local"
          value={submittedAt}
          onChange={(event) => setSubmittedAt(event.target.value)}
          disabled={isPending}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        />
      </div>
    </JourneySettlementOperationConfirmation>
  );
}

export default JourneySettlementSubmitDialog;
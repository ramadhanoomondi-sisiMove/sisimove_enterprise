import { useState, type FormEvent } from 'react';
import { Button, Dialog } from '@/components/ui';
import type {
  AdminJourneySettlementCompleteRequest,
} from '@/features/admin/journey-completion/models/admin-journey-settlement-operations.model';

export interface JourneySettlementCompleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AdminJourneySettlementCompleteRequest) => void;
  isPending?: boolean;
}

export function JourneySettlementCompleteDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
}: JourneySettlementCompleteDialogProps) {
  const [financialTransactionPublicId, setFinancialTransactionPublicId] = useState('');
  const [completedAt, setCompletedAt] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const transactionId = financialTransactionPublicId.trim();
    if (!transactionId) return;

    onSubmit({
      financialTransactionPublicId: transactionId,
      ...(completedAt
        ? { completedAt: new Date(completedAt).toISOString() }
        : {}),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Complete settlement"
      description="Record the financial transaction associated with this completed settlement."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="settlement-financial-transaction-id" className="text-sm font-medium text-foreground">
            Financial transaction public ID
          </label>
          <input
            id="settlement-financial-transaction-id"
            value={financialTransactionPublicId}
            onChange={(event) => setFinancialTransactionPublicId(event.target.value)}
            required
            disabled={isPending}
            placeholder="Enter financial transaction public ID"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="settlement-completed-at" className="text-sm font-medium text-foreground">
            Completion date and time <span className="font-normal text-foreground-muted">(optional)</span>
          </label>
          <input
            id="settlement-completed-at"
            type="datetime-local"
            value={completedAt}
            onChange={(event) => setCompletedAt(event.target.value)}
            disabled={isPending}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" disabled={isPending} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending} disabled={isPending || !financialTransactionPublicId.trim()}>
            Complete settlement
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

export default JourneySettlementCompleteDialog;
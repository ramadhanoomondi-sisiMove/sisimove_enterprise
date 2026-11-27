import { useState, type FormEvent } from 'react';
import { Button, Dialog } from '@/components/ui';
import type {
  AdminJourneySettlementFailRequest,
} from '@/features/admin/journey-completion/models/admin-journey-settlement-operations.model';

export interface JourneySettlementFailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AdminJourneySettlementFailRequest) => void;
  isPending?: boolean;
}

export function JourneySettlementFailDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
}: JourneySettlementFailDialogProps) {
  const [failureReason, setFailureReason] = useState('');
  const [failedAt, setFailedAt] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const reason = failureReason.trim();
    if (!reason) return;

    onSubmit({
      failureReason: reason,
      ...(failedAt ? { failedAt: new Date(failedAt).toISOString() } : {}),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Fail settlement"
      description="Record why this settlement has failed."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="settlement-failure-reason" className="text-sm font-medium text-foreground">
            Failure reason
          </label>
          <textarea
            id="settlement-failure-reason"
            value={failureReason}
            onChange={(event) => setFailureReason(event.target.value)}
            rows={4}
            maxLength={2000}
            required
            disabled={isPending}
            placeholder="Describe why the settlement failed..."
            className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="settlement-failed-at" className="text-sm font-medium text-foreground">
            Failure date and time <span className="font-normal text-foreground-muted">(optional)</span>
          </label>
          <input
            id="settlement-failed-at"
            type="datetime-local"
            value={failedAt}
            onChange={(event) => setFailedAt(event.target.value)}
            disabled={isPending}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" disabled={isPending} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" loading={isPending} disabled={isPending || !failureReason.trim()}>
            Fail settlement
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

export default JourneySettlementFailDialog;
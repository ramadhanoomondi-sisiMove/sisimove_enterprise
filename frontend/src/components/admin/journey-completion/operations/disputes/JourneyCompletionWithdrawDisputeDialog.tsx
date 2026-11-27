import { useState, type FormEvent } from 'react';
import { Button, Dialog } from '@/components/ui';
import type {
  AdminJourneyCompletionWithdrawDisputeRequest,
} from '@/features/admin/journey-completion/models/admin-journey-completion-dispute-operations.model';

export interface JourneyCompletionWithdrawDisputeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AdminJourneyCompletionWithdrawDisputeRequest) => void;
  isPending?: boolean;
  withdrawnByPublicId?: string;
}

export function JourneyCompletionWithdrawDisputeDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
  withdrawnByPublicId,
}: JourneyCompletionWithdrawDisputeDialogProps) {
  const [withdrawnAt, setWithdrawnAt] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      ...(withdrawnByPublicId ? { withdrawnByPublicId } : {}),
      ...(withdrawnAt ? { withdrawnAt: new Date(withdrawnAt).toISOString() } : {}),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Withdraw dispute"
      description="Are you sure you want to withdraw this dispute? This action changes its status to withdrawn."
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="dispute-withdrawn-at" className="text-sm font-medium text-foreground">
            Withdrawal date and time <span className="font-normal text-foreground-muted">(optional)</span>
          </label>
          <input
            id="dispute-withdrawn-at"
            type="datetime-local"
            value={withdrawnAt}
            onChange={(event) => setWithdrawnAt(event.target.value)}
            disabled={isPending}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" disabled={isPending} onClick={() => onOpenChange(false)}>
            Keep dispute
          </Button>
          <Button type="submit" variant="danger" loading={isPending} disabled={isPending}>
            Withdraw dispute
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

export default JourneyCompletionWithdrawDisputeDialog;
import { useState, type FormEvent } from 'react';
import { Button, Dialog } from '@/components/ui';
import type {
  AdminJourneyCompletionRejectDisputeRequest,
} from '@/features/admin/journey-completion/models/admin-journey-completion-dispute-operations.model';

export interface JourneyCompletionRejectDisputeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AdminJourneyCompletionRejectDisputeRequest) => void;
  isPending?: boolean;
  resolvedByPublicId?: string;
}

export function JourneyCompletionRejectDisputeDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
  resolvedByPublicId,
}: JourneyCompletionRejectDisputeDialogProps) {
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [rejectedAt, setRejectedAt] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const summary = resolutionSummary.trim();
    if (!summary) return;

    onSubmit({
      ...(resolvedByPublicId ? { resolvedByPublicId } : {}),
      resolutionSummary: summary,
      ...(rejectedAt ? { rejectedAt: new Date(rejectedAt).toISOString() } : {}),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Reject dispute"
      description="Record the reason for rejecting this dispute."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="dispute-rejection-summary" className="text-sm font-medium text-foreground">
            Rejection summary
          </label>
          <textarea
            id="dispute-rejection-summary"
            value={resolutionSummary}
            onChange={(event) => setResolutionSummary(event.target.value)}
            rows={4}
            maxLength={2000}
            required
            disabled={isPending}
            placeholder="Explain why this dispute is being rejected..."
            className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="dispute-rejected-at" className="text-sm font-medium text-foreground">
            Rejection date and time <span className="font-normal text-foreground-muted">(optional)</span>
          </label>
          <input
            id="dispute-rejected-at"
            type="datetime-local"
            value={rejectedAt}
            onChange={(event) => setRejectedAt(event.target.value)}
            disabled={isPending}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" disabled={isPending} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" loading={isPending} disabled={isPending || !resolutionSummary.trim()}>
            Reject dispute
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

export default JourneyCompletionRejectDisputeDialog;
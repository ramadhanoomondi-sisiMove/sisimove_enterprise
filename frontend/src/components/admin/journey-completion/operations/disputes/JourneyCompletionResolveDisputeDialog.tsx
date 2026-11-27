import { useState, type FormEvent } from 'react';
import { Button, Dialog } from '@/components/ui';
import type {
  AdminJourneyCompletionResolveDisputeRequest,
} from '@/features/admin/journey-completion/models/admin-journey-completion-dispute-operations.model';

export interface JourneyCompletionResolveDisputeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AdminJourneyCompletionResolveDisputeRequest) => void;
  isPending?: boolean;
  resolvedByPublicId?: string;
}

export function JourneyCompletionResolveDisputeDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
  resolvedByPublicId,
}: JourneyCompletionResolveDisputeDialogProps) {
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [resolvedAt, setResolvedAt] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const summary = resolutionSummary.trim();
    if (!summary) return;

    onSubmit({
      ...(resolvedByPublicId ? { resolvedByPublicId } : {}),
      resolutionSummary: summary,
      ...(resolvedAt ? { resolvedAt: new Date(resolvedAt).toISOString() } : {}),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Resolve dispute"
      description="Record the resolution and close this dispute as resolved."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="dispute-resolution-summary" className="text-sm font-medium text-foreground">
            Resolution summary
          </label>
          <textarea
            id="dispute-resolution-summary"
            value={resolutionSummary}
            onChange={(event) => setResolutionSummary(event.target.value)}
            rows={4}
            maxLength={2000}
            required
            disabled={isPending}
            placeholder="Explain how the dispute was resolved..."
            className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="dispute-resolved-at" className="text-sm font-medium text-foreground">
            Resolution date and time <span className="font-normal text-foreground-muted">(optional)</span>
          </label>
          <input
            id="dispute-resolved-at"
            type="datetime-local"
            value={resolvedAt}
            onChange={(event) => setResolvedAt(event.target.value)}
            disabled={isPending}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" disabled={isPending} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending} disabled={isPending || !resolutionSummary.trim()}>
            Resolve dispute
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

export default JourneyCompletionResolveDisputeDialog;
import { useState, type FormEvent } from 'react';
import { Button, Dialog } from '@/components/ui';
import type {
  AdminJourneyCompletionReviewDisputeRequest,
} from '@/features/admin/journey-completion/models';

export interface JourneyCompletionReviewDisputeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AdminJourneyCompletionReviewDisputeRequest) => void;
  isPending?: boolean;
}

export function JourneyCompletionReviewDisputeDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
}: JourneyCompletionReviewDisputeDialogProps) {
  const [underReviewAt, setUnderReviewAt] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      ...(underReviewAt ? { underReviewAt: new Date(underReviewAt).toISOString() } : {}),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Review dispute"
      description="Move this dispute into the under-review stage."
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="dispute-under-review-at" className="text-sm font-medium text-foreground">
            Review date and time <span className="font-normal text-foreground-muted">(optional)</span>
          </label>
          <input
            id="dispute-under-review-at"
            type="datetime-local"
            value={underReviewAt}
            onChange={(event) => setUnderReviewAt(event.target.value)}
            disabled={isPending}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" disabled={isPending} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending} disabled={isPending}>
            Start review
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

export default JourneyCompletionReviewDisputeDialog;
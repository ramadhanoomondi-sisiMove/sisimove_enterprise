import { useState, type FormEvent } from 'react';
import { Button, Dialog } from '@/components/ui';
import type {
  AdminJourneyCompletionOpenDisputeRequest,
} from '@/features/admin/journey-completion/models';
import {
  AdminJourneyCompletionDisputeReason,
} from '@/features/admin/journey-completion/models/admin-journey-completion.enums';

export interface JourneyCompletionOpenDisputeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AdminJourneyCompletionOpenDisputeRequest) => void;
  isPending?: boolean;
  raisedByPublicId?: string;
}

const REASON_LABELS: Record<AdminJourneyCompletionDisputeReason, string> = {
  [AdminJourneyCompletionDisputeReason.JOURNEY_NOT_COMPLETED]: 'Journey not completed',
  [AdminJourneyCompletionDisputeReason.PASSENGER_DID_NOT_TRAVEL]: 'Passenger did not travel',
  [AdminJourneyCompletionDisputeReason.PROVIDER_DID_NOT_TRAVEL]: 'Provider did not travel',
  [AdminJourneyCompletionDisputeReason.WRONG_DESTINATION]: 'Wrong destination',
  [AdminJourneyCompletionDisputeReason.EARLY_TERMINATION]: 'Early termination',
  [AdminJourneyCompletionDisputeReason.SAFETY_ISSUE]: 'Safety issue',
  [AdminJourneyCompletionDisputeReason.OTHER]: 'Other',
};

export function JourneyCompletionOpenDisputeDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
  raisedByPublicId,
}: JourneyCompletionOpenDisputeDialogProps) {
  const [reason, setReason] = useState<AdminJourneyCompletionDisputeReason>(
    AdminJourneyCompletionDisputeReason.JOURNEY_NOT_COMPLETED,
  );
  const [description, setDescription] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      ...(raisedByPublicId ? { raisedByPublicId } : {}),
      reason,
      ...(description.trim() ? { description: description.trim() } : {}),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Open dispute"
      description="Select the reason for disputing this journey completion."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="completion-dispute-reason" className="text-sm font-medium text-foreground">
            Dispute reason
          </label>
          <select
            id="completion-dispute-reason"
            value={reason}
            onChange={(event) =>
              setReason(event.target.value as AdminJourneyCompletionDisputeReason)
            }
            required
            disabled={isPending}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          >
            {Object.values(AdminJourneyCompletionDisputeReason).map((value) => (
              <option key={value} value={value}>
                {REASON_LABELS[value]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="completion-dispute-description" className="text-sm font-medium text-foreground">
            Description <span className="font-normal text-foreground-muted">(optional)</span>
          </label>
          <textarea
            id="completion-dispute-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            maxLength={2000}
            disabled={isPending}
            placeholder="Provide additional details about the dispute..."
            className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isPending} disabled={isPending}>
            Open dispute
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

export default JourneyCompletionOpenDisputeDialog;
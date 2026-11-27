import { useState, type FormEvent } from 'react';
import { Button, Dialog } from '@/components/ui';
import type {
  AdminJourneySettlementCreateRequest,
} from '@/features/admin/journey-completion/models';

export interface JourneySettlementCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AdminJourneySettlementCreateRequest) => void;
  isPending?: boolean;
}

export function JourneySettlementCreateDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
}: JourneySettlementCreateDialogProps) {
  const [completionId, setCompletionId] = useState('');
  const [journeyPublicId, setJourneyPublicId] = useState('');
  const [providerPublicId, setProviderPublicId] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: AdminJourneySettlementCreateRequest = {
      completionId: completionId.trim(),
      journeyPublicId: journeyPublicId.trim(),
      providerPublicId: providerPublicId.trim(),
    };

    if (
      !payload.completionId ||
      !payload.journeyPublicId ||
      !payload.providerPublicId
    ) {
      return;
    }

    onSubmit(payload);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create settlement"
      description="Create a settlement for a journey completion."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="settlement-completion-id" className="text-sm font-medium text-foreground">
            Completion ID
          </label>
          <input
            id="settlement-completion-id"
            value={completionId}
            onChange={(event) => setCompletionId(event.target.value)}
            required
            disabled={isPending}
            placeholder="Enter completion ID"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="settlement-journey-public-id" className="text-sm font-medium text-foreground">
            Journey public ID
          </label>
          <input
            id="settlement-journey-public-id"
            value={journeyPublicId}
            onChange={(event) => setJourneyPublicId(event.target.value)}
            required
            disabled={isPending}
            placeholder="Enter journey public ID"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="settlement-provider-public-id" className="text-sm font-medium text-foreground">
            Provider public ID
          </label>
          <input
            id="settlement-provider-public-id"
            value={providerPublicId}
            onChange={(event) => setProviderPublicId(event.target.value)}
            required
            disabled={isPending}
            placeholder="Enter provider public ID"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
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
            Create settlement
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

export default JourneySettlementCreateDialog;
import { useState } from 'react';

import {
  Button,
  Dialog,
  Input,
} from '@/components/ui';

export interface JourneyCompletionCreateRequest {
  readonly journeyPublicId: string;
  readonly providerPublicId: string;
  readonly requiredConfirmations: number;
}

export interface JourneyCompletionCreateDialogProps {
  readonly open: boolean;
  readonly loading?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (
    request: JourneyCompletionCreateRequest,
  ) => void;
}

export function JourneyCompletionCreateDialog({
  open,
  loading = false,
  onClose,
  onSubmit,
}: JourneyCompletionCreateDialogProps) {
  const [journeyPublicId, setJourneyPublicId] = useState('');
  const [providerPublicId, setProviderPublicId] = useState('');
  const [requiredConfirmations, setRequiredConfirmations] =
    useState('1');

  const confirmations = Number(requiredConfirmations);

  const canSubmit =
    journeyPublicId.trim().length > 0 &&
    providerPublicId.trim().length > 0 &&
    Number.isInteger(confirmations) &&
    confirmations > 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit || loading) return;

    onSubmit({
      journeyPublicId: journeyPublicId.trim(),
      providerPublicId: providerPublicId.trim(),
      requiredConfirmations: confirmations,
    });
  }

  function handleClose() {
    if (loading) return;

    setJourneyPublicId('');
    setProviderPublicId('');
    setRequiredConfirmations('1');
    onClose();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleClose();
      }}
      title="Create journey completion"
      description="Create a completion record for a journey."
      size="md"
      closeOnBackdropClick={!loading}
      closeOnEscape={!loading}
      showCloseButton={!loading}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            size="sm"
            type="submit"
            form="journey-completion-create-form"
            loading={loading}
            disabled={!canSubmit}
          >
            Create completion
          </Button>
        </div>
      }
    >
      <form
        id="journey-completion-create-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <Input
          label="Journey public ID"
          value={journeyPublicId}
          onChange={(event) => setJourneyPublicId(event.target.value)}
          placeholder="Enter journey public ID"
          required
          disabled={loading}
        />

        <Input
          label="Provider public ID"
          value={providerPublicId}
          onChange={(event) => setProviderPublicId(event.target.value)}
          placeholder="Enter provider public ID"
          required
          disabled={loading}
        />

        <Input
          label="Required confirmations"
          inputMode="numeric"
          type="number"
          min={1}
          step={1}
          value={requiredConfirmations}
          onChange={(event) =>
            setRequiredConfirmations(event.target.value)
          }
          required
          disabled={loading}
        />
      </form>
    </Dialog>
  );
}
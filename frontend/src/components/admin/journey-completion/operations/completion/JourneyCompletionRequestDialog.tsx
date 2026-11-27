import { useState } from 'react';

import {
  Button,
  Dialog,
  Input,
} from '@/components/ui';

export interface JourneyCompletionRequest {
  readonly requestedAt?: string;
}

export interface JourneyCompletionRequestDialogProps {
  readonly open: boolean;
  readonly loading?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (request: JourneyCompletionRequest) => void;
}

export function JourneyCompletionRequestDialog({
  open,
  loading = false,
  onClose,
  onSubmit,
}: JourneyCompletionRequestDialogProps) {
  const [requestedAt, setRequestedAt] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    onSubmit(
      requestedAt
        ? { requestedAt: new Date(requestedAt).toISOString() }
        : {},
    );
  }

  function handleClose() {
    if (loading) return;

    setRequestedAt('');
    onClose();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleClose();
      }}
      title="Request journey completion"
      description="Submit a request for this journey to be marked as completed."
      size="sm"
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
            type="submit"
            form="journey-completion-request-form"
            size="sm"
            loading={loading}
          >
            Submit request
          </Button>
        </div>
      }
    >
      <form
        id="journey-completion-request-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <Input
          label="Requested at"
          type="datetime-local"
          value={requestedAt}
          onChange={(event) => setRequestedAt(event.target.value)}
          helperText="Optional. Leave blank to use the server's operation time."
          disabled={loading}
        />
      </form>
    </Dialog>
  );
}